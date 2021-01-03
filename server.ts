import {
  Application,
  Request,
  Router,
} from "https://deno.land/x/oak@v6.4.1/mod.ts";
import { Serve } from "https://deno.land/x/oak@v6.4.1/types.d.ts";
import { expandGlob } from "https://deno.land/std@0.83.0/fs/mod.ts";
import * as Logger from "./logger.ts";

type Route = {
  url: string;
  handler: (req: Request) => Record<string, unknown>;
};

const readApiDirectory = async (): Promise<Route[]> => {
  const [apiPath] = Deno.args;
  if (!apiPath) throw new Error("specified your api directory path.");

  const result: Route[] = [];
  for await (const entry of expandGlob(`${Deno.cwd()}/${apiPath}/**/*.ts`)) {
    const module = await import(entry.path);
    if (!module.handler) throw new Error("must export handler functions.");
    result.push({
      url: "/" + entry.path
        .replace(`${Deno.cwd()}/${apiPath}`, "")
        .replace(".ts", ""),
      handler: module.handler,
    });
  }

  return result;
};

type Option = {
  port?: number;
  application?: {
    serve: Serve;
  };
  routes?: Route[];
};

export const serve = async (option?: Option) => {
  const app = new Application(option?.application);
  const router = new Router();

  // logging
  app.use(async (ctx, next) => {
    await next();
    Logger.log(
      `request: [status:${ctx.response.status}, url:${ctx.request.url}]`,
    );
  });

  // config page
  router.get("/__config__", (ctx) => {
    ctx.response.body = "config page.";
  });

  const apiRoutes = option?.routes ?? await readApiDirectory();
  apiRoutes.forEach(({ url, handler }) => {
    router.get(url, (ctx) => {
      ctx.response.type = "application/json";
      ctx.response.body = JSON.stringify(handler(ctx.request));
    });
  });

  app.use(router.routes());

  const port = option?.port ?? 6007;
  Logger.info(`server listening on ${port}`);
  return app.listen({ port });
};
