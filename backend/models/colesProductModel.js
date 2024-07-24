const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const colesProductSchema = new Schema({
    isJoined: {
        type: Boolean,
        require: true,
        default: false
    }
}, {strict: false})

module.exports = colesProductModel = mongoose.model('coles_data', colesProductSchema);