import type { ReactNode } from "react";

interface TagButtonProps {
  selected?: boolean;
  multiple?: boolean;
  children: ReactNode;
  onClick?: () => void;
}

export function TagButton({
  selected = false,
  children,
  onClick,
}: TagButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      style={{
        padding: "8px 16px",
        borderRadius: "var(--btn-radius)",
        border: selected
          ? "2px solid var(--primary)"
          : "1px solid var(--border)",
        background: selected ? "var(--primary-light)" : "var(--surface)",
        color: selected ? "var(--primary-dark)" : "var(--text)",
        fontSize: "14px",
        fontWeight: 500,
      }}
    >
      {children}
    </button>
  );
}

interface TagButtonGroupProps {
  options: { value: string; label: string }[];
  value: string | string[] | null;
  multiple?: boolean;
  onChange: (value: string | string[] | null) => void;
}

export function TagButtonGroup({
  options,
  value,
  multiple = false,
  onChange,
}: TagButtonGroupProps) {
  const isSelected = (v: string) =>
    Array.isArray(value) ? value.includes(v) : value === v;

  const handleClick = (v: string) => {
    if (multiple) {
      const current = Array.isArray(value) ? value : value ? [value] : [];
      const next = current.includes(v)
        ? current.filter((x) => x !== v)
        : [...current, v];
      onChange(next);
    } else {
      // 単一選択: 同じ項目を再度クリックしたら未選択にする
      onChange(value === v ? null : v);
    }
  };

  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
      {options.map((opt) => (
        <TagButton
          key={opt.value}
          selected={isSelected(opt.value)}
          onClick={() => handleClick(opt.value)}
        >
          {opt.label}
        </TagButton>
      ))}
    </div>
  );
}
