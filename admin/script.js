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
                <input type="text" id="productLink" placeholder="File / Link URL">
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
        const link = document.getElementById("productLink").value;

        if(!name || !price || !link) return alert("Fill all fields!");

        let products = JSON.parse(localStorage.getItem("products") || "[]");
        products.push({ name, price, link });
        localStorage.setItem("products", JSON.stringify(products));

        document.getElementById("productName").value = "";
        document.getElementById("productPrice").value = "";
        document.getElementById("productLink").value = "";

        displayProducts();
    }

    function displayProducts() {
        const productList = document.getElementById("productList");
        productList.innerHTML = "";

        let products = JSON.parse(localStorage.getItem("products") || "[]");
        products.forEach((p, index) => {
            const li = document.createElement("li");
            li.innerHTML = `
                ${p.name} - $${p.price} 
                <a href="${p.link}" target="_blank">View</a>
                <button onclick="editProduct(${index})">Edit</button>
                <button onclick="deleteProduct(${index})">Delete</button>
            `;
            productList.appendChild(li);
        });
    }

    // Edit & Delete functions
    window.editProduct = function(index) {
        let products = JSON.parse(localStorage.getItem("products") || "[]");
        const p = products[index];

        const newName = prompt("Product Name:", p.name);
        const newPrice = prompt("Price:", p.price);
        const newLink = prompt("File / Link URL:", p.link);

        if(newName && newPrice && newLink){
            products[index] = { name: newName, price: newPrice, link: newLink };
            localStorage.setItem("products", JSON.stringify(products));
            displayProducts();
        }
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
