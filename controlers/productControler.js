import pool from "../config/db.congif.js";

async function getProducts(req, res) {
  try {
    const result = await pool.query("SELECT * FROM products");
    res.json(result.rows);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "internal serve error" });
  }
}

async function getOneProduct(req, res) {
  try {
    const { id } = req.params;
    const result = await pool.query("SELECT * FROM products WHERE id = $1", [
      id,
    ]);
    if (result.rowCount === 0) {
      return res.status(404).json({ error: "can not find product" });
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.log(err);
    res.status(500).json({ err: "internal server  error" });
  }
}

async function createProduct(req, res) {
  const { name, price, category, description, stock, slug } = req.body;
  console.log(name, price, category);
  if (!name || !price || !category || !description || !stock || !slug) {
    return res
      .status(400)
      .json({ message: "name price and category are required fields" });
  }
  const result = await pool.query(
    "INSERT INTO products (name,price,category,description,stock) VALUES ($1, $2, $3, $4, $5,$6) RETURNING id",
    [name, price, category, description, stock, slug]
  );
  res.status(201).json({
    message: "product succesfuly added",
    productId: result.rows[0].id,
  });
}

async function updateProduct(req, res) {
  try {
    const id = req.params.id;
    const { name, price, description, stock, slug, category } = req.body;
    const result = await pool.query(
      "UPDATE products SET name=$1, price=$2, description=$3, stock = $4, slug = $5, category=$6 WHERE  id = $7  RETURNING *",
      [name, price, description, stock, slug, category, id]
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "internal server error" });
  }
}
async function deleteProduct(req, res) {
  const id = Number(req.params.id);

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

async function getCategoryStats(req, res) {
  try {
    const result = await pool.query(
      "SELECT category, COUNT(*), AVG(price) as avarege,MIN(price),MAX(price) FROM products GROUP BY category"
    );
    res.json(result.rows);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "internal server error" });
  }
}

export {
  getProducts,
  createProduct,
  deleteProduct,
  getOneProduct,
  updateProduct,
  getCategoryStats,
};
