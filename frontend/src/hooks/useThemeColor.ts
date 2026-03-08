import { useCallback, useEffect, useState } from "react";
import { getPresetById, getDefaultPreset } from "../constants/themeColors";
import { applyThemeById, getStoredThemeId, setStoredThemeId } from "../utils/theme";

export function useThemeColor(): {
  themeId: string;
  themeName: string;
  setThemeId: (id: string) => void;
} {
  const [themeId, setState] = useState<string>(() => getStoredThemeId() ?? getDefaultPreset().id);

  const preset = getPresetById(themeId) ?? getDefaultPreset();

  const setThemeId = useCallback((id: string) => {
    if (!getPresetById(id)) return;
    setStoredThemeId(id);
    applyThemeById(id);
    setState(id);
  }, []);

  useEffect(() => {
    const storedId = getStoredThemeId();
    if (storedId) applyThemeById(storedId);
    else applyThemeById(getDefaultPreset().id);
  }, []);

  return { themeId, themeName: preset.name, setThemeId };
}
