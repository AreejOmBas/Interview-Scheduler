

describe("Appointments", () => {

  beforeEach(() => {
    cy.request("GET","/api/debug/reset")
    cy.visit("/");
    cy.contains("Monday");
  });

  it("should book an interview", () => {
   
 
    cy.get("[alt=Add]")
    .first()
    .click();

    cy.get("[placeHolder='Enter Student Name']")
    .type("Lydia Miller-Jones");

    cy.get("[alt='Sylvia Palmer']").click();

    cy.contains("Save").click();

    cy.contains(".appointment__card--show", "Lydia Miller-Jones");
    cy.contains(".appointment__card--show", "Sylvia Palmer");

  });

  it("should edit an interview", () => {
    cy.get("[alt=Edit]")
    .first()
    .click({force: true});

    cy.get("[placeHolder='Enter Student Name']")
    .clear()
    .type("Lydia Miller-Jones");

    cy.get("[alt='Tori Malcolm']").click();

    cy.contains("Save").click();

    cy.contains(".appointment__card--show", "Lydia Miller-Jones");
    cy.contains(".appointment__card--show", "Tori Malcolm");


  })

});