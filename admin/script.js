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

    function readFileAsBase64(file){
        return new Promise((resolve,reject)=>{
            const reader = new FileReader();
            reader.onload = e => resolve(e.target.result);
            reader.onerror = e => reject(e);
            reader.readAsDataURL(file);
        });
    }

    document.getElementById("addProductBtn").onclick = async () => {
        const name = document.getElementById("productName").value.trim();
        const price = parseFloat(document.getElementById("productPrice").value);
        const imageFile = document.getElementById("productImage").files[0];
        const productFile = document.getElementById("productFile").files[0];

        if(!name || !price || !imageFile || !productFile){ alert("Fill all fields"); return; }

        const imageBase64 = await readFileAsBase64(imageFile);
        const productBase64 = await readFileAsBase64(productFile);

        products.push({name, price, image: imageBase64, file: productBase64});
        localStorage.setItem("products", JSON.stringify(products));
        renderAdminProducts();

        document.getElementById("productName").value = "";
        document.getElementById("productPrice").value = "";
        document.getElementById("productImage").value = "";
        document.getElementById("productFile").value = "";
    };

    window.editProduct = async (i)=>{
        const newName = prompt("Product title:", products[i].name);
        const newPrice = prompt("Price:", products[i].price);
        
        let newImage = products[i].image;
        let newFile = products[i].file;

        const imageInput = document.createElement("input");
        imageInput.type = "file";
        imageInput.accept = "image/*";
        imageInput.onchange = async e => {
            if(e.target.files[0]) newImage = await readFileAsBase64(e.target.files[0]);
        };
        imageInput.click();

        const fileInput = document.createElement("input");
        fileInput.type = "file";
        fileInput.onchange = async e => {
            if(e.target.files[0]) newFile = await readFileAsBase64(e.target.files[0]);
        };
        fileInput.click();

        if(newName) products[i].name = newName;
        if(newPrice) products[i].price = parseFloat(newPrice);
        products[i].image = newImage;
        products[i].file = newFile;

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
