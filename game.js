class Personnage {
    constructor(nom, pv, attaque, defense, x, y, porteeAttaque, pm, pa) {
        this.nom = nom;
        this.pv = pv;
        this.pvMax = pv;
        this.attaque = attaque;
        this.defense = defense;
        this.x = x;
        this.y = y;
        this.porteeAttaque = porteeAttaque;
        this.pm = pm;
        this.pmMax = pm;
        this.pa = pa;
        this.paMax = pa;
    }

    attaquer(cible) {
        const degats = Math.max(this.attaque - cible.defense, 0);
        cible.pv = Math.max(cible.pv - degats, 0);
        logMessageCombat(`${this.nom} attaque ${cible.nom} et inflige ${degats} points de dégâts.`);
    }

    estVivant() {
        return this.pv > 0;
    }

    estAPortee(cible) {
        const distance = Math.abs(this.x - cible.x) + Math.abs(this.y - cible.y);
        return distance <= this.porteeAttaque;
    }


    deplacer(newX, newY) {
        if (!GameData.caseOccupee(newX, newY)) {
            const distance = Math.abs(newX - this.x) + Math.abs(newY - this.y);
            if (this.pm >= distance) {
                this.x = newX;
                this.y = newY;
                this.pm-=distance;
                logMessageCombat(`${this.nom} se déplace en (${newX}, ${newY}). PM restants: ${this.pm}`);
            } else {
                logMessageErreur(`Pas assez de PM pour se déplacer.`);
            }
        }
        return GameData.caseOccupee(newX, newY);
    }

    finDuTour() {
        this.pa = this.paMax;
        this.pm = this.pmMax;
        logMessageInfo(`Fin du tour de ${this.nom}. PA restaurés à ${this.pa}.`);
    }

    resetStats() {
        this.pv = this.pvMax;
        this.pa = this.paMax;
        this.pm = this.pmMax;
    }
}

class Joueur extends Personnage {
    constructor(nom, pv, attaque, defense, x, y, porteeAttaque) {
        super(nom, pv, attaque, defense, x, y, porteeAttaque,3);
        this.experience = 0;
        this.niveau = 1;
        this.paMax = 6;
        this.pa = this.paMax;
        this.sorts = [];
        this.ajoutSort(listeSorts[0]);
    }

    ratioExperience() {
        return this.experience / (this.niveau * 100);
    }

    gagnerExperience(exp) {
        this.experience += exp;
        logMessageInfo(`${this.nom} gagne ${exp} points d'expérience.`);
        while (this.experience >= this.niveau * 100) {
            this.monterDeNiveau();
        }
    }

    estAPorteeDeplacement(cible) {
        const distance = Math.abs(this.x - cible.x) + Math.abs(this.y - cible.y);
        return distance <= this.pm && distance > 0;
    }

    ajoutSort(sort) {
        sort.lanceur = this;
        this.sorts.push(sort);
    }

    monterDeNiveau() {
        this.niveau++;
        this.pvMax += 10;
        this.pv = this.pvMax;
        this.attaque += 2;
        this.defense += 1;
        this.experience = Math.max(this.experience-this.niveau * 100,0);
        
        if (this.niveau % 3 === 0) {
            this.pmMax++;
        }
        if (this.niveau % 5 === 0) {
            this.paMax++;
        }
        if (this.niveau <= listeSorts.length) this.ajoutSort(listeSorts[this.niveau - 1]);
        logMessageInfo(`${this.nom} passe au niveau ${this.niveau}!`);
    }


    finDuTour() {
        this.pa = this.paMax;
        this.pm = this.pmMax;
        logMessageInfo(`Fin du tour de ${this.nom}. PA restaurés à ${this.pa}.`);
    }
}

class Monstre extends Personnage {
    constructor(nom, pv, attaque, defense, x, y, porteeAttaque, experienceDonnee,boss=false) {
        super(nom, pv, attaque, defense, x, y, porteeAttaque,3,3);
        this.experienceDonnee = experienceDonnee;
        this.sort = new Sort("Coup de griffe", 2, 1, 10,this);
        this.boss = boss;
    }

    async jouerTour() {
        while (this.pa > 0 && this.pm > 0 && joueur.estVivant()) {
            if (this.estAPortee(joueur)) {
                this.attaquer(joueur);
                this.pa-=2;
            } else {
                this.deplacerVersJoueur();
                mettreAJourCarte();
            }
            mettreAJourStats();
           await wait(200);
        }
        this.finDuTour();
    }

    deplacerVersJoueur() {
        const dx = Math.sign(joueur.x - this.x);
        const dy = Math.sign(joueur.y - this.y);
        console.log(dx,dy);
        
        if (Math.abs(joueur.x - this.x) > Math.abs(joueur.y - this.y)) {
            if (!GameData.caseOccupee(this.x + dx, this.y)) {
                this.deplacer(this.x + dx, this.y);
            } else if (!GameData.caseOccupee(this.x, this.y + dy)) {
                this.deplacer(this.x, this.y + dy);
            }
        } else {
            if (!GameData.caseOccupee(this.x, this.y + dy)) {
                this.deplacer(this.x, this.y + dy);
            } else if (!GameData.caseOccupee(this.x + dx, this.y)) {
                this.deplacer(this.x + dx, this.y);
            }
        }
    }
}

class Sort {
    constructor(nom, coutPA, portee, degats, typeCiblage=TypeCiblage.ZONE,lanceur) {
        this.nom = nom;
        this.coutPA = coutPA;
        this.portee = portee;
        this.degats = degats;
        this.lanceur = lanceur;
        this.icon = '🔮';
        this.typeCiblage = typeCiblage;
    }

    estAPortee(cible) {
        const distance = Math.abs(this.lanceur.x - cible.x) + Math.abs(this.lanceur.y - cible.y);
        return distance <= this.portee;
    }

    lancerSort(cible) {
        if (this.coutPA <= this.lanceur.pa && this.estAPortee(cible)) {
            this.lanceur.pa -= this.coutPA;
            const degats = Math.max(this.degats + this.lanceur.attaque - cible.defense, 0);
            cible.pv = Math.max(cible.pv - degats, 0);
            logMessageCombat(`${this.lanceur.nom} lance ${this.nom} sur ${cible.nom} et inflige ${degats} points de dégâts.`);
        } else {
            logMessageErreur(`Impossible de lancer ${this.nom}. Pas assez de PA ou cible hors de portée.`);
        }
    }

    peutLancerSort() {
        return this.coutPA <= this.lanceur.pa;
    }
}

class Soin extends Sort {
    constructor(lanceur,nom, coutPA, portee, soin) {
        super(lanceur,nom, coutPA, portee);
        this.soin = soin;
    }

    lancerSort(cible) {
        if (this.coutPA <= this.lanceur.pa && this.lanceur.estAPortee(cible)) {
            this.lanceur.pa -= this.coutPA;
            cible.pv = Math.min(cible.pv + this.soin, cible.pvMax);
            logMessageCombat(`${this.lanceur.nom} lance ${this.nom} sur ${cible.nom} et lui rend ${this.soin} points de vie.`);
        } else {
            logMessageErreur(`Impossible de lancer ${this.nom}. Pas assez de PA ou cible hors de portée.`);
        }
    }
}

class Bouclier extends Sort {
    constructor(lanceur,nom, coutPA, portee, defense) {
        super(lanceur,nom, coutPA, portee);
        this.defense = defense;
    }

    lancerSort() {
        if (this.coutPA <= this.lanceur.pa) {
            this.lanceur.pa -= this.coutPA;
            this.lanceur.defense += this.defense;
            logMessageCombat(`${this.lanceur.nom} lance ${this.nom} et gagne ${this.defense} points de défense.`);
        } else {
            logMessageErreur(`Impossible de lancer ${this.nom}. Pas assez de PA.`);
        }
    }
}

class TypeCiblage {
    static CROIX = "CROIX";
    static DIAGONALE = "DIAGONALE";
    static ZONE = "ZONE";
}
class GameData {

    static map = [];
    
    static listeMonstres = [new Monstre("Gobelin", 50, 10, 2, 9, 9, 2, 1000),
        new Monstre("Squelette", 75, 15, 3, 9, 0, 2, 75),
        new Monstre("Orc", 100, 20, 5, 9, 0, 2, 100),
        new Monstre("Troll", 150, 25, 7, 9, 0, 2, 150, true),
        new Monstre("Dragon", 200, 30, 10, 0, 0, 3, 200, true)];

    static listeSorts = [new Sort("Annihilastion", 2, 15, 1000, TypeCiblage.ZONE),
        new Sort("Eclair", 2, 1, 10,TypeCiblage.DIAGONALE),
        new Soin("Soin", 2, 1, 10, 10,TypeCiblage.ZONE),
        new Bouclier("Bouclier", 2, 1, 10, 5,TypeCiblage.ZONE),
        new Sort("Boule de feu", 4, 3, 20,TypeCiblage.CROIX), 
        new Sort("Météore", 6, 4, 30,TypeCiblage.ZONE),
        new Sort("Tornade", 8, 5, 40,TypeCiblage.ZONE),
        new Sort("Tempête de feu", 10, 6, 50,TypeCiblage.ZONE), 
        new Sort("Pluie de météores", 12, 7, 60,TypeCiblage.ZONE)];

    
    static monstresEnJeu = [];
    static caseOccupee(x, y) {
        let res = false;
        if (joueur.x === x && joueur.y === y) {
            res = true;
        }
        monstresEnJeu.forEach(monstre => {
            if (monstre.x === x && monstre.y === y) {
                res = true;
            }
        });
        return res;
    }
}

// Variables globales

let joueur, sort;
let tour = 1;
let visee = false;
let gameOver = false;
let peutInteragir = true;
const mapSize = 10;
const map = GameData.map;
const listeMonstres = GameData.listeMonstres;
const listeSorts = GameData.listeSorts;
let monstresEnJeu = GameData.monstresEnJeu;

// initialisation du jeu
function initialiserJeu() {
    joueur = new Joueur("Héros", 100, 10, 5, 4, 4, 3);
    monstresEnJeu.push(new Monstre("Gobelin", 50, 10, 2, 6, 6, 2, 50));
    creerCarte();
    mettreAJourStats();
    logMessageInfo("Le jeu commence ! Un Gobelin apparaît au coin opposé de la carte !");
}

function wait(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// initalisation de la carte
function creerCarte() {
    const mapContainer = document.getElementById('map-container');
    mapContainer.innerHTML = '';
    for (let y = 0; y < mapSize; y++) {
        map[y] = [];
        for (let x = 0; x < mapSize; x++) {
            const cell = document.createElement('div');
            cell.className = 'cell';
            cell.dataset.x = x;
            cell.dataset.y = y;
            // cell.addEventListener('click', () => deplacerJoueur(x, y));
            mapContainer.appendChild(cell);
            map[y][x] = cell;
        }
    }
    mettreAJourCarte();
}

function mettreAJourCarte() {
    const mapContainer = document.getElementById('map-container');
    mapContainer.innerHTML = '';
    for (let y = 0; y < mapSize; y++) {
        for (let x = 0; x < mapSize; x++) {
            const cell = document.createElement('div');
            cell.className = 'cell';
            cell.dataset.x = x;
            cell.dataset.y = y;
            mapContainer.appendChild(cell);
            map[y][x] = cell;
            
        }
    }
    map[joueur.y][joueur.x].className = 'cell player';
    map[joueur.y][joueur.x].textContent = 'J';
    if (peutInteragir) map[joueur.y][joueur.x].addEventListener('click', activerMouvJoueur);
    monstresEnJeu.forEach(monstre => {
        if (monstre.estVivant()) {
            map[monstre.y][monstre.x].className = 'cell monster';
            if(monstre.boss){ 
                map[monstre.y][monstre.x].textContent = 'B';
                map[monstre.y][monstre.x].className+=' boss';
            }
            map[monstre.y][monstre.x].textContent = 'M';
            map[monstre.y][monstre.x].setAttribute('data-name', `${monstre.nom} (${monstre.pv} PV)`);
            if (!visee ) map[monstre.y][monstre.x].addEventListener('click', () => logMessageInfo(`Monstre: ${monstre.nom} (${monstre.pv} PV)`));
        }
    });
    
}

function deplacerJoueur(x, y) {
    const distance = Math.abs(x - joueur.x) + Math.abs(y - joueur.y);
    if(caseOccupee(x,y)){ 
        logMessageErreur("Vous ne pouvez pas vous déplacer sur la case de l'ennemi.");
    }
    else if (distance <= joueur.pm) {
        joueur.deplacer(x, y);
        mettreAJourCarte();
        mettreAJourStats();
    } 
}


function activerMouvJoueur(){
    for (let y = 0; y < mapSize; y++) {
        for (let x = 0; x < mapSize; x++) {
            if (joueur.estAPorteeDeplacement({x, y})) {
                map[y][x].classList.add('in-move-range');
                map[y][x].addEventListener('click', () => deplacerJoueur(x, y));
            }
        }
    }
}

function checkCoordonnees(x,y){
    logMessageInfo(x + " " + y);
    return x >= 0 && x < mapSize && y >= 0 && y < mapSize;
}


// Fonctions de visée

function viseeSortCroix(sort){
    for (let i = 0; i < mapSize; i++) {
        if (sort.estAPortee({x: joueur.x, y: i})) {
            map[i][joueur.x].classList.add('in-range');
            map[i][joueur.x].addEventListener('click', () => lancerSort(sort,joueur.x,i));
        }
        if (sort.estAPortee({x: i, y: joueur.y})) {
            map[joueur.y][i].classList.add('in-range');
            map[joueur.y][i].addEventListener('click', () => lancerSort(sort,i,joueur.y));
        }
    }
}



function viseeSortDiagonale(sort){
    for (let i = 0; i < mapSize; i++) {
        if (checkCoordonnees( joueur.x + i, joueur.y + i)  && sort.estAPortee({x: joueur.x + i, y: joueur.y + i})) {
            map[joueur.y + i][joueur.x + i].classList.add('in-range');
            map[joueur.y + i][joueur.x + i].addEventListener('click', () => lancerSort(sort,joueur.x + i,joueur.y + i));
        }
        if (checkCoordonnees(joueur.x - i, joueur.y + i) && sort.estAPortee({x: joueur.x - i, y: joueur.y + i})) {
            map[joueur.y + i][joueur.x - i].classList.add('in-range');
            map[joueur.y + i][joueur.x - i].addEventListener('click', () => lancerSort(sort,joueur.x - i,joueur.y + i));
        }
        if (checkCoordonnees(joueur.x + i, joueur.y - i) &&sort.estAPortee({x: joueur.x + i, y: joueur.y - i})) {
            map[joueur.y - i][joueur.x + i].classList.add('in-range');
            map[joueur.y - i][joueur.x + i].addEventListener('click', () => lancerSort(sort,joueur.x + i,joueur.y - i));
        }
        if (checkCoordonnees(joueur.x - i, joueur.y - i) &&sort.estAPortee({x: joueur.x - i, y: joueur.y - i})) {
            map[joueur.y - i][joueur.x - i].classList.add('in-range');
            map[joueur.y - i][joueur.x - i].addEventListener('click', () => lancerSort(sort,joueur.x - i,joueur.y - i));
        }
    }
}

function viseeSortZone(sort){
    for (let y = 0; y < mapSize; y++) {
        for (let x = 0; x < mapSize; x++) {
            if (sort.estAPortee({x, y})) {
                map[y][x].classList.add('in-range');
                map[y][x].addEventListener('click', () => lancerSort(sort,x,y));
            }
        }
    }
}


function activerViseeSort(sort){
    visee = !visee;
    mettreAJourCarte();
    if(visee === true){
        if(sort.typeCiblage === TypeCiblage.CROIX){
            viseeSortCroix(sort);
        }
        else if(sort.typeCiblage === TypeCiblage.ZONE){
            viseeSortZone(sort);
        }
        else if(sort.typeCiblage === TypeCiblage.DIAGONALE){
            viseeSortDiagonale(sort);
        }
    } 
    else {
        mettreAJourCarte();
    }
}


function lancerSort(sort,x,y) {
    let cible = recupererPersonnage(x, y);
    if (cible != undefined) {
        sort.lancerSort(cible);
    }
    else {
        logMessageErreur("Cible invalide.");
    }
    visee = false;
    finDuCombat();
    mettreAJourCarte();
    mettreAJourStats();
}

function recupererPersonnage(x, y) {
    if (joueur.x === x && joueur.y === y) {
        return joueur;
    }
    return monstresEnJeu.find(monstre => monstre.x === x && monstre.y === y);
}

// Fonctions d'affichage
function afficherSorts() {
    const actionRow1 = document.getElementById('actionRow1');
    const actionRow2 = document.getElementById('actionRow2');
    actionRow1.innerHTML = '';
    actionRow2.innerHTML = '';
    joueur.sorts.forEach((sort, index) => {
        const button = creerBoutonSort(sort);
        if (index < 6) {
            actionRow1.appendChild(button);
        } else {
            actionRow2.appendChild(button);
        }
    });
}

function creerBoutonSort(sort) {
    const button = document.createElement('button');
    button.className = 'action-button';
    button.innerHTML = sort.icon;
    button.setAttribute('data-name', sort.nom);
    button.onclick = () => activerViseeSort(sort);
    return button;
}

function updateXPBar(xpPercentage, level) {
    const xpProgress = document.querySelector('.xp-progress');
    const xpText = document.querySelector('.xp-text');
    xpProgress.style.width = `${xpPercentage}%`;
    xpText.textContent = `${xpPercentage}% - Niveau ${level}`;
}

function mettreAJourStats() {
    document.getElementById('player-hp').textContent = `${joueur.pv}/${joueur.pvMax}`;
    document.getElementById('player-pa').textContent = `${joueur.pa}/${joueur.paMax}`;
    document.getElementById('player-pm').textContent = `${joueur.pm}/${joueur.pmMax}`;
    document.getElementById('player-def').textContent = joueur.defense;
    updateXPBar(joueur.experience / (joueur.niveau * 100) * 100, joueur.niveau);
    afficherSorts();
}

// Fonctions de log
function logMessage(message,couleur) {
    if (gameOver) {
        return;
    }
    const gameLog = document.getElementById('game-log');

    gameLog.innerHTML += `<p class="${couleur}">Tour ${tour}: ${message}</p>`;
    gameLog.scrollTop = gameLog.scrollHeight;
}

function logMessageCombat(message) {
    logMessage(message, 'green');
}

function logMessageErreur(message) {
    logMessage(message, 'red');
}

function logMessageInfo(message) {
    logMessage(message, 'blue');
}

function finDuCombat() {
    if (!joueur.estVivant()) {
        gameOver = true;
        logMessageInfo(`${joueur.nom} a été vaincu... Game Over!`);
        gameOverScreen();
    }
    monstresEnJeu.forEach(monstre => {
        if (!monstre.estVivant()) {
            logMessageInfo(`${joueur.nom} a vaincu ${monstre.nom}!`);
            joueur.gagnerExperience(monstre.experienceDonnee);
            // Faire apparaître un nouveau monstre à une position aléatoire
        } 
    });
    monstresEnJeu = monstresEnJeu.filter(monstre => monstre.estVivant());
    mettreAJourCarte();
    mettreAJourStats();
    if (monstresEnJeu.length === 0) {
        creationMonstre();
        creationMonstre();
    }
}

function gameOverScreen() {
    
        const gameOverScreen = document.getElementById('game-over-screen');
        gameOverScreen.style.display = 'block';
        gameOverScreen.innerHTML = '';
        const gameOverMessage = document.createElement('h2');
        gameOverMessage.textContent = 'Game Over!';
        gameOverScreen.appendChild(gameOverMessage);
        const newGameButton = document.createElement('button');
        newGameButton.textContent = 'Nouvelle partie';
        newGameButton.onclick = () => location.reload();
        gameOverScreen.appendChild(newGameButton);
        const gameContainer = document.getElementById('game-container');
        gameContainer.style.display = 'none';

    
}

function creationMonstre() {
    let newX, newY;
    do {
        newX = Math.floor(Math.random() * mapSize);
        newY = Math.floor(Math.random() * mapSize);
    } while (newX === joueur.x && newY === joueur.y);
    monstre = listeMonstres[Math.floor(Math.random() * listeMonstres.length)];
    monstre.x = newX;
    monstre.y = newY;
    monstre.resetStats();
    monstresEnJeu.push(monstre);
    logMessageInfo(`${monstre.nom} apparaît en (${monstre.x}, ${monstre.y})!`);
    mettreAJourCarte();
    mettreAJourStats();
}

function caseOccupee(x, y) {
    let res = false;
    if (joueur.x === x && joueur.y === y) {
        res = true;
    }
    monstresEnJeu.forEach(monstre => {
        if (monstre.x === x && monstre.y === y) {
            res = true;
        }
    });
    return res;
}

function finDuTourJoueur() {
    joueur.finDuTour();
    tourDuMonstre();
    finDuCombat();
    if (gameOver) {
        return;
    }
    if (tour % 3 === 0) {
        creationMonstre();
    }
    mettreAJourStats();
    mettreAJourCarte();
    console.log("fin du tour du monstre");
    tour++;
}

function desactiverActions() {
    const actionButtons = document.querySelectorAll('.action-button');
    actionButtons.forEach(button => {
        button.onclick = null;
    });
    peutInteragir = false;
}

function activerActions() {
    const actionButtons = document.querySelectorAll('.action-button');
    actionButtons.forEach((button, index) => {
        button.onclick = () => activerViseeSort(joueur.sorts[index]);
    });
    peutInteragir = true;
}

function tourDuMonstre() {
    monstresEnJeu.forEach(monstre => {
        if (monstre.estVivant()) {
            monstre.jouerTour();
            if (!joueur.estVivant()) {
                finDuCombat();
            }
        }
    });
    
    
}

// Initialisation du jeu
initialiserJeu();
// Événements des boutons

document.getElementById('end-turn-btn').addEventListener('click', finDuTourJoueur);