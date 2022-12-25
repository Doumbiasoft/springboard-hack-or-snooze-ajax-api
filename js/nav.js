"use strict";

/******************************************************************************
 * Handling navbar clicks and updating navbar
 */

/** Show main list of all stories when click site name */

async function navAllStories(evt) {
  console.debug("navAllStories", evt);
  hidePageComponents();
  //putStoriesOnPage();
  await getAndShowStoriesOnStart();
  $storySubmitForm.trigger('reset');
  $('a').removeClass('active');
  $navHome.addClass("active");
}

$body.on("click", "#nav-all", navAllStories);

/** Show login/signup on click on "login" */

function navLoginClick(evt) {
  console.debug("navLoginClick", evt);
  hidePageComponents();
  $messageId.html("");
  $storySubmitForm.trigger('reset');
  $loginForm.trigger("reset");
  $signupForm.trigger("reset");

  $loginForm.slideDown("slow");
  $signupForm.slideUp("slow");

}

$navLogin.on("click", navLoginClick);


function linkLogin(e) {
  console.debug("navLoginClick", e);
  hidePageComponents();
  $messageId.html("");
  $loginForm.trigger("reset");
  $signupForm.trigger("reset");

  $loginForm.slideDown("slow");
  $signupForm.slideUp("slow");

}
$loginLink.on("click", linkLogin);

function linkSignup(e) {
  console.debug("navLoginClick", e);
  hidePageComponents();
  $messageId.html("");
  $loginForm.trigger("reset");
  $signupForm.trigger("reset");

  $loginForm.slideUp("slow");
  $signupForm.slideDown("slow");

}
$signupLink.on("click", linkSignup);


function navUserProfileClick(evt) {
  console.debug("navLoginClick", evt);
  hidePageComponents();

  $profileName.html(currentUser.name);
  $profileUsername.html(currentUser.username);
  $profileAccountDate.html(new Date(currentUser.createdAt));

  $sectionUserProfile.slideDown("slow");
  $('a').removeClass('active');
  $navUserProfile.addClass("active");
}

$navUserProfile.on("click", navUserProfileClick);

function editUserNameClick(e) {

  $userNameTxt.val(currentUser.name);
  $usernameForm.slideDown("slow");
  $passwordForm.slideUp("slow");
}
$editUsernane.on("click", editUserNameClick);

function editUserPasswordClick(e) {
  $usernameForm.slideUp("slow");
  $passwordForm.slideDown("slow");
}
$editPassword.on("click", editUserPasswordClick);





/** Show story submit form on click on "Submit" */

function navSubmitClick(e) {
  console.debug("navSubmitClick", e);
  hidePageComponents();

  /** */
  $storySubmitForm.trigger('reset');

  putStoriesOnPage();
  $storySubmitForm.slideDown("slow");
  $('a').removeClass('active');
  $navSubmit.addClass("active");


}

$navSubmit.on("click", navSubmitClick);

/** Show user story list" */

function navUserStoryClick(e) {
  console.debug("navUserStoryClick", e);
  hidePageComponents();
  $storySubmitForm.trigger('reset');
  $loginForm.hide();
  $signupForm.hide();
  $storySubmitForm.hide();
  LoadUserStoriesOnPage();
  $('a').removeClass('active');
  $navUserStory.addClass("active");
}

$navUserStory.on("click", navUserStoryClick);

/** Show user favarites story list" */

function navUserFavoritesClick(e) {
  console.debug("navUserFavoritesClick", e);
  hidePageComponents();
  $storySubmitForm.trigger('reset');
  $loginForm.hide();
  $signupForm.hide();
  $storySubmitForm.hide();
  LoadUserFavoritesStoriesOnPage();
  $('a').removeClass('active');
  $navUserFavorites.addClass("active");

}

$navUserFavorites.on("click", navUserFavoritesClick);



/** When a user first logins in, update the navbar to reflect that. */

function updateNavOnLogin() {
  console.debug("updateNavOnLogin");
  $(".main-nav-links").show();
  $navLogin.hide();
  $navLogOut.show();
  $mainNav.show();
  $navUserProfile.show();
  $navUserProfile.append(`<i class="fas fa-user-circle fa-1x" style="color:white;"></i>&nbsp;${currentUser.username}`);
}