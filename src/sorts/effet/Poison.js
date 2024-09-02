import { LogMessage } from "../../affichage/LogMessage";
import { EffetEnum } from "../../enum/EffetEnum.js";
import { Effet } from "./Effet";

export class Poison extends Effet {
    constructor(degat,duree){
        super(degat,duree)
        this.nom = EffetEnum.POISON
    }

    appliqueEffet(cible){
        cible.pv-=this.puissance;
        this.duree--;
        LogMessage.logMessageCombat(`${cible.nom} a perdu ${this.puissance} à cause du poison. Temps Restant : ${this.duree}` )
    }

    copy(){
        return new Poison(this.puissance,this.duree)
    }
}