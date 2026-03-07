import type { ReactNode } from "react";

interface CardProps {
  children: ReactNode;
  style?: React.CSSProperties;
  onClick?: () => void;
}

export function Card({ children, style, onClick }: CardProps) {
  return (
    <div
      role={onClick ? "button" : undefined}
      onClick={onClick}
      style={{
        background: "var(--surface)",
        borderRadius: "var(--card-radius)",
        padding: "var(--spacing)",
        boxShadow: "0 2px 8px rgba(42, 35, 32, 0.06)",
        ...style,
      }}
    >
      {children}
    </div>
  );
}
