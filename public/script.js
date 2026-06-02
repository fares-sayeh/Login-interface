const emailForm = document.getElementById("emailForm");
const codeForm = document.getElementById("codeForm");

const emailInput = document.getElementById("email");
const codeInput = document.getElementById("code");

const sendBtn = document.getElementById("sendBtn");
const verifyBtn = document.getElementById("verifyBtn");

const loader = document.getElementById("loader");
const message = document.getElementById("message");

function showMessage(text, type) {
    message.textContent = text;
    message.className = type;
}

emailForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const email = emailInput.value.trim();

    if (!email) {
        showMessage("Please enter an email.", "error");
        return;
    }

    loader.style.display = "block";
    sendBtn.disabled = true;

    try {
        const response = await fetch("/send-code", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ email })
        });

        const data = await response.json();

        if (data.success) {
            showMessage("Verification code sent successfully.", "success");

            emailForm.style.display = "none";
            codeForm.style.display = "block";
        } else {
            showMessage(data.message, "error");
        }

    } catch (error) {
        console.error(error);
        showMessage("Server error.", "error");
    }

    loader.style.display = "none";
    sendBtn.disabled = false;
});

codeForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const email = emailInput.value.trim();
    const code = codeInput.value.trim();

    if (code.length !== 6) {
        showMessage("Please enter a valid 6-digit code.", "error");
        return;
    }

    loader.style.display = "block";
    verifyBtn.disabled = true;

    try {
        const response = await fetch("/verify-code", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                email,
                code
            })
        });

        const data = await response.json();

        if (data.success) {
            showMessage("Login successful ✅", "success");

            setTimeout(() => {
                alert("Welcome!");
            }, 1000);

        } else {
            showMessage("Invalid code ❌", "error");
        }

    } catch (error) {
        console.error(error);
        showMessage("Server error.", "error");
    }

    loader.style.display = "none";
    verifyBtn.disabled = false;
});