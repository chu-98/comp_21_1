const fs = require('fs');
const express = require('express');
const path = require('path');
const mysql = require('mysql');

const app = express();

const databaseInfo = fs.readFileSync('./databaseInfo.json'); //fs는 파일 읽기, 쓰기를 해주는 모듈. 지금은 DB 정보를 읽어오는 목적
const config = JSON.parse(databaseInfo);                     //전에 배웠던 json을 object로 바꾸는 함수 parse()/ 이걸로 DB 정보를 읽어와서 사용

//DB 연결
const connection = mysql.createConnection({
    host: config.host,
    user: config.user,
    password: config.password,
    port: config.port,
    database: config.database,
}) 
connection.connect();

//포트 세팅
app.set('port', process.env.PORT || 8080);

app.use(express.static(path.join(__dirname, 'client'))); //정적 파일 처리
app.use(express.json());                                 //JSON 데이터 처리
app.use(express.urlencoded({extended: true}));           //form 데이터 처리

//메인 페이지(게시글 리스트) 불러오기
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, './client/list.html'));
})

//글쓰기 페이지 불러오기
app.get('/post', (req, res) => {
    res.sendFile(path.join(__dirname, './client/post.html'));
})

//글쓰기 POST 요청. POST 메소드
app.post('/post', (req, res) => {
    console.log(req.body);
    connection.query(
        `INSERT INTO COMP.POSTING (title, contents) VALUE ('${req.body.title}', '${req.body.contents}')`
    );
    res.sendFile(path.join(__dirname, './client/list.html')); //작성 후 메인 페이지가 나오도록!
})

//게시글 데이터 요청. 게시글 목록에서 게시글들 정보를 얻기 위해
app.get('/post-data', (req, res) => {
    connection.query(
        "SELECT * FROM COMP.POSTING WHERE DELETED = 0 ORDER BY ID DESC", //ORDER BY ID DESC는 게시글을 내림차순으로 가져오기 위해 사용. 즉, 최신 글이 위로 오도록!
        (err, rows, fields) => {
            res.send(rows); //rows라는 배열 안에 위 쿼리문으로 얻어 온 데이터가 JSON 형식으로 담겨있음. fields에는 불러온 데이터에 대한 정보가 있음.
        }
    );
})

//게시글 상세페이지 불러오기. (상세페이지로 이동)
app.get('/detail/:id', (req, res) => {
    res.sendFile(path.join(__dirname, './client/detail.html'));
})

//특정 게시글 하나의 데이터 요청. 게시글 id가 입력되면 그 id로 게시글을 찾음.
app.get('/detail-data/:id', (req, res) => {
    connection.query(
        `select * from comp.posting where id = ${req.params.id} and deleted = 0`, //대소문자 상관 없다!
        (err, rows, fields) => {
            res.send(rows);
        }
    )
})

//게시글 수정 요청. 수정은 put 메소드!
app.get('/update/:id', (req, res) => {
    connection.query(
        `UPDATE COMP.POSTING SET TITLE = "${req.params.title}", CONTENTS = "${req.body.contents}" WHERE id = ${req.params.id}`
    );
    res.sendFile(path.join(__dirname, './client/list.html'));
})

//게시글 삭제 요청. soft delete방식
app.delete('/:id', (req, res) => {
    connection.query(
        `UPDATE COMP.POSTING SET DELETED = 1 WHERE id = ${req.params.id}`
    );
    res.sendFile(path.join(__dirname, './client/list.html'))
})

//에러 처리 미들웨어 - 서버가 터지는 경우를 대비해서 에러 처리 미들웨어는 인자가 반드시 4개!!
app.use((err, req, res, next) => {
    console.log(err);
    res.status(500).send("서버 요청 중 오류가 발생했습니다.");
})

app.listen(app.get('port'), () => {
    console.log("Express 서버 실행 중");
})
//CS 기초 강의 배열에 대해서 배웠다.
//21.06.19(토)
//CS 기초 교육 #5. 메모리에 대해서 배웠다.
//21.06.20(일)
//CS 기초 교육 #5. 메모리를 다 듣고 자기소개서를 쓸 예정이다.
//그리고 이준석대표를 만나러 간다. 떨리긴 하는데 별로 두렵지 않다. 그저 순수하게 궁금하다.
//21.06.21(월)
//iOS 프로그래밍을 위한 스위프트 기초 O.T
//21.06.24(목)
//네이버 부스트캠프 1차 코딩테스트 with Swift