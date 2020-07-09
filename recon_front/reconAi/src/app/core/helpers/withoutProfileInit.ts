export const checkWhetherMatchesRouteWithoutProfileInit = (
  url: string
): boolean => {
  // activate/uidb64/token
  if (url.match(/\/activate\/.+\/.+/)) {
    return true;
  }

  // activate/uidb64/token
  if (url.match(/\/reset\/.+\/.+/)) {
    return true;
  }

  // invite/uidb64/token
  if (url.match(/\/invite\/.+\/.+/)) {
    return true;
  }

  return false;
};
