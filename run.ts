import { serve } from "./server.ts";

const [apiPath] = Deno.args;
if (!apiPath) throw new Error("specified your api directory path.");

await serve(apiPath);
