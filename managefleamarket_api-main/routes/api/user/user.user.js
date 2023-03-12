const express = require('express');
const db = require('../../../util/db.config');
const route = express.Router();

route.get('/', async (req, res, next) => {
    // const search = req.params.search;
    await db.query("SELECT * FROM member_tb",
        function (err, result, fields) {
            if (err) {
                console.log(err);                
                res.send(err);
            } else {
                res.send(result);
            }
        });
});


module.exports = route;