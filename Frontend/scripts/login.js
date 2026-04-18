document.getElementById("loginForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const login = document.getElementById("loginField").value.trim();
  const password = document.getElementById("password").value.trim();

  try {
    const response = await fetch("http://localhost:3000/api/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        login,
        password
      })
    });

    const data = await response.json();

    if (!response.ok) {
      alert(data.message || "Login failed");
      return;
    }

    localStorage.setItem(
      "buddyLoggedInUser",
      JSON.stringify(data.user)
    );

    alert("Login successful!");
    window.location.href = "buddy.html";

  } catch (error) {
    console.error(error);
    alert("Server error. Please try again.");
  }
});