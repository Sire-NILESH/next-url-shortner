import { Loader } from "lucide-react";

export default function LoadingSpinner() {
  return (
    <div className="flex flex-1 items-center justify-center">
      <Loader className="animate-spin size-6" />
    </div>
  );
}
