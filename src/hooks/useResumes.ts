import { useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";

export interface Resume {
  id: string;
  title: string;
  data: any;
  template_id: string;
  section_order: string[];
  section_enabled: Record<string, boolean>;
  last_score: number | null;
  updated_at: string;
}

export function useResumes() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [resumes, setResumes] = useState<Resume[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchResumes = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    const { data, error } = await supabase
      .from("resumes")
      .select("*")
      .eq("is_archived", false)
      .order("updated_at", { ascending: false });

    if (error) {
      toast({ variant: "destructive", title: "Error fetching resumes", description: error.message });
    } else {
      setResumes(data || []);
    }
    setLoading(false);
  }, [user, toast]);

  const createResume = async (title: string = "Untitled Resume") => {
    if (!user) return null;
    const { data, error } = await supabase
      .from("resumes")
      .insert([{ user_id: user.id, title }])
      .select()
      .single();

    if (error) {
      toast({ variant: "destructive", title: "Failed to create resume", description: error.message });
      return null;
    }
    setResumes(prev => [data, ...prev]);
    return data;
  };

  const updateResume = async (id: string, updates: Partial<Resume>) => {
    const { error } = await supabase
      .from("resumes")
      .update(updates)
      .eq("id", id);
    if (error) {
      toast({ variant: "destructive", title: "Failed to update resume", description: error.message });
      return false;
    }
    setResumes(prev => prev.map(r => r.id === id ? { ...r, ...updates, updated_at: new Date().toISOString() } : r));
    return true;
  };

  const deleteResume = async (id: string) => {
    const { error } = await supabase
      .from("resumes")
      .update({ is_archived: true })
      .eq("id", id);
    
    if (error) {
      toast({ variant: "destructive", title: "Failed to delete resume", description: error.message });
      return false;
    }
    setResumes(prev => prev.filter(r => r.id !== id));
    toast({ title: "Resume deleted" });
    return true;
  };

  const duplicateResume = async (id: string) => {
    const source = resumes.find(r => r.id === id);
    if (!source || !user) return null;

    const { data, error } = await supabase
      .from("resumes")
      .insert([{
        user_id: user.id,
        title: `${source.title} (Copy)`,
        data: source.data,
        template_id: source.template_id,
        section_order: source.section_order,
        section_enabled: source.section_enabled
      }])
      .select()
      .single();

    if (error) {
      toast({ variant: "destructive", title: "Failed to duplicate resume", description: error.message });
      return null;
    }
    setResumes(prev => [data, ...prev]);
    toast({ title: "Resume duplicated" });
    return data;
  };

  const getResume = async (id: string) => {
    const { data, error } = await supabase
      .from("resumes")
      .select("*")
      .eq("id", id)
      .single();
    
    if (error) {
      toast({ variant: "destructive", title: "Failed to load resume", description: error.message });
      return null;
    }
    return data as Resume;
  };

  return {
    resumes,
    loading,
    fetchResumes,
    getResume,
    createResume,
    updateResume,
    deleteResume,
    duplicateResume
  };
}
