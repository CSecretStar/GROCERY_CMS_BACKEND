const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const woolworthsProductSchema = new Schema({
    isJoined: {
        type: Boolean,
        require: true,
        default: false
    }
}, {strict: false})

module.exports = woolworthsProductModel = mongoose.model('woolworths_data', woolworthsProductSchema);
