var Category = require('../models/category');

exports.populateCategoryCollection = ((req, res, next) => {
    var categoryArray = new Array();
    categoryArray.push(new Category({name: "Garten",categoryId: 0,subcategory: [{ name: "Blumen giessen",categoryId: 0},
{name:"Blumen pflanzen", categoryId: 1},{name:"Blumentopf", categoryId: 2}, {name:"Gärtnern", categoryId: 3}, {name:"Hecke schneiden", categoryId: 4},
{name:"Rechen", categoryId: 5}, {name:"Schlammschlacht", categoryId: 6}]}));
    categoryArray.push(new Category({name: "Garten",categoryId: 0,subcategory: [{ name: "Blumen giessen",categoryId: 0},
{name:"Blumen pflanzen", categoryId: 1},{name:"Blumentopf", categoryId: 2}, {name:"Gärtnern", categoryId: 3}, {name:"Hecke schneiden", categoryId: 4},
{name:"Rechen", categoryId: 5}, {name:"Schlammschlacht", categoryId: 6}]}));
    for(var i = 0; i < categoryArray.length; i++) {
        Category.save(categoryArray[i], function(err, result) {});
    }
    console.log(categoryArray);
});