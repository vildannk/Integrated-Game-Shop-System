let AdminService = {
  init: function () {
    return;
  },

  showAllProducts: function () {
    $.ajax({
      url: Constants.PROJECT_BASE_URL + "products",
      type: "GET",
      headers: {
        Authentication: localStorage.getItem("user_token"),
      },
      success: function (data) {
        const productList = document.getElementById("product-table-body-admin");
        if (!productList) return;
        productList.innerHTML = "";

        (data.data || []).forEach((product) => {
          const row = document.createElement("tr");
          row.innerHTML = `
            <td>${product.ProductID}</td>
            <td>${product.Name}</td>
            <td>${formatBAM(product.Price)}</td>
            <td class="d-flex gap-2 justify-content-center admin-actions">
              <button class="btn btn-dark btn-sm" onclick="AdminService.editProduct(${product.ProductID})">Edit</button>
              <button class="btn btn-danger btn-sm" onclick="AdminService.deleteProduct(${product.ProductID})">Delete</button>
            </td>
          `;
          productList.appendChild(row);
        });
      },
      error: function (error) {
        console.error("Error fetching products:", error);
        toastr.error("Failed to fetch products.");
      },
    });
  },

  loadCategories: function () {
    $.ajax({
      url: Constants.PROJECT_BASE_URL + "categories",
      type: "GET",
      success: function (data) {
        const categoryList = document.getElementById("category-table-body-admin");
        if (!categoryList) return;
        categoryList.innerHTML = "";

        (data.data || []).forEach((cat) => {
          const row = document.createElement("tr");
          row.innerHTML = `
            <td>${cat.CategoryID}</td>
            <td>${cat.CategoryName}</td>
            <td class="d-flex gap-2 justify-content-center admin-actions">
              <button class="btn btn-dark btn-sm" onclick="AdminService.editCategory(${cat.CategoryID}, '${cat.CategoryName.replace(/'/g, "\\'")}')">Edit</button>
              <button class="btn btn-danger btn-sm" onclick="AdminService.deleteCategory(${cat.CategoryID})">Delete</button>
            </td>
          `;
          categoryList.appendChild(row);
        });
      },
      error: function (error) {
        console.error("Error fetching categories:", error);
        toastr.error("Failed to fetch categories.");
      },
    });
  },

  addCategoryModal: function () {
    const modalContainer = document.getElementById("addCategoryModal") || document.body;
    modalContainer.innerHTML = `
      <div class="modal fade" id="addCategoryModalDialog" tabindex="-1" aria-labelledby="addCategoryModalLabel" aria-hidden="true">
        <div class="modal-dialog">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title" id="addCategoryModalLabel">Add Category</h5>
              <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">
              <form id="addCategoryForm">
                <div class="mb-3">
                  <label class="form-label">Category Name</label>
                  <input type="text" class="form-control" id="newCategoryName" required>
                </div>
                <button type="submit" class="btn btn-primary w-100">Create Category</button>
              </form>
            </div>
          </div>
        </div>
      </div>
    `;

    const modal = new bootstrap.Modal(document.getElementById("addCategoryModalDialog"));
    modal.show();

    document.getElementById("addCategoryForm").addEventListener("submit", function (event) {
      event.preventDefault();
      const name = document.getElementById("newCategoryName").value.trim();
      AdminService.createCategory({ CategoryName: name }, modal);
    });
  },

  createCategory: function (payload, modal) {
    $.ajax({
      url: Constants.PROJECT_BASE_URL + "categories",
      type: "POST",
      headers: {
        Authentication: localStorage.getItem("user_token"),
      },
      data: JSON.stringify(payload),
      contentType: "application/json",
      success: function () {
        toastr.success("Category created successfully!");
        if (modal) modal.hide();
        AdminService.loadCategories();
      },
      error: function (error) {
        console.error("Error creating category:", error);
        toastr.error("Failed to create category.");
      },
    });
  },

  editCategory: function (id, name) {
    const modalContainer = document.getElementById("addCategoryModal") || document.body;
    modalContainer.innerHTML = `
      <div class="modal fade" id="editCategoryModalDialog" tabindex="-1" aria-labelledby="editCategoryModalLabel" aria-hidden="true">
        <div class="modal-dialog">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title" id="editCategoryModalLabel">Edit Category</h5>
              <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">
              <form id="editCategoryForm">
                <div class="mb-3">
                  <label class="form-label">Category Name</label>
                  <input type="text" class="form-control" id="editCategoryName" value="${name}" required>
                </div>
                <button type="submit" class="btn btn-dark w-100">Save Changes</button>
              </form>
            </div>
          </div>
        </div>
      </div>
    `;

    const modal = new bootstrap.Modal(document.getElementById("editCategoryModalDialog"));
    modal.show();

    document.getElementById("editCategoryForm").addEventListener("submit", function (event) {
      event.preventDefault();
      const newName = document.getElementById("editCategoryName").value.trim();
      AdminService.updateCategory(id, { CategoryName: newName }, modal);
    });
  },

  updateCategory: function (id, payload, modal) {
    $.ajax({
      url: Constants.PROJECT_BASE_URL + "categories/" + id,
      type: "PUT",
      headers: {
        Authentication: localStorage.getItem("user_token"),
      },
      data: JSON.stringify(payload),
      contentType: "application/json",
      success: function () {
        toastr.success("Category updated successfully!");
        if (modal) modal.hide();
        AdminService.loadCategories();
      },
      error: function (error) {
        console.error("Error updating category:", error);
        toastr.error("Failed to update category.");
      },
    });
  },

  deleteCategory: function (id) {
    if (!confirm("Delete this category?")) return;
    $.ajax({
      url: Constants.PROJECT_BASE_URL + "categories/" + id,
      type: "DELETE",
      headers: {
        Authentication: localStorage.getItem("user_token"),
      },
      success: function () {
        toastr.success("Category deleted successfully!");
        AdminService.loadCategories();
      },
      error: function (error) {
        console.error("Error deleting category:", error);
        toastr.error("Failed to delete category.");
      },
    });
  },

  fetchCategories: function (callback) {
    $.ajax({
      url: Constants.PROJECT_BASE_URL + "categories",
      type: "GET",
      success: function (data) {
        callback(data.data || []);
      },
      error: function () {
        callback([]);
      }
    });
  },

  uploadImage: function (file) {
    const formData = new FormData();
    formData.append('image', file);

    return $.ajax({
      url: Constants.PROJECT_BASE_URL + "uploads/images",
      type: "POST",
      headers: {
        Authentication: localStorage.getItem("user_token"),
      },
      data: formData,
      processData: false,
      contentType: false,
    });
  },

  addProductModal: function () {
    const modalContainer = document.getElementById("addProductModal") || document.body;
    modalContainer.innerHTML = `
      <div class="modal fade" id="addProductModalDialog" tabindex="-1" aria-labelledby="addProductModalLabel" aria-hidden="true">
        <div class="modal-dialog modal-lg">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title" id="addProductModalLabel">Add Product</h5>
              <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">
              <form id="addProductForm">
                <div class="row">
                  <div class="col-md-6 mb-3">
                    <label class="form-label">Name</label>
                    <input type="text" class="form-control" id="newProductName" required>
                  </div>
                  <div class="col-md-3 mb-3">
                    <label class="form-label">Price</label>
                    <input type="number" class="form-control" id="newProductPrice" step="0.05" required>
                  </div>
                  <div class="col-md-3 mb-3">
                    <label class="form-label">Original Price</label>
                    <input type="number" class="form-control" id="newProductOriginalPrice" step="0.05">
                  </div>
                  <div class="col-md-3 mb-3">
                    <label class="form-label">Stock</label>
                    <input type="number" class="form-control" id="newProductStock" required>
                  </div>
                  <div class="col-md-3 mb-3">
                    <label class="form-label">Category</label>
                    <select class="form-select" id="newProductCategory" required></select>
                  </div>
                  <div class="col-md-3 mb-3 d-flex align-items-center">
                    <div class="form-check mt-4">
                      <input class="form-check-input" type="checkbox" id="newProductOnSale">
                      <label class="form-check-label" for="newProductOnSale">On Sale</label>
                    </div>
                  </div>
                  <div class="col-md-12 mb-3">
                    <label class="form-label">Image URL</label>
                    <input type="text" class="form-control" id="newProductImage" placeholder="https://...">
                  </div>
                  <div class="col-md-12 mb-3">
                    <label class="form-label">Or Upload Image</label>
                    <input type="file" class="form-control" id="newProductImageFile" accept="image/*">
                  </div>
                  <div class="col-md-12 mb-3">
                    <label class="form-label">Description</label>
                    <textarea class="form-control" id="newProductDescription" rows="2" required></textarea>
                  </div>
                  <div class="col-md-12 mb-3">
                    <label class="form-label">Features (one per line)</label>
                    <textarea class="form-control" id="newProductFeatures" rows="3"></textarea>
                  </div>
                </div>
                <button type="submit" class="btn btn-primary w-100">Create Product</button>
              </form>
            </div>
          </div>
        </div>
      </div>
    `;

    const modal = new bootstrap.Modal(document.getElementById("addProductModalDialog"));
    modal.show();

    AdminService.fetchCategories((cats) => {
      const select = document.getElementById("newProductCategory");
      if (!select) return;
      select.innerHTML = '';
      cats.forEach(cat => {
        const opt = document.createElement('option');
        opt.value = cat.CategoryID;
        opt.textContent = cat.CategoryName;
        select.appendChild(opt);
      });
    });

    document.getElementById("addProductForm").addEventListener("submit", function (event) {
      event.preventDefault();
      const file = document.getElementById("newProductImageFile").files[0];
      const imageUrlField = document.getElementById("newProductImage").value.trim();

      const buildPayload = (finalUrl) => ({
        Name: document.getElementById("newProductName").value.trim(),
        Price: document.getElementById("newProductPrice").value,
        OriginalPrice: document.getElementById("newProductOriginalPrice").value || null,
        Stock: document.getElementById("newProductStock").value,
        CategoryID: document.getElementById("newProductCategory").value,
        OnSale: document.getElementById("newProductOnSale").checked ? 1 : 0,
        ImageURL: finalUrl,
        Description: document.getElementById("newProductDescription").value.trim(),
        features: document.getElementById("newProductFeatures").value.trim()
      });

      if (file) {
        AdminService.uploadImage(file)
          .done((res) => {
            const finalUrl = res.data && res.data.url ? res.data.url : '';
            AdminService.createProduct(buildPayload(finalUrl), modal);
          })
          .fail(() => {
            toastr.error('Image upload failed.');
          });
      } else if (imageUrlField) {
        AdminService.createProduct(buildPayload(imageUrlField), modal);
      } else {
        toastr.error('Provide an image URL or upload a file.');
      }
    });
  },

  createProduct: function (payload, modal) {
    $.ajax({
      url: Constants.PROJECT_BASE_URL + "products",
      type: "POST",
      headers: {
        Authentication: localStorage.getItem("user_token"),
      },
      data: JSON.stringify(payload),
      contentType: "application/json",
      success: function () {
        toastr.success("Product created successfully!");
        if (modal) modal.hide();
        AdminService.showAllProducts();
      },
      error: function (error) {
        console.error("Error creating product:", error);
        toastr.error("Failed to create product.");
      },
    });
  },

  deleteProduct: function (productId) {
    if (!confirm("Delete this product?")) return;
    $.ajax({
      url: Constants.PROJECT_BASE_URL + "products/" + productId,
      type: "DELETE",
      headers: {
        Authentication: localStorage.getItem("user_token"),
      },
      success: function () {
        toastr.success("Product deleted successfully!");
        AdminService.showAllProducts();
      },
      error: function (error) {
        console.error("Error deleting product:", error);
        toastr.error("Failed to delete product.");
      },
    });
  },

  editProduct: function (productId) {
    $.ajax({
      url: Constants.PROJECT_BASE_URL + "products/" + productId,
      type: "GET",
      headers: {
        Authentication: localStorage.getItem("user_token"),
      },
      success: function (data) {
        const product = data.data || data;
        const modalHtml = `
          <div class="modal fade" id="editProductModal" tabindex="-1" aria-labelledby="editProductModalLabel" aria-hidden="true">
            <div class="modal-dialog">
              <div class="modal-content">
                <div class="modal-header">
                  <h5 class="modal-title" id="editProductModalLabel">Edit Product</h5>
                  <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                  <form id="editProductForm">
                    <div class="mb-3">
                      <label class="form-label">Name</label>
                      <input type="text" class="form-control" id="editProductName" value="${product.Name}" required>
                    </div>
                    <div class="mb-3">
                      <label class="form-label">Price</label>
                      <input type="number" class="form-control" id="editProductPrice" value="${product.Price}" required>
                    </div>
                    <div class="mb-3">
                      <label class="form-label">Stock</label>
                      <input type="number" class="form-control" id="editProductStock" value="${product.Stock}" required>
                    </div>
                    <div class="mb-3">
                      <label class="form-label">Image URL</label>
                      <input type="text" class="form-control" id="editProductImage" value="${product.ImageURL || ''}" placeholder="https://...">
                    </div>
                    <div class="mb-3">
                      <label class="form-label">Or Upload Image</label>
                      <input type="file" class="form-control" id="editProductImageFile" accept="image/*">
                    </div>
                    <button type="submit" class="btn btn-dark w-100">Save Changes</button>
                  </form>
                </div>
              </div>
            </div>
          </div>
        `;

        const modalContainer = document.getElementById("modal-container") || document.body;
        modalContainer.insertAdjacentHTML("beforeend", modalHtml);

        const modal = new bootstrap.Modal(document.getElementById("editProductModal"));
        modal.show();

        document.getElementById("editProductForm").addEventListener("submit", function (event) {
          event.preventDefault();
          const file = document.getElementById("editProductImageFile").files[0];
          const imageUrlField = document.getElementById("editProductImage").value.trim();
          const updatedProduct = {
            Name: document.getElementById("editProductName").value,
            Price: document.getElementById("editProductPrice").value,
            Stock: document.getElementById("editProductStock").value,
            ImageURL: imageUrlField || product.ImageURL || ""
          };

          if (file) {
            AdminService.uploadImage(file)
              .done((res) => {
                updatedProduct.ImageURL = (res.data && res.data.url) ? res.data.url : updatedProduct.ImageURL;
                AdminService.updateProduct(productId, updatedProduct);
                modal.hide();
              })
              .fail(() => {
                toastr.error('Image upload failed.');
              });
          } else {
            AdminService.updateProduct(productId, updatedProduct);
            modal.hide();
          }
        });
      },
      error: function (error) {
        console.error("Error fetching product:", error);
        toastr.error("Failed to fetch product details.");
      },
    });
  },

  updateProduct: function (productId, updatedProduct) {
    $.ajax({
      url: Constants.PROJECT_BASE_URL + "products/" + productId,
      type: "PUT",
      headers: {
        Authentication: localStorage.getItem("user_token"),
      },
      data: JSON.stringify(updatedProduct),
      contentType: "application/json",
      success: function () {
        toastr.success("Product updated successfully!");
        AdminService.showAllProducts();
      },
      error: function (error) {
        console.error("Error updating product:", error);
        toastr.error("Failed to update product.");
      },
    });
  },
};
