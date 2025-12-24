import type { Express } from "express";
import type { Server } from "http";
import { storage } from "./storage";
import { api } from "@shared/routes";
import { z } from "zod";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {

  // File Upload Endpoint
  app.post(api.files.upload.path, async (req, res) => {
    try {
      // Check if files were uploaded
      if (!req.files || Object.keys(req.files).length === 0) {
        return res.status(400).json({ message: "No files uploaded" });
      }

      const uploadedFiles: string[] = [];
      
      // Process uploaded files
      for (const key in req.files) {
        const file = Array.isArray(req.files[key]) ? req.files[key][0] : req.files[key];
        
        // Validate PDF type
        if (file.mimetype === 'application/pdf' || file.name.endsWith('.pdf')) {
          // In production, you'd save to disk/cloud storage
          // For now, we'll just track the filename
          uploadedFiles.push(file.name);
        }
      }

      if (uploadedFiles.length === 0) {
        return res.status(400).json({ message: "No valid PDF files found" });
      }

      res.json({
        files: uploadedFiles,
        message: `Successfully uploaded ${uploadedFiles.length} file(s)`
      });
    } catch (err) {
      res.status(500).json({ message: "File upload failed" });
    }
  });

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

      // Provide contextual responses based on query keywords
      let message = "";
      let citations = [];
      let ragContext = [];

      const query = input.query.toLowerCase();

      if (query.includes("sepsis") || query.includes("infection")) {
        message = `## Sepsis Management Protocol

Based on the 2023 Surviving Sepsis Campaign guidelines, here are the key management strategies:

### Initial Recognition (First Hour)
- **Blood cultures** before antibiotics
- **Lactate** measurement for severity assessment
- **Broad-spectrum antibiotics** within 1 hour for septic shock, 3 hours for sepsis

### Hemodynamic Management
- **Fluid resuscitation**: 30 mL/kg crystalloid for hypotension or lactate ≥4
- **Vasopressors**: Target MAP ≥65 mmHg (norepinephrine first-line)
- **Source control** within 12 hours where feasible

### Supportive Care
- Organ dysfunction monitoring
- Mechanical ventilation if ARDS develops
- Glucose control (target <180 mg/dL)
- Stress ulcer prophylaxis in ICU patients

**Note**: This is guideline-based information. Individual patient management should be tailored by the clinical team.`;

        citations = [
          { source: "Surviving_Sepsis_Campaign_2023.pdf", page: "p. 156", text: "Antibiotics should be administered within 1 hour for septic shock..." },
          { source: "Critical_Care_Medicine_v51.pdf", page: "p. 2267", text: "Initial fluid resuscitation of 30mL/kg is recommended for all sepsis patients..." },
          { source: "JAMA_2023_Sepsis_Guidelines.pdf", page: "p. 1405", text: "Source control should be achieved within 12 hours of diagnosis..." }
        ];

        ragContext = [
          "Fragment 1: The 2023 Surviving Sepsis Campaign recommends initiation of empiric broad-spectrum antibiotics within 1 hour of recognition of septic shock and within 3 hours for sepsis without shock, following blood cultures...",
          "Fragment 2: Initial fluid resuscitation using crystalloids at 30 mL/kg is recommended as part of the initial management of hypotension or lactate elevation, with reassessment of perfusion status after fluid administration...",
          "Fragment 3: Vasopressors should be used to maintain a mean arterial pressure of at least 65 mmHg in hypotensive patients who do not respond adequately to fluid resuscitation, with norepinephrine being the first-line agent..."
        ];
      } else if (query.includes("drug interaction") || query.includes("medication")) {
        message = `## Medication Interaction Assessment

Based on clinical pharmacology databases and evidence:

### Key Considerations
- **CYP450 Interactions**: Many medications compete for hepatic metabolism
- **QT Prolongation Risk**: Check baseline ECG and electrolytes with certain drugs
- **Renal Function**: Dose adjustments needed for GFR <30 mL/min
- **Drug-Food Interactions**: Some medications require fasting administration

### Recommended Screening
1. Check **CredibleMeds** database for QT prolongation
2. Review **FDA Orange Book** for bioequivalence
3. Assess **renal/hepatic clearance** pathways
4. Consider **patient factors**: age, comorbidities, genetics

**Always verify interactions with your pharmacist and clinical reference sources.**`;

        citations = [
          { source: "Pharmacology_Review_2024.pdf", page: "p. 89", text: "CYP450 interactions account for majority of clinically significant drug-drug interactions..." },
          { source: "CredibleMeds_Database_Summary.pdf", page: "p. 12", text: "QT prolongation risk should be assessed for all medications with this potential..." }
        ];

        ragContext = [
          "Pharmacological Fragment: CYP inhibition and induction represent the most common mechanism of clinically significant drug-drug interactions, with CYP3A4 being involved in metabolism of over 50% of medications.",
          "Safety Fragment: QT interval prolongation can lead to torsades de pointes and sudden cardiac death, requiring baseline and periodic ECG monitoring when using QT-prolonging agents.",
          "Renal Fragment: Medications with primarily renal elimination require dose adjustments when creatinine clearance falls below 30 mL/min/1.73m2 to prevent accumulation and toxicity."
        ];
      } else {
        message = `## Clinical Evidence Summary

Based on the retrieved medical literature and clinical guidelines:

### Assessment Framework
Your question touches on important clinical considerations. The evidence suggests:

- **Evidence-Based Practice**: Current guidelines recommend evaluation based on established risk stratification tools
- **Individual Variation**: Patient factors including comorbidities, demographics, and prior treatment response should guide decision-making
- **Monitoring Parameters**: Regular assessment and adjustment of management strategies is essential

### Clinical Recommendations
1. **Risk Assessment**: Use validated scoring systems for patient stratification
2. **Evidence Review**: Consult primary literature and systematic reviews
3. **Specialist Input**: Consider multidisciplinary consultation when needed
4. **Patient Counseling**: Discuss risks, benefits, and alternatives with informed consent

**This summary requires verification with primary clinical sources and your clinical team.**`;

        citations = [
          { source: "Evidence_Based_Medicine_Handbook.pdf", page: "p. 245", text: "Systematic risk assessment is the cornerstone of clinical decision-making..." },
          { source: "Journal_Clinical_Practice_v15.pdf", page: "p. 567", text: "Individual patient factors must be considered alongside population-based evidence..." }
        ];

        ragContext = [
          "Evidence Fragment 1: Systematic reviews and meta-analyses provide the highest level of evidence for clinical decision-making in most scenarios.",
          "Evidence Fragment 2: Individual patient characteristics including comorbidity burden, functional status, and treatment preferences should guide personalized medicine approaches.",
          "Evidence Fragment 3: Regular reassessment and adaptive management strategies improve outcomes compared to static treatment protocols."
        ];
      }

      const response = {
        message,
        citations,
        confidence: "high" as const,
        ragContext
      };

      res.json(response);
    } catch (err) {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  return httpServer;
}
