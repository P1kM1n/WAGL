document.addEventListener("DOMContentLoaded", function() {
    const addGameBtn = document.getElementById("add-game-btn");
    const findGameBtn = document.getElementById("find-game-btn");
    const addGameSubmitBtn = document.getElementById("add-game-submit-btn");
    const editGameSubmitBtn = document.getElementById("edit-game-submit-btn");
    const addModal = document.getElementById("add-game-modal");
    const editModal = document.getElementById("edit-game-modal");
    const closeBtns = document.querySelectorAll(".close");
    const addForm = document.getElementById("add-game-form");
    const editForm = document.getElementById("edit-game-form");
    const gameGrid = document.querySelector(".game-grid");
    const searchInput = document.getElementById("search-input");
    const filterTags = document.getElementById("filter-tags");
    const apiKey = '29b5806826e240e39c31bbd0b996ea09'; // Replace with your RAWG API key
    const serverUrl = 'http://localhost:3000/open-file'; // URL for the local server

    let gameTitles = JSON.parse(localStorage.getItem("gameTitles")) || [];
    let allTags = JSON.parse(localStorage.getItem("allTags")) || [];
    let currentEditIndex = null;

    function renderGames() {
        gameGrid.innerHTML = ''; // Clear current game grid

        const searchQuery = searchInput.value.toLowerCase();
        const selectedTags = Array.from(filterTags.selectedOptions).map(option => option.value);

        const filteredGames = gameTitles.filter(game => {
            const matchesSearch = game.name.toLowerCase().includes(searchQuery);
            const matchesTags = selectedTags.length === 0 || (game.tags && game.tags.some(tag => selectedTags.includes(tag)));
            return matchesSearch && matchesTags;
        });

        filteredGames.forEach((game, index) => {
            const gameCard = document.createElement("div");
            gameCard.classList.add("game-card");

            const gameImage = document.createElement("img");
            gameImage.src = game.image || 'default-cover.jpg'; // Placeholder image
            gameImage.alt = `${game.name} cover`;
            gameImage.classList.add("game-cover");
            gameCard.appendChild(gameImage);

            const gameDetails = document.createElement("div");
            gameDetails.classList.add("game-details");

            const gameTitle = document.createElement("h3");
            gameTitle.textContent = game.name;
            gameDetails.appendChild(gameTitle);

            const tags = document.createElement("p");
            tags.textContent = `Tags: ${game.tags ? game.tags.join(', ') : 'N/A'}`; // Display tags
            gameDetails.appendChild(tags);

            const series = document.createElement("p");
            series.textContent = `Series: ${game.series || 'N/A'}`; // Display series
            gameDetails.appendChild(series);

            gameCard.appendChild(gameDetails);

            const openButton = document.createElement("button");
            openButton.textContent = "Open";
            openButton.classList.add("open-button");
            openButton.onclick = function() {
                fetch(serverUrl, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ filePath: game.location })
                })
                    .then(response => response.text())
                    .then(message => alert(message))
                    .catch(error => console.error('Error:', error));
            };
            gameCard.appendChild(openButton);

            const editIcon = document.createElement("div");
            editIcon.textContent = "✏️"; // Use an emoji for the edit icon
            editIcon.classList.add("edit-icon");
            editIcon.onclick = function() {
                openEditModal(index);
            };
            gameCard.appendChild(editIcon);

            const deleteIcon = document.createElement("div");
            deleteIcon.textContent = "❌"; // Use an emoji for the delete icon
            deleteIcon.classList.add("delete-icon");
            deleteIcon.onclick = function() {
                if (confirm(`Are you sure you want to delete "${game.name}"?`)) {
                    gameTitles.splice(index, 1);
                    localStorage.setItem("gameTitles", JSON.stringify(gameTitles));
                    renderGames();
                }
            };
            gameCard.appendChild(deleteIcon);

            gameGrid.appendChild(gameCard);
        });
    }

    function updateTagOptions() {
        filterTags.innerHTML = '';

        allTags.forEach(tag => {
            const option = document.createElement("option");
            option.value = tag;
            option.textContent = tag;
            filterTags.appendChild(option);
        });
    }

    function fetchGameCoverAndTags(gameName, callback) {
        fetch(`https://api.rawg.io/api/games?key=${apiKey}&search=${encodeURIComponent(gameName)}`)
            .then(response => response.json())
            .then(data => {
                if (data.results && data.results.length > 0) {
                    const game = data.results[0];
                    const coverImage = game.background_image || 'default-cover.jpg';
                    const tags = game.tags ? game.tags.map(tag => tag.name) : [];
                    allTags = [...new Set([...allTags, ...tags])];
                    localStorage.setItem("allTags", JSON.stringify(allTags));
                    updateTagOptions();
                    callback(coverImage, tags);
                } else {
                    callback('default-cover.jpg', []);
                }
            })
            .catch(error => {
                console.error('Error fetching game cover:', error);
                callback('default-cover.jpg', []);
            });
    }

    function openAddModal() {
        addModal.style.display = "block";
    }

    function closeModals() {
        addModal.style.display = "none";
        editModal.style.display = "none";
    }

    function openEditModal(index) {
        currentEditIndex = index;
        const game = gameTitles[index];
        document.getElementById("edit-game-name").value = game.name;
        document.getElementById("edit-game-location").value = game.location;
        document.getElementById("edit-game-tags").value = game.tags ? game.tags.join(', ') : '';
        document.getElementById("edit-game-series").value = game.series || '';
        editModal.style.display = "block";
    }

    function addGame() {
        const gameName = document.getElementById("game-name").value;
        const gameLocation = document.getElementById("game-location").value;
        const gameTags = document.getElementById("game-tags").value.split(',').map(tag => tag.trim()).filter(tag => tag);
        const gameSeries = document.getElementById("game-series").value;

        fetchGameCoverAndTags(gameName, function(image, tagsFromAPI) {
            const game = {
                name: gameName,
                location: gameLocation,
                tags: gameTags.length ? gameTags : tagsFromAPI,
                series: gameSeries,
                image: image
            };
            gameTitles.push(game);
            localStorage.setItem("gameTitles", JSON.stringify(gameTitles));
            closeModals();
            renderGames();
        });
    }

    function editGame() {
        const gameName = document.getElementById("edit-game-name").value;
        const gameLocation = document.getElementById("edit-game-location").value;
        const gameTags = document.getElementById("edit-game-tags").value.split(',').map(tag => tag.trim()).filter(tag => tag);
        const gameSeries = document.getElementById("edit-game-series").value;

        fetchGameCoverAndTags(gameName, function(image, tagsFromAPI) {
            const game = {
                name: gameName,
                location: gameLocation,
                tags: gameTags.length ? gameTags : tagsFromAPI,
                series: gameSeries,
                image: image
            };
            gameTitles[currentEditIndex] = game;
            localStorage.setItem("gameTitles", JSON.stringify(gameTitles));
            closeModals();
            renderGames();
        });
    }

    addGameBtn.onclick = openAddModal;
    closeBtns.forEach(btn => btn.onclick = closeModals);
    window.onclick = function(event) {
        if (event.target === addModal || event.target === editModal) {
            closeModals();
        }
    };

    addGameSubmitBtn.onclick = addGame;
    editGameSubmitBtn.onclick = editGame;
    searchInput.oninput = renderGames;
    filterTags.onchange = renderGames;

    renderGames();
    updateTagOptions();
});
