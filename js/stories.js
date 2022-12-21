"use strict";

// This is the global list of the stories, an instance of StoryList
let storyList;
let iconFavorite;
let iconDelete;
let iconEdit;
let storyId;
let view;
let iconColor;
let ishidden;;
/** Get and show stories when site first loads. */

async function getAndShowStoriesOnStart() {
  storyList = await StoryList.getStories();
  $storiesLoadingMsg.remove();

  putStoriesOnPage();
}
/** Add new story form. */

async function addNewStory(evt) {
  console.debug("submitNewStory");
  evt.preventDefault();
  // get infos from story form
  const author = $("#story-author").val();
  const title = $("#story-title").val();
  const url = $("#story-url").val();

  const newStory = { author, title, url };
  const story = await storyList.addStory(currentUser, newStory);
  const $story = generateStoryMarkup(story);

  $allStoriesList.prepend($story);
  putStoriesOnPage();

  $storySubmitForm.slideUp("slow");
  $storySubmitForm.trigger('reset');
  $storySubmitForm.slideDown("slow");
}

$storySubmitForm.on("submit", addNewStory);



/**
 * A render method to render HTML for an individual Story instance
 * - story: an instance of Story
 *
 * Returns the markup for the story.
 */

function generateStoryMarkup(story) {
  // console.debug("generateStoryMarkup", story);
  if (story === null) return;

  if (currentUser !== undefined) {
    iconFavorite = currentUser.isFavorite(story) ? 'fas' : 'far';
    iconColor=currentUser.isFavorite(story) ? 'red' : 'gray';
    iconDelete = currentUser.ownStories.some((elt) => elt.storyId === story.storyId) ? '' : 'hidden';
    iconEdit = currentUser.ownStories.some((elt) => elt.storyId === story.storyId) ? '' : 'hidden';
    ishidden='';
  } else {
    iconFavorite = 'hidden';
    iconDelete = 'hidden';
    iconEdit = 'hidden';
    ishidden='hidden';
  }

  const hostName = story.getHostName();
  const postedDate = new Date(story.createdAt);

  return $(`
    <li style="line-height: 1.8;" id="${story.storyId}">
        <a href="${story.url}" target="a_blank" class="story-link" title="Go!">
          <span style="font-weight:bold;color:black;text-transform:uppercase;">${story.title}</span>
          <br><span style="font-weight:bold;text-transform:capitalize;color:gray">author&nbsp;:&nbsp;</span><span style=";text-transform:capitalize;color:goldenrod">${story.author}</span><br>
          <span style="color:gray;font-weight:bold;text-transform:capitalize;">Web site&nbsp;:</span><span style="color:gray">&nbsp;${hostName}</span>
        </a><br>
        <span style="text-transform:capitalize;"><small style="font-weight:bold">posted by</small>&nbsp;${story.username}</span><br>
        <small><span style="font-weight:bold;">${postedDate}</span></small><br>
        <div class="${ishidden}" style="margin:10px;font-size:19px">
        <i data-id="${story.storyId}" title="Favorite" class="favoriteIcon ${iconFavorite} fa-heart fa-1x iconGray" style="color:${iconColor};cursor:pointer;"></i>
        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<i data-id="${story.storyId}" class="editIcon ${iconEdit} far fa-edit fa-1x" title="Edit" style="color:gray;cursor:pointer;"></i>
        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<i data-id="${story.storyId}" class="deleteIcon ${iconDelete} far fa-trash-alt fa-1x" title="Remove" style="color:gray;cursor:pointer;"></i>
        </div>
        <hr  style="color:#f0f0f0;">
      </li>
    `);
}

/** Gets list of stories from server, generates their HTML, and puts on page. */

function putStoriesOnPage() {
  console.debug("putStoriesOnPage");

  $allStoriesList.empty();
  const $title = $(`<h4 style="color:goldenrod"><i class="fas fa-list-ul" style="color:#424141"></i>&nbsp;All stories</h4><br>`);
  $allStoriesList.prepend($title);
  // loop through all of our stories and generate HTML for them
  for (let story of storyList.stories) {
    const $story = generateStoryMarkup(story);
    $allStoriesList.append($story);
  }

  $allStoriesList.slideDown();
}
/**  Shows user's own stories list*/

function LoadUserStoriesOnPage() {
  console.debug("LoadUserStoriesOnPage");
  $userStoriesList.empty();
  const $title = $(`<h4 style="color:goldenrod"><i class="fas fa-list-ul" style="color:#424141"></i>&nbsp;User stories</h4><br>`);
  $userStoriesList.prepend($title);
  if (currentUser.ownStories.length === 0) {
    $userStoriesList.append("<h3>No stories added by the user!</h3>");
  } else {
    for (let s of currentUser.ownStories) {
      let $story = generateStoryMarkup(s);
      $userStoriesList.append($story);
    }
  }
  $userStoriesList.slideDown();
}
/**  Shows user's own favarites stories list*/

function LoadUserFavoritesStoriesOnPage() {
  console.debug("LoadUserFavoritesStoriesOnPage");
  $userFavoritesStoriesList.empty();
  const $title = $(`<h4 style="color:goldenrod"><i class="fas fa-list-ul" style="color:#424141"></i>&nbsp;Favorite stories</h4><br>`);
  $userFavoritesStoriesList.prepend($title);

  if (currentUser.favorites.length === 0) {
    $userFavoritesStoriesList.append("<h3>No favorite stories added!</h3>");
  } else {
    for (let s of currentUser.favorites) {
      let $story = generateStoryMarkup(s);
      $userFavoritesStoriesList.append($story);
    }
  }
  $userFavoritesStoriesList.slideDown();
}


/** Add and Remove favorite */

async function addOrRemoveFavorite(e) {

  const $target = $(e.target);
  const storyId = $target.closest("i").attr("data-id");
  const story = storyList.stories.find(s => s.storyId === storyId);

  if ($target.hasClass("fas")) {
    await currentUser.removeToFavorite(story);
    $target.closest("i").toggleClass("fas far");
    
  } else {
    await currentUser.addToFavorite(story);
    $target.closest("i").toggleClass("fas far");
  }
}


$allStoriesList.on("click", ".favoriteIcon", addOrRemoveFavorite);
$allStoriesList.on("click", ".favoriteIcon", putStoriesOnPage);

$userFavoritesStoriesList.on("click", ".favoriteIcon", addOrRemoveFavorite);
$userFavoritesStoriesList.on("click", ".favoriteIcon", LoadUserFavoritesStoriesOnPage);

$userStoriesList.on("click", ".favoriteIcon", addOrRemoveFavorite);
$userStoriesList.on("click", ".favoriteIcon", LoadUserStoriesOnPage);

/** delete Story */

async function deleteStory(e) {
  const $target = $(e.target);
  const storyId = $target.closest("i").attr("data-id");

  if (confirm("Are you sure you want to delete this story?")) {
    await storyList.removeStory(currentUser, storyId);
  }
}

$allStoriesList.on("click", ".deleteIcon", deleteStory);
$allStoriesList.on("click", ".deleteIcon", putStoriesOnPage);

$userFavoritesStoriesList.on("click", ".deleteIcon", deleteStory);
$userFavoritesStoriesList.on("click", ".deleteIcon", LoadUserFavoritesStoriesOnPage);

$userStoriesList.on("click", ".deleteIcon", deleteStory);
$userStoriesList.on("click", ".deleteIcon", LoadUserStoriesOnPage);

/** update Story */

function editStory(e) {
  console.debug("editStory", e);

  const $target = $(e.target);
  const stId = $target.closest("i").attr("data-id");
  const story = storyList.stories.find((s) => s.storyId === stId);
  storyId = stId;
  $("#edit-story-author").val(story.author);
  $("#edit-story-title").val(story.title);
  $("#edit-story-url").val(story.url);
  hidePageComponents();
  $editStorySubmitForm.slideDown();

}
function setViewAll() {
  $btnSubmitEditForm.attr("data-view", "All");
}
function setViewFav() {
  $btnSubmitEditForm.attr("data-view", "Fav");
}
function setViewOwn() {
  $btnSubmitEditForm.attr("data-view", "Own");
}

$allStoriesList.on("click", ".editIcon", editStory);
$allStoriesList.on("click", ".editIcon", setViewAll);

$userFavoritesStoriesList.on("click", ".editIcon", editStory);
$userFavoritesStoriesList.on("click", ".editIcon", setViewFav);

$userStoriesList.on("click", ".editIcon", editStory);
$userStoriesList.on("click", ".editIcon", setViewOwn);


async function updateAstory(e) {
  e.preventDefault();
  console.debug("updateAstory", e);

  // get infos from story form
  const author = $("#edit-story-author").val();
  const title = $("#edit-story-title").val();
  const url = $("#edit-story-url").val();
  const story = { storyId, author, title, url };
  await storyList.updateStory(currentUser, story);
  $editStorySubmitForm.slideUp();

  view = $btnSubmitEditForm.attr("data-view");
  
  switch (view) {
    case "All":
      putStoriesOnPage();
      break;
    case "Fav":
      LoadUserFavoritesStoriesOnPage();
      break;
    case "Own":
      LoadUserStoriesOnPage();
      break;
  }

}
$editStorySubmitForm.on("submit", updateAstory);



