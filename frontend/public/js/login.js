document.addEventListener('DOMContentLoaded', () => {
  const form = document.querySelector('form');
  const emailInput = document.getElementById('email');
  const pwInput = document.getElementById('password');
  const btn = document.querySelector('.btn');
  const loginError = document.getElementById('loginError'); // helper text 영역
  const API_BASE_URL = CONFIG.API_BASE_URL;
  
  // 페이지 진입 시 helper text 초기화
  if (loginError) {
    loginError.textContent = '';
    loginError.style.display = 'none';
  }

  // 로그인 요청 처리
  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const email = emailInput.value.trim();
    const password = pwInput.value;

    // 기존 에러 메시지 초기화
    if (loginError) {
      loginError.textContent = '';
      loginError.style.display = 'none';
    }

    try {
      const resp = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      if (resp.ok) {
        const data = await resp.json();

        // 로그인 성공 시 helper text 숨기기
        if (loginError) {
          loginError.textContent = '';
          loginError.style.display = 'none';
        }

        alert('로그인 성공! 게시판으로 이동합니다.');
        window.location.href = '/post-list';
      } else {
        // 실패 시 helper text 표시
        if (loginError) {
          loginError.textContent = '* 아이디 또는 비밀번호를 확인해주세요';
          loginError.style.display = 'block';
          loginError.style.color = '#e53935';
        }
      }
    } catch (err) {
      if (loginError) {
        loginError.textContent = '* 서버 오류가 발생했습니다.';
        loginError.style.display = 'block';
        loginError.style.color = '#e53935';
      }
      console.error(err);
    }
  });
});
