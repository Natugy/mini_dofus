import { LogMessage } from '../affichage/LogMessage.js';
import { Carte } from '../affichage/Carte.js';
import { GameData } from './GameData.js';
import { Monstre } from '../perso/Monstre.js';
import { Cellule } from '../affichage/Cellule.js';
import { Stats } from '../affichage/Stats.js';
import { XpBar } from '../affichage/XpBar.js';
import { SortList } from '../affichage/SortList.js';
import { TypeCiblage } from '../enum/TypeCiblage.js';
import { GameOver } from '../affichage/GameOver.js';

export class Game {
    constructor() {
        this.joueur = GameData.joueur;
        this.monstresEnJeu = GameData.monstresEnjeu;
        this.tour = GameData.tour;
        this.map = GameData.map;
        this.mouvJoueurActif = false;
        this.mapSize = 10;
        this.viseeSortActif = false;
        this.desactiverInterface = false;
    }

    initialiserGame() {
        this.joueur.ajoutSort(GameData.listeSorts[0]);
        this.joueur.ajoutSort(GameData.listeSorts[2]);
        this.monstresEnJeu.push(Object.assign(new Monstre(), GameData.listeMonstres[0]));
        this.resetCarte();
        LogMessage.logMessageInfo("Bienvenue dans le jeu!");
        this.mettreAJourInterface();
        
    }

    resetCarte() {
        for (let y = 0; y < this.mapSize; y++) {
            this.map[y] = [];
            for (let x = 0; x < this.mapSize; x++) {
                this.map[y][x] = new Cellule(x, y);
            }
        }
        this.map[this.joueur.y][this.joueur.x].estJoueur(this.joueur);
        this.map[this.joueur.y][this.joueur.x].addEventListener('click', () => this.activerMouvement());
        this.monstresEnJeu.forEach(monstre => {
            this.map[monstre.y][monstre.x].estMonstre(monstre);
            this.map[monstre.y][monstre.x].addEventListener('click', () => this.afficherInfosEnnemi(monstre));
        });

    }

    creationMonstre() {
        let newX, newY;
        const mapSize = this.mapSize;
        do {
            newX = Math.floor(Math.random() * mapSize);
            newY = Math.floor(Math.random() * mapSize);
        } while (!this.map[newY][newX].estLibre());
        const newMonstre = Object.assign(new Monstre(), GameData.listeMonstres[Math.floor(Math.random() * (Math.min(Math.floor(this.tour/3)+1,GameData.listeMonstres.length)))]);
        
        newMonstre.x = newX;
        newMonstre.y = newY;
        newMonstre.resetStats();
        this.monstresEnJeu.push(newMonstre);
        LogMessage.logMessageInfo(`${newMonstre.nom} apparaît en (${newMonstre.x}, ${newMonstre.y})!`);
        this.resetCarte();
        this.mettreAJourInterface();

    }

    mettreAJourInterface() {
        Carte.afficherCarte();
        Stats.afficherStats();
        XpBar.afficherXpBar();
        SortList.afficherSorts();
        GameData.listeSortsDebloquer.forEach(bouton => {
            bouton.addEventListener('click', () => this.afficherAttaque(bouton.sort));      
        });
        
    }

    afficherInfosEnnemi(ennemi) {
        LogMessage.logMessageInfo(`Nom: ${ennemi.nom} PV: ${ennemi.pv} Attaque: ${ennemi.attaque} Defense: ${ennemi.defense}`);
    }

    // Gestion des déplacements
    afficherDeplacement() {
        this.map.forEach(ligne => {
            ligne.forEach(cellule => {
                if (this.joueur.estAPorteeDeplacement(cellule) && cellule.estLibre()) {
                    cellule.afficherPorteeMouvement();
                    cellule.addEventListener('click', () => this.deplacerJoueur(cellule.x, cellule.y));
                }
            });
        });
    }

    activerMouvement() {
        this.mouvJoueurActif = !this.mouvJoueurActif;
        if (this.mouvJoueurActif && this.desactiverInterface === false) {
            this.afficherDeplacement();
        } else {
            this.resetCarte();
            this.mettreAJourInterface(); 
        }
    }

    deplacerJoueur(x, y) {
        const distance = Math.abs(x - this.joueur.x) + Math.abs(y - this.joueur.y);
        if(this.map[y][x].estLibre() === false){ 
            LogMessage.logMessageErreur("Vous ne pouvez pas vous déplacer sur la case de l'ennemi.");
        }
        else if (distance <= this.joueur.pm) {
            LogMessage.logMessageInfo(`Vous vous déplacez en (${x}, ${y})!`);
            this.joueur.deplacer(x, y);
            this.mouvJoueurActif = false;
            this.resetCarte();
            this.mettreAJourInterface();
            // mettreAJourStats();
        } 
    }

    // Gestion des attaques

    afficherAttaque(sort) {
        this.viseeSortActif = !this.viseeSortActif;
        this.resetCarte();
        this.mettreAJourInterface();
        if(this.viseeSortActif === true && this.desactiverInterface === false){
            if(sort.typeCiblage === TypeCiblage.CROIX){
                this.viseeSortCroix(sort);
            }
            else if(sort.typeCiblage === TypeCiblage.ZONE){
                this.viseeSortZone(sort);
            }
            else if(sort.typeCiblage === TypeCiblage.DIAGONALE){
                // viseeSortDiagonale(sort);
                this.viseeSortDiagonale(sort);
            }
        } 
        else {
            this.resetCarte();   
            this.mettreAJourInterface();
        }
    }

    lancerSort(sort, x, y) {
        const cible = this.map[y][x].contenu;
        if (cible != null) {
            sort.lancerSort(cible);
        }
        this.viseeSortActif = false;
        this.checkAction();
        this.resetCarte();
        this.mettreAJourInterface();
    }


    viseeSortCroix(sort){
        this.map[this.joueur.y][this.joueur.x].afficherPorteeSort();
        this.map[this.joueur.y][this.joueur.x].addEventListener('click', () => this.lancerSort(sort,this.joueur.x,this.joueur.y));
        for (let i = 0; i < this.mapSize; i++) {
            if(i !== this.joueur.x && i !== this.joueur.y){
                if (sort.estAPortee({x: this.joueur.x, y: i}) ) {
                    this.map[i][this.joueur.x].afficherPorteeSort();
                    this.map[i][this.joueur.x].addEventListener('click', () => this.lancerSort(sort,this.joueur.x,i));
                }
                if (sort.estAPortee({x: i, y: this.joueur.y} )) {
                    this.map[this.joueur.y][i].afficherPorteeSort();
                    this.map[this.joueur.y][i].addEventListener('click', () => this.lancerSort(sort,i,this.joueur.y));
                }
            }
        }
    }

    viseeSortZone(sort){
        for (let y = 0; y < this.mapSize; y++) {
            for (let x = 0; x < this.mapSize; x++) {
                if (sort.estAPortee({x, y})) {
                    this.map[y][x].afficherPorteeSort();
                    this.map[y][x].addEventListener('click', () => this.lancerSort(sort,x,y));
                }
            }
        }
    }

    viseeSortDiagonale(sort){
        const joueur = this.joueur;
        for (let i = 1; i < this.mapSize; i++) {
            if (this.checkCoordonnees( joueur.x + i, joueur.y + i)  && sort.estAPortee({x: joueur.x + i, y: joueur.y + i})) {
                this.map[joueur.y + i][joueur.x + i].afficherPorteeSort();
                this.map[joueur.y + i][joueur.x + i].addEventListener('click', () => this.lancerSort(sort,joueur.x + i,joueur.y + i));
            }
            if (this.checkCoordonnees(joueur.x - i, joueur.y + i) && sort.estAPortee({x: joueur.x - i, y: joueur.y + i})) {
                this.map[joueur.y + i][joueur.x - i].afficherPorteeSort();
                this.map[joueur.y + i][joueur.x - i].addEventListener('click', () => this.lancerSort(sort,joueur.x - i,joueur.y + i));
            }
            if (this.checkCoordonnees(joueur.x + i, joueur.y - i) &&sort.estAPortee({x: joueur.x + i, y: joueur.y - i})) {
                this.map[joueur.y - i][joueur.x + i].afficherPorteeSort();
                this.map[joueur.y - i][joueur.x + i].addEventListener('click', () => this.lancerSort(sort,joueur.x + i,joueur.y - i));
            }
            if (this.checkCoordonnees(joueur.x - i, joueur.y - i) &&sort.estAPortee({x: joueur.x - i, y: joueur.y - i})) {
                this.map[joueur.y - i][joueur.x - i].afficherPorteeSort();
                this.map[joueur.y - i][joueur.x - i].addEventListener('click', () => this.lancerSort(sort,joueur.x - i,joueur.y - i));
            }
        }
    }

    checkCoordonnees(x, y) {
        return x >= 0 && x < this.mapSize && y >= 0 && y < this.mapSize;
    }


    // Gestion des tours

    checkAction(){
        this.monstresEnJeu.forEach(monstre => {
            if (!monstre.estVivant()) {
                LogMessage.logMessageInfo(`${this.joueur.nom} a vaincu ${monstre.nom}!`);
                this.joueur.gagnerExperience(monstre.experienceDonnee);
                // Faire apparaître un nouveau monstre à une position aléatoire
            } 
        });
        this.monstresEnJeu = this.monstresEnJeu.filter(monstre => monstre.estVivant());
        if (this.monstresEnJeu.length === 0) {
            this.creationMonstre();
        }
        this.mettreAJourInterface();
    }

    async finDuTour() {
        this.joueur.finDuTour();
        this.desactiverInterface = true;
        this.tour++;
        GameData.tour = this.tour;
        await this.tourDuMonstre();
        if (this.tour % 2 === 0) {
            this.creationMonstre();
        }
        this.viseeSortActif = false;
        this.mouvJoueurActif = false
        this.desactiverInterface = false;
    }

    tourDuMonstre() {
        this.monstresEnJeu.forEach(async monstre => {
            while(monstre.jouerTour()){
                this.resetCarte();
                this.mettreAJourInterface();
                await this.wait(200);
            }
            monstre.finDuTour();
            if (!this.joueur.estVivant()) {
                GameOver.afficherGameOver();
            }
        });
        
    }

    wait(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
    // Gestion des victoires et des défaites

}