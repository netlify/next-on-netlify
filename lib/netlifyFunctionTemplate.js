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

    // Convert header values to string. Netlify does not support integers as
    // header values. See: https://github.com/netlify/cli/issues/451
    Object.keys(response.multiValueHeaders).forEach(key => {
      response.multiValueHeaders[key] = response.multiValueHeaders[key].map(value => String(value))
    })

    // Invoke callback
    callback(argument, response)
  }
)

exports.handler = (event, context, callback) => {
  // In netlify dev, we currently do not receive headers as multi value headers.
  // So we manually set them from the plain headers. This should become
  // redundant as soon as https://github.com/netlify/cli/pull/938 is published.
  if(!event.hasOwnProperty('multiValueHeaders')) {
    event.multiValueHeaders = {}
    Object.keys(event.headers).forEach(key => {
      event.multiValueHeaders[key] = [event.headers[key]]
    })
  }

  // In netlify dev, we currently do not receive query string as multi value
  // query string. So we manually set it from the plain query string. This
  // should become redundant as soon as https://github.com/netlify/cli/pull/938
  //is published.
  if(!event.hasOwnProperty('multiValueQueryStringParameters')) {
    event.multiValueQueryStringParameters = event.queryStringParameters
  }

  // Get the request URL
  const { path } = event
  console.log("[request]", path)

  // Render the page
  compat(page)(
    {
      ...event,
      // Required. Otherwise, compat() will complain
      requestContext: {},
    },
    context,
    // Wrap the Netlify callback, so that we can resolve differences between
    // Netlify and AWS (which next-aws-lambda optimizes for)
    callbackHandler(callback)
  )
};
