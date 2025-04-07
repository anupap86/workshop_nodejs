const mongoose = require('mongoose')
const { Schema } = mongoose ;

const productSchema = require('./product.model')
const orderSchema = require('./order.model')

const userSchema = new Schema({
    username: { type: String},
    password: { type: String},
    name:{type: String},
    role: {type: String , default: 'user'},
    approve:{type: Boolean , default: 'false'},
    product:[productSchema],
    order:[orderSchema]

    
},{
    timestamps : true
})


module.exports = mongoose.model('user',userSchema)