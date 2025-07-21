let blogs = [];
let editingIndex = -1;
const blogForm = document.getElementById("blogForm");
const blogsContainer = document.getElementById("blogsContainer");

function renderBlogs(data) {
  blogsContainer.innerHTML = "";
  data.forEach((blog, index) => {
    const blogEl = document.createElement("div");
    blogEl.className = "blog";
    blogEl.innerHTML = `
      <h3>${blog.title}</h3>
      <p>${blog.description}</p>
      <p><a href="${blog.url}" target="_blank">${blog.url}</a></p>
      <p><strong>Author:</strong> ${blog.author} | <strong>Date:</strong> ${blog.date} | <strong>Category:</strong> ${blog.category}</p>
      <div class="actions">
        <button onclick="editBlog(${index})">Edit</button>
        <button onclick="deleteBlog(${index})">Delete</button>
      </div>
    `;
    blogsContainer.appendChild(blogEl);
  });
}

function updateFilters() {
  const authors = [...new Set(blogs.map(b => b.author))];
  const categories = [...new Set(blogs.map(b => b.category))];
  
  const authorSelect = document.getElementById("authorFilter");
  const categorySelect = document.getElementById("categoryFilter");
  
  authorSelect.innerHTML = `<option value="">Filter by Author</option>`;
  authors.forEach(a => authorSelect.innerHTML += `<option value="${a}">${a}</option>`);
  
  categorySelect.innerHTML = `<option value="">Filter by Category</option>`;
  categories.forEach(c => categorySelect.innerHTML += `<option value="${c}">${c}</option>`);
}

blogForm.addEventListener("submit", function(e) {
  e.preventDefault();
  const blog = {
    title: document.getElementById("title").value,
    description: document.getElementById("description").value,
    url: document.getElementById("url").value,
    author: document.getElementById("author").value,
    date: document.getElementById("date").value,
    category: document.getElementById("category").value
  };

  if (editingIndex === -1) {
    blogs.push(blog);
  } else {
    blogs[editingIndex] = blog;
    editingIndex = -1;
  }

  blogForm.reset();
  updateFilters();
  renderBlogs(blogs);
});

function deleteBlog(index) {
  blogs.splice(index, 1);
  renderBlogs(blogs);
  updateFilters();
}

function editBlog(index) {
  const blog = blogs[index];
  document.getElementById("title").value = blog.title;
  document.getElementById("description").value = blog.description;
  document.getElementById("url").value = blog.url;
  document.getElementById("author").value = blog.author;
  document.getElementById("date").value = blog.date;
  document.getElementById("category").value = blog.category;
  editingIndex = index;
}

function filterAndSearch() {
  const searchText = document.getElementById("search").value.toLowerCase();
  const author = document.getElementById("authorFilter").value;
  const category = document.getElementById("categoryFilter").value;

  const filtered = blogs.filter(b =>
    b.title.toLowerCase().includes(searchText) &&
    (author === "" || b.author === author) &&
    (category === "" || b.category === category)
  );

  renderBlogs(filtered);
}

let debounceTimer;
document.getElementById("search").addEventListener("input", () => {
  clearTimeout(debounceTimer);
  debounceTimer = setTimeout(filterAndSearch, 300);
});

document.getElementById("authorFilter").addEventListener("change", filterAndSearch);
document.getElementById("categoryFilter").addEventListener("change", filterAndSearch);

function sortByDate() {
  blogs.sort((a, b) => new Date(b.date) - new Date(a.date));
  renderBlogs(blogs);
}
