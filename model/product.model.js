const mongoose = require('mongoose')
const { Schema } = mongoose ;

const productSchema = new Schema({
    name:{type: String},
    stock:{type: Number}
})

module.exports = productSchema