
"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useSelector } from "react-redux";

import Footer from "./Footer/page";
import Navbar from "./Navbar/page";

export default function AppShell({ children }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, initialized } = useSelector((state) => state.userToken);

  const isAuthPage =
    pathname === "/from/login" ||
    pathname === "/from/register" ||
    pathname === "/from/forgot-password";

  useEffect(() => {
    if (initialized && !user && !isAuthPage) {
      router.replace("/from/login");
    }
  }, [initialized, isAuthPage, router, user]);

  return (
    <>
      {!isAuthPage && <Navbar />}

      {children}

      {!isAuthPage && <Footer />}
    </>
  );
}
