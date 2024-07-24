const colesProductModel = require('../models/colesProductModel');
const woolworthsProductModel = require('../models/woolworthsProductModel');
const woolsProductModel = require('../models/woolworthsProductModel');
const joinedProductModel = require('../models/joinModel');

exports.getColesProductData = async (req, res) => {
    try {
        const page = req.body.page;
        const pageSize = req.body.pageSize;
        const findedData = await colesProductModel.find({
            onlineHeirs: {
                $elemMatch: {
                    subCategory: req.body.category.bigCategory || { $exists: true },
                    category: req.body.category.category || { $exists: true },
                    aisle: req.body.category.aisle || { $exists: true }
                }
            },
            isJoined: false || { $exists: false }
        })
            .skip((page - 1) * pageSize)
            .limit(pageSize);
        const count = await colesProductModel.countDocuments({
            onlineHeirs: {
                $elemMatch: {
                    subCategory: req.body.category.bigCategory || { $exists: true },
                    category: req.body.category.category || { $exists: true },
                    aisle: req.body.category.aisle || { $exists: true }
                }
            },
            isJoined: false || { $exists: false }
        });
        res.status(200).json([findedData, count]);
    } catch (err) {
        console.log(err);
        res.status(500).json(err);
    }
}

exports.getWoolsProductData = async (req, res) => {
    try {
        const page = req.body.page;
        const pageSize = req.body.pageSize;
        console.log(req.body.category);
        const findedData = await woolworthsProductModel.find({
                'AdditionalAttributes.sapdepartmentname': req.body.category.cat1 || { $exists: true },
                'AdditionalAttributes.sapcategoryname': req.body.category.cat2 || { $exists: true },
                'AdditionalAttributes.sapsubcategoryname': req.body.category.cat3 || { $exists: true },
                'AdditionalAttributes.sapsegmentname': req.body.category.cat4 || { $exists: true },
                isJoined: false|| { $exists: false }
            },
        )
            .skip((page - 1) * pageSize)
            .limit(pageSize);
        const count = await woolsProductModel.countDocuments({
            'AdditionalAttributes.sapdepartmentname': req.body.category.cat1 || { $exists: true },
            'AdditionalAttributes.sapcategoryname': req.body.category.cat2 || { $exists: true },
            'AdditionalAttributes.sapsubcategoryname': req.body.category.cat3 || { $exists: true },
            'AdditionalAttributes.sapsegmentname': req.body.category.cat4 || { $exists: true },
            isJoined: false|| { $exists: false }
        });
        res.status(200).json([findedData, count]);
    } catch (err) {
        console.log(err);
        res.status(500).json(err);
    }
}

exports.getAllColesCategoryTree = async (req, res) => {
    try {
        const allColesProducts = await colesProductModel.find();
        const resultCategoryTree = [];
        let categoryNumber = 10000;
        const categoryList = [];
        for (let i = 0; i < allColesProducts.length; i++) {
            const colesProduct = allColesProducts[i];
            const onlineHeirs = colesProduct.onlineHeirs;
            if(onlineHeirs == undefined)
                continue;
            for (let j = 0; j < onlineHeirs.length; j++) {
                const onlineHeir = onlineHeirs[j];
                if(onlineHeir.subCategory == undefined || onlineHeir.category ==undefined || onlineHeir.aisle == undefined){
                    continue
                }
                bigCategoryIndex = resultCategoryTree.findIndex((val) => val.title == onlineHeir.subCategory);
                if (bigCategoryIndex == -1) {
                    resultCategoryTree.push({ title: onlineHeir.subCategory, key: categoryNumber++, children: [{title: onlineHeir.category, key: categoryNumber++, children:[{title: onlineHeir.aisle, key: categoryNumber++, isLeaf: true}]}]});
                    // console.log(resultCategoryTree[0]);
                    console.log('+' + resultCategoryTree[0].children[0].title);
                    categoryList.push({level: 1, bigCategory: onlineHeir.subCategory});
                    categoryList.push({level: 2, bigCategory: onlineHeir.subCategory, category: onlineHeir.category});
                    categoryList.push({level: 3, bigCategory: onlineHeir.subCategory, category: onlineHeir.category, aisle: onlineHeir.aisle});
                } else {
                    let subCategoryIndex = resultCategoryTree[bigCategoryIndex].children.findIndex((val) => val.title == onlineHeir.category);
                    if (subCategoryIndex == -1) {
                        resultCategoryTree[bigCategoryIndex].children.push({ title: onlineHeir.category, key: categoryNumber++, children: [{title: onlineHeir.aisle, key: categoryNumber++, isLeaf: true}] });
                        categoryList.push({level: 2, bigCategory: onlineHeir.subCategory, category: onlineHeir.category});
                        categoryList.push({level: 3, bigCategory: onlineHeir.subCategory, category: onlineHeir.category, aisle: onlineHeir.aisle});
                    } else {
                        aisleIndex = resultCategoryTree[bigCategoryIndex].children[subCategoryIndex].children.findIndex((val) => val.title == onlineHeir.aisle);
                        if(aisleIndex == -1) {
                            resultCategoryTree[bigCategoryIndex].children[subCategoryIndex].children.push({title: onlineHeir.aisle, key: categoryNumber++, isLeaf: true});
                            categoryList.push({level: 3, bigCategory: onlineHeir.subCategory, category: onlineHeir.category, aisle: onlineHeir.aisle});
                        }
                    }
                }
            }
        }
        console.log('+' + resultCategoryTree[0].children[0].title);
        res.status(200).json([resultCategoryTree, categoryList, allColesProducts.length]);
    } catch (err) {
        console.log(err);
        res.status(500).json(err);
    }
}

exports.getAllWoolsCategoryTree = async (req, res) => {
    try {
        const allWoolsProducts = await woolsProductModel.find();
        const resultCategoryTree = [];
        const wooliesCateogryList = [];
        let categoryNumber = 20000;
        for (let i = 0; i < allWoolsProducts.length; i++) {
            const woolsProduct = allWoolsProducts[i];
            const AdditionalAttributes = woolsProduct.AdditionalAttributes;
            if(AdditionalAttributes == undefined || AdditionalAttributes.sapdepartmentname == undefined || AdditionalAttributes.sapsubcategoryname == undefined || AdditionalAttributes.sapcategoryname == undefined||AdditionalAttributes.sapsegmentname == undefined)
                continue;
            bigCategoryIndex = resultCategoryTree.findIndex((val) => val.title == AdditionalAttributes.sapdepartmentname);
            if (bigCategoryIndex == -1) {
                resultCategoryTree.push({ title:  AdditionalAttributes.sapdepartmentname, key: categoryNumber++, children: [{title: AdditionalAttributes.sapcategoryname, key: categoryNumber++, children:[{title: AdditionalAttributes.sapsubcategoryname, key: categoryNumber++, children:[{title: AdditionalAttributes.sapsegmentname, key: categoryNumber++, isLeaf: true}]}]}]});
                wooliesCateogryList.push({level:1, cat1: AdditionalAttributes.sapdepartmentname});
                wooliesCateogryList.push({level:2, cat1: AdditionalAttributes.sapdepartmentname, cat2: AdditionalAttributes.sapcategoryname});
                wooliesCateogryList.push({level:3, cat1: AdditionalAttributes.sapdepartmentname, cat2: AdditionalAttributes.sapcategoryname, cat3: AdditionalAttributes.sapsubcategoryname});
                wooliesCateogryList.push({level:4, cat1: AdditionalAttributes.sapdepartmentname, cat2: AdditionalAttributes.sapcategoryname, cat3: AdditionalAttributes.sapsubcategoryname, cat4: AdditionalAttributes.sapsegmentname});
            } else {
                let categoryIndex = resultCategoryTree[bigCategoryIndex].children.findIndex((val) => val.title == AdditionalAttributes.sapcategoryname);
                if(categoryIndex == -1) {
                    resultCategoryTree[bigCategoryIndex].children.push({ title: AdditionalAttributes.sapcategoryname, key: categoryNumber++, children: [{title: AdditionalAttributes.sapsubcategoryname, key: categoryNumber++, children: [{title: AdditionalAttributes.sapsegmentname, key: categoryNumber++, isLeaf: true}]}] });
                    wooliesCateogryList.push({level:2, cat1: AdditionalAttributes.sapdepartmentname, cat2: AdditionalAttributes.sapcategoryname});
                    wooliesCateogryList.push({level:3, cat1: AdditionalAttributes.sapdepartmentname, cat2: AdditionalAttributes.sapcategoryname, cat3: AdditionalAttributes.sapsubcategoryname});
                    wooliesCateogryList.push({level:4, cat1: AdditionalAttributes.sapdepartmentname, cat2: AdditionalAttributes.sapcategoryname, cat3: AdditionalAttributes.sapsubcategoryname, cat4: AdditionalAttributes.sapsegmentname});
                } else {
                    let subCategoryIndex = resultCategoryTree[bigCategoryIndex].children[categoryIndex].children.findIndex((val) => val.title == AdditionalAttributes.sapsubcategoryname);
                    if (subCategoryIndex == -1) {
                        resultCategoryTree[bigCategoryIndex].children[categoryIndex].children.push({title: AdditionalAttributes.sapsubcategoryname, key: categoryNumber++, children: [{title: AdditionalAttributes.sapsegmentname, key: categoryNumber++, isLeaf: true}]});
                        wooliesCateogryList.push({level:3, cat1: AdditionalAttributes.sapdepartmentname, cat2: AdditionalAttributes.sapcategoryname, cat3: AdditionalAttributes.sapsubcategoryname});
                        wooliesCateogryList.push({level:4, cat1: AdditionalAttributes.sapdepartmentname, cat2: AdditionalAttributes.sapcategoryname, cat3: AdditionalAttributes.sapsubcategoryname, cat4: AdditionalAttributes.sapsegmentname});
                    } else {
                        aisleIndex = resultCategoryTree[bigCategoryIndex].children[categoryIndex].children[subCategoryIndex].children.findIndex((val) => val.title == AdditionalAttributes.sapsegmentname);
                        if(aisleIndex == -1) {
                            resultCategoryTree[bigCategoryIndex].children[categoryIndex].children[subCategoryIndex].children.push({title: AdditionalAttributes.sapsegmentname, key: categoryNumber++, isLeaf: true});
                            wooliesCateogryList.push({level:4, cat1: AdditionalAttributes.sapdepartmentname, cat2: AdditionalAttributes.sapcategoryname, cat3: AdditionalAttributes.sapsubcategoryname, cat4: AdditionalAttributes.sapsegmentname});
                        }
                    }
                }
            }
        }
        // for(let i = 0 ; i < resultCategoryTree.length; i ++) {
        //     console.log(resultCategoryTree[i].children[1].title);
        // }
        
        res.status(200).json([resultCategoryTree, wooliesCateogryList, allWoolsProducts.length]);
    } catch (err) {
        console.log(err);
        res.status(500).json(err);
    }
}

exports.joinTwoProductsWithIds = async (req, res) => {
    try {
        console.log(req.body);
        const matchedColesProduct = await colesProductModel.findById(req.body.colesPID);
        const matchedWoolsProduct = await woolsProductModel.findById(req.body.wooliesPID);
        matchedColesProduct.isJoined = true;
        await matchedColesProduct.save();
        matchedWoolsProduct.isJoined = true;
        await matchedWoolsProduct.save();
        const currentColesCategory = req.body.currentColesCategory;
        const selectedHeir = matchedColesProduct.onlineHeirs.filter(val => {
            return val.subCategory = currentColesCategory;
        });
        const newJoinedProduct = new joinedProductModel({
            wooliesPID: req.body.wooliesPID, colesPID: req.body.colesPID, name: matchedColesProduct.name, category: {
                asile: selectedHeir.asile, category: selectedHeir.category, subCategory: selectedHeir.subCategory
            }
        });
        await newJoinedProduct.save();
        res.status(200).json('Success');
    } catch (err) {
        console.log(err);
        res.status(500).json(err);
    }
}