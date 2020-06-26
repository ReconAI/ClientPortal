export const checkWhetherMatchesRouteWithoutProfileInit = (url: string): boolean => {
  // activate/uidb64/token
  if (url.match(/\/activate\/.+\/.+/)) {
    return true;
  }

  return false;
};
