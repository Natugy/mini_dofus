import { LogMessage } from '../../affichage/LogMessage.js';
import { EffetEnum } from '../../enum/EffetEnum.js';
import { Effet } from './Effet.js';

export class Regen extends Effet {
	constructor(soin, duree) {
		super(soin, duree);
		this.nom = EffetEnum.REGEN;
	}

	appliqueEffet(cible) {
		super.appliqueEffet(cible);
		cible.pv += this.puissance;
		LogMessage.logMessageCombat(
			`${cible.nom} a regénéré ${this.puissance} de point de vie. Temps Restant : ${this.duree}`
		);
	}
}
