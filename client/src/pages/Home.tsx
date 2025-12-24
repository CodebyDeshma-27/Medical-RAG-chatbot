import { useState, useRef, useEffect } from "react";
import { useChat, useHospitals } from "@/hooks/use-medcite";
import { Navigation } from "@/components/Navigation";
import { MessageBubble } from "@/components/MessageBubble";
import { HospitalCard } from "@/components/HospitalCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { 
  Send, 
  Target, 
  MapPin, 
  Loader2, 
  Plus,
  PanelLeftClose,
  PanelLeftOpen
} from "lucide-react";
import { cn } from "@/lib/utils";

// Types for local state
type Message = {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  citations?: Array<{source: string, page: string, text: string}>;
  confidence?: 'low' | 'medium' | 'high';
  ragContext?: string[];
};

export default function Home() {
  const [messages, setMessages] = useState<Message[]>([
    { 
      id: 'welcome', 
      role: 'assistant', 
      content: "Hello. I am MedCite, your medical research assistant. I can help you find clinical guidelines, drug interactions, and hospital protocols. How can I assist you today?" 
    }
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [showHospitals, setShowHospitals] = useState(false);
  
  const scrollRef = useRef<HTMLDivElement>(null);
  const chatMutation = useChat();
  const { data: hospitals, isLoading: isLoadingHospitals } = useHospitals(showHospitals);

  // Auto-scroll to bottom
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = () => {
    if (!inputValue.trim()) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: inputValue
    };

    setMessages(prev => [...prev, userMsg]);
    setInputValue("");

    chatMutation.mutate(inputValue, {
      onSuccess: (data) => {
        const assistantMsg: Message = {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: data.message,
          citations: data.citations,
          confidence: data.confidence,
          ragContext: data.ragContext
        };
        setMessages(prev => [...prev, assistantMsg]);
      },
      onError: () => {
        const errorMsg: Message = {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: "I apologize, but I encountered an error accessing the medical database. Please try again or rephrase your query.",
          confidence: 'low'
        };
        setMessages(prev => [...prev, errorMsg]);
      }
    });
  };

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      {/* Sidebar */}
      <aside 
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-64 transform transition-transform duration-300 ease-in-out lg:relative lg:translate-x-0 border-r bg-white",
          !isSidebarOpen && "-translate-x-full lg:hidden"
        )}
      >
        <Navigation />
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 relative">
        {/* Header */}
        <header className="h-16 border-b border-border bg-white/80 backdrop-blur-sm flex items-center justify-between px-6 shrink-0 z-10 sticky top-0">
          <div className="flex items-center gap-4">
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="text-muted-foreground hover:text-primary"
            >
              {isSidebarOpen ? <PanelLeftClose className="w-5 h-5" /> : <PanelLeftOpen className="w-5 h-5" />}
            </Button>
            <h2 className="font-display font-semibold text-lg">New Research Session</h2>
          </div>
          
          <div className="flex items-center gap-2">
            <Button 
              variant={showHospitals ? "default" : "outline"}
              size="sm"
              onClick={() => setShowHospitals(!showHospitals)}
              className={cn("gap-2", showHospitals && "bg-primary text-primary-foreground")}
            >
              <MapPin className="w-4 h-4" />
              {showHospitals ? "Hide Nearby Hospitals" : "Find Hospitals"}
            </Button>
            <Button variant="ghost" size="icon" className="text-muted-foreground">
              <Target className="w-5 h-5" />
            </Button>
          </div>
        </header>

        {/* Chat Area */}
        <div 
          className="flex-1 overflow-y-auto p-4 md:p-6 space-y-8 scroll-smooth medical-scroll"
          ref={scrollRef}
        >
          {showHospitals && (
            <div className="mb-6 animate-slide-in">
              <div className="bg-secondary/30 rounded-2xl p-6 border border-border">
                <h3 className="font-display font-semibold text-lg mb-4 flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-primary" />
                  Nearby Medical Facilities
                </h3>
                
                {isLoadingHospitals ? (
                  <div className="flex justify-center py-8 text-primary">
                    <Loader2 className="w-8 h-8 animate-spin" />
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {hospitals?.map(hospital => (
                      <HospitalCard key={hospital.id} hospital={hospital} />
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {messages.map((msg) => (
            <MessageBubble 
              key={msg.id}
              role={msg.role}
              content={msg.content}
              citations={msg.citations}
              confidence={msg.confidence}
              ragContext={msg.ragContext}
            />
          ))}

          {chatMutation.isPending && (
             <div className="flex gap-4 max-w-3xl mr-auto animate-pulse">
               <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                 <Loader2 className="w-4 h-4 text-primary animate-spin" />
               </div>
               <div className="bg-white border border-border px-5 py-4 rounded-2xl rounded-tl-none shadow-sm text-sm text-muted-foreground">
                 Analyzing medical database...
               </div>
             </div>
          )}
        </div>

        {/* Input Area */}
        <div className="p-4 bg-white/50 backdrop-blur-sm border-t border-border">
          <div className="max-w-4xl mx-auto flex gap-3 relative">
            <Button 
              size="icon" 
              variant="outline" 
              className="shrink-0 rounded-full h-11 w-11 border-dashed border-2 hover:border-primary hover:text-primary transition-colors"
            >
              <Plus className="w-5 h-5" />
            </Button>
            
            <div className="flex-1 relative">
              <Input
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Ask a medical question (e.g., 'What are the updated guidelines for treating sepsis?')"
                className="h-11 pr-12 rounded-full border-muted-foreground/20 focus-visible:ring-primary shadow-sm pl-6"
                disabled={chatMutation.isPending}
              />
              <div className="absolute right-1 top-1">
                 <Button 
                   size="icon" 
                   className="h-9 w-9 rounded-full bg-primary hover:bg-primary/90 transition-all"
                   onClick={handleSend}
                   disabled={!inputValue.trim() || chatMutation.isPending}
                 >
                   <Send className="w-4 h-4 text-white" />
                 </Button>
              </div>
            </div>
          </div>
          <div className="text-center mt-2">
             <p className="text-[10px] text-muted-foreground">
               AI-generated content. Always verify with primary clinical sources.
             </p>
          </div>
        </div>
      </main>
    </div>
  );
}
