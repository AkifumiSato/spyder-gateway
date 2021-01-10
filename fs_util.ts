import { expandGlob } from "https://deno.land/std@0.83.0/fs/mod.ts";
import { Route } from "./types.d.ts";

export const readApiDirectory = async (apiPath: string): Promise<Route[]> => {
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

// const delayResolver = async () => {
//   const [apiPath] = Deno.args;
//   if (!apiPath) throw new Error("specified your api directory path.");
//   // todo リクエストがきてから動的にModuleをImport
// };
