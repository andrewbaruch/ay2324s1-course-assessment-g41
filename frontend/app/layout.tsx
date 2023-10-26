import { dmSans } from "@/theme/theme";
import React, { ReactNode } from "react";
import AppWrappers from "./AppWrappers";
// karwi: move to src/?
import "allotment/dist/style.css";

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className={dmSans.className}>
      <body id={"root"}>
        <AppWrappers>{children}</AppWrappers>
      </body>
    </html>
  );
}
