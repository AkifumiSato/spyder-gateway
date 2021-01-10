import { expandGlob } from "https://deno.land/std@0.83.0/fs/mod.ts";
import { ApiModule, ReadModule, Route } from "./types.d.ts";

type Mock = {
  globMocks: () => AsyncIterableIterator<{ path: string }>;
  importMock: (path: string) => Promise<ApiModule>;
};

export const readApiDirectory = async (
  apiPath: string,
  mock?: Mock,
): Promise<Route[]> => {
  const result: Route[] = [];
  const entryPromises = mock?.globMocks() ??
    expandGlob(`${Deno.cwd()}/${apiPath}/**/*.ts`);

  const apiImport = (path: string): Promise<ReadModule> => {
    if (mock?.importMock) {
      return mock.importMock(path);
    }
    return import(path);
  };

  for await (const entry of entryPromises) {
    const module = await apiImport(entry.path);
    if (!module.handler) throw new Error("must export handler functions.");
    result.push({
      url: "/" + entry.path
        .replace(`${Deno.cwd()}/${apiPath}`, "")
        .replace(".ts", ""),
      handler: (module as ApiModule).handler,
    });
  }

  return result;
};

// const delayResolver = async () => {
//   const [apiPath] = Deno.args;
//   if (!apiPath) throw new Error("specified your api directory path.");
//   // todo リクエストがきてから動的にModuleをImport
// };
