import users from '../fixtures/users.json'

describe('Tests for the general user read page', () => {
  beforeEach(() => {
    cy.login(users.general_user.username, users.general_user.password)
    cy.visit(Cypress.env('host') + '/read')
  })

  it('The content should load', () => {
    cy.contains('Preface')
  })

  it('Should be possible to navigate between chapters', () => {
    cy.get('[aria-label="menu"]').click()
    cy.contains('1 INTRODUCTION').click()
    cy.contains('1 INTRODUCTION')
  })
})

describe('Tests for the operator read page', () => {
  beforeEach(() => {
    cy.login(users.operator.username, users.operator.password)
    cy.visit(Cypress.env('host') + '/read')
  })

  it('The content should load', () => {
    cy.contains('Preface')
  })

  it('Should be possible to navigate between chapters', () => {
    cy.get('[aria-label="menu"]').click()
    cy.contains('1 INTRODUCTION').click()
    cy.contains('1 INTRODUCTION')
  })
})

describe('Tests for the admin read page', () => {
  beforeEach(() => {
    cy.login(users.admin.username, users.admin.password)
    cy.visit(Cypress.env('host') + '/read')
  })

  it('The content should load', () => {
    cy.contains('Preface')
  })

  it('Should be possible to navigate between chapters', () => {
    cy.get('[aria-label="menu"]').click()
    cy.contains('1 INTRODUCTION').click()
    cy.contains('1 INTRODUCTION')
  })

  it('Should be possible to edit the chapters', () => {
    cy.get('[aria-label="create"]').click()
    cy.get('.jodit-container').should('exist')
    cy.get('[aria-label="save"]').click()
  })

  it('Should be possible to add chapters', () => {
    cy.get('[aria-label="menu"]').click()
    cy.contains('+ Add new chapter')
  })
})
