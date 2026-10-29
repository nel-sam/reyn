import Ionicons from "@react-native-vector-icons/ionicons";
import type { ComponentProps } from "react";
import { Pressable, Text, View } from "react-native";

import { useThemeColors } from "./../use-theme-colors";

type IconName = ComponentProps<typeof Ionicons>["name"];

type AppButtonProps = {
  label: string;
  onPress: () => void;
  icon?: IconName;
  variant?: "primary" | "secondary" | "danger";
  disabled?: boolean;
  progress?: number;
};

const variantClasses = {
  primary: "bg-primary",
  secondary: "border border-border bg-surface",
  danger: "border border-danger-border bg-danger-subtle",
};

const labelClasses = {
  primary: "text-primary-foreground",
  secondary: "text-foreground",
  danger: "text-danger",
};

export function AppButton({ label, onPress, icon, variant = "primary", disabled = false, progress }: AppButtonProps) {
  const theme = useThemeColors();
  const hasProgress = progress !== undefined;
  const iconColor = hasProgress
    ? theme.primary
    : variant === "primary"
      ? theme.primaryForeground
      : variant === "danger"
        ? theme.danger
        : theme.foreground;
  const progressPercent: `${number}%` | undefined =
    progress === undefined ? undefined : `${Math.max(0, Math.min(1, progress)) * 100}%`;

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ disabled }}
      disabled={disabled}
      onPress={onPress}
      className={`h-14 min-w-50 max-w-80 flex-row items-center justify-center overflow-hidden rounded-2xl active:opacity-80 ${disabled ? "opacity-50" : ""} ${hasProgress ? "border border-primary bg-primary-soft" : variantClasses[variant]}`}
    >
      {progressPercent !== undefined ? (
        <View
          className="absolute bottom-0 left-0 top-0 bg-primary-subtle"
          style={{ width: progressPercent }}
        />
      ) : null}
      <View className="flex-row items-center justify-center">
        <Text className={`text-base font-extrabold ${hasProgress ? "text-primary-subtle-foreground" : labelClasses[variant]}`}>{label}</Text>
        {icon ? (
          <View className="ml-2">
            <Ionicons name={icon} size={19} color={iconColor} />
          </View>
        ) : null}
      </View>
    </Pressable>
  );
}
