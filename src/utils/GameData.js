import { Joueur } from '../perso/Joueur.js';
import { Monstre } from '../perso/Monstre.js';
import { Sort } from '../sorts/Sort.js';
import { Soin } from '../sorts/Soin.js';
import { TypeCiblage } from '../enum/TypeCiblage.js';
export class GameData {
    static tour = 1;
    static map = [];
    static joueur = new Joueur("Joueur", 100, 10, 1, 1, 1, 1);
    static listeMonstres = [ new Monstre("Piou", 20, 5, 2, 2,2, 1, 30),
        new Monstre("Chacha", 30, 7, 3, 9, 9, 1, 50),
        new Monstre("Bouftou", 50, 10, 2, 9, 9, 1, 75),
        new Monstre("Chafer", 75, 15, 3, 9, 0, 2, 90),
        new Monstre("Craqueleur", 100, 20, 5, 9, 0, 2, 100),
        new Monstre("Bouftou Royal", 150, 25, 7, 9, 0, 1, 150, true),
        new Monstre("Chuchu", 200, 30, 10, 0, 0, 3, 200, true),
        new Monstre("Dark Vlad", 250, 35, 15, 0, 0, 3, 250, true),
        new Monstre("Oropo", 500, 50, 20, 0, 0, 3, 500, true)];

    static listeSorts = [
        new Sort("Coup d'épée", 2, 0, 10,TypeCiblage.CROIX),
        new Sort("Eclair", 2, 0, 15,TypeCiblage.DIAGONALE),
        new Soin("Soin", 3, 0, 10,TypeCiblage.CROIX),
        new Sort("Boule de feu", 4, 2, 25,TypeCiblage.CROIX), 
        new Sort("Météore", 5, 3, 40,TypeCiblage.DIAGONALE),
        new Sort("Tornade", 8, 5, 60,TypeCiblage.ZONE),
        new Soin("Purification", 6, 2, 20,TypeCiblage.ZONE),
        new Sort("Tempête de feu", 8, 6, 50,TypeCiblage.ZONE), 
        new Sort("Annihilastion", 10, 15, 100, TypeCiblage.ZONE),
        new Sort("Pluie de météores", 8, 7, 80,TypeCiblage.ZONE)];

    static mapSize = 10;
    static monstresEnjeu = [];
    static listeSortsDebloquer = []
}