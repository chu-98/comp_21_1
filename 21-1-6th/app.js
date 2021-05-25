const express = require("express");
const path = require("path");
const mysql = require("mysql");

const app = express();

app.set('port', process.env.PORT || 8080);

app.use(express.static(path.join(__dirname, 'client')));
app.use(express.json());
app.use(express.urlencoded({extended: true}));


app.listen(app.get('port'), () => {
    console.log("Express 서버 실행 중");
})
