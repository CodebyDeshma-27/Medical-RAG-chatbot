import { Navigation } from "@/components/Navigation";
import { ShieldCheck, Lock, Network, Database, Server, FileCheck } from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function Privacy() {
  return (
    <div className="flex h-screen bg-background">
      <aside className="hidden lg:block w-64 border-r bg-white">
        <Navigation />
      </aside>

      <main className="flex-1 p-8 overflow-y-auto">
        <div className="max-w-4xl mx-auto space-y-8">
          
          <div className="space-y-2">
            <h1 className="text-3xl font-display font-bold text-foreground">Privacy & Security Model</h1>
            <p className="text-muted-foreground text-lg">How MedCite ensures HIPAA compliance and data sovereignty.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <Card className="border-t-4 border-t-emerald-500 shadow-sm">
              <CardHeader>
                <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center mb-2">
                  <ShieldCheck className="w-5 h-5 text-emerald-600" />
                </div>
                <CardTitle className="text-lg">HIPAA Compliant</CardTitle>
                <CardDescription>BAA Signed & Verified</CardDescription>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground">
                All data transmission is encrypted using TLS 1.3. No PHI is retained in the inference logs.
              </CardContent>
            </Card>

            <Card className="border-t-4 border-t-blue-500 shadow-sm">
              <CardHeader>
                <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center mb-2">
                  <Network className="w-5 h-5 text-blue-600" />
                </div>
                <CardTitle className="text-lg">Federated Learning</CardTitle>
                <CardDescription>Local Model Inference</CardDescription>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground">
                Models run locally on-premise when possible. Aggregated insights are shared without exposing raw patient data.
              </CardContent>
            </Card>

            <Card className="border-t-4 border-t-amber-500 shadow-sm">
              <CardHeader>
                <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center mb-2">
                  <FileCheck className="w-5 h-5 text-amber-600" />
                </div>
                <CardTitle className="text-lg">Auditable Logs</CardTitle>
                <CardDescription>Full Traceability</CardDescription>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground">
                Every AI response includes a citation trail. Administrators can audit query logs for compliance reviews.
              </CardContent>
            </Card>
          </div>

          <section className="bg-white rounded-xl border border-border p-8 space-y-6 shadow-sm">
             <div className="flex items-start gap-4">
               <div className="bg-primary/10 p-3 rounded-xl">
                 <Server className="w-6 h-6 text-primary" />
               </div>
               <div>
                 <h3 className="text-xl font-bold font-display text-foreground">Data Storage Architecture</h3>
                 <p className="text-muted-foreground mt-2 leading-relaxed">
                   MedCite utilizes a split-storage architecture. Vector embeddings for RAG (Retrieval Augmented Generation) are stored in an isolated, encrypted vector database. Patient identifiers are never vectorized. 
                 </p>
                 <div className="mt-6 flex gap-4">
                   <Button variant="outline">Download Security Whitepaper</Button>
                   <Button variant="default">View Compliance Certs</Button>
                 </div>
               </div>
             </div>
          </section>

        </div>
      </main>
    </div>
  );
}
