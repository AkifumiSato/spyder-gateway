import { Request } from "https://deno.land/x/oak@v6.4.1/mod.ts";

type Handler = (req: Request) => Record<string, unknown>;

type ApiModule = {
  handler: Handler;
};

type Route = {
  url: string;
  handler: Handler;
};
