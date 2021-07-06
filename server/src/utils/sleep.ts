export const sleep = async (ms: number) => {
  return new Promise((res) => setTimeout(res, ms));
};
