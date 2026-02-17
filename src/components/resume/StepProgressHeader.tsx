type StepProgressHeaderProps = {
  title: string;
  stepLabel: string;
  stepText: string;
  progress: number; // 0..1
};

export function StepProgressHeader({ title, stepLabel, stepText, progress }: StepProgressHeaderProps) {
  const pct = Math.max(0, Math.min(1, progress));
  return (
    <header className="rounded-xl border bg-card">
      <div className="flex items-end justify-between gap-4 p-4">
        <div className="grid gap-1">
          <p className="text-sm text-muted-foreground">{stepLabel}</p>
          <p className="text-xl font-semibold tracking-tight">{title}</p>
        </div>
        <p className="text-sm font-medium text-muted-foreground">{stepText}</p>
      </div>
      <div className="px-4 pb-4">
        <div className="h-2 w-full rounded-full bg-muted">
          <div className="h-2 rounded-full bg-primary transition-[width]" style={{ width: `${pct * 100}%` }} />
        </div>
      </div>
    </header>
  );
}
