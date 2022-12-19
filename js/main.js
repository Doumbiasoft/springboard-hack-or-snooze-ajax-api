"use strict";

// So we don't have to keep re-finding things on page, find DOM elements once:

const $body = $("body");

const $storiesLoadingMsg = $("#stories-loading-msg");
const $allStoriesList = $("#all-stories-list");
const $userStoriesList = $("#user-stories-list");
const $userFavoritesStoriesList = $("#user-favorites-stories-list");


const $loginForm = $("#login-form");
const $signupForm = $("#signup-form");
const $storySubmitForm = $("#story-submit-form");
const $editStorySubmitForm = $("#edit-story-submit-form");
const $btnSubmitEditForm = $("#btnSubmitEditForm");

const $usernameForm = $("#username-form");
const $passwordForm = $("#password-form");



const $navHome = $("#nav-all");
const $navLogin = $("#nav-login");
const $navUserProfile = $("#nav-user-profile");
const $sectionUserProfile = $("#user-profile");

const $navLogOut = $("#nav-logout");
const $navSubmit = $("#nav-submit");
const $navUserStory = $("#nav-user-story");
const $navUserFavorites = $("#nav-user-favorites");

const $editUsernane = $("#edit-usernane");
const $editPassword = $("#edit-password");




const $mainNav = $(".main-nav");

const $spanHackOrSnooze = $("#spanHackOrSnooze");
const $spanSubmit = $("#spanSubmit");
const $spanFavorite = $("#spanFavorite");
const $spanMystories = $("#spanMystories");





/** To make it easier for individual components to show just themselves, this
 * is a useful function that hides pretty much everything on the page. After
 * calling this, individual components can re-show just what they want.
 */

function hidePageComponents() {
  const components = [
    $allStoriesList,
    $userStoriesList,
    $userFavoritesStoriesList,
    $loginForm,
    $signupForm,
    $storySubmitForm,
    $editStorySubmitForm,
    $sectionUserProfile,
    $usernameForm,
    $passwordForm,

  ];
  components.forEach(c => c.hide());
}

/** Overall function to kick off the app. */

async function start() {
  console.debug("start");
  mobileMenuIcon();
  // "Remember logged-in user" and log in, if credentials in localStorage
  await checkForRememberedUser();
  await getAndShowStoriesOnStart();
  $('a').removeClass('active');
  $navHome.addClass("active");
  // if we got a logged-in user
  if (currentUser) updateUIOnUserLogin();
}

// Once the DOM is entirely loaded, begin the app

console.warn("HEY STUDENT: This program sends many debug messages to" +
  " the console. If you don't see the message 'start' below this, you're not" +
  " seeing those helpful debug messages. In your browser console, click on" +
  " menu 'Default Levels' and add Verbose");
$(start);


function mobileMenuIcon() {
  CheckscreenMode();
  $(window).resize(function () {
    CheckscreenMode();
  });
}
function CheckscreenMode() {
  if (window.matchMedia("(max-width: 767px)").matches) {
    // The viewport is less than 768 pixels wide Mobile

    $spanHackOrSnooze.html("");
    $spanSubmit.html("");
    $spanFavorite.html("");
    $spanMystories.html("");

  } else {
    // The viewport is at least 768 pixels wide web or tablet
    $spanHackOrSnooze.html("&nbsp;Hack or Snooze");
    $spanSubmit.html("&nbsp;Submit");
    $spanFavorite.html("&nbsp;Favorites");
    $spanMystories.html("&nbsp;My stories");
  }
}