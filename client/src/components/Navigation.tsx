import { 
  Brain, 
  MessageSquare, 
  FileText, 
  ShieldCheck, 
  Lock,
  CheckCircle2
} from "lucide-react";
import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";

export function Navigation({ className }: { className?: string }) {
  const [location] = useLocation();

  const navItems = [
    { label: "Chat Session", icon: MessageSquare, href: "/" },
    { label: "Retrieved Context", icon: FileText, href: "/context" },
    { label: "Privacy & Model", icon: ShieldCheck, href: "/privacy" },
  ];

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

      <nav className="flex-1 px-3 py-4 space-y-1">
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
      </nav>

      <div className="p-4 mt-auto">
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
