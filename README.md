# spyder-gateway

spyder-gateway is gateway server for deno.

spyder-gateway acts as an intermediate layer between API and Application, so you
can proxy any process with Typescript.

These mean the following,

- logging for request
- switch request destination to staging or mock response value return during
  development

## Getting start

```sh
// in your api root directory.
deno run --allow-net --allow-read --unstable run.ts
```
