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
      } else {
        // Create an ultra-professional premium resume by default (Alex Doe - Senior Engineer)
        const premiumResume = {
          id: crypto.randomUUID(),
          title: "Senior Product Architect",
          template_id: "executive",
          section_order: ["experience", "education", "skills", "projects", "languages", "achievements", "certs"],
          section_enabled: { experience: true, education: true, skills: true, projects: true, languages: true, achievements: true, certs: true },
          last_score: 95,
          updated_at: new Date().toISOString(),
          is_archived: false,
          data: {
            name: "Alex Khandekar",
            headline: "Senior SaaS Product Architect",
            email: "alex.pro@example.com",
            phone: "+1 (555) 019-2831",
            photoDataUrl: "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=400",
            summary: "Visionary Software Architect with 8+ years of experience leading high-performance engineering teams. Expert in distributed systems, modern React ecosystems, and orchestrating massive cloud migrations. Proven track record of increasing system efficiency by 40% and mentoring 20+ engineers into leadership roles.",
            experience: [
              { role: "VP of Engineering", company: "NexusTech Solutions", bullets: "Orchestrated the architectural migration of a legacy monolith to a globally distributed microservices architecture, reducing latency by 45%.\nLed a team of 45+ engineers across 3 continents, delivering the flagship SaaS product 2 months ahead of schedule.\nSpearheaded the integration of AI-driven analytics, which increased customer retention by 22% quarter-over-quarter." },
              { role: "Senior Backend Developer", company: "FinServe Analytics", bullets: "Designed and implemented a real-time transaction processing pipeline capable of handling 50,000 TPS with 99.999% uptime.\nOptimized PostgreSQL database queries, reducing average query time from 400ms to under 15ms.\nMentored junior developers and established CI/CD pipelines that cut deployment times in half." }
            ],
            education: [
              { school: "Stanford University", degree: "M.S. in Computer Science", year: "2016" },
              { school: "Indian Institute of Technology (IIT)", degree: "B.Tech in Software Engineering", year: "2014" }
            ],
            skills: "React, Node.js, TypeScript, PostgreSQL, AWS Cloud, Docker/Kubernetes, Architecture Design, Team Leadership, Agile/Scrum",
            projects: [],
            languages: "English (Native), Hindi (Fluent), Spanish (Conversational)",
            achievements: "Winner of the Silicon Valley Coding Hackathon 2018\nPublished 3 research papers on scalable cloud architectures",
            certs: []
          }
        };
        localStorage.setItem("LOCAL_RESUMES", JSON.stringify([premiumResume]));
        setResumes([premiumResume]);
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
