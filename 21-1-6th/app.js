const express = require("express");
const { get } = require("http");
const path = require("path")

const app = express();

app.set('port', process.env.PORT || 8080);

app.use((req, res, next) => {
    console.log("모든 요청")
    next()
})



app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, "./client/list.html"))
})

app.get('/about', (req, res) => {
    res.send("어바웃")
})

app.get('/:id', (req, res) => {
    res.send(`${req.params.id}`)
})

app.use((req, res) => {
    res.send("404 NOT FOUND")
})

app.use((err, req, res, next) => {
    console.log(err);
    res.send("서버 터짐")
})

app.listen(app.get('port'), () => {
    console.log("서버 실행 중...");
})