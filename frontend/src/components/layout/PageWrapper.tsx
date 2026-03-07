import type { ReactNode } from "react";

interface PageWrapperProps {
  children: ReactNode;
  style?: React.CSSProperties;
}

export function PageWrapper({ children, style }: PageWrapperProps) {
  return (
    <div
      style={{
        width: "100%",
        maxWidth: 430,
        margin: "0 auto",
        padding: "var(--spacing)",
        minHeight: "100vh",
        ...style,
      }}
    >
      {children}
    </div>
  );
}
