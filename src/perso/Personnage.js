import { LogMessage } from "../affichage/LogMessage";

export class Personnage {
    constructor(nom, pv, attaque, defense, x, y, porteeAttaque, pm, pa) {
        this.nom = nom;
        this.pv = pv;
        this.pvMax = pv;
        this.attaque = attaque;
        this.defense = defense;
        this.x = x;
        this.y = y;
        this.porteeAttaque = porteeAttaque;
        this.pm = pm;
        this.pmMax = pm;
        this.pa = pa;
        this.paMax = pa;
    }

    attaquer(cible) {
        const degats = Math.max(this.attaque - cible.defense, 0);
        cible.pv = Math.max(cible.pv - degats, 0);
        LogMessage.logMessageCombat(`${this.nom} attaque ${cible.nom} et inflige ${degats} points de dégâts.`);
    }

    estVivant() {
        return this.pv > 0;
    }

    estAPorteeAttaque(cible) {
        const distance = Math.abs(this.x - cible.x) + Math.abs(this.y - cible.y);
        return distance <= this.porteeAttaque;
    }


    deplacer(newX, newY) {
        const distance = Math.abs(newX - this.x) + Math.abs(newY - this.y);
        if (this.pm >= distance) {
            this.x = newX;
            this.y = newY;
            this.pm-=distance;
            LogMessage.logMessageCombat(`${this.nom} se déplace en (${newX}, ${newY}). PM restants: ${this.pm}`);
        } else {
            LogMessage.logMessageErreur(`Pas assez de PM pour se déplacer.`);
        }
    }

    finDuTour() {
        this.pa = this.paMax;
        this.pm = this.pmMax;
        LogMessage.logMessageInfo(`Fin du tour de ${this.nom}. PA restaurés à ${this.pa}.`);
    }

    resetStats() {
        this.pv = this.pvMax;
        this.pa = this.paMax;
        this.pm = this.pmMax;
    }
}