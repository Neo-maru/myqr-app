import type { ButtonHTMLAttributes, ReactNode } from "react";

type Variant = "primary" | "secondary" | "ghost";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  children: ReactNode;
  fullWidth?: boolean;
}

const variantStyles: Record<Variant, React.CSSProperties> = {
  primary: {
    background: "var(--primary)",
    color: "#fff",
    border: "none",
  },
  secondary: {
    background: "transparent",
    color: "var(--primary)",
    border: "2px solid var(--primary)",
  },
  ghost: {
    background: "transparent",
    color: "var(--muted)",
    border: "none",
  },
};

export function PrimaryButton({
  children,
  style,
  fullWidth,
  ...props
}: Omit<ButtonProps, "variant">) {
  return (
    <button
      type="button"
      style={{
        ...variantStyles.primary,
        borderRadius: "var(--btn-radius)",
        padding: "12px 24px",
        fontWeight: 500,
        fontSize: "16px",
        ...(fullWidth ? { width: "100%" } : {}),
        ...style,
      }}
      {...props}
    >
      {children}
    </button>
  );
}

export function SecondaryButton({
  children,
  style,
  ...props
}: Omit<ButtonProps, "variant">) {
  return (
    <button
      type="button"
      style={{
        ...variantStyles.secondary,
        borderRadius: "var(--btn-radius)",
        padding: "12px 24px",
        fontWeight: 500,
        ...style,
      }}
      {...props}
    >
      {children}
    </button>
  );
}

export function GhostButton({
  children,
  style,
  ...props
}: Omit<ButtonProps, "variant">) {
  return (
    <button
      type="button"
      style={{
        ...variantStyles.ghost,
        borderRadius: "var(--btn-radius)",
        padding: "12px 24px",
        fontWeight: 500,
        ...style,
      }}
      {...props}
    >
      {children}
    </button>
  );
}
