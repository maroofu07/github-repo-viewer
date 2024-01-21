// script.js

document.addEventListener("DOMContentLoaded", function () {
     const loader = document.getElementById("loader");
     const repositoriesContainer = document.getElementById("repositories");
     const paginationContainer = document.getElementById("pagination");
     const searchInput = document.getElementById("searchInput");
     const username = "johnpapa"; // Replace with the desired GitHub username
     const perPage = 10;
     let currentPage = 1;
 
     function showLoader() {
         loader.style.display = "block";
     }
 
     function hideLoader() {
         loader.style.display = "none";
     }
 
     function renderRepositories(repositories) {
         repositoriesContainer.innerHTML = "";
         if (repositories.length === 0) {
             repositoriesContainer.innerHTML = "<p>No repositories found.</p>";
             return;
         }
         repositories.forEach((repo) => {
             const repoCard = document.createElement("div");
             repoCard.className = "repo-card card mb-3";
             repoCard.innerHTML = `
                 <div class="card-body">
                     <h5 class="card-title">${repo.name}</h5>
                     <p class="card-text">${repo.description || "No description available."}</p>
                     <div class="topics">Topics: ${repo.topics.join(", ")}</div>
                 </div>
             `;
             repositoriesContainer.appendChild(repoCard);
         });
     }
 
     function renderPagination(totalPages) {
         paginationContainer.innerHTML = "";
         for (let i = 1; i <= totalPages; i++) {
             const pageButton = document.createElement("button");
             pageButton.textContent = i;
             pageButton.className = "btn btn-outline-primary";
             pageButton.addEventListener("click", () => {
                 currentPage = i;
                 fetchRepositories();
             });
             paginationContainer.appendChild(pageButton);
         }
     }
 
     async function fetchRepositories() {
         showLoader();
         try {
             const response = await fetch(
                 `https://api.github.com/users/${username}/repos?page=${currentPage}&per_page=${perPage}`
             );
             const repositories = await response.json();
             hideLoader();
             renderRepositories(repositories);
             renderPagination(Math.ceil(repositories.length / perPage));
         } catch (error) {
             console.error("Error fetching repositories:", error);
             hideLoader();
             repositoriesContainer.innerHTML = "<p>Error fetching repositories.</p>";
         }
     }
 
     function searchRepositories() {
         const searchTerm = searchInput.value.trim();
         if (searchTerm !== "") {
             showLoader();
             fetch(`https://api.github.com/users/${username}/repos`)
                 .then((response) => response.json())
                 .then((repositories) => {
                     const filteredRepositories = repositories.filter((repo) =>
                         repo.name.toLowerCase().includes(searchTerm.toLowerCase())
                     );
                     hideLoader();
                     renderRepositories(filteredRepositories);
                     renderPagination(Math.ceil(filteredRepositories.length / perPage));
                 })
                 .catch((error) => {
                     console.error("Error searching repositories:", error);
                     hideLoader();
                     repositoriesContainer.innerHTML = "<p>Error searching repositories.</p>";
                 });
         } else {
             fetchRepositories();
         }
     }
 
     fetchRepositories(); // Fetch repositories on page load
 });
 