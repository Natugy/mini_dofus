export class BoutonSort {
    constructor(sort) {
        this.sort = sort;
        this.htmlElement = document.createElement('button');
        this.htmlElement.className = 'action-button';
        this.htmlElement.innerHTML = sort.icon;
        this.htmlElement.setAttribute('data-name', `${sort.nom} (${sort.coutPA} PA)`);
    }

    addEventListener(event, callback) {
        this.htmlElement.addEventListener(event, callback);
    }

    resetBouton() {
        let info = `${this.sort.nom} (${this.sort.coutPA} PA) `;
        if(this.sort.effet !==null) info += `Effet : ${this.sort.effet}`
        this.htmlElement = document.createElement('button');
        this.htmlElement.className = 'action-button';
        this.htmlElement.innerHTML = this.sort.icon;
        this.htmlElement.setAttribute('data-name', info);
    }
}