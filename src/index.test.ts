import { before, describe, test } from "node:test";
import { strict as assert } from "assert";
import { Keypair } from "@solana/web3.js";
import { sayHello } from "./index";

describe("Solana Hello World Program", () => {
  let payer: Keypair;

  before(() => {
    payer = Keypair.generate();
  });

  test("successfully sends a transaction", async () => {
    const transactionSignature = await sayHello(payer);
    
    assert.equal(typeof transactionSignature, "string");
    assert(transactionSignature.length > 0);
  });
});