const mongoose = require('mongoose');

const categorySchema = mongoose.Schema({
    categoryName: {
        type: String,
        required: true
    },
    description: {
        type: String,
    },
},
{
    timestamps: true
});