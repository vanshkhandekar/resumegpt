 import { useState } from "react";
 import { Button } from "@/components/ui/button";
 import { Card } from "@/components/ui/card";
 import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
 import { MessageCircle, X } from "lucide-react";
 import { supabase } from "@/integrations/supabase/client";
 import { useToast } from "@/hooks/use-toast";
 import { bumpAiUsageMetric, getActiveApiKey } from "@/lib/demoStorage";
 
 export default function Dashboard() {
   const [aiOpen, setAiOpen] = useState(false);
   const [aiInput, setAiInput] = useState("");
   const [aiResponse, setAiResponse] = useState("");
   const [aiLoading, setAiLoading] = useState(false);
   const { toast } = useToast();
 
   const handleAiAssist = async () => {
     if (!aiInput.trim()) return;
 
     setAiLoading(true);
     try {
       const { data, error } = await supabase.functions.invoke("ai-resume-assistant", {
         body: { prompt: aiInput, context: "Resume content generation", apiKey: getActiveApiKey() },
       });
 
       if (error) throw error;
 
       if (data?.error === "rate_limit") {
         toast({
           variant: "destructive",
           title: "Rate Limit",
           description: data.message,
         });
         return;
       }
 
       if (data?.error === "quota_exceeded") {
         toast({
           variant: "destructive",
           title: "Quota Exhausted",
           description: data.message,
         });
         setAiOpen(false);
         return;
       }
 
       setAiResponse(data.content || "No response generated.");
       bumpAiUsageMetric();
     } catch (err) {
       console.error("AI error:", err);
       toast({
         variant: "destructive",
         title: "AI Error",
         description: "Failed to get AI assistance. Please try again.",
       });
     } finally {
       setAiLoading(false);
     }
   };
 
   return (
     <div className="min-h-screen bg-background p-8">
       <div className="max-w-6xl mx-auto">
         <h1 className="text-3xl font-bold mb-6">Resume Builder Dashboard</h1>
 
         <Tabs defaultValue="create" className="w-full">
           <TabsList className="grid w-full grid-cols-5">
             <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
             <TabsTrigger value="create">Create Resume</TabsTrigger>
             <TabsTrigger value="templates">Templates</TabsTrigger>
             <TabsTrigger value="score">Resume Score</TabsTrigger>
             <TabsTrigger value="export">Export</TabsTrigger>
           </TabsList>
 
           <TabsContent value="dashboard">
             <Card className="p-6">
               <h2 className="text-2xl font-semibold mb-4">Welcome to AI Resume Builder</h2>
               <p className="text-muted-foreground">Start building your professional resume with AI assistance.</p>
             </Card>
           </TabsContent>
 
           <TabsContent value="create">
             <Card className="p-6">
               <h2 className="text-2xl font-semibold mb-4">Create Your Resume</h2>
               <p className="text-muted-foreground">Resume builder form will go here...</p>
             </Card>
           </TabsContent>
 
           <TabsContent value="templates">
             <Card className="p-6">
               <h2 className="text-2xl font-semibold mb-4">Resume Templates</h2>
               <p className="text-muted-foreground">Templates (free + premium locked) will go here...</p>
             </Card>
           </TabsContent>
 
           <TabsContent value="score">
             <Card className="p-6">
               <h2 className="text-2xl font-semibold mb-4">Resume Score (Premium)</h2>
               <p className="text-muted-foreground">ATS score analysis will go here...</p>
             </Card>
           </TabsContent>
 
           <TabsContent value="export">
             <Card className="p-6">
               <h2 className="text-2xl font-semibold mb-4">Export Resume</h2>
               <p className="text-muted-foreground">PDF/DOCX export will go here...</p>
             </Card>
           </TabsContent>
         </Tabs>
       </div>
 
       {/* Floating AI Assistant Button */}
       <Button
         onClick={() => setAiOpen(!aiOpen)}
         className="fixed bottom-6 right-6 h-14 w-14 rounded-full shadow-lg"
         size="icon"
       >
         {aiOpen ? <X className="h-6 w-6" /> : <MessageCircle className="h-6 w-6" />}
       </Button>
 
       {/* AI Chat Panel */}
       {aiOpen && (
         <Card className="fixed bottom-24 right-6 w-96 p-4 shadow-xl">
           <h3 className="font-semibold mb-2">AI Resume Assistant</h3>
           <textarea
             className="w-full border rounded p-2 mb-2 min-h-[100px]"
             placeholder="Ask for help with your resume content..."
             value={aiInput}
             onChange={(e) => setAiInput(e.target.value)}
           />
           <Button onClick={handleAiAssist} disabled={aiLoading} className="w-full mb-2">
             {aiLoading ? "Generating..." : "Get AI Suggestion"}
           </Button>
           {aiResponse && (
             <div className="p-3 bg-muted rounded text-sm">
               <p className="font-semibold mb-1">AI Suggestion:</p>
               <p>{aiResponse}</p>
             </div>
           )}
         </Card>
       )}
     </div>
   );
 }
