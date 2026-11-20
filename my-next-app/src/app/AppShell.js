
"use client";

import { usePathname } from "next/navigation";

import Footer from "./Footer/page";
import Navbar from "./Navbar/page";

export default function AppShell({ children }) {
  const pathname = usePathname();

  const isAuthPage =
    pathname === "/from/login" ||
    pathname === "/from/register" ||
    pathname === "/from/forgot-password";

  return (
    <>
      {!isAuthPage && <Navbar />}

      {children}

      {!isAuthPage && <Footer />}
    </>
  );
}
