import { configureStore } from "@reduxjs/toolkit";

import employeesReducer from "./employeesApi/page";

import searchReducer from "./searchRedux/page";

import employeesReducerDELET from "./employeesSlice/page";

import employeesThunkReducer from "./employeesThunk/page";

import orders from "./orders/page";

import customer_orders from "./customer_orders/page";

import customers_data from "./customers_data/page";

import products from "./products/page";

import materialsReducer from "./materialsSlice/page";

export const store = configureStore({
  reducer: {
    employees: employeesReducer,

    search: searchReducer,

    employeesDELETE: employeesReducerDELET,

    EmployeesThunk: employeesThunkReducer,

     order : orders,
     
    customer : customer_orders,

    customers : customers_data,

    products : products,

    materials: materialsReducer,
  },
});