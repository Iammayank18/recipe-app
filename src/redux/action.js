export const authUser = (n) => {
  return {
    type: "AUTHENTICATED",
    payload: n,
  };
};
