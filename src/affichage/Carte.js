import { GameData } from "../utils/GameData";
import { Cellule } from "./Cellule";


export class Carte {
    static afficherCarte() {   
        const mapContainer = document.getElementById('map-container');
        mapContainer.innerHTML = '';
        const map = GameData.map;
        const joueur = GameData.joueur;
        const mapSize = map.length;
        for (let y = 0; y < mapSize; y++) {
            for (let x = 0; x < mapSize; x++) {
                const cell = map[y][x];
                mapContainer.appendChild(cell.htmlElement);
            }
        }
    }

    static resetCarteMonstre() {
        const map = GameData.map;
        const joueur = GameData.joueur;
        const mapSize = map.length;
        const monstresEnJeu = GameData.monstresEnjeu;
        const cellule= map[joueur.y][joueur.x];
        for (let y = 0; y < mapSize; y++) {
            map[y] = [];
            for (let x = 0; x < mapSize; x++) {
                if (y === joueur.y && x === joueur.x) {
                    map[y][x] = cellule;
                } else map[y][x] = new Cellule(x, y);
            }
        }
        map[joueur.y][joueur.x].estJoueur(joueur);
        monstresEnJeu.forEach(monstre => {
            map[monstre.y][monstre.x].estMonstre(monstre);
        });

    }

}