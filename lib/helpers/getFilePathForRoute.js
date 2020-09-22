// Return the file for the given route
const getFilePathForRoute = (route, extension) => {
  // Replace / with /index
  const path = route.replace(/^\/$/, "/index");

  return `${path}.${extension}`;
};

module.exports = getFilePathForRoute;
