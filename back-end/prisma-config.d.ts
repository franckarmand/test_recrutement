// Ambient module declaration for the runtime-only Prisma Config helper
// Some editors/TypeScript cannot resolve 'prisma/config' because it's provided
// by the Prisma CLI/runtime and doesn't publish types to @types.
// This file tells TypeScript that the module exists so the editor stops complaining.
declare module 'prisma/config' {
  export function defineConfig(cfg: any): any;
  export function env(name: string): string;
}
