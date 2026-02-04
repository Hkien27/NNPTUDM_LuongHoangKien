const API_URL = "https://api.escuelajs.co/api/v1/products";

const tableBody = document.getElementById("tableBody");
const searchInput = document.getElementById("searchInput");
const pageSizeSelect = document.getElementById("pageSize");
const pagination = document.getElementById("pagination");
const exportBtn = document.getElementById("exportBtn");

let products = [];
let filteredProducts = [];
let currentPage = 1;
let pageSize = 10;

// LOAD PRODUCTS
async function loadProducts() {
  const res = await fetch(API_URL);
  products = await res.json();
  filteredProducts = [...products];
  render();
}

// RENDER
function render() {
  renderTable();
  renderPagination();
}

// TABLE
function renderTable() {
  tableBody.innerHTML = "";
  const start = (currentPage - 1) * pageSize;
  const pageData = filteredProducts.slice(start, start + pageSize);

  pageData.forEach(p => {
    const tr = document.createElement("tr");
    tr.title = p.description;
    tr.innerHTML = `
      <td>${p.id}</td>
      <td>${p.title}</td>
      <td>${p.price}</td>
      <td>${p.category.name}</td>
      <td><img src="${p.images[0]}" width="60"></td>
    `;
    tr.onclick = () => openDetail(p);
    tableBody.appendChild(tr);
  });
}

// PAGINATION
function renderPagination() {
  pagination.innerHTML = "";
  const totalPages = Math.ceil(filteredProducts.length / pageSize);

  for (let i = 1; i <= totalPages; i++) {
    const li = document.createElement("li");
    li.className = "page-item " + (i === currentPage ? "active" : "");
    li.innerHTML = `<button class="page-link">${i}</button>`;
    li.onclick = () => {
      currentPage = i;
      render();
    };
    pagination.appendChild(li);
  }
}

// SEARCH
searchInput.addEventListener("input", () => {
  const keyword = searchInput.value.toLowerCase();
  filteredProducts = products.filter(p =>
    p.title.toLowerCase().includes(keyword)
  );
  currentPage = 1;
  render();
});

// PAGE SIZE
pageSizeSelect.addEventListener("change", () => {
  pageSize = Number(pageSizeSelect.value);
  currentPage = 1;
  render();
});

// EXPORT CSV
exportBtn.addEventListener("click", () => {
  const start = (currentPage - 1) * pageSize;
  const data = filteredProducts.slice(start, start + pageSize);

  let csv = "ID,Title,Price,Category\n";
  data.forEach(p => {
    csv += `${p.id},"${p.title}",${p.price},"${p.category.name}"\n`;
  });

  const blob = new Blob([csv], { type: "text/csv" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = "products.csv";
  a.click();
});

// DETAIL MODAL
const detailModal = new bootstrap.Modal(document.getElementById("detailModal"));

function openDetail(p) {
  document.getElementById("detailId").value = p.id;
  document.getElementById("detailTitle").value = p.title;
  document.getElementById("detailPrice").value = p.price;
  document.getElementById("detailDesc").value = p.description;
  document.getElementById("detailImage").src = p.images[0];
  detailModal.show();
}

// UPDATE
document.getElementById("saveBtn").onclick = async () => {
  const id = document.getElementById("detailId").value;
  await fetch(`${API_URL}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      title: detailTitle.value,
      price: Number(detailPrice.value),
      description: detailDesc.value
    })
  });
  alert("Update success");
  detailModal.hide();
  loadProducts();
};

// CREATE MODAL
const createModal = new bootstrap.Modal(document.getElementById("createModal"));

document.getElementById("createBtn").onclick = () => createModal.show();

// CREATE PRODUCT
document.getElementById("createSaveBtn").onclick = async () => {
  await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      title: createTitle.value,
      price: Number(createPrice.value),
      description: createDesc.value,
      categoryId: Number(createCategory.value),
      images: [createImage.value]
    })
  });
  alert("Create success");
  createModal.hide();
  loadProducts();
};

loadProducts();
