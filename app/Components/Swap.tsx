import React, { useState, useEffect, useCallback } from "react";
import { Input, Popover, Radio, Modal, message } from "antd";
import {
  ArrowDownOutlined,
  DownOutlined,
  SettingOutlined,
} from "@ant-design/icons";
import tokenList from "./json/TokenList.json";
import axios from "axios";
import { useSendTransaction, useWaitForTransaction } from "wagmi";
import { debounce } from "lodash";

function Swap(props) {
  const { address, isConnected } = props;
  const [messageApi, contextHolder] = message.useMessage();
  const [slippage, setSlippage] = useState(2);
  const [tokenOneAmount, setTokenOneAmount] = useState(null);
  const [tokenTwoAmount, setTokenTwoAmount] = useState(null);
  const [tokenOne, setTokenOne] = useState(tokenList[0]);
  const [tokenTwo, setTokenTwo] = useState(tokenList[1]);
  const [isOpen, setIsOpen] = useState(false);
  const [changeToken, setChangeToken] = useState(1);
  const [prices, setPrices] = useState(null);
  const [txDetails, setTxDetails] = useState({
    to: null,
    data: null,
    value: null,
  });

  const { data, sendTransaction } = useSendTransaction({
    request: {
      from: address,
      to: String(txDetails.to),
      data: String(txDetails.data),
      value: String(txDetails.value),
    },
  });

  const { isLoading, isSuccess } = useWaitForTransaction({
    hash: data?.hash,
  });

  // Helper function to delay execution
  const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

  function handleSlippageChange(e) {
    setSlippage(e.target.value);
  }

  function changeAmount(e) {
    setTokenOneAmount(e.target.value);
    if (e.target.value && prices) {
      setTokenTwoAmount((e.target.value * prices.ratio).toFixed(2));
    } else {
      setTokenTwoAmount(null);
    }
  }

  function switchTokens() {
    setPrices(null);
    setTokenOneAmount(null);
    setTokenTwoAmount(null);
    const one = tokenOne;
    const two = tokenTwo;
    setTokenOne(two);
    setTokenTwo(one);
    fetchPricesDebounced(two.address, one.address);
  }

  function openModal(asset) {
    setChangeToken(asset);
    setIsOpen(true);
  }

  function modifyToken(i) {
    setPrices(null);
    setTokenOneAmount(null);
    setTokenTwoAmount(null);
    if (changeToken === 1) {
      setTokenOne(tokenList[i]);
      fetchPricesDebounced(tokenList[i].address, tokenTwo.address);
    } else {
      setTokenTwo(tokenList[i]);
      fetchPricesDebounced(tokenOne.address, tokenList[i].address);
    }
    setIsOpen(false);
  }
  const fetchPricesDebounced = useCallback(
    debounce((one, two) => fetchPrices(one, two), 500),
    []
  );

  async function fetchPrices(one, two) {
    try {
      await delay(1000);

      const res = await axios.get(
        `https://one-inch-backend.vercel.app/tokenPrice`,
        {
          params: { addressOne: one, addressTwo: two },
        }
      );
      setPrices(res.data);
    } catch (error) {
      console.error("Error fetching prices:", error);
      message.error("Failed to fetch token prices.");
    }
  }

  async function checkAllowance() {
    try {
      await delay(1000);

      const res = await axios.get(
        `https://one-inch-backend.vercel.app/approve/allowance?tokenAddress=${tokenOne.address}&walletAddress=${address}`
      );
      return res.data.allowance;
    } catch (error) {
      console.error("Error fetching allowance:", error);
      message.error("Failed to fetch token allowance.");
      return null;
    }
  }

  async function fetchDexSwap() {
    try {
      const allowance = await checkAllowance();

      if (allowance === "0") {
        try {
          await delay(1000);

          const approve = await axios.get(
            `https://one-inch-backend.vercel.app/approve/transaction?tokenAddress=${tokenOne.address}`
          );
          setTxDetails(approve);
          message.info("Approval needed from 1inch. The allowance is Zero");
          return;
        } catch (error) {
          console.error("Error approving transaction:", error);
          message.error("Failed to approve token transaction.");
          return;
        }
      }

      await delay(1000);

      try {
        const tx = await axios.get(
          `https://one-inch-backend.vercel.app/swap?fromTokenAddress=${
            tokenOne.address
          }&toTokenAddress=${tokenTwo.address}&amount=${tokenOneAmount?.padEnd(
            tokenOne.decimals + tokenOneAmount?.length,
            "0"
          )}&fromAddress=${address}&slippage=${slippage}`
        );

        let decimals = Number(`1E${tokenTwo.decimals}`);
        setTokenTwoAmount((Number(tx.toTokenAmount) / decimals).toFixed(2));
        setTxDetails(tx);
      } catch (error) {
        if (error.response && error.response.status === 400) {
          console.error("400 Bad Request:", error.response.data);
          message.error(error.response.data.description || "Bad Request");
        } else {
          console.error("Error fetching swap transaction:", error);
          message.error("Failed to process swap transaction.");
        }
      }
    } catch (error) {
      console.error("Unexpected error during swap:", error);
      message.error("An unexpected error occurred during the swap.");
    }
  }

  useEffect(() => {
    fetchPrices(tokenList[0].address, tokenList[1].address);
  }, []);

  useEffect(() => {
    if (txDetails.to && isConnected) {
      sendTransaction();
    }
  }, [txDetails]);

  useEffect(() => {
    messageApi.destroy();

    if (isLoading) {
      messageApi.open({
        type: "loading",
        content: "Transaction is Pending...",
        duration: 0,
      });
    }
  }, [isLoading]);

  useEffect(() => {
    messageApi.destroy();
    if (isSuccess) {
      messageApi.open({
        type: "success",
        content: "Transaction Successful",
        duration: 1.5,
      });
    } else if (txDetails.to) {
      messageApi.open({
        type: "error",
        content: "Transaction Failed",
        duration: 1.5,
      });
    }
  }, [isSuccess]);

  const settings = (
    <>
      <div>Slippage Tolerance</div>
      <div>
        <Radio.Group value={slippage} onChange={handleSlippageChange}>
          <Radio.Button value={0.5}>0.5%</Radio.Button>
          <Radio.Button value={2.5}>2.5%</Radio.Button>
          <Radio.Button value={5}>5.0%</Radio.Button>
        </Radio.Group>
      </div>
    </>
  );

  return (
    <>
      {contextHolder}
      <Modal
        open={isOpen}
        footer={null}
        onCancel={() => setIsOpen(false)}
        title="Select a token"
      >
        <div className="modalContent">
          {tokenList?.map((e, i) => {
            return (
              <div
                className="tokenChoice"
                key={i}
                onClick={() => modifyToken(i)}
              >
                <img src={e.img} alt={e.ticker} className="tokenLogo" />
                <div className="tokenChoiceNames">
                  <div className="tokenName">{e.name}</div>
                  <div className="tokenTicker">{e.ticker}</div>
                </div>
              </div>
            );
          })}
        </div>
      </Modal>
      <div className="tradeBox">
        <div className="tradeBoxHeader">
          <h4>Swap</h4>
          <Popover
            content={settings}
            title="Settings"
            trigger="click"
            placement="bottomRight"
          >
            <SettingOutlined className="cog" />
          </Popover>
        </div>
        <div className="inputs">
          <Input
            placeholder="0"
            value={tokenOneAmount}
            onChange={changeAmount}
            disabled={!prices}
          />
          <Input placeholder="0" value={tokenTwoAmount} disabled={true} />
          <div className="switchButton" onClick={switchTokens}>
            <ArrowDownOutlined className="switchArrow" />
          </div>
          <div className="assetOne" onClick={() => openModal(1)}>
            <img src={tokenOne.img} alt="assetOneLogo" className="assetLogo" />
            {tokenOne.ticker}
            <DownOutlined />
          </div>
          <div className="assetTwo" onClick={() => openModal(2)}>
            <img src={tokenTwo.img} alt="assetOneLogo" className="assetLogo" />
            {tokenTwo.ticker}
            <DownOutlined />
          </div>
        </div>
        <div
          className="swapButton"
          disabled={!tokenOneAmount || !isConnected}
          onClick={fetchDexSwap}
        >
          Swap
        </div>
      </div>
    </>
  );
}

export default Swap;
