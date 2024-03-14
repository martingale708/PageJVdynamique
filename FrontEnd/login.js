const messageError = document.querySelector(".login p");
document.addEventListener("DOMContentLoaded", function () {
  const token = localStorage.getItem("token");
  const form = document.querySelector("form");
  form.addEventListener("submit", async function (event) {
    event.preventDefault();

    const user = {
      email: document.querySelector("#email").value,
      password: document.querySelector("#password").value,
    };

    try {
      const response = await fetch("http://localhost:5678/api/users/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(user),
      });

      if (response.ok) {
        const data = await response.json();
        // console.log(data);
        
        //recuperation de userId et le token
        localStorage.setItem("token", data.token);
        localStorage.setItem("userId", data.userId);
        location.href = "index.html";
      } else {
        messageError.textContent = "votre e-mail ou votre mot de passe est incorrect";
      }
    } catch (error) {
      console.log(error);
    }
  });
});
