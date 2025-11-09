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
                <input type="file" id="productFile" accept=".zip,.pdf,.jpg,.png,.mp4">
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
        const fileInput = document.getElementById("productFile");
        const file = fileInput.files[0];

        if (!name || !price || !file) return alert("Fill all fields and select a file!");

        const reader = new FileReader();
        reader.onload = function(e) {
            const fileData = e.target.result; // Base64 string

            let products = JSON.parse(localStorage.getItem("products") || "[]");
            products.push({ name, price, fileData, fileName: file.name });
            localStorage.setItem("products", JSON.stringify(products));

            document.getElementById("productName").value = "";
            document.getElementById("productPrice").value = "";
            fileInput.value = "";

            displayProducts();
        };
        reader.readAsDataURL(file);
    }

    function displayProducts() {
        const productList = document.getElementById("productList");
        productList.innerHTML = "";

        let products = JSON.parse(localStorage.getItem("products") || "[]");
        products.forEach((p, index) => {
            const li = document.createElement("li");
            li.innerHTML = `
                ${p.name} - $${p.price} 
                <a href="${p.fileData}" download="${p.fileName}">Download</a>
                <button onclick="editProduct(${index})">Edit</button>
                <button onclick="deleteProduct(${index})">Delete</button>
            `;
            productList.appendChild(li);
        });
    }

    // Edit & Delete
    window.editProduct = function(index) {
        let products = JSON.parse(localStorage.getItem("products") || "[]");
        const p = products[index];

        const newName = prompt("Product Name:", p.name);
        const newPrice = prompt("Price:", p.price);
        if (!newName || !newPrice) return;

        // Optional: change file? (simpler: keep old file)
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
