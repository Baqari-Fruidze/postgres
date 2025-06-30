import pool from "../config/db.congif.js";
import { PrismaClient } from "../generated/prisma/index.js";

const prisma = new PrismaClient();
async function getProducts(req, res) {
  try {
    // const result = await pool.query("SELECT * FROM products");
    // res.json(result.rows);   <<<< postgre

    const products = await prisma.products.findMany({
      include: {
        category: {
          select: {
            name: true,
          },
        },
      },
    });

    res.json(products);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "internal serve error" });
  }
}

async function getOneProduct(req, res) {
  try {
    // const { id } = req.params;
    // const result = await pool.query("SELECT * FROM products WHERE id = $1", [
    //   id,
    // ]);
    // if (result.rowCount === 0) {
    //   return res.status(404).json({ error: "can not find product" });
    // }
    // res.json(result.rows[0]);
    const { id } = req.params;
    const product = await prisma.products.findUnique({
      where: { id: Number(id) },
    });
    if (!product) {
      return res.status(404).json({ error: "product not found" });
    }
    res.json(product);
  } catch (err) {
    console.log(err);
    res.status(500).json({ err: "internal server  error" });
  }
}

async function createProduct(req, res) {
  try {
    const { name, price, category, description, stock, slug } = req.body;

    if (!name || !price || !category || !description || !stock || !slug) {
      return res
        .status(400)
        .json({ message: "name price and category are required fields" });
    }
    const product = await prisma.products.create({
      data: { name, price, category, description, stock, slug },
    });
    res.status(201).json(product);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "internal sercer error" });
  }
}

async function updateProduct(req, res) {
  try {
    const id = req.params.id;
    const { name, price, description, stock, slug, category } = req.body;
    const product = await prisma.products.update({
      where: { id: Number(id) },
      data: { name, price, description, stock, slug, category },
    });
    if (!product)
      return res.status(404).json({ message: "can not find product" });
    res.json(product);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "internal server error" });
  }
}
async function deleteProduct(req, res) {
  try {
    const id = req.params.id;

    await prisma.products.delete({
      where: { id: Number(id) },
    });

    return res.status(200).json({ message: "Product deleted" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "internal server error" });
  }
}

async function getCategoryStats(req, res) {
  try {
    // const result = await pool.query(
    //   "SELECT category, COUNT(*), AVG(price) as avarege,MIN(price),MAX(price) FROM products GROUP BY category"
    // );
    // res.json(result.rows);

    const result = await prisma.products.groupBy({
      by: ["category"],
      _count: true,
      _avg: { price: true },
      _min: { price: true },
      _max: { price: true },
    });
    res.json(result);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "internal server error" });
  }
}

async function buyProduct(req, res) {
  try {
    const { id } = req.params;
    // const { userId } = req.body;
    const userId = req.user.id;
    console.log(req.user);

    /// check user
    const user = await prisma.user.findUnique({
      where: {
        id: parseInt(userId),
      },
    });
    if (!user) {
      return res.status(404).json({ error: "can not find user" });
    }

    // check product
    const product = await prisma.products.findUnique({
      where: {
        id: parseInt(id),
      },
    });
    if (!product) {
      return res.status(404).json({ message: "product not found" });
    }
    /// check stock
    if (product.stock < 0) {
      return res.status(400).json({
        message: "product is out of stock",
      });
    }
    await prisma.products.update({
      where: { id: parseInt(id) },
      data: { stock: product.stock - 1 },
    });
    const userProduct = await prisma.usersProducts.create({
      data: {
        userId,
        productId: parseInt(id),
      },
    });
    return res.status(201).json({ message: "product bought successfuly" });
  } catch (err) {
    console.log(err);
  }
}

export {
  getProducts,
  createProduct,
  deleteProduct,
  getOneProduct,
  updateProduct,
  getCategoryStats,
  buyProduct,
};
