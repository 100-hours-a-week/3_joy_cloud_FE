const express = require('express');
const bodyParser = require('body-parser');
const authRoutes = require('./routes/auth');
const postsRoutes = require('./routes/posts');
const commentRoutes = require('./routes/comments');
const app = express();

const port = 3000; // 서버 포트 번호
const path = require('path');

app.use(bodyParser.json());
app.use('/auth', authRoutes);
app.use('/boards', postsRoutes);  
app.use('/comments', commentRoutes);


// 정적 파일(css, js 등) 제공
app.use(express.static(path.join(__dirname, "public")));

// /login 경로 요청 시 login.html 반환
app.get('/login', (req, res) => {
 res.sendFile(path.join(__dirname, 'public', 'login.html'));
});
// /signup 경로 요청 시 signup.html 반환
app.get('/signup', (req, res) => {
 res.sendFile(path.join(__dirname, 'public', 'signup.html'));
});
// /profile-modify 경로 요청 시 profile-modify.html 반환
app.get('/profile-modify', (req, res) => {
 res.sendFile(path.join(__dirname, 'public', 'profile-modify.html'));
});
// /change-password 경로 요청 시 change-password.html 반환
app.get('/change-password', (req, res) => {
 res.sendFile(path.join(__dirname, 'public', 'change-password.html'));
});
// /post-create 경로 요청 시 post-create.html 반환
app.get('/post-create', (req, res) => {
 res.sendFile(path.join(__dirname, 'public', 'post-create.html'));
});
// /post-detail 경로 요청 시 post-detail.html 반환
app.get('/post-detail', (req, res) => {
 res.sendFile(path.join(__dirname, 'public', 'post-detail.html'));
});
// /post-list 경로 요청 시 post-list.html 반환
app.get('/post-list', (req, res) => {
 res.sendFile(path.join(__dirname, 'public', 'post-list.html'));
});
// /post-edit 경로 요청 시 post-edit.html 반환
app.get('/post-edit', (req, res) => {
 res.sendFile(path.join(__dirname, 'public', 'post-edit.html'));
});


// app.listen() 함수를 사용해서 서버를 실행해준다.
// 클라이언트는 'host:port'로 노드 서버에 요청을 보낼 수 있다.
app.listen(port, () => {
    console.log('서버가 실행됩니다. http://localhost:${port}');
});