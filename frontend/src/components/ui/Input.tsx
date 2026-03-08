import type { InputHTMLAttributes, TextareaHTMLAttributes } from "react";

const baseStyle: React.CSSProperties = {
  width: "100%",
  padding: "12px 0",
  border: "none",
  borderBottom: "2px solid var(--border)",
  background: "transparent",
  color: "var(--text)",
  outline: "none",
};

const errorStyle: React.CSSProperties = {
  borderBottomColor: "#c44",
};

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  error?: string;
}

export function Input({ error, style, ...props }: InputProps) {
  return (
    <div style={{ marginBottom: "8px" }}>
      <input
        style={{
          ...baseStyle,
          ...(error ? errorStyle : {}),
          ...style,
        }}
        {...props}
      />
      {error && (
        <p style={{ margin: "4px 0 0", fontSize: "14px", color: "#c44" }}>
          {error}
        </p>
      )}
    </div>
  );
}

interface TextAreaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  error?: string;
}

export function TextArea({ error, style, ...props }: TextAreaProps) {
  return (
    <div style={{ marginBottom: "8px" }}>
      <textarea
        style={{
          ...baseStyle,
          resize: "vertical",
          minHeight: "80px",
          ...(error ? errorStyle : {}),
          ...style,
        }}
        {...props}
      />
      {error && (
        <p style={{ margin: "4px 0 0", fontSize: "14px", color: "#c44" }}>
          {error}
        </p>
      )}
    </div>
  );
}
