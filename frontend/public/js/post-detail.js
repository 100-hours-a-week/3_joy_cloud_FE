document.addEventListener('DOMContentLoaded', () => {
  const API_BASE_URL = 'http://localhost:8080/api/v1';
  
  // URL에서 게시글 ID 가져오기
  const urlParams = new URLSearchParams(window.location.search);
  const postId = urlParams.get('id');

  if (!postId) {
    alert('게시글을 찾을 수 없습니다.');
    window.location.href = '/post-list.html';
    return;
  }

  // DOM 요소
  const btnBack = document.getElementById('btnBack');
  const btnEdit = document.getElementById('btnEdit');
  const btnDelete = document.getElementById('btnDelete');
  const btnLike = document.getElementById('btnLike');
  const likeCount = document.getElementById('likeCount');
  const viewCount = document.getElementById('viewCount');
  const commentCount = document.getElementById('commentCount');
  const commentInput = document.getElementById('commentInput');
  const btnCommentSubmit = document.getElementById('btnCommentSubmit');
  const commentBtnText = document.getElementById('commentBtnText');
  const commentList = document.getElementById('commentList');
  const modalOverlay = document.getElementById('modalOverlay');
  const btnModalCancel = document.getElementById('btnModalCancel');
  const btnModalConfirm = document.getElementById('btnModalConfirm');
  const modalTitle = document.getElementById('modalTitle');
  const modalMessage = document.getElementById('modalMessage');

  let currentPost = null;
  let isLiked = false;
  let editingCommentId = null;
  let deleteTarget = null; // 'post' 또는 'comment'
  let deleteCommentId = null;

  // 숫자 포맷팅 (1k, 10k, 100k)
  function formatNumber(num) {
    if (num >= 100000) return Math.floor(num / 1000) + 'k';
    if (num >= 10000) return Math.floor(num / 1000) + 'k';
    if (num >= 1000) return Math.floor(num / 1000) + 'k';
    return num.toString();
  }

  // 날짜 포맷팅
  function formatDate(dateString) {
    if (!dateString) return '';
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');
    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
  }

  // 게시글 조회
  async function loadPost() {
    try {
      const response = await fetch(`${API_BASE_URL}/boards/${postId}`);
      if (!response.ok) throw new Error('게시글을 불러올 수 없습니다.');
      
      const post = await response.json();
      currentPost = post;
      displayPost(post);
      loadComments();
    } catch (error) {
      console.error('게시글 로드 실패:', error);
      alert('게시글을 불러오는데 실패했습니다.');
    }
  }

  // 게시글 표시
  function displayPost(post) {
    document.getElementById('postTitle').textContent = post.title;
    document.getElementById('postAuthor').textContent = post.author;
    document.getElementById('postDate').textContent = formatDate(post.createdAt);
    document.getElementById('postComments').textContent = formatNumber(post.commentCount);
    document.getElementById('postBody').textContent = post.contents;
    document.getElementById('viewCount').textContent = formatNumber(post.viewCount);
    document.getElementById('likeCount').textContent = formatNumber(post.likeCount);
    document.getElementById('commentCount').textContent = formatNumber(post.commentCount);

    if (post.imageUrl) {
      document.getElementById('postImage').innerHTML = 
        `<img src="${post.imageUrl}" alt="게시글 이미지">`;
    }
  }

  // 댓글 조회
  async function loadComments() {
    try {
      const response = await fetch(`${API_BASE_URL}/boards/comments/${postId}`);
      if (!response.ok) throw new Error('댓글을 불러올 수 없습니다.');
      
      const comments = await response.json();
      displayComments(comments);
    } catch (error) {
      console.error('댓글 로드 실패:', error);
    }
  }

  // 댓글 표시
  function displayComments(comments) {
    commentList.innerHTML = '';
    
    if (comments.length === 0) {
      commentList.innerHTML = '<p style="text-align:center;color:#999;padding:20px;">첫 댓글을 남겨주세요!</p>';
      return;
    }

    comments.forEach(comment => {
      const commentItem = createCommentElement(comment);
      commentList.appendChild(commentItem);
    });
  }

  // 댓글 요소 생성
  function createCommentElement(comment) {
    const div = document.createElement('div');
    div.className = 'comment-item';
    div.dataset.commentId = comment.id;

    div.innerHTML = `
      <div class="comment-header">
        <div>
          <span class="comment-author">${comment.author}</span>
          <span class="comment-date">${formatDate(comment.createdAt)}</span>
        </div>
        <div class="comment-actions">
          <button class="btn-comment-edit" onclick="editComment(${comment.id}, '${comment.contents}')">수정</button>
          <button class="btn-comment-delete" onclick="deleteComment(${comment.id})">삭제</button>
        </div>
      </div>
      <div class="comment-body">${comment.contents}</div>
    `;

    return div;
  }

  // 목록으로 버튼
  btnBack.addEventListener('click', () => {
    window.location.href = '/post-list';
  });

  // 수정 버튼
  btnEdit.addEventListener('click', () => {
    window.location.href = `/post-edit.html?id=${postId}`;
  });

  // 삭제 버튼
  btnDelete.addEventListener('click', () => {
    deleteTarget = 'post';
    modalTitle.textContent = '게시글을 삭제하시겠습니까?';
    modalMessage.textContent = '삭제한 내용은 복구할 수 없습니다.';
    modalOverlay.classList.add('active');
  });

  // 좋아요 버튼
  btnLike.addEventListener('click', async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/boards/like/${postId}`, {
        method: isLiked ? 'DELETE' : 'POST'
      });

      if (!response.ok) throw new Error('좋아요 처리 실패');

      isLiked = !isLiked;
      btnLike.classList.toggle('active', isLiked);
      
      const currentCount = parseInt(likeCount.textContent.replace('k', '000'));
      const newCount = isLiked ? currentCount + 1 : currentCount - 1;
      likeCount.textContent = formatNumber(newCount);

    } catch (error) {
      console.error('좋아요 처리 실패:', error);
    }
  });

  // 댓글 입력 감지
  commentInput.addEventListener('input', () => {
    const hasContent = commentInput.value.trim().length > 0;
    btnCommentSubmit.disabled = !hasContent;
  });

  // 댓글 등록/수정
  btnCommentSubmit.addEventListener('click', async () => {
    const contents = commentInput.value.trim();
    if (!contents) return;

    try {
      let response;
      if (editingCommentId) {
        // 수정
        response = await fetch(`${API_BASE_URL}/boards/comments/${postId}/${editingCommentId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ contents })
        });
      } else {
        // 등록
        response = await fetch(`${API_BASE_URL}/boards/comments/${postId}?postId=${postId}`, {
        // response = await fetch(`${API_BASE_URL}/boards/comments/${postId}`, {
          method: 'POST',
          headers: { 
            'Content-Type': 'application/json'
            // 'Authorization': `Bearer ${token}`,  // Express가 토큰 붙임
            },
          body: JSON.stringify({ contents })
        });
      }

      if (!response.ok) throw new Error('댓글 처리 실패');

      commentInput.value = '';
      btnCommentSubmit.disabled = true;
      editingCommentId = null;
      commentBtnText.textContent = '댓글 등록';
      
      loadComments();

    } catch (error) {
      console.error('댓글 처리 실패:', error);
      alert('댓글 처리에 실패했습니다.');
    }
  });

  // 댓글 수정 (전역 함수)
  window.editComment = (commentId, contents) => {
    editingCommentId = commentId;
    commentInput.value = contents;
    commentInput.focus();
    btnCommentSubmit.disabled = false;
    commentBtnText.textContent = '댓글 수정';
  };

  // 댓글 삭제 (전역 함수)
  window.deleteComment = (commentId) => {
    deleteTarget = 'comment';
    deleteCommentId = commentId;
    modalTitle.textContent = '댓글을 삭제하시겠습니까?';
    modalMessage.textContent = '삭제한 댓글은 복구할 수 없습니다.';
    modalOverlay.classList.add('active');
  };

  // 모달 취소
  btnModalCancel.addEventListener('click', () => {
    modalOverlay.classList.remove('active');
    deleteTarget = null;
    deleteCommentId = null;
  });

  // 모달 확인
  btnModalConfirm.addEventListener('click', async () => {
    try {
      if (deleteTarget === 'post') {
        // 게시글 삭제
        const response = await fetch(`${API_BASE_URL}/boards/${postId}`, {
          method: 'DELETE'
        });
        if (!response.ok) throw new Error('게시글 삭제 실패');
        alert('게시글이 삭제되었습니다.');
        window.location.href = '/post-list.html';
      } else if (deleteTarget === 'comment') {
        // 댓글 삭제
        const response = await fetch(`${API_BASE_URL}/boards/${postId}/comments/${deleteCommentId}`, {
          method: 'DELETE'
        });
        if (!response.ok) throw new Error('댓글 삭제 실패');
        loadComments();
      }
    } catch (error) {
      console.error('삭제 실패:', error);
      alert('삭제에 실패했습니다.');
    } finally {
      modalOverlay.classList.remove('active');
      deleteTarget = null;
      deleteCommentId = null;
    }
  });

  // 모달 외부 클릭 방지
  modalOverlay.addEventListener('click', (e) => {
    if (e.target === modalOverlay) {
      // 배경 클릭해도 닫히지 않음
    }
  });

  // 초기 로드
  loadPost();
});