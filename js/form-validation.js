document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("contactForm");

  form.addEventListener("submit", async function (e) {
    e.preventDefault();

    const name = form.name.value.trim();
    const email = form.email.value.trim();
    const phone = form.phone.value.trim();
    const company = form.company.value.trim();
    const message = form.message.value.trim();

    let errors = [];

    if (!name || !email || !phone || !company || !message) {
      errors.push("All fields are required.");
    }

    const emailPattern = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;
    if (!emailPattern.test(email)) {
      errors.push("Invalid email format.");
    }

    const phonePattern = /^\+?[1-9]\d{6,14}$/;
    if (!phonePattern.test(phone)) {
      errors.push("Invalid international phone number format.");
    }

    if (errors.length > 0) {
      alert(errors.join("\n"));
      return;
    }

    try {
      const emailRes = await fetch(`https://emailvalidation.abstractapi.com/v1/?api_key=e2af50e3ae754a969c3940bc3fec0dbe&email=${email}`);
      const emailData = await emailRes.json();
      if (emailData.deliverability !== "DELIVERABLE") {
        alert("Email is not deliverable.");
        return;
      }

      const phoneRes = await fetch(`https://phonevalidation.abstractapi.com/v1/?api_key=270adeddc91f405788d0ae9a512deac9&phone=${phone}`);
      const phoneData = await phoneRes.json();
      if (!phoneData.valid || phoneData.line_type !== "mobile") {
        alert("Phone number is not valid or not a mobile line.");
        return;
      }

      // ✅ All checks passed — simulate success
      alert("Form submitted successfully!");
      window.location.href = "https://zhlingtech.in/pricelists/";
    } catch (err) {
      console.error("Verification error:", err);
      alert("Verification failed due to a network or API error.");
    }
  });
});