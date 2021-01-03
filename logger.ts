import * as Colors from "https://deno.land/std@0.83.0/fmt/colors.ts";

export const info = (text: string) => {
  console.log(Colors.blue(Colors.bold(text)));
}

export const log = (text: string) => {
  console.log(`${Colors.bgBlue("spyder")} ${text}`);
}

export const error = (text: string) => {
  console.log(`${Colors.bgRed("spyder")} ${text}`);
}
