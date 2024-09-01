export class Cellule {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.contenu = null;
        this.htmlElement = document.createElement('div');
        this.htmlElement.className = 'cell';
        this.htmlElement.dataset.x = x;
        this.htmlElement.dataset.y = y;
    }

    resetCell() {
        this.htmlElement = document.createElement('div');
        this.htmlElement.className = 'cell';
        this.htmlElement.dataset.x = this.x;
        this.htmlElement.dataset.y = this.y;
    }

    resetEvents() {
        this.htmlElement.removeEventListener('click', () => {});
    }

    addEventListener(event, callback) {
        this.htmlElement.addEventListener(event, callback);
    }

    afficherPorteeMouvement(){
        this.htmlElement.classList.add('in-move-range');
    }

    afficherPorteeSort(){
        this.htmlElement.classList.add('in-range');
    }


    estJoueur(joueur){
        this.htmlElement.classList.add('player');
        this.htmlElement.textContent = 'J';
        this.contenu = joueur;
    }

    estMonstre(monstre){
        this.htmlElement.classList.add('monster');
        this.htmlElement.textContent = 'M';
        this.contenu = monstre;
    }

    estLibre(){
        if(this.htmlElement.classList.contains('player')){
            return false;
        }
        if(this.htmlElement.classList.contains('monster')){
            return false;
        }
        return true;
    }
}