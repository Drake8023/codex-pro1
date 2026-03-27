import { Button as AntButton } from "antd";
import type { ButtonProps as AntButtonProps } from "antd";
import type { ReactNode } from "react";

type ButtonProps = Omit<AntButtonProps, "size" | "type" | "children" | "variant" | "className" | "icon"> & {
  variant?: "primary" | "secondary" | "ghost";
  size?: "sm" | "md";
  className?: string;
  icon?: ReactNode;
  children?: ReactNode;
};

const sizeMap = {
  sm: "small",
  md: "middle",
} as const;

export function Button({ variant = "secondary", size = "md", className = "", children, icon, ...props }: ButtonProps) {
  const type = variant === "primary" ? "primary" : "default";

  return (
    <AntButton type={type} size={sizeMap[size]} icon={icon} className={`button button--${variant} button--${size} ${className}`.trim()} {...props}>
      {children}
    </AntButton>
  );
}
