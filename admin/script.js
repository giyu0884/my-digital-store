document.addEventListener("DOMContentLoaded", () => {
    // Dummy admin credentials
    const adminUser = "admin";
    const adminPass = "1234";

    const loginBtn = document.getElementById("loginBtn");

    loginBtn.addEventListener("click", () => {
        const username = document.getElementById("username").value;
        const password = document.getElementById("password").value;

        if(username === adminUser && password === adminPass) {
            // Replace login form with simple dashboard
            document.body.innerHTML = `
                <h1>Welcome, Admin!</h1>
                <p>Here you can manage your products.</p>
                <button id="logoutBtn">Logout</button>
            `;

            // Logout button reloads the page
            document.getElementById("logoutBtn").addEventListener("click", () => {
                location.reload();
            });
        } else {
            alert("Incorrect username or password!");
        }
    });
});
