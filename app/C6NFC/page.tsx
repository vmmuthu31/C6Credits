"use client";
import React, { useState } from "react";
import { useSearchParams } from "next/navigation";
import axios from "axios";
import { Spin, Button, Modal } from "antd";
import { CheckCircleOutlined } from "@ant-design/icons";
import { BASEURL } from "@/Constants/constant";

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
    <div className="flex flex-col items-center justify-center h-screen bg-gray-900 text-white">
      {/* Header */}
      <h1 className="text-3xl font-bold mb-4">NFC Offset System</h1>

      {/* Display NFC ID */}
      <div className="mb-2">
        <span className="font-semibold">NFC ID: </span> {nfcID}
      </div>

      {/* Display Available Credits */}
      <div className="mb-6">
        <span className="font-semibold">Available Credits: </span> {credits}
      </div>

      {/* Confirmation Button */}
      <Button
        type="primary"
        size="large"
        onClick={handleOffsetConfirm}
        disabled={isLoading || credits < 2}
        className="bg-blue-500 hover:bg-blue-600"
      >
        {isLoading ? <Spin /> : "Confirm Offset (2 Credits)"}
      </Button>

      {/* Success Modal */}
      <Modal
        title="Offset Successful"
        open={isModalOpen}
        onOk={() => setIsModalOpen(false)}
        onCancel={() => setIsModalOpen(false)}
        footer={null}
        centered
      >
        <div className="flex flex-col items-center justify-center">
          <CheckCircleOutlined style={{ fontSize: "50px", color: "green" }} />
          <h2 className="mt-4 text-lg">Carbon offset applied successfully!</h2>
          <img
            src={successGif}
            alt="Success GIF"
            className="w-48 h-48 mt-4 rounded-lg"
          />
        </div>
      </Modal>
    </div>
  );
};

export default NfcOffsetPage;
