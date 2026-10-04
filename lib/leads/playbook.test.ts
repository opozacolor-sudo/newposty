import assert from "node:assert/strict";
import test from "node:test";
import {
  parseConsent,
  parseContact,
  parseMoneyAndMonths,
  parsePurchaseMethod,
  qualifyAutoCredit,
} from "./playbook";
import { looksLikePraiseOnly, textMatchesPhrases } from "./triggers";

const playbook = {
  kind: "auto_credit",
  product_name: "Renault",
  product_price: 20000,
  debt_ratio: 0.4,
  months: 60,
  cash_factor: 0.6,
};

test("credit formula is salary * 0.4 * 60 / 0.6", () => {
  const result = qualifyAutoCredit({ playbook, salary: 8000, tenureMonths: 12 });
  assert.equal(result.maxPrice, 320000);
  assert.equal(result.eligible, true);
});

test("below product price is not eligible", () => {
  const result = qualifyAutoCredit({
    playbook: { ...playbook, product_price: 400000 },
    salary: 8000,
  });
  assert.equal(result.eligible, false);
});

test("parses consent, method, income, and contact", () => {
  assert.equal(parseConsent("DA"), true);
  assert.equal(parseConsent("yes"), true);
  assert.equal(parseConsent("nu"), false);
  assert.equal(parsePurchaseMethod("pe credit"), "credit");
  assert.equal(parsePurchaseMethod("am banii"), "cash");
  assert.deepEqual(parseMoneyAndMonths("lucrez de 12 luni, salariu 8000"), {
    salary: 8000,
    tenureMonths: 12,
  });
  const contact = parseContact("Ion Popescu 0722123456 ion@test.ro");
  assert.equal(contact.phone, "0722123456");
  assert.equal(contact.email, "ion@test.ro");
  assert.match(contact.fullName || "", /Ion/);
});

test("interest phrases skip praise", () => {
  assert.equal(textMatchesPhrases("cât costă?", ["cât costă", "pret"]), true);
  assert.equal(textMatchesPhrases("super poza", ["pret", "vreau"]), false);
  assert.equal(looksLikePraiseOnly("super"), true);
  assert.equal(looksLikePraiseOnly("super poza"), true);
  assert.equal(looksLikePraiseOnly("mai e valabil?"), false);
});
