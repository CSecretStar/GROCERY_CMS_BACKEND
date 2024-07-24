const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const JoinedProductSchema = new Schema({
    name: {
        type: String
    },
    category: {
        subCategory: {
            type: String
        },   
        category: {
            type: String
        },
        aisle: {
            type: String
        }
    },
    wooliesPID: {
        type: mongoose.Types.ObjectId
    },
    colesPID: {
        type: mongoose.Types.ObjectId
    }
})
const JoinedProductModel = mongoose.model('joined_product_data', JoinedProductSchema);
module.exports = JoinedProductModel;
