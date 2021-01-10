import { Request } from "https://deno.land/x/oak@v6.4.1/mod.ts";

type Route = {
  url: string;
  handler: (req: Request) => Record<string, unknown>;
};
