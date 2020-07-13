var express = require("express");
var router = express.Router();

const axios = require('axios');

var result;

router.get("/", function (req, res, next) {
   let searchstring = req.query.searchstring.toString().slice(3);
   console.log(searchstring);
   let url = 'https://api.nytimes.com/svc/search/v2/articlesearch.json?q=' + searchstring + '&api-key=5nbbukBQBCBQwLJAxFV9570scJlXvgS9';
   axios.get(encodeURI(url))
      .then(function (response) {
         // handle success
         //console.log(response);
         result = response.data;

         //Modifying NYT Search Results to Guardian Search Results format, so that I can use the same SearchresultsPage template for both
         let temp = {};
         temp.nyttoguardianformattedresponse = [];
         for (let i = 0; i < 10; i++) {
            let currentItem = result.response.docs[i];
            let newelement = {}

            newelement.id = currentItem.web_url;
            newelement.webTitle = currentItem.headline.main;
            newelement.webUrl = currentItem.web_url;
            newelement.blocks = {};
            newelement.blocks.main = {};
            newelement.blocks.main = currentItem.multimedia;
            newelement.webPublicationDate = currentItem.pub_date;
            newelement.sectionId = currentItem.news_desk;

            temp.nyttoguardianformattedresponse.push(newelement);
         }


         result = temp;

         res.send(result);
      })
      .catch(error => {
         console.log(error);
      });

});

module.exports = router;