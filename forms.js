document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("myForm");

  const fields = {
    name: document.getElementById("name"),
    age: document.getElementById("age"),
    email: document.getElementById("email"),
    gender: document.querySelectorAll('input[name="gender"]'),
    course: document.getElementById("course"),
    resume: document.getElementById("resume"),
    phone: document.getElementById("phone"),
    address: document.getElementById("address"),
    linkedin: document.getElementById("linkedin"),
    github: document.getElementById("github"),
  };

  const errorMessages = {
    name: "Name is required.",
    age: "Enter a valid age (between 18 and 40).",
    email: "Enter a valid email (must contain '@' and a '.').",
    gender: "Select a gender.",
    course: "Choose a course.",
    resume: "Upload your resume.",
    phone: "Enter a valid 10-digit phone number.",
    address: "Address must be at least 5 characters long.",
    linkedin: "Enter a valid LinkedIn URL (should start with 'http').",
    github: "Enter a valid GitHub URL (should start with 'http').",
  };

  function validateField(field) {
    const value = field.value.trim();
    let isValid = true;
    let errorMsg = "";

    switch (field.id) {
      case "name":
        isValid = value.length > 0;
        break;
      case "age":
        const ageValue = Number(value);
        isValid =
          value !== "" && !isNaN(ageValue) && ageValue >= 18 && ageValue <= 40;
        break;
      case "email":
        isValid = value.includes("@") && value.includes(".");
        break;
      case "phone":
        isValid = value.length === 10 && !isNaN(value);
        break;
      case "linkedin":
      case "github":
        isValid = value === "" || value.startsWith("http");
        break;
      case "address":
        isValid = value.length >= 5;
        break;
      case "course":
        isValid = value !== "";
        break;
      case "resume":
        isValid = field.files.length > 0;
        break;
    }

    if (!isValid) {
      errorMsg = errorMessages[field.id];
    }

    displayError(field, errorMsg);
    return isValid;
  }

  function validateGender() {
    let isValid = false;
    fields.gender.forEach((radio) => {
      if (radio.checked) isValid = true;
    });
    displayError(fields.gender[0], isValid ? "" : errorMessages.gender);
    return isValid;
  }

  function displayError(field, message) {
    let errorSpan = field.nextElementSibling;
    if (!errorSpan || !errorSpan.classList.contains("error-message")) {
      errorSpan = document.createElement("span");
      errorSpan.classList.add("error-message");
      field.parentNode.appendChild(errorSpan);
    }
    errorSpan.textContent = message;
  }

  function validateForm(event) {
    event.preventDefault();
    let isValid = true;

    Object.values(fields).forEach((field) => {
      if (
        field.nodeName === "INPUT" ||
        field.nodeName === "TEXTAREA" ||
        field.nodeName === "SELECT"
      ) {
        if (!validateField(field)) {
          isValid = false;
        }
      }
    });

    if (!validateGender()) {
      isValid = false;
    }

    if (isValid) {
      // ✅ Collect Data
      const selectedGender = [...fields.gender].find((r) => r.checked)?.value;
      const formData = {
        name: fields.name.value.trim(),
        age: fields.age.value.trim(),
        gender: selectedGender,
        email: fields.email.value.trim(),
        course: fields.course.value,
        resume: fields.resume.files[0]?.name || "Not uploaded",
        phone: fields.phone.value.trim(),
        address: fields.address.value.trim(),
        linkedin: fields.linkedin.value.trim(),
        github: fields.github.value.trim(),
      };

      // ✅ Save to localStorage
      localStorage.setItem("formData", JSON.stringify(formData));

      // ✅ Redirect to Thank You Page
      window.location.href = "thankyou.html";
    }
  }

  form.addEventListener("submit", validateForm);

  Object.values(fields).forEach((field) => {
    if (
      field.nodeName === "INPUT" ||
      field.nodeName === "TEXTAREA" ||
      field.nodeName === "SELECT"
    ) {
      field.addEventListener("input", () => validateField(field));
    }
  });

  fields.gender.forEach((radio) => {
    radio.addEventListener("change", validateGender);
  });
});
