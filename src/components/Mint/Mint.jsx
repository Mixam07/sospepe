import loading from "../../assets/gif/loading/loading.gif";
import loading_text from "../../assets/gif/loading/loading.png";
import connect from "../../assets/img/mint/connect.png";
import connected from "../../assets/img/mint/connected.png";
import text from "../../assets/img/mint/text.png";
import plus from "../../assets/img/mint/button/plus.png";
import plus_active from "../../assets/img/mint/button/plus_active.png";
import minus from "../../assets/img/mint/button/minus.png";
import minus_active from "../../assets/img/mint/button/minus_active.png";
import number_1 from "../../assets/img/mint/button/numbers/1.png";
import number_2 from "../../assets/img/mint/button/numbers/2.png";
import number_3 from "../../assets/img/mint/button/numbers/3.png";
import number_4 from "../../assets/img/mint/button/numbers/4.png";
import number_5 from "../../assets/img/mint/button/numbers/5.png";
import sale_not_open from "../../assets/img/mint/mint/sale_not_open.png";
import max from "../../assets/img/mint/mint/max.png";
import mint from "../../assets/img/mint/mint/mint.png";
import mint_active from "../../assets/img/mint/mint/mint_active.png";
import mint_1 from "../../assets/img/mint/mint/numbers/1.png";
import mint_2 from "../../assets/img/mint/mint/numbers/2.png";
import mint_3 from "../../assets/img/mint/mint/numbers/3.png";
import mint_4 from "../../assets/img/mint/mint/numbers/4.png";
import mint_5 from "../../assets/img/mint/mint/numbers/5.png";
import faild from "../../assets/img/mint/faild.png";
import close from "../../assets/img/mint/close.png";
import success from "../../assets/img/mint/success.png";
import view from "../../assets/img/mint/view.png";

import { useEffect, useRef, useState } from "react";
import s from "./Mint.module.css";
import { Web3Button } from '@web3modal/react';
import { WagmiConfig } from 'wagmi';
import classNames from "classnames";

import getWeb3 from "./getWeb3";
import axios from "axios";
import Web3 from "web3";

const Mint = (props) => {
    const [ number, setNumber ] = useState(1);
    const [ maxNumber, setMaxNumber ] = useState(5);
    const [ isMax, setIsMax ] = useState(false);
    const [ status, setStatus ] = useState("");//loading faild success
    const [ transactionHash, setTransactionHash ] = useState("");
    const [ abi, setAbi ] = useState([]);
    const [ isIncludedInWhitelist, setIsIncludedInWhitelist ] = useState(false);
    const contract = useRef(null);
    const web3 = useRef(null);
    const [ balance, setBalance ] = useState(0);
    const [ isFirst, setIsFirst ] = useState(true);

    useEffect(() => {
        if(!props.walletList.Whitelist) return

        setIsIncludedInWhitelist(props.walletList.Whitelist.some(
            (item) => item === props.address
        ))
    }, [props.walletList]);

    useEffect(() => {
        props.setAddress(props.ethereumClient.getAccount().address);

        const setIntervalId = setInterval(() => {
            if(props.address !== null && !(props.address === props.ethereumClient.getAccount().address)){
                clearInterval(setIntervalId);
                setNumber(1);

                if(!isFirst) window.location.reload();
                else setIsFirst(false)

                return props.setAddress(props.ethereumClient.getAccount().address)
            }
        }, 1000);
    }, [props.address]);

    useEffect(() => {
        (async () => {
            const data = await axios.get(
                process.env.PUBLIC_URL + "/abi.json?" + new Date().getTime()
            );
            const abi = data.data;
            setAbi(abi);
            try {
                const web = await getWeb3();
                web3.current = web;
                const ContractRef = new web.eth.Contract(
                    abi,
                    "0xc10A252E8f1303ea87014Ea6Bd69d7889F2BcaD8"
                );
                contract.current = ContractRef
            } catch (error) {
                alert(
                    `Failed to load web3, accounts, or contract. Check console for details.`
                );
                console.error(error);
            }
        })()
    }, []);

    useEffect(() => {
        (async () => {
            if(abi.length === 0) return
            setIsMax(false);

            const web3 = new Web3("https://sepolia.infura.io/v3/5af80a4c29b24c009d51a66e971713e2");
            const Web3Contract = new web3.eth.Contract(
                abi,
                "0xc10A252E8f1303ea87014Ea6Bd69d7889F2BcaD8"
            );

            const balanceOf = async () =>
                await Web3Contract.methods.balanceOf(props.address).call(
                    {
                        from: props.address,
                    },
                    async (err, data) => {
                        await setBalance(data);

                        if(data >= 5){
                            await setIsMax(true);
                            await setMaxNumber(1);
                        }else{
                            await setMaxNumber(5 - data)
                        }
                    }
                );
        
            await Promise.all([balanceOf()]);
        })()
    }, [props.address, abi]);

    const mintFun = async () => {
        setStatus("loading");

        if (isIncludedInWhitelist) {
            whitelistMint();
        } else {
            publicMint();
        }
    }

    const whitelistMint = async () => {
        const result = await (
            await fetch(
                `https://merkletrees.com.sospepe.com/getProof?address=${props.address}`
            )
        ).json();
        try {
            if(!contract.current){
                const web = await getWeb3();
                web3.current = web;
                const ContractRef = new web.eth.Contract(
                    abi,
                    "0xc10A252E8f1303ea87014Ea6Bd69d7889F2BcaD8"
                );
                contract.current = ContractRef
            }

            const amount = balance == 1 ?  (number - 1) * 0.007 :
                            balance == 0 && number >= 2 ? (number - 2) * 0.007 :
                            balance == 0 && number === 1 ? 0 : number * 0.007;//0.0049

            let estimateGas = 0;

            try{
                estimateGas = await contract.current.methods.frenslistMint(number, result.hexProof).estimateGas({ from: props.address, value: amount * 10 ** 18 })
                            * await web3.current.eth.getGasPrice();
            }catch(e){
                alert(`${e} ${JSON.stringify(e)}`)
            }

            const receipt = await contract.current.methods
                .frenslistMint(number, result.hexProof)
                .send({
                    from: props.address,
                    value: amount * 10 ** 18,
                    gasPrice: estimateGas,
                    gas: 200000,
                })
                .on("receipt", function (receipt) {
                    setStatus("success");
                    setTransactionHash(receipt.transactionHash);
                })
                .on("error", function (error) {
                    console.log(error);
                    setStatus("faild");
                })
        } catch (e) {
            console.log(e);
            setStatus("faild");
        }
    }

    const publicMint = async () => {
        try {
            if(!contract.current){
                const web = await getWeb3();
                web3.current = web;
                const ContractRef = new web.eth.Contract(
                    abi,
                    "0xc10A252E8f1303ea87014Ea6Bd69d7889F2BcaD8"
                );
                contract.current = ContractRef
            }

            const amount = number * 0.007;//0.0059

            let estimateGas = 0;

            try{
                estimateGas = await contract.current.methods.publicMint(number).estimateGas({ from: props.address, value: amount * 10 ** 18 })
                            * await web3.current.eth.getGasPrice();
            }catch(e){
                alert(`${e} ${JSON.stringify(e)}`)
            }

            const receipt = await contract.current.methods
                .publicMint(number)
                .send({
                    from: props.address,
                    value: amount * 10 ** 18,
                    gasPrice: estimateGas,
                    gas: 200000,
                })
                .on("receipt", function (receipt) {
                    setStatus("success");
                    setTransactionHash(receipt.transactionHash);
                })
                .on("error", function (error) {
                    console.log(error);
                    setStatus("faild");
                })
        } catch (e) {
            console.log(e);
            setStatus("faild");
        }
    };
    
    return(
        <>
            { 
                status === "loading"?
                <section className={s.loading}>
                    <div className={s.gif}>
                        <img src={loading} alt="loading" />
                    </div>
                    <div className={s.desc}>
                        <img src={loading_text} alt="desc" />
                    </div>
                </section>: 
                status === "faild"?
                <section className={s.faild}>
                    <div className={s.img}>
                        <img src={faild} alt="faild" />
                    </div>
                    <button onClick={ () => { window.location.reload() } } className={s.close}>
                        <img src={close} alt="close" />
                    </button>
                </section>:
                status === "success"?
                <section className={s.faild}>
                    <div className={s.img}>
                        <img src={success} alt="success" />
                    </div>
                    <a href={`https://sepolia.etherscan.io/tx/${transactionHash}`} target="_blank" className={s.info}>
                        <img src={view} alt="view" />
                    </a>
                    <button onClick={ () => { window.location.reload() } } className={s.close}>
                        <img src={close} alt="close" />
                    </button>
                </section>:
                <section className={s.mint}>
                    <div className={s.connect}>
                        <WagmiConfig client={props.wagmiClient}>
                            <Web3Button class={s.Web3Button} />
                        </WagmiConfig>
                        {
                            props.address ? <img src={connected} alt="connected" /> : <img src={connect} alt="connect" />
                        }
                    </div>
                    {
                        isIncludedInWhitelist &&
                        <div className={s.text}>
                            <img src={text} alt="text" />
                        </div>
                    }
                    <div className={s.form}>
                        <div className={s.container}>
                            <button onClick={ () => { ((props.address && !isMax && props.isSaleOpen) && number > 1) && setNumber(number - 1)} } className={classNames(s.minus, {[s.blocked]: !props.address || isMax || !props.isSaleOpen})}>
                                <img src={minus} alt="minus" />
                                <img src={minus_active} alt="minus active" />
                            </button>
                            <div className={s.number}>
                                {
                                    number === 1 ? <img src={number_1} alt="1" />:
                                    number === 2 ? <img src={number_2} alt="2" />:
                                    number === 3 ? <img src={number_3} alt="3" />:
                                    number === 4 ? <img src={number_4} alt="4" />: 
                                    number === 5 ? <img src={number_5} alt="5" />: 
                                    <img src={number_1} alt="1" />
                                }
                            </div>
                            <button onClick={ () => { ((props.address && !isMax && props.isSaleOpen) && number < maxNumber) && setNumber(number + 1)} } className={classNames(s.plus, {[s.blocked]: !props.address || isMax || !props.isSaleOpen})}>
                                <img src={plus} alt="plus" />
                                <img src={plus_active} alt="plus active" />
                            </button>
                        </div>
                        <button onClick={ () => { (props.address && !isMax && props.isSaleOpen) && mintFun() } } className={classNames(s.button, {[s.blocked]: !props.address || isMax || !props.isSaleOpen})}>
                            {
                                isMax ? <img src={max} alt="max" />:
                                props.isSaleOpen ? <img src={mint} alt="mint" />:
                                <img src={sale_not_open} alt="sale not open" />
                            }
                            {
                                (props.isSaleOpen && !isMax) &&
                                <img className={s.imgActive} src={mint_active} alt="mint active" />
                            }
                            {
                                (props.isSaleOpen && !isMax) &&
                                <div className={s.number}>
                                    {
                                        number === 1 & props.isSaleOpen ? <img src={mint_1} alt="1" />:
                                        number === 2 & props.isSaleOpen ? <img src={mint_2} alt="2" />:
                                        number === 3 & props.isSaleOpen ? <img src={mint_3} alt="3" />:
                                        number === 4 & props.isSaleOpen ? <img src={mint_4} alt="4" />: 
                                        <img src={mint_5} alt="5" />
                                    }
                                </div>
                            }
                        </button>
                    </div>
                </section>
            }
        </>
    )
}

export default Mint;