function createBuyButton(product) {
  const btn = document.createElement("button");
  btn.innerText = "Buy Now";
  btn.classList.add("buy-btn");
  btn.addEventListener("click", async () => {
    try {
      const res = await fetch("/api/create-invoice", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: product.name, price: product.price })
      });

      const data = await res.json();

      if (data.invoice_url) {
        window.location.href = data.invoice_url;
      } else {
        alert("Invoice creation failed. Check console.");
        console.error(data);
      }
    } catch (err) {
      console.error("Error calling API:", err);
      alert("Error connecting to payment server");
    }
  });

  return btn;
}
let products = JSON.parse(localStorage.getItem("products")) || [];
let selectedProduct = null;

const productList = document.getElementById("productList");
const modal = document.getElementById("checkoutModal");
const closeModal = document.querySelector(".close");
const confirmPaymentBtn = document.getElementById("confirmPaymentBtn");

function renderProducts() {
    productList.innerHTML = "";
    products.forEach((p, i) => {
        const div = document.createElement("div");
        div.className = "product-card";
        div.innerHTML = `
            <img src="${p.image}" alt="${p.name}">
            <h3>${p.name}</h3>
            <p>₱${p.price}</p>
            <button onclick="openCheckoutModal(${i})">Buy Now</button>
        `;
        productList.appendChild(div);
    });
}

function openCheckoutModal(index){
    selectedProduct = products[index];
    document.getElementById("checkoutProductName").textContent = selectedProduct.name;
    document.getElementById("checkoutProductPrice").textContent = `₱${selectedProduct.price}`;
    document.getElementById("customerName").value = "";
    modal.style.display = "block";
}

closeModal.onclick = () => modal.style.display = "none";
window.onclick = e => { if(e.target == modal) modal.style.display="none"; }

confirmPaymentBtn.onclick = async () => {
    const customerName = document.getElementById("customerName").value.trim();
    if(customerName === "") { alert("Enter your name!"); return; }
    if(!selectedProduct) return;

    try {
        const res = await fetch('/api/create-invoice', {
            method: 'POST',
            headers: {'Content-Type':'application/json'},
            body: JSON.stringify({
                external_id: `product-${Date.now()}`,
                amount: selectedProduct.price,
                payer_email: 'customer@example.com',
                description: selectedProduct.name
            })
        });
        const data = await res.json();
        if(data.invoice_url) window.open(data.invoice_url, '_blank');
        else alert("Invoice creation failed!");
    } catch (err) {
        console.error(err);
        alert("Error creating invoice!");
    }
    modal.style.display = "none";
};

renderProducts();

