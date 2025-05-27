import pool from "../config/db.congif.js";

async function getProducts(req, res) {
  const result = await pool.query("SELECT * FROM products");
  res.json(result.rows);
}

async function createProduct(req, res) {
  const { name, price, category } = req.body;
  if (!name || !price || !category) {
    return res
      .status(400)
      .json({ message: "name price and category are required fields" });
  }
  const result = await pool.query(
    "INSERT INTO products (name,price, category) VALUES ($1, $2, $3) RETURNING id",
    [name, price, category]
  );
  res.status(201).json({
    message: "product succesfuly added",
    productId: result.rows[0].id,
  });
}
async function deleteProduct(req, res) {
  const id = Number(req.params.id);
  console.log(req.query);
  // const result = await pool.query(
  //   "DELETE FROM PRODUCTS WHERE $1 RETURNING * ",
  //   [id]
  // );

  const result = await pool.query(
    "DELETE FROM products WHERE id = $1 RETURNING *",
    [id]
  );
  if (result.rowCount === 0) {
    return res.status(404).json({ message: "Product not found" });
  }
  return res
    .status(200)
    .json({ message: "Product deleted", product: result.rows[0] });
}

export { getProducts, createProduct, deleteProduct };
