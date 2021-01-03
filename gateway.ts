import {
  Application,
  Request,
  Router,
} from "https://deno.land/x/oak@v6.4.1/mod.ts";

type Route = {
  url: string;
  handler: (req: Request) => Record<string, unknown>;
};

type Option = {
  port?: number;
};

export const serve = async (routes: Route[], option?: Option) => {
  const app = new Application();
  const router = new Router();

  // config page
  router.get("/__config__", (ctx) => {
    ctx.response.body = "config page.";
  });

  routes.forEach(({ url, handler }) => {
    router.get(url, (ctx) => {
      console.log(`request url: [${ctx.request.url}]`);
      ctx.response.type = "application/json";
      ctx.response.body = JSON.stringify(handler(ctx.request));
    });
  });

  app.use(router.routes());

  const port = option?.port ?? 6007;
  console.log(`server listening on ${port}`);
  await app.listen({ port });
};
