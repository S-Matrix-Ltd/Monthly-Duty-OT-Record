// ==========================================
// Module: auth.js
// Description: Firebase Authentication & User Profile Management
// ==========================================

import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged 
} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";

import { 
  doc, 
  setDoc, 
  getDoc 
} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

// Global variables to hold authentication state and current user profile
window.currentUser = null;
window.userProfile = null;

/**
 * Save or update User Profile data in Firestore
 * Collection: "users" -> Document ID: user.uid
 */
async function saveUserProfile(user, profileData) {
  if (!user || !user.uid) return;
  const userDocRef = doc(window.firebaseDB, "users", user.uid);
  const dataToSave = {
    company: profileData.company || "",
    name: profileData.name || "",
    empId: profileData.empId || "",
    email: user.email,
    updatedAt: new Date().toISOString()
  };

  await setDoc(userDocRef, dataToSave, { merge: true });
  window.userProfile = dataToSave;
}

/**
 * Fetch User Profile data from Firestore
 */
async function fetchUserProfile(uid) {
  if (!uid) return null;
  const userDocRef = doc(window.firebaseDB, "users", uid);
  const docSnap = await getDoc(userDocRef);
  if (docSnap.exists()) {
    return docSnap.data();
  }
  return null;
}

/**
 * Main function to handle Auth Form submission (Login / Register)
 */
export async function handleAuthSubmit() {
  const authError = document.getElementById("authError");
  const authSubmitBtn = document.getElementById("authSubmitBtn");
  
  if (authError) authError.textContent = "";

  const email = document.getElementById("authEmail")?.value.trim();
  const pass = document.getElementById("authPass")?.value;
  
  const account = getAccount(); // Check local state/existing user mode

  try {
    if (authSubmitBtn) authSubmitBtn.disabled = true;

    if (account) {
      // ---------------- LOGIN MODE ----------------
      if (!email || !pass) {
        if (authError) authError.textContent = "ইমেইল ও পাসওয়ার্ড প্রদান করুন।";
        if (authSubmitBtn) authSubmitBtn.disabled = false;
        return;
      }

      const userCredential = await signInWithEmailAndPassword(window.firebaseAuth, email, pass);
      window.currentUser = userCredential.user;

      // Fetch user profile from Firestore
      const profile = await fetchUserProfile(window.currentUser.uid);
      if (profile) {
        window.userProfile = profile;
      }

      localStorage.setItem("ot-auth-session-v1", "1");
      if (typeof showApp === "function") showApp();

    } else {
      // ---------------- REGISTER / SETUP MODE ----------------
      const company = document.getElementById("authCompany")?.value.trim() || "";
      const name = document.getElementById("authName")?.value.trim() || "";
      const empId = document.getElementById("authEmpId")?.value.trim() || "";
      const confirmPass = document.getElementById("authPassConfirm")?.value;

      if (!company || !name || !empId || !email || !pass) {
        if (authError) authError.textContent = "সকল প্রয়োজনীয় ঘর সঠিক তথ্য দিয়ে পূরণ করুন।";
        if (authSubmitBtn) authSubmitBtn.disabled = false;
        return;
      }

      if (pass !== confirmPass) {
        if (authError) authError.textContent = "পাসওয়ার্ড দুটি মিলছে না।";
        if (authSubmitBtn) authSubmitBtn.disabled = false;
        return;
      }

      if (pass.length < 6) {
        if (authError) authError.textContent = "পাসওয়ার্ড অন্তত ৬ অক্ষরের হতে হবে।";
        if (authSubmitBtn) authSubmitBtn.disabled = false;
        return;
      }

      // Create Firebase Auth user
      const userCredential = await createUserWithEmailAndPassword(window.firebaseAuth, email, pass);
      window.currentUser = userCredential.user;

      // Save User Profile to Firestore
      const profileData = { company, name, empId, email };
      await saveUserProfile(window.currentUser, profileData);

      // Save local session state
      localStorage.setItem("ot-auth-account-v1", JSON.stringify({
        user: email,
        name: name,
        company: company,
        empId: empId
      }));
      localStorage.setItem("ot-auth-session-v1", "1");

      if (typeof showApp === "function") showApp();
    }
  } catch (error) {
    console.error("Auth Error:", error);
    let errorMsg = "অপ্রত্যাশিত একটি সমস্যা ঘটেছে।";
    if (error.code === "auth/invalid-email") errorMsg = "ইমেইল অ্যাড্রেস সঠিক নয়।";
    else if (error.code === "auth/user-not-found" || error.code === "auth/wrong-password" || error.code === "auth/invalid-credential") errorMsg = "ভুল ইমেইল বা পাসওয়ার্ড।";
    else if (error.code === "auth/email-already-in-use") errorMsg = "এই ইমেইল দিয়ে ইতোমধ্যে অ্যাকাউন্ট রয়েছে।";
    else if (error.code === "auth/weak-password") errorMsg = "পাসওয়ার্ড অত্যন্ত দুর্বল। অন্তত ৬ অক্ষর দিন।";

    if (authError) authError.textContent = errorMsg;
  } finally {
    if (authSubmitBtn) authSubmitBtn.disabled = false;
  }
}

/**
 * Handle Logout
 */
export async function handleLogout() {
  try {
    await signOut(window.firebaseAuth);
    window.currentUser = null;
    window.userProfile = null;
    localStorage.removeItem("ot-auth-session-v1");
    if (typeof showAuthScreen === "function") showAuthScreen();
  } catch (error) {
    console.error("Logout Error:", error);
  }
}

/**
 * Listen to Authentication State Changes
 */
export function initAuthListener() {
  onAuthStateChanged(window.firebaseAuth, async (user) => {
    if (user) {
      window.currentUser = user;
      const profile = await fetchUserProfile(user.uid);
      if (profile) {
        window.userProfile = profile;
      }
    } else {
      window.currentUser = null;
      window.userProfile = null;
    }
  });
}

// Make critical functions accessible globally for HTML event handling
window.handleAuthSubmit = handleAuthSubmit;
window.handleLogout = handleLogout;
