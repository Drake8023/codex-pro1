import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import type { User } from "../../features/auth/types";

export function getUserProfileHref(userId: number) {
  return `/users/${userId}`;
}

export function UserLink({ user, className = "", children }: { user: Pick<User, "id">; className?: string; children: ReactNode }) {
  return (
    <Link className={className} to={getUserProfileHref(user.id)} onClick={(event) => event.stopPropagation()}>
      {children}
    </Link>
  );
}
