import { Button as AntButton } from "antd";
import type { ButtonProps as AntButtonProps } from "antd";
import type { ReactNode } from "react";

type ActionButtonProps = Omit<AntButtonProps, "type" | "children"> & {
  icon: ReactNode;
  label: string;
  count?: number;
  active?: boolean;
};

export function ActionButton({ icon, label, count, active = false, className = "", ...props }: ActionButtonProps) {
  return (
    <AntButton type="default" className={`action-button ${active ? "is-active" : ""} ${className}`.trim()} {...props}>
      <span className="action-button__icon" aria-hidden="true">{icon}</span>
      <span className="action-button__label">{label}</span>
      {typeof count === "number" ? <span className="action-button__count">{count}</span> : null}
    </AntButton>
  );
}
