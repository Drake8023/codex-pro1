import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getInitialLanguage, type Language } from "../../../i18n";
import { getSession, login, logout, register } from "../api";
import type { AuthPayload, RegisterPayload, User } from "../types";

type SessionContextValue = {
  currentUser: User | null;
  language: Language;
  setLanguage: (language: Language) => void;
};

const SessionContext = createContext<SessionContextValue | null>(null);

export function SessionProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>(() => getInitialLanguage());
  const sessionQuery = useQuery({ queryKey: ["session"], queryFn: getSession });

  useEffect(() => {
    document.documentElement.lang = language;
    window.localStorage.setItem("curator-language", language);
  }, [language]);

  const value = useMemo(() => ({
    currentUser: sessionQuery.data?.user ?? null,
    language,
    setLanguage,
  }), [language, sessionQuery.data?.user]);

  return <SessionContext.Provider value={value}>{children}</SessionContext.Provider>;
}

export function useSession() {
  const context = useContext(SessionContext);
  if (!context) throw new Error("useSession must be used within SessionProvider");
  return context;
}

export function useLogin() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: AuthPayload) => login(payload),
    onSuccess: (data) => {
      queryClient.setQueryData(["session"], { authenticated: true, user: data.user });
      queryClient.invalidateQueries({ queryKey: ["posts"] });
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    },
  });
}

export function useRegister() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: RegisterPayload) => register(payload),
    onSuccess: (data) => {
      queryClient.setQueryData(["session"], { authenticated: true, user: data.user });
      queryClient.invalidateQueries({ queryKey: ["posts"] });
    },
  });
}

export function useLogout() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: logout,
    onSuccess: () => {
      queryClient.setQueryData(["session"], { authenticated: false, user: null });
      queryClient.removeQueries({ queryKey: ["notifications"] });
    },
  });
}
