import { Trash2, Archive, MoreVertical } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

interface ChatSession {
  id: string;
  title: string;
  date: string;
  archived?: boolean;
}

interface ChatHistoryProps {
  sessions?: ChatSession[];
  onDelete?: (id: string) => void;
  onArchive?: (id: string) => void;
}

export function ChatHistory({ 
  sessions = [
    { id: "1", title: "Sepsis Treatment Guidelines", date: "Today" },
    { id: "2", title: "Drug Interaction Query", date: "Yesterday" },
    { id: "3", title: "Hospital Protocol Review", date: "2 days ago" },
  ],
  onDelete,
  onArchive,
}: ChatHistoryProps) {
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);

  return (
    <div className="space-y-2">
      <p className="text-xs font-semibold uppercase text-muted-foreground px-3 py-2">Chat History</p>
      {sessions.map((session) => (
        <div
          key={session.id}
          className={cn(
            "mx-2 p-3 rounded-lg hover:bg-secondary/50 group transition-colors cursor-pointer relative",
            session.archived && "opacity-60"
          )}
        >
          <div className="flex items-start justify-between gap-2">
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-foreground truncate">{session.title}</p>
              <p className="text-xs text-muted-foreground">{session.date}</p>
            </div>

            <div className="relative">
              <button
                onClick={() => setOpenMenu(openMenu === session.id ? null : session.id)}
                className="opacity-0 group-hover:opacity-100 p-1 hover:bg-secondary rounded transition-all"
                data-testid={`button-menu-${session.id}`}
              >
                <MoreVertical className="w-4 h-4 text-muted-foreground" />
              </button>

              {openMenu === session.id && !confirmDelete && (
                <div className="absolute right-0 top-8 bg-white border border-border rounded-lg shadow-lg z-50 w-40">
                  <button
                    onClick={() => {
                      onArchive?.(session.id);
                      setOpenMenu(null);
                    }}
                    className="w-full flex items-center gap-2 px-3 py-2 text-sm hover:bg-secondary/50 text-foreground"
                    data-testid={`button-archive-${session.id}`}
                  >
                    <Archive className="w-4 h-4" />
                    Archive
                  </button>
                  <button
                    onClick={() => setConfirmDelete(session.id)}
                    className="w-full flex items-center gap-2 px-3 py-2 text-sm hover:bg-red-50 text-red-600 rounded-b-lg"
                    data-testid={`button-delete-${session.id}`}
                  >
                    <Trash2 className="w-4 h-4" />
                    Delete
                  </button>
                </div>
              )}

              {confirmDelete === session.id && (
                <div className="absolute right-0 top-8 bg-white border border-red-200 rounded-lg shadow-lg z-50 w-48 p-3">
                  <p className="text-sm font-medium text-foreground mb-3">Delete this chat?</p>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setConfirmDelete(null)}
                      className="flex-1 px-2 py-1.5 text-xs border border-border rounded hover:bg-secondary/50 text-foreground"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={() => {
                        onDelete?.(session.id);
                        setConfirmDelete(null);
                        setOpenMenu(null);
                      }}
                      className="flex-1 px-2 py-1.5 text-xs bg-red-600 text-white rounded hover:bg-red-700"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
