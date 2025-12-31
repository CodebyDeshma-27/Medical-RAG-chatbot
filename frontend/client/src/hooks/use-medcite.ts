import { useMutation, useQuery } from "@tanstack/react-query";
import { api } from "@shared/routes";
import { z } from "zod";

/* ===============================
   LOCAL RESPONSE SCHEMA
   (matches Express output exactly)
================================ */
const ChatResponseSchema = z.object({
  message: z.string(),
  citations: z.array(
    z.object({
      source: z.string().optional(),
      page: z.string().optional(),
      text: z.string().optional(),
    })
  ).optional(),
  confidence: z.enum(["low", "medium", "high"]).optional(),
  ragContext: z.array(z.string()).optional(),
});

// --- Chat Hook ---
export function useChat() {
  return useMutation({
    mutationFn: async (query: string) => {
      // ✅ validate request
      const validatedInput = api.chat.send.input.parse({ query });

      const res = await fetch(api.chat.send.path, {
        method: api.chat.send.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(validatedInput),
        credentials: "include",
      });

      if (!res.ok) {
        throw new Error("Failed to fetch AI response");
      }

      const json = await res.json();

      // 🔑 THIS is the critical fix
      return ChatResponseSchema.parse(json);
    },
  });
}

/* ===============================
   Hospital Hook (unchanged)
================================ */
export function useHospitals(
  enabled: boolean,
  location?: { lat: number; lng: number }
) {
  return useQuery({
    queryKey: ["nearby-hospitals", location],
    queryFn: async () => {
      if (!location) {
        throw new Error("Location missing");
      }

      const params = new URLSearchParams({
        lat: location.lat.toString(),
        lng: location.lng.toString(),
      });

      const res = await fetch(`/api/nearby-hospitals?${params}`);

      if (!res.ok) {
        throw new Error("Failed to fetch hospitals");
      }

      return res.json();
    },
    enabled: enabled && !!location, // 🔑 THIS LINE IS EVERYTHING
  });
}
