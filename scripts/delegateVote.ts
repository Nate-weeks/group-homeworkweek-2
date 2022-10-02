import { ethers } from "ethers";
import { Ballot, Ballot__factory } from "../typechain-types";
import * as dotenv from "dotenv";

dotenv.config()

async function main() {
    const options = {
        alchemy: process.env.ALCHEMY_API_KEY,
        infura: process.env.INFURA_API_KEY
    }
    const provider = ethers.getDefaultProvider("goerli", options);
    const wallet = ethers.Wallet.fromMnemonic(process.env.MNEMONIC ?? " ")
    const signer = wallet.connect(provider);
    const balanceBN = await signer.getBalance();
    const balance = Number(ethers.utils.formatEther(balanceBN));
    console.log(balance)
    if (balance < 0.01) {
      throw new Error("Not enough ether")
    }
    const ballotFactory = new Ballot__factory(signer);
    const ballotContract = await ballotFactory.attach("0x83fdE54d294bd2D2a52C56eF90C2C09cD8ad7222")

    console.log("Live Address:\t" + ballotContract.address);
    const addressArray = ["0x8adfAACc8B818C1Fb7868860Ab453a8B46aCB7d3", "0x70dFf7097d59460444Eaa6fb54B04672FB86A2BB", "0x063175d9578985863B71E96e9a739D6441eaf018"]
    addressArray.forEach( async (address) => {
        const giveRightToVotTx = await ballotContract.giveRightToVote(
            address
          );
        const giveRightToVoteTxReceipt = await giveRightToVotTx.wait()
        console.log(giveRightToVoteTxReceipt)
        let voterForAddress1 = await ballotContract.voters(address)
        console.log(voterForAddress1)
    })
    // const giveRightToVotTx = await ballotContract.giveRightToVote(
    //     "0x70dFf7097d59460444Eaa6fb54B04672FB86A2BB"
    //   );
    // const giveRightToVoteTxReceipt = await giveRightToVotTx.wait()
    // console.log(giveRightToVoteTxReceipt)
    let voterForAddress1 = await ballotContract.voters('0x063175d9578985863B71E96e9a739D6441eaf018')
    console.log(voterForAddress1)
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
  });