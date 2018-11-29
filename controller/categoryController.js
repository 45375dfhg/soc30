var Category = require('../models/category');

exports.populateCategoryCollection = ((req, res, next) => {
    var categoryArray = new Array();
    categoryArray.push(new Category({name: "Schwerer Haushalt",categoryId: 0,subcategory: [{ name: "Reparieren",categoryId: 0},
    {name:"Umräumen", categoryId: 1},{name:"Umziehen", categoryId: 2}]}));
    categoryArray.push(new Category({name: "Leichter Haushalt",categoryId: 1,subcategory: [{ name: "Bügeln",categoryId: 0},
    {name:"Einkaufen", categoryId: 1},{name:"Handschuhe", categoryId: 2}, {name:"Kehren", categoryId: 3}, {name:"Müll rausbringen", categoryId: 4}
    , {name:"Schrubben", categoryId: 5},{name:"Spühlen", categoryId: 6}, {name:"Sprühflasche", categoryId: 7}, 
    {name:"Staubsaugen", categoryId: 8}, {name:"Wäsche aufhängen", categoryId: 9}, {name:"Wäsche waschen", categoryId: 10}]}));
    categoryArray.push(new Category({name: "Gesellschaft",categoryId: 2,subcategory: [{ name: "Kochen",categoryId: 0},
    {name:"Spazieren gehen", categoryId: 1},{name:"Brettspiele spielen", categoryId: 2}, {name:"Vorlesen", categoryId: 3}]}));
    categoryArray.push(new Category({name: "Garten",categoryId: 3,subcategory: [{ name: "Blumen giessen",categoryId: 0},
{name:"Blumen pflanzen", categoryId: 1},{name:"Blumentopf", categoryId: 2}, {name:"Gärtnern", categoryId: 3}, {name:"Hecke schneiden", categoryId: 4},
{name:"Rechen", categoryId: 5}, {name:"Schlammschlacht", categoryId: 6}]}));
    categoryArray.push(new Category({name: "Tiere",categoryId: 4,subcategory: [{ name: "Gassi gehen",categoryId: 0},
{name:"Käfig säubern", categoryId: 1},{name:"Tiere füttern", categoryId: 2}]}));

    for(var i = 0; i < categoryArray.length; i++) {
        Category.create(categoryArray[i], function(err, result) {});
    }
    res.send("ok");
});