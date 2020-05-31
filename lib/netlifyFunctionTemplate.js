// TEMPLATE: This file will be copied to the Netlify functions directory when
//           running next-on-netlify

// Compatibility wrapper for NextJS page
const compat  = require("next-aws-lambda")
// Load the NextJS page
const page    = require("./nextJsPage")

// next-aws-lambda is made for AWS. There are some minor differences between
// Netlify and AWS which we resolve here.
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
