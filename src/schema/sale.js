
const mongoose = require('mongoose');
 
const saleSchema = new mongoose.Schema({
    date: String,
    seller: String,
    sold: Number,
    sales: Number,
}, { collection: 'sales' }
);
 
module.exports = { saleSchema };