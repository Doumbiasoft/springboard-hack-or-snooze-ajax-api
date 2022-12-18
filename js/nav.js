"use strict";

/******************************************************************************
 * Handling navbar clicks and updating navbar
 */

/** Show main list of all stories when click site name */

function navAllStories(evt) {
  console.debug("navAllStories", evt);
  hidePageComponents();
  putStoriesOnPage();
  $storySubmitForm.trigger('reset');
  $('a').removeClass('active');
  $navHome.addClass("active");
}

$body.on("click", "#nav-all", navAllStories);

/** Show login/signup on click on "login" */

function navLoginClick(evt) {
  console.debug("navLoginClick", evt);
  hidePageComponents();
  $storySubmitForm.trigger('reset');
  $loginForm.slideDown("slow");
  $signupForm.slideDown("slow");
  
}

$navLogin.on("click", navLoginClick);

/** Show story submit form on click on "Submit" */

function navSubmitClick(e) {
  console.debug("navSubmitClick", e);
  hidePageComponents();

  /** */
  $storySubmitForm.trigger('reset');
  //$allStoriesList.show();
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
  $navUserProfile.append(`<i class="fas fa-user-circle fa-1x" style="color:white;font-size:17"></i>&nbsp;${currentUser.username}`);
  //$navUserProfile.html(`<i class="fas fa-user-circle"></i>&nbsp;${currentUser.username}`).show();
}