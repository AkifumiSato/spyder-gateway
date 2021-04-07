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

### in your directory

The files that start the mock server are: mock.ts.

In this case, if you export the `Handler` type in the file(`/api/**/*.ts`), the
mock server will return the execution result according to the file path.

```typescript
// mock.ts
import { serve } from "https://raw.githubusercontent.com/AkifumiSato/spyder-gateway/main/server.ts";
import { readTsFilePaths } from "https://raw.githubusercontent.com/AkifumiSato/spyder-gateway/main/fs_util.ts";
import {
  ApiModule,
  Route,
} from "https://raw.githubusercontent.com/AkifumiSato/spyder-gateway/main/types.d.ts";

const routes: Route[] = [];
const apiEntries = await readTsFilePaths("api"); // example: from this file, `./api`

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

### api mock directory

If the handler file path is `/hoge/fuga.ts`, the mock API URL path will be
`http://localhost:6007/hoge/fuga`.

```typescript
export const sleep = (ms: number) =>
  new Promise((resolve) => setTimeout(resolve, ms));

export const handler = async () => {
  await sleep(1000);
  return {
    name: "[name]",
  };
};
```

### dynamic routes

Next.js like dynamic routing is possible by making the file name something like
`[param].ts`. You can get the matched parameters with the second argument of
`Handler`.

```typescript
import { Handler } from "../../../types.d.ts";

export const handler: Handler<{ name: string }> = (req, params) => {
  return {
    name: `${params.name}`,
  };
};
```
