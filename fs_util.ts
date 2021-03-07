import { expandGlob } from "https://deno.land/std@0.83.0/fs/mod.ts";

type UrlAndModulePath = [string, string];

export const readTsFilePaths = async (
  apiPath: string,
): Promise<UrlAndModulePath[]> => {
  const result: UrlAndModulePath[] = [];
  const normalizePath = apiPath.replace(/\/$/, "");
  const entryPromises = expandGlob(`${Deno.cwd()}/${normalizePath}/**/*.ts`);

  for await (const entry of entryPromises) {
    const url = entry.path
      .replace(`${Deno.cwd()}/${normalizePath}`, "")
      .replace(/\[\w*\]/g, "\:$&")
      .replace("[", "")
      .replace("]", "")
      .replace(".ts", "");
    result.push([url, entry.path]);
  }
  return result;
};
