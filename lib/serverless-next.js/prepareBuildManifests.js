// Copied from serverless-next.js (v1.8.0)
// https://github.com/danielcondemarin/serverless-next.js/blob/master/packages/serverless-nextjs-component/serverless.js
// This file is for reference purposes only.

async prepareBuildManifests(nextConfigPath) {
  const pagesManifest = await this.readPagesManifest(nextConfigPath);

  const defaultBuildManifest = {
    pages: {
      ssr: {
        dynamic: {},
        nonDynamic: {}
      },
      html: {
        dynamic: {},
        nonDynamic: {}
      }
    },
    publicFiles: {},
    cloudFrontOrigins: {}
  };

  const apiBuildManifest = {
    apis: {
      dynamic: {},
      nonDynamic: {}
    }
  };

  const ssrPages = defaultBuildManifest.pages.ssr;
  const htmlPages = defaultBuildManifest.pages.html;
  const apiPages = apiBuildManifest.apis;

  const isHtmlPage = p => p.endsWith(".html");
  const isApiPage = p => p.startsWith("pages/api");

  Object.entries(pagesManifest).forEach(([route, pageFile]) => {
    const dynamicRoute = isDynamicRoute(route);
    const expressRoute = dynamicRoute ? expressifyDynamicRoute(route) : null;

    if (isHtmlPage(pageFile)) {
      if (dynamicRoute) {
        htmlPages.dynamic[expressRoute] = {
          file: pageFile,
          regex: pathToRegexStr(expressRoute)
        };
      } else {
        htmlPages.nonDynamic[route] = pageFile;
      }
    } else if (isApiPage(pageFile)) {
      if (dynamicRoute) {
        apiPages.dynamic[expressRoute] = {
          file: pageFile,
          regex: pathToRegexStr(expressRoute)
        };
      } else {
        apiPages.nonDynamic[route] = pageFile;
      }
    } else if (dynamicRoute) {
      ssrPages.dynamic[expressRoute] = {
        file: pageFile,
        regex: pathToRegexStr(expressRoute)
      };
    } else {
      ssrPages.nonDynamic[route] = pageFile;
    }
  });

  const publicFiles = await this.readPublicFiles(nextConfigPath);

  publicFiles.forEach(pf => {
    defaultBuildManifest.publicFiles["/" + pf] = pf;
  });

  return {
    defaultBuildManifest,
    apiBuildManifest
  };
}
