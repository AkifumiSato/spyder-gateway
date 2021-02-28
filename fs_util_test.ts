import { assertEquals } from "https://deno.land/std@0.83.0/testing/asserts.ts";
import { readTsFilePaths } from "./fs_util.ts";

Deno.test("[readTsFilePaths] all green", async () => {
  const result = await readTsFilePaths("test_data/all_green");
  const expectRoot = Deno.cwd() + "/test_data/all_green";
  assertEquals(result[0], ["/foo/data_1", expectRoot + "/foo/data_1.ts"]);
  assertEquals(result[1], ["/foo/data_2", expectRoot + "/foo/data_2.ts"]);
});

Deno.test("[readTsFilePaths] all green with /", async () => {
  const result = await readTsFilePaths("test_data/all_green/");
  const expectRoot = Deno.cwd() + "/test_data/all_green";
  assertEquals(result[0], ["/foo/data_1", expectRoot + "/foo/data_1.ts"]);
  assertEquals(result[1], ["/foo/data_2", expectRoot + "/foo/data_2.ts"]);
});
