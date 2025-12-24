import { useMutation, useQuery } from "@tanstack/react-query";
import { api } from "@shared/routes";
import { z } from "zod";

// --- Chat Hooks ---

export function useChat() {
  return useMutation({
    mutationFn: async (query: string) => {
      // Validate input using the shared schema if possible, or simple check
      const validatedInput = api.chat.send.input.parse({ query });
      
      const res = await fetch(api.chat.send.path, {
        method: api.chat.send.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(validatedInput),
        credentials: "include",
      });

      if (!res.ok) {
        if (res.status === 500) {
           // Try to parse structured error
           try {
             const error = api.chat.send.responses[500].parse(await res.json());
             throw new Error(error.message);
           } catch {
             throw new Error("An internal server error occurred.");
           }
        }
        throw new Error("Failed to send message");
      }

      // Parse success response
      return api.chat.send.responses[200].parse(await res.json());
    },
  });
}

// --- Hospital Hooks ---

export function useHospitals(enabled: boolean = false) {
  return useQuery({
    queryKey: [api.hospitals.list.path],
    queryFn: async () => {
      const res = await fetch(api.hospitals.list.path, { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch hospitals");
      return api.hospitals.list.responses[200].parse(await res.json());
    },
    enabled: enabled, // Only fetch when toggled on
  });
}
