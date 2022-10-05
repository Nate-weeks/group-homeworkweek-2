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
    
    //Set up the delegate
    let delegatorCanVote = await ballotContract.voters(signer.address);
    console.log({ delegatorCanVote });
    
    //Check if giving right to vote succeed
    let delegator = await ballotContract.voters(signer.address);
    console.log({ delegator });


    //Delegating vote
    const delegateVoteTx = await ballotContract.delegate(signer.address)
    const delegateVoteTxReceipt = await delegateVoteTx.wait();
    console.log(delegateVoteTxReceipt);

    //Check if delegation succeed
    const signerAddress = await signer.getAddress()
    delegator = await ballotContract.voters("0x70dFf7097d59460444Eaa6fb54B04672FB86A2BB");
    console.log({ delegator });
    }

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
  });