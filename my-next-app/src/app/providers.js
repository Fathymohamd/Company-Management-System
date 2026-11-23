
"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { Provider, useDispatch } from "react-redux";

import { GetCurrentUser } from "../app/Lip/redux/me/me";
import { store } from "../app/Lip/redux/store";

function AuthInitializer() {
  const dispatch = useDispatch();
  const pathname = usePathname();

  useEffect(() => {
    dispatch(GetCurrentUser());
  }, [dispatch, pathname]);

  return null;
}

export function Providers({ children }) {
  return (
    <Provider store={store}>
      <AuthInitializer />
      {children}
    </Provider>
  );
}
