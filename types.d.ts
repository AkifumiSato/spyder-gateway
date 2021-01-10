import { Request } from "https://deno.land/x/oak@v6.4.1/mod.ts";

type Handler = (req: Request) => Record<string, unknown>;

type ApiModule = {
  handler: Handler;
};

type ReadModule = Partial<ApiModule>;

type Route = {
  url: string;
  handler: Handler;
};
