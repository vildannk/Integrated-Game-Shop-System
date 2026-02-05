import { constant } from "./constant.js";
import { formatBAM } from "./price.js";

function resolveImage(url) {
  if (!url) return '';
  const v = window.__IMG_CACHE_BUST || '';
  const addBust = (u) => v ? (u + (u.includes('?') ? '&' : '?') + 'v=' + v) : u;
  if (url.startsWith('http')) return addBust(url);
  let path = url.replace(/^\//, '');
  if (path.startsWith('diplomski/')) path = path.slice('diplomski/'.length);
  if (path.startsWith('backend/')) path = path.slice('backend/'.length);
  return addBust(`${constant.PROJECT_BASE_URL}${path}`);
}

export const ProductService = {
  getProducts: function () {
    console.log("Fetching products...");

    $.ajax({
      url: constant.PROJECT_BASE_URL + "products",
      type: "GET",
      contentType: "application/json",
      success: function (res) {
        const productsDiv = document.getElementById("products-div");
        if (!productsDiv) return;

        const data = res.data || [];
        productsDiv.innerHTML = "";

        if (!data.length) {
          productsDiv.innerHTML = '<div class="col text-center text-muted py-4">No products available.</div>';
          return;
        }

        data.forEach(product => {
          const isOnSale = Number(product.OnSale) === 1;
          const hasOriginal = isOnSale && product.OriginalPrice && Number(product.OriginalPrice) > 0;
          const original = hasOriginal
            ? `<span class="text-decoration-line-through me-2">${formatBAM(product.OriginalPrice)}</span>`
            : "";

          productsDiv.innerHTML += `
            <div class="col mb-5" id="product-${product.ProductID}">
              <div class="card h-100 shadow-sm border-0">
                <a href="#product" onclick="ProductService.getProductById(${product.ProductID})" class="text-decoration-none text-dark">
                  <div class="position-relative">
                    <img class="card-img-top" src="${resolveImage(product.ImageURL)}" alt="${product.Name}" />
                    ${isOnSale ? '<span class="badge bg-dark text-white position-absolute" style="top: 0.5rem; right: 0.5rem">Sale</span>' : ''}
                  </div>
                  <div class="card-body p-4">
                    <div class="text-center">
                      <h5 class="fw-bolder">${product.Name}</h5>
                      <p class="text-muted">${original}<span class="fw-bold">${formatBAM(product.Price)}</span></p>
                    </div>
                  </div>
                </a>
                <div class="card-footer p-4 pt-0 border-top-0 bg-transparent">
                  <div class="text-center">
                    <button class="btn btn-primary mt-auto" type="button" onclick="addToCart(${product.ProductID}, '${product.Name.replace(/'/g, "\\'")}', ${product.Price}, '${product.ImageURL}')">Add to Cart</button>
                  </div>
                </div>
              </div>
            </div>
          `;
        });
      },
      error: function (err) {
        console.log("Failed to fetch products");
        console.log(err);
        toastr.error("Failed to fetch products: " + err.responseText);
      }
    });
  },

  renderCategorySections: function (sections) {
    $.ajax({
      url: constant.PROJECT_BASE_URL + "products",
      type: "GET",
      contentType: "application/json",
      success: function (res) {
        const data = res.data || [];
        sections.forEach(section => {
          const container = document.getElementById(section.containerId);
          if (!container) return;

          const items = data.filter(p => parseInt(p.CategoryID) === section.categoryId);
          if (!items.length) {
            container.innerHTML = '<div class="col text-center text-muted py-4">No products in this category.</div>';
            return;
          }

          container.innerHTML = '';
          items.forEach(product => {
            const isOnSale = Number(product.OnSale) === 1;
            const hasOriginal = isOnSale && product.OriginalPrice && Number(product.OriginalPrice) > 0;
            const original = hasOriginal
              ? `<span class="text-decoration-line-through me-2">${formatBAM(product.OriginalPrice)}</span>`
              : "";

            container.innerHTML += `
              <div class="col mb-5" id="product-${product.ProductID}">
                <div class="card h-100 shadow-sm border-0">
                  <a href="#product" onclick="ProductService.getProductById(${product.ProductID})" class="text-decoration-none text-dark">
                    <div class="position-relative">
                      <img class="card-img-top" src="${resolveImage(product.ImageURL)}" alt="${product.Name}">
                      ${isOnSale ? '<span class="badge bg-dark text-white position-absolute" style="top: 0.5rem; right: 0.5rem">Sale</span>' : ''}
                    </div>
                    <div class="card-body p-4">
                      <div class="text-center">
                        <h5 class="fw-bolder">${product.Name}</h5>
                        <p class="text-muted">${original}<span class="fw-bold">${formatBAM(product.Price)}</span></p>
                      </div>
                    </div>
                  </a>
                  <div class="card-footer p-4 pt-0 border-top-0 bg-transparent">
                    <div class="text-center">
                      <button class="btn btn-primary mt-auto" type="button" onclick="addToCart(${product.ProductID}, '${product.Name.replace(/'/g, "\\'")}', ${product.Price}, '${product.ImageURL}')">Add to Cart</button>
                    </div>
                  </div>
                </div>
              </div>
            `;
          });
        });
      },
      error: function (err) {
        console.error(err);
      }
    });
  },

  renderHomeProducts: function (limit = 4) {
    $.ajax({
      url: constant.PROJECT_BASE_URL + "products",
      type: "GET",
      contentType: "application/json",
      success: function (res) {
        const data = res.data || [];
        const target = document.getElementById("home-products");
        if (!target) return;

        const items = data.slice(0, limit);
        if (!items.length) {
          target.innerHTML = '<div class="col text-center text-muted py-4">No products available.</div>';
          return;
        }

        target.innerHTML = '';
        items.forEach(product => {
          const isOnSale = Number(product.OnSale) === 1;
          const hasOriginal = isOnSale && product.OriginalPrice && Number(product.OriginalPrice) > 0;
          const original = hasOriginal
            ? `<span class="text-decoration-line-through me-2">${formatBAM(product.OriginalPrice)}</span>`
            : "";

          target.innerHTML += `
            <div class="col mb-5" id="home-product-${product.ProductID}">
              <div class="card h-100 shadow-sm border-0">
                <a href="#product" onclick="ProductService.getProductById(${product.ProductID})" class="text-decoration-none text-dark">
                  <div class="position-relative">
                    <img class="card-img-top img-fluid" src="${resolveImage(product.ImageURL)}" alt="${product.Name}">
                    ${isOnSale ? '<span class="badge bg-danger text-white position-absolute top-0 end-0 m-2">Hot Deal</span>' : ''}
                  </div>
                  <div class="card-body text-center">
                    <h5 class="fw-bolder">${product.Name}</h5>
                    <p class="text-muted">${original}<span class="fw-bold">${formatBAM(product.Price)}</span></p>
                  </div>
                </a>
                <div class="card-footer p-4 pt-0 border-top-0 bg-transparent">
                  <div class="text-center">
                    <button class="btn btn-primary mt-auto" type="button" onclick="addToCart(${product.ProductID}, '${product.Name.replace(/'/g, "\\'")}', ${product.Price}, '${product.ImageURL}')">Add to Cart</button>
                  </div>
                </div>
              </div>
            </div>
          `;
        });
      },
      error: function (err) {
        console.error(err);
      }
    });
  },

  getProductById: function (productId) {
    console.log("Fetching product with ID:", productId);

    $.ajax({
      url: constant.PROJECT_BASE_URL + "products/" + productId,
      type: "GET",
      contentType: "application/json",
      success: function (res) {
        const product = document.getElementById("product");
        if (!product) return;

        const features = (res.data && res.data.features ? res.data.features : "").split("\n");

        product.innerHTML = "";
        product.innerHTML += `
          <div class="container px-4 px-lg-5 my-5">
            <div class="row">
              <div class="col-md-6">
                <img class="product-detail-img" src="${resolveImage(res.data.ImageURL)}" alt="${res.data.Name}">
              </div>
              <div class="col-md-6">
                <h1 class="fw-bolder">${res.data.Name}</h1>
                <p class="text-muted">${res.data.Description}</p>
                <p class="fs-4">${formatBAM(res.data.Price)}</p>

                <ul class="list-unstyled">
                  ${features.filter(Boolean).map(feature => `<li>${feature}</li>`).join("")}
                </ul>

                <div class="d-flex gap-2">
                  <button class="btn btn-primary" type="button" onclick="addToCart(${res.data.ProductID}, '${res.data.Name.replace(/'/g, "\\'")}', ${res.data.Price}, '${res.data.ImageURL}')">Add to Cart</button>
                  <a class="btn btn-outline-dark" href="#products">Back to shop</a>
                </div>
              </div>
            </div>
          </div>
        `;
      },
      error: function (err) {
        console.log("Failed to fetch product");
        console.log(err);
        toastr.error("Failed to fetch product: " + err.responseText);
      }
    });
  }
};

if (typeof window !== 'undefined') {
  window.ProductService = ProductService;
}
