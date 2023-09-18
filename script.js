"use strict";

// Github
// UI

const GITHUB_API = "https://api.github.com";

const searchInput = document.querySelector(".searchUser");

class Github {
  constructor() {
    this.clientId = "bc89e650cf48fb018c55";
    this.clientSecret = "fd4623dc996c4f1a4079f15548cc8c8aca8e1fc0";
  }

  async getUser(userName) {
    const response = await fetch(
      `${GITHUB_API}/users/${userName}?client_id=${this.clientId}&client_secret=${this.clientSecret}`
    );
    const user = await response.json();

    return user;
  }

  async getRepos(userName) {
    const response = await fetch(
      `${GITHUB_API}/users/${userName}/repos?sort=created&client_id=${this.clientId}&client_secret=${this.clientSecret}`
    );
    const repos = await response.json();
    return repos;
  }
}

class UI {
  constructor() {
    this.profile = document.querySelector(".profile");
  }

  showProfile(user) {
    this.profile.innerHTML = `
    <div class="card card-body mb-3">
    <div class="row">
      <div class="col-md-3">
        <img class="img-fluid mb-2" src="${user.avatar_url}">
        <a href="${user.html_url}" target="_blank" class="btn btn-primary btn-block mb-4">View Profile</a>
      </div>
      <div class="col-md-9">
        <span class="badge badge-primary">Public Repos: ${user.public_repos}</span>
        <span class="badge badge-secondary">Public Gists: ${user.public_gists}</span>
        <span class="badge badge-success">Followers: ${user.followers}</span>
        <span class="badge badge-info">Following: ${user.following}</span>
        <br><br>
        <ul class="list-group">
          <li class="list-group-item">Company: ${user.company}</li>
          <li class="list-group-item">Website/Blog: ${user.blog}</li>
          <li class="list-group-item">Location: ${user.location}</li>
          <li class="list-group-item">Member Since: ${user.created_at}</li>
        </ul>
      </div>
    </div>
  </div>
  <h3 class="page-heading mb-3">Latest Repos</h3>
  <div class="repos"></div>a
    `;
  }

  clearProfile() {
    this.profile.innerHTML = "";
  }

  showAlert(message, className) {
    this.clearAlert();
    const div = document.createElement("div");

    div.className = className;
    div.innerHTML = message;

    const search = document.querySelector(".search");

    search.before(div);

    setTimeout(() => {
      this.clearAlert();
    }, 3000);
  }

  clearAlert() {
    const alert = document.querySelector(".alert");
    if (alert) {
      alert.remove();
    }
  }

  showRepos(repos) {
    let output = "";
    repos.slice(0, 5).forEach((repo) => {
      output += `
       <div class="card card-body mb-2">
         <div class="row">
           <div class="col-md-6">
             <a href="${repo.html_url}" target="_blank">${repo.name}</a>
           </div>
           <div class="col-md-6">
             <span class="badge badge-primary">Stars: ${repo.stargazers_count}</span>
             <span class="badge badge-secondary">Watchers: ${repo.watchers_count}</span>
             <span class="badge badge-success">Forks: ${repo.forks_count}</span>
           </div>
         </div>
       </div>
     `;
    });

    document.querySelector(".repos").innerHTML = output;
  }
}

const github = new Github();
const ui = new UI();

function debounce(func, delay) {
  let timeout;
  return function (...args) {
    const context = this;
    clearTimeout(timeout);
    timeout = setTimeout(() => {
      func.apply(context, args);
    }, delay);
  };
}

searchInput.addEventListener(
  "input",
  debounce(async (e) => {
    const inputValue = e.target.value;

    if (inputValue !== "") {
      const userData = await github.getUser(inputValue);

      if (userData.message === "Not Found") {
        ui.clearProfile();
        return ui.showAlert(userData.message, "alert alert-danger");
      }

      ui.showProfile(userData);
      const userRepos = await github.getRepos(inputValue);
      ui.showRepos(userRepos);
    } else {
      ui.clearProfile();
    }
  }, 500)
);
