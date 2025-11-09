document.addEventListener("DOMContentLoaded", () => {
    const adminUser = "admin";
    const adminPass = "1234";

    const loginBtn = document.getElementById("loginBtn");
    const loginArea = document.getElementById("loginArea");
    const adminContent = document.getElementById("adminContent");

    loginBtn.addEventListener("click", () => {
        const username = document.getElementById("username").value;
        const password = document.getElementById("password").value;

        if(username === adminUser && password === adminPass){
            loginArea.style.display = "none";
            adminContent.style.display = "block";
            renderAdminProducts();
        } else {
            alert("Incorrect credentials!");
        }
    });

    let products = JSON.parse(localStorage.getItem("products")) || [];

    function renderAdminProducts(){
        const list = document.getElementById("productListAdmin");
        list.innerHTML = "";
        products.forEach((p,i)=>{
            const div = document.createElement("div");
            div.innerHTML = `
                <p>${p.name} - ₱${p.price}</p>
                <button onclick="editProduct(${i})">Edit</button>
                <button onclick="deleteProduct(${i})">Delete</button>
            `;
            list.appendChild(div);
        });
    }

    document.getElementById("addProductBtn").onclick = () => {
        const name = document.getElementById("productName").value.trim();
        const price = parseFloat(document.getElementById("productPrice").value);
        const image = document.getElementById("productImage").value.trim();
        const file = document.getElementById("productFile").value.trim();

        if(!name||!price||!image||!file){ alert("Fill all fields"); return; }

        products.push({name, price, image, file});
        localStorage.setItem("products", JSON.stringify(products));
        renderAdminProducts();

        document.getElementById("productName").value = "";
        document.getElementById("productPrice").value = "";
        document.getElementById("productImage").value = "";
        document.getElementById("productFile").value = "";
    };

    window.editProduct = (i)=>{
        const newName = prompt("Product name:", products[i].name);
        const newPrice = prompt("Price:", products[i].price);
        const newImage = prompt("Image URL:", products[i].image);
        const newFile = prompt("Product File URL:", products[i].file);
        if(newName) products[i].name = newName;
        if(newPrice) products[i].price = parseFloat(newPrice);
        if(newImage) products[i].image = newImage;
        if(newFile) products[i].file = newFile;

        localStorage.setItem("products", JSON.stringify(products));
        renderAdminProducts();
    };

    window.deleteProduct = (i)=>{
        if(confirm("Delete this product?")){
            products.splice(i,1);
            localStorage.setItem("products", JSON.stringify(products));
            renderAdminProducts();
        }
    };
});
