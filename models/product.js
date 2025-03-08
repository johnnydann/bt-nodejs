let mongoose = require('mongoose');

let productSchema = mongoose.Schema({
    productName: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        min: 0,
        default: 1
    },
    quantity:{
        type: Number,
        default: 1
    },
    description:{
        type: String,
        default: ""
    },
    imgUrl:{
        type: String,
        default: ""
    },
    categoryId: {
        type: String,
        required: true
    },
    
},
{
    timestamps: true
}
);

module.exports = mongoose.model('product',productSchema);