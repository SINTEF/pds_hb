import users from '../fixtures/users.json'
import component from '../fixtures/component.json'

describe('Tests for the admin homepage', () => {
  beforeEach(() => {
    cy.login(users.admin.username, users.admin.password)
    cy.visit(Cypress.env('host'))
  })

  it('Should possible able to search', () => {
    cy.get('input').click().type(component.name.slice(0, 5))
    cy.contains(component.name).click()
    cy.location('pathname').should('equal', '/browse/view/Flame-detector/')
  })

  it('Should be possible to navigate to the read page', () => {
    cy.get('button').contains('Read and edit PDS datahandbook').click()
    cy.location('pathname').should('equal', '/read')
  })

  it('Should be possible to navigate to the browse page', () => {
    cy.get('button').contains('Browse and edit equipment data').click()
    cy.location('pathname').should('equal', '/browse')
  })
})

describe('Tests for the operator homepage', () => {
  beforeEach(() => {
    cy.login(users.operator.username, users.operator.password)
    cy.visit(Cypress.env('host'))
  })

  it('Should possible able to search', () => {
    cy.get('input').click().type(component.name.slice(0, 5))
    cy.contains(component.name).click()
    cy.location('pathname').should('equal', '/browse/view/Flame-detector/')
  })

  it('Should be possible to navigate to the read page', () => {
    cy.get('button').contains('Read PDS datahandbook').click()
    cy.location('pathname').should('equal', '/read')
  })

  it('Should be possible to navigate to the browse page', () => {
    cy.get('button').contains('Browse equipment data').click()
    cy.location('pathname').should('equal', '/browse')
  })

  it('Should be possible to navigate to the browse own data page', () => {
    cy.get('button').contains('Browse own equipment data').click()
    cy.location('pathname').should('equal', '/company/registered-data')
  })

  it('Should be possible to navigate to the add data page', () => {
    cy.get('button').contains('Add data').click()
    cy.location('pathname').should('equal', '/add')
  })
})

describe('Tests for the general user homepage', () => {
  beforeEach(() => {
    cy.login(users.general_user.username, users.general_user.password)
    cy.visit(Cypress.env('host'))
  })

  it('Should possible able to search', () => {
    cy.get('input').click().type(component.name.slice(0, 5))
    cy.contains(component.name).click()
    cy.location('pathname').should('equal', '/browse/view/Flame-detector/')
  })

  it('Should be possible to navigate to the read page', () => {
    cy.get('button').contains('Read PDS datahandbook').click()
    cy.location('pathname').should('equal', '/read')
  })

  it('Should be possible to navigate to the browse page', () => {
    cy.get('button').contains('Browse equipment data').click()
    cy.location('pathname').should('equal', '/browse')
  })
})
