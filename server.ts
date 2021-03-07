import { Application, Router } from "https://deno.land/x/oak@v6.4.1/mod.ts";
import { Serve } from "https://deno.land/x/oak@v6.4.1/types.d.ts";
import * as Logger from "./logger.ts";
import { Route } from "./types.d.ts";

type Option = {
  port?: number;
  debug?: boolean;
  allowOrigin?: string[];
};

type Mock = {
  application?: {
    serve: Serve;
  };
};

export const serve = async (routes: Route[], option?: Option, mock?: Mock) => {
  const app = new Application(mock?.application);
  const router = new Router();

  app.use(async (ctx, next) => {
    // logging
    await next();
    Logger.log(
      `request: [status:${ctx.response.status}, url:${ctx.request.url}]`,
    );
    // cors
    if (option?.allowOrigin?.length) {
      const origin = ctx.request.headers.get("Origin");
      if (origin && option.allowOrigin.includes(origin)) {
        ctx.response.headers.set("Access-Control-Allow-Origin", origin);
      }
    }
  });

  const sortedRoutes = routes.sort((a) => a.url.indexOf(":"));
  sortedRoutes.forEach(({ url, handler }) => {
    router.get(url, async (ctx) => {
      ctx.response.type = "application/json";
      const res = await handler(ctx.request, ctx.params);
      ctx.response.body = JSON.stringify(res);
    });
  });

  app.use(router.routes());

  const port = option?.port ?? 6007;
  Logger.info(`server listening on ${port}`);
  return app.listen({ port });
};
