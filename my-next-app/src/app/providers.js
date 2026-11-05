
"use client";

import { Provider } from "react-redux";
import { store } from "../app/Lip/redux/store";

export function Providers({ children }) {
  return <Provider store={store}>{children}</Provider>;
}
