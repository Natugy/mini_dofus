import { EffetEnum } from '../enum/EffetEnum';
import { Poison } from '../sorts/effet/Poison';
import { Regen } from '../sorts/effet/Regen.js';

export class EffetFactory {
	static getEffet(typeEffet) {
		switch (typeEffet) {
			case EffetEnum.POISON:
				return new Poison(12, 3);

			case EffetEnum.REGEN:
				return new Regen(13, 3);

			default:
				break;
		}
	}
}
