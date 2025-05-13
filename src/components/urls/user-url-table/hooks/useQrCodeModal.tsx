import { useState } from "react";
import { getShrinkifyUrl } from "@/lib/utils";

export function useQrCodeModal() {
  const [qrCodeUrl, setQrCodeUrl] = useState("");
  const [qrCodeShortCode, setQrCodeShortCode] = useState("");
  const [isQrCodeModalOpen, setIsQrCodeModalOpen] = useState(false);

  const showQrCode = (shortCode: string) => {
    const shortUrl = getShrinkifyUrl(shortCode);
    setQrCodeUrl(shortUrl);
    setQrCodeShortCode(shortCode);
    setIsQrCodeModalOpen(true);
  };

  return {
    qrCodeUrl,
    qrCodeShortCode,
    isQrCodeModalOpen,
    setIsQrCodeModalOpen,
    showQrCode,
  };
}
