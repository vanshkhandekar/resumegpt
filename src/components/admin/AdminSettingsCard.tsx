import { useEffect, useMemo, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

type Settings = {
  ai_enabled: boolean;
  ai_provider: string;
  ai_model: string;
  max_lines: number;
};

const MODELS = [
  "google/gemini-3-flash-preview",
  "google/gemini-3-pro-preview",
  "google/gemini-2.5-flash",
  "google/gemini-2.5-pro",
  "openai/gpt-5-mini",
  "openai/gpt-5",
];

export function AdminSettingsCard() {
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [settings, setSettings] = useState<Settings | null>(null);

  const maxLinesStr = useMemo(() => (settings ? String(settings.max_lines ?? 10) : "10"), [settings]);

  useEffect(() => {
    let mounted = true;
    (async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from("admin_settings")
        .select("ai_enabled, ai_provider, ai_model, max_lines")
        .eq("id", 1)
        .maybeSingle();

      if (!mounted) return;
      if (error) {
        toast({ variant: "destructive", title: "Load failed", description: error.message });
        setLoading(false);
        return;
      }

      setSettings(
        data ?? {
          ai_enabled: true,
          ai_provider: "lovable",
          ai_model: "google/gemini-3-flash-preview",
          max_lines: 10,
        },
      );
      setLoading(false);
    })();
    return () => {
      mounted = false;
    };
  }, [toast]);

  const save = async () => {
    if (!settings) return;
    setSaving(true);
    const { error } = await supabase
      .from("admin_settings")
      .upsert({ id: 1, ...settings })
      .eq("id", 1);
    setSaving(false);

    if (error) {
      toast({ variant: "destructive", title: "Save failed", description: error.message });
      return;
    }
    toast({ title: "Saved", description: "Settings updated." });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>AI Settings</CardTitle>
        <CardDescription>Control AI on/off, model, and output length.</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-4">
        {loading || !settings ? (
          <p className="text-sm text-muted-foreground">Loading…</p>
        ) : (
          <>
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-sm font-medium">AI Enabled</p>
                <p className="text-xs text-muted-foreground">Turn AI helper on/off across the app.</p>
              </div>
              <Switch
                checked={settings.ai_enabled}
                onCheckedChange={(v) => setSettings((s) => (s ? { ...s, ai_enabled: v } : s))}
              />
            </div>

            <div className="grid gap-2">
              <p className="text-sm font-medium">Model</p>
              <Select
                value={settings.ai_model}
                onValueChange={(v) => setSettings((s) => (s ? { ...s, ai_model: v } : s))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select model" />
                </SelectTrigger>
                <SelectContent>
                  {MODELS.map((m) => (
                    <SelectItem key={m} value={m}>
                      {m}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground">Provider stays backend-managed for safety.</p>
            </div>

            <div className="grid gap-2">
              <p className="text-sm font-medium">Max lines (6–10 recommended)</p>
              <Input
                inputMode="numeric"
                value={maxLinesStr}
                onChange={(e) => {
                  const n = Number(e.target.value);
                  setSettings((s) => (s ? { ...s, max_lines: Number.isFinite(n) ? n : s.max_lines } : s));
                }}
              />
            </div>

            <Button onClick={() => void save()} disabled={saving}>
              {saving ? "Saving…" : "Save"}
            </Button>
          </>
        )}
      </CardContent>
    </Card>
  );
}
