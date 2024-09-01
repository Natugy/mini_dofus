import { Personnage } from './Personnage.js';
import { GameData } from '../utils/GameData.js';
import { BoutonSort } from '../affichage/BoutonSort.js';
import { LogMessage } from '../affichage/LogMessage.js';

export class Joueur extends Personnage {
    constructor(nom, pv, attaque, defense, x, y, porteeAttaque) {
        super(nom, pv, attaque, defense, x, y, porteeAttaque,3);
        this.experience = 0;
        this.niveau = 1;
        this.paMax = 6;
        this.pa = this.paMax;
        this.sorts = [];
    }

    ratioExperience() {
        return this.experience / (this.niveau * 100);
    }

    gagnerExperience(exp) {
        this.experience += exp;
        LogMessage.logMessageInfo(`${this.nom} gagne ${exp} points d'expérience.`);
        while (this.experience >= this.niveau * 100) {
            this.monterDeNiveau();
        }
    }

    estAPorteeDeplacement(cible) {
        const distance = Math.abs(this.x - cible.x) + Math.abs(this.y - cible.y);
        return distance <= this.pm && distance > 0;
    }

    ajoutSort(sort) {
        sort.lanceur = this;
        this.sorts.push(sort);
        GameData.listeSortsDebloquer.push(new BoutonSort(sort));
    }

    monterDeNiveau() {
        this.niveau++;
        this.pvMax += 10;
        this.pv = this.pvMax;
        this.attaque += 4;
        this.defense += 1;
        this.experience = Math.max(this.experience-this.niveau * 100,0);
        
        if (this.niveau % 3 === 0) {
            this.paMax++;
        }
        if (this.niveau % 5 === 0) {
            this.pmMax++;
        }
        if (this.niveau % 7 === 0) {
            this.porteeAttaque++;
        }
        if (this.niveau <= GameData.listeSorts.length) this.ajoutSort(GameData.listeSorts[this.niveau - 1]);
        LogMessage.logMessageInfo(`${this.nom} passe au niveau ${this.niveau}!`);
    }


    finDuTour() {
        this.pa = this.paMax;
        this.pm = this.pmMax;
        LogMessage.logMessageInfo(`Fin du tour de ${this.nom}. PA restaurés à ${this.pa}.`);
    }
}