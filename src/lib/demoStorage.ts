export type StoredApiKey = {
  id: string;
  label: string;
  key: string;
};

const API_KEYS_KEY = "ai_api_keys";
const ACTIVE_API_KEY_ID = "ai_active_key_id";
const TEMPLATE_VISIBILITY_KEY = "template_visibility";
const METRIC_RESUMES_CREATED = "metric_resumes_created";
const METRIC_AI_USAGE = "metric_ai_usage_count";
const METRIC_TEMPLATES_USED = "metric_templates_used";

const parseJson = <T>(raw: string | null, fallback: T): T => {
  if (!raw) return fallback;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
};

const DEFAULT_KEY = "";

export const getStoredApiKeys = (): StoredApiKey[] => {
  const keys = parseJson<StoredApiKey[]>(localStorage.getItem(API_KEYS_KEY), []);
  const normalized = keys.filter((x) => x?.id && x?.key);
  if (normalized.length) return normalized;

  const migrated: StoredApiKey[] = [{ id: "default_openrouter", label: "Default OpenRouter Key", key: DEFAULT_KEY }];
  localStorage.setItem(API_KEYS_KEY, JSON.stringify(migrated));
  if (!localStorage.getItem(ACTIVE_API_KEY_ID)) {
    localStorage.setItem(ACTIVE_API_KEY_ID, "default_openrouter");
  }
  return migrated;
};

export const setStoredApiKeys = (keys: StoredApiKey[]) => {
  localStorage.setItem(API_KEYS_KEY, JSON.stringify(keys));
};

export const getActiveApiKeyId = () => localStorage.getItem(ACTIVE_API_KEY_ID) || "";

export const setActiveApiKeyId = (id: string) => {
  localStorage.setItem(ACTIVE_API_KEY_ID, id);
};

export const getActiveApiKey = (): string => {
  const keys = getStoredApiKeys();
  const id = getActiveApiKeyId();
  const active = keys.find((k) => k.id === id);
  if (active?.key) return active.key;
  return DEFAULT_KEY;
};

export const bumpMetric = (key: string, step = 1) => {
  const current = Number(localStorage.getItem(key) || "0");
  const next = Number.isFinite(current) ? current + step : step;
  localStorage.setItem(key, String(next));
};

export const bumpAiUsageMetric = () => bumpMetric(METRIC_AI_USAGE, 1);
export const bumpResumeCreatedMetric = () => bumpMetric(METRIC_RESUMES_CREATED, 1);

export const bumpTemplateUsageMetric = (templateId: string) => {
  const usage = parseJson<Record<string, number>>(localStorage.getItem(METRIC_TEMPLATES_USED), {});
  usage[templateId] = (usage[templateId] || 0) + 1;
  localStorage.setItem(METRIC_TEMPLATES_USED, JSON.stringify(usage));
};

export const getMetricsSnapshot = () => ({
  resumesCreated: Number(localStorage.getItem(METRIC_RESUMES_CREATED) || "0"),
  aiUsage: Number(localStorage.getItem(METRIC_AI_USAGE) || "0"),
  templateUsage: parseJson<Record<string, number>>(localStorage.getItem(METRIC_TEMPLATES_USED), {}),
});

export const getTemplateVisibility = (): Record<string, boolean> => {
  return parseJson<Record<string, boolean>>(localStorage.getItem(TEMPLATE_VISIBILITY_KEY), {});
};

export const setTemplateVisibility = (visibility: Record<string, boolean>) => {
  localStorage.setItem(TEMPLATE_VISIBILITY_KEY, JSON.stringify(visibility));
};

export const isTemplateVisible = (templateId: string): boolean => {
  const visibility = getTemplateVisibility();
  if (typeof visibility[templateId] === "boolean") return visibility[templateId];
  return true;
};

export const resetDemoData = () => {
  [
    "resumeData",
    METRIC_RESUMES_CREATED,
    METRIC_AI_USAGE,
    METRIC_TEMPLATES_USED,
    "rgpt_ai_pos",
    "admin_logged_in",
  ].forEach((key) => localStorage.removeItem(key));
};

export const TEMPLATE_IDS = [
  "classic",
  "minimal",
  "modern",
  "executive",
  "twocol",
  "compact",
  "atspro",
  "slate",
  "nimbus",
  "vertex",
  "aurora",
  "metro",
  "nova",
  "pulse",
  "orbit",
  "colorpop",
  "elegant",
  "creative",
  "bold",
  "professional",
];
