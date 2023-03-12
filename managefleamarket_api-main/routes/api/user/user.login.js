const express = require('express');
const db = require('../../../util/db.config');
const route = express.Router();

route.post('/', async (req, res, next) => {
    const email = req.body.email;
    const password = req.body.password;
    await db.query("SELECT * FROM member_tb where email = ? and password = ? limit 1", [email, password],
        function (err, result, fields) {
            if (err) {
                console.log(err);
                res.send(err);
            } else {
                const js = {
                    "status": result.length !== 0 ? true : false,
                    "code": result.length !== 0 ? 200 : 401,
                    "data": result.length !== 0 ? result[0] : "ไม่พบข้อมูล"
                }
                res.status(200).send(js);
            }
        });
});

module.exports = route;