import { configureStore } from "@reduxjs/toolkit";

import employeesReducer from "./employeesApi/employeesApi";

import searchReducer from "./searchRedux/searchRedux";

import employeesReducerDELET from "./employeesSlice/employeesSlice";

import employeesThunkReducer from "./employeesThunk/employeesThunk";

import orders from "./orders/orders";

import customer_orders from "./customer_orders/customer_orders";

import customers_data from "./customers_data/customers_data";

import products from "./products/products";

import materialsReducer from "./materialsSlice/materialsSlice";

import expensesReducer from "./expensesSlice/expensesSlice";

import reportsReducer from "./reports/reportsSlice";

import RegisterPage from "./RegisterPages/RegisterPage";

import LoginPages from "./LoginPages/LoginPages";

import me from "./me/me";

import reportsSlice from "./reports/reportsSlice";

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

    expenses: expensesReducer,

    reports: reportsReducer,
    
    register : RegisterPage,

    login : LoginPages,

    userToken : me,

    reports : reportsSlice
  },
});