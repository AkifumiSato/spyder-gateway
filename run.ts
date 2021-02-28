import { serve } from "./server.ts";
import { readTsFilePaths } from "./fs_util.ts";
import { ApiModule, Route } from "./types.d.ts";

const routes: Route[] = [];
const apiEntries = await readTsFilePaths("examples/api");

for (const [url, path] of apiEntries) {
  const module = await import(path);
  if (!module.handler) throw new Error("must export handler functions.");

  routes.push({
    url,
    handler: (module as ApiModule).handler,
  });
}

await serve(routes);
