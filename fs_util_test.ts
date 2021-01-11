import {
  assertEquals,
  assertThrowsAsync,
} from "https://deno.land/std@0.83.0/testing/asserts.ts";
import { readApiDirectory } from "./fs_util.ts";

Deno.test("[readApiDirectory] all green", async () => {
  const result = await readApiDirectory("test_data/all_green");

  assertEquals(result[0].url, "/foo/data_1");
  const data1 = await import("./test_data/all_green/foo/data_1.ts");
  assertEquals(result[0].handler, data1.handler);

  assertEquals(result[1].url, "/foo/data_2");
  const data2 = await import("./test_data/all_green/foo/data_2.ts");
  assertEquals(result[1].handler, data2.handler);
});

Deno.test("[readApiDirectory] all green with /", async () => {
  const result = await readApiDirectory("test_data/all_green/");

  assertEquals(result[0].url, "/foo/data_1");
});

Deno.test("[readApiDirectory] has no handler file", async () => {
  await assertThrowsAsync(
    () => readApiDirectory("test_data/has_no_handler"),
    Error,
    "must export handler functions.",
  );
});
