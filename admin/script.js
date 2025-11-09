// Dummy admin credentials
const adminUser = "admin";
const adminPass = "1234";

// Get the login button
const loginBtn = document.getElementById("loginBtn");

loginBtn.addEventListener("click", () => {
    // Get input values
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;

    // Check credentials
    if(username === adminUser && password === adminPass) {
        // Login successful → show dashboard
        document.body.innerHTML = `
            <h1>Welcome, Admin!</h1>
            <p>Here you can manage your products.</p>
            <button id="logoutBtn">Logout</button>
        `;

        // Logout functionality
        document.getElementById("logoutBtn").addEventListener("click", () => {
            location.reload(); // reload login page
        });
    } else {
        alert("Incorrect username or password!");
    }
});

