Cypress.Commands.add("loginAsAdmin", () => {
  cy.visit("/login");
  cy.get('input[name="email"]').type("admin@cesizen.fr");
  cy.get('input[name="password"]').type("Admin1234!");
  cy.get('button[type="submit"]').click();
});
