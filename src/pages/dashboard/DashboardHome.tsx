import { useEffect, useState, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Copy, Edit, FileText, MoreVertical, Plus, Trash2, Download, Sparkles, Trophy } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useResumes } from "@/hooks/useResumes";
import { getMetricsSnapshot } from "@/lib/demoStorage";

export default function DashboardHome() {
  const { resumes, loading, fetchResumes, createResume, deleteResume, duplicateResume } = useResumes();
  const navigate = useNavigate();
  const [refresh, setRefresh] = useState(0);

  const metrics = useMemo(() => getMetricsSnapshot(), [refresh, resumes.length]);

  useEffect(() => {
    fetchResumes();
  }, [fetchResumes]);

  const handleCreateNew = async () => {
    const newResume = await createResume("Untitled Resume");
    if (newResume) {
      navigate(`/create/${newResume.id}`);
    }
  };

  return (
    <div className="mx-auto w-full max-w-5xl space-y-8">
      {/* Welcome & Stats */}
      <section>
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-primary to-primary/50 bg-clip-text text-transparent">
              Welcome back!
            </h1>
            <p className="text-muted-foreground">Here is an overview of your professional resumes.</p>
          </div>
          <Button onClick={handleCreateNew} className="hidden sm:flex bg-gradient-to-br from-blue-600 to-indigo-700 shadow-md transition-all hover:shadow-lg hover:scale-[1.02]">
            <Plus className="mr-2 h-4 w-4" /> Create Resume
          </Button>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <Card className="border-l-4 border-l-blue-500 shadow-sm hover:shadow-md transition-all">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-semibold text-slate-700 dark:text-slate-300">Total Resumes</CardTitle>
              <FileText className="h-4 w-4 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{resumes.length}</div>
              <p className="text-xs text-muted-foreground mt-1 font-medium italic">Active in local storage</p>
            </CardContent>
          </Card>
          <Card className="border-l-4 border-l-emerald-500 shadow-sm hover:shadow-md transition-all">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-semibold text-slate-700 dark:text-slate-300">AI Assistant Used</CardTitle>
              <Sparkles className="h-4 w-4 text-emerald-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{metrics.aiUsage} calls</div>
              <p className="text-xs text-muted-foreground mt-1 font-medium italic">Powered by Opus 4.6</p>
            </CardContent>
          </Card>
          <Card className="border-l-4 border-l-amber-500 shadow-sm hover:shadow-md transition-all">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-semibold text-slate-700 dark:text-slate-300">Current Access</CardTitle>
              <Trophy className="h-4 w-4 text-amber-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold capitalize">Enterprise</div>
              <p className="text-xs text-muted-foreground mt-1 font-medium italic">Unlimited Premium Features</p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Resumes Grid */}
      <section>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-semibold tracking-tight">My Resumes</h2>
          <Button onClick={handleCreateNew} variant="outline" size="sm" className="sm:hidden">
            <Plus className="h-4 w-4" />
          </Button>
        </div>

        {loading ? (
          <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
            {[1, 2, 3].map(i => (
              <Card key={i} className="animate-pulse bg-muted/50 h-32" />
            ))}
          </div>
        ) : resumes.length === 0 ? (
          <Card className="flex flex-col items-center justify-center p-12 text-center text-muted-foreground border-dashed">
            <FileText className="mb-4 h-12 w-12 text-muted-foreground/50" />
            <h3 className="mb-2 text-lg font-medium text-foreground">No resumes yet</h3>
            <p className="mb-6 max-w-sm text-sm">
              Create your first resume to start applying for jobs. You can use our AI assistant to help you write it.
            </p>
            <Button onClick={handleCreateNew}>
              <Plus className="mr-2 h-4 w-4" /> Create Your First Resume
            </Button>
          </Card>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
            {resumes.map(resume => (
               <Card key={resume.id} className="group hover:border-primary/50 transition-all flex flex-col">
                 <CardContent className="p-4 flex-1">
                   <div className="flex justify-between items-start">
                     <div>
                       <h3 className="font-semibold line-clamp-1">{resume.title}</h3>
                       <p className="text-xs text-muted-foreground mt-1">
                         Updated {formatDistanceToNow(new Date(resume.updated_at))} ago
                       </p>
                       <div className="mt-3 flex items-center gap-2">
                         <Badge variant="secondary" className="text-[10px] uppercase">
                           {resume.template_id}
                         </Badge>
                         {resume.last_score !== null && (
                           <Badge variant={resume.last_score > 70 ? "default" : "secondary"} className="text-[10px]">
                             Score: {resume.last_score}%
                           </Badge>
                         )}
                       </div>
                     </div>
                     <DropdownMenu>
                       <DropdownMenuTrigger asChild>
                         <Button variant="ghost" size="icon" className="h-8 w-8 -mr-2">
                           <MoreVertical className="h-4 w-4" />
                         </Button>
                       </DropdownMenuTrigger>
                       <DropdownMenuContent align="end">
                         <DropdownMenuItem onClick={() => navigate(`/create/${resume.id}`)}>
                           <Edit className="mr-2 h-4 w-4" /> Edit
                         </DropdownMenuItem>
                         <DropdownMenuItem onClick={() => duplicateResume(resume.id)}>
                           <Copy className="mr-2 h-4 w-4" /> Duplicate
                         </DropdownMenuItem>
                         <DropdownMenuItem onClick={() => navigate(`/export/${resume.id}`)}>
                           <Download className="mr-2 h-4 w-4" /> Export PDF
                         </DropdownMenuItem>
                         <DropdownMenuSeparator />
                         <DropdownMenuItem 
                           onClick={() => deleteResume(resume.id)} 
                           className="text-destructive focus:text-destructive"
                         >
                           <Trash2 className="mr-2 h-4 w-4" /> Delete
                         </DropdownMenuItem>
                       </DropdownMenuContent>
                     </DropdownMenu>
                   </div>
                 </CardContent>
               </Card>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
