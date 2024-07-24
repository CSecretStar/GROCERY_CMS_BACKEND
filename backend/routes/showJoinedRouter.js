const express = require('express')
const router = express.Router();
const JoinedProductModel = require('../models/joinModel')
const woolworthsProductModel = require('../models/woolworthsProductModel')
const colesProductModel = require('../models/colesProductModel')

router.get('/all', async (req, res) => {
    const { currentPage, itemsPerPage } = req.query;
    try {
        let total = await JoinedProductModel.countDocuments({});
        products = await JoinedProductModel.find()
                        .skip((currentPage - 1) * itemsPerPage)
                        .limit(itemsPerPage);
        console.log(products);
        const wooliesProducts = [], colesProducts = [];
        for (let i = 0; i < products.length; i++) {
            let product = products[i];
            try {
                const res = await woolworthsProductModel.find({ _id: product.wooliesPID });
                if (res.length > 0) {
                    wooliesProducts.push(...res);
                } else {
                    wooliesProducts.push(undefined);
                }
            } catch (err) {
                console.error(err);
            }
        };
        for (let i = 0; i < products.length; i++) {
            let product = products[i];
            try {
                const res = await colesProductModel.find({ _id: product.colesPID });
                if (res.length > 0) {
                    colesProducts.push(...res);
                } else {
                    colesProducts.push(undefined);
                }
            }
            catch (err) {
                console.error(err);
            }
        }
        console.log(colesProducts, wooliesProducts);
        res.json({ total, wooliesProducts, colesProducts });
    } catch (err) {
        console.log(err);
        res.status(500).send("An error occurred while fetching data.");
    }
})

router.get('/search', async (req, res) => {
    const { currentPage, itemsPerPage } = req.query;

    try {

        const { keyword, currentPage, itemsPerPage } = req.query;

        try {
            const total = await woolworthsProductModel.countDocuments({ DisplayName: { $regex: keyword, $options: 'i' } });
            const results = await woolworthsProductModel.find({ DisplayName: { $regex: keyword, $options: 'i' } }).skip((currentPage - 1) * itemsPerPage).limit(20);
            res.json({ total, wooliesProducts: results, colesProducts: results });
        }
        catch (err) {
            console.log(err);
            res.status(500).send("An error occurred while fetching data.");
        }
    }
    catch (err) {
        console.error(err)
    }
})

router.post('/removeJoin', async(req, res) => {
    try {
        const result = await JoinedProductModel.findOneAndDelete({colesPID: req.body.colesPID, wooliesPID: req.body.wooliesPID});
        res.status(200).json('Success');
    } catch(err) {
        console.log(err);
        res.status(500).json(err);
    }
})
module.exports = router;
