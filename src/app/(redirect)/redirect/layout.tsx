import FooterCompact from "@/components/footer/footer-compact";
import { PropsWithChildren } from "react";

type Props = PropsWithChildren;

const layout = ({ children }: Props) => {
  return (
    <div className="dark min-h-screen bg-black text-white">
      {children}
      <FooterCompact disableActionBtns />
    </div>
  );
};

export default layout;
