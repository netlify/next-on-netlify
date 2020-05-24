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

// There are some minor differences between Netlify and AWS, such as AWS having
// support for multi-value headers.
// next-aws-lambda is made for AWS, so we need to resolve those differences to
// make everything work with Netlify.
const callbackHandler = callback => (
  // The callbackHandler wraps the callback
  (argument, response) => {

    // Convert multi-value headers to plain headers, because Netlify does not
    // support multi-value headers.
    // See: https://github.com/netlify/cli/issues/923
    response.headers = {}
    Object.keys(response.multiValueHeaders).forEach(key => {
      response.headers[key] = response.multiValueHeaders[key][0]
    })
    delete response.multiValueHeaders

    // Convert header values to string. Netlify does not support integers as
    // header values. See: https://github.com/netlify/cli/issues/451
    Object.keys(response.headers).forEach(key => {
      response.headers[key] = String(response.headers[key])
    })

    // Invoke callback
    callback(argument, response)
  }
)

exports.handler = (event, context, callback) => {
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
      // Pass query string parameters to NextJS
      multiValueQueryStringParameters: event.queryStringParameters
    },
    context,
    // Wrap the Netlify callback, so that we can resolve differences between
    // Netlify and AWS (which next-aws-lambda optimizes for)
    callbackHandler(callback)
  )
};
