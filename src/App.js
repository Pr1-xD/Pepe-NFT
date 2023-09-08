import './App.css';
import {ethers} from 'ethers';
import { useEffect, useState } from 'react';
import json from './contract/nft.json';
import Mint from './Mint'

const contractAddress = "0x78ed29165eFa3c26bD2936d64DfB2F7135ED6c01";
const abi = json.abi


function App() {
  const [balance, updateBalance] = useState(0);
  const [ethBalance, updateEthBalance] = useState(0);
  const [currentAccount, setCurrentAccount] = useState(null);

  const connectWalletHandler = async () => {
    const { ethereum } = window;

    if (!ethereum) {
      alert("Please install Metamask!");
    }

    try {
      const accounts = await ethereum.request({ method: 'eth_requestAccounts' });
      console.log("Found an account! Address: ", accounts[0]);
      setCurrentAccount(accounts[0]);
    } catch (err) {
      console.log(err)
    }
  }

  async function fetchBalance() {
    if (typeof window.ethereum !== "undefined") {
      await connectWalletHandler();
      
      //ethereum is usable get reference to the contract
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      console.log('signer',signer)
      const accounts = await provider.send("eth_requestAccounts", []);
      const contract = new ethers.Contract(contractAddress, abi, provider);
      console.log(accounts)

      try {
          let data = await contract.balanceOf(accounts[0]);
          data=parseInt(data)
          console.log(data)
          updateBalance(data)
          console.log("Data: ", data);
      } catch (e) {
          console.log("Err: ", e)
      }
    }
}

fetchBalance()

async function fetchEtherBalance() {
  if (typeof window.ethereum !== "undefined") {
    await connectWalletHandler();
    
    //ethereum is usable get reference to the contract
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const accounts = await provider.send("eth_requestAccounts", []);

    try {
        let data = await provider.getBalance(currentAccount)
        data=parseInt(data)
        console.log(data/10**18)
        updateEthBalance(data/10**18)
    } catch (e) {
        console.log("Err: ", e)
    }
  }
}

fetchEtherBalance()



const checkWalletIsConnected = async () => {
  const { ethereum } = window;

  if (!ethereum) {
    console.log("Make sure you have Metamask installed!");
    return;
  } else {
    console.log("Wallet exists! We're ready to go!")
  }

  const accounts = await ethereum.request({ method: 'eth_accounts' });

  if (accounts.length !== 0) {
    const account = accounts[0];
    console.log("Found an authorized account: ", account);
    setCurrentAccount(account);
  } else {
    console.log("No authorized account found");
  }
}


const connectWalletButton = () => {
  return (
    <button onClick={connectWalletHandler} className='flex flex-col justify-center cta-button connect-wallet-button'>
      Connect Wallet
    </button>
  )
}


  return (
    <div>
       {currentAccount?<Mint balance={balance} ethBalance={ethBalance} account={currentAccount} fetchEtherBalance={fetchEtherBalance}/>:connectWalletButton()}
    </div>
  );
}

export default App;
