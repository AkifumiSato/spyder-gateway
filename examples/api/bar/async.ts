const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const handler = async () => {
  await sleep(1000);
  return {
    name: "async name",
  };
};
