const { fail } = require('assert');
var express = require('express');
var router = express.Router();
const productSchema = require('../models/product');
let BuildQueies = require('../Utils/BuildQuery');

/* GET users listing. */
//http://localhost:3000/product?name=iph&price[$gte]=1600&price[$lte]=3000
router.get('/', async function(req, res, next) {
  let queries = req.query;
  let products = await productSchema.find(BuildQueies.QueryProduct(queries));
  res.send(products);
});

router.get('/:id', async function(req, res, next) {
  try {
    let product = await productSchema.findById(req.params.id);
    res.status(200).send({
      success:true,
      data:product
    });
  } catch (error) {
    res.status(404).send({
      success:fail,
      message:error.message
    })
  }
});

router.post('/', async function(req, res, next) {
  let body = req.body;
  console.log(body);
  let newProduct = new productSchema({
     productName: body.productName,
     price: body.price,
     quantity: body.quantity,
     categoryId: body.category
  });
  await newProduct.save();
  res.send(newProduct);
});

router.put('/:id', async function(req, res, next) {
  try {
    
  } catch (error) {
    
  }
});

module.exports = router;
