import { Request } from "https://deno.land/x/oak@v6.4.1/mod.ts";

export type AnyParams = {
  param: never;
};

export type Handler<
  T extends {
    [key: string]: string | number;
  } = AnyParams,
> = (
  req: Request,
  params: T,
) => Record<string, unknown> | Promise<Record<string, unknown>>;

export type ApiModule = {
  handler: Handler;
};

export type Route = {
  url: string;
  handler: Handler;
};
