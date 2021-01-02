import { Application, Router } from "https://deno.land/x/oak@v6.4.1/mod.ts";

type Route = {
  url: string;
  response: object;
};

export const serve = async (routes: Route[]) => {
  const app = new Application();
  const router = new Router();

  // config page
  router.get("/__config__", (ctx) => {
    ctx.response.body = "config page.";
  });

  routes.forEach(({ url, response }) => {
    router.get(url, ctx => {
      ctx.response.type = "application/json";
      ctx.response.body = response;
    });
  });

  app.use(router.routes());

  const port = 6007;
  console.log(`server listening on ${port}`);
  await app.listen({ port });
};
