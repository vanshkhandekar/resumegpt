import { useState, useCallback, useEffect } from "react";
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
  is_archived: boolean;
}

export function useResumes() {
  const { toast } = useToast();
  const [resumes, setResumes] = useState<Resume[]>([]);
  const [loading, setLoading] = useState(false);

  // Load from local storage
  const fetchResumes = useCallback(async () => {
    setLoading(true);
    try {
      const stored = localStorage.getItem("LOCAL_RESUMES");
      if (stored) {
        const parsed: Resume[] = JSON.parse(stored);
        const active = parsed.filter(r => !r.is_archived).sort((a,b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime());
        setResumes(active);
      }
    } catch (e) {
      console.error(e);
    }
    setLoading(false);
  }, []);

  const saveToLocal = (newResumes: Resume[]) => {
    localStorage.setItem("LOCAL_RESUMES", JSON.stringify(newResumes));
  };

  const createResume = async (title: string = "Untitled Resume") => {
    const newResume: Resume = {
      id: crypto.randomUUID(),
      title,
      data: {},
      template_id: "classic",
      section_order: ["education", "projects", "skills", "languages", "achievements", "experience", "certs"],
      section_enabled: {},
      last_score: null,
      updated_at: new Date().toISOString(),
      is_archived: false
    };

    const stored = localStorage.getItem("LOCAL_RESUMES");
    const parsed: Resume[] = stored ? JSON.parse(stored) : [];
    const updated = [newResume, ...parsed];
    saveToLocal(updated);
    
    setResumes(prev => [newResume, ...prev]);
    return newResume;
  };

  const getResume = async (id: string) => {
    const stored = localStorage.getItem("LOCAL_RESUMES");
    const parsed: Resume[] = stored ? JSON.parse(stored) : [];
    const found = parsed.find(r => r.id === id && !r.is_archived);
    if (!found) {
      toast({ variant: "destructive", title: "Failed to load resume", description: "Resume not found" });
      return null;
    }
    return found;
  };

  const updateResume = async (id: string, updates: Partial<Resume>) => {
    const stored = localStorage.getItem("LOCAL_RESUMES");
    const parsed: Resume[] = stored ? JSON.parse(stored) : [];
    let updatedObj = null;

    const updated = parsed.map(r => {
      if (r.id === id) {
        updatedObj = { ...r, ...updates, updated_at: new Date().toISOString() };
        return updatedObj;
      }
      return r;
    });

    if (updatedObj) {
      saveToLocal(updated);
      setResumes(prev => prev.map(r => r.id === id ? updatedObj! : r));
      return true;
    }
    return false;
  };

  const deleteResume = async (id: string) => {
    const stored = localStorage.getItem("LOCAL_RESUMES");
    const parsed: Resume[] = stored ? JSON.parse(stored) : [];
    const updated = parsed.map(r => r.id === id ? { ...r, is_archived: true } : r);
    saveToLocal(updated);

    setResumes(prev => prev.filter(r => r.id !== id));
    toast({ title: "Resume deleted" });
    return true;
  };

  const duplicateResume = async (id: string) => {
    const source = resumes.find(r => r.id === id);
    if (!source) return null;

    const newResume: Resume = {
      ...source,
      id: crypto.randomUUID(),
      title: `${source.title} (Copy)`,
      updated_at: new Date().toISOString(),
      is_archived: false
    };

    const stored = localStorage.getItem("LOCAL_RESUMES");
    const parsed: Resume[] = stored ? JSON.parse(stored) : [];
    const updated = [newResume, ...parsed];
    saveToLocal(updated);

    setResumes(prev => [newResume, ...prev]);
    toast({ title: "Resume duplicated" });
    return newResume;
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
