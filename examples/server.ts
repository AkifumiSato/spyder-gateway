import { serve } from "../mod.ts";
import { handler } from "./api/bar/foo.ts";

await serve([
  {
    url: "/bar/foo",
    handler,
  },
]);
