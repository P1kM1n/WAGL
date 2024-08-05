# WAGL
Web-Accessible Game Library. A self hosted web based solution to your game library. Docker compatible.

#Personal Game Library
Welcome to your personal Game Library! This web application allows you to manage and explore your game library stored on your NAS. You can add, search, filter, and launch your games directly from the interface.

## prerequisites!!

1. Clone the repository to wherever you wish.
2. Update the serverUrl in script.js with your LOCAL COMPUTERS URL (the one the games will be launching on).
3. Compile server.py or use the provided exe, up to you.
4. **Win+R**, then "shell:Startup" and put the exe in the file location that comes up.
5. Put the HTML, JS, and CSS into your web server executer of choice
   
# Usage

### Adding a Game
Click the "Add Game" button at the bottom of the page.
Fill out the form with the game's name, location, tags (comma-separated), and series.
Click "Find Game" to fetch the game's cover and tags from the RAWG API.
Click "Add Game" to save the game to your library.

### Searching for Games
Use the search bar at the top of the page to search for games by name.
The game grid will dynamically update to show only games that match your search query.

### Filtering Games by Tags
Use the "Filter by tags" dropdown below the search bar to filter games by their tags.
Select one or more tags from the dropdown.
The game grid will dynamically update to show only games that match the selected tags.

### Editing Game Metadata
Click the "Edit" button on the bottom left of the game card.
Update the desired fields in the form.
Click "Save Changes" to update the game metadata.

### Opening a Game
Click the "Open" button on the game card.
The game will launch using the specified location.

### Deleting a Game
Click the "❌" (delete) icon on the game card.
Confirm the deletion when prompted.
The game will be removed from your library.

### Configuration
Local Server URL: Update the serverUrl variable in script.js with the URL of your local server.
RAWG API Key: Update the apiKey variable in script.js with your RAWG API key.

### Technologies Used
HTML, CSS, JavaScript
RAWG API for game metadata
Local storage for saving game data
