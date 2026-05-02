if (window.lucide) {
  lucide.createIcons();
}

const form = document.getElementById("callbackForm");
const statusEl = document.getElementById("formStatus");

form.addEventListener("submit", async (event) => {
  event.preventDefault();

  const formData = new FormData(form);
  const name = String(formData.get("name") || "").trim();
  const phone = String(formData.get("phone") || "").trim();
  const city = String(formData.get("city") || "").trim();
  const contactMethod = String(formData.get("contactMethod") || "Phone call").trim();

  statusEl.textContent = "Sending request...";
  statusEl.className = "form-status";
  form.querySelector("button[type='submit']").disabled = true;

  try {
    const response = await fetch("/.netlify/functions/send-telegram", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, phone, city, contactMethod }),
    });

    if (!response.ok) {
      throw new Error("Request failed");
    }

    form.reset();
    statusEl.textContent = "Request sent. We will contact you shortly.";
    statusEl.classList.add("is-success");
  } catch (error) {
    statusEl.textContent = "Could not send request. Please call us directly.";
    statusEl.classList.add("is-error");
  } finally {
    form.querySelector("button[type='submit']").disabled = false;
  }
});
