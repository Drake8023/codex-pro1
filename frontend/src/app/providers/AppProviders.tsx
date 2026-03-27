import type { ReactNode } from "react";
import { QueryProvider } from "./QueryProvider";
import { ThemeProvider } from "./ThemeProvider";
import { AntdProvider } from "./AntdProvider";
import { SessionProvider } from "../../features/auth/hooks/useSession";

export function AppProviders({ children }: { children: ReactNode }) {
  return (
    <QueryProvider>
      <ThemeProvider>
        <AntdProvider>
          <SessionProvider>{children}</SessionProvider>
        </AntdProvider>
      </ThemeProvider>
    </QueryProvider>
  );
}
