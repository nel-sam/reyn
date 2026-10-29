import type { ColorValue } from "react-native";
import { useCSSVariable } from "uniwind";

export function useThemeColors() {
  const [background, surface, foreground, foregroundSecondary, foregroundMuted, primary, primaryForeground, border, danger, sponsor, sponsorSubtle, sponsorForeground, sponsorIcon] =
    useCSSVariable([
      "--color-background",
      "--color-surface",
      "--color-foreground",
      "--color-foreground-secondary",
      "--color-foreground-muted",
      "--color-primary",
      "--color-primary-foreground",
      "--color-border",
      "--color-danger",
    ]) as ColorValue[];

  return {
    background,
    surface,
    foreground,
    foregroundSecondary,
    foregroundMuted,
    primary,
    primaryForeground,
    border,
    danger,
  };
}
