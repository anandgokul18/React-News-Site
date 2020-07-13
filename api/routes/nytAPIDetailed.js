var express = require("express");
var router = express.Router();

const axios = require('axios');

var result;

router.get("/", function (req, res, next) {
   let id = req.query.id.toString();
   console.log(id);
   let url = 'https://api.nytimes.com/svc/search/v2/articlesearch.json?fq=web_url:("' + id + '")&api-key=5nbbukBQBCBQwLJAxFV9570scJlXvgS9';
   axios.get(encodeURI(url))
      .then(function (response) {
         // handle success
         //console.log(response);
         result = response.data;
         res.send(result);
      })
      .catch(error => {
         console.log(error);
      });

});

module.exports = router;