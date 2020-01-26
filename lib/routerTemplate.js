// TEMPLATE: This file will be copied to the Netlify functions directory when
//           running next-on-netlify/run.js

const compat      = require("next-aws-lambda")
const { routes }  = require("./routes.json")

// We have to require all pages here so that Netlify's zip-it-and-ship-it
// method will bundle them. That makes them available for our dynamic require
// statement later.
// We wrap this require in if(false) to make sure it is *not* executed when the
// function runs.
if (false) {
  require("./allPages")
}

// Look through all routes and check each regex against the request URL
const getRoute = path => {
  route = routes.find(({ regex }) => {
    const re = new RegExp(regex, "i");
    return re.test(path);
  })

  // Return the route or the error page
  return route || { file: "pages/_error.js" }
}

exports.handler = (event, context, callback) => {
  // The following lines set event.path in development environments.
  // There is a difference in how Netlify handles redirects locally vs
  // production. Locally, event.path is set to the target of the redirect:
  // /.netlify/functions/nextRouter?_path=...
  // Deployed on Netlify, event.path is the source of the redirect: /posts/3
  const isProduction = context.hasOwnProperty('awsRequestId')
  if(!isProduction) {
    event.path = event.queryStringParameters._path
  }

  // Get the request URL
  const { path } = event
  console.log("[request]", path)


  // Identify the file to render
  const { file } = getRoute(path)
  console.log("[render] ", file)


  // Load the page to render
  // Do not do this: const page = require(`./${file}`)
  // Otherwise, Netlify's zip-it-and-ship-it will attempt to bundle "./"
  // into the function's zip folder and the build will fail
  const pathToFile = `./${file}`
  const page = require(pathToFile)


  // Render the page
  compat(page)(
    {
      ...event,
      // Required. Otherwise, compat() will complain
      requestContext: {},
      // Optional: Pass additional parameters to NextJS
      multiValueQueryStringParameters: {}
    },
    context,
    callback
  )
};
