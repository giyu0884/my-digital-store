const adminUser = "admin";
const adminPass = "1234";

const loginBtn = document.getElementById("loginBtn");
const adminContent = document.getElementById("adminContent");

loginBtn.addEventListener("click", () => {
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;
    if(username===adminUser && password===adminPass){
        loginBtn.style.display="none";
        document.getElementById("username").style.display="none";
        document.getElementById("password").style.display="none";
        adminContent.style.display="block";
        renderAdminProducts();
    } else alert("Incorrect credentials!");
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
    if(!name||!price||!image){ alert("Fill all fields"); return; }
    products.push({name,price,image});
    localStorage.setItem("products",JSON.stringify(products));
    renderAdminProducts();
};

window.editProduct = (i)=>{
    const newName = prompt("Product name:", products[i].name);
    const newPrice = prompt("Price:", products[i].price);
    const newImage = prompt("Image URL:", products[i].image);
    if(newName) products[i].name=newName;
    if(newPrice) products[i].price=parseFloat(newPrice);
    if(newImage) products[i].image=newImage;
    localStorage.setItem("products",JSON.stringify(products));
    renderAdminProducts();
};

window.deleteProduct = (i)=>{
    if(confirm("Delete this product?")){
        products.splice(i,1);
        localStorage.setItem("products",JSON.stringify(products));
        renderAdminProducts();
    }
};
