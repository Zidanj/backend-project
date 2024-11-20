import productModel from "../models/productModel.js";
import fs from "fs";
// import mongoose from "mongoose";

// add product item
const addProduct = async (req, res) => {
  let image_filename = `${req.file.filename}`;

  const product = new productModel({
    name: req.body.name,
    description: req.body.description,
    price: req.body.price,
    // category: req.body.category,
    categoryId: req.body.categoryId,
    image: image_filename,
  });

  try {
    await product.save();
    res.json({ success: true, message: "Product Added" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Error" });
  }
};

// all product list
const listProduct = async (req, res) => {
  const { categoryId } = req.query;
  let filter = {};

  if (categoryId) {
    filter.categoryId = categoryId;
  }

  try {
    const products = await productModel.find(filter).populate("categoryId", "name image");

    // Format Output
    const formattedProducts = products.map((product) => ({
      id: product._id,
      name: product.name,
      description: product.description,
      price: product.price,
      category: product.categoryId
        ? {
            name: product.categoryId.name,
            image: product.categoryId.image,
          }
        : null,
      image: product.image,
    }));

    res.json({ success: true, data: formattedProducts });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Error" });
  }
};

const getOneProduct = async (req, res) => {
  const { id } = req.params;

  try {
    const product = await productModel.findById(id);
    if (!product) return res.json({ success: false, message: "Product not found" });
    res.json({ success: true, data: product });
  } catch (error) {
    res.json({ success: false, message: "Error" });
  }
};

// update product
const updateProduct = async (req, res) => {
  const { id } = req.params;
  const { name, description, price, categoryId } = req.body;

  try {
    // cari product bedasarkan id
    const product = await productModel.findById(id);

    // cek product kalau gak ada
    if (!product) return res.json({ success: false, message: "Product not found" });

    // kalau ada file gambar baru, hapus gambar lama dan simpan gambar baru
    if (req.file) {
      // hapus file lama jika ada
      if (product.image) {
        fs.unlink(`uploads/${product.image}`, (err) => {
          if (err) console.error("Failed to delete old image:", err);
        });
      }
      product.image = req.file.filename;
    }

    // update field product
    product.name = name || product.name; // kalau nama tidak diubah, maka pakai yang lama
    product.description = description || product.description;
    product.price = price || product.price;
    product.categoryId = categoryId || product.categoryId;

    // simpan product
    await product.save();
    res.json({ success: true, message: "Product Updated" });
  } catch (error) {
    res.json({ success: false, message: "Error" });
  }
};

// remove product
const removeProduct = async (req, res) => {
  try {
    const product = await productModel.findById(req.body.id);
    fs.unlink(`uploads/${product.image}`, () => {});
    await productModel.findByIdAndDelete(req.body.id);
    res.json({ success: true, message: "Product Removed" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Error" });
  }
};

export { addProduct, listProduct, updateProduct, removeProduct, getOneProduct };
