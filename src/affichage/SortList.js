import { BoutonSort } from "./BoutonSort";
import { GameData } from "../utils/GameData";

export class SortList {
    static afficherSorts() {
        const listBoutonSorts = GameData.listeSortsDebloquer;
        
        const actionRow1 = document.getElementById('actionRow1');
        const actionRow2 = document.getElementById('actionRow2');
        actionRow1.innerHTML = '';
        actionRow2.innerHTML = '';
        listBoutonSorts.forEach((bouton, index) => {
            bouton.resetBouton();
            if (index < 6) {
                actionRow1.appendChild(bouton.htmlElement);
            } else {
                actionRow2.appendChild(bouton.htmlElement);
            }
        });
    }

    
}