// Header
const express = require('express');
const cors = require("cors");
const config = require('./util/config');
var bodyParser = require('body-parser')
const morgan = require('morgan');
const path = require('path');
const app = express();
const port = config.PORT;

app.use(
    express.urlencoded({
        extended: true,
    })
);

app.use(morgan('dev'));
app.use(cors());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

// [MAIN API]
const apiRoute = require('./routes/api/api');
app.use('/api', apiRoute);

// [error pages]
app.get("*", function (req, res) {
    res.send({
        store: "Smart Parcel Box",
        timestamp: new Date(),
        serverstatus: false,
        data: [],
    });
    // res.sendFile(path.join(__dirname, '/error.html'));
});

// [Listen Listen Start]
app.listen(port, () =>
    console.log(`Managefleamarket app listening on port ${port}!`)
);