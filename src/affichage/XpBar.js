import { GameData } from "../utils/GameData";
export class XpBar {
    static afficherXpBar() {
        const joueur = GameData.joueur;
        const xpPercentage = Math.round(joueur.experience / (joueur.niveau * 100) * 100)
        const xpProgress = document.querySelector('.xp-progress');
        const xpText = document.querySelector('.xp-text');
        xpProgress.style.width = `${xpPercentage}%`;
        xpText.textContent = `${xpPercentage}% - Niveau ${joueur.niveau}`;
    }
}