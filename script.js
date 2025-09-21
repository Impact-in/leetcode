// Firebase imports
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import {
  getFirestore,
  collection,
  addDoc,
  query,
  where,
  getDocs,
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

// Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyCrEKzh6J4MPAUm9zvKyAjrgHsiNdttH2E",
  authDomain: "impact-entry.firebaseapp.com",
  databaseURL: "https://impact-entry-default-rtdb.firebaseio.com",
  projectId: "impact-entry",
  storageBucket: "impact-entry.firebasestorage.app",
  messagingSenderId: "938239455191",
  appId: "1:938239455191:web:b2c261e610dd8960f4e592",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Helpers
function setBorderColor(id, valid) {
  const input = $(`#${id}`);
  if (valid) {
    input.removeClass("border-red-500").addClass("border-green-500");
  } else {
    input.removeClass("border-green-500").addClass("border-red-500");
  }
}

function validateForm() {
  let valid = true;
  const fullName = $("#fullName").val().trim();
  const phone = $("#phoneNumber").val().trim();
  const email = $("#email").val().trim();
  const url = $("#leetcodeUrl").val().trim();

  // Full Name
  if (!/^[A-Za-z\s]+$/.test(fullName)) {
    $("#fullNameError")
      .text("Enter a valid name (letters & spaces only)")
      .removeClass("hidden");
    setBorderColor("fullName", false);
    valid = false;
  } else {
    $("#fullNameError").addClass("hidden");
    setBorderColor("fullName", true);
  }

  // Phone
  if (!/^\d{10}$/.test(phone)) {
    $("#phoneError")
      .text("Enter a valid 10-digit phone number")
      .removeClass("hidden");
    setBorderColor("phoneNumber", false);
    valid = false;
  } else {
    $("#phoneError").addClass("hidden");
    setBorderColor("phoneNumber", true);
  }

  // Email
  if (!/^\S+@\S+\.\S+$/.test(email)) {
    $("#emailError").text("Enter a valid email address").removeClass("hidden");
    setBorderColor("email", false);
    valid = false;
  } else {
    $("#emailError").addClass("hidden");
    setBorderColor("email", true);
  }

  // LeetCode URL
  if (!/^https:\/\/leetcode\.com\/u\/[A-Za-z0-9-_]+\/?$/.test(url)) {
    $("#urlError").text("Enter a valid LeetCode URL").removeClass("hidden");
    setBorderColor("leetcodeUrl", false);
    valid = false;
  } else {
    $("#urlError").addClass("hidden");
    setBorderColor("leetcodeUrl", true);
  }

  return valid;
}

// Handle form submit
$("#registrationForm").on("submit", async function (e) {
  e.preventDefault();
  if (!validateForm()) return;

  const submitBtn = $("#submitBtn");
  const btnText = $("#btnText");
  const btnLoader = $("#btnLoader");

  // Disable button + show loader
  submitBtn.prop("disabled", true).addClass("opacity-70 cursor-not-allowed");
  btnText.text("Submitting...");
  btnLoader.removeClass("hidden");

  const data = {
    fullName: $("#fullName").val().trim(),
    phoneNumber: $("#phoneNumber").val().trim(),
    email: $("#email").val().trim(),
    department: $("#department").val(),
    leetcodeUrl: $("#leetcodeUrl").val().trim(),
    timestamp: new Date(),
  };

  try {
    const regRef = collection(db, "registrations");

    // Check duplicates
    const [emailSnap, urlSnap] = await Promise.all([
      getDocs(query(regRef, where("email", "==", data.email))),
      getDocs(query(regRef, where("leetcodeUrl", "==", data.leetcodeUrl))),
    ]);

    if (!emailSnap.empty || !urlSnap.empty) {
      if (!emailSnap.empty) {
        $("#emailError")
          .text("This email is already registered.")
          .removeClass("hidden");
        setBorderColor("email", false);
      }
      if (!urlSnap.empty) {
        $("#urlError")
          .text("This LeetCode profile is already registered.")
          .removeClass("hidden");
        setBorderColor("leetcodeUrl", false);
      }
    } else {
      await addDoc(regRef, data);

      // Reset form
      this.reset();
      $(".border").removeClass("border-red-500 border-green-500");
      $(".text-red-500").addClass("hidden");

      // Show success modal
      $("#successModal").removeClass("hidden");
    }
  } catch (err) {
    alert("❌ Something went wrong. Please try again.");
    console.error(err);
  } finally {
    // Enable button
    submitBtn
      .prop("disabled", false)
      .removeClass("opacity-70 cursor-not-allowed");
    btnText.text("Submit");
    btnLoader.addClass("hidden");
  }
});

// Live validation
$("#fullName, #phoneNumber, #email, #leetcodeUrl").on("input", validateForm);
