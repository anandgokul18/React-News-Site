var express = require("express");
var router = express.Router();

const axios = require('axios');

var result;

router.get("/", function (req, res, next) {
   let id = req.query.id.toString();
   console.log(id);
   let url = 'https://content.guardianapis.com/' + id + '?api-key=aa7f1eea-628e-4444-b1d7-2a4175be8c1f&show-blocks=all';
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