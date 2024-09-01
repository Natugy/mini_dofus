import { Game } from './utils/Game.js';

const game = new Game();
game.initialiserGame();

document.getElementById('end-turn-btn').addEventListener('click', () => game.finDuTour());