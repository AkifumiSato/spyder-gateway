import {
  Application,
  Request,
  Router,
} from "https://deno.land/x/oak@v6.4.1/mod.ts";
import { Serve } from "https://deno.land/x/oak@v6.4.1/types.d.ts";
import * as Logger from "./logger.ts";

type Route = {
  url: string;
  handler: (req: Request) => Record<string, unknown>;
};

type Option = {
  port?: number;
  application?: {
    serve: Serve;
  };
};

export const serve = (routes: Route[], option?: Option) => {
  const app = new Application(option?.application);
  const router = new Router();

  // logging
  app.use(async (ctx, next) => {
    await next();
    Logger.log(`request: [status:${ctx.response.status}, url:${ctx.request.url}]`);
  });

  // config page
  router.get("/__config__", (ctx) => {
    ctx.response.body = "config page.";
  });

  routes.forEach(({ url, handler }) => {
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
