import type { Express } from "express";
import type { Server } from "http";
import axios from "axios";
import { api } from "@shared/routes";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {

  /* ============================
     FILE UPLOAD
  ============================ */
  app.post(api.files.upload.path, async (req, res) => {
    try {
      if (!req.files || Object.keys(req.files).length === 0) {
        return res.status(400).json({ message: "No files uploaded" });
      }

      const uploadedFiles: string[] = [];

      for (const key in req.files) {
        const file = Array.isArray(req.files[key])
          ? req.files[key][0]
          : req.files[key];

        if (file.mimetype === "application/pdf" || file.name.endsWith(".pdf")) {
          uploadedFiles.push(file.name);
        }
      }

      if (uploadedFiles.length === 0) {
        return res.status(400).json({ message: "No valid PDF files found" });
      }

      res.json({
        files: uploadedFiles,
        message: `Successfully uploaded ${uploadedFiles.length} file(s)`,
      });
    } catch (err) {
      res.status(500).json({ message: "File upload failed" });
    }
  });

  /* ============================
     NEARBY HOSPITALS (GOOGLE)
  ============================ */
  app.get(api.hospitals.list.path, async (req, res) => {
    try {
      console.log("📍 Query params:", req.query);

      const lat = Number(req.query.lat);
      const lng = Number(req.query.lng);

      if (isNaN(lat) || isNaN(lng)) {
        return res.json([]);
      }
      console.log("🔑 Google key:", process.env.GOOGLE_MAPS_KEY);
      const googleRes = await axios.get(
        "https://maps.googleapis.com/maps/api/place/nearbysearch/json",
        {
          params: {
            location: `${lat},${lng}`,
            radius: 5000,
            type: "hospital",
            key: process.env.GOOGLE_MAPS_KEY,
          },
        }
      );
      
      const hospitals = googleRes.data.results.map(
        (place: any, i: number) => ({
          id: i + 1,
          name: place.name,
          rating: place.rating ?? 4.0,
          address: place.vicinity,
          distance: "Nearby",
          lat: place.geometry.location.lat,
          lng: place.geometry.location.lng,
        })
      );

      res.json(hospitals);
    } catch (error) {
      console.error("❌ Google Places error:", error);
      res.status(500).json({ message: "Failed to fetch nearby hospitals" });
    }
  });

  /* ============================
     CHAT → EXPRESS → FLASK
  ============================ */
  app.post(api.chat.send.path, async (req, res) => {
    try {
      const input = api.chat.send.input.parse(req.body);

      const flaskResponse = await axios.post(
        "http://127.0.0.1:8000/ask",
        { query: input.query }
      );

      res.json({
        message: flaskResponse.data.answer,
        citations: flaskResponse.data.sources ?? [],
        ragContext: flaskResponse.data.ragContext ?? [],
        confidence: "high",
      });
    } catch (error: any) {
      console.error("❌ Flask error:", error.message);
      res.status(500).json({
        message: "Failed to fetch response from AI service",
      });
    }
  });

  return httpServer;
}
