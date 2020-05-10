// Loads a page and removes all Javascript
// Adapted from https://glebbahmutov.com/blog/ssr-e2e/
Cypress.Commands.add("ssr", (url) => {
  cy.request(url)
    .its('body')
    .then(html => {
      // remove all <script> tags
      // Copied from https://stackoverflow.com/a/6660315/6451879
      html = html.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
      cy.state('document').write(html)
    })

  // Verify that there are no scripts present
  cy.get('script').should('not.exist')
})
