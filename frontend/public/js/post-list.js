document.addEventListener('DOMContentLoaded', () => {
  const postList = document.getElementById('postList');
  const loading = document.getElementById('loading');
  const btnWrite = document.getElementById('btnWrite');

  let currentPage = 0;
  let isLoading = false;
  let hasMore = true;

  const API_BASE_URL = 'http://localhost:8080/api/v1';

  // 게시글 작성 버튼
  btnWrite.addEventListener('click', () => {
    window.location.href = '/post-create';
  });

  // 숫자 포맷팅 함수 (1k, 10k, 100k)
  function formatNumber(num) {
    if (num >= 100000) {
      return Math.floor(num / 1000) + 'k';
    } else if (num >= 10000) {
      return Math.floor(num / 1000) + 'k';
    } else if (num >= 1000) {
      return Math.floor(num / 1000) + 'k';
    }
    return num.toString();
  }

  // 날짜 포맷팅 함수 (yyyy-mm-dd hh:mm:ss)
  function formatDate(dateString) {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');

    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
  }

  // 게시글 카드 생성
  function createPostCard(post) {
    const card = document.createElement('div');
    card.className = 'post-card';
    card.dataset.postId = post.id;

    // 제목 26자 제한
    const displayTitle = post.title.length > 26 
      ? post.title.substring(0, 26) 
      : post.title;

    card.innerHTML = `
      <div class="post-card-header">
        <h3 class="post-list-title">${displayTitle}</h3>
        <div class="post-meta">
        <span class="post-stat">좋아요 ${formatNumber(post.likes)}</span>
        <span class="post-stat">댓글 ${formatNumber(post.comments)}</span>
        <span class="post-stat">조회 ${formatNumber(post.views)}</span>
        <span class="post-date">${formatDate(post.createdAt)}</span>
        </div>
        </div>
        <div class="post-stats">
        <span class="post-author">${post.author}</span>
      </div>
    `;

    // 카드 클릭 시 상세 페이지로 이동
    card.addEventListener('click', () => {
      window.location.href = `/post-detail.html?id=${post.id}`;
    });

    return card;
  }

  // 게시글 로드
  async function loadPosts() {
    if (isLoading || !hasMore) return;

    isLoading = true;
    loading.style.display = 'block';

    const url = `${API_BASE_URL}/boards?page=${currentPage}&size=10`;
    // const url = `${API_BASE_URL}/boards`;
    console.log('요청 URL:', url);

    try {
      const response = await fetch(url);
      
      console.log('응답 상태:', response.status);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('에러 응답:', errorText);
        throw new Error(`게시글을 불러오는데 실패했습니다. (status: ${response.status})`);
      }

      const data = await response.json();
      console.log('받은 데이터:', data);
      
      // Spring Data JPA의 Page 객체 구조
      const posts = data.content;
      const isLastPage = data.last;

      // 데이터가 없으면 더 이상 로드하지 않음
      if (posts.length === 0 || isLastPage) {
        hasMore = false;
        if (posts.length === 0 && currentPage === 0) {
          postList.innerHTML = '<div class="no-posts">게시글이 없습니다.</div>';
        }
      }

      // 게시글 카드 추가
      posts.forEach(post => {
        const card = createPostCard(post);
        postList.appendChild(card);
      });

      // 마지막 페이지면 추가 요청 중단
      if (isLastPage) {
        hasMore = false;
        console.log("마지막 페이지입니다. 추가 로드 중단");
      } else {
        currentPage++;
      }
      // currentPage++;

    } catch (error) {
      console.error('게시글 로드 실패:', error);
      
      // 첫 페이지 로드 실패 시 더미 데이터 표시 (개발용)
      if (currentPage === 0) {
        console.log('API 연결 실패. 더미 데이터를 표시합니다.');
        loadDummyData();
      } else {
        alert('게시글을 불러오는데 실패했습니다: ' + error.message);
      }
    } finally {
      isLoading = false;
      loading.style.display = 'none';
    }
  }

  // 더미 데이터 로드 (개발/테스트용)
  function loadDummyData() {
    const dummyPosts = [
      {
        id: 1,
        title: '첫 번째 게시글입니다',
        author: '홍길동',
        createdAt: new Date().toISOString(),
        likes: 1500,
        comments: 30,
        views: 5000
      },
      {
        id: 2,
        title: '두 번째 게시글 제목입니다',
        author: '김철수',
        createdAt: new Date(Date.now() - 3600000).toISOString(),
        likes: 500,
        comments: 15,
        views: 2000
      },
      {
        id: 3,
        title: '세 번째 게시글 제목이 길어요 최대26자',
        author: '이영희',
        createdAt: new Date(Date.now() - 7200000).toISOString(),
        likes: 12000,
        comments: 150,
        views: 50000
      },
      {
        id: 4,
        title: '네 번째 게시글',
        author: '박민수',
        createdAt: new Date(Date.now() - 10800000).toISOString(),
        likes: 850,
        comments: 42,
        views: 3200
      },
      {
        id: 5,
        title: '다섯 번째 게시글입니다',
        author: '정수진',
        createdAt: new Date(Date.now() - 14400000).toISOString(),
        likes: 125000,
        comments: 2300,
        views: 180000
      }
    ];

    dummyPosts.forEach(post => {
      const card = createPostCard(post);
      postList.appendChild(card);
    });

    hasMore = false; // 더미 데이터는 한 번만 로드
  }

  // 무한 스크롤
  function handleScroll() {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const windowHeight = window.innerHeight;
    const documentHeight = document.documentElement.scrollHeight;

    // 스크롤이 하단 근처에 도달하면 다음 페이지 로드
    if (scrollTop + windowHeight >= documentHeight - 200) {
      loadPosts();
    }
  }

  // 스크롤 이벤트 리스너 (throttle 적용)
  let scrollTimeout;
  window.addEventListener('scroll', () => {
    if (scrollTimeout) {
      clearTimeout(scrollTimeout);
    }
    scrollTimeout = setTimeout(handleScroll, 100);
  });

  // 초기 로드
  loadPosts();
});