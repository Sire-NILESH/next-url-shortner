"use client";

import { useEffect } from "react";
import QRCode from "qrcode";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import Image from "next/image";
import { Button } from "../ui/button";
import { Download } from "lucide-react";
import { useMutation } from "@tanstack/react-query";

interface QRCodeModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  url: string;
  shortCode: string;
}

export function QRCodeModal({
  isOpen,
  onOpenChange,
  url,
  shortCode,
}: QRCodeModalProps) {
  const generateQRCodeMutation = useMutation({
    mutationFn: async () => {
      if (!url) throw new Error("No URL provided");
      return QRCode.toDataURL(url, {
        width: 300,
        margin: 2,
        color: { dark: "#000000", light: "#ffffff" },
      });
    },
    onError: (error) => {
      console.error("Failed to generate QR code", error);
      toast.error("Failed to generate QR code", {
        description: "An error occurred while generating the QR code",
      });
    },
  });

  useEffect(() => {
    if (isOpen && url) {
      generateQRCodeMutation.mutate();
    }
  }, [generateQRCodeMutation, isOpen, url]);

  const downloadQRCode = () => {
    if (!generateQRCodeMutation.data) return;

    const link = document.createElement("a");
    link.href = generateQRCodeMutation.data;
    link.download = `shortlink-${shortCode}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast.success("QR code downloaded", {
      description: "The QR code has been downloaded to your device",
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            QR Code for your <span className="brandText">Shrinkify</span> URL
          </DialogTitle>
        </DialogHeader>
        <div className="flex flex-col items-center justify-center p-4">
          {generateQRCodeMutation.isPending ? (
            <div className="flex items-center justify-center w-[300px] h-[300px]">
              <div className="size-8 animate-spin rounded-full border-4 border-primary border-t border-t-transparent" />
            </div>
          ) : generateQRCodeMutation.data ? (
            <div className="flex flex-col items-center space-y-4">
              <Image
                src={generateQRCodeMutation.data}
                alt="QR code"
                width={300}
                height={300}
                className="border rounded-md"
                unoptimized
              />
              <p className="text-sm text-center text-muted-foreground">
                {"Scan the QR code to open the link in your device's browser."}
              </p>
              <Button onClick={downloadQRCode} className="w-full">
                <Download className="size-4 mr-2" />
                Download QR Code
              </Button>
            </div>
          ) : (
            <div className="text-center text-muted-foreground">
              Failed to generate QR code
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
