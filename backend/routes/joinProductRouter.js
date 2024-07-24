const router = require('express').Router()
const joinedProductController = require('../controllers/joiningProductController')

router.get('/getColesCategoryTree', joinedProductController.getAllColesCategoryTree);

router.get('/getWoolsCategoryTree', joinedProductController.getAllWoolsCategoryTree);

router.post('/getColesProducts', joinedProductController.getColesProductData);

router.post('/getWooliesProducts', joinedProductController.getWoolsProductData);

router.post('/joinTwoProductWithIds', joinedProductController.joinTwoProductsWithIds);

module.exports = router;
