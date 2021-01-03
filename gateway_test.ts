import {
  Serve,
  Server,
  ServerRequest,
  ServerResponse,
} from "https://deno.land/x/oak@v6.4.1/types.d.ts";
import { ListenOptions } from "https://deno.land/x/oak@v6.4.1/application.ts";
import { assertEquals } from "https://deno.land/std@0.83.0/testing/asserts.ts";
import { serve } from "./gateway.ts";

let serverRequestStack: ServerRequest[] = [];
let serverResponseStack: ServerResponse[] = [];

const teardown = () => {
  serverRequestStack = [];
  serverResponseStack = [];
};

class MockServer {
  close(): void {
  }

  async *[Symbol.asyncIterator]() {
    for await (const request of serverRequestStack) {
      yield request;
    }
  }
}

const mockServe: Serve = (
  addr: string | ListenOptions,
): Server => new MockServer() as Server;

const createMockRequest = (
  url = "/index.html",
  proto = "HTTP/1.1",
  headersInit: string[][] = [["host", "example.com"]],
): ServerRequest => ({
  url,
  headers: new Headers(headersInit),
  respond(response: ServerResponse) {
    serverResponseStack.push(response);
    return Promise.resolve();
  },
  method: "GET",
} as ServerRequest);

Deno.test("hello world #1", async () => {
  const expect = {
    name: "example1",
    age: 20,
  };

  serverRequestStack.push(createMockRequest("/foo/bar"));
  await serve([
    {
      url: "/foo/bar",
      handler: () => expect,
    },
  ], {
    application: {
      serve: mockServe,
    },
  });
  const result = (new TextDecoder()).decode(
    serverResponseStack[0].body as Uint8Array,
  );
  assertEquals(expect, JSON.parse(result));
  teardown();
});
