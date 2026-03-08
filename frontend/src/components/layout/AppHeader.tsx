import { Link } from "react-router-dom";
import type { ReactNode } from "react";

interface AppHeaderProps {
  title?: string;
  pageName?: string;
  storeName?: string;
  backTo?: string;
  right?: ReactNode;
  staff?: boolean;
}

export function AppHeader({
  title = "SunQ",
  pageName,
  storeName,
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
        gap: 8,
        padding: "16px 0",
        marginBottom: "var(--spacing)",
        borderBottom: "1px solid var(--border)",
        position: "sticky",
        top: 0,
        background: "var(--bg)",
        zIndex: 10,
        flexWrap: "nowrap",
        minWidth: 0,
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "baseline",
          gap: 8,
          flexWrap: "nowrap",
          minWidth: 0,
          flexShrink: 0,
        }}
      >
        {backTo && (
          <Link
            to={backTo}
            style={{
              fontSize: "24px",
              color: "var(--text)",
              textDecoration: "none",
              flexShrink: 0,
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
            display: "inline-flex",
            alignItems: "baseline",
            gap: 6,
            flexWrap: "nowrap",
            flexShrink: 0,
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
          {staff && (
            <span
              style={{
                fontSize: "11px",
                padding: "2px 8px",
                marginLeft: 6,
                background: "var(--primary-light)",
                color: "var(--primary-dark)",
                borderRadius: "var(--btn-radius)",
                fontWeight: 500,
                display: "inline-flex",
                alignItems: "center",
                alignSelf: "baseline",
                flexShrink: 0,
              }}
            >
              スタッフ用
            </span>
          )}
        </h1>
      </div>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 8,
          flexShrink: 1,
          minWidth: 0,
          justifyContent: "flex-end",
        }}
      >
        {storeName && (
          <span
            style={{
              fontSize: "12px",
              fontFamily: "var(--sans-font)",
              color: "var(--muted)",
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            {storeName}
          </span>
        )}
        {right}
      </div>
    </header>
  );
}
