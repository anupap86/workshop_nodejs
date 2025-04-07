const mongoose = require('mongoose')
const { Schema } = mongoose ;

const orderSchema = new Schema({
    product_id:{type: String},
    nameOrder:{type: String},
    number:{type: Number},
    time: { type: String }
})

module.exports = orderSchema