import s from "./Home.module.css";
import { useState, useEffect, useRef } from "react";

import { Web3Modal } from '@web3modal/react';
import { EthereumClient, w3mConnectors, w3mProvider } from '@web3modal/ethereum';
import { configureChains, createClient } from 'wagmi';
import { arbitrum, mainnet, polygon } from 'wagmi/chains';
import Web3 from "web3";
import MenuContainer from "../Menu/MenuContainer";
import MintContainer from "../Mint/MintContainer";
import Lore from "../Lore/Lore";
import Info from "../Info/Info";

const Home = (props) => {
    const [ type, setType ] = useState(1);
    const ref = useRef(null);
    const [ panelHeight, setPanelHeight ] = useState(0);

    useEffect(() => {
        if(ref){
            setPanelHeight(ref.current.offsetHeight - document.documentElement.offsetHeight);
        }
    }, [ref]);

    const chains = [arbitrum, mainnet, polygon];
    const infuraProvider = `https://mainnet.infura.io/v3/5af80a4c29b24c009d51a66e971713e2`;
    const projectId = 'f7f6b33fdb0c7cdc8a96d58f172596c8';

    const { provider } = configureChains(chains, [w3mProvider({ provider: infuraProvider, projectId })]);
    const wagmiClient = createClient({
        autoConnect: true,
        connectors: w3mConnectors({ version: 1, chains }),
        provider,
    });

    const web3Provider = new Web3(infuraProvider);
    const ethereumClient = new EthereumClient(wagmiClient, chains, web3Provider);
    
    return(
        <>
            <main ref={ref} className={s.main} style={{height: `calc(100vh - ${panelHeight}px)`}} >
                <div className={s.bg}>
                    <MenuContainer type={type} setType={setType} />
                    <div className={s.container}>
                        {
                            type === 1 ? <MintContainer wagmiClient={wagmiClient} ethereumClient={ethereumClient} />:
                            type === 2 ? <Lore />:
                            type === 3 ? <Info />: null
                        }
                    </div>
                </div>
            </main>
            <Web3Modal projectId={projectId} ethereumClient={ethereumClient} />
        </>
    )
}

export default Home;