import { GameData } from "../utils/GameData";
export class LogMessage {
    
    static logMessage(message,couleur) {
        const tour = GameData.tour;
        const gameLog = document.getElementById('game-log');
    
        gameLog.innerHTML += `<p class="${couleur}">Tour ${tour}: ${message}</p>`;
        gameLog.scrollTop = gameLog.scrollHeight;
    }
    
    static logMessageCombat(message) {
        LogMessage.logMessage(message, 'green');
    }
    
    static logMessageErreur(message) {
        LogMessage.logMessage(message, 'red');
    }
    
    static logMessageInfo(message) {
        LogMessage.logMessage(message, 'blue');
    }
}