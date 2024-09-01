import { TypeCiblage } from "../enum/TypeCiblage";
import { LogMessage } from "../affichage/LogMessage";


export class Sort {
    constructor(nom, coutPA, portee, degats, typeCiblage=TypeCiblage.ZONE,lanceur) {
        this.nom = nom;
        this.coutPA = coutPA;
        this.portee = portee;
        this.degats = degats;
        this.lanceur = lanceur;
        this.icon = '🔮';
        this.typeCiblage = typeCiblage;
    }

    estAPortee(cible) {
        const distance = Math.abs(this.lanceur.x - cible.x) + Math.abs(this.lanceur.y - cible.y);
        if (this.typeCiblage === TypeCiblage.DIAGONALE) {
            return distance <= (this.portee+this.lanceur.porteeAttaque)*2;
        }
        return distance <= this.portee+this.lanceur.porteeAttaque;
    }

    lancerSort(cible) {
        if (this.coutPA <= this.lanceur.pa && this.estAPortee(cible)) {
            this.lanceur.pa -= this.coutPA;
            const degats = Math.max(this.degats + this.lanceur.attaque - cible.defense, 0);
            cible.pv = Math.max(cible.pv - degats, 0);
            LogMessage.logMessageCombat(`${this.lanceur.nom} lance ${this.nom} sur ${cible.nom} et inflige ${degats} points de dégâts.`);
        } else {
            LogMessage.logMessageErreur(`Impossible de lancer ${this.nom}. Pas assez de PA ou cible hors de portée.`);
        }
    }

    peutLancerSort() {
        return this.coutPA <= this.lanceur.pa;
    }
}