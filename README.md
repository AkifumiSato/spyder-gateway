# spyder-gateway

spyder-gateway is gateway server for deno.

spyder-gateway acts as an intermediate layer between API and Application, so you
can proxy any process with Typescript.

These mean the following,

- logging for request
- switch request destination to staging or mock response value return during
  development

## Getting start

### example run in this repository.

```
deno run --allow-net --allow-read --unstable example.ts
```

### your directory

```typescript
import { serve } from "https://raw.githubusercontent.com/AkifumiSato/spyder-gateway/v0.1.0/server.ts";
import { readTsFilePaths } from "https://raw.githubusercontent.com/AkifumiSato/spyder-gateway/v0.1.0/fs_util.ts";
import {
  ApiModule,
  Route,
} from "https://raw.githubusercontent.com/AkifumiSato/spyder-gateway/v0.1.0/types.d.ts";

const routes: Route[] = [];
const apiEntries = await readTsFilePaths("api");

for (const [url, path] of apiEntries) {
  const module = await import(path);
  if (!module.handler) throw new Error("must export handler functions.");

  routes.push({
    url,
    handler: (module as ApiModule).handler,
  });
}

await serve(routes, {
  allowOrigin: ["http://localhost:3000"],
});
```
