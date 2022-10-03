const express = require("express");
const cors = require("cors");
const mysql = require("mysql");
require("dotenv").config();

const PORT = process.env.PORT || 9000;
const app = express();

//Middlewares
app.use(express.json());
app.use(cors());

//Creating connection
const db = mysql.createConnection({
  host: process.env.HOST,
  user: process.env.USER,
  password: process.env.PASSWORD,
  database: process.env.DATABASE,
});

//Connect to the DB
db.connect((err) => {
  if (err) throw err;
  console.log("Mysql connected");
});

//use this method to create the categories table
app.get("/table", (req, res) => {
  const sql =
    "CREATE TABLE categories(id int AUTO_INCREMENT, name VARCHAR(255), about VARCHAR(2083), image_url MEDIUMTEXT, PRIMARY KEY(id))";

  db.query(sql, (err, result) => {
    if (err) throw err;
    console.log(result);
    res.send("table created");
  });
});

//use this method to create the products table
app.get("/tableproducts", (req, res) => {
  const sql =
    "CREATE TABLE products(productId int AUTO_INCREMENT, productNumber int NOT NULL, productName VARCHAR(255), categoryId int, productAbout MEDIUMTEXT, unitPrice DECIMAL(13,2), quantity int, PRIMARY KEY(productId), FOREIGN KEY(categoryId) REFERENCES categories(id) ON DELETE CASCADE)";

  db.query(sql, (err, result) => {
    if (err) throw err;
    console.log(result);
    res.send("products table created");
  });
});

//get categories from the database
app.get("/getcategories", (req, res) => {
  const sql = "SELECT * FROM categories";

  db.query(sql, (err, results) => {
    if (err) throw err;
    console.log(results);
    res.send(results);
  });
});

//add new categories
app.post("/addcategory", (req, res) => {
  const data = req.body;
  console.log(data);
  const query = {
    name: req.body.name,
    about: req.body.description,
    image_url: req.body.imageURL,
  };

  const sql = "INSERT INTO categories SET ?";

  db.query(sql, query, (err, result) => {
    if (err) throw err;
    console.log("values added successfully");
    console.log(result);
  });
  res.send("success");
});

//edit category
app.post("/edit/category/:id", (req, res) => {
  const id = req.params.id;
  const { name, description, imageURL } = req.body;
  console.log(id, name, description, imageURL);
  const sql = `UPDATE categories SET name = "${name}", about = "${description}", image_url = "${imageURL}" WHERE  id = ${id}`;

  db.query(sql, (err, result) => {
    if (err) throw err;
    console.log("category updated...");
    console.log(result);
  });
  res.send("success");
});

//delete category
app.post("/delete/category/:id", (req, res) => {
  const id = req.params.id;
  const sql = `DELETE FROM categories WHERE id = ${id}`;

  db.query(sql, (err, result) => {
    if (err) throw err;
    console.log("successfully deleted", result);
  });
  res.send("Category deleted");
});

//get products based on category
app.get("/:id/getproducts", (req, res) => {
  const { id } = req.params;
  const sql = `SELECT * FROM products WHERE categoryId = ${id}`;

  db.query(sql, (err, results) => {
    if (err) throw err;
    console.log(results);
    res.send(results);
  });
});

//add new product to a category
app.post("/:categoryId/add/product", (req, res) => {
  const { categoryId } = req.params;
  const info = req.body;

  const query = {
    productNumber: info.id,
    productName: info.data.productName,
    categoryId: categoryId,
    productAbout: info.data.productAbout,
    unitPrice: info.data.unitPrice,
    quantity: info.data.quantity,
  };

  const sql = "INSERT INTO products SET ?";

  db.query(sql, query, (err, result) => {
    if (err) throw err;
    console.log("new product added successfully");
    console.log(result);
  });
  res.send("success");
});

//edit product
app.post("/edit/:categoryId/product", (req, res) => {
  const info = req.body;
  console.log(info);

  const sql = `UPDATE products SET productName = "${info.data.productName}", productAbout = "${info.data.productAbout}", unitPrice = "${info.data.unitPrice}", quantity = "${info.data.quantity}" WHERE productNumber = ${info.productNumber}`;

  db.query(sql, (err, result) => {
    if (err) throw err;
    console.log("product updated successfully");
    console.log(result);
    res.send("success");
  });
});

//delete product
app.post("/delete/product", (req, res) => {
  const { productId } = req.body;

  const sql = `DELETE FROM products WHERE productNumber = ${productId}`;

  db.query(sql, (err, result) => {
    if (err) throw err;
    console.log("successfully deleted", result);
    res.send("success");
  });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
