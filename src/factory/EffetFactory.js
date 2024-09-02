import { EffetEnum } from "../enum/EffetEnum";
import { Poison } from "../sorts/effet/Poison";

export class EffetFactory {
    static getEffet(typeEffet){
        switch (typeEffet) {
            case EffetEnum.POISON:
                return new Poison(12,3);
                break;
        
            default:
                break;
        }
    }
}