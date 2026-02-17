import { useEffect, useMemo, useState } from "react";
import { BarChart3, Check, Eye, EyeOff, KeyRound, RefreshCcw, Shield, Trash2 } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import {
  TEMPLATE_IDS,
  getActiveApiKeyId,
  getMetricsSnapshot,
  getStoredApiKeys,
  getTemplateVisibility,
  resetDemoData,
  setActiveApiKeyId,
  setStoredApiKeys,
  setTemplateVisibility,
  type StoredApiKey,
} from "@/lib/demoStorage";

const ADMIN_USER = "vansh123";
const ADMIN_PASS = "philip99";

const labelFromTemplateId = (id: string) =>
  id
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .replace(/^\w/, (c) => c.toUpperCase())
    .replace("Twocol", "Two-column")
    .replace("Atspro", "ATS-friendly");

export default function Admin() {
  const { toast } = useToast();

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  const [keys, setKeys] = useState<StoredApiKey[]>(() => getStoredApiKeys());
  const [activeKeyId, setActiveKeyIdState] = useState(() => getActiveApiKeyId());
  const [newKeyLabel, setNewKeyLabel] = useState("");
  const [newKeyValue, setNewKeyValue] = useState("");
  const [visibility, setVisibility] = useState<Record<string, boolean>>(() => getTemplateVisibility());
  const [metricsRefresh, setMetricsRefresh] = useState(0);

  const metrics = useMemo(() => getMetricsSnapshot(), [metricsRefresh]);

  useEffect(() => {
    localStorage.removeItem("admin_logged_in");
  }, []);

  const saveKeys = (next: StoredApiKey[]) => {
    setKeys(next);
    setStoredApiKeys(next);
  };

  const setActiveKey = (id: string) => {
    setActiveKeyIdState(id);
    setActiveApiKeyId(id);
    toast({ title: "Active key switched", description: "AI features will use this key." });
  };

  const addKey = () => {
    const value = newKeyValue.trim();
    if (!value) {
      toast({ variant: "destructive", title: "API key required" });
      return;
    }
    const item: StoredApiKey = {
      id: `key_${Date.now()}`,
      label: newKeyLabel.trim() || `Key ${keys.length + 1}`,
      key: value,
    };
    const next = [item, ...keys];
    saveKeys(next);
    if (!activeKeyId) setActiveKey(item.id);
    setNewKeyLabel("");
    setNewKeyValue("");
    toast({ title: "API key added", description: "Stored locally for demo." });
  };

  const removeKey = (id: string) => {
    const next = keys.filter((k) => k.id !== id);
    saveKeys(next);
    if (activeKeyId === id) {
      const fallback = next[0]?.id || "";
      setActiveKeyIdState(fallback);
      setActiveApiKeyId(fallback);
    }
  };

  const toggleTemplate = (id: string) => {
    const next = { ...visibility, [id]: !(visibility[id] ?? true) };
    setVisibility(next);
    setTemplateVisibility(next);
  };

  const handleLogin = () => {
    if (username === ADMIN_USER && password === ADMIN_PASS) {
      localStorage.setItem("admin_logged_in", "true");
      setIsLoggedIn(true);
      setError("");
      toast({ title: "Admin login successful" });
      return;
    }
    setError("Invalid username or password");
  };

  const logout = () => {
    localStorage.removeItem("admin_logged_in");
    setIsLoggedIn(false);
    setUsername("");
    setPassword("");
  };

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-background p-4">
        <div className="mx-auto flex min-h-[80vh] w-full max-w-md items-center">
          <Card className="w-full">
            <CardHeader className="text-center">
              <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-primary">
                <Shield className="h-7 w-7 text-primary-foreground" />
              </div>
              <CardTitle>Admin Login</CardTitle>
              <CardDescription>Use credentials to manage AI keys and demo settings.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <Input placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} />
              <div className="relative">
                <Input
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {error ? <p className="text-sm text-red-500">{error}</p> : null}
              <Button className="w-full" onClick={handleLogin}>
                Login
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="mx-auto w-full max-w-6xl">
        <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
          <div>
            <h1 className="flex items-center gap-2 text-2xl font-semibold">
              <Shield className="h-6 w-6 text-primary" />
              Admin Panel
            </h1>
            <p className="text-muted-foreground">Manage API keys, templates, and demo analytics.</p>
          </div>
          <Button variant="outline" onClick={logout}>
            Logout
          </Button>
        </div>

        <Tabs defaultValue="keys">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="keys">AI Keys</TabsTrigger>
            <TabsTrigger value="templates">Template Visibility</TabsTrigger>
            <TabsTrigger value="analytics">Analytics & Reset</TabsTrigger>
          </TabsList>

          <TabsContent value="keys" className="mt-6 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <KeyRound className="h-5 w-5" />
                  Add AI API Key
                </CardTitle>
                <CardDescription>Multiple keys supported. Active key is used by all AI features.</CardDescription>
              </CardHeader>
              <CardContent className="grid gap-3">
                <Input
                  placeholder="Label (e.g. Team Key 1)"
                  value={newKeyLabel}
                  onChange={(e) => setNewKeyLabel(e.target.value)}
                />
                <Input
                  placeholder="Paste API key"
                  value={newKeyValue}
                  onChange={(e) => setNewKeyValue(e.target.value)}
                />
                <Button onClick={addKey}>Add Key</Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Stored Keys</CardTitle>
                <CardDescription>Switch active key or remove old keys.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                {keys.length === 0 ? (
                  <p className="text-sm text-muted-foreground">No keys saved yet.</p>
                ) : (
                  keys.map((item) => {
                    const active = item.id === activeKeyId;
                    return (
                      <div key={item.id} className="flex items-center justify-between rounded-lg border p-3">
                        <div className="min-w-0">
                          <p className="truncate font-medium">{item.label}</p>
                          <p className="truncate text-xs text-muted-foreground">{item.key.slice(0, 14)}...</p>
                        </div>
                        <div className="flex items-center gap-2">
                          {active ? <Badge>Active</Badge> : null}
                          <Button size="sm" variant={active ? "secondary" : "outline"} onClick={() => setActiveKey(item.id)}>
                            {active ? <Check className="h-4 w-4" /> : "Activate"}
                          </Button>
                          <Button size="sm" variant="outline" onClick={() => removeKey(item.id)}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    );
                  })
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="templates" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Template Visibility Control</CardTitle>
                <CardDescription>Enable or hide templates for demo users.</CardDescription>
              </CardHeader>
              <CardContent className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                {TEMPLATE_IDS.map((id) => {
                  const enabled = visibility[id] ?? true;
                  return (
                    <button
                      key={id}
                      type="button"
                      onClick={() => toggleTemplate(id)}
                      className={`rounded-lg border px-4 py-3 text-left transition ${enabled ? "border-emerald-300 bg-emerald-50 dark:bg-emerald-950/20" : "border-slate-300 bg-slate-100 dark:bg-slate-900/40"}`}
                    >
                      <p className="font-medium">{labelFromTemplateId(id)}</p>
                      <p className="text-xs text-muted-foreground">{enabled ? "Visible to users" : "Hidden from users"}</p>
                    </button>
                  );
                })}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics" className="mt-6 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  Demo Counters
                </CardTitle>
                <CardDescription>Locally tracked usage counters.</CardDescription>
              </CardHeader>
              <CardContent className="grid gap-3 sm:grid-cols-3">
                <div className="rounded-lg border p-4">
                  <p className="text-sm text-muted-foreground">Resumes created</p>
                  <p className="mt-1 text-2xl font-semibold">{metrics.resumesCreated}</p>
                </div>
                <div className="rounded-lg border p-4">
                  <p className="text-sm text-muted-foreground">AI usage count</p>
                  <p className="mt-1 text-2xl font-semibold">{metrics.aiUsage}</p>
                </div>
                <div className="rounded-lg border p-4">
                  <p className="text-sm text-muted-foreground">Templates used</p>
                  <p className="mt-1 text-2xl font-semibold">{Object.values(metrics.templateUsage).reduce((a, b) => a + b, 0)}</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Reset Demo Data</CardTitle>
                <CardDescription>Clears local resume data and usage counters.</CardDescription>
              </CardHeader>
              <CardContent className="flex flex-wrap gap-3">
                <Button variant="outline" onClick={() => setMetricsRefresh((x) => x + 1)}>
                  <RefreshCcw className="mr-2 h-4 w-4" />
                  Refresh Counters
                </Button>
                <Button
                  variant="destructive"
                  onClick={() => {
                    resetDemoData();
                    setMetricsRefresh((x) => x + 1);
                    toast({ title: "Demo data reset complete" });
                  }}
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Reset Demo Data
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
