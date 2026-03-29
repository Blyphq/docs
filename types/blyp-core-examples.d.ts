declare module "@blyp/core" {
  export const logger: any;
  export function createStandaloneLogger(config?: any): any;
  export function createStructuredLog(name: string, fields?: any): any;
}
