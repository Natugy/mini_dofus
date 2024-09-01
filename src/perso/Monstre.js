import { Personnage } from "./Personnage";
import { Sort } from "../sorts/Sort";
import { GameData } from "../utils/GameData";
import { Carte } from "../affichage/Carte";
import { Stats } from "../affichage/Stats";
import { GameOver } from "../affichage/GameOver";
export class Monstre extends Personnage {
    constructor(nom, pv, attaque, defense, x, y, porteeAttaque, experienceDonnee,boss=false) {
        super(nom, pv, attaque, defense, x, y, porteeAttaque,3,3);
        this.experienceDonnee = experienceDonnee;
        this.sort = new Sort("Coup de griffe", 2, 1, 10,this);
        this.boss = boss;
    }

    jouerTour() {
        const joueur = GameData.joueur;
        if (this.pa > 0) {
            if(this.pm>0  && !this.estAPorteeAttaque(joueur)){
                this.deplacerVersJoueur();
                return true;
            }
            else if (this.estAPorteeAttaque(joueur)) {
                
                this.attaquer(joueur);
                this.pa-=2;
                return true;
            }
        }
        return false;
    }

    deplacerVersJoueur() {
        const joueur = GameData.joueur;
        const map = GameData.map;
        const dx = Math.sign(joueur.x - this.x);
        const dy = Math.sign(joueur.y - this.y);
        if (Math.abs(joueur.x - this.x) > Math.abs(joueur.y - this.y)) {
            if (this.checkCoordonnees(this.x + dx, this.y) && map[this.y][this.x + dx].estLibre() ) {
                this.deplacer(this.x + dx, this.y);
            } else if (this.checkCoordonnees(this.x, this.y + dy)&&map[this.y + dy][this.x].estLibre()) {
                this.deplacer(this.x, this.y + dy);
                
            }
        } else {
            if (this.checkCoordonnees(this.x, this.y + dy)&&map[this.y + dy][this.x].estLibre()) {
                this.deplacer(this.x, this.y + dy);
                
            } else if (this.checkCoordonnees(this.x + dx, this.y)&&map[this.y][this.x + dx].estLibre() ) {
                this.deplacer(this.x + dx, this.y);
                
            }
        }
    }
    
    checkCoordonnees(x, y) {
        return x >= 0 && x < GameData.mapSize && y >= 0 && y < GameData.mapSize;
    }

    wait(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}