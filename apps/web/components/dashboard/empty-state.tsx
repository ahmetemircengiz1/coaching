"use client";

import { Card, CardContent } from "@/components/ui/card";

interface EmptyStateProps {
  icon: string;
  title: string;
  description: string;
  action?: React.ReactNode;
}

export function EmptyState({ icon, title, description, action }: EmptyStateProps) {
  return (
    <Card
      className="animate-fade-in"
      style={{
        backgroundColor: "var(--dashboard-card-bg)",
        borderColor: "var(--dashboard-card-border)",
      }}
    >
      <CardContent className="py-16 text-center">
        <p className="text-4xl mb-3">{icon}</p>
        <p
          className="text-lg font-medium mb-1"
          style={{ color: "var(--dashboard-main-text-muted)" }}
        >
          {title}
        </p>
        <p
          className="text-sm max-w-md mx-auto"
          style={{ color: "var(--dashboard-main-text-muted)", opacity: 0.7 }}
        >
          {description}
        </p>
        {action && <div className="mt-4">{action}</div>}
      </CardContent>
    </Card>
  );
}

export function EmptySearchState({ message }: { message?: string }) {
  return (
    <Card
      className="animate-fade-in"
      style={{
        backgroundColor: "var(--dashboard-card-bg)",
        borderColor: "var(--dashboard-card-border)",
      }}
    >
      <CardContent className="py-12 text-center">
        <p className="text-2xl mb-2">🔍</p>
        <p
          className="text-sm"
          style={{ color: "var(--dashboard-main-text-muted)" }}
        >
          {message || "Aramanızla eşleşen sonuç bulunamadı."}
        </p>
      </CardContent>
    </Card>
  );
}
