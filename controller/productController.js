import slugify from "slugify";
import productModel from "../models/productModel.js";
import fs from "fs";

export const createProductController = async (req, res) => {
  try {
    const { name, slug, description, price, category, quantity, shipping } =
      req.fields;

    const { photo } = req.files;

    switch (true) {
      case !name:
        return res.status(500).send({ error: "Name is requred" });

      case !description:
        return res.status(500).send({ error: "description is requred" });

      case !price:
        return res.status(500).send({ error: "price is requred" });

      case !category:
        return res.status(500).send({ error: "category is requred" });

      case !quantity:
        return res.status(500).send({ error: "quantity is requred" });

      case photo && photo.size > 1000000:
        return res
          .status(500)
          .send({ error: "photo  is requred and should be less than 1mb" });
    }

    const products = new productModel({ ...req.fields, slug: slugify(name) });
    if (photo) {
      products.photo.data = fs.readFileSync(photo.path);
      products.photo.contentType = photo.type;
    }

    await products.save();
    res.status(201).send({
      success: true,
      messsage: "Product created Successfully",
      products,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      messsage: "Error in creating the product",
      error,
    });
  }
};

export const getProductController = async (req, res) => {
  try {
    const products = await productModel
      .findOne({})
      .populate("category")
      .select("-photo")
      .limit(12)
      .sort({ createdAt: -1 });
    res.status(201).send({
      success: true,
      messsage: "All Product",
      products,
      totalCount: products.length,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      messsage: "Error in getting product",
      error,
    });
  }
};

export const getSingleProductController = async (req, res) => {
  try {
    const product = await productModel
      .findOne({ slug: req.params.slug })
      .select(-photo)
      .populate("category");
    res.status(201).send({
      success: true,
      messsage: " Single Product fetch",
      product,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      messsage: "Error in getting single product",
      error,
    });
  }
};

export const productPhotoController = async () => {
  try {
    const product = await productModel.findById(req.params.pid).select("photo");
    if (product.photo.data) {
      res.set("Content-type", product.photo.contentType);
      return res.status(201).send(product.photo.data);
    }
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      messsage: "Error while getting photo",
      error,
    });
  }
};

export const deleteProductController = async (req, res) => {
  try {
    await productModel.findByIdAndDelete(req.params.pid).select("-photo");
    res.status(200).send({
      success: true,
      messsage: "Product Deleted successfully",
      product,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      messsage: "Error while getting photo",
      error,
    });
  }
};

export const updateProductController = async (req, res) => {
  try {
    const { name, slug, description, price, category, quantity, shipping } =
      req.fields;

    const { photo } = req.files;

    switch (true) {
      case !name:
        return res.status(500).send({ error: "Name is requred" });

      case !description:
        return res.status(500).send({ error: "description is requred" });

      case !price:
        return res.status(500).send({ error: "price is requred" });

      case !category:
        return res.status(500).send({ error: "category is requred" });

      case !quantity:
        return res.status(500).send({ error: "quantity is requred" });

      case photo && photo.size > 1000000:
        return res
          .status(500)
          .send({ error: "photo  is requred and should be less than 1mb" });
    }

    const products = await productModel.findByIdAndUpdate(
      req.params.pid,
      {
        ...req.fields,
        slug: slugify(name),
      },
      { new: true }
    );
    if (photo) {
      products.photo.data = fs.readFileSync(photo.path);
      products.photo.contentType = photo.type;
    }

    await products.save();
    res.status(201).send({
      success: true,
      messsage: "Product Updated Successfully",
      products,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      messsage: "Error in updating the product",
      error,
    });
  }
};
