import type { ReactNode } from "react";
import { ConfigProvider, theme as antdTheme } from "antd";
import { useTheme } from "./ThemeProvider";

export function AntdProvider({ children }: { children: ReactNode }) {
  const { theme } = useTheme();

  return (
    <ConfigProvider
      componentSize="middle"
      theme={{
        algorithm: theme === "dark" ? antdTheme.darkAlgorithm : antdTheme.defaultAlgorithm,
        token: {
          colorPrimary: theme === "dark" ? "#9cb7ff" : "#3d6aff",
          colorBgBase: theme === "dark" ? "#07111f" : "#eef3fb",
          colorTextBase: theme === "dark" ? "#eff4ff" : "#142136",
          borderRadius: 18,
          fontFamily: '"Segoe UI", "PingFang SC", "Microsoft YaHei", sans-serif',
        },
      }}
    >
      {children}
    </ConfigProvider>
  );
}
