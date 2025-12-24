import type { Express } from "express";
import type { Server } from "http";
import { storage } from "./storage";
import { api } from "@shared/routes";
import { z } from "zod";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {

  // Mock Hospital Data
  app.get(api.hospitals.list.path, (_req, res) => {
    res.json([
      {
        id: 1,
        name: "General Medical Center",
        distance: "0.8 miles",
        rating: 4.8,
        address: "123 Healthcare Blvd"
      },
      {
        id: 2,
        name: "City Research Hospital",
        distance: "2.4 miles",
        rating: 4.6,
        address: "450 Science Way"
      },
      {
        id: 3,
        name: "Community Health Clinic",
        distance: "3.1 miles",
        rating: 4.2,
        address: "789 Local Lane"
      }
    ]);
  });

  // Mock Chat Query
  app.post(api.chat.send.path, async (req, res) => {
    try {
      const input = api.chat.send.input.parse(req.body);
      
      // Simulate processing delay
      await new Promise(resolve => setTimeout(resolve, 1500));

      const response = {
        message: `Based on the clinical guidelines and retrieved documents, here is an analysis regarding "${input.query}". \n\nThe condition appears to be consistent with standard presentation. Treatment typically involves a conservative approach initially, monitoring for progression.\n\n### Key Considerations\n\n1. **Symptom Management**: Focus on relief of acute symptoms.\n2. **Monitoring**: Regular follow-up is recommended to assess response to therapy.\n\nPlease consult with a specialist for a definitive diagnosis.`,
        citations: [
          { source: "Clinical_Guidelines_2024.pdf", page: "p. 42", text: "Conservative management is the first line of defense..." },
          { source: "Journal_of_Medicine_v12.pdf", page: "Section 3.1", text: "Patients showing these symptoms typically respond well to..." }
        ],
        confidence: "high" as const,
        ragContext: [
          "Chunk 1: ...conservative management is recommended for initial presentation...",
          "Chunk 2: ...study showed 85% improvement with standard protocol...",
          "Chunk 3: ...monitor vital signs every 4 hours..."
        ]
      };

      res.json(response);
    } catch (err) {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  return httpServer;
}
