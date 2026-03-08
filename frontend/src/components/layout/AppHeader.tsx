import { Link } from "react-router-dom";
import type { ReactNode } from "react";

interface AppHeaderProps {
  title?: string;
  pageName?: string;
  backTo?: string;
  right?: ReactNode;
  staff?: boolean;
}

export function AppHeader({
  title = "SunQ",
  pageName,
  backTo,
  right,
  staff,
}: AppHeaderProps) {
  return (
    <header
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "16px 0",
        marginBottom: "var(--spacing)",
        borderBottom: "1px solid var(--border)",
        position: "sticky",
        top: 0,
        background: "var(--bg)",
        zIndex: 10,
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
            fontSize: "26px",
            fontWeight: 400,
            margin: 0,
            display: "flex",
            alignItems: "baseline",
            gap: 6,
          }}
        >
          {title === "SunQ" ? (
            <span style={{ display: "inline-flex", alignItems: "baseline" }}>
              Sun<span style={{ color: "var(--primary)" }}>Q</span>
            </span>
          ) : (
            title
          )}
          {pageName && (
            <>
              <span
                style={{
                  fontSize: "16px",
                  fontWeight: 400,
                  color: "var(--muted)",
                }}
              >
                ｜
              </span>
              <span
                style={{
                  fontSize: "16px",
                  fontFamily: "var(--sans-font)",
                  color: "var(--text)",
                }}
              >
                {pageName}
              </span>
            </>
          )}
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
