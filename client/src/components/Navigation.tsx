import { 
  Brain, 
  MessageSquare, 
  FileText, 
  ShieldCheck, 
  Lock,
  CheckCircle2,
  Settings,
  LogOut,
  Plus
} from "lucide-react";
import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";
import { Button } from "./ui/button";
import { ChatHistory } from "./ChatHistory";
import { useState } from "react";

interface NavigationProps {
  className?: string;
  onNewChat?: () => void;
}

export function Navigation({ className, onNewChat }: NavigationProps) {
  const [location] = useLocation();
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [chatSessions, setChatSessions] = useState([
    { id: "1", title: "Sepsis Treatment Guidelines", date: "Today" },
    { id: "2", title: "Drug Interaction Query", date: "Yesterday" },
    { id: "3", title: "Hospital Protocol Review", date: "2 days ago" },
  ]);

  const navItems = [
    { label: "Chat Session", icon: MessageSquare, href: "/" },
    { label: "Retrieved Context", icon: FileText, href: "/context" },
    { label: "Privacy & Model", icon: ShieldCheck, href: "/privacy" },
  ];

  const handleDeleteChat = (id: string) => {
    setChatSessions(prev => prev.filter(s => s.id !== id));
  };

  const handleArchiveChat = (id: string) => {
    setChatSessions(prev => prev.map(s => 
      s.id === id ? { ...s, archived: !s.archived } : s
    ));
  };

  return (
    <div className={cn("flex flex-col h-full bg-card border-r border-border", className)}>
      <div className="p-6">
        <div className="flex items-center gap-3">
          <div className="bg-primary/10 p-2 rounded-xl text-primary">
            <Brain className="w-6 h-6" />
          </div>
          <div>
            <h1 className="font-display font-bold text-lg leading-tight text-foreground">MedCite</h1>
            <div className="flex items-center gap-1 text-xs text-primary font-medium">
              <CheckCircle2 className="w-3 h-3" />
              <span>HIPAA Compliant</span>
            </div>
          </div>
        </div>
      </div>

      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const isActive = location === item.href;
          return (
            <Link 
              key={item.href} 
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 group",
                isActive 
                  ? "bg-primary text-primary-foreground shadow-md shadow-primary/20" 
                  : "text-muted-foreground hover:bg-secondary hover:text-foreground"
              )}
            >
              <item.icon className={cn("w-4 h-4", isActive ? "text-primary-foreground" : "text-muted-foreground group-hover:text-foreground")} />
              {item.label}
            </Link>
          );
        })}

        {/* Chat History Section */}
        <div className="mt-6 border-t border-border/50 pt-4">
          <ChatHistory 
            sessions={chatSessions.filter(s => !s.archived)}
            onDelete={handleDeleteChat}
            onArchive={handleArchiveChat}
          />
        </div>
      </nav>

      <div className="px-3 py-3 space-y-3 mt-auto">
        <Button 
          onClick={onNewChat}
          className="w-full gap-2 bg-primary text-primary-foreground hover:bg-primary/90" 
          size="sm"
          data-testid="button-new-chat"
        >
          <Plus className="w-4 h-4" />
          New Chat
        </Button>

        <div className="relative">
          <button
            onClick={() => setShowProfileMenu(!showProfileMenu)}
            className="w-full flex items-center gap-3 px-3 py-3 rounded-lg bg-secondary/50 border border-border/50 hover:bg-secondary/80 transition-colors text-left"
          >
            <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-semibold">
              DR
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-foreground">Dr. Research</p>
              <p className="text-xs text-muted-foreground">Medical Researcher</p>
            </div>
          </button>

          {showProfileMenu && (
            <div className="absolute bottom-full left-0 right-0 mb-2 bg-white border border-border rounded-lg shadow-lg z-50">
              <Link href="/settings">
                <button className="w-full flex items-center gap-2 px-4 py-2 text-sm text-foreground hover:bg-secondary/50 first:rounded-t-lg"
                  data-testid="button-settings"
                >
                  <Settings className="w-4 h-4" />
                  Settings
                </button>
              </Link>
              <button className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 last:rounded-b-lg"
                data-testid="button-logout"
              >
                <LogOut className="w-4 h-4" />
                Log out
              </button>
            </div>
          )}
        </div>

        <div className="bg-secondary/50 rounded-xl p-4 border border-border/50">
          <div className="flex items-center gap-3 text-muted-foreground">
            <Lock className="w-4 h-4" />
            <div className="flex flex-col">
              <span className="text-xs font-semibold uppercase tracking-wider text-foreground">Session Secure</span>
              <span className="text-[10px]">Local processing active</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
