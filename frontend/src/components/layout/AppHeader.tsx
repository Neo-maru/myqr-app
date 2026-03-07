import { Link } from "react-router-dom";
import type { ReactNode } from "react";

interface AppHeaderProps {
  title?: string;
  backTo?: string;
  right?: ReactNode;
  staff?: boolean;
}

export function AppHeader({ title = "SunQ", backTo, right, staff }: AppHeaderProps) {
  return (
    <header
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "16px 0",
        marginBottom: "var(--spacing)",
        borderBottom: "1px solid var(--border)",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        {backTo && (
          <Link
            to={backTo}
            style={{
              fontSize: "24px",
              color: "var(--text)",
              textDecoration: "none",
            }}
            aria-label="戻る"
          >
            ←
          </Link>
        )}
        <h1
          style={{
            fontFamily: "var(--serif-font)",
            fontSize: "22px",
            fontWeight: 400,
            margin: 0,
          }}
        >
          {title}
        </h1>
        {staff && (
          <span
            style={{
              fontSize: "11px",
              padding: "2px 8px",
              background: "var(--primary-light)",
              color: "var(--primary-dark)",
              borderRadius: "var(--btn-radius)",
              fontWeight: 500,
            }}
          >
            スタッフ用
          </span>
        )}
      </div>
      {right}
    </header>
  );
}
