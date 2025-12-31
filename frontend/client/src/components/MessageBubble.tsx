import ReactMarkdown from 'react-markdown';
import { cn } from "@/lib/utils";
import { Brain, User, BarChart, FileText, Info } from "lucide-react";
import { useState } from 'react';
import { Button } from './ui/button';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

interface MessageBubbleProps {
  role: 'user' | 'assistant';
  content: string;
  citations?: Array<{
    source: string;
    page: string;
    text: string;
  }>;
  confidence?: 'low' | 'medium' | 'high';
  ragContext?: string[];
}


export function MessageBubble({ role, content, citations, confidence, ragContext }: MessageBubbleProps) {
  const isAssistant = role === 'assistant';
  const [showExplain, setShowExplain] = useState(false);

  const getConfidenceColor = (level?: string) => {
    switch(level) {
      case 'high': return 'bg-emerald-500';
      case 'medium': return 'bg-amber-500';
      case 'low': return 'bg-rose-500';
      default: return 'bg-gray-300';
    }
  };

  const getConfidenceLabel = (level?: string) => {
    switch(level) {
      case 'high': return 'High Confidence';
      case 'medium': return 'Medium Confidence';
      case 'low': return 'Low Confidence - Verify';
      default: return 'Unknown Confidence';
    }
  };

  return (
    <div className={cn(
      "flex gap-4 max-w-3xl animate-slide-in",
      isAssistant ? "mr-auto" : "ml-auto flex-row-reverse"
    )}>
      <div className={cn(
        "w-8 h-8 rounded-full flex items-center justify-center shrink-0 shadow-sm",
        isAssistant ? "bg-primary text-primary-foreground" : "bg-secondary text-secondary-foreground"
      )}>
        {isAssistant ? <Brain className="w-5 h-5" /> : <User className="w-5 h-5" />}
      </div>

      <div className={cn(
        "flex flex-col gap-2 min-w-0 max-w-[85%]",
        isAssistant ? "items-start" : "items-end"
      )}>
        <div className={cn(
          "px-5 py-4 rounded-2xl shadow-sm text-sm leading-relaxed",
          isAssistant 
            ? "bg-white border border-border text-foreground rounded-tl-none" 
            : "bg-primary text-primary-foreground rounded-tr-none"
        )}>
          {isAssistant ? (
            <div className="prose prose-sm prose-teal max-w-none dark:prose-invert">
              <ReactMarkdown>{content}</ReactMarkdown>
            </div>
          ) : (
            <p>{content}</p>
          )}
        </div>

        {isAssistant && (
          <div className="w-full space-y-3 mt-1">
            {/* Metadata Bar */}
            <div className="flex flex-wrap items-center gap-2">
              <div className="flex items-center gap-1.5 px-2 py-1 bg-white border border-border rounded-md text-xs font-medium text-muted-foreground shadow-sm">
                <div className={cn("w-2 h-2 rounded-full", getConfidenceColor(confidence))} />
                {getConfidenceLabel(confidence)}
              </div>
              
              <Button 
                variant="ghost" 
                size="sm" 
                className="h-6 text-xs text-muted-foreground hover:text-primary"
                onClick={() => setShowExplain(!showExplain)}
              >
                <Info className="w-3 h-3 mr-1.5" />
                Why this answer?
              </Button>
            </div>

            {/* Citations Grid */}
            {citations && citations.length > 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {citations.map((cite, i) => (
                  <div key={i} className="flex flex-col p-2 bg-secondary/30 rounded-lg border border-border/50 text-xs hover:bg-secondary/50 transition-colors cursor-pointer group">
                    <span className="font-semibold text-primary group-hover:underline truncate">{cite.source}</span>
                    <span className="text-muted-foreground truncate">Page {cite.page} • "{cite.text.substring(0, 40)}..."</span>
                  </div>
                ))}
              </div>
            )}

            {/* Expandable Context */}
            {ragContext && ragContext.length > 0 && (
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="context" className="border-none">
                  <AccordionTrigger className="py-1 text-xs text-muted-foreground hover:text-primary hover:no-underline data-[state=open]:text-primary">
                    <div className="flex items-center gap-2">
                      <FileText className="w-3 h-3" />
                      View Retrieved Context ({ragContext.length} chunks)
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="mt-2 space-y-2">
                      {ragContext.map((ctx, i) => (
                        <div key={i} className="p-3 bg-muted/30 rounded-md border border-border text-xs font-mono text-muted-foreground">
                          {ctx}
                        </div>
                      ))}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            )}
            
            {showExplain && (
              <div className="p-3 bg-blue-50/50 dark:bg-blue-900/10 border border-blue-100 dark:border-blue-900/30 rounded-lg text-xs text-muted-foreground animate-slide-in">
                <p className="font-medium text-blue-800 dark:text-blue-300 mb-1">Explainability Logic:</p>
                <p>The model retrieved {ragContext?.length || 0} relevant snippets from the medical database. It prioritized sources with recent dates and high relevance scores. The answer synthesized these findings while filtering out low-confidence matches.</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
