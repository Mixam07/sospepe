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
import { setProvider } from "../../redux/reducers/settings-reducer";
import { useEffect, useRef, useState } from "react";
import s from "./Mint.module.css";
import { Web3Button } from "@web3modal/react";
import { WagmiConfig } from "wagmi";
import classNames from "classnames";

//import getWeb3 from "./getWeb3";
import axios from "axios";
import Web3 from "web3";
import { useWeb3React } from "@web3-react/core";
//import { Injected, WalletConnect } from "../../utils/Wallet";
import WalletModal from "./WalletModal";

const Mint = (props) => {
  const { activate, deactivate, library, account } = useWeb3React();
  const [number, setNumber] = useState(1);
  const [maxNumber, setMaxNumber] = useState(5);
  const [openModal,setOpenModal]=useState(false)
  const [isMax, setIsMax] = useState(false);
  const [status, setStatus] = useState(""); //loading faild success
  const [transactionHash, setTransactionHash] = useState("");
  const [abi, setAbi] = useState([]);
  const [isIncludedInWhitelist, setIsIncludedInWhitelist] = useState(false);
  const contract = useRef(null);
  const web3 = useRef(null);
  const [balance, setBalance] = useState(0);
  const [isFirst, setIsFirst] = useState(true);
  const getWeb3 = () => {
    
  }


  useEffect(() => {
    if (!props.walletList.Whitelist) return;


    setIsIncludedInWhitelist(
      props.walletList.Whitelist.some((item) => item === account)
    );
  }, [props.walletList]);

  useEffect(() => {
    (async () => {
      const data = await axios.get(
        process.env.PUBLIC_URL + "/abi.json?" + new Date().getTime()
      );
      const abi = data.data;
      setAbi(abi);
   
    })();
  }, []);

  useEffect(() => {
    if (account) {
        (async () => {
            if (abi.length === 0) return;
            setIsMax(false);
            
            const web3 = new Web3(
             library?.provider
            );
            const Web3Contract = new web3.eth.Contract(
              abi,
              "0xb14750356B948a126373e8F4Cd398797fFa4cc01"
            );
      
            const balanceOf = async () =>
      
              await Web3Contract.methods.balanceOf(account).call(
                {
                  from:account,
                },
                async (err, data) => {
                  await setBalance(data);
      
                  if (data >= 5) {
                    await setIsMax(true);
                    await setMaxNumber(1);
                  } else {
                    await setMaxNumber(5 - data);
                  }
                }
              );
      
            await Promise.all([balanceOf()]);
          })();
    }
  
   
  }, [account, abi]);

  const mintFun = async () => {
    setStatus("loading");

    if (isIncludedInWhitelist) {
      whitelistMint();
    } else {
      publicMint();
    }
  };

  const whitelistMint = async () => {
    const result = await (
      await fetch(
        `https://merkletrees.com.sospepe.com/getProof?address=${account}`
      )
    ).json();
    try {
      if (!contract.current) {
        const web = await getWeb3();
        web3.current = web;
        const ContractRef = new web.eth.Contract(
          abi,
          "0xb14750356B948a126373e8F4Cd398797fFa4cc01"
        );
        contract.current = ContractRef;
      }

      const amount = balance == 1 ?  (number - 1) * 0.007 :
      balance == 0 && number >= 2 ? (number - 2) * 0.007 :
      balance == 0 && number === 1 ? 0 : number * 0.007;//0.0049

      const receipt = await contract.current.methods
        .frenslistMint(number, result.hexProof)
        .send({
          from: account,
          value: amount * 10 ** 18,
        })
        .on("receipt", function (receipt) {
          setStatus("success");
          setTransactionHash(receipt.transactionHash);
        })
        .on("error", function (error) {
          console.log(error);
          setStatus("faild");
        });
    } catch (e) {
      console.log(e);
      setStatus("faild");
    }
  };

  const publicMint = async () => {
    if (account) {
        let web = new Web3(library.provider);
        console.log({ web });
        web3.current = web;
        let ContractRef = new web.eth.Contract(
          abi,
          "0xb14750356B948a126373e8F4Cd398797fFa4cc01"
        );

        const amount = number * 0.007; //0.0059
        let data = {
          from: account,
          to: "0xb14750356B948a126373e8F4Cd398797fFa4cc01",
          value: amount * 10 ** 18,
          data: ContractRef.methods.publicMint(number).encodeABI(),
        };
        console.log({ data });
        web.eth.sendTransaction(data).then((res) => {
            setStatus("success");
                   setTransactionHash(res?.transactionHash);
        }).catch((e)=>{
            setStatus("faild");
        })
     
    }else{
        setOpenModal(true)
    }
     
    

    // const receipt = await ContractRef.methods
    //     .publicMint(number)
    //     .send({
    //         from: account,
    //         value: amount * 10 ** 18,
    //     })
    //     .on("receipt", function (receipt) {
    //         setStatus("success");
    //         setTransactionHash(receipt.transactionHash);
    //     })
    //     .on("error", function (error) {
    //         console.log(error);
    //         setStatus("faild");
    //     })
    // } catch (e) {
    //     console.log(e);
    //     setStatus("faild");
    // }
  };
  const handleModal=()=>{
    if (account) {
        //deactivate(Injected)
        //deactivate(WalletConnect)
    }else{
        setOpenModal(!openModal)
    }
  }

  return (
    <>
      {status === "loading" ? (
        <section className={s.loading}>
          <div className={s.gif}>
            <img src={loading} alt="loading" />
          </div>
          <div className={s.desc}>
            <img src={loading_text} alt="desc" />
          </div>
        </section>
      ) : status === "faild" ? (
        <section className={s.faild}>
          <div className={s.img}>
            <img src={faild} alt="faild" />
          </div>
          <button
            onClick={() => {
              window.location.reload();
            }}
            className={s.close}
          >
            <img src={close} alt="close" />
          </button>
        </section>
      ) : status === "success" ? (
        <section className={s.faild}>
          <div className={s.img}>
            <img src={success} alt="success" />
          </div>
          <a
            href={`https://etherscan.io/tx/${transactionHash}`}
            target="_blank"
            className={s.info}
          >
            <img src={view} alt="view" />
          </a>
          <button
            onClick={() => {
              window.location.reload();
            }}
            className={s.close}
          >
            <img src={close} alt="close" />
          </button>
        </section>
      ) : (
        <section className={s.mint}>
          <div className={s.connect} onClick={handleModal}>
            {openModal && <WalletModal />}
            {/* <WagmiConfig client={props.wagmiClient}>
              <Web3Button class={s.Web3Button} />
            </WagmiConfig> */}
            {account ? (
              <img src={connected} alt="connected" />
            ) : (
              <img src={connect} alt="connect" />
            )}
          </div>
          {isIncludedInWhitelist && (
            <div className={s.text}>
              <img src={text} alt="text" />
            </div>
          )}
          <div className={s.form}>
            <div className={s.container}>
              <button
                onClick={() => {
                  account &&
                    !isMax &&
                    props.isSaleOpen &&
                    number > 1 &&
                    setNumber(number - 1);
                }}
                className={classNames(s.minus, {
                  [s.blocked]: !account || isMax || !props.isSaleOpen,
                })}
              >
                <img src={minus} alt="minus" />
                <img src={minus_active} alt="minus active" />
              </button>
              <div className={s.number}>
                {number === 1 ? (
                  <img src={number_1} alt="1" />
                ) : number === 2 ? (
                  <img src={number_2} alt="2" />
                ) : number === 3 ? (
                  <img src={number_3} alt="3" />
                ) : number === 4 ? (
                  <img src={number_4} alt="4" />
                ) : number === 5 ? (
                  <img src={number_5} alt="5" />
                ) : (
                  <img src={number_1} alt="1" />
                )}
              </div>
              <button
                onClick={() => {
                 account&&
                    !isMax &&
                    props.isSaleOpen &&
                    number < maxNumber &&
                    setNumber(number + 1);
                }}
                className={classNames(s.plus, {
                  [s.blocked]: !account || isMax || !props.isSaleOpen,
                })}
              >
                <img src={plus} alt="plus" />
                <img src={plus_active} alt="plus active" />
              </button>
            </div>
            <button
              onClick={() => {
                account && !isMax && props.isSaleOpen && mintFun();
              }}
              className={classNames(s.button, {
                [s.blocked]: !account || isMax || !props.isSaleOpen,
              })}
            >
              {isMax ? (
                <img src={max} alt="max" />
              ) : props.isSaleOpen ? (
                <img src={mint} alt="mint" />
              ) : (
                <img src={sale_not_open} alt="sale not open" />
              )}
              {props.isSaleOpen && !isMax && (
                <img
                  className={s.imgActive}
                  src={mint_active}
                  alt="mint active"
                />
              )}
              {props.isSaleOpen && !isMax && (
                <div className={s.number}>
                  {(number === 1) & props.isSaleOpen ? (
                    <img src={mint_1} alt="1" />
                  ) : (number === 2) & props.isSaleOpen ? (
                    <img src={mint_2} alt="2" />
                  ) : (number === 3) & props.isSaleOpen ? (
                    <img src={mint_3} alt="3" />
                  ) : (number === 4) & props.isSaleOpen ? (
                    <img src={mint_4} alt="4" />
                  ) : (
                    <img src={mint_5} alt="5" />
                  )}
                </div>
              )}
            </button>
          </div>
        </section>
      )}
    </>
  );
};

export default Mint;
