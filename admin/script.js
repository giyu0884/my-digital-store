document.addEventListener("DOMContentLoaded", () => {
    const adminUser = "admin";
    const adminPass = "1234";

    const loginBtn = document.getElementById("loginBtn");

    loginBtn.addEventListener("click", () => {
        const username = document.getElementById("username").value;
        const password = document.getElementById("password").value;

        if(username === adminUser && password === adminPass) {
            showDashboard();
        } else {
            alert("Incorrect username or password!");
        }
    });

    function showDashboard() {
        document.body.innerHTML = `
            <div class="dashboard">
                <h1>Admin Dashboard</h1>
                <button id="logoutBtn">Logout</button>

                <h2>Add Product</h2>
                <input type="text" id="productName" placeholder="Product Name">
                <input type="text" id="productPrice" placeholder="Price">
                <input type="file" id="image" accept="image/*" title="Upload Image">
                <input type="file" id="product" accept=".zip,.pdf,.mp4" title="Upload Product">
                <button id="addProductBtn">Add Product</button>

                <h2>Product List</h2>
                <ul id="productList"></ul>
            </div>
        `;

        document.getElementById("logoutBtn").addEventListener("click", () => location.reload());
        document.getElementById("addProductBtn").addEventListener("click", addProduct);

        displayProducts();
    }

    function addProduct() {
        const name = document.getElementById("productName").value;
        const price = document.getElementById("productPrice").value;
        const imageFile = document.getElementById("image").files[0];
        const productFile = document.getElementById("product").files[0];

        if (!name || !price || !imageFile || !productFile) return alert("Fill all fields and select files!");

        const readerImage = new FileReader();
        readerImage.onload = function(e) {
            const imageData = e.target.result;

            const readerFile = new FileReader();
            readerFile.onload = function(ev) {
                const fileData = ev.target.result;

                let products = JSON.parse(localStorage.getItem("products") || "[]");
                products.push({
                    name,
                    price,
                    imageData,      // first file: image
                    fileData,       // second file: digital product
                    fileName: productFile.name
                });
                localStorage.setItem("products", JSON.stringify(products));

                // Clear inputs
                document.getElementById("productName").value = "";
                document.getElementById("productPrice").value = "";
                document.getElementById("image").value = "";
                document.getElementById("product").value = "";

                displayProducts();
            };
            readerFile.readAsDataURL(productFile);
        };
        readerImage.readAsDataURL(imageFile);
    }

    function displayProducts() {
        const productList = document.getElementById("productList");
        productList.innerHTML = "";

        let products = JSON.parse(localStorage.getItem("products") || "[]");
        products.forEach((p, index) => {
            const li = document.createElement("li");
            li.innerHTML = `
                <strong>${p.name}</strong> - $${p.price} <br>
                <img src="${p.imageData}" width="100" alt="${p.name}"><br>
                <button onclick="editProduct(${index})">Edit</button>
                <button onclick="deleteProduct(${index})">Delete</button>
            `;
            productList.appendChild(li);
        });
    }

    window.editProduct = function(index) {
        let products = JSON.parse(localStorage.getItem("products") || "[]");
        const p = products[index];

        const newName = prompt("Product Name:", p.name);
        const newPrice = prompt("Price:", p.price);
        if (!newName || !newPrice) return;

        products[index] = { ...p, name: newName, price: newPrice };
        localStorage.setItem("products", JSON.stringify(products));
        displayProducts();
    }

    window.deleteProduct = function(index) {
        let products = JSON.parse(localStorage.getItem("products") || "[]");
        if(confirm(`Delete ${products[index].name}?`)) {
            products.splice(index,1);
            localStorage.setItem("products", JSON.stringify(products));
            displayProducts();
        }
    }
});
