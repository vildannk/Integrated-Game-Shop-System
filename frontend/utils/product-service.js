let ProductService = {
  getProducts: function () {
    console.log("Fetching products...");

    $.ajax({
      url: "http://localhost/vildankWebProject/backend/product/all",
      type: "GET",
      contentType: "application/json",
      success: function (res) {
       const productsDiv = document.getElementById("products-div");

        const data = res[0];
        
        productsDiv.innerHTML = ""; // Clear existing products

        data.forEach(product => {
             productsDiv.innerHTML += `

            <div class="col mb-5" id ="product-${product.ProductID}">
            <a href = "#product" onclick="ProductService.getProductById(${product.ProductID})" >
                        <div class="card h-100">
                            <!-- Sale badge-->
                            <div class="badge bg-dark text-white position-absolute" style="top: 0.5rem; right: 0.5rem">Sale</div>
                            <!-- Product image-->
                            <img class="card-img-top" src="${product.ImageURL}" alt="..." />
                            <!-- Product details-->
                            <div class="card-body p-4">
                                <div class="text-center">
                                    <!-- Product name-->
                                    <h5 class="fw-bolder">${product.Name}</h5>
                                    <!-- Product reviews-->
                                    <div class="d-flex justify-content-center smasll text-warning mb-2">
                                        <div class="bi-star-fill"></div>
                                        <div class="bi-star-fill"></div>
                                        <div class="bi-star-fill"></div>
                                        <div class="bi-star-fill"></div>
                                        <div class="bi-star-fill"></div>
                                    </div>
                                    <!-- Product price-->
                                    
                                   $${product.Price}
                                </div>
                            </div>
                            <!-- Product actions-->
                            <div class="card-footer p-4 pt-0 border-top-0 bg-transparent">
                                <div class="text-center"><button class="btn btn-outline-dark mt-auto" type="button" onclick="addToCart(${product.ProductID}, '${product.Name.replace(/'/g,"\\'")}', ${product.Price}, '${product.ImageURL}')">Add to cart</button></div>
                            </div>
                        </div>
                        </a>
                    </div>
            `
            
        });
       
        // Handle the response data as needed
      },
      error: function (err) {
        console.log("Failed to fetch products");
        console.log(err);
        toastr.error("Failed to fetch products: " + err.responseText);
      }
    });
  },

  getProductById: function (productId) {
    console.log("Fetching product with ID:", productId);



    $.ajax({
      url: `http://localhost/vildankWebProject/backend/product/${productId}`,
      type: "GET",
      contentType: "application/json",
      success: function (res) {
       const product = document.getElementById("product");

       console.log(res);

       const features = res.features.split("\n");


       console.log("FEATURES ARRAY: ", features);
       
       
       

       product.innerHTML = ""; // Clear existing product details

       product.innerHTML += `
               <div class="container px-4 px-lg-5 my-5">
        <div class="row">
            <div class="col-md-6">
                <img class="img-fluid" src="${res.ImageURL}" alt="Razer Kraken Kitty Headset">
            </div>
            <div class="col-md-6">

                <h1 class="fw-bolder">${res.Name}</h1>
                <p class="text-muted">${res.Description}</p>
                <p class="fs-4">
                   $${res.Price}
                </p>

                <ul id ="product-features">


                </ul>
    
                <div class="d-flex">
                    <button class="btn btn-primary me-2">Buy Now</button>
                    <button class="btn btn-outline-dark" method="SUBMIT" onclick="CartService.addToCart(${res.ProductID})" id="addtocartbuton" data-product-id="${res.ProductID}">
                      Add to Cart
                    </button>
                </div>
            </div>
        </div>
    </div> `;

    const featuresDiv = document.getElementById("product-features");
        
        features.forEach(feature => {
          featuresDiv.innerHTML += `<li>${feature}</li>`;
        });
  
       
   
      },
      error: function (err) {
        console.log("Failed to fetch product");
        console.log(err);
        toastr.error("Failed to fetch product: " + err.responseText);
      }
    });
  }
};
