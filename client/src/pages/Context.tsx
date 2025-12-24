import { Navigation } from "@/components/Navigation";
import { FileText, Database, Search } from "lucide-react";
import { Input } from "@/components/ui/input";

export default function Context() {
  return (
    <div className="flex h-screen bg-background">
      <aside className="hidden lg:block w-64 border-r bg-white">
        <Navigation />
      </aside>

      <main className="flex-1 p-8 overflow-y-auto">
        <div className="max-w-4xl mx-auto space-y-8">
          
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <h1 className="text-3xl font-display font-bold text-foreground">Retrieved Context</h1>
              <p className="text-muted-foreground text-lg">Manage the knowledge base used for RAG generation.</p>
            </div>
            <div className="bg-primary/5 p-2 rounded-full">
              <Database className="w-6 h-6 text-primary" />
            </div>
          </div>

          <div className="relative">
            <Search className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
            <Input 
              placeholder="Search indexed medical documents..." 
              className="pl-10 h-12 bg-white"
            />
          </div>

          <div className="grid gap-4">
             {[1, 2, 3].map((i) => (
               <div key={i} className="bg-white p-6 rounded-xl border border-border shadow-sm hover:shadow-md transition-all cursor-pointer group">
                 <div className="flex items-start gap-4">
                   <div className="bg-blue-50 p-2.5 rounded-lg text-blue-600 group-hover:bg-blue-100 transition-colors">
                     <FileText className="w-5 h-5" />
                   </div>
                   <div className="flex-1">
                     <div className="flex justify-between">
                       <h3 className="font-semibold text-foreground">Clinical Guidelines for Sepsis Management {2023 + i}</h3>
                       <span className="text-xs bg-secondary px-2 py-1 rounded text-muted-foreground">PDF • 2.4 MB</span>
                     </div>
                     <p className="text-sm text-muted-foreground mt-1">Indexed on Oct {10 + i}, 2024 • 142 Chunks</p>
                     
                     <div className="flex gap-2 mt-4">
                       <span className="text-[10px] uppercase font-bold tracking-wider text-muted-foreground bg-secondary px-2 py-1 rounded">Guidelines</span>
                       <span className="text-[10px] uppercase font-bold tracking-wider text-muted-foreground bg-secondary px-2 py-1 rounded">Emergency</span>
                     </div>
                   </div>
                 </div>
               </div>
             ))}
          </div>

          <div className="p-8 text-center text-muted-foreground bg-secondary/30 rounded-xl border border-dashed border-border">
            <p>Connect more data sources (PubMed, Hospital EMR) to expand the knowledge base.</p>
          </div>

        </div>
      </main>
    </div>
  );
}
