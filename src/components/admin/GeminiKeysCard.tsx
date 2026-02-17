import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

type KeyRow = {
  id: string;
  label: string | null;
  api_key: string;
  priority: number;
  is_active: boolean;
  created_at: string;
};

export function GeminiKeysCard() {
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [rows, setRows] = useState<KeyRow[]>([]);

  const [label, setLabel] = useState("");
  const [apiKey, setApiKey] = useState("");
  const [priority, setPriority] = useState("1");

  const load = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("gemini_api_keys")
      .select("id,label,api_key,priority,is_active,created_at")
      .order("priority", { ascending: true });
    setLoading(false);

    if (error) {
      toast({ variant: "destructive", title: "Load failed", description: error.message });
      return;
    }
    setRows((data as KeyRow[]) ?? []);
  };

  useEffect(() => {
    void load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const add = async () => {
    const p = Number(priority);
    if (!apiKey.trim()) {
      toast({ variant: "destructive", title: "Missing key", description: "Enter an API key." });
      return;
    }

    const { error } = await supabase.from("gemini_api_keys").insert({
      api_key: apiKey.trim(),
      label: label.trim() || null,
      priority: Number.isFinite(p) ? p : 1,
      is_active: true,
    });

    if (error) {
      toast({ variant: "destructive", title: "Add failed", description: error.message });
      return;
    }

    setLabel("");
    setApiKey("");
    setPriority("1");
    toast({ title: "Added", description: "Key saved." });
    void load();
  };

  const setActive = async (id: string, is_active: boolean) => {
    const { error } = await supabase.from("gemini_api_keys").update({ is_active }).eq("id", id);
    if (error) {
      toast({ variant: "destructive", title: "Update failed", description: error.message });
      return;
    }
    setRows((prev) => prev.map((r) => (r.id === id ? { ...r, is_active } : r)));
  };

  const remove = async (id: string) => {
    const { error } = await supabase.from("gemini_api_keys").delete().eq("id", id);
    if (error) {
      toast({ variant: "destructive", title: "Delete failed", description: error.message });
      return;
    }
    setRows((prev) => prev.filter((r) => r.id !== id));
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Gemini API Keys</CardTitle>
        <CardDescription>Add multiple keys for rotation/fallback. You can add keys later.</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-4">
        <div className="grid gap-3">
          <div className="grid gap-2 sm:grid-cols-3">
            <Input value={label} onChange={(e) => setLabel(e.target.value)} placeholder="Label (optional)" />
            <Input value={priority} onChange={(e) => setPriority(e.target.value)} placeholder="Priority" inputMode="numeric" />
            <Button onClick={() => void add()} className="sm:justify-self-end">
              Add Key
            </Button>
          </div>
          <Input value={apiKey} onChange={(e) => setApiKey(e.target.value)} placeholder="API key" type="password" />
        </div>

        <Separator />

        {loading ? (
          <p className="text-sm text-muted-foreground">Loading…</p>
        ) : rows.length === 0 ? (
          <p className="text-sm text-muted-foreground">No keys added yet.</p>
        ) : (
          <div className="grid gap-3">
            {rows.map((r) => (
              <div key={r.id} className="rounded-lg border p-3">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium">{r.label || "Untitled"}</p>
                    <p className="text-xs text-muted-foreground">Priority: {r.priority}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2">
                      <p className="text-xs text-muted-foreground">Active</p>
                      <Switch checked={r.is_active} onCheckedChange={(v) => void setActive(r.id, v)} />
                    </div>
                    <Button variant="outline" onClick={() => void remove(r.id)}>
                      Delete
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
