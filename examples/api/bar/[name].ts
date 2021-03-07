import { Handler } from "../../../types.d.ts";

export const handler: Handler = (req, params) => {
  return {
    name: `${params.name}`,
  };
};
