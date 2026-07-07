declare module "rss-parser-browser" {
  export default class Parser {
    constructor(options?: {
      customFields?: { item?: string[]; feed?: string[] };
    });
    parseURL(
      url: string,
      options: Record<string, unknown>,
      callback: (err: Error | null, result: unknown) => void,
    ): void;
  }
}
