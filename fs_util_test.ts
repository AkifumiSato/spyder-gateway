import { assertEquals } from "https://deno.land/std@0.83.0/testing/asserts.ts";
import { readApiDirectory } from "./fs_util.ts";
import { Request } from "https://deno.land/x/oak@v6.4.1/mod.ts";

Deno.test("[readApiDirectory] multi mock files", async () => {
  const mockPaths = [
    {
      path: "dummy1/a.ts",
    },
    {
      path: "dummy1/b.ts",
    },
    {
      path: "dummy2/c.ts",
    },
  ];

  const result = await readApiDirectory("/not_exist", {
    globMocks: async function* () {
      for (const path of mockPaths) {
        yield Promise.resolve(path);
      }
    },
    importMock: (path) =>
      Promise.resolve({
        handler: () => ({ path }),
      }),
  });
  assertEquals(result[0].url, "/dummy1/a");
  assertEquals(result[0].handler({} as Request), mockPaths[0]);
  assertEquals(result[1].url, "/dummy1/b");
  assertEquals(result[1].handler({} as Request), mockPaths[1]);
  assertEquals(result[2].url, "/dummy2/c");
  assertEquals(result[2].handler({} as Request), mockPaths[2]);
});
