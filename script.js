const response = await fetch('/api/create-invoice', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    external_id: `product-${Date.now()}`,
    amount: selectedProduct.price,
    payer_email: 'customer@example.com',
    description: selectedProduct.name
  })
});

const data = await response.json();
if(data.invoice_url){
  window.open(data.invoice_url, '_blank');
} else {
  alert("Invoice creation failed!");
}
