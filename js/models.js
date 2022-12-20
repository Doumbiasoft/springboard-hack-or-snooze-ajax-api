"use strict";


const BASE_URL = "https://hack-or-snooze-v3.herokuapp.com";

/******************************************************************************
 * Story: a single story in the system
 */

class Story {

  /** Make instance of Story from data object about story:
   *   - {title, author, url, username, storyId, createdAt}
   */

  constructor({ storyId, title, author, url, username, createdAt }) {
    this.storyId = storyId;
    this.title = title;
    this.author = author;
    this.url = url;
    this.username = username;
    this.createdAt = createdAt;
  }

  /** Parses hostname out of URL and returns it. */

  getHostName() {
    // UNIMPLEMENTED: complete this function!
    //return "hostname.com";
    return new URL(this.url).hostname;
  }
}


/******************************************************************************
 * List of Story instances: used by UI to show story lists in DOM.
 */

class StoryList {
  constructor(stories) {
    this.stories = stories;
  }

  /** Generate a new StoryList. It:
   *
   *  - calls the API
   *  - builds an array of Story instances
   *  - makes a single StoryList instance out of that
   *  - returns the StoryList instance.
   */

  static async getStories() {
    // Note presence of `static` keyword: this indicates that getStories is
    //  **not** an instance method. Rather, it is a method that is called on the
    //  class directly. Why doesn't it make sense for getStories to be an
    //  instance method?

    // query the /stories endpoint (no auth required)
    const response = await axios({
      url: `${BASE_URL}/stories`,
      method: "GET",
    });

    // turn plain old story objects from API into instances of Story class
    const stories = response.data.stories.map(story => new Story(story));

    // build an instance of our own class using the new array of stories
    return new StoryList(stories);
  }

  /** Adds story data to API, makes a Story instance, adds it to story list.
   * - user - the current instance of User who will post the story
   * - obj of {title, author, url}
   *
   * Returns the new Story instance
   */

  async addStory(user, newStory) {
    // UNIMPLEMENTED: complete this function!

    const response = await axios({
      url: `${BASE_URL}/stories`,
      method: "POST",
      data: {
        token: user.loginToken,
        story: {
          author: newStory.author,
          title: newStory.title,
          url: newStory.url
        }
      },
    });

    const story = new Story(response.data.story);
    this.stories.unshift(story);   // `unshift` this method add the new story on the top of the list.
    user.ownStories.unshift(story);

    return story;
  }

  async updateStory(user, story) {

    const indexAll = this.stories.findIndex(s => {
      return s.storyId === story.storyId;
    }); // 👉️ 1

    if (indexAll !== -1) {
      this.stories[indexAll].author = story.author;
      this.stories[indexAll].title = story.title;
      this.stories[indexAll].url = story.url;
    }
    const indexOwn = user.ownStories.findIndex(s => {
      return s.storyId === story.storyId;
    }); // 👉️ 1

    if (indexOwn !== -1) {
      user.ownStories[indexOwn].author = story.author;
      user.ownStories[indexOwn].title = story.title;
      user.ownStories[indexOwn].url = story.url;
    }
    const indexFavorite = user.favorites.findIndex(s => {
      return s.storyId === story.storyId;
    }); // 👉️ 1

    if (indexFavorite !== -1) {
      user.favorites[indexFavorite].author = story.author;
      user.favorites[indexFavorite].title = story.title;
      user.favorites[indexFavorite].url = story.url;
    }

    await axios({
      url: `${BASE_URL}/stories/${story.storyId}`,
      method: "PATCH",
      data: {
        token: user.loginToken,
        story: {
          author: story.author,
          title: story.title,
          url: story.url
        }
      },
    });

  }
  async removeStory(user, storyId) {
    this.stories = this.stories.filter(s => s.storyId !== storyId);
    user.ownStories = user.ownStories.filter(s => s.storyId !== storyId);
    user.favorites = user.favorites.filter(s => s.storyId !== storyId);
    await axios({
      url: `${BASE_URL}/stories/${storyId}`,
      method: "DELETE",
      data: { token: user.loginToken }
    });

  }
}


/******************************************************************************
 * User: a user in the system (only used to represent the current user)
 */

class User {
  /** Make user instance from obj of user data and a token:
   *   - {username, name, createdAt, favorites[], ownStories[]}
   *   - token
   */

  constructor({
    username,
    name,
    createdAt,
    favorites = [],
    ownStories = []
  },
    token) {
    this.username = username;
    this.name = name;
    this.createdAt = createdAt;

    // instantiate Story instances for the user's favorites and ownStories
    this.favorites = favorites.map(s => new Story(s));
    this.ownStories = ownStories.map(s => new Story(s));

    // store the login token on the user so it's easy to find for API calls.
    this.loginToken = token;
  }

  /** Register new user in API, make User instance & return it.
   *
   * - username: a new username
   * - password: a new password
   * - name: the user's full name
   */

  static async signup(username, password, name) {
    const response = await axios({
      url: `${BASE_URL}/signup`,
      method: "POST",
      data: { user: { username, password, name } },
    });

    let { user } = response.data

    return new User(
      {
        username: user.username,
        name: user.name,
        createdAt: user.createdAt,
        favorites: user.favorites,
        ownStories: user.stories
      },
      response.data.token
    );
  }

  /** Login in user with API, make User instance & return it.

   * - username: an existing user's username
   * - password: an existing user's password
   */

  static async login(username, password) {
    //debugger;
    const response = await axios({
      url: `${BASE_URL}/login`,
      method: "POST",
      data: { user: { username, password } },
    });


    let { user } = response.data;

    if (!user) {
      alert("Your login or your password is incorrect!");
    }

    return new User(
      {
        username: user.username,
        name: user.name,
        createdAt: user.createdAt,
        favorites: user.favorites,
        ownStories: user.stories
      },
      response.data.token
    );
  }

  /** When we already have credentials (token & username) for a user,
   *   we can log them in automatically. This function does that.
   */

  static async loginViaStoredCredentials(token, username) {
    try {
      const response = await axios({
        url: `${BASE_URL}/users/${username}`,
        method: "GET",
        params: { token },
      });

      let { user } = response.data;

      return new User(
        {
          username: user.username,
          name: user.name,
          createdAt: user.createdAt,
          favorites: user.favorites,
          ownStories: user.stories
        },
        token
      );
    } catch (err) {
      console.error("loginViaStoredCredentials failed", err);
      return null;
    }
  }

  async updateUserName(name) {
    this.name = name;
    await axios({
      url: `${BASE_URL}/users/${this.username}`,
      method: "PATCH",
      data: {
        token: this.loginToken,
        user: { name: name }
      },
    });
  }
  async updateUserPassword(password) {

    await axios({
      url: `${BASE_URL}/users/${this.username}`,
      method: "PATCH",
      data: {
        token: this.loginToken,
        user: { password: password }
      },
    });
  }


  /** Add a story to the list of user favorites and update the Api*/

  async addToFavorite(story) {
    this.favorites.unshift(story);
    await this.addFavoriteToApi(story)
  }

  /** Remove a story to the list of user favorites and update the Api*/

  async removeToFavorite(story) {
    this.favorites = this.favorites.filter(s => s.storyId !== story.storyId);
    await this.removeFavoriteToApi(story);
  }


  /** Update Api with favorite or not favorite.*/

  async addFavoriteToApi(story) {
    await axios({
      url: `${BASE_URL}/users/${this.username}/favorites/${story.storyId}`,
      method: "POST",
      data: { token: this.loginToken },
    });
  }
  async removeFavoriteToApi(story) {
    await axios({
      url: `${BASE_URL}/users/${this.username}/favorites/${story.storyId}`,
      method: "DELETE",
      data: { token: this.loginToken },
    });
  }

  /** Check if a story is a favorite of the current user. */

  isFavorite(story) {
    return this.favorites.some((s) => (s.storyId === story.storyId));
  }

}
