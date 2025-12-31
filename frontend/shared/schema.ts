import { pgTable, text, serial, timestamp, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// === TABLE DEFINITIONS ===
// We use a simple message store for the current session
export const messages = pgTable("messages", {
  id: serial("id").primaryKey(),
  role: text("role").notNull(), // 'user' or 'assistant'
  content: text("content").notNull(),
  // JSONB columns for rich data (citations, context)
  citations: jsonb("citations").$type<Array<{source: string, page: string, text: string}>>(),
  confidence: text("confidence"), // 'low', 'medium', 'high'
  ragContext: jsonb("rag_context").$type<string[]>(),
  timestamp: timestamp("timestamp").defaultNow(),
});

// === BASE SCHEMAS ===
export const insertMessageSchema = createInsertSchema(messages).omit({ id: true, timestamp: true });

// === EXPLICIT API CONTRACT TYPES ===
export type Message = typeof messages.$inferSelect;
export type InsertMessage = z.infer<typeof insertMessageSchema>;

export type Hospital = {
  id: number;
  name: string;
  distance: string;
  rating: number;
  address: string;
};

// Request types
export type ChatRequest = { query: string };

// Response types
export type ChatResponse = {
  message: string;
  citations: Array<{source: string, page: string, text: string}>;
  confidence: 'low' | 'medium' | 'high';
  ragContext: string[];
};

export type HospitalsResponse = Hospital[];
