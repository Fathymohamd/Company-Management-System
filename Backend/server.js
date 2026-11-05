
import express from "express";
import cors from "cors";
import "dotenv/config";

import employees from "./routes/employees.js";

import searchRouter from "./routes/searchRouter.js";

import deleteEmployee from "./routes/deleteEmployee.js";

import employeesThunk from "./routes/employeesThunk.js";

import orders from "./routes/orders.js";

import orderSearch from "./routes/orderSearch.js";

import customer_orders from "./routes/customer_orders.js";

import product from "./routes/product.js";

import fromData from "./routes/fromData.js";

import customers_data from "./routes/customers_data.js";

import handleSearch from "./routes/handleSearch.js";

import deleteCustomer from "./routes/deleteCustomer.js";

import addCustomer from "./routes/addCustomer.js";

import productsData from "./routes/productsData.js";

import initialProductsSearch from "./routes/initialProductsSearch.js";

import searchProductsdelete from "./routes/searchProductsdelete.js";

import addProduct from "./routes/addProduct.js";

import getMaterials from "./routes/getMaterials.js";

import searchMaterials from "./routes/searchMaterials.js";

import deleteMaterial from "./routes/deleteMaterial.js";

import addMaterial from "./routes/addMaterial.js";

import updateMaterial from "./routes/updateMaterial.js";

const app = express();

app.use(
  cors({
    origin:[
"http://localhost:3000",
  "https://company-management-system-rsxw.vercel.app"
    ] 
  })
);
app.use(express.json());

// Routes
app.use("/api/employees", employees);

app.use("/api/searchRouter", searchRouter);


app.use("/api/employees", deleteEmployee);

app.use("/api/employeesThunk", employeesThunk);

app.use("/api/orders", orders);

app.use("/api/orderSearch", orderSearch);

app.use("/api/customer_orders", customer_orders);

app.use("/api/product", product);

app.use("/api/formData", fromData);

app.use("/api/customers_data", handleSearch);

app.use("/api/customers_data", customers_data)

app.use("/api/customers_data", deleteCustomer)

app.use("/api/customers_data", addCustomer)

app.use("/api/product", productsData)

app.use("/api/product", initialProductsSearch)

app.use("/api/product", searchProductsdelete)

app.use("/api/product", addProduct)

app.use("/api/materials", getMaterials)

app.use("/api/materials", searchMaterials)

app.use("/api/materials", deleteMaterial)

app.use("/api/materials", addMaterial)


app.use("/api/materials", updateMaterial)

app.get("/", (req, res) => {
  res.send("Company API is running");
});

const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
