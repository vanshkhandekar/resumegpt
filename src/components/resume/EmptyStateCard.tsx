import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import type { ReactNode } from "react";

type EmptyStateCardProps = {
  title: string;
  description: string;
  icon: ReactNode;
  actionLabel: string;
  onAction: () => void;
};

export function EmptyStateCard({ title, description, icon, actionLabel, onAction }: EmptyStateCardProps) {
  return (
    <Card className="border-dashed">
      <CardContent className="grid justify-items-center gap-3 py-10 text-center">
        <div className="grid h-14 w-14 place-items-center rounded-2xl border bg-muted/40">{icon}</div>
        <div className="grid gap-1">
          <p className="text-base font-semibold">{title}</p>
          <p className="max-w-sm text-sm text-muted-foreground">{description}</p>
        </div>
        <Button variant="outline" onClick={onAction}>
          {actionLabel}
        </Button>
      </CardContent>
    </Card>
  );
}
