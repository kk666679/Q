// Type stubs for vercel/workflows — not yet a published package.
// Replace with real imports when the SDK is available.
declare module 'vercel/workflows' {
  export function useWorkflow(name: string, fn: (input: any, ctx: any) => Promise<any>): any;
  export function useStep(name: string, fn: (input: any) => Promise<any>): any;
  export function hook(name: string, config: any): any;
  export function sleep(duration: string): Promise<void>;
}
