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
