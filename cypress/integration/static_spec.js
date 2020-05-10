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
