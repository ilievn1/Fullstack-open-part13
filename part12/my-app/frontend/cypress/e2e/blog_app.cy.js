import { slowCypressDown } from 'cypress-slow-down'
slowCypressDown(800)
describe('Bloglist app', function() {
  beforeEach(function() {
    cy.request('POST', `${Cypress.env('BACKEND')}/testing/reset`)
    const testUser = {
      name: 'Test User',
      username: 'testuser',
      password: 'testuser'
    }
    const rootUser = {
      name: 'Root User',
      username: 'rootuser',
      password: 'rootuser'
    }
    cy.request('POST', `${Cypress.env('BACKEND')}/users`, testUser)
    cy.request('POST', `${Cypress.env('BACKEND')}/users`, rootUser)

    cy.visit('')
  })

  it('Login form is shown',  function() {
    cy.contains('username')
    cy.contains('password')
    cy.contains('login')

  })

  describe('Login',function() {
    it('succeeds with correct credentials', function() {
      cy.get('#usernameInputField').type('testuser')
      cy.get('#passwordInputField').type('testuser')
      cy.get('#login-btn').click()
      cy.contains('Test User logged in')
    })

    it('fails with wrong credentials', function() {
      cy.get('#usernameInputField').type('wrongUser')
      cy.get('#passwordInputField').type('wrongUser')
      cy.get('#login-btn').click()
      cy.get('.notification')
        .should('contain', 'Wrong credentials')
        .and('have.css', 'color', 'rgb(255, 0, 0)')
      cy.contains('wrongUser logged in').should('not.exist')
    })
  })

  describe('when logged in', function() {
    beforeEach(function() {
      cy.login({ username: 'testuser', password: 'testuser' })
    })

    it('a blog can be created', function() {
      cy.contains('new blog').click()
      cy.get('#titleInputField').type('a blog created by cypress')
      cy.get('#authorInputField').type('cypress')
      cy.get('#urlInputField').type('https://stackoverflow.com')
      cy.contains('create').click()
      cy.contains('a blog created by cypress')
    })
    describe('and a blog exists', function () {
      beforeEach(function () {
        cy.createBlog({
          title: 'blog1 cypress',
          author: 'Test User',
          url: 'https://blog1.com'
        })
        cy.createBlog({
          title: 'blog2 cypress',
          author: 'Test User',
          url: 'https://blog2.com'
        })
        cy.createBlog({
          title: 'blog3 cypress',
          author: 'Test User',
          url: 'https://blog3.com'
        })
        cy.contains('blog1 cypress').as('b1')
        cy.contains('blog2 cypress').as('b2')
        cy.contains('blog3 cypress').as('b3')
        cy.get('@b1').find('button:contains("view")').click()
        cy.get('@b2').find('button:contains("view")').click()
        cy.get('@b3').find('button:contains("view")').click()
      })

      it('blog1 can be liked', function () {
        cy.contains('blog1 cypress').contains('likes: 0')
        cy.contains('blog1 cypress').find('button:contains("like")').click()
        cy.contains('blog1 cypress').contains('likes: 1')
      })

      it('blog1 does not have delete btn for non-creator', function () {
        cy.login({ username: 'rootuser', password: 'rootuser' })
        cy.contains('view').click()
        cy.contains('delete').should('not.exist')
      })

      it('blog1 has delete btn for creator', function () {
        cy.contains('delete')
      })

      it('blog1 is deleted', function () {
        cy.contains('delete').click()
        cy.contains('blog1 cypress').should('not.exist')
      })

      it('blogs are ordered by likes (desc)', function () {
        // check init order
        cy.get('.blogContents').eq(0).contains('blog1')
        cy.get('.blogContents').eq(1).contains('blog2')
        cy.get('.blogContents').eq(2).contains('blog3')

        // like blogs (timeout 2secs to allow req to be fulfilled)
        cy.get('@b3').find('button:contains("like")', { timeout: 2000 }).click().click().click()
        cy.get('@b2').find('button:contains("like")', { timeout: 2000 }).click().click()

        // check final order
        const expectedOrder = ['likes: 3', 'likes: 2', 'likes: 0']
        cy.get('.blogContents').each(($blog, index) => {
          cy.wrap($blog).contains(expectedOrder[index])
        })

      })
    })


  })
})