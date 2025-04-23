import React, { ComponentProps, useState } from "react";
import { Card, CardContent } from "../../ui/card";
import { Input } from "../../ui/input";
import { Button } from "../../ui/button";
import { Copy, PartyPopper, QrCode } from "lucide-react";
import FlaggedURLInfo from "./flagged-url-info";
import { cn } from "@/lib/utils";
import { QRCodeModal } from "../../modals/qr-code-modal";
import { toast } from "sonner";
import { ThreatTypeEnum } from "@/types/server/types";

type Props = ComponentProps<"div"> & {
  shortUrl: string;
  shortCode: string | null;
  threat: ThreatTypeEnum;
  flaggedInfo: null | {
    flagged: boolean;
    reason: string | null;
    message: string | undefined;
  };
};

const ShortenedURLResultCard = ({
  className,
  shortUrl,
  shortCode,
  threat,
  flaggedInfo,
  ...props
}: Props) => {
  const [isQrCodeModalOpen, setIsQrCodeModalOpen] = useState(false);

  const showQrCode = () => {
    if (!shortUrl || !shortCode) return;
    setIsQrCodeModalOpen(true);
  };

  const copyToClipboard = async () => {
    if (!shortUrl) return;

    try {
      await navigator.clipboard.writeText(shortUrl);
      toast.success("URL copied to clipboard");
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Card className={cn("rounded-xl", className)} {...props}>
      <CardContent className="space-y-6">
        <div className="flex gap-2 items-center justify-center">
          <PartyPopper className="size-4 text-yellow-600" />
          <p className="tracking-wide text-sm font-semibold text-muted-foreground">
            {"We Shrinkified your URL"}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Input
            type="text"
            value={shortUrl}
            readOnly
            className="font-medium"
          />
          <Button
            type="button"
            variant={"outline"}
            disabled={!!threat}
            className="flex-shrink-0"
            onClick={copyToClipboard}
          >
            <Copy className="size-4 mr-1" />
            Copy
          </Button>
          <Button
            type="button"
            disabled={!!threat}
            variant={"outline"}
            className="flex-shrink-0"
            onClick={showQrCode}
          >
            <QrCode className="size-4" />
          </Button>
        </div>

        {flaggedInfo && flaggedInfo.flagged && (
          <FlaggedURLInfo threat={threat} flaggedInfo={flaggedInfo} />
        )}

        {shortUrl && shortCode && (
          <QRCodeModal
            isOpen={isQrCodeModalOpen}
            onOpenChange={setIsQrCodeModalOpen}
            url={shortUrl}
            shortCode={shortCode}
          />
        )}
      </CardContent>
    </Card>
  );
};

export default ShortenedURLResultCard;
