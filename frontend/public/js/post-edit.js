document.addEventListener("DOMContentLoaded", () => {
  const editForm = document.getElementById("editForm");
  const titleInput = document.getElementById("title");
  const updateBtn = document.getElementById("update-btn");
  const API_BASE_URL = CONFIG.API_BASE_URL;

  // 제목 길이 초과 방지 (26자 제한)
  titleInput.addEventListener("input", () => {
    if (titleInput.value.length > 26) {
      titleInput.value = titleInput.value.slice(0, 26);
      alert("제목은 최대 26자까지 입력 가능합니다.");
    }
  });

  // 폼 제출
  editForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const postId = new URLSearchParams(window.location.search).get("postId");
    const formData = new FormData(editForm);

    try {
      const response = await fetch(`${API_BASE_URL}/posts/${postId}`, {
        method: "PUT",
        body: formData,
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      });

      if (!response.ok) {
        throw new Error("수정에 실패했습니다.");
      }

      alert("게시글이 수정되었습니다.");
      window.location.href = `/posts/${postId}`;
    } catch (error) {
      alert(error.message);
    }
  });
});
