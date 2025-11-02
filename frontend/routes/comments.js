const express = require('express');
const router = express.Router();
const fetch = require('node-fetch');
const { getAccessToken } = require('../utils/tokenStore');

// 댓글 추가 API
router.post('/:postId', async (req, res) => {
    console.log('[댓글 요청 들어옴]', req.params, req.body);
    try {
        const token = getAccessToken(); // 인메모리에서 토큰 가져오기
        if (!token) {
            return res.status(401).json({ message: '로그인이 필요합니다.' });
        }

        const { postId } = req.params;
        const { contents } = req.body;

        const response = await fetch(`http://localhost:8080/api/v1/boards/comments/${postId}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`, // accessToken 추가
            },
            body: JSON.stringify({ contents }),
        });

        const data = await response.json();
        res.status(response.status).json(data);
    } catch (error) {
        console.error('댓글 추가 실패:', error);
        res.status(500).json({ message: '댓글 등록 오류' });
    }
});

module.exports = router;