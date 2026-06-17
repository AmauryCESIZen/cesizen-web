describe("Parcours de connexion au back-office", () => {

  // ─── 1. Affichage de la page de connexion ──────────────────
  it("affiche correctement la page de connexion", () => {
    cy.visit("/login");

    cy.contains("h1", "Connexion admin").should("be.visible");

    // Les champs et le bouton sont présents
    cy.get('input[name="email"]').should("be.visible");
    cy.get('input[name="password"]').should("be.visible");
    cy.get('button[type="submit"]').should("contain", "Se connecter");
  });

  // ─── 2. Connexion réussie  ─────────────────
  it("permet à un administrateur de se connecter", () => {
    cy.visit("/login");

    cy.get('input[name="email"]').type("admin@cesizen.fr");
    cy.get('input[name="password"]').type("Admin1234!");
    cy.get('button[type="submit"]').click();
    cy.url().should("include", "/admin");
  });

  // ─── 3. Connexion échouée (mauvais mot de passe) ───────────
  it("affiche une erreur en cas de mauvais identifiants", () => {
    cy.visit("/login");

    cy.get('input[name="email"]').type("admin@cesizen.fr");
    cy.get('input[name="password"]').type("mauvaisMotDePasse");
    cy.get('button[type="submit"]').click();
    cy.get("p.error").should("be.visible");
    cy.url().should("include", "/login");
  });

  // ─── 4. Accès protégé ────────
  it("redirige vers la connexion quand on accède à l'admin sans être connecté", () => {
    cy.visit("/admin");
    cy.url().should("include", "/login");
  });
});
