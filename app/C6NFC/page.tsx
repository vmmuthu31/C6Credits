"use client";
import React, { useState } from "react";
import { useSearchParams } from "next/navigation";
import axios from "axios";
import { Spin, Button, Modal } from "antd";
import { CheckCircleOutlined } from "@ant-design/icons";
import { BASEURL } from "@/Constants/constant";
import logo from "../assets/logo.svg";
import Image from "next/image";

const successGif = "https://media.giphy.com/media/26AHONQ79FdWZhAI0/giphy.gif";

const NfcOffsetPage = () => {
  const searchParams = useSearchParams();
  const nfcID = searchParams.get("nfcID") || "Unknown ID";
  const initialCredits = parseInt(searchParams.get("credits") || "0", 10);

  const [credits, setCredits] = useState<number>(initialCredits);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOffsetConfirm = async () => {
    setIsLoading(true);
    try {
      const res = await axios.post(`${BASEURL}/api/auth/apply-offset`, {
        nfcID,
        carbonOffsetAmount: 2,
      });

      if (res.status === 200) {
        setCredits(credits - 2);
        setIsSuccess(true);
        setIsModalOpen(true);
      }
    } catch (error) {
      console.error("Error applying offset:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gradient-to-r from-green-900 via-gray-800 to-gray-900 text-white">
      <div className="text-4xl flex gap-3 items-center font-extrabold text-white mb-6 tracking-wide">
        <Image
          src={logo}
          alt="C6Credits"
          className="h-10 w-10"
          width={10}
          height={10}
        />{" "}
        <p className="relative text-xl text-white  playfair">
          C<span className="absolute text-[18px] top-2">6</span>{" "}
          <span className="pl-3">Credit</span>
        </p>{" "}
      </div>

      <div className="mb-4 text-center text-lg">
        <span className="font-semibold text-gray-300">NFC ID: </span>
        <span className="text-blue-300">{nfcID}</span>
      </div>

      <div className="mb-8 text-lg">
        <span className="font-semibold text-gray-300">Available Credits: </span>
        <span className="text-green-400">{credits}</span>
      </div>

      <Button
        type="primary"
        size="large"
        onClick={handleOffsetConfirm}
        disabled={isLoading || credits < 2}
        className={`bg-green-500 hover:bg-green-600 text-white font-bold px-6 py-2 rounded-lg transition-all ease-in-out duration-300 ${
          isLoading || credits < 2 ? "opacity-50 cursor-not-allowed" : ""
        }`}
      >
        {isLoading ? <Spin /> : "Confirm Offset (2 Credits)"}
      </Button>

      <Modal
        title="Offset Successful"
        open={isModalOpen}
        onOk={() => setIsModalOpen(false)}
        onCancel={() => setIsModalOpen(false)}
        footer={null}
        centered
        bodyStyle={{ backgroundColor: "#1a202c", color: "#fff" }}
      >
        <div className="flex flex-col pt-3 items-center justify-center">
          <CheckCircleOutlined style={{ fontSize: "50px", color: "green" }} />
          <h2 className="mt-4 text-lg">Carbon offset applied successfully!</h2>
          <iframe
            src="https://giphy.com/embed/8hZqxM7jwDnmrAoYat"
            width="300"
            height="271"
            frameBorder="0"
            className="giphy-embed"
            allowFullScreen
          ></iframe>
          <p>
            <a href="https://giphy.com/gifs/earthhour-connect2earth-earthhour2018-30march2019-8hZqxM7jwDnmrAoYat">
              via GIPHY
            </a>
          </p>
        </div>
      </Modal>
    </div>
  );
};

export default NfcOffsetPage;
