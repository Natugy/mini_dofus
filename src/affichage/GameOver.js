export class GameOver {
    static afficherGameOver() {
        const gameOverScreen = document.getElementById('game-over-screen');
        gameOverScreen.style.display = 'flex';
        gameOverScreen.innerHTML = '';
        const gameOverMessage = document.createElement('h2');
        gameOverMessage.textContent = 'Game Over!';
        gameOverScreen.appendChild(gameOverMessage);
        const newGameButton = document.createElement('button');
        newGameButton.textContent = 'Nouvelle partie';
        newGameButton.onclick = () => location.reload();
        gameOverScreen.appendChild(newGameButton);
        const gameContainer = document.getElementById('game-container');
        gameContainer.style.display = 'none';
    }
}