import type { User } from "../../features/auth/types";

type AvatarProps = {
  user: Pick<User, "displayName" | "avatarUrl">;
  size?: "sm" | "md" | "lg";
};

function getInitials(name: string) {
  return name.split(/\s+/).filter(Boolean).slice(0, 2).map((part) => part[0]?.toUpperCase() ?? "").join("") || "U";
}

export function Avatar({ user, size = "md" }: AvatarProps) {
  const className = `avatar avatar--${size}`;
  if (user.avatarUrl) {
    return <img className={`${className} avatar--image`} src={user.avatarUrl} alt={user.displayName} />;
  }
  return <span className={className}>{getInitials(user.displayName)}</span>;
}
