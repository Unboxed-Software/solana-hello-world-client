import web3 = require("@solana/web3.js");
import Dotenv from "dotenv";
Dotenv.config();

let programId = new web3.PublicKey(
  "ByEQMcFBK9pyeibXNip6omjg6wzGvSPxQ5gFqUASUWN8"
);

let user = initializeKeypair();
// let connection = new web3.Connection(web3.clusterApiUrl("devnet"));
let connection = new web3.Connection("http://127.0.0.1:8899", "confirmed");

async function main() {
  await connection.requestAirdrop(user.publicKey, web3.LAMPORTS_PER_SOL * 1);

  const signature = await sayHello();
  console.log(signature);
}

main()
  .then(() => {
    console.log("Finished successfully");
  })
  .catch((error) => {
    console.error(error);
  });

export async function sayHello(): Promise<web3.TransactionSignature> {
  const instruction = new web3.TransactionInstruction({
    keys: [],
    programId,
    data: Buffer.alloc(0), // All instructions are hellos
  });

  const sig = await web3.sendAndConfirmTransaction(
    connection,
    new web3.Transaction().add(instruction),
    [user]
  );

  return sig;
}

function initializeKeypair(): web3.Keypair {
  const secret = JSON.parse(process.env.PRIVATE_KEY ?? "") as number[];
  const secretKey = Uint8Array.from(secret);
  const keypairFromSecretKey = web3.Keypair.fromSecretKey(secretKey);
  return keypairFromSecretKey;
}
