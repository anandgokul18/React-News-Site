var express = require("express");
var router = express.Router();

const axios = require('axios');

var result;

router.get("/", function (req, res, next) {
   axios.get('https://api.nytimes.com/svc/topstories/v2/business.json?api-key=5nbbukBQBCBQwLJAxFV9570scJlXvgS9')
      .then(function (response) {
         // handle success
         //console.log(response);
         result = response.data;
         result.results = result.results.slice(0, 10);
         res.send(result);
      })
      .catch(error => {
         console.log(error);
      });

});

module.exports = router;