const API = "http://localhost:8000"

const VALID_USER = {
  id: 1,
  nom: "Dupont",
  prenom: "Jean",
  email: "jean.dupont@example.com",
  date_naissance: "1990-06-15",
  ville: "Paris",
  code_postal: "75001",
}

function fillForm({
  lastName = "Dupont",
  firstName = "Jean",
  email = "jean.dupont@example.com",
  city = "Paris",
  postalCode = "75001",
}: Partial<Record<"lastName" | "firstName" | "email" | "city" | "postalCode", string>> = {}) {
  cy.get("#lastName").type(lastName)
  cy.get("#firstName").type(firstName)
  cy.get("#email").type(email)
  cy.contains("button", "Choisir une date").click()
  cy.get("select").eq(1).select("1990", { force: true })
  cy.get('[role="gridcell"]').contains("15").click()
  cy.get("#city").type(city)
  cy.get("#postalCode").type(postalCode)
}

function login() {
  cy.intercept("POST", `${API}/login`, { success: true }).as("login")
  cy.visit("/ci-cd/login")
  cy.get("#email").type("admin@example.com")
  cy.get("#password").type("password")
  cy.get('button[type="submit"]').click()
  cy.wait("@login")
  cy.url().should("include", "/users")
}

describe("Registration e2e", () => {
  it("Navigation vers la page → Aucun utilisateur inscrit → Navigation vers la page de formulaire → Ajout d'un nouvel utilisateur sans erreur → Navigation vers la page d'accueil → Un utilisateur inscrit", () => {
    // Mock: empty user list
    cy.intercept("GET", `${API}/users`, { utilisateurs: [] }).as("getUsersEmpty")

    // Login and go to users page
    login()
    cy.contains("Aucun inscrit pour le moment.")

    // Navigate to form page
    cy.visit("/ci-cd/")
    cy.contains("Formulaire d'inscription")

    // Mock: POST success + updated GET with 1 user
    cy.intercept("POST", `${API}/users`, { statusCode: 200 }).as("createUser")
    cy.intercept("GET", `${API}/users`, { utilisateurs: [VALID_USER] }).as("getUsersOne")

    // Fill and submit
    fillForm()
    cy.get('button[type="submit"]').click()
    cy.wait("@createUser")
    cy.contains("Sauvegardé.")

    // Navigate to users page — should see 1 user
    cy.visit("/ci-cd/users")
    cy.contains("Inscrits (1)")
  })

  it("Navigation vers la page → 1 utilisateur inscrit → Navigation vers la page de formulaire → Ajout d'un nouvel utilisateur avec erreur → Navigation vers la page d'accueil → Toujours 1 utilisateur inscrit", () => {
    // Mock: 1 user in list
    cy.intercept("GET", `${API}/users`, { utilisateurs: [VALID_USER] }).as("getUsersOne")

    // Login and go to users page
    login()
    cy.contains("Inscrits (1)")

    // Navigate to form page
    cy.visit("/ci-cd/")
    cy.contains("Formulaire d'inscription")

    // Mock: POST error
    cy.intercept("POST", `${API}/users`, { statusCode: 500 }).as("createUserError")

    // Fill and submit
    fillForm()
    cy.get('button[type="submit"]').click()
    cy.wait("@createUserError")
    cy.contains("Erreur lors de la sauvegarde.")

    // Navigate to users page — should still see 1 user
    cy.visit("/ci-cd/users")
    cy.contains("Inscrits (1)")
  })
})
