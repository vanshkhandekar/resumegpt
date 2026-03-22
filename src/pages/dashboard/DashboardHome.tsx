import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Copy, Edit, FileText, MoreVertical, Plus, Trash2, Download } from "lucide-react";
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
import { useAuth } from "@/hooks/useAuth";

export default function DashboardHome() {
  const { resumes, loading, fetchResumes, createResume, deleteResume, duplicateResume } = useResumes();
  const { user } = useAuth();
  const navigate = useNavigate();

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
            <h1 className="text-3xl font-bold tracking-tight">
              Welcome back, {user?.user_metadata?.full_name?.split(" ")[0] || "User"}!
            </h1>
            <p className="text-muted-foreground">Here is an overview of your resumes and usage.</p>
          </div>
          <Button onClick={handleCreateNew} className="hidden sm:flex">
            <Plus className="mr-2 h-4 w-4" /> Create Resume
          </Button>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Resumes</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{resumes.length}</div>
              <p className="text-xs text-muted-foreground">Resumes created in your account</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">AI Calls Used</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">0 / 10</div>
              <p className="text-xs text-muted-foreground">Daily limit (Free Plan)</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Current Plan</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold capitalize">Free</div>
              <p className="text-xs text-muted-foreground">
                <Link to="/upgrade" className="text-primary hover:underline">Upgrade to Pro</Link> for more limits.
              </p>
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
