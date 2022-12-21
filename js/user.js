"use strict";

// global to hold the User instance of the currently-logged-in user
let currentUser;

/******************************************************************************
 * User login/signup/login
 */

/** Handle login form submission. If login ok, sets up the user instance */

async function login(evt) {
  console.debug("login", evt);
  evt.preventDefault();
  $messageId.html("");

  // grab the username and password
  const username = $("#login-username").val();
  const password = $("#login-password").val();

  // User.login retrieves user info from API and returns User instance
  // which we'll make the globally-available, logged-in user.

  try {
    currentUser = await User.login(username, password);
  } catch (err) {
    if (!(currentUser instanceof User)) {
      $messageId.html("Credential information is incorrect or this account does not exist!");
      return;
    }
  }

  $loginForm.trigger("reset");

  saveUserCredentialsInLocalStorage();
  updateUIOnUserLogin();

}

$loginForm.on("submit", login);

/** Handle signup form submission. */

async function signup(evt) {
  console.debug("signup", evt);
  evt.preventDefault();
  $messageId.html("");

  const name = $("#signup-name").val();
  const username = $("#signup-username").val();
  const password = $("#signup-password").val();

  // User.signup retrieves user info from API and returns User instance
  // which we'll make the globally-available, logged-in user.

  try {
    currentUser = await User.signup(username, password, name);
  } catch (err) {
    if (!(currentUser instanceof User)) {
      $messageId.html("This Username already exists. Please change it!");
      return;
    }
  }

  saveUserCredentialsInLocalStorage();
  updateUIOnUserLogin();

  $signupForm.trigger("reset");
}

$signupForm.on("submit", signup);

async function updateUserName(e) {
  console.debug("updateUserName", e);
  e.preventDefault();

  const name = $userNameTxt.val();
  $profileName.text(name);
  await currentUser.updateUserName(name);
  $usernameForm.slideUp("slow");
  $usernameForm.trigger('reset');

}
$usernameForm.on("submit", updateUserName);

async function changePassword(e) {
  console.debug("checkPassword", e);
  e.preventDefault();
  $messageId.html("");
  let isValid;

  try {
    isValid = await User.login(currentUser.username, $currentLoginPassword.val());
  } catch (err) {
    if (!(isValid instanceof User)) {
      $messageId.html("The current password is incorrect. Please check it!");
      return;
    }
  }
  await currentUser.updateUserPassword($newLoginPassword.val());
  $passwordForm.slideUp("slow");
  $passwordForm.trigger('reset');

}
$passwordForm.on("submit", changePassword);

async function deleteUserClick(e) {
  if (confirm("Are you sure you want to delete this user?")) {
    await currentUser.deleteUser();
    localStorage.clear();
    location.reload();
  }
}
$deleteUser.on("click", deleteUserClick);



function togglePasswordLogin() {
  const $password = $("#login-password");
  const type = $password.attr("type") === "password" ? "text" : "password";
  $password.attr("type", type);
  // toggle the icon
  $togglePasswordLogin.toggleClass("fa-eye-slash fa-eye");
}
$togglePasswordLogin.on("click", togglePasswordLogin);

function togglePasswordSignup() {
  const $password = $("#signup-password");
  const type = $password.attr("type") === "password" ? "text" : "password";
  $password.attr("type", type);
  // toggle the icon
  $togglePasswordSignup.toggleClass("fa-eye-slash fa-eye");
}
$togglePasswordSignup.on("click", togglePasswordSignup);


function toggleCurrentPassword() {

  const type = $currentLoginPassword.attr("type") === "password" ? "text" : "password";
  $currentLoginPassword.attr("type", type);
  // toggle the icon
  $toggleCurrentPassword.toggleClass("fa-eye-slash fa-eye");
}
$toggleCurrentPassword.on("click", toggleCurrentPassword);

function toggleNewPassword() {

  const type = $newLoginPassword.attr("type") === "password" ? "text" : "password";
  $newLoginPassword.attr("type", type);
  // toggle the icon
  $toggleNewPassword.toggleClass("fa-eye-slash fa-eye");
}
$toggleNewPassword.on("click", toggleNewPassword);




/** Handle click of logout button
 *
 * Remove their credentials from localStorage and refresh page
 */

function logout(evt) {
  console.debug("logout", evt);
  localStorage.clear();
  location.reload();
}

$navLogOut.on("click", logout);

/******************************************************************************
 * Storing/recalling previously-logged-in-user with localStorage
 */

/** If there are user credentials in local storage, use those to log in
 * that user. This is meant to be called on page load, just once.
 */

async function checkForRememberedUser() {
  console.debug("checkForRememberedUser");
  const token = localStorage.getItem("token");
  const username = localStorage.getItem("username");
  if (!token || !username) return false;

  // try to log in with these credentials (will be null if login failed)
  currentUser = await User.loginViaStoredCredentials(token, username);
}

/** Sync current user information to localStorage.
 *
 * We store the username/token in localStorage so when the page is refreshed
 * (or the user revisits the site later), they will still be logged in.
 */

function saveUserCredentialsInLocalStorage() {
  console.debug("saveUserCredentialsInLocalStorage");
  if (currentUser) {
    localStorage.setItem("token", currentUser.loginToken);
    localStorage.setItem("username", currentUser.username);
  }
}

/******************************************************************************
 * General UI stuff about users
 */

/** When a user signs up or registers, we want to set up the UI for them:
 *
 * - show the stories list
 * - update nav bar options for logged-in user
 * - generate the user profile part of the page
 */

function updateUIOnUserLogin() {
  console.debug("updateUIOnUserLogin");
  hidePageComponents();
  getAndShowStoriesOnStart();
  $allStoriesList.show();

  updateNavOnLogin();
}
