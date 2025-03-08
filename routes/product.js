var express = require('express');
var router = express.Router();
const productSchema = require('../models/product');
let BuildQueies = require('../Utils/BuildQuery');

/* GET products listing - chỉ trả về sản phẩm chưa bị xóa */
//http://localhost:3000/product?name=iph&price[$gte]=1600&price[$lte]=3000

router.get('/', async function(req, res, next) {
  try {
    let queries = req.query;
    let queryConditions = BuildQueies.QueryProduct(queries);
    
    // Thêm điều kiện isDeleted: false hoặc không tồn tại
    queryConditions = {
      ...queryConditions,
      $or: [
        { isDeleted: false },
        { isDeleted: { $exists: false } }
      ]
    };
    
    let products = await productSchema.find(queryConditions);
    res.status(200).send({
      success: true,
      data: products
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: error.message
    });
  }
});

/* GET product by ID - chỉ trả về sản phẩm chưa bị xóa */
router.get('/:id', async function(req, res, next) {
  try {
    let product = await productSchema.findOne({
      _id: req.params.id,
      $or: [
        { isDeleted: false },
        { isDeleted: { $exists: false } }
      ]
    });
    
    if (!product) {
      return res.status(404).send({
        success: false,
        message: 'Product not found or has been deleted'
      });
    }
    
    res.status(200).send({
      success: true,
      data: product
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: error.message
    });
  }
});

/* CREATE new product */
router.post('/', async function(req, res, next) {
  try {
    let body = req.body;
    console.log(body);
    
    let newProduct = new productSchema({
      productName: body.productName,
      price: body.price,
      quantity: body.quantity,
      categoryId: body.category,
      isDeleted: false
    });
    
    await newProduct.save();
    res.status(201).send({
      success: true,
      data: newProduct
    });
  } catch (error) {
    res.status(400).send({
      success: false,
      message: error.message
    });
  }
});

/* UPDATE product by ID */
router.put('/:id', async function(req, res, next) {
  try {
    const { id } = req.params;
    const body = req.body;
    
    // Chỉ cập nhật sản phẩm chưa bị xóa
    const updatedProduct = await productSchema.findOneAndUpdate(
      {
        _id: id,
        $or: [
          { isDeleted: false },
          { isDeleted: { $exists: false } }
        ]
      },
      {
        productName: body.productName,
        price: body.price,
        quantity: body.quantity,
        categoryId: body.category || body.categoryId
      },
      { new: true, runValidators: true }
    );
    
    if (!updatedProduct) {
      return res.status(404).send({
        success: false,
        message: 'Product not found or has been deleted'
      });
    }
    
    res.status(200).send({
      success: true,
      data: updatedProduct
    });
  } catch (error) {
    res.status(400).send({
      success: false,
      message: error.message
    });
  }
});

/* DELETE product by ID (soft delete) */
router.delete('/:id', async function(req, res, next) {
  try {
    const { id } = req.params;
    
    // Soft delete - cập nhật isDeleted thành true
    const deletedProduct = await productSchema.findOneAndUpdate(
      {
        _id: id,
        $or: [
          { isDeleted: false },
          { isDeleted: { $exists: false } }
        ]
      },
      { isDeleted: true },
      { new: true }
    );
    
    if (!deletedProduct) {
      return res.status(404).send({
        success: false,
        message: 'Product not found or has already been deleted'
      });
    }
    
    res.status(200).send({
      success: true,
      message: 'Product successfully deleted',
      data: deletedProduct
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: error.message
    });
  }
});

/* Hard DELETE product by ID  */
router.delete('/permanent/:id', async function(req, res, next) {
  try {
    const { id } = req.params;
    
    const deletedProduct = await productSchema.findByIdAndDelete(id);
    
    if (!deletedProduct) {
      return res.status(404).send({
        success: false,
        message: 'Product not found'
      });
    }
    
    res.status(200).send({
      success: true,
      message: 'Product permanently deleted',
      data: deletedProduct
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: error.message
    });
  }
});

module.exports = router;