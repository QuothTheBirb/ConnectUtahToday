import {DisclaimerProvider} from "@/components/Disclaimer";
import {ReactNode} from "react";

export const Providers = ({ children }: { children: ReactNode }) => {
  return (
    <DisclaimerProvider>
      {children}
    </DisclaimerProvider>
  );
};
