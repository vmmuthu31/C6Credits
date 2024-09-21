"use client";
import React, { useState, useEffect, useCallback } from "react";
import { Input, Popover, Radio, Modal, message } from "antd";
import { DownOutlined, SettingOutlined } from "@ant-design/icons";
import tokenList from "./json/TokenList.json";
import axios from "axios";
import {
  useAccount,
  useSendTransaction,
  useWaitForTransactionReceipt,
} from "wagmi";
import { debounce } from "lodash";
import { FaExchangeAlt, FaSync } from "react-icons/fa";

function Swap(props) {
  const { address, isConnected } = useAccount();
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

  const { isLoading, isSuccess } = useWaitForTransactionReceipt({
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
      console.log(res.data);
      return res.data.allowance;
    } catch (error) {
      console.error("Error fetching allowance:", error);
      message.error("Failed to fetch token allowance.");
      return null;
    }
  }

  async function fetchDexSwap() {
    try {
      console.log("Fetching swap transaction...");

      const allowance = await checkAllowance();
      console.log("Allowance:", allowance);

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
      <main className="flex md:flex-row flex-col justify-center gap-10">
        <div className="container max-w-xl bg-[#374c6e] text-white mt-7 rounded-2xl p-7">
          <div className="flex justify-end space-x-4">
            <FaSync
              className={`cursor-pointer ${isLoading ? "animate-spin" : ""}`}
              onClick={() => fetchPrices(tokenOne.address, tokenTwo.address)}
            />
            <Popover
              content={settings}
              title="Settings"
              trigger="click"
              placement="bottomRight"
            >
              <SettingOutlined className="cog" />
            </Popover>{" "}
          </div>

          <div className="mt-2">
            <h2 className="text-xl font-semibold mb-2">You Pay</h2>
            <div className="flex mx-auto items-center gap-5 ">
              <div className="flex pt-3 gap-1" onClick={() => openModal(1)}>
                <img
                  src={tokenOne.img}
                  alt="assetOneLogo"
                  className="assetLogo w-6 h-6"
                />
                {tokenOne.ticker}
                <DownOutlined />
              </div>
              <Input
                type="text"
                value={tokenOneAmount}
                onChange={(e) => changeAmount(e)}
                disabled={!prices}
                className="w-3/4 mt-3 p-2 border text-black border-gray-300 rounded-lg"
                placeholder="Enter amount"
              />
            </div>
          </div>

          <div className="flex pt-10 justify-center ">
            <FaExchangeAlt
              className="text-4xl rotate-90 border p-2 rounded-full text-white cursor-pointer"
              onClick={switchTokens}
            />
          </div>

          <div className="mt-2">
            <h2 className="text-xl font-semibold mb-2">You Receive</h2>
            <div className="flex mx-auto items-center gap-5 ">
              <div className="flex pt-3 gap-1" onClick={() => openModal(2)}>
                <img
                  src={tokenTwo.img}
                  alt="assetTwoLogo"
                  className="assetLogo w-6 h-6"
                />
                {tokenTwo.ticker}
                <DownOutlined />
              </div>
              <Input
                type="text"
                value={tokenTwoAmount}
                readOnly
                className="w-3/4 mt-3 p-2 border text-black border-gray-300 rounded-lg bg-gray-100"
                placeholder="Receive amount"
              />
            </div>
          </div>

          <button
            className={`mt-5 w-full p-2 rounded-lg ${
              isLoading || !tokenOneAmount || !isConnected
                ? "bg-gray-500"
                : "bg-blue-500"
            }`}
            onClick={fetchDexSwap}
            disabled={!tokenOneAmount || !isConnected || isLoading}
          >
            {isLoading ? "Processing..." : "Swap"}
          </button>
        </div>

        <Modal
          open={isOpen}
          footer={null}
          onCancel={() => setIsOpen(false)}
          title="Select a token"
        >
          <div className="modalContent">
            {tokenList?.map((e, i) => (
              <div
                className="tokenChoice flex items-center cursor-pointer"
                key={i}
                onClick={() => modifyToken(i)}
              >
                <img
                  src={e.img}
                  alt={e.ticker}
                  className="tokenLogo w-6 h-6 mr-2"
                />
                <div>
                  <div className="tokenName">{e.name}</div>
                  <div className="tokenTicker">{e.ticker}</div>
                </div>
              </div>
            ))}
          </div>
        </Modal>
      </main>
    </>
  );
}

export default Swap;
