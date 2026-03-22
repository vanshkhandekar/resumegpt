import { useState, useEffect, useCallback, useRef } from "react";
import { useResumes, Resume } from "@/hooks/useResumes";

const AUTOSAVE_INTERVAL = 10_000; // 10 seconds

export function useAutoSave(
  resumeId: string,
  currentFormState: any,
  selectedTemplate: string,
  sectionOrder: string[],
  sectionEnabled: Record<string, boolean>
) {
  const { updateResume } = useResumes();
  const [isSaving, setIsSaving] = useState(false);
  const [lastSavedAt, setLastSavedAt] = useState<Date | null>(null);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  
  const lastSavedState = useRef({
    data: JSON.stringify(currentFormState),
    template_id: selectedTemplate,
    section_order: JSON.stringify(sectionOrder),
    section_enabled: JSON.stringify(sectionEnabled)
  });

  // Track if changes occurred compared to last saved state
  useEffect(() => {
    const currentStateStr = {
      data: JSON.stringify(currentFormState),
      template_id: selectedTemplate,
      section_order: JSON.stringify(sectionOrder),
      section_enabled: JSON.stringify(sectionEnabled)
    };

    if (
      currentStateStr.data !== lastSavedState.current.data ||
      currentStateStr.template_id !== lastSavedState.current.template_id ||
      currentStateStr.section_order !== lastSavedState.current.section_order ||
      currentStateStr.section_enabled !== lastSavedState.current.section_enabled
    ) {
      setHasUnsavedChanges(true);
    }
  }, [currentFormState, selectedTemplate, sectionOrder, sectionEnabled]);

  const forceSave = useCallback(async () => {
    if (!resumeId || !hasUnsavedChanges) return;

    setIsSaving(true);
    const success = await updateResume(resumeId, {
      data: currentFormState,
      template_id: selectedTemplate,
      section_order: sectionOrder,
      section_enabled: sectionEnabled
    });

    if (success) {
      setHasUnsavedChanges(false);
      setLastSavedAt(new Date());
      // Update last saved ref
      lastSavedState.current = {
        data: JSON.stringify(currentFormState),
        template_id: selectedTemplate,
        section_order: JSON.stringify(sectionOrder),
        section_enabled: JSON.stringify(sectionEnabled)
      };
    }
    setIsSaving(false);
  }, [resumeId, currentFormState, selectedTemplate, sectionOrder, sectionEnabled, hasUnsavedChanges, updateResume]);

  // Auto-save timer
  useEffect(() => {
    const timer = setInterval(() => {
      forceSave();
    }, AUTOSAVE_INTERVAL);

    return () => clearInterval(timer);
  }, [forceSave]);

  // Save before unload (closing tab)
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (hasUnsavedChanges) {
        e.preventDefault();
        e.returnValue = ''; // Required for Chrome to show prompt
      }
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [hasUnsavedChanges]);

  return { isSaving, lastSavedAt, hasUnsavedChanges, forceSave };
}
