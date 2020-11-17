/// <reference types path="../support/index.d.ts" />
import users from '../fixtures/users.json'

describe('Tests for login page', () => {
  beforeEach(() => {
    cy.clearLocalStorage()
    cy.visit(Cypress.env('host'))
  })
  Object.values(users).forEach((user) =>
    it('Should log the user in with valid credentials and get a token', function () {
      cy.location('pathname').should('equal', '/login')
      cy.contains('Username').click().type(user.username)
      cy.contains('Password').click().type(user.password)
      cy.contains('Log in').click()
      cy.location('pathname')
        .should('equal', '/')
        .then(() => expect(localStorage.getItem('token')).to.be.a('string'))
    })
  )

  it('fails to access protected resource', () => {
    cy.request({
      url: Cypress.env('host') + '/read',
    })

    cy.location('pathname').should('equal', '/login')
  })

  it('Does not log in with invalid password', () => {
    cy.location('pathname').should('equal', '/login')

    // enter valid username and password
    cy.contains('Username').click().type('username')
    cy.contains('Password').click().type('wrong-password')
    cy.contains('Log in').click()

    // still on /login page plus an error is displayed
    cy.location('pathname').should('equal', '/login')
    cy.contains('User not found').should('be.visible')
  })

  it('should be able to log in programmatically', () => {
    cy.login(users.admin.username, users.admin.password)
    cy.visit(Cypress.env('host') + '/read')
    cy.location('pathname').should('equal', '/read')
  })
})
