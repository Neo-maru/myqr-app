import { THEME_PRESETS } from "../../constants/themeColors";

type ThemeColorPickerProps = {
  value: string;
  onChange: (id: string) => void;
  themeName?: string;
};

export function ThemeColorPicker({ value, onChange, themeName }: ThemeColorPickerProps) {
  return (
    <div>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 8, alignItems: "center" }}>
        {THEME_PRESETS.map((preset) => {
          const isSelected = value === preset.id;
          return (
            <button
              key={preset.id}
              type="button"
              onClick={() => onChange(preset.id)}
              title={preset.name}
              style={{
                width: 36,
                height: 36,
                borderRadius: "50%",
                border: isSelected ? "3px solid var(--text)" : "2px solid var(--border)",
                background: preset.primary,
                cursor: "pointer",
                padding: 0,
                flexShrink: 0,
              }}
              aria-label={`テーマ: ${preset.name}`}
            />
          );
        })}
      </div>
      {themeName && (
        <p style={{ fontSize: "13px", color: "var(--muted)", marginTop: 8 }}>選択中: {themeName}</p>
      )}
    </div>
  );
}
