document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("contactForm");
  const successMsg = document.getElementById("formSuccessMessage");
  if (!form) return; // Prevent errors if form is not present

  form.addEventListener("submit", async function (e) {
    e.preventDefault(); // Always prevent default submit

    const name = form.name.value.trim();
    const email = form.email.value.trim();
    const phone = form.phone.value.trim();
    const company = form.company.value.trim();
    const message = form.message.value.trim();

    // --- Client-side validation ---
    if (!name || !email || !phone || !company || !message) {
      alert("Please fill all fields.");
      return;
    }
    const emailPattern = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;
    if (!emailPattern.test(email)) {
      alert("Please enter a valid email address.");
      return;
    }
    const phonePattern = /^\+?[1-9]\d{6,14}$/;
    if (!phonePattern.test(phone)) {
      alert("Please enter a valid phone number.");
      return;
    }

    /*
    // --- Email API validation (DISABLED due to 401 Unauthorized errors) ---
    try {
      const emailRes = await fetch(`https://emailvalidation.abstractapi.com/v1/?api_key=YOUR_API_KEY&email=${encodeURIComponent(email)}`);
      const emailData = await emailRes.json();
      if (
        emailData &&
        typeof emailData.deliverability !== "undefined" &&
        emailData.deliverability !== "DELIVERABLE" &&
        emailData.deliverability !== "UNKNOWN" &&
        emailData.deliverability !== "RISKY"
      ) {
        alert("Email address could not be verified.");
        return;
      }
    } catch (err) {
      // Fail silently, continue
    }

    // --- Phone API validation (DISABLED due to 401 Unauthorized errors) ---
    try {
      const phoneRes = await fetch(`https://phonevalidation.abstractapi.com/v1/?api_key=YOUR_API_KEY&phone=${encodeURIComponent(phone)}`);
      const phoneData = await phoneRes.json();
      if (
        phoneData &&
        typeof phoneData.valid !== "undefined" &&
        (!phoneData.valid || phoneData.line_type !== "mobile")
      ) {
        alert("Phone number could not be verified.");
        return;
      }
    } catch (err) {
      // Fail silently, continue
    }
    */

    // --- Submit via AJAX ---
    try {
      let endpoint = form.action && form.action !== "#" ? form.action : "https://httpbin.org/post";
      const formData = new FormData(form);
      const response = await fetch(endpoint, {
        method: form.method || "POST",
        body: formData,
        headers: {
            'Accept': 'application/json'
        }
      });
      if (response.ok) {
        // Hide form, show success message, redirect after 5s
        form.style.display = "none";
        if (successMsg) {
          successMsg.style.display = "block";
        }
        setTimeout(() => {
          window.location.href = 'https://zhlingtech.in/pricelists/';
        }, 5000);
      } else {
        // This runs if the server responds with an error (e.g., 404, 500)
        alert('Submission failed.');
        console.error("Server Error:", response.status, response.statusText, await response.text());
      }
    } catch (err) {
      // This runs if there's a network error (e.g., no internet, CORS issue)
      alert('A network error occurred. Please check your connection and try again.');
      console.error("Network or Fetch Error:", err);
    }
  });
});