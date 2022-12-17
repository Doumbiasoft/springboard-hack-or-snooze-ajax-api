"use strict";

// This is the global list of the stories, an instance of StoryList
let storyList;
let iconFavorite;
let iconDelete;
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

  $storySubmitForm.slideUp("slow");
  $storySubmitForm.trigger('reset');
  $storySubmitForm.slideDown("slow");
}

$storySubmitForm.on("submit", addNewStory);

/**  Shows user's own stories list*/

function LoadUserStoriesOnPage() {
  $userStoriesList.empty();
  const $title = $(`<h4 style="color:goldenrod"><i class="fas fa-list-ul" style="color:#424141"></i>&nbsp;User stories</h4><br>`);
  $userStoriesList.append($title);
  if (currentUser.ownStories.length === 0) {
    $userStoriesList.append("<h3>No stories added by the user!</h3>");
  } else {
    for (let s of currentUser.ownStories) {
      let $story = generateStoryMarkup(s);
      $userStoriesList.append($story);
    }
  }
  $userStoriesList.show();
}
/**  Shows user's own favarites stories list*/

function LoadUserFavoritesStoriesOnPage() {
  $userFavoritesStoriesList.empty();
  const $title = $(`<h4 style="color:goldenrod"><i class="fas fa-list-ul" style="color:#424141"></i>&nbsp;Favorite stories</h4><br>`);
  $userFavoritesStoriesList.append($title);

  if (currentUser.favorites.length === 0) {
    $userFavoritesStoriesList.append("<h3>No favorite stories added!</h3>");
  } else {
    for (let s of currentUser.favorites) {
      let $story = generateStoryMarkup(s);
      $userFavoritesStoriesList.append($story);
    }
  }
  $userFavoritesStoriesList.show();
}


/**
 * A render method to render HTML for an individual Story instance
 * - story: an instance of Story
 *
 * Returns the markup for the story.
 */

function generateStoryMarkup(story) {
  // console.debug("generateStoryMarkup", story);
  if (currentUser !== undefined) {
    iconFavorite = currentUser.isFavorite(story) ? 'fas' : 'far';
    iconDelete = currentUser.ownStories.some((elt) => elt.storyId === story.storyId) ? '' : 'hidden';
  } else {
    iconFavorite = 'hidden';
    iconDelete = 'hidden';
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
        <div style="margin:10px;font-size:16px">
        <i data-id="${story.storyId}" title="Favorite" class="favoriteIcon ${iconFavorite} fa-heart fa-1x" style="color:red;cursor:pointer;"></i>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<i data-id="${story.storyId}" class="DeleteIcon ${iconDelete} far fa-trash-alt fa-1x" title="Remove" style="color:gray;cursor:pointer;"></i>
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
  $allStoriesList.append($title);
  // loop through all of our stories and generate HTML for them
  for (let story of storyList.stories) {
    const $story = generateStoryMarkup(story);
    $allStoriesList.append($story);
  }

  $allStoriesList.show();
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


