export class Effet {
	constructor(puissance, duree) {
		this.puissance = puissance;
		this.duree = duree;
		this.nom = 'Effet';
	}

	appliqueEffet(cible) {
		this.duree--;
	}

	estActif() {
		return this.duree > 0;
	}
}
