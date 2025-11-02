const express = require('express');
const router = express.Router();
const fetch = require('node-fetch');
const { setAccessToken } = require('../utils/tokenStore');

// 로그아웃
const { clearAccessToken } = require('../utils/tokenStore');

router.post('/login', async (req, res) => {
    console.log('[로그인 성공, 토큰 저장]', data.accessToken);
    try {
        const { email, password } = req.body;

        // Spring boot 로그인 API 호출
        const response = await fetch(`http://localhost:8080/api/v1/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json'},
            body: JSON.stringify({email, password}),
            credentials: 'include', // refreshToken 쿠키 전달받기 위해 필요함.
        });

        const data = await response.json();

        if (!response.ok) {
            return res.status(response.status).json({ message: data.message });
        }

        // accessToken을 인메모리에 저장
        setAccessToken(data.accessToken);
        return res.json({ message: '로그인 성공', user: data.user });
    } catch (error) {
        console.log('로그인 실패: ', error);
        res.status(500).json({ message: '로그인 오류' });
    }
});

router.post('/logout', (req, res) => {
    clearAccessToken(); // 인메모리 토큰 삭제
    res.json({ message: '로그아웃 완료' });
});

module.exports = router;