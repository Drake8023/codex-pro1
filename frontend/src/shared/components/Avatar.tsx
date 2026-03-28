import type { User } from "../../features/auth/types";

type AvatarProps = {
  user: Pick<User, "displayName" | "avatarUrl">;
  size?: "sm" | "md" | "lg";
  className?: string;
};

function getInitials(name: string) {
  return name.split(/\s+/).filter(Boolean).slice(0, 2).map((part) => part[0]?.toUpperCase() ?? "").join("") || "U";
}

export function Avatar({ user, size = "md", className = "" }: AvatarProps) {
  const classes = `avatar avatar--${size} ${className}`.trim();
  if (user.avatarUrl) {
    return <img className={`${classes} avatar--image`} src={user.avatarUrl} alt={user.displayName} />;
  }
  return <span className={classes}>{getInitials(user.displayName)}</span>;
}
