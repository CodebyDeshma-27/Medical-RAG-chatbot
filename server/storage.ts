import { db } from "./db";
import {
  messages,
  type InsertMessage,
  type Message
} from "@shared/schema";
import { eq } from "drizzle-orm";

export interface IStorage {
  // We'll treat this as a session store
  createMessage(message: InsertMessage): Promise<Message>;
  getMessages(): Promise<Message[]>;
}

export class MemStorage implements IStorage {
  private messages: Message[];
  private currentId: number;

  constructor() {
    this.messages = [];
    this.currentId = 1;
  }

  async createMessage(insertMessage: InsertMessage): Promise<Message> {
    const message: Message = {
      ...insertMessage,
      id: this.currentId++,
      timestamp: new Date(),
      citations: insertMessage.citations || null,
      confidence: insertMessage.confidence || null,
      ragContext: insertMessage.ragContext || null
    };
    this.messages.push(message);
    return message;
  }

  async getMessages(): Promise<Message[]> {
    return this.messages;
  }
}

export const storage = new MemStorage();
