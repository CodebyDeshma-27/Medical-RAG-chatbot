import { useState } from "react";
import { X, Settings, Bell, Palette, Lock, Users, Shield, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { cn } from "@/lib/utils";

const settingsSections = [
  { id: "general", label: "General", icon: Settings },
  { id: "notifications", label: "Notifications", icon: Bell },
  { id: "personalization", label: "Personalization", icon: Palette },
  { id: "security", label: "Security", icon: Lock },
  { id: "account", label: "Account", icon: User },
];

export default function SettingsPage() {
  const [activeSection, setActiveSection] = useState("general");

  const renderContent = () => {
    switch (activeSection) {
      case "general":
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-foreground mb-4">General</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center py-3 border-b border-border">
                  <div>
                    <p className="font-medium text-foreground">Appearance</p>
                    <p className="text-sm text-muted-foreground">Choose your theme</p>
                  </div>
                  <select className="px-3 py-2 rounded-lg border border-border bg-background text-foreground text-sm">
                    <option>System</option>
                    <option>Light</option>
                    <option>Dark</option>
                  </select>
                </div>
                <div className="flex justify-between items-center py-3 border-b border-border">
                  <div>
                    <p className="font-medium text-foreground">Language</p>
                    <p className="text-sm text-muted-foreground">Select your language</p>
                  </div>
                  <select className="px-3 py-2 rounded-lg border border-border bg-background text-foreground text-sm">
                    <option>Auto-detect</option>
                    <option>English</option>
                    <option>Spanish</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        );
      case "notifications":
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-foreground">Notifications</h3>
            <div className="space-y-4">
              <label className="flex items-center gap-3 py-3 border-b border-border cursor-pointer">
                <input type="checkbox" defaultChecked className="w-4 h-4" />
                <div>
                  <p className="font-medium text-foreground">Email notifications</p>
                  <p className="text-sm text-muted-foreground">Get updates via email</p>
                </div>
              </label>
              <label className="flex items-center gap-3 py-3 border-b border-border cursor-pointer">
                <input type="checkbox" className="w-4 h-4" />
                <div>
                  <p className="font-medium text-foreground">Browser notifications</p>
                  <p className="text-sm text-muted-foreground">Push notifications</p>
                </div>
              </label>
            </div>
          </div>
        );
      case "personalization":
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-foreground">Personalization</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center py-3 border-b border-border">
                <div>
                  <p className="font-medium text-foreground">Accent Color</p>
                  <p className="text-sm text-muted-foreground">Customize your color scheme</p>
                </div>
                <select className="px-3 py-2 rounded-lg border border-border bg-background text-foreground text-sm">
                  <option>Default (Teal)</option>
                  <option>Blue</option>
                  <option>Green</option>
                </select>
              </div>
            </div>
          </div>
        );
      case "security":
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-foreground">Security</h3>
            <div className="space-y-4">
              <div className="py-3 border-b border-border">
                <p className="font-medium text-foreground mb-2">Change Password</p>
                <Button variant="outline" size="sm">Update Password</Button>
              </div>
              <div className="py-3 border-b border-border">
                <p className="font-medium text-foreground mb-2">Two-Factor Authentication</p>
                <p className="text-sm text-muted-foreground mb-2">Secure your account with 2FA</p>
                <Button variant="outline" size="sm">Enable 2FA</Button>
              </div>
            </div>
          </div>
        );
      case "account":
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-foreground">Account</h3>
            <div className="space-y-4">
              <div className="py-3 border-b border-border">
                <p className="font-medium text-foreground mb-2">Email</p>
                <p className="text-muted-foreground">dr.research@medcite.com</p>
              </div>
              <div className="py-3 border-b border-border">
                <p className="font-medium text-foreground mb-2">Professional License</p>
                <p className="text-muted-foreground">MD-12345678</p>
              </div>
              <div className="pt-3">
                <Button variant="destructive" size="sm">Delete Account</Button>
              </div>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar */}
      <div className="w-52 bg-secondary/30 border-r border-border p-4 overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-foreground">Settings</h2>
          <Link href="/">
            <Button size="icon" variant="ghost">
              <X className="w-4 h-4" />
            </Button>
          </Link>
        </div>

        <nav className="space-y-2">
          {settingsSections.map((section) => {
            const Icon = section.icon;
            return (
              <button
                key={section.id}
                onClick={() => setActiveSection(section.id)}
                className={cn(
                  "w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all text-left",
                  activeSection === section.id
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                )}
              >
                <Icon className="w-4 h-4" />
                {section.label}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-2xl mx-auto p-8">
          {renderContent()}
        </div>
      </div>
    </div>
  );
}
