const express = require("express");
const router = express.Router();

/* GET users listing. */
module.exports = client => {
  router.get("/", function(request, response, next) {
    client.query("select now()", (err, res) => {
      response.send(res.rows);
    });
  });
  return router;
};
