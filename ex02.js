 const BASE_URL = `https://dummyjson.com`;
      const query = {};
      let postsData = [];

      const renderPosts = (posts) => {
        const postListEl = document.querySelector(".js-post-list");
        const html = posts
          .map(
            (post) => `
          <div class="border border-gray-400 p-3 mb-3 rounded-md" data-id="${post.id}">
            <h2 class="text-2xl font-medium mb-3">${post.title}</h2>
            <p class="text-gray-700">${post.body}</p>
            <div class="flex mt-2 justify-between items-center">
              <button
                class="js-view border border-gray-400 px-3 py-2 rounded-full cursor-pointer hover:bg-green-600 hover:text-white"
              >
                Xem chi tiết
              </button>
              <div class="flex gap-3">
                <span class="js-edit cursor-pointer text-green-600 ">Sửa</span>
                <span class="js-delete cursor-pointer text-red-600 ">Xóa</span>
              </div>
            </div>
          </div>`
          )
          .join("");
        postListEl.innerHTML = html;
        addPostEvents();
      };

      const setLoading = (status = true) => {
        const loadingEl = document.querySelector(".js-loading");
        loadingEl.innerHTML = status
          ? `<span class="text-3xl block text-center">Loading...</span>`
          : "";
      };
      const renderError = (message) => {
        document.querySelector(".js-post-list").innerHTML = `<p class="text-center text-red-600">${message}</p>`;
      };

      const fetchPosts = async () => {
        try {
          setLoading();
          let url = `${BASE_URL}/posts`;
          if (query.search) url = `${BASE_URL}/posts/search?q=${query.search}`;
          const response = await fetch(url);
          if (!response.ok) throw new Error("Lỗi khi tải dữ liệu");
          const { posts } = await response.json();
          postsData = posts;
          renderPosts(postsData);
        } catch {
          renderError("Đã có lỗi khi tải dữ liệu");
        } finally {
          setLoading(false);
        }
      };

      const openModal = (callback) => {
        const modalEl = document.querySelector(".js-modal");
        const modalTitle = modalEl.querySelector(".js-modal-title");
        const modalContent = modalEl.querySelector(".js-modal-content");
        modalEl.classList.remove("hidden");
        const option = callback();
        modalTitle.innerText = option.modalTitle;
        modalContent.innerHTML = option.modalContent;
      };

      const closeModal = () => {
        const modalEl = document.querySelector(".js-modal");
        modalEl.classList.add("hidden");
      };

      const addEventCloseModal = () => {
        const overlay = document.querySelector(".js-overlay");
        overlay.addEventListener("click", closeModal);
        document.addEventListener("keyup", (e) => {
          if (e.key === "Escape") closeModal();
        });
      };
      addEventCloseModal();

      const debounce = (callback, timeout = 500) => {
        let timeoutId;
        return (...args) => {
          clearTimeout(timeoutId);
          timeoutId = setTimeout(() => callback(...args), timeout);
        };
      };

      const addSearchEvent = () => {
        const searchEl = document.querySelector(".js-search");
        searchEl.addEventListener(
          "input",
          debounce((e) => {
            query.search = e.target.value;
            fetchPosts();
          })
        );
      };

      const addPostEvents = () => {
        document.querySelectorAll(".js-view").forEach((btn) => {
          btn.addEventListener("click", (e) => {
            const postEl = e.target.closest("[data-id]");
            const postId = postEl.dataset.id;
            const post = postsData.find((p) => p.id == postId);
            openModal(() => ({
              modalTitle: "Chi tiết bài viết",
              modalContent: `
                <h3 class="text-2xl font-semibold mb-2">${post.title}</h3>
                <p>${post.body}</p>
              `,
            }));
          });
        });

        document.querySelectorAll(".js-delete").forEach((btn) => {
          btn.addEventListener("click", (e) => {
            const postEl = e.target.closest("[data-id]");
            const postId = postEl.dataset.id;
            postsData = postsData.filter((p) => p.id != postId);
            renderPosts(postsData);
          });
        });

        document.querySelectorAll(".js-edit").forEach((btn) => {
          btn.addEventListener("click", (e) => {
            const postEl = e.target.closest("[data-id]");
            const postId = postEl.dataset.id;
            const post = postsData.find((p) => p.id == postId);
            openModal(() => ({
              modalTitle: "Chỉnh sửa bài viết",
              modalContent: `
                <input type="text" class="js-edit-title w-full border border-gray-400 p-2 mb-3" value="${post.title}" />
                <textarea class="js-edit-body w-full border border-gray-400 p-2 mb-3 h-32">${post.body}</textarea>
                <button class="js-save-edit bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">Lưu thay đổi</button>
              `,
            }));

            document.querySelector(".js-save-edit").addEventListener("click", () => {
              const newTitle = document.querySelector(".js-edit-title").value;
              const newBody = document.querySelector(".js-edit-body").value;
              post.title = newTitle;
              post.body = newBody;
              renderPosts(postsData);
              closeModal();
            });
          });
        });
      };

      const New = () => {
        const addBtn = document.querySelector(".js-add");
        addBtn.addEventListener("click", () => {
          openModal(() => ({
            modalTitle: "Thêm mới bài viết",
            modalContent: `
              <input type="text" class="js-new-title w-full border border-gray-400 p-2 mb-3" placeholder="Tiêu đề..." />
              <textarea class="js-new-body w-full border border-gray-400 p-2 mb-3 h-32" placeholder="Nội dung..."></textarea>
              <button class="js-save-new bg-green-800 text-white px-4 py-2 rounded hover:bg-green-700">Thêm bài</button>
            `,
          }));

          document.querySelector(".js-save-new").addEventListener("click", () => {
            const title = document.querySelector(".js-new-title").value.trim();
            const body = document.querySelector(".js-new-body").value.trim();
            if (!title || !body) return alert("Vui lòng nhập đầy đủ thông tin!");
            const newPost = { id: Date.now(), title, body };
            postsData.unshift(newPost);
            renderPosts(postsData);
            closeModal();
          });
        });
      };

      const addSortButtons = () => {
        const btnNewest = document.querySelector(".js-sort-newest");
        const btnOldest = document.querySelector(".js-sort-oldest");

        const toggleActive = (activeBtn, inactiveBtn) => {
          activeBtn.classList.add("bg-yellow-300");
          inactiveBtn.classList.remove("bg-yellow-300");
          inactiveBtn.classList.add("bg-white");
        };

        btnNewest.addEventListener("click", () => {
          postsData.sort((a, b) => b.id - a.id);
          renderPosts(postsData);
          toggleActive(btnNewest, btnOldest);
        });

        btnOldest.addEventListener("click", () => {
          postsData.sort((a, b) => a.id - b.id);
          renderPosts(postsData);
          toggleActive(btnOldest, btnNewest);
        });
      };

      fetchPosts();
      addSearchEvent();
      New();
      addSortButtons();