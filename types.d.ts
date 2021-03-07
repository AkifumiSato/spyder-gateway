import { Request } from "https://deno.land/x/oak@v6.4.1/mod.ts";

type AnyParams = {
  param: never;
};

type Handler<
  T extends {
    [key: string]: string | number;
  } = AnyParams,
> = (
  req: Request,
  params: T,
) => Record<string, unknown> | Promise<Record<string, unknown>>;

type ApiModule = {
  handler: Handler;
};

type Route = {
  url: string;
  handler: Handler;
};
