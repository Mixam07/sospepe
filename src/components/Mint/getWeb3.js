import Web3 from "web3";
import { setProvider } from "../../redux/reducers/settings-reducer";

  const getWeb3=async()=>{
    if (window.ethereum) {
      const web3 = new Web3(window.ethereum);
        await window.ethereum.enable();
        setProvider(window.ethereum)
        return ;
      
    } else if (window.web3) {
      const web3 = window.web3;
      console.log("Injected web3 detected.");
      setProvider(window.web3)
      return ;
    } else {
      const provider = new Web3.providers.HttpProvider(
        "https://mainnet.infura.io/v3/24feedd3165e4fe0be30c3d3646ab3b3"
      );
      const web3 = new Web3(provider);
      console.log("No web3 instance injected, using Local web3.");
      setProvider(provider)
      return
    }
  }


export default getWeb3;
