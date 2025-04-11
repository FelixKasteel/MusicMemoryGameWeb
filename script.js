const toggleClickCountBtn = document.getElementById("toggleClickCountBtn");
        let showClickCount = false;
        let scores = { cyan: 0, rosa: 0}; // Default players (Felix and Cora)
        let currentPlayer = null;
        let firstCard = null, secondCard = null;
        const availableColors = ['blue', 'red', 'green', 'orange', 'pink', 'cyan', 'rosa']; 
        const players = [
            { color: 'cyan', name: 'Felix' }, 
            { color: 'rosa', name: 'Cora' }
        ]; 
        let selectedColor = null;

        function renderColorOptions() {
        const usedColors = players.map(p => p.color);
        const container = document.getElementById("colorOptions");
        container.innerHTML = "";

      availableColors.forEach(color => {
        if (!usedColors.includes(color)) {
          const circle = document.createElement("div");
          circle.className = "color-circle";
          circle.style.backgroundColor = color;
          circle.dataset.color = color;

          circle.addEventListener("click", () => {
            document.querySelectorAll('.color-circle').forEach(el => el.classList.remove('selected'));
            circle.classList.add('selected');
            selectedColor = color;
          });
          container.appendChild(circle);
        }
      });
    }

    document.getElementById("addPlayerBtn").addEventListener("click", () => {
      const name = document.getElementById("playerName").value.trim();

      if (name && selectedColor) {
        players.push({ name, color: selectedColor });
        document.getElementById("playerName").value = "";
        selectedColor = null;
        renderColorOptions();
        displayPlayers();
      } else {
        alert("Please enter a name and choose a color.");
      }
    });

    /*function displayOptionPlayers() {
      const optionList = document.getElementById("playerList");
      optionList.innerHTML = "";
      players.forEach((player, index) => {
        const colorHex = availableColors.find(c => c.name === player.color).hex;
        const playerDiv = document.createElement("div");
        playerDiv.className = "player-info";
        playerDiv.style.backgroundColor = colorHex;
        playerDiv.innerHTML = `
          <button class="delete-btn" onclick="deletePlayer(${index})">X</button>
          <span class="player-name">${player.name}</span>
        `;
        list.appendChild(playerDiv);
      });
    }*/

    function deletePlayer(index) {
      players.splice(index, 1);
      displayPlayers();
    }

    // Initial render
    renderColorOptions();

        document.getElementById('PlayerBtn').addEventListener('click', () => {
            document.getElementById('playerOptionView').style.display = 'flex';
        });

        /*document.getElementById('cancelPlBtn').addEventListener('click', () => {
            document.getElementById('playerOptionView').style.display = 'none';
        });*/

        let startPressed = false;

        document.getElementById('startBtn').addEventListener('click', () => {
            startPressed = true;
            decideFirstPlayer();
            document.getElementById('startBtn').remove();
            document.getElementById('addPlayerBtn').remove();
            document.getElementById('removePlayerBtn').remove();
            const playerSelect = document.getElementById('playerModal');
            document.getElementById('cardsOptionBtn').remove();
            if (playerSelect) playerSelect.remove();
        });

        document.getElementById('addPlayerBtn').addEventListener('click', () => {
            document.getElementById('playerModal').style.display = 'flex';
        });

        document.getElementById('removePlayerBtn').addEventListener('click', () => {
            players.pop(); 
            displayPlayers();
        });

        document.getElementById('savePlayerBtn').addEventListener('click', () => {
            const color = document.getElementById('colorSelect').value;
            const name = document.getElementById('playerName').value.trim();

            if (name && availableColors.includes(color) && !players.some(player => player.color === color)) {
                players.push({ color, name });
                scores[color] = 0; // Initialize score for the new player
                displayPlayers();
                document.getElementById('playerModal').style.display = 'none'; 
            } else {
                alert('Please provide a valid color!');
            }
        });

        document.getElementById('cancelPlayerBtn').addEventListener('click', () => {
            document.getElementById('playerModal').style.display = 'none';
        });

        document.getElementById('cardsOptionBtn').addEventListener('click', () => { 
            document.getElementById('cardsOptionView').style.display = 'flex';
        });

        document.getElementById('cardsBtn').addEventListener('click', () => {
            initialNumberPairs = numberPairs;
            updateGrid();
            document.getElementById('cardsOptionView').style.display = 'none';
        });

        document.getElementById('cancelBtn').addEventListener('click', () => {
            numberPairs = initialNumberPairs; // Revert to the initial value
            slider.value = numberPairs; // Reset the slider to the initial value
            pairsCountDisplay.textContent = numberPairs;
            document.getElementById('cardsOptionView').style.display = 'none';
        });

        // Display players with their scores and names
        function displayPlayers() {
            const playerList = document.getElementById('playerList');
            playerList.innerHTML = ''; // Clear current list

            players.forEach(player => {
                const playerElement = document.createElement('div');
                playerElement.classList.add('score-container', player.color);
                playerElement.innerHTML = `
                    <h2>${player.name}</h2>
                    <div id="score-${player.color}" class="score-value">${scores[player.color]}</div>
                `;
                playerList.appendChild(playerElement);
            });
        }

        function updateScore(playerColor) {
            const scoreElement = document.getElementById(`score-${playerColor}`);
            scoreElement.textContent = scores[playerColor];
        }

        let decidedPlayer = false;

        function decideFirstPlayer() {
            let totalCycles = 12; 
            let delay = 55; 
            let acceleration = 1.15; 
            let cycle = 0;
            let finalIndex = Math.floor(Math.random() * players.length);
    
        function highlightNextPlayer() {
            let playerIndex = cycle % players.length;
            currentPlayer = players[playerIndex].color;
            updateCurrentPlayerHighlight();

            if (cycle < totalCycles || playerIndex !== finalIndex) {
                cycle++;
                delay *= acceleration; 
                setTimeout(highlightNextPlayer, delay);
            } else {
                currentPlayer = players[finalIndex].color;
                updateCurrentPlayerHighlight();
                decidedPlayer = true;
            }
        }
        highlightNextPlayer();
        }

        // Update the highlight for the current player
        function updateCurrentPlayerHighlight() {
            const clickSound = document.getElementById("clickSound");
            if (clickSound) {
                clickSound.currentTime = 0; // Reset audio in case it's already playing
                clickSound.play();
            }
            players.forEach(player => {
                const playerContainer = document.querySelector(`.${player.color}`);
                playerContainer.classList.toggle('current', currentPlayer === player.color);
            });
        }

        const musicPairs = [];
        for (let i = 0; i <= 66; i++) {
            const track = `audio/track${i}.mov`;
            musicPairs.push([track,track]);
        }

        let initialNumberPairs = 20; // Initial default number of pairs
        let numberPairs = initialNumberPairs;
        let totalCards = numberPairs * 2;

        const littleGrid = document.getElementById('littleGrid');
        const slider = document.getElementById('cardsSlider');
        const pairsCountDisplay = document.getElementById('pairsCount');

        slider.value = numberPairs; // Initialize the slider value to the default numberPairs
        pairsCountDisplay.textContent = numberPairs; // Display initial number of pairs
        updateLittleGrid();

        function checkWin() {
        const collectedPairs = Object.values(scores).reduce((sum, val) => sum + val, 0);

        if (collectedPairs >= numberPairs) {
        let winningPlayer = Object.keys(scores).reduce((a, b) => scores[a] > scores[b] ? a : b);
        const winnerName = players.find(p => p.color === winningPlayer)?.name || winningPlayer;

        const sortedScores = Object.entries(scores)
            .sort((a, b) => b[1] - a[1])
            .map(([color, score]) => {
                const player = players.find(p => p.color === color);
                const name = player ? player.name : color;
                return `<li><strong>${name}</strong>: ${score} pairs</li>`;
            }).join("");

        // Update modal
        document.getElementById("winnerMessage").innerHTML = `
            ${winnerName} wins the game! 🎉
            <hr style="margin: 10px 0;">
            <ul style="text-align: left; padding-left: 20px;">${sortedScores}</ul>
        `;

        document.getElementById("winModal").style.display = "block";
            }
        }

        function getSmartGrid(totalCards) {
          let cols, rows;

          // Handle small grids
          if (totalCards === 2) {
            cols = 2;
            rows = 1;
          } else if (totalCards === 4) {
            cols = 2;
            rows = 2;
          }else if (totalCards === 6) {
            cols = 3;
            rows = 2;
          } else if (totalCards === 8) {
            cols = 4;
            rows = 2;
          } else if (totalCards === 10) {
            cols = 5;
            rows = 2;
          } else if (totalCards <= 16) {
            // For cards 12, 14, 16, etc.
            cols = 4;
            rows = Math.ceil(totalCards / 4);
          } else if (totalCards <= 24) {
            cols = 6;
            rows = Math.ceil(totalCards / 6);
          } else if (totalCards <= 32) {
            cols = 8;
            rows = Math.ceil(totalCards / 8);
          } else if (totalCards <= 40) {
            cols = 8;
            rows = Math.ceil(totalCards / 8);
          } else {
            // Fallback to 10 columns for more than 40 cards
            cols = 10;
            rows = Math.ceil(totalCards / 10);
          }
        
          return { cols, rows };
        }

        function updateGrid() {
    const { cols, rows } = getSmartGrid(totalCards);

    // Apply grid template styles to the main grid
    grid.style.gridTemplateColumns = `repeat(${cols}, 1fr)`;
    grid.style.gridTemplateRows = `repeat(${rows}, auto)`;

    // Clear the previous grid
    grid.innerHTML = '';

    // Create new pairs for the grid
    createPairs();
}

    

    function updateLittleGrid() {
    const { cols, rows } = getSmartGrid(totalCards);

    // Apply grid template styles to the preview grid
    littleGrid.style.gridTemplateColumns = `repeat(${cols}, 1fr)`;
    littleGrid.style.gridTemplateRows = `repeat(${rows}, auto)`;

    // Clear the previous preview grid
    littleGrid.innerHTML = '';

    // Add empty boxes (non-clickable cards) for the preview
    for (let i = 0; i < totalCards; i++) {
        const littleCard = document.createElement('div');
        littleCard.className = 'littleCard';
        littleGrid.appendChild(littleCard);
    }
}

slider.addEventListener('input', () => {
    // Update the number of pairs and total cards
    numberPairs = slider.value;
    totalCards = numberPairs * 2;
    pairsCountDisplay.textContent = numberPairs;
    updateLittleGrid();
});

// Initial update for both grids
updateLittleGrid();
updateGrid();

function createPairs() {
    const randomPairs = shuffleFirst(musicPairs);  // Shuffle the music pairs

    // Select the correct number of pairs based on the slider
    const selectedPairs = randomPairs.slice(0, numberPairs); // Only use as many pairs as selected
    const selectedTracks = selectedPairs.flat(); // Flatten the pairs array into a list of tracks

    // Shuffle the selected tracks
    const shuffledPairs = shuffle(selectedTracks);

    // Create the cards for the grid
    shuffledPairs.forEach((music, index) => {
        const card = document.createElement('div');
        card.classList.add('card');
        card.dataset.track = music;

        // Front content
        const cardContent = document.createElement('div');
        cardContent.classList.add('card-content');
        cardContent.textContent = index + 1;

        // Back content (music note)
        const cardBack = document.createElement('div');
        cardBack.classList.add('card-back');
        cardBack.textContent = '🎵';

        // Append the content to the card
        card.appendChild(cardContent);
        card.appendChild(cardBack);

        // Add click event listener to flip the card
        card.addEventListener('click', () => flipCard(card));

        // Add the card to the grid
        grid.appendChild(card);
    });
}
    let canFlipSecondCard = true;

function flipCard(card) {
    if (decidedPlayer == false){
        //alert("You must shuffle and decide who begins first before flipping a card!");
        //cant flip a card
        //document.getElementById("allertMessage").innerHTML = `Please shuffle who begins first!`;
        //document.getElementById("allert").style.display = "block";
        return
    }
    if (card.classList.contains('light-blue')) return; // Matched cards
    if (firstCard && secondCard) return; // Two cards already flipped
    if (!canFlipSecondCard) return; // Block second card flip until audio ends
    if (card.classList.contains('flipped')) return; // Already flipped

    const audio = new Audio(card.dataset.track);
    audio.play();
    card.classList.add('flipped');

    if (!firstCard) {
        firstCard = card;
        canFlipSecondCard = false;

        audio.onended = () => {
            canFlipSecondCard = true;
        };
    } else {
        secondCard = card;
        checkForMatch();
    }
}

// Function to switch the current player after a mismatch
function switchPlayer() {
    // Find the current player and switch to the next one
    const currentIndex = players.findIndex(player => player.color === currentPlayer);
    const nextIndex = (currentIndex + 1) % players.length;
    currentPlayer = players[nextIndex].color;
    updateCurrentPlayerHighlight(); 
}

function checkForMatch() {
    if (firstCard.dataset.track === secondCard.dataset.track && firstCard !== secondCard) {
        // If the cards match, apply light blue background
        firstCard.classList.add('light-blue');
        secondCard.classList.add('light-blue');

        // Also add light blue to card content and back
        firstCard.querySelector('.card-content').classList.add('light-blue');
        firstCard.querySelector('.card-back').classList.add('light-blue');
        secondCard.querySelector('.card-content').classList.add('light-blue');
        secondCard.querySelector('.card-back').classList.add('light-blue');

        // Disable interaction on matched cards
        firstCard.style.pointerEvents = 'none';
        secondCard.style.pointerEvents = 'none';

        // Update score for the current player
        scores[currentPlayer]++;
        updateScore(currentPlayer);
        checkWin();

        setTimeout(() => {
            firstCard.classList.remove('flipped');
            secondCard.classList.remove('flipped');
            firstCard = null;
            secondCard = null;
        }, 2500); // Slight delay before removing 'flipped' class
    } else {
        setTimeout(() => {
            firstCard.classList.remove('flipped');
            secondCard.classList.remove('flipped');
            firstCard = null;
            secondCard = null;

            // Switch the player since the cards didn't match
            switchPlayer();
        }, 2950); // Slight delay before switching player
    }
}

        function shuffleFirst(array) {
            for (let i = array.length - 1; i > 0; i--) {
                const randomIndex = Math.floor(Math.random() * (i + 1));  
                [array[i], array[randomIndex]] = [array[randomIndex], array[i]];  
            }
            return array;
        }

        function shuffle(array) {
            for (let i = array.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [array[i], array[j]] = [array[j], array[i]];
            }
            return array;
        }


        // Memory game logic (same as previous)
        window.onload = () => {
            displayPlayers();
            //decideFirstPlayer();
        };
