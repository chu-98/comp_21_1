const express = require("express");

const app = express();

app.get('/', (req, res) => {
    res.send("익스프레스 배워보기")
})

app.get('/about', (req, res) => {
    res.send("어바웃")
})

app.listen(8080, () => {
    console.log("서버 실행 중...");
})

