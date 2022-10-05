import { ethers } from "ethers";
import { Ballot, Ballot__factory } from "../typechain-types";
import * as dotenv from "dotenv";

dotenv.config()

async function main() {
    const options = {};
    const provider = ethers.getDefaultProvider("goerli", options);
    const wallet = new ethers.Wallet('privatekey');
    const signer = wallet.connect(provider);
    const balanceBN = await signer.getBalance();
    const balance = Number(ethers.utils.formatEther(balanceBN));
    console.log({balance})
    if (balance < 0.01) {
      throw new Error("Not enough ether")
    }
    const ballotFactory = new Ballot__factory(signer);
    const ballotContract = await ballotFactory.attach("0x83fdE54d294bd2D2a52C56eF90C2C09cD8ad7222")

    console.log("Live Address:\t" + ballotContract.address);
   
    //Voting
    const castVoteTx = await ballotContract.connect(signer).vote(1);
    const castVoteTxReceipt = await castVoteTx.wait();

    console.log(castVoteTxReceipt);
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
  });