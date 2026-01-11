import ReactMarkdown from 'react-markdown';
import { cn } from "@/lib/utils";
import { Brain, User, FileText, Info } from "lucide-react";
import { useState } from 'react';
import { Button } from './ui/button';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

interface Citation {
  book?: string;
  chapter?: string;
  page?: number;
}

interface MessageBubbleProps {
  role: 'user' | 'assistant';
  content: string;
  citations?: Array<Citation>;
  confidence?: 'low' | 'medium' | 'high';
  ragContext?: string[];
}

function parseRagContext(ragContext?: string[]): Array<{
  book: string;
  chapter: string;
  page: number;
  summary: string;
}> {
  if (!ragContext || ragContext.length === 0) return [];

  return ragContext.map((ctx, index) => {
    // Split header and summary
    const splitIndex = ctx.indexOf(':');
    const header = splitIndex !== -1 ? ctx.slice(0, splitIndex) : ctx;
    const summary = splitIndex !== -1 ? ctx.slice(splitIndex + 1).trim() : '';

    // Extract book
    const bookMatch = header.match(/([\w\-]+\.pdf)/i);
    const book = bookMatch ? bookMatch[1] : `Source ${index + 1}`;

    // Extract chapter (number or letter)
    // Extract chapter ONLY if it is numeric or single-letter
    const chapterMatch = header.match(/Chapter\s+([0-9]+|[A-Z])\b/i);
    const chapter = chapterMatch ? `Chapter ${chapterMatch[1]}` : '';


    // Extract page (handles p129, Page129, Page 129, P.129)
    const pageMatch = header.match(/(?:Page|P\.?|p)\s*(\d+)/i);
    const page = pageMatch ? parseInt(pageMatch[1], 10) : 0;

    return {
      book,
      chapter,
      page,
      summary
    };
  });
}

export function MessageBubble({
  role,
  content,
  citations,
  confidence,
  ragContext
}: MessageBubbleProps) {
  const isAssistant = role === 'assistant';
  const [showExplain, setShowExplain] = useState(false);
  const parsedRagContext = parseRagContext(ragContext);

  const getConfidenceColor = (level?: string) => {
    switch (level) {
      case 'high': return 'bg-emerald-500';
      case 'medium': return 'bg-amber-500';
      case 'low': return 'bg-rose-500';
      default: return 'bg-gray-300';
    }
  };

  const getConfidenceLabel = (level?: string) => {
    switch (level) {
      case 'high': return 'High Confidence';
      case 'medium': return 'Medium Confidence';
      case 'low': return 'Low Confidence - Verify';
      default: return 'Unknown Confidence';
    }
  };

  return (
    <div
      className={cn(
        "flex gap-4 max-w-3xl animate-slide-in",
        isAssistant ? "mr-auto" : "ml-auto flex-row-reverse"
      )}
    >
      {/* Avatar */}
      <div
        className={cn(
          "w-8 h-8 rounded-full flex items-center justify-center shrink-0 shadow-sm",
          isAssistant
            ? "bg-primary text-primary-foreground"
            : "bg-secondary text-secondary-foreground"
        )}
      >
        {isAssistant ? <Brain className="w-5 h-5" /> : <User className="w-5 h-5" />}
      </div>

      {/* Bubble */}
      <div
        className={cn(
          "flex flex-col gap-2 min-w-0 max-w-[85%]",
          isAssistant ? "items-start" : "items-end"
        )}
      >
        {/* Message */}
        <div
          className={cn(
            "px-5 py-4 rounded-2xl shadow-sm text-sm leading-relaxed",
            isAssistant
              ? "bg-white border border-border text-foreground rounded-tl-none"
              : "bg-primary text-primary-foreground rounded-tr-none"
          )}
        >
          {isAssistant ? (
            <div className="prose prose-sm prose-teal max-w-none dark:prose-invert">
              <ReactMarkdown>{content}</ReactMarkdown>
            </div>
          ) : (
            <p>{content}</p>
          )}
        </div>

        {/* Assistant Metadata */}
        {isAssistant && (
          <div className="w-full space-y-3 mt-1">
            {/* Confidence + Explain */}
            <div className="flex flex-wrap items-center gap-2">
              <div className="flex items-center gap-1.5 px-2 py-1 bg-white border border-border rounded-md text-xs font-medium text-muted-foreground shadow-sm">
                <div
                  className={cn(
                    "w-2 h-2 rounded-full",
                    getConfidenceColor(confidence)
                  )}
                />
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

            {/* Citations */}
            {citations && citations.length > 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {citations.map((cite, i) => {
                  const hasValidChapter =
                    cite.chapter && !/unknown/i.test(cite.chapter);

                  return (
                    <div
                      key={i}
                      className="p-2 bg-secondary/30 rounded-lg border border-border/50 text-xs"
                    >
                      {/* Book name ALWAYS */}
                      <p className="font-semibold text-primary truncate">
                        {cite.book}
                      </p>

                      <p className="text-muted-foreground truncate">
                        {cite.chapter && !/unknown/i.test(cite.chapter)
                          ? `${cite.chapter} • Page ${cite.page}`
                          : `Chapter unavailable • Page ${cite.page}`}
                      </p>

                    </div>
                  );
                })}
              </div>
            )}

            {/* Retrieved Context - FIXED PARSING */}
            {parsedRagContext.length > 0 && (
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="context" className="border-none">
                  <AccordionTrigger className="py-1 text-xs text-muted-foreground hover:text-primary hover:no-underline">
                    <div className="flex items-center gap-2">
                      <FileText className="w-3 h-3" />
                      View Retrieved Evidence ({parsedRagContext.length})
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="mt-2 space-y-3">
                      {parsedRagContext.map((ctx, i) => (
                        <div
                          key={i}
                          className="p-3 bg-muted/30 rounded-md border border-border text-xs"
                        >
                          <p className="font-medium text-primary mb-1 truncate">
                            {ctx.book}
                            {ctx.chapter && ` • ${ctx.chapter}`}
                            {` • Page ${ctx.page}`}
                          </p>

                          <p className="text-muted-foreground leading-relaxed text-xs">
                            {ctx.summary}
                          </p>
                        </div>
                      ))}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            )}

            {/* Explainability */}
            {showExplain && (
              <div className="p-3 bg-blue-50/50 border border-blue-100 rounded-lg text-xs text-muted-foreground animate-slide-in">
                <p className="font-medium text-blue-800 mb-1">Explainability Logic</p>
                <p>
                  The model retrieved {parsedRagContext.length} clinically relevant passages from
                  authoritative medical texts. The answer was synthesized strictly from this evidence.
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
