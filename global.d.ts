declare module "nativewind" {
  export const NativeWindProvider: React.ComponentType<{
    theme?: "light" | "dark";
    children: React.ReactNode;
  }>;
}

declare global {
  interface Global {
    HermesInternal?: any;
  }
    var RNFB_SILENCE_MODULAR_DEPRECATION_WARNINGS: boolean;

  var global: Global;
}
export {};
