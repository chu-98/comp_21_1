//url로부터 어떤 게시글에 대한 요청인지를 알기위해 게시글 id를 parsing하는 동작 (detail.js 것과 동일)
const path = window.location.pathname;
const split = path.split("/");
const id = split[split.length - 1];

//여기도 마찬가지로 상세 페이지에 들어가는 순간 바로 게시글 정보를 받아와서 화면에 보여줘야 하므로 함수로 만들고 실행합니다!
async function getPostDetail() {
    try {
        const response = await axios.get(`/detail-data/${id}`);
        console.log(response);
        console.log(response.data);
        console.log(response.data[0]);
        //받아온 데이터를 콘솔에 여러 방식으로 찍어보자!

        const post = response.data[0]; //특정 게시글의 정보를 변수에 저장.

        const title = document.querySelector("#input_title");
        const contents = document.querySelector("#input_contents");

        title.value = post.title;
        contents.value = post.contents;
        //위 과정은 한 게시글의 정보를 가져와서 글쓰기 페이지에 넣는 과정임.

    } catch(err) {
        console.log(err);
    }
}

if (id !== "post") {   //post요청이 아닌 경우. 즉, 수정 update 요청인 경우 아래 동작 수행.
    getPostDetail();   //위에 만든 함수를 실행
    document.getElementById('form').addEventListener('submit', async (e) => {
        e.preventDefault();
        const title = e.target.input_title.value;
        const contents = e.target.input_contents.value;
        if(!title || !contents) {
            return alert("제목과 내용을 모두 입력하세요!")
        } else {
            try {
                await axios.put(`/update/${id}`, {title, contents});
            } catch(err) {
                console.log(err);
            }
            location.href = '/' //작성 후 메인 페이지 이동
    }
})
} else {
    document.getElementById('form').addEventListener('submit', async (e) => {
        e.preventDefault(); //submit 동작은 수행하면 창이 새로고침 된다. preventDefault로 이런 동작을 막아줄 수 있다.
        const title = e.target.input_title.value;
        const contents = e.target.input_contents.value;
        if(!title || !contents) {   //제목, 내용이 모두 입력됐는지 체크
            alert("제목과 내용을 모두 입력하세요!")
        } else {
            try {
                await axios.post('/post', {title, contents}); //post는 데이터를 보낼 때 사용. 따라서 get과 달리 보낼 데이터를 주소 뒤에 넣어줘야 함.
            } catch (err) {
                console.log(err);
            }
            location.href = '/' //작성 후 메인 페이지 이동
        }
})
}