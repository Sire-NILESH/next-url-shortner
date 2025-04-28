import { RefreshCw } from "lucide-react";
import ThrottleButton from "@/components/throttle-button";

type Props = {
  onClickHandler: () => void;
};

export default function RefreshButton({ onClickHandler }: Props) {
  return (
    <ThrottleButton
      size="sm"
      onThrottledClick={onClickHandler}
      idleIcon={<RefreshCw className="size-4" />}
      loadingIcon={<RefreshCw className="size-4 animate-spin" />}
      // idleText="Refresh"
      loadingText="Refreshing..."
      showLoadingText
      delayInMS={5000}
    />
  );
}
