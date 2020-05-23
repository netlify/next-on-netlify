const project = "default"

before(() => {
  // When changing the base URL within a spec file, Cypress runs the spec twice
  // To avoid rebuilding and redeployment on the second run, we check if the
  // project has already been deployed.
  cy.task('isDeployed').then(isDeployed => {
    // Cancel setup, if already deployed
    if(isDeployed)
      return

    // Clear project folder
    cy.task('clearProject', { project })

    // Copy NextJS files
    cy.task('copyFixture', {
      project, from: 'pages', to: 'pages'
    })
    cy.task('copyFixture', {
      project, from: 'next.config.js', to: 'next.config.js'
    })

    // Copy package.json file
    cy.task('copyFixture', {
      project, from: 'package.json', to: 'package.json'
    })

    // Copy Netlify settings
    cy.task('copyFixture', {
      project, from: 'netlify.toml', to: 'netlify.toml'
    })
    cy.task('copyFixture', {
      project, from: '.netlify', to: '.netlify'
    })

    // Build
    cy.task('buildProject', { project })

    // Deploy
    cy.task('deployProject', { project })
  })

  // Set base URL
  cy.task('getBaseUrl', { project }).then((url) => {
    Cypress.config('baseUrl', url)
  })
})

after(() => {
  // While the before hook runs twice (it's re-run when the base URL changes),
  // the after hook only runs once.
  cy.task('clearDeployment')
})

describe('SSR page', () => {
  it('loads TV shows', () => {
    cy.visit('/')

    cy.get('ul').first().children().should('have.length', 5)
  })

  it('loads TV shows when SSR-ing', () => {
    cy.ssr('/')

    cy.get('ul').first().children().should('have.length', 5)
  })
})

describe('dynamic SSR page', () => {
  it('loads TV show', () => {
    cy.visit('/shows/24251')

    cy.get('h1').should('contain', 'Show #24251')
    cy.get('p').should('contain',  'Animal Science')
  })

  it('loads TV show when SSR-ing', () => {
    cy.ssr('/shows/24251')

    cy.get('h1').should('contain', 'Show #24251')
    cy.get('p').should('contain',  'Animal Science')
  })
})

describe('dynamic catch-all SSR page', () => {
  it('displays all URL parameters', () => {
    cy.visit('/shows/94/this-is-all/being/captured/yay')

    cy.get('p').should('contain', '[0]: 94')
    cy.get('p').should('contain', '[1]: this-is-all')
    cy.get('p').should('contain', '[2]: being')
    cy.get('p').should('contain', '[3]: captured')
    cy.get('p').should('contain', '[4]: yay')

    cy.get('h1').should('contain', 'Show #94')
    cy.get('p').should('contain',  'Defiance')
  })

  it('displays all URL parameters when SSR-ing', () => {
    cy.visit('/shows/94/this-is-all/being/captured/yay')

    cy.get('p').should('contain', '[0]: 94')
    cy.get('p').should('contain', '[1]: this-is-all')
    cy.get('p').should('contain', '[2]: being')
    cy.get('p').should('contain', '[3]: captured')
    cy.get('p').should('contain', '[4]: yay')

    cy.get('h1').should('contain', 'Show #94')
    cy.get('p').should('contain',  'Defiance')
  })
})

describe('static page', () => {
  it('renders', () => {
    cy.visit('/static')

    cy.get('p').should('contain', 'It is a static page.')
  })

  it('renders when SSR-ing', () => {
    cy.visit('/static')

    cy.get('p').should('contain', 'It is a static page.')
  })
})

describe('dynamic static page', () => {
  it('renders', () => {
    cy.visit('/static/superdynamic')

    cy.get('p').should('contain', 'It is a static page.')
    cy.get('p').should('contain', 'it has a dynamic URL parameter: /static/:id.')
  })

  it('renders when SSR-ing', () => {
    cy.visit('/static/superdynamic')

    cy.get('p').should('contain', 'It is a static page.')
    cy.get('p').should('contain', 'it has a dynamic URL parameter: /static/:id.')
  })
})
