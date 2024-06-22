// YOUR JAVASCRIPT CODE FOR INDEX.HTML GOES HERE
const signOutBtn = document.querySelector(".signout");
const auth = catalyst.auth;
const redirectURL =
  "https://virtualbartender-842672486.development.catalystserverless.com/__catalyst/auth/login";
signOutBtn.addEventListener("click", () => {
  console.log("Signing out");
  auth.signOut(redirectURL);
});
