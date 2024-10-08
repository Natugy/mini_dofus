import { LogMessage } from '../affichage/LogMessage';
import { Sort } from './Sort';
export class Soin extends Sort {
	constructor(nom, coutPA, portee, soin, effet, typeCiblage) {
		super(nom, coutPA, portee, 0, effet, typeCiblage);
		this.soin = soin;
	}

	lancerSort(cible) {
		if (this.coutPA <= this.lanceur.pa && this.estAPortee(cible)) {
			this.lanceur.pa -= this.coutPA;
			cible.pv = Math.min(cible.pv + this.soin, cible.pvMax);
			if (this.effet !== null)
				cible.recoitEffet(EffetFactory.getEffet(this.effet));
			LogMessage.logMessageCombat(
				`${this.lanceur.nom} lance ${this.nom} sur ${cible.nom} et lui rend ${this.soin} points de vie.`
			);
		} else {
			LogMessage.logMessageErreur(
				`Impossible de lancer ${this.nom}. Pas assez de PA ou cible hors de portée.`
			);
		}
	}
}
