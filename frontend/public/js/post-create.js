document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('postForm');
  const titleInput = document.getElementById('title');
  const contentInput = document.getElementById('content');
  const imageInput = document.getElementById('imageUpload');
  const toast = document.getElementById('toastMsg');
  const titleError = document.getElementById('titleError');
  const contentError = document.getElementById('contentError');
  
  const API_BASE_URL = CONFIG.API_BASE_URL;
  const token = localStorage.getItem('accessToken');

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const title = titleInput.value.trim();
    const contents = contentInput.value.trim();
    const images = imageInput.files;

    if (!title || !contents) {
      titleError.textContent = '* 제목, 내용을 모두 입력해주세요.';
      titleError.style.display = 'block';
      return;
    }
    titleError.style.display = 'none';

    // FormData 구성
    const formData = new FormData();
    formData.append('title', title);
    formData.append('contents', contents);

    if (images.length > 0) {
      Array.from(images).forEach(file => formData.append('images', file));
    }

    try {
      const response = await fetch(`${API_BASE_URL}/boards?userId=${userId}`, { // Express 라우터로 전송
        method: 'POST',
        body: formData, // JSON 아님
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || '게시글 등록 실패');
      }

      // 등록 완료 UI
      toast.textContent = '등록 완료';
      toast.style.display = 'block';
      setTimeout(() => {
        toast.style.display = 'none';
        window.location.href = '/post-list';
      }, 1000);
    } catch (error) {
      console.error('게시글 등록 실패:', error);
      contentError.textContent = '* 게시글 등록 중 오류가 발생했습니다.';
      contentError.style.display = 'block';
    }
  });
});
