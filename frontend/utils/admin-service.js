let AdminService = {
 



  showAllProducts: function () {

    $.ajax({
        url:"http://localhost/vildankWebProject/backend/product/all",
        type: "GET",
        headers: {
          Authentication: localStorage.getItem("user_token"),
        },
        success: function (data) {

            console.log(data);
            
          const productList = document.getElementById("product-table-body-admin");
          productList.innerHTML = ""; 

            data[0].forEach((product) => {
                const row = document.createElement("tr");
                row.innerHTML = `
                <td>${product.ProductID}</td>
                <td>${product.Name}</td>
                <td>$${product.Price}</td>
                <td>
                    <button class="btn btn-danger" onclick="AdminService.deleteProduct(${product.ProductID})">Delete</button>
                    <button class="btn btn-primary" onclick="AdminService.editProduct(${product.ProductID})">Edit</button>
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



    deleteProduct: function (productId) {
        $.ajax({
        url: `http://localhost/vildankWebProject/backend/product/${productId}`,
        type: "DELETE",
        headers: {
            Authentication: localStorage.getItem("user_token"),
        },
        success: function (data) {
            toastr.success("Product deleted successfully!");
            AdminService.showAllProducts(); // Refresh the product list
        },
        error: function (error) {
            console.error("Error deleting product:", error);
            toastr.error("Failed to delete product.");
        },
        });
    },


    editProduct: function (productId) {
        // Fetch product data and show modal for editing
        $.ajax({
            url: `http://localhost/vildankWebProject/backend/product/${productId}`,
            type: "GET",
            headers: {
                Authentication: localStorage.getItem("user_token"),
            },
            success: function (data) {
                // If data is an array, get the first element
                const product = Array.isArray(data) ? data[0] : data;
                // Build modal HTML
                const modalHtml = `
                <div class="modal fade" id="editProductModal" tabindex="-1" aria-labelledby="editProductModalLabel" aria-hidden="true">
                  <div class="modal-dialog">
                    <div class="modal-content">
                      <div class="modal-header">
                        <h5 class="modal-title" id="editProductModalLabel">Edit Product</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                      </div>
                      <form id="editProductForm">
                      <div class="modal-body">
                        <input type="hidden" id="editProductID" value="${product.ProductID}">
                        <div class="mb-3">
                          <label for="editProductName" class="form-label">Name</label>
                          <input type="text" class="form-control" id="editProductName" value="${product.Name || ''}" required>
                        </div>
                        <div class="mb-3">
                          <label for="editProductPrice" class="form-label">Price</label>
                          <input type="number" class="form-control" id="editProductPrice" value="${product.Price || ''}" step="0.01" required>
                        </div>
                        <div class="mb-3">
                          <label for="editProductStock" class="form-label">Stock</label>
                          <input type="number" class="form-control" id="editProductStock" value="${product.Stock || ''}" required>
                        </div>
                        <div class="mb-3">
                          <label for="editProductCategory" class="form-label">Category ID</label>
                          <input type="number" class="form-control" id="editProductCategory" value="${product.CategoryID || ''}" required>
                        </div>
                        <div class="mb-3">
                          <label for="editProductDescription" class="form-label">Description</label>
                          <textarea class="form-control" id="editProductDescription">${product.Description || ''}</textarea>
                        </div>
                        <div class="mb-3">
                          <label for="editProductImageURL" class="form-label">Image URL</label>
                          <input type="text" class="form-control" id="editProductImageURL" value="${product.ImageURL || ''}">
                        </div>
                      </div>
                      <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
                        <button type="submit" class="btn btn-primary">Save Changes</button>
                      </div>
                      </form>
                    </div>
                  </div>
                </div>`;
                // Render modal in the DOM
                document.getElementById("addProductModal").innerHTML = modalHtml;
                // Show modal
                var modal = new bootstrap.Modal(document.getElementById('editProductModal'));
                modal.show();
                // Handle form submission
                $("#editProductForm").off("submit").on("submit", function(e) {
                    e.preventDefault();
                    const updatedProduct = {
                        Name: $("#editProductName").val(),
                        Price: $("#editProductPrice").val(),
                        Stock: $("#editProductStock").val(),
                        CategoryID: $("#editProductCategory").val(),
                        Description: $("#editProductDescription").val(),
                        ImageURL: $("#editProductImageURL").val()
                    };
                    const id = $("#editProductID").val();
                    $.ajax({
                        url: `http://localhost/vildankWebProject/backend/product/${productId}`,
                        type: "PUT",
                        data: JSON.stringify(updatedProduct),
                        contentType: "application/json",
                        headers: {
                            Authentication: localStorage.getItem("user_token"),
                        },
                        success: function (res) {
                            toastr.success("Product updated successfully!");
                            modal.hide();
                            AdminService.showAllProducts();
                        },
                        error: function (err) {
                            toastr.error("Failed to update product.");
                        }
                    });
                });
            },
            error: function (error) {
                console.error("Error fetching product for edit:", error);
                toastr.error("Failed to fetch product for editing.");
            },
        });
    },


    addProductModal: function () {
        // Build modal HTML
        const modalHtml = `
        <div class="modal fade" id="addProductModalDialog" tabindex="-1" aria-labelledby="addProductModalLabel" aria-hidden="true">
          <div class="modal-dialog">
            <div class="modal-content">
              <div class="modal-header">
                <h5 class="modal-title" id="addProductModalLabel">Add Product</h5>
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
              </div>
              <form id="addProductForm">
              <div class="modal-body">
                <div class="mb-3">
                  <label for="addProductName" class="form-label">Name</label>
                  <input type="text" class="form-control" id="addProductName" required>
                </div>
                <div class="mb-3">
                  <label for="addProductPrice" class="form-label">Price</label>
                  <input type="number" class="form-control" id="addProductPrice" step="0.01" required>
                </div>
                <div class="mb-3">
                  <label for="addProductStock" class="form-label">Stock</label>
                  <input type="number" class="form-control" id="addProductStock" required>
                </div>
                <div class="mb-3">
                  <label for="addProductCategory" class="form-label">Category ID</label>
                  <input type="number" class="form-control" id="addProductCategory" required min="1">
                </div>
        
                <div class="mb-3">
                  <label for="addProductDescription" class="form-label">Description</label>
                  <textarea class="form-control" id="addProductDescription"></textarea>
                </div>
                <div class="mb-3">
                  <label for="addProductImageURL" class="form-label">Image URL</label>
                  <input type="text" class="form-control" id="addProductImageURL">
                </div>
              </div>
              <div class="modal-footer">
                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
                <button type="submit" class="btn btn-success">Add Product</button>
              </div>
              </form>
            </div>
          </div>
        </div>`;
        // Render modal in the DOM
        document.getElementById("addProductModal").innerHTML = modalHtml;
        // Show modal
        var modal = new bootstrap.Modal(document.getElementById('addProductModalDialog'));
        modal.show();
        // Handle form submission
        $("#addProductForm").off("submit").on("submit", function(e) {
            e.preventDefault();
            // Client-side validation
            const name = $("#addProductName").val().trim();
            const price = parseFloat($("#addProductPrice").val());
            const stock = parseInt($("#addProductStock").val());
            const description = $("#addProductDescription").val().trim();
            const imageUrl = $("#addProductImageURL").val().trim();
            const categoryId = parseInt($("#addProductCategory").val());
            let valid = true;
            if (!name) {
                toastr.error("Name is required.");
                valid = false;
            }
            if (isNaN(price) || price <= 0) {
                toastr.error("Price must be a positive number.");
                valid = false;
            }
            if (isNaN(stock) || stock < 0) {
                toastr.error("Stock must be a non-negative number.");
                valid = false;
            }
            if (!description) {
                toastr.error("Description is required.");
                valid = false;
            }
            if (!imageUrl) {
                toastr.error("Image URL is required.");
                valid = false;
            }
            if (isNaN(categoryId) || categoryId < 1) {
                toastr.error("Category ID is required.");
                valid = false;
            }
            if (!valid) return;
            const newProduct = {
                Name: name,
                Price: price,
                Stock: stock,
                CategoryID: categoryId,
                Description: description,
                ImageURL: imageUrl
            };
            $.ajax({
                url: "http://localhost/vildankWebProject/backend/product/addproduct",
                type: "POST",
                data: JSON.stringify(newProduct),
                contentType: "application/json",
                headers: {
                    Authentication: localStorage.getItem("user_token"),
                },
                success: function (res) {
                    toastr.success("Product added successfully!");
                    modal.hide();
                    AdminService.showAllProducts();
                },
                error: function (err) {
                    toastr.error("Failed to add product.");
                }
            });
        });
    },

};

AdminService.showAllProducts();
