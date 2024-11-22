import categoryModel from "../models/CategoryModel.js";
import fs from "fs";

// add category
const addCategory = async (req, res) => {
  let image_filename = `${req.file.filename}`;

  const category = new categoryModel({
    name: req.body.name,
    image: image_filename,
  });

  try {
    await category.save();
    res.json({ success: true, message: "Category Added" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Error" });
  }
};

// list all categories
const listCategory = async (req, res) => {
  try {
    const categories = await categoryModel.find({});
    res.json({ success: true, data: categories });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Error" });
  }
};

const getOneCategory = async (req, res) => {
  const { id } = req.params;

  try {
    const category = await categoryModel.findById(id);
    if (!category) return res.json({ success: false, message: "Category not found" });
    res.json({ success: true, data: category });
  } catch (error) {
    res.json({ success: false, message: "Error" });
  }
};

// update category
const updateCategory = async (req, res) => {
  const { id } = req.params;
  const { name } = req.body;

  try {
    // cari kategori berdasarkan id
    const category = await categoryModel.findById(id);

    // kalau id gaada
    if (!category) return res.json({ success: false, message: "Category not found" });

    // kalau ada file baru, hapus gambar lama dan simpan gambar baru
    if (req.file) {
      fs.unlink(`/uploads/category/${category.image}`, (err) => {
        if (err) console.log(err);
      });
      category.image = req.file.filename;
    }

    category.name = name || category.name; // kalau nama tidak diubah, maka pakai yang lama
    await category.save();
    res.json({ success: true, message: "Category Updated" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Error" });
  }
};

// remove category
const removeCategory = async (req, res) => {
  try {
    const category = await categoryModel.findById(req.body.id);
    fs.unlink(`/uploads/category/${category.image}`, () => {});
    await categoryModel.findByIdAndDelete(req.body.id);
    res.json({ success: true, message: "Category Removed" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Error" });
  }
};

export { addCategory, listCategory, updateCategory, removeCategory, getOneCategory };
