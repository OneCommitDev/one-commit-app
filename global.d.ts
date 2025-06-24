declare module "nativewind" {
  export const NativeWindProvider: React.ComponentType<{
    theme?: "light" | "dark";
    children: React.ReactNode;
  }>;
}
