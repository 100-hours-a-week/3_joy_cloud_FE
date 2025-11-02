// In-memory token 저장소 만들기
// 브라우저나 클라이언트에서 JS 접근 불가능
// XSS 위험 차단

let accessToken = null;

// 토큰 저장
function setAccessToken(token) {
    accessToken = token;
}

// 토큰 반환
function getAccessToken() {
    return accessToken;
}

// 토큰 초기화 (로그아웃)
function clearAccessToken() {
    accessToken = null;
}

module.exports = { setAccessToken, getAccessToken, clearAccessToken };