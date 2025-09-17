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

$(document).ready(function () {
  const form = $("#registrationForm");
  const successMsg = $("#successMsg");

  function setBorderColor(inputId, isValid) {
    const input = $(`#${inputId}`);
    if (isValid) {
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
    if (fullName === "") {
      $("#fullNameError").removeClass("hidden");
			$("#fullNameError").text("Full Name is required.");
      setBorderColor("fullName", false);
      valid = false;
    } else if (!/^[A-Za-z\s]+$/.test(fullName)) {
			$("#fullNameError").text("Full name can only contain letters and spaces.").removeClass("hidden");
			setBorderColor("fullName", false);
			valid = false;
		} else {
      $("#fullNameError").addClass("hidden");
      setBorderColor("fullName", true);
    }

    // Phone Number
    if (phone === ""){
			$("#phoneError").removeClass("hidden");
			$("#phoneError").text("Phone Number is required.");
			setBorderColor("phoneNumber", false);
			valid = false;
		} else if (!/^\d{10}$/.test(phone)) {
      $("#phoneError").removeClass("hidden");
			$("#phoneError").text("Enter a valid phone number (10 digits).");
      setBorderColor("phoneNumber", false);
      valid = false;
    } else {
      $("#phoneError").addClass("hidden");
      setBorderColor("phoneNumber", true);
    }

    // Email
    if (email === ""){
			$("#emailError").removeClass("hidden");
			$("#emailError").text("Email is required.");
			setBorderColor("email", false);
			valid = false;
		} else if (!/^\S+@\S+\.\S+$/.test(email)) {
      $("#emailError").removeClass("hidden");
			$("#emailError").text("Enter a valid email address.");
      setBorderColor("email", false);
      valid = false;
    } else {
      $("#emailError").addClass("hidden");
      setBorderColor("email", true);
    }

    // LeetCode URL
    if (url === ""){
			$("#urlError").removeClass("hidden");
			$("#urlError").text("LeetCode URL is required.");
			setBorderColor("leetcodeUrl", false);
			valid = false;
		}else if (!/^https:\/\/leetcode\.com\/u\/[A-Za-z0-9-_]+\/?$/.test(url)) {
      $("#urlError").removeClass("hidden");
			$("#urlError").text("Enter a valid LeetCode URL.");
      setBorderColor("leetcodeUrl", false);
      valid = false;
    } else {
      $("#urlError").addClass("hidden");
      setBorderColor("leetcodeUrl", true);
    }

    return valid;
  }

  form.on("submit", async function (e) {
    e.preventDefault();

    if (!validateForm()) return;

    const fullName = $("#fullName").val().trim();
    const phoneNumber = $("#phoneNumber").val().trim();
    const email = $("#email").val().trim();
    const department = $("#department").val();
    const leetcodeUrl = $("#leetcodeUrl").val().trim();

    try {
      // Check if email or LeetCode URL already exists
      const regRef = collection(db, "registrations");

      const emailQuery = query(regRef, where("email", "==", email));
      const urlQuery = query(regRef, where("leetcodeUrl", "==", leetcodeUrl));

      const [emailSnap, urlSnap] = await Promise.all([
        getDocs(emailQuery),
        getDocs(urlQuery),
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
        return;
		}

      // Proceed to register
      await addDoc(regRef, {
        fullName,
        phoneNumber,
        email,
        department,
        leetcodeUrl,
        timestamp: new Date(),
      });

      form[0].reset();
      $(".border").removeClass("border-red-500 border-green-500");
      $(".text-red-500").addClass("hidden");
const toast = document.getElementById("toast");
toast.classList.remove("hidden");
setTimeout(() => {
  toast.classList.add("hidden");
}, 3000);
      successMsg.removeClass("hidden");
      setTimeout(() => successMsg.addClass("hidden"), 4000);

    } catch (err) {
      alert("Something went wrong while saving to Firebase.");
      console.error(err);
    }
  });


  $("#fullName, #phoneNumber, #email, #leetcodeUrl").on("input", function () {
    validateForm();
  });
});
