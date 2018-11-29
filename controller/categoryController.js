var Category = require('../models/category');

exports.populateCategoryCollection = ((req, res, next) => {
    var categoryArray = new Array();
    categoryArray.push(new Category({name: "Garten",categoryId: 0,subcategory: [{ name: "Blumen giessen",categoryId: 0},
{name:"Blumen pflanzen", categoryId: 1},{name:"Blumentopf", categoryId: 2}, {name:"Gärtnern", categoryId: 3}, {name:"Hecke schneiden", categoryId: 4},
{name:"Rechen", categoryId: 5}, {name:"Schlammschlacht", categoryId: 6}]}));
    categoryArray.push(new Category({name: "Gesellschaft",categoryId: 1,subcategory: [{ name: "Gesellschaft",categoryId: 0},
{name:"Kochen", categoryId: 1},{name:"Spaziergang", categoryId: 2}, {name:"Spiele spielen", categoryId: 3}, {name:"Vorlesen", categoryId: 4}]}));
    categoryArray.push(new Category({name: "Leichter Haushalt",categoryId: 2,subcategory: [{ name: "Bügeln",categoryId: 0},
{name:"Einkaufen", categoryId: 1},{name:"Handschuhe", categoryId: 2}, {name:"Kehren", categoryId: 3}, {name:"Müll rausbringen", categoryId: 4},
{name:"Staubsaugen", categoryId: 5}, {name:"Wäsche aufhängen", categoryId: 6}, {name:"Wäsche waschen", categoryId: 7}]}));
    categoryArray.push(new Category({name: "Schwerer Haushalt",categoryId: 3,subcategory: [{ name: "Reparieren",categoryId: 0},
{name:"Umräumen", categoryId: 1},{name:"Umziehen", categoryId: 2}]}));
    categoryArray.push(new Category({name: "Tiere",categoryId: 4,subcategory: [{ name: "Gassi gehen",categoryId: 0},
{name:"Käfig säubern", categoryId: 1},{name:"Tiere füttern", categoryId: 2}]}));

    for(var i = 0; i < categoryArray.length; i++) {
        Category.create(categoryArray[i], function(err, result) {});
    }
    res.send("ok");
});