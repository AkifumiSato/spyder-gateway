import { Handler } from "../../../types.d.ts";

export const handler: Handler<{ name: string }> = (req, params) => {
  return {
    name: `${params.name}`,
  };
};
