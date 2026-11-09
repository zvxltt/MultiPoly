/* MultiPoly v2 — univers (généré). Chaque univers = un plateau de 40 cases, ses pions,
   ses couleurs et ses paquets de cartes. */
(function(){
const MP = (globalThis.MP = globalThis.MP || {});
MP.THEME_ORDER = ["football","world","france","pirates","cinema","jeuxvideo","space","fair","cuisine"];
MP.THEMES = {
 "football": {
  "id": "football",
  "label": "Football",
  "icon": "⚽",
  "tagline": "Achetez, vendez, dominez le mercato — entre amis, où que vous soyez.",
  "tokens": [
   {
    "e": "⚽",
    "c": "#2f8fd1",
    "name": "Ballon"
   },
   {
    "e": "🧤",
    "c": "#c0392b",
    "name": "Gant"
   },
   {
    "e": "👟",
    "c": "#9c8465",
    "name": "Crampon"
   },
   {
    "e": "🏆",
    "c": "#f1c40f",
    "name": "Trophée"
   },
   {
    "e": "🎽",
    "c": "#6c5ce7",
    "name": "Maillot"
   },
   {
    "e": "🥅",
    "c": "#2f9e44",
    "name": "Cage"
   }
  ],
  "groupColors": [
   "#9c8465",
   "#e8842e",
   "#2f9e44",
   "#2f8fd1",
   "#c0392b",
   "#f1c40f",
   "#6c5ce7",
   "#1f2a52"
  ],
  "groupLabels": {
   "g0": "Clubs Promus",
   "g1": "Eredivisie",
   "g2": "Liga Portugal",
   "g3": "Serie A",
   "g4": "Bundesliga",
   "g5": "La Liga",
   "g6": "Premier League",
   "g7": "Élite Mondiale"
  },
  "minorName": "Carton",
  "majorName": "Transf.",
  "minorCards": [
   {
    "text": "Vous recevez une prime de performance.",
    "money": 50
   },
   {
    "text": "Un sponsor vous félicite pour la victoire.",
    "money": 75
   },
   {
    "text": "Billetterie exceptionnelle ce week-end.",
    "money": 60
   },
   {
    "text": "Frais de déplacement pour un match à l'extérieur.",
    "money": -40
   },
   {
    "text": "Amende pour retard à l'entraînement.",
    "money": -30
   },
   {
    "text": "Vente de maillots dédicacés.",
    "money": 45
   },
   {
    "text": "Avancez jusqu'à DÉPART et récupérez 200.",
    "money": 0,
    "moveTo": 0
   },
   {
    "text": "Frais de kinésithérapie pour un joueur blessé.",
    "money": -50
   }
  ],
  "majorCards": [
   {
    "text": "Un agent véreux détourne des fonds du club !",
    "money": -75
   },
   {
    "text": "Vous vendez un jeune talent de la réserve.",
    "money": 40
   },
   {
    "text": "Bourse de la Fédération pour la formation.",
    "money": 100
   },
   {
    "text": "Réparation de la pelouse après les intempéries.",
    "money": -25
   },
   {
    "text": "Vous remportez la Coupe locale !",
    "money": 90
   },
   {
    "text": "Amende de l'UEFA pour fair-play financier.",
    "money": -60
   },
   {
    "text": "Un mécène investit dans le club.",
    "money": 45
   },
   {
    "text": "Carton rouge direct : direction les vestiaires.",
    "money": 0,
    "goToJail": true
   }
  ],
  "board": [
   {
    "name": "DÉPART",
    "short": "DÉPART",
    "type": "go"
   },
   {
    "name": "Le Havre",
    "short": "Le Havre",
    "type": "property",
    "group": "g0",
    "price": 60
   },
   {
    "name": "Carton",
    "short": "Carton",
    "type": "minor"
   },
   {
    "name": "Clermont",
    "short": "Clermont",
    "type": "property",
    "group": "g0",
    "price": 60
   },
   {
    "name": "Taxe",
    "short": "Taxe",
    "type": "tax",
    "amount": 200
   },
   {
    "name": "Stade",
    "short": "Stade",
    "type": "station",
    "price": 200
   },
   {
    "name": "Ajax",
    "short": "Ajax",
    "type": "property",
    "group": "g1",
    "price": 100
   },
   {
    "name": "Carton",
    "short": "Carton",
    "type": "minor"
   },
   {
    "name": "PSV",
    "short": "PSV",
    "type": "property",
    "group": "g1",
    "price": 100
   },
   {
    "name": "Feyen",
    "short": "Feyen",
    "type": "property",
    "group": "g1",
    "price": 120
   },
   {
    "name": "PRISON",
    "short": "PRISON",
    "type": "jail"
   },
   {
    "name": "Sporting",
    "short": "Sporting",
    "type": "property",
    "group": "g2",
    "price": 140
   },
   {
    "name": "Diffuseur",
    "short": "Diffus.",
    "type": "utility",
    "price": 150
   },
   {
    "name": "Porto",
    "short": "Porto",
    "type": "property",
    "group": "g2",
    "price": 140
   },
   {
    "name": "Benfica",
    "short": "Benfica",
    "type": "property",
    "group": "g2",
    "price": 160
   },
   {
    "name": "Wembley",
    "short": "Wembley",
    "type": "station",
    "price": 200
   },
   {
    "name": "AC Milan",
    "short": "AC Milan",
    "type": "property",
    "group": "g3",
    "price": 180
   },
   {
    "name": "Transf.",
    "short": "Transf.",
    "type": "major"
   },
   {
    "name": "Inter",
    "short": "Inter",
    "type": "property",
    "group": "g3",
    "price": 180
   },
   {
    "name": "Juve",
    "short": "Juve",
    "type": "property",
    "group": "g3",
    "price": 200
   },
   {
    "name": "MI-TEMPS",
    "short": "MI-TEMPS",
    "type": "parking"
   },
   {
    "name": "BVB",
    "short": "BVB",
    "type": "property",
    "group": "g4",
    "price": 220
   },
   {
    "name": "Carton",
    "short": "Carton",
    "type": "minor"
   },
   {
    "name": "Leipzig",
    "short": "Leipzig",
    "type": "property",
    "group": "g4",
    "price": 220
   },
   {
    "name": "Bayern",
    "short": "Bayern",
    "type": "property",
    "group": "g4",
    "price": 240
   },
   {
    "name": "Camp Nou",
    "short": "Camp Nou",
    "type": "station",
    "price": 200
   },
   {
    "name": "Atléti",
    "short": "Atléti",
    "type": "property",
    "group": "g5",
    "price": 260
   },
   {
    "name": "Barça",
    "short": "Barça",
    "type": "property",
    "group": "g5",
    "price": 260
   },
   {
    "name": "Sponsor",
    "short": "Sponsor",
    "type": "utility",
    "price": 150
   },
   {
    "name": "R. Madrid",
    "short": "R. Madrid",
    "type": "property",
    "group": "g5",
    "price": 280
   },
   {
    "name": "EXPULSÉ",
    "short": "EXPULSÉ",
    "type": "gotojail"
   },
   {
    "name": "Chelsea",
    "short": "Chelsea",
    "type": "property",
    "group": "g6",
    "price": 300
   },
   {
    "name": "Arsenal",
    "short": "Arsenal",
    "type": "property",
    "group": "g6",
    "price": 300
   },
   {
    "name": "Transf.",
    "short": "Transf.",
    "type": "major"
   },
   {
    "name": "LFC",
    "short": "LFC",
    "type": "property",
    "group": "g6",
    "price": 320
   },
   {
    "name": "San Siro",
    "short": "San Siro",
    "type": "station",
    "price": 200
   },
   {
    "name": "Carton",
    "short": "Carton",
    "type": "minor"
   },
   {
    "name": "Amende",
    "short": "Amende",
    "type": "tax",
    "amount": 100
   },
   {
    "name": "PSG",
    "short": "PSG",
    "type": "property",
    "group": "g7",
    "price": 350
   },
   {
    "name": "MCFC",
    "short": "MCFC",
    "type": "property",
    "group": "g7",
    "price": 400
   }
  ],
  "ui": {
   "accent": "#f2c230",
   "accent2": "#8a6b0a",
   "bg": "#0c2616",
   "felt": "#123a22"
  },
  "icons": {
   "station": "🏟️",
   "utility": "📺",
   "minor": "🟨",
   "major": "🔁",
   "tax": "💸",
   "go": "▶️",
   "jail": "🚫",
   "parking": "☕",
   "gotojail": "🟥"
  },
  "words": {
   "station": "stade",
   "utility": "média"
  }
 },
 "world": {
  "id": "world",
  "label": "Monde",
  "icon": "🌍",
  "tagline": "Traversez les continents et bâtissez votre empire de voyage.",
  "tokens": [
   {
    "e": "🌍",
    "c": "#3d9dbf",
    "name": "Globe"
   },
   {
    "e": "✈️",
    "c": "#5b7fd1",
    "name": "Avion"
   },
   {
    "e": "🎒",
    "c": "#5fae6b",
    "name": "Sac à dos"
   },
   {
    "e": "📷",
    "c": "#c9a63c",
    "name": "Appareil photo"
   },
   {
    "e": "🧳",
    "c": "#a97c50",
    "name": "Valise"
   },
   {
    "e": "🗺️",
    "c": "#9b6bc9",
    "name": "Carte"
   }
  ],
  "groupColors": [
   "#a97c50",
   "#e08283",
   "#dba13d",
   "#5fae6b",
   "#3d9dbf",
   "#5b7fd1",
   "#9b6bc9",
   "#c9a63c"
  ],
  "groupLabels": {
   "g0": "Afrique du Nord",
   "g1": "Afrique",
   "g2": "Asie du Sud-Est",
   "g3": "Amérique Latine",
   "g4": "Moyen-Orient",
   "g5": "Europe",
   "g6": "Asie-Pacifique",
   "g7": "Mégapoles"
  },
  "minorName": "Visa",
  "majorName": "Voyage",
  "minorCards": [
   {
    "text": "Vous obtenez un visa touristique gratuit.",
    "money": 50
   },
   {
    "text": "Un ami local vous héberge pendant votre voyage.",
    "money": 40
   },
   {
    "text": "Vous trouvez un vol pas cher au dernier moment.",
    "money": 60
   },
   {
    "text": "Bagages perdus à l'aéroport.",
    "money": -40
   },
   {
    "text": "Amende pour photo interdite dans un lieu sacré.",
    "money": -30
   },
   {
    "text": "Vous revendez des souvenirs locaux.",
    "money": 45
   },
   {
    "text": "Avancez jusqu'à DÉPART et récupérez 200.",
    "money": 0,
    "moveTo": 0
   },
   {
    "text": "Vaccins obligatoires avant le départ.",
    "money": -50
   }
  ],
  "majorCards": [
   {
    "text": "Un guide malhonnête vous escroque !",
    "money": -75
   },
   {
    "text": "Vous vendez vos photos de voyage à un magazine.",
    "money": 40
   },
   {
    "text": "Bourse pour un échange culturel.",
    "money": 100
   },
   {
    "text": "Réparation de votre valise cassée.",
    "money": -25
   },
   {
    "text": "Vous gagnez un concours de blog voyage !",
    "money": 90
   },
   {
    "text": "Amende douanière pour marchandise non déclarée.",
    "money": -60
   },
   {
    "text": "Un mécène finance votre prochain voyage.",
    "money": 45
   },
   {
    "text": "Contrôle surprise : direction la douane.",
    "money": 0,
    "goToJail": true
   }
  ],
  "board": [
   {
    "name": "DÉPART",
    "short": "DÉPART",
    "type": "go"
   },
   {
    "name": "Rabat",
    "short": "Rabat",
    "type": "property",
    "group": "g0",
    "price": 60
   },
   {
    "name": "Visa",
    "short": "Visa",
    "type": "minor"
   },
   {
    "name": "Dakar",
    "short": "Dakar",
    "type": "property",
    "group": "g0",
    "price": 60
   },
   {
    "name": "Taxe",
    "short": "Taxe",
    "type": "tax",
    "amount": 200
   },
   {
    "name": "CDG",
    "short": "CDG",
    "type": "station",
    "price": 200
   },
   {
    "name": "Le Caire",
    "short": "Le Caire",
    "type": "property",
    "group": "g1",
    "price": 100
   },
   {
    "name": "Visa",
    "short": "Visa",
    "type": "minor"
   },
   {
    "name": "Nairobi",
    "short": "Nairobi",
    "type": "property",
    "group": "g1",
    "price": 100
   },
   {
    "name": "Lagos",
    "short": "Lagos",
    "type": "property",
    "group": "g1",
    "price": 120
   },
   {
    "name": "DOUANE",
    "short": "DOUANE",
    "type": "jail"
   },
   {
    "name": "Bangkok",
    "short": "Bangkok",
    "type": "property",
    "group": "g2",
    "price": 140
   },
   {
    "name": "Élec.",
    "short": "Élec.",
    "type": "utility",
    "price": 150
   },
   {
    "name": "Jakarta",
    "short": "Jakarta",
    "type": "property",
    "group": "g2",
    "price": 140
   },
   {
    "name": "Manille",
    "short": "Manille",
    "type": "property",
    "group": "g2",
    "price": 160
   },
   {
    "name": "JFK",
    "short": "JFK",
    "type": "station",
    "price": 200
   },
   {
    "name": "Mexico",
    "short": "Mexico",
    "type": "property",
    "group": "g3",
    "price": 180
   },
   {
    "name": "Voyage",
    "short": "Voyage",
    "type": "major"
   },
   {
    "name": "Lima",
    "short": "Lima",
    "type": "property",
    "group": "g3",
    "price": 180
   },
   {
    "name": "Bogota",
    "short": "Bogota",
    "type": "property",
    "group": "g3",
    "price": 200
   },
   {
    "name": "ESCALE",
    "short": "ESCALE",
    "type": "parking"
   },
   {
    "name": "Istanbul",
    "short": "Istanbul",
    "type": "property",
    "group": "g4",
    "price": 220
   },
   {
    "name": "Visa",
    "short": "Visa",
    "type": "minor"
   },
   {
    "name": "Dubaï",
    "short": "Dubaï",
    "type": "property",
    "group": "g4",
    "price": 220
   },
   {
    "name": "Doha",
    "short": "Doha",
    "type": "property",
    "group": "g4",
    "price": 240
   },
   {
    "name": "Heathrow",
    "short": "Heathrow",
    "type": "station",
    "price": 200
   },
   {
    "name": "Londres",
    "short": "Londres",
    "type": "property",
    "group": "g5",
    "price": 260
   },
   {
    "name": "Berlin",
    "short": "Berlin",
    "type": "property",
    "group": "g5",
    "price": 260
   },
   {
    "name": "Eaux",
    "short": "Eaux",
    "type": "utility",
    "price": 150
   },
   {
    "name": "Rome",
    "short": "Rome",
    "type": "property",
    "group": "g5",
    "price": 280
   },
   {
    "name": "EXPULSÉ",
    "short": "EXPULSÉ",
    "type": "gotojail"
   },
   {
    "name": "Sydney",
    "short": "Sydney",
    "type": "property",
    "group": "g6",
    "price": 300
   },
   {
    "name": "Tokyo",
    "short": "Tokyo",
    "type": "property",
    "group": "g6",
    "price": 300
   },
   {
    "name": "Voyage",
    "short": "Voyage",
    "type": "major"
   },
   {
    "name": "Séoul",
    "short": "Séoul",
    "type": "property",
    "group": "g6",
    "price": 320
   },
   {
    "name": "Changi",
    "short": "Changi",
    "type": "station",
    "price": 200
   },
   {
    "name": "Visa",
    "short": "Visa",
    "type": "minor"
   },
   {
    "name": "Amende",
    "short": "Amende",
    "type": "tax",
    "amount": 100
   },
   {
    "name": "New York",
    "short": "New York",
    "type": "property",
    "group": "g7",
    "price": 350
   },
   {
    "name": "Paris",
    "short": "Paris",
    "type": "property",
    "group": "g7",
    "price": 400
   }
  ],
  "ui": {
   "accent": "#f0873a",
   "accent2": "#8a4310",
   "bg": "#0b2436",
   "felt": "#11364f"
  },
  "icons": {
   "station": "✈️",
   "utility": "💡",
   "minor": "🛂",
   "major": "🧳",
   "tax": "💸",
   "go": "▶️",
   "jail": "🛃",
   "parking": "🏝️",
   "gotojail": "🚨"
  },
  "words": {
   "station": "aéroport",
   "utility": "service"
  }
 },
 "france": {
  "id": "france",
  "label": "France",
  "icon": "🥖",
  "tagline": "Sillonnez les régions et devenez le plus grand propriétaire de France.",
  "tokens": [
   {
    "e": "🥖",
    "c": "#bc6c25",
    "name": "Baguette"
   },
   {
    "e": "🧀",
    "c": "#e8b13d",
    "name": "Fromage"
   },
   {
    "e": "🍷",
    "c": "#8a3a4a",
    "name": "Vin"
   },
   {
    "e": "🚲",
    "c": "#2a9d8f",
    "name": "Vélo"
   },
   {
    "e": "🎨",
    "c": "#7b6cd9",
    "name": "Palette"
   },
   {
    "e": "🗼",
    "c": "#3d5a80",
    "name": "Tour Eiffel"
   }
  ],
  "groupColors": [
   "#8a8f99",
   "#d1495b",
   "#3d5a80",
   "#588157",
   "#bc6c25",
   "#2a9d8f",
   "#7b6cd9",
   "#c9a63c"
  ],
  "groupLabels": {
   "g0": "Côte du Nord",
   "g1": "Hauts-de-France",
   "g2": "Grand Est",
   "g3": "Bretagne & Loire",
   "g4": "Sud-Ouest",
   "g5": "Sud-Est",
   "g6": "Alpes",
   "g7": "Île-de-France"
  },
  "minorName": "Aléas",
  "majorName": "Entraide",
  "minorCards": [
   {
    "text": "Vous gagnez à la loterie locale.",
    "money": 50
   },
   {
    "text": "Un voisin vous rend un service.",
    "money": 40
   },
   {
    "text": "Vous trouvez une place de parking gratuite.",
    "money": 30
   },
   {
    "text": "Amende pour stationnement gênant.",
    "money": -40
   },
   {
    "text": "Grève des transports, taxi obligatoire.",
    "money": -30
   },
   {
    "text": "Vous revendez des meubles en ligne.",
    "money": 45
   },
   {
    "text": "Avancez jusqu'à DÉPART et récupérez 200.",
    "money": 0,
    "moveTo": 0
   },
   {
    "text": "Réparation de votre vélo.",
    "money": -25
   }
  ],
  "majorCards": [
   {
    "text": "Un cousin éloigné vous emprunte de l'argent sans le rendre.",
    "money": -75
   },
   {
    "text": "Cagnotte de quartier organisée pour vous.",
    "money": 60
   },
   {
    "text": "Bourse d'étude méritée.",
    "money": 100
   },
   {
    "text": "Travaux de rénovation imprévus.",
    "money": -50
   },
   {
    "text": "Vous gagnez un concours de pétanque !",
    "money": 40
   },
   {
    "text": "Redressement fiscal.",
    "money": -60
   },
   {
    "text": "Un mécène local vous soutient.",
    "money": 45
   },
   {
    "text": "Contrôle surprise : direction le tribunal.",
    "money": 0,
    "goToJail": true
   }
  ],
  "board": [
   {
    "name": "DÉPART",
    "short": "DÉPART",
    "type": "go"
   },
   {
    "name": "Calais",
    "short": "Calais",
    "type": "property",
    "group": "g0",
    "price": 60
   },
   {
    "name": "Aléas",
    "short": "Aléas",
    "type": "minor"
   },
   {
    "name": "Dunker.",
    "short": "Dunker.",
    "type": "property",
    "group": "g0",
    "price": 60
   },
   {
    "name": "Impôts",
    "short": "Impôts",
    "type": "tax",
    "amount": 200
   },
   {
    "name": "G. Nord",
    "short": "G. Nord",
    "type": "station",
    "price": 200
   },
   {
    "name": "Lille",
    "short": "Lille",
    "type": "property",
    "group": "g1",
    "price": 100
   },
   {
    "name": "Aléas",
    "short": "Aléas",
    "type": "minor"
   },
   {
    "name": "Amiens",
    "short": "Amiens",
    "type": "property",
    "group": "g1",
    "price": 100
   },
   {
    "name": "Reims",
    "short": "Reims",
    "type": "property",
    "group": "g1",
    "price": 120
   },
   {
    "name": "PRISON",
    "short": "PRISON",
    "type": "jail"
   },
   {
    "name": "Strasb.",
    "short": "Strasb.",
    "type": "property",
    "group": "g2",
    "price": 140
   },
   {
    "name": "Gaz",
    "short": "Gaz",
    "type": "utility",
    "price": 150
   },
   {
    "name": "Nancy",
    "short": "Nancy",
    "type": "property",
    "group": "g2",
    "price": 140
   },
   {
    "name": "Metz",
    "short": "Metz",
    "type": "property",
    "group": "g2",
    "price": 160
   },
   {
    "name": "G. Est",
    "short": "G. Est",
    "type": "station",
    "price": 200
   },
   {
    "name": "Nantes",
    "short": "Nantes",
    "type": "property",
    "group": "g3",
    "price": 180
   },
   {
    "name": "Entraide",
    "short": "Entraide",
    "type": "major"
   },
   {
    "name": "Rennes",
    "short": "Rennes",
    "type": "property",
    "group": "g3",
    "price": 180
   },
   {
    "name": "Brest",
    "short": "Brest",
    "type": "property",
    "group": "g3",
    "price": 200
   },
   {
    "name": "PAUSE",
    "short": "PAUSE",
    "type": "parking"
   },
   {
    "name": "Bordeaux",
    "short": "Bordeaux",
    "type": "property",
    "group": "g4",
    "price": 220
   },
   {
    "name": "Aléas",
    "short": "Aléas",
    "type": "minor"
   },
   {
    "name": "Toulouse",
    "short": "Toulouse",
    "type": "property",
    "group": "g4",
    "price": 220
   },
   {
    "name": "Biarritz",
    "short": "Biarritz",
    "type": "property",
    "group": "g4",
    "price": 240
   },
   {
    "name": "G. Mont.",
    "short": "G. Mont.",
    "type": "station",
    "price": 200
   },
   {
    "name": "Marseille",
    "short": "Marseille",
    "type": "property",
    "group": "g5",
    "price": 260
   },
   {
    "name": "Nice",
    "short": "Nice",
    "type": "property",
    "group": "g5",
    "price": 260
   },
   {
    "name": "Cie des Eaux",
    "short": "Eaux",
    "type": "utility",
    "price": 150
   },
   {
    "name": "Montp.",
    "short": "Montp.",
    "type": "property",
    "group": "g5",
    "price": 280
   },
   {
    "name": "TRIBUNAL",
    "short": "TRIBUNAL",
    "type": "gotojail"
   },
   {
    "name": "Lyon",
    "short": "Lyon",
    "type": "property",
    "group": "g6",
    "price": 300
   },
   {
    "name": "Grenoble",
    "short": "Grenoble",
    "type": "property",
    "group": "g6",
    "price": 300
   },
   {
    "name": "Entraide",
    "short": "Entraide",
    "type": "major"
   },
   {
    "name": "Annecy",
    "short": "Annecy",
    "type": "property",
    "group": "g6",
    "price": 320
   },
   {
    "name": "G. Lyon",
    "short": "G. Lyon",
    "type": "station",
    "price": 200
   },
   {
    "name": "Aléas",
    "short": "Aléas",
    "type": "minor"
   },
   {
    "name": "Amende",
    "short": "Amende",
    "type": "tax",
    "amount": 100
   },
   {
    "name": "Paris",
    "short": "Paris",
    "type": "property",
    "group": "g7",
    "price": 350
   },
   {
    "name": "Versailles",
    "short": "Versailles",
    "type": "property",
    "group": "g7",
    "price": 400
   }
  ],
  "ui": {
   "accent": "#e5483d",
   "accent2": "#8a1f18",
   "bg": "#101c38",
   "felt": "#182a52"
  },
  "icons": {
   "station": "🚆",
   "utility": "💧",
   "minor": "🎲",
   "major": "🤝",
   "tax": "🧾",
   "go": "▶️",
   "jail": "⛓️",
   "parking": "🥐",
   "gotojail": "⚖️"
  },
  "words": {
   "station": "gare",
   "utility": "service"
  }
 },
 "pirates": {
  "id": "pirates",
  "label": "Pirates",
  "icon": "🏴‍☠️",
  "tagline": "Amassez butin et propriétés sur les sept mers.",
  "tokens": [
   {
    "e": "🏴‍☠️",
    "c": "#2c2c2c",
    "name": "Drapeau"
   },
   {
    "e": "🦜",
    "c": "#27ae60",
    "name": "Perroquet"
   },
   {
    "e": "⚓",
    "c": "#7f8c8d",
    "name": "Ancre"
   },
   {
    "e": "🗺️",
    "c": "#c9a66b",
    "name": "Carte"
   },
   {
    "e": "💰",
    "c": "#f1c40f",
    "name": "Trésor"
   },
   {
    "e": "⚔️",
    "c": "#95a5a6",
    "name": "Épée"
   }
  ],
  "groupColors": [
   "#6b4423",
   "#2f9e44",
   "#3d9dbf",
   "#16a085",
   "#7f8c8d",
   "#c9a66b",
   "#8e44ad",
   "#c0392b"
  ],
  "groupLabels": {
   "g0": "Criques",
   "g1": "Île aux Singes",
   "g2": "Baie des Naufrages",
   "g3": "Lagon Bleu",
   "g4": "Île du Squelette",
   "g5": "Passage Doré",
   "g6": "Cité Perdue",
   "g7": "Île au Trésor"
  },
  "minorName": "Butin",
  "majorName": "Légende",
  "minorCards": [
   {
    "text": "Vous trouvez une pièce d'or oubliée.",
    "money": 50
   },
   {
    "text": "Le vent est favorable, vous vendez votre cargaison.",
    "money": 75
   },
   {
    "text": "Un marchand vous paie pour un service rendu.",
    "money": 60
   },
   {
    "text": "Réparations urgentes sur la coque du navire.",
    "money": -40
   },
   {
    "text": "Amende pour avoir accosté sans autorisation.",
    "money": -30
   },
   {
    "text": "Vous revendez des cartes marines.",
    "money": 45
   },
   {
    "text": "Avancez jusqu'à PORT D'ATTACHE et récupérez 200.",
    "money": 0,
    "moveTo": 0
   },
   {
    "text": "Frais de médecin de bord pour un membre blessé.",
    "money": -50
   }
  ],
  "majorCards": [
   {
    "text": "Un second déloyal détourne une partie du butin !",
    "money": -75
   },
   {
    "text": "Vous vendez une carte au trésor à un rival.",
    "money": 40
   },
   {
    "text": "Une flotte alliée vous verse une prime de guerre.",
    "money": 100
   },
   {
    "text": "Réparation du mât après la tempête.",
    "money": -25
   },
   {
    "text": "Vous remportez un duel à l'épée et son butin !",
    "money": 90
   },
   {
    "text": "Amende de la Couronne pour piraterie.",
    "money": -60
   },
   {
    "text": "Un riche noble finance votre prochaine expédition.",
    "money": 45
   },
   {
    "text": "Capturé par la marine royale : direction le cachot.",
    "money": 0,
    "goToJail": true
   }
  ],
  "board": [
   {
    "name": "PORT D'ATTACHE",
    "short": "PORT",
    "type": "go"
   },
   {
    "name": "Contrebande",
    "short": "Contreb.",
    "type": "property",
    "group": "g0",
    "price": 60
   },
   {
    "name": "Butin",
    "short": "Butin",
    "type": "minor"
   },
   {
    "name": "Sable Noir",
    "short": "Sable Noir",
    "type": "property",
    "group": "g0",
    "price": 60
   },
   {
    "name": "Douane",
    "short": "Douane",
    "type": "tax",
    "amount": 200
   },
   {
    "name": "Port Nord",
    "short": "Port Nord",
    "type": "station",
    "price": 200
   },
   {
    "name": "Plage Singes",
    "short": "Singes",
    "type": "property",
    "group": "g1",
    "price": 100
   },
   {
    "name": "Butin",
    "short": "Butin",
    "type": "minor"
   },
   {
    "name": "Jungle",
    "short": "Jungle",
    "type": "property",
    "group": "g1",
    "price": 100
   },
   {
    "name": "Grotte",
    "short": "Grotte",
    "type": "property",
    "group": "g1",
    "price": 120
   },
   {
    "name": "CACHOT",
    "short": "CACHOT",
    "type": "jail"
   },
   {
    "name": "Récif",
    "short": "Récif",
    "type": "property",
    "group": "g2",
    "price": 140
   },
   {
    "name": "Vent",
    "short": "Vent",
    "type": "utility",
    "price": 150
   },
   {
    "name": "Épave",
    "short": "Épave",
    "type": "property",
    "group": "g2",
    "price": 140
   },
   {
    "name": "Phare",
    "short": "Phare",
    "type": "property",
    "group": "g2",
    "price": 160
   },
   {
    "name": "Port Sud",
    "short": "Port Sud",
    "type": "station",
    "price": 200
   },
   {
    "name": "Rivage",
    "short": "Rivage",
    "type": "property",
    "group": "g3",
    "price": 180
   },
   {
    "name": "Légende",
    "short": "Légende",
    "type": "major"
   },
   {
    "name": "Grotte Bleue",
    "short": "Gr. Bleue",
    "type": "property",
    "group": "g3",
    "price": 180
   },
   {
    "name": "Atoll",
    "short": "Atoll",
    "type": "property",
    "group": "g3",
    "price": 200
   },
   {
    "name": "NAUFRAGE",
    "short": "NAUFRAGE",
    "type": "parking"
   },
   {
    "name": "Cimetière",
    "short": "Cimetière",
    "type": "property",
    "group": "g4",
    "price": 220
   },
   {
    "name": "Butin",
    "short": "Butin",
    "type": "minor"
   },
   {
    "name": "Falaise",
    "short": "Falaise",
    "type": "property",
    "group": "g4",
    "price": 220
   },
   {
    "name": "Ossements",
    "short": "Ossements",
    "type": "property",
    "group": "g4",
    "price": 240
   },
   {
    "name": "Port Est",
    "short": "Port Est",
    "type": "station",
    "price": 200
   },
   {
    "name": "Détroit",
    "short": "Détroit",
    "type": "property",
    "group": "g5",
    "price": 260
   },
   {
    "name": "Comptoir",
    "short": "Comptoir",
    "type": "property",
    "group": "g5",
    "price": 260
   },
   {
    "name": "Carte",
    "short": "Carte",
    "type": "utility",
    "price": 150
   },
   {
    "name": "Fort Doré",
    "short": "Fort Doré",
    "type": "property",
    "group": "g5",
    "price": 280
   },
   {
    "name": "KRAKEN",
    "short": "KRAKEN",
    "type": "gotojail"
   },
   {
    "name": "Temple",
    "short": "Temple",
    "type": "property",
    "group": "g6",
    "price": 300
   },
   {
    "name": "Pyramide",
    "short": "Pyramide",
    "type": "property",
    "group": "g6",
    "price": 300
   },
   {
    "name": "Légende",
    "short": "Légende",
    "type": "major"
   },
   {
    "name": "Trésorerie",
    "short": "Trésor.",
    "type": "property",
    "group": "g6",
    "price": 320
   },
   {
    "name": "Port Ouest",
    "short": "Port Ouest",
    "type": "station",
    "price": 200
   },
   {
    "name": "Butin",
    "short": "Butin",
    "type": "minor"
   },
   {
    "name": "Tribut",
    "short": "Tribut",
    "type": "tax",
    "amount": 100
   },
   {
    "name": "Point X",
    "short": "Point X",
    "type": "property",
    "group": "g7",
    "price": 350
   },
   {
    "name": "Coffre",
    "short": "Coffre",
    "type": "property",
    "group": "g7",
    "price": 400
   }
  ],
  "ui": {
   "accent": "#d9923b",
   "accent2": "#7a4a12",
   "bg": "#1f150c",
   "felt": "#3a281b"
  },
  "icons": {
   "station": "⚓",
   "utility": "🌬️",
   "minor": "💰",
   "major": "📜",
   "tax": "🪙",
   "go": "▶️",
   "jail": "⛓️",
   "parking": "🛟",
   "gotojail": "🐙"
  },
  "words": {
   "station": "port",
   "utility": "élément"
  }
 },
 "cinema": {
  "id": "cinema",
  "label": "Cinéma",
  "icon": "🎬",
  "tagline": "Produisez, distribuez, dominez le box-office.",
  "tokens": [
   {
    "e": "🎬",
    "c": "#1a1a2e",
    "name": "Clap"
   },
   {
    "e": "🍿",
    "c": "#f4d35e",
    "name": "Popcorn"
   },
   {
    "e": "⭐",
    "c": "#f1c40f",
    "name": "Étoile"
   },
   {
    "e": "📽️",
    "c": "#5b4636",
    "name": "Caméra"
   },
   {
    "e": "🎭",
    "c": "#8e44ad",
    "name": "Masque"
   },
   {
    "e": "🏆",
    "c": "#d4af37",
    "name": "Trophée"
   }
  ],
  "groupColors": [
   "#8e6b4f",
   "#3d9dbf",
   "#2f9e44",
   "#c0392b",
   "#6c5ce7",
   "#e8842e",
   "#f1c40f",
   "#1f2a52"
  ],
  "groupLabels": {
   "g0": "Salles de Quartier",
   "g1": "Classiques",
   "g2": "Comédies Cultes",
   "g3": "Action & Thriller",
   "g4": "Grands Drames",
   "g5": "Blockbusters",
   "g6": "Palmarès",
   "g7": "Chefs-d'œuvre"
  },
  "minorName": "Critique",
  "majorName": "Récomp.",
  "minorCards": [
   {
    "text": "Votre film reçoit une critique élogieuse.",
    "money": 50
   },
   {
    "text": "Un fan vous demande un autographe payant.",
    "money": 40
   },
   {
    "text": "Les ventes de popcorn explosent ce soir.",
    "money": 60
   },
   {
    "text": "Le tournage prend du retard.",
    "money": -40
   },
   {
    "text": "Amende pour dépassement de budget.",
    "money": -30
   },
   {
    "text": "Vous vendez des produits dérivés.",
    "money": 45
   },
   {
    "text": "Avancez jusqu'à TAPIS ROUGE et récupérez 200.",
    "money": 0,
    "moveTo": 0
   },
   {
    "text": "Frais de cascadeur pour une scène risquée.",
    "money": -50
   }
  ],
  "majorCards": [
   {
    "text": "Un producteur véreux détourne les recettes !",
    "money": -75
   },
   {
    "text": "Vous vendez les droits de votre scénario.",
    "money": 40
   },
   {
    "text": "Une bourse du cinéma finance votre projet.",
    "money": 100
   },
   {
    "text": "Réparation du matériel de tournage endommagé.",
    "money": -25
   },
   {
    "text": "Votre film cartonne au box-office !",
    "money": 90
   },
   {
    "text": "Amende pour infraction aux droits d'auteur.",
    "money": -60
   },
   {
    "text": "Un mécène investit dans votre studio.",
    "money": 45
   },
   {
    "text": "Scandale sur le tournage : convoqué au tribunal.",
    "money": 0,
    "goToJail": true
   }
  ],
  "board": [
   {
    "name": "TAPIS ROUGE",
    "short": "TAPIS",
    "type": "go"
   },
   {
    "name": "Rocky",
    "short": "Rocky",
    "type": "property",
    "group": "g0",
    "price": 60
   },
   {
    "name": "Critique",
    "short": "Critique",
    "type": "minor"
   },
   {
    "name": "E.T.",
    "short": "E.T.",
    "type": "property",
    "group": "g0",
    "price": 60
   },
   {
    "name": "Billets",
    "short": "Billets",
    "type": "tax",
    "amount": 200
   },
   {
    "name": "Universal",
    "short": "Universal",
    "type": "station",
    "price": 200
   },
   {
    "name": "Star Wars",
    "short": "Star Wars",
    "type": "property",
    "group": "g1",
    "price": 100
   },
   {
    "name": "Critique",
    "short": "Critique",
    "type": "minor"
   },
   {
    "name": "Jurassic Park",
    "short": "Jurassic",
    "type": "property",
    "group": "g1",
    "price": 100
   },
   {
    "name": "Retour Futur",
    "short": "Retour F.",
    "type": "property",
    "group": "g1",
    "price": 120
   },
   {
    "name": "MONTAGE",
    "short": "MONTAGE",
    "type": "jail"
   },
   {
    "name": "Le Roi Lion",
    "short": "Roi Lion",
    "type": "property",
    "group": "g2",
    "price": 140
   },
   {
    "name": "Projecteurs",
    "short": "Projec.",
    "type": "utility",
    "price": 150
   },
   {
    "name": "Forrest Gump",
    "short": "Gump",
    "type": "property",
    "group": "g2",
    "price": 140
   },
   {
    "name": "Pulp Fiction",
    "short": "Pulp F.",
    "type": "property",
    "group": "g2",
    "price": 160
   },
   {
    "name": "Warner",
    "short": "Warner",
    "type": "station",
    "price": 200
   },
   {
    "name": "Matrix",
    "short": "Matrix",
    "type": "property",
    "group": "g3",
    "price": 180
   },
   {
    "name": "Récomp.",
    "short": "Récomp.",
    "type": "major"
   },
   {
    "name": "Fight Club",
    "short": "Fight C.",
    "type": "property",
    "group": "g3",
    "price": 180
   },
   {
    "name": "Gladiator",
    "short": "Gladiator",
    "type": "property",
    "group": "g3",
    "price": 200
   },
   {
    "name": "ENTRACTE",
    "short": "ENTRACTE",
    "type": "parking"
   },
   {
    "name": "Seigneur Anneaux",
    "short": "Anneaux",
    "type": "property",
    "group": "g4",
    "price": 220
   },
   {
    "name": "Critique",
    "short": "Critique",
    "type": "minor"
   },
   {
    "name": "Inception",
    "short": "Inception",
    "type": "property",
    "group": "g4",
    "price": 220
   },
   {
    "name": "Interstellar",
    "short": "Interstel.",
    "type": "property",
    "group": "g4",
    "price": 240
   },
   {
    "name": "Paramount",
    "short": "Paramount",
    "type": "station",
    "price": 200
   },
   {
    "name": "Titanic",
    "short": "Titanic",
    "type": "property",
    "group": "g5",
    "price": 260
   },
   {
    "name": "Avatar",
    "short": "Avatar",
    "type": "property",
    "group": "g5",
    "price": 260
   },
   {
    "name": "Son Dolby",
    "short": "Son Dolby",
    "type": "utility",
    "price": 150
   },
   {
    "name": "Avengers",
    "short": "Avengers",
    "type": "property",
    "group": "g5",
    "price": 280
   },
   {
    "name": "FLOP",
    "short": "FLOP",
    "type": "gotojail"
   },
   {
    "name": "Parasite",
    "short": "Parasite",
    "type": "property",
    "group": "g6",
    "price": 300
   },
   {
    "name": "Joker",
    "short": "Joker",
    "type": "property",
    "group": "g6",
    "price": 300
   },
   {
    "name": "Récomp.",
    "short": "Récomp.",
    "type": "major"
   },
   {
    "name": "La La Land",
    "short": "La La Land",
    "type": "property",
    "group": "g6",
    "price": 320
   },
   {
    "name": "Disney",
    "short": "Disney",
    "type": "station",
    "price": 200
   },
   {
    "name": "Critique",
    "short": "Critique",
    "type": "minor"
   },
   {
    "name": "Recettes",
    "short": "Recettes",
    "type": "tax",
    "amount": 100
   },
   {
    "name": "Le Parrain",
    "short": "Le Parrain",
    "type": "property",
    "group": "g7",
    "price": 350
   },
   {
    "name": "Oppenheimer",
    "short": "Oppenh.",
    "type": "property",
    "group": "g7",
    "price": 400
   }
  ],
  "ui": {
   "accent": "#e8c05a",
   "accent2": "#8a6a14",
   "bg": "#2a0b12",
   "felt": "#44131d"
  },
  "icons": {
   "station": "🎞️",
   "utility": "💡",
   "minor": "📰",
   "major": "🏆",
   "tax": "🎟️",
   "go": "▶️",
   "jail": "✂️",
   "parking": "🍿",
   "gotojail": "👎"
  },
  "words": {
   "station": "studio",
   "utility": "équipement"
  }
 },
 "jeuxvideo": {
  "id": "jeuxvideo",
  "label": "Jeux Vidéo",
  "icon": "🎮",
  "tagline": "Achetez, développez, dominez l'industrie du jeu vidéo.",
  "tokens": [
   {
    "e": "🎮",
    "c": "#2c2c2c",
    "name": "Manette"
   },
   {
    "e": "👾",
    "c": "#8e44ad",
    "name": "Alien"
   },
   {
    "e": "🍄",
    "c": "#c0392b",
    "name": "Champignon"
   },
   {
    "e": "⚔️",
    "c": "#7f8c8d",
    "name": "Épée"
   },
   {
    "e": "🕹️",
    "c": "#e8842e",
    "name": "Joystick"
   },
   {
    "e": "💾",
    "c": "#3d9dbf",
    "name": "Disquette"
   }
  ],
  "groupColors": [
   "#7f8c8d",
   "#f1c40f",
   "#2f9e44",
   "#c0392b",
   "#e8842e",
   "#3d9dbf",
   "#8e44ad",
   "#1f2a52"
  ],
  "groupLabels": {
   "g0": "Rétro",
   "g1": "Âge d'Or Arcade",
   "g2": "Icônes 8-16 bits",
   "g3": "FPS Légendaires",
   "g4": "Open World",
   "g5": "Esport",
   "g6": "Chefs-d'œuvre Modernes",
   "g7": "Meilleures Ventes"
  },
  "minorName": "Loot",
  "majorName": "MAJ",
  "minorCards": [
   {
    "text": "Vous trouvez un objet rare dans un coffre.",
    "money": 50
   },
   {
    "text": "Un stream sponsorisé rapporte gros.",
    "money": 40
   },
   {
    "text": "Vente flash sur la boutique en ligne.",
    "money": 60
   },
   {
    "text": "Votre compte est piraté temporairement.",
    "money": -40
   },
   {
    "text": "Amende pour triche en ligne détectée.",
    "money": -30
   },
   {
    "text": "Vous revendez des skins rares.",
    "money": 45
   },
   {
    "text": "Avancez jusqu'à ÉCRAN TITRE et récupérez 200.",
    "money": 0,
    "moveTo": 0
   },
   {
    "text": "Frais de réparation de votre manette cassée.",
    "money": -50
   }
  ],
  "majorCards": [
   {
    "text": "Un hacker vide votre inventaire !",
    "money": -75
   },
   {
    "text": "Vous vendez votre compte à un collectionneur.",
    "money": 40
   },
   {
    "text": "Vous remportez un tournoi e-sport.",
    "money": 100
   },
   {
    "text": "Mise à jour payante pour réparer un bug critique.",
    "money": -25
   },
   {
    "text": "Votre chaîne devient virale du jour au lendemain !",
    "money": 90
   },
   {
    "text": "Amende pour violation des conditions d'utilisation.",
    "money": -60
   },
   {
    "text": "Un éditeur vous sponsorise.",
    "money": 45
   },
   {
    "text": "Bannissement temporaire : retour à l'écran titre.",
    "money": 0,
    "goToJail": true
   }
  ],
  "board": [
   {
    "name": "ÉCRAN TITRE",
    "short": "TITRE",
    "type": "go"
   },
   {
    "name": "Pong",
    "short": "Pong",
    "type": "property",
    "group": "g0",
    "price": 60
   },
   {
    "name": "Loot",
    "short": "Loot",
    "type": "minor"
   },
   {
    "name": "Tetris",
    "short": "Tetris",
    "type": "property",
    "group": "g0",
    "price": 60
   },
   {
    "name": "Abonnement",
    "short": "Abonn.",
    "type": "tax",
    "amount": 200
   },
   {
    "name": "GameStop",
    "short": "GameStop",
    "type": "station",
    "price": 200
   },
   {
    "name": "Pac-Man",
    "short": "Pac-Man",
    "type": "property",
    "group": "g1",
    "price": 100
   },
   {
    "name": "Loot",
    "short": "Loot",
    "type": "minor"
   },
   {
    "name": "Space Invaders",
    "short": "Invaders",
    "type": "property",
    "group": "g1",
    "price": 100
   },
   {
    "name": "Donkey Kong",
    "short": "D. Kong",
    "type": "property",
    "group": "g1",
    "price": 120
   },
   {
    "name": "GAME OVER",
    "short": "GAME OVER",
    "type": "jail"
   },
   {
    "name": "Super Mario",
    "short": "Mario",
    "type": "property",
    "group": "g2",
    "price": 140
   },
   {
    "name": "Manette",
    "short": "Manette",
    "type": "utility",
    "price": 150
   },
   {
    "name": "Sonic",
    "short": "Sonic",
    "type": "property",
    "group": "g2",
    "price": 140
   },
   {
    "name": "Zelda",
    "short": "Zelda",
    "type": "property",
    "group": "g2",
    "price": 160
   },
   {
    "name": "Steam",
    "short": "Steam",
    "type": "station",
    "price": 200
   },
   {
    "name": "Street Fighter II",
    "short": "SF II",
    "type": "property",
    "group": "g3",
    "price": 180
   },
   {
    "name": "MAJ",
    "short": "MAJ",
    "type": "major"
   },
   {
    "name": "Doom",
    "short": "Doom",
    "type": "property",
    "group": "g3",
    "price": 180
   },
   {
    "name": "Half-Life",
    "short": "Half-Life",
    "type": "property",
    "group": "g3",
    "price": 200
   },
   {
    "name": "PAUSE",
    "short": "PAUSE",
    "type": "parking"
   },
   {
    "name": "Counter-Strike",
    "short": "CS",
    "type": "property",
    "group": "g4",
    "price": 220
   },
   {
    "name": "Loot",
    "short": "Loot",
    "type": "minor"
   },
   {
    "name": "GTA: San Andreas",
    "short": "GTA SA",
    "type": "property",
    "group": "g4",
    "price": 220
   },
   {
    "name": "Red Dead 2",
    "short": "RDR 2",
    "type": "property",
    "group": "g4",
    "price": 240
   },
   {
    "name": "PlayStation",
    "short": "PlayStati.",
    "type": "station",
    "price": 200
   },
   {
    "name": "The Witcher 3",
    "short": "Witcher 3",
    "type": "property",
    "group": "g5",
    "price": 260
   },
   {
    "name": "Fortnite",
    "short": "Fortnite",
    "type": "property",
    "group": "g5",
    "price": 260
   },
   {
    "name": "Wifi",
    "short": "Wifi",
    "type": "utility",
    "price": 150
   },
   {
    "name": "League of Legends",
    "short": "LoL",
    "type": "property",
    "group": "g5",
    "price": 280
   },
   {
    "name": "BOSS FINAL",
    "short": "BOSS FINAL",
    "type": "gotojail"
   },
   {
    "name": "God of War",
    "short": "God of War",
    "type": "property",
    "group": "g6",
    "price": 300
   },
   {
    "name": "The Last of Us",
    "short": "Last of Us",
    "type": "property",
    "group": "g6",
    "price": 300
   },
   {
    "name": "MAJ",
    "short": "MAJ",
    "type": "major"
   },
   {
    "name": "Elden Ring",
    "short": "Elden Ring",
    "type": "property",
    "group": "g6",
    "price": 320
   },
   {
    "name": "Xbox",
    "short": "Xbox",
    "type": "station",
    "price": 200
   },
   {
    "name": "Loot",
    "short": "Loot",
    "type": "minor"
   },
   {
    "name": "DLC",
    "short": "DLC",
    "type": "tax",
    "amount": 100
   },
   {
    "name": "Minecraft",
    "short": "Minecraft",
    "type": "property",
    "group": "g7",
    "price": 350
   },
   {
    "name": "GTA V",
    "short": "GTA V",
    "type": "property",
    "group": "g7",
    "price": 400
   }
  ],
  "ui": {
   "accent": "#3ddc97",
   "accent2": "#12724a",
   "bg": "#0b1819",
   "felt": "#11292b"
  },
  "icons": {
   "station": "🕹️",
   "utility": "📡",
   "minor": "🎁",
   "major": "⬆️",
   "tax": "💳",
   "go": "▶️",
   "jail": "💀",
   "parking": "⏸️",
   "gotojail": "👹"
  },
  "words": {
   "station": "plateforme",
   "utility": "service"
  }
 },
 "space": {
  "id": "space",
  "label": "Espace",
  "icon": "🚀",
  "tagline": "Colonisez le système solaire, une planète à la fois.",
  "tokens": [
   {
    "e": "🚀",
    "c": "#e8e8f2",
    "name": "Fusée"
   },
   {
    "e": "👨‍🚀",
    "c": "#ff9f43",
    "name": "Astronaute"
   },
   {
    "e": "🛸",
    "c": "#7bed9f",
    "name": "Soucoupe"
   },
   {
    "e": "🛰️",
    "c": "#70a1ff",
    "name": "Satellite"
   },
   {
    "e": "☄️",
    "c": "#ff6b81",
    "name": "Comète"
   },
   {
    "e": "🪐",
    "c": "#c9a0ff",
    "name": "Planète"
   }
  ],
  "groupColors": [
   "#8d8fa8",
   "#d9563a",
   "#e6b94a",
   "#9aa5b1",
   "#d98c4a",
   "#d9c27a",
   "#4a7be0",
   "#2a1a4f"
  ],
  "groupLabels": {
   "g0": "Lune",
   "g1": "Mars",
   "g2": "Vénus",
   "g3": "Mercure",
   "g4": "Jupiter",
   "g5": "Saturne",
   "g6": "Neptune",
   "g7": "Trou noir"
  },
  "minorName": "Débris",
  "majorName": "Anomalie",
  "minorCards": [
   {
    "text": "Vous récupérez des débris précieux à revendre.",
    "money": 60
   },
   {
    "text": "Une sonde découvre de l'eau gelée : bonus de mission.",
    "money": 80
   },
   {
    "text": "Micro-météorite sur la coque : réparations.",
    "money": -45
   },
   {
    "text": "Plein de carburant exceptionnel.",
    "money": -35
   },
   {
    "text": "Vous vendez des photos du Soleil.",
    "money": 50
   },
   {
    "text": "Tempête solaire : le bouclier consomme de l'énergie.",
    "money": -55
   },
   {
    "text": "Retournez sur TERRE et touchez 200.",
    "money": 0,
    "moveTo": 0
   },
   {
    "text": "Un satellite loué rapporte des royalties.",
    "money": 40
   }
  ],
  "majorCards": [
   {
    "text": "Anomalie gravitationnelle : on vous vole des fonds !",
    "money": -80
   },
   {
    "text": "Une civilisation amie finance votre mission.",
    "money": 110
   },
   {
    "text": "Panne de réacteur : remorquage coûteux.",
    "money": -60
   },
   {
    "text": "Vous découvrez un gisement d'astéroïdes riches.",
    "money": 95
   },
   {
    "text": "Subvention de l'agence spatiale.",
    "money": 70
   },
   {
    "text": "Amende pour pollution orbitale.",
    "money": -50
   },
   {
    "text": "Quarantaine imposée : direction la zone INTERDITE.",
    "money": 0,
    "goToJail": true
   },
   {
    "text": "Votre découverte fait la une des journaux.",
    "money": 50
   }
  ],
  "board": [
   {
    "name": "TERRE",
    "short": "TERRE",
    "type": "go"
   },
   {
    "name": "Cratère",
    "short": "Cratère",
    "type": "property",
    "group": "g0",
    "price": 60
   },
   {
    "name": "Débris",
    "short": "Débris",
    "type": "minor"
   },
   {
    "name": "Mer Calme",
    "short": "Mer Calme",
    "type": "property",
    "group": "g0",
    "price": 60
   },
   {
    "name": "Carburant",
    "short": "Carburant",
    "type": "tax",
    "amount": 200
   },
   {
    "name": "Port A",
    "short": "Port A",
    "type": "station",
    "price": 200
   },
   {
    "name": "Olympe",
    "short": "Olympe",
    "type": "property",
    "group": "g1",
    "price": 100
   },
   {
    "name": "Débris",
    "short": "Débris",
    "type": "minor"
   },
   {
    "name": "Marineris",
    "short": "Marineris",
    "type": "property",
    "group": "g1",
    "price": 100
   },
   {
    "name": "Gale",
    "short": "Gale",
    "type": "property",
    "group": "g1",
    "price": 120
   },
   {
    "name": "INTERDIT",
    "short": "INTERDIT",
    "type": "jail"
   },
   {
    "name": "Ishtar",
    "short": "Ishtar",
    "type": "property",
    "group": "g2",
    "price": 140
   },
   {
    "name": "Oxygène",
    "short": "Oxygène",
    "type": "utility",
    "price": 150
   },
   {
    "name": "Guinevere",
    "short": "Guinev.",
    "type": "property",
    "group": "g2",
    "price": 140
   },
   {
    "name": "Maxwell",
    "short": "Maxwell",
    "type": "property",
    "group": "g2",
    "price": 160
   },
   {
    "name": "Port B",
    "short": "Port B",
    "type": "station",
    "price": 200
   },
   {
    "name": "Caloris",
    "short": "Caloris",
    "type": "property",
    "group": "g3",
    "price": 180
   },
   {
    "name": "Anomalie",
    "short": "Anomalie",
    "type": "major"
   },
   {
    "name": "Kuiper",
    "short": "Kuiper",
    "type": "property",
    "group": "g3",
    "price": 180
   },
   {
    "name": "Discovery",
    "short": "Discov.",
    "type": "property",
    "group": "g3",
    "price": 200
   },
   {
    "name": "STATION",
    "short": "STATION",
    "type": "parking"
   },
   {
    "name": "Grande Tache",
    "short": "G. Tache",
    "type": "property",
    "group": "g4",
    "price": 220
   },
   {
    "name": "Débris",
    "short": "Débris",
    "type": "minor"
   },
   {
    "name": "Europe",
    "short": "Europe",
    "type": "property",
    "group": "g4",
    "price": 220
   },
   {
    "name": "Ganymède",
    "short": "Ganymède",
    "type": "property",
    "group": "g4",
    "price": 240
   },
   {
    "name": "Port C",
    "short": "Port C",
    "type": "station",
    "price": 200
   },
   {
    "name": "Anneaux",
    "short": "Anneaux",
    "type": "property",
    "group": "g5",
    "price": 260
   },
   {
    "name": "Titan",
    "short": "Titan",
    "type": "property",
    "group": "g5",
    "price": 260
   },
   {
    "name": "Gravité",
    "short": "Gravité",
    "type": "utility",
    "price": 150
   },
   {
    "name": "Encelade",
    "short": "Encelade",
    "type": "property",
    "group": "g5",
    "price": 280
   },
   {
    "name": "ASTÉROÏDES",
    "short": "ASTÉROÏDES",
    "type": "gotojail"
   },
   {
    "name": "Triton",
    "short": "Triton",
    "type": "property",
    "group": "g6",
    "price": 300
   },
   {
    "name": "Tache Sombre",
    "short": "T. Sombre",
    "type": "property",
    "group": "g6",
    "price": 300
   },
   {
    "name": "Anomalie",
    "short": "Anomalie",
    "type": "major"
   },
   {
    "name": "Proteus",
    "short": "Proteus",
    "type": "property",
    "group": "g6",
    "price": 320
   },
   {
    "name": "Port D",
    "short": "Port D",
    "type": "station",
    "price": 200
   },
   {
    "name": "Débris",
    "short": "Débris",
    "type": "minor"
   },
   {
    "name": "Décontam.",
    "short": "Décont.",
    "type": "tax",
    "amount": 100
   },
   {
    "name": "Horizon",
    "short": "Horizon",
    "type": "property",
    "group": "g7",
    "price": 350
   },
   {
    "name": "Singularité",
    "short": "Singul.",
    "type": "property",
    "group": "g7",
    "price": 400
   }
  ],
  "ui": {
   "accent": "#9cc2ff",
   "accent2": "#3a5c94",
   "bg": "#080c18",
   "felt": "#0f1730"
  },
  "icons": {
   "station": "🛸",
   "utility": "⚛️",
   "minor": "☄️",
   "major": "🌀",
   "tax": "⛽",
   "go": "▶️",
   "jail": "🔒",
   "parking": "🛰️",
   "gotojail": "☄️"
  },
  "words": {
   "station": "port",
   "utility": "ressource"
  }
 },
 "fair": {
  "id": "fair",
  "label": "Fête Foraine",
  "icon": "🎡",
  "tagline": "Manèges, barbe à papa et gros lots : tout est à vendre.",
  "tokens": [
   {
    "e": "🎡",
    "c": "#ff7ac8",
    "name": "Grande roue"
   },
   {
    "e": "🍭",
    "c": "#ff6b6b",
    "name": "Sucette"
   },
   {
    "e": "🎪",
    "c": "#feca57",
    "name": "Chapiteau"
   },
   {
    "e": "🎯",
    "c": "#48dbfb",
    "name": "Cible"
   },
   {
    "e": "🐴",
    "c": "#a29bfe",
    "name": "Cheval"
   },
   {
    "e": "🎢",
    "c": "#1dd1a1",
    "name": "Montagnes russes"
   }
  ],
  "groupColors": [
   "#a98467",
   "#ff9f43",
   "#2ecc71",
   "#2e86de",
   "#e74c3c",
   "#f6d365",
   "#9b59b6",
   "#1b2a6b"
  ],
  "groupLabels": {
   "g0": "Stands",
   "g1": "Gourmandises",
   "g2": "Pistes",
   "g3": "Frissons",
   "g4": "Montagnes russes",
   "g5": "Grande roue",
   "g6": "VIP",
   "g7": "Spectacle"
  },
  "minorName": "Ticket",
  "majorName": "Jackpot",
  "minorCards": [
   {
    "text": "Vous gagnez un nounours au stand de tir.",
    "money": 40
   },
   {
    "text": "Ticket doré : tour gratuit et pourboire.",
    "money": 60
   },
   {
    "text": "Vous perdez votre portefeuille près des autos-tamponneuses.",
    "money": -45
   },
   {
    "text": "Mal de cœur après les montagnes russes : pharmacie.",
    "money": -30
   },
   {
    "text": "Vous vendez des peluches à la sortie.",
    "money": 50
   },
   {
    "text": "Une file d'attente interminable : vous achetez des snacks.",
    "money": -35
   },
   {
    "text": "Retournez à l'ENTRÉE et touchez 200.",
    "money": 0,
    "moveTo": 0
   },
   {
    "text": "Concours de grimaces : vous remportez la cagnotte.",
    "money": 45
   }
  ],
  "majorCards": [
   {
    "text": "JACKPOT ! La machine à sous crache ses pièces.",
    "money": 120
   },
   {
    "text": "Panne de courant : remboursement des billets.",
    "money": -70
   },
   {
    "text": "Vous gagnez le grand concours de force.",
    "money": 90
   },
   {
    "text": "Amende pour barbe à papa dans les cheveux du maire.",
    "money": -40
   },
   {
    "text": "Le forain vous offre une avance sur recettes.",
    "money": 75
   },
   {
    "text": "Manège en réparation : indemnisations.",
    "money": -65
   },
   {
    "text": "Un petit malin vous a fait les poches : direction OBJETS PERDUS.",
    "money": 0,
    "goToJail": true
   },
   {
    "text": "Votre numéro de magie enchante le public.",
    "money": 55
   }
  ],
  "board": [
   {
    "name": "ENTRÉE",
    "short": "ENTRÉE",
    "type": "go"
   },
   {
    "name": "Stand Tir",
    "short": "Stand T.",
    "type": "property",
    "group": "g0",
    "price": 60
   },
   {
    "name": "Ticket",
    "short": "Ticket",
    "type": "minor"
   },
   {
    "name": "Pêche Canards",
    "short": "Pêche C.",
    "type": "property",
    "group": "g0",
    "price": 60
   },
   {
    "name": "Parking",
    "short": "Parking",
    "type": "tax",
    "amount": 200
   },
   {
    "name": "Guichet N",
    "short": "Guichet N",
    "type": "station",
    "price": 200
   },
   {
    "name": "Barbe Papa",
    "short": "B. Papa",
    "type": "property",
    "group": "g1",
    "price": 100
   },
   {
    "name": "Ticket",
    "short": "Ticket",
    "type": "minor"
   },
   {
    "name": "Pomme d'Amour",
    "short": "P. Amour",
    "type": "property",
    "group": "g1",
    "price": 100
   },
   {
    "name": "Churros",
    "short": "Churros",
    "type": "property",
    "group": "g1",
    "price": 120
   },
   {
    "name": "OBJETS PERDUS",
    "short": "OBJETS PE.",
    "type": "jail"
   },
   {
    "name": "Piste Bleue",
    "short": "P. Bleue",
    "type": "property",
    "group": "g2",
    "price": 140
   },
   {
    "name": "Électricité",
    "short": "Électrici.",
    "type": "utility",
    "price": 150
   },
   {
    "name": "Piste Rouge",
    "short": "P. Rouge",
    "type": "property",
    "group": "g2",
    "price": 140
   },
   {
    "name": "Piste VIP",
    "short": "P. VIP",
    "type": "property",
    "group": "g2",
    "price": 160
   },
   {
    "name": "Guichet S",
    "short": "Guichet S",
    "type": "station",
    "price": 200
   },
   {
    "name": "Couloir Sombre",
    "short": "C. Sombre",
    "type": "property",
    "group": "g3",
    "price": 180
   },
   {
    "name": "Jackpot",
    "short": "Jackpot",
    "type": "major"
   },
   {
    "name": "Miroirs",
    "short": "Miroirs",
    "type": "property",
    "group": "g3",
    "price": 180
   },
   {
    "name": "Chambre Horreur",
    "short": "Ch. Horreur",
    "type": "property",
    "group": "g3",
    "price": 200
   },
   {
    "name": "PIQUE-NIQUE",
    "short": "PIQUE-NIQ.",
    "type": "parking"
   },
   {
    "name": "Boucle",
    "short": "Boucle",
    "type": "property",
    "group": "g4",
    "price": 220
   },
   {
    "name": "Ticket",
    "short": "Ticket",
    "type": "minor"
   },
   {
    "name": "Looping",
    "short": "Looping",
    "type": "property",
    "group": "g4",
    "price": 220
   },
   {
    "name": "Chute",
    "short": "Chute",
    "type": "property",
    "group": "g4",
    "price": 240
   },
   {
    "name": "Guichet E",
    "short": "Guichet E",
    "type": "station",
    "price": 200
   },
   {
    "name": "Cabine Std",
    "short": "Cabine",
    "type": "property",
    "group": "g5",
    "price": 260
   },
   {
    "name": "Panoramique",
    "short": "Panor.",
    "type": "property",
    "group": "g5",
    "price": 260
   },
   {
    "name": "Confiserie",
    "short": "Confiserie",
    "type": "utility",
    "price": 150
   },
   {
    "name": "Nocturne",
    "short": "Nocturne",
    "type": "property",
    "group": "g5",
    "price": 280
   },
   {
    "name": "SÉCURITÉ",
    "short": "SÉCURITÉ",
    "type": "gotojail"
   },
   {
    "name": "Loge",
    "short": "Loge",
    "type": "property",
    "group": "g6",
    "price": 300
   },
   {
    "name": "Coupe-File",
    "short": "Coupe-F.",
    "type": "property",
    "group": "g6",
    "price": 300
   },
   {
    "name": "Jackpot",
    "short": "Jackpot",
    "type": "major"
   },
   {
    "name": "Backstage",
    "short": "Backst.",
    "type": "property",
    "group": "g6",
    "price": 320
   },
   {
    "name": "Guichet O",
    "short": "Guichet O",
    "type": "station",
    "price": 200
   },
   {
    "name": "Ticket",
    "short": "Ticket",
    "type": "minor"
   },
   {
    "name": "Nettoyage",
    "short": "Nettoyage",
    "type": "tax",
    "amount": 100
   },
   {
    "name": "Manège Star",
    "short": "M. Star",
    "type": "property",
    "group": "g7",
    "price": 350
   },
   {
    "name": "Show Final",
    "short": "Show F.",
    "type": "property",
    "group": "g7",
    "price": 400
   }
  ],
  "ui": {
   "accent": "#2ec4b6",
   "accent2": "#146b63",
   "bg": "#2b0f17",
   "felt": "#4a1a24"
  },
  "icons": {
   "station": "🎟️",
   "utility": "💡",
   "minor": "🎫",
   "major": "🎰",
   "tax": "🧹",
   "go": "▶️",
   "jail": "📢",
   "parking": "🧺",
   "gotojail": "🚔"
  },
  "words": {
   "station": "guichet",
   "utility": "service"
  }
 },
 "cuisine": {
  "id": "cuisine",
  "label": "Cuisine du Monde",
  "icon": "🍽️",
  "tagline": "Ouvrez des restaurants aux quatre coins du globe.",
  "tokens": [
   {
    "e": "👨‍🍳",
    "c": "#ffffff",
    "name": "Chef"
   },
   {
    "e": "🍴",
    "c": "#c8d6e5",
    "name": "Couverts"
   },
   {
    "e": "🌶️",
    "c": "#ee5253",
    "name": "Piment"
   },
   {
    "e": "🍷",
    "c": "#b33771",
    "name": "Vin"
   },
   {
    "e": "🥖",
    "c": "#feca57",
    "name": "Baguette"
   },
   {
    "e": "🔪",
    "c": "#8395a7",
    "name": "Couteau"
   }
  ],
  "groupColors": [
   "#a98467",
   "#e8842e",
   "#2ecc71",
   "#e84393",
   "#e74c3c",
   "#f6d365",
   "#6c5ce7",
   "#1f2a52"
  ],
  "groupLabels": {
   "g0": "Street food",
   "g1": "Bistrots",
   "g2": "Italie",
   "g3": "Japon",
   "g4": "Nord",
   "g5": "Gastronomie",
   "g6": "Privé",
   "g7": "Étoilé"
  },
  "minorName": "Critique",
  "majorName": "Guide",
  "minorCards": [
   {
    "text": "Un critique adore votre plat du jour.",
    "money": 65
   },
   {
    "text": "Rupture de stock de beurre : achat en urgence.",
    "money": -35
   },
   {
    "text": "Vous vendez votre recette au magazine.",
    "money": 55
   },
   {
    "text": "Un client mécontent exige un remboursement.",
    "money": -40
   },
   {
    "text": "Soirée complète : les pourboires pleuvent.",
    "money": 45
   },
   {
    "text": "Le four tombe en panne en plein service.",
    "money": -50
   },
   {
    "text": "Retournez en CUISINE et touchez 200.",
    "money": 0,
    "moveTo": 0
   },
   {
    "text": "Votre sauce secrète devient virale.",
    "money": 70
   }
  ],
  "majorCards": [
   {
    "text": "Le Guide vous attribue une étoile !",
    "money": 120
   },
   {
    "text": "Intoxication alimentaire : indemnités et avocat.",
    "money": -85
   },
   {
    "text": "Un investisseur gourmand entre au capital.",
    "money": 100
   },
   {
    "text": "Hausse du prix des matières premières.",
    "money": -55
   },
   {
    "text": "Vous remportez le concours de la meilleure tarte.",
    "money": 80
   },
   {
    "text": "Redressement fiscal sur les pourboires.",
    "money": -60
   },
   {
    "text": "Inspection sanitaire : direction la PLONGE.",
    "money": 0,
    "goToJail": true
   },
   {
    "text": "Une célébrité réserve toute la salle.",
    "money": 60
   }
  ],
  "board": [
   {
    "name": "CUISINE",
    "short": "CUISINE",
    "type": "go"
   },
   {
    "name": "Foodtruck",
    "short": "Foodtruck",
    "type": "property",
    "group": "g0",
    "price": 60
   },
   {
    "name": "Critique",
    "short": "Critique",
    "type": "minor"
   },
   {
    "name": "Marché",
    "short": "Marché",
    "type": "property",
    "group": "g0",
    "price": 60
   },
   {
    "name": "Service",
    "short": "Service",
    "type": "tax",
    "amount": 200
   },
   {
    "name": "Marché N",
    "short": "Marché N",
    "type": "station",
    "price": 200
   },
   {
    "name": "Bistrot",
    "short": "Bistrot",
    "type": "property",
    "group": "g1",
    "price": 100
   },
   {
    "name": "Critique",
    "short": "Critique",
    "type": "minor"
   },
   {
    "name": "Brasserie",
    "short": "Brasser.",
    "type": "property",
    "group": "g1",
    "price": 100
   },
   {
    "name": "Bouchon",
    "short": "Bouchon",
    "type": "property",
    "group": "g1",
    "price": 120
   },
   {
    "name": "PLONGE",
    "short": "PLONGE",
    "type": "jail"
   },
   {
    "name": "Pizza",
    "short": "Pizza",
    "type": "property",
    "group": "g2",
    "price": 140
   },
   {
    "name": "Gaz",
    "short": "Gaz",
    "type": "utility",
    "price": 150
   },
   {
    "name": "Pasta",
    "short": "Pasta",
    "type": "property",
    "group": "g2",
    "price": 140
   },
   {
    "name": "Risotto",
    "short": "Risotto",
    "type": "property",
    "group": "g2",
    "price": 160
   },
   {
    "name": "Marché S",
    "short": "Marché S",
    "type": "station",
    "price": 200
   },
   {
    "name": "Sushi",
    "short": "Sushi",
    "type": "property",
    "group": "g3",
    "price": 180
   },
   {
    "name": "Guide",
    "short": "Guide",
    "type": "major"
   },
   {
    "name": "Ramen",
    "short": "Ramen",
    "type": "property",
    "group": "g3",
    "price": 180
   },
   {
    "name": "Yakitori",
    "short": "Yakitori",
    "type": "property",
    "group": "g3",
    "price": 200
   },
   {
    "name": "TERRASSE",
    "short": "TERRASSE",
    "type": "parking"
   },
   {
    "name": "Moules-Frites",
    "short": "Moules-F.",
    "type": "property",
    "group": "g4",
    "price": 220
   },
   {
    "name": "Critique",
    "short": "Critique",
    "type": "minor"
   },
   {
    "name": "Gaufres",
    "short": "Gaufres",
    "type": "property",
    "group": "g4",
    "price": 220
   },
   {
    "name": "Bière",
    "short": "Bière",
    "type": "property",
    "group": "g4",
    "price": 240
   },
   {
    "name": "Marché E",
    "short": "Marché E",
    "type": "station",
    "price": 200
   },
   {
    "name": "Dégustation",
    "short": "Dégust.",
    "type": "property",
    "group": "g5",
    "price": 260
   },
   {
    "name": "Accord Vins",
    "short": "Accord V.",
    "type": "property",
    "group": "g5",
    "price": 260
   },
   {
    "name": "Eau",
    "short": "Eau",
    "type": "utility",
    "price": 150
   },
   {
    "name": "Chef",
    "short": "Chef",
    "type": "property",
    "group": "g5",
    "price": 280
   },
   {
    "name": "CONTRÔLE",
    "short": "CONTRÔLE",
    "type": "gotojail"
   },
   {
    "name": "Salle Privée",
    "short": "Salle P.",
    "type": "property",
    "group": "g6",
    "price": 300
   },
   {
    "name": "Cave",
    "short": "Cave",
    "type": "property",
    "group": "g6",
    "price": 300
   },
   {
    "name": "Guide",
    "short": "Guide",
    "type": "major"
   },
   {
    "name": "Terrasse+",
    "short": "Terrasse+",
    "type": "property",
    "group": "g6",
    "price": 320
   },
   {
    "name": "Marché O",
    "short": "Marché O",
    "type": "station",
    "price": 200
   },
   {
    "name": "Critique",
    "short": "Critique",
    "type": "minor"
   },
   {
    "name": "Pourboire",
    "short": "Pourboire",
    "type": "tax",
    "amount": 100
   },
   {
    "name": "Table du Chef",
    "short": "Table Chef",
    "type": "property",
    "group": "g7",
    "price": 350
   },
   {
    "name": "Ultime",
    "short": "Ultime",
    "type": "property",
    "group": "g7",
    "price": 400
   }
  ],
  "ui": {
   "accent": "#86b56a",
   "accent2": "#3f6a2c",
   "bg": "#1d110e",
   "felt": "#33201a"
  },
  "icons": {
   "station": "🛒",
   "utility": "🔥",
   "minor": "📝",
   "major": "⭐",
   "tax": "🧾",
   "go": "▶️",
   "jail": "🧽",
   "parking": "🍷",
   "gotojail": "🔍"
  },
  "words": {
   "station": "marché",
   "utility": "service"
  }
 }
};
})();
