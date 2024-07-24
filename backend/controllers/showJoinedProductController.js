const joinModel = require('../models/joinModel')
const colesProductModel = require('../models/colesProductModel')
const woolworthsProductModel = require('../models/woolworthsProductModel')

exports.expireJoin = async (req, res) => {
    try {
        const joinId = req.body.joinId;
        const currentJoin = await joinedModel.findById(joineId);
        const joinedColesProduct = await colesProductModel.findById(currentJoin.colesPID);
        const joinedWooliesProduct = await woolworthsProductModel.findById(currentJoin.wooliesPID);
        joinedColesProduct.isJoined = false;
        await joinedColesProduct.save();
        joinedWooliesProduct.isJoined = false;
        await joinedWooliesProduct.save();
        joinedModel.deleteOne({_id: joinId})
    } catch(err) {
        console.log(err);
        res.status(500).json(err);
    }
}

exports.getAllJoins = async (req, res) => {
    try {
        const allJoinedProducts = await joinedProductModel.find();
        req.status(200).json(allJoinedProducts);
    } catch(err) {
        console.log(err);
        res.status(500).json(err);
    }
}