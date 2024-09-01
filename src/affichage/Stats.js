import { GameData } from "../utils/GameData.js";
export class Stats {
    

    static afficherStats() {
        const joueur = GameData.joueur;
        document.getElementById('player-hp').textContent = `${joueur.pv}/${joueur.pvMax}`;
        document.getElementById('player-pa').textContent = `${joueur.pa}/${joueur.paMax}`;
        document.getElementById('player-pm').textContent = `${joueur.pm}/${joueur.pmMax}`;
        document.getElementById('player-atk').textContent = joueur.attaque;
    }
}