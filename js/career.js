(function(){

  /* ================= CAREER MODE ================= */
  /* Data ported from a career-simulator prototype, restyled to match
     MultiPoly's look. Prefixed CAR_/car to avoid any collision with the
     rest of the app. */
  const CAR_SEASON_LEN = 20;
  const CAR_RETIRE_AGE_MIN = 35;
  const CAR_RETIRE_AGE_MAX = 38;
  const CAR_MIN_START_AGE = 17;
  const CAR_MAX_START_AGE = 21;
  const CAR_START_YEAR = 2026;
  const CAR_MAX_DRAFTS = 3;
  const CAR_TOP5_SIZE = 5;

  const CAR_WEIGHTS = [["normale",0.34],["bonus",0.42],["malus",0.20],["horsfoot",0.04]];

const CAR_NAME_POOLS = {
  fr: {
    first: ["Yanis", "Mattéo", "Lucas", "Enzo", "Rayan", "Nathan", "Théo", "Noah", "Malo", "Baptiste", "Hugo", "Ethan",
      "Gabriel", "Raphaël", "Léo", "Jules", "Adam", "Louis", "Arthur", "Maël", "Tom", "Sacha", "Timéo", "Aaron",
      "Clément", "Antoine", "Valentin", "Corentin", "Quentin", "Maxime", "Romain", "Axel", "Kylian", "Alix",
      "Nolan", "Evan", "Ilan", "Milo", "Isaac", "Naël", "Robin", "Amaury", "Gaspard", "Titouan", "Erwan", "Loïc"],
    last: ["Dubreuil", "Lefèvre", "Rousseau", "Girard", "Moreau", "Fontaine", "Lambert", "Renard", "Perrin", "Marchand",
      "Chevalier", "Boucher", "Mercier", "Barbier", "Leroy", "Dumont", "Bertrand", "Colin", "Guillot", "Vasseur",
      "Duval", "Charpentier", "Blanchard", "Delaunay", "Auger", "Poirier", "Lemoine", "Deschamps", "Berger", "Faure"],
  },
  westAfr: {
    first: ["Amara", "Moussa", "Adama", "Ibrahim", "Souleymane", "Mamadou", "Cheikh", "Ousmane", "Sadio", "Boubacar",
      "Lamine", "Seydou", "Aliou", "Idrissa", "Abdoulaye", "Modou", "Bakary", "Yaya", "Kalidou", "Pape",
      "Serigne", "Alassane", "Demba", "Habib", "Malick", "Youssouf", "Salif", "Fodé", "Karamoko", "Sekou",
      "Kwame", "Kofi", "Emmanuel", "Daniel", "Samuel", "Victor", "Chukwu", "Obinna", "Nana", "Yao"],
    last: ["Camara", "Traoré", "Diallo", "Kanté", "Sissoko", "Coulibaly", "Konaté", "N'Guessan", "Cissé", "Bamba",
      "Kouassi", "Diop", "Ndiaye", "Sarr", "Fall", "Gueye", "Touré", "Keïta", "Doumbia", "Sylla",
      "Mendy", "Baldé", "Dembélé", "Sow", "Yeboah", "Mensah", "Okafor", "Adeyemi", "Boateng", "Osei"],
  },
  maghreb: {
    first: ["Bilal", "Sofiane", "Younès", "Anas", "Karim", "Riyad", "Achraf", "Mehdi", "Hakim", "Ilyas",
      "Ayoub", "Nabil", "Amine", "Yassine", "Zakaria", "Oussama", "Walid", "Hamza", "Adel", "Sami",
      "Ismaël", "Bilel", "Reda", "Nordine", "Farid", "Tarek", "Rachid", "Nadir", "Selim", "Marwan",
      "Youssef", "Omar", "Aymen", "Chakib", "Idriss", "Salim"],
    last: ["Benali", "El Amrani", "Ziani", "Hakimi", "Boufal", "Mahrez", "Belhadj", "Chaoui", "Taleb", "Zerrouki",
      "Bennacer", "Slimani", "Bensebaini", "El Khattabi", "Amrabat", "Ounahi", "Msakni", "Khazri", "Feghouli", "Brahimi",
      "Bounedjah", "Attal", "Guedioura", "Saïss", "Ziyech", "Regragui", "Haddadi", "Bouazza", "Cherif", "Meziane"],
  },
  en: {
    first: ["Jack", "Harry", "Callum", "Mason", "Declan", "Ollie", "Reece", "Kyle", "Tyler", "Jude",
      "Marcus", "Connor", "Charlie", "George", "Alfie", "Archie", "Freddie", "Jacob", "Ethan", "Leo",
      "Finley", "Riley", "Bailey", "Jamie", "Lewis", "Ben", "Josh", "Ryan", "Adam", "Sam",
      "Dominic", "Nathan", "Cole", "Kai", "Rhys", "Aaron", "Elliot", "Toby", "Louie", "Morgan"],
    last: ["Whitmore", "Hargreaves", "Ashworth", "Bramley", "Fletcher", "Rowntree", "Cavendish", "Ellington", "Hobbs", "Marlow",
      "Redfern", "Sanderson", "Kirkland", "Harrington", "Thornton", "Blackwood", "Pemberton", "Waverly", "Stanton", "Lockwood",
      "Bramhall", "Grimshaw", "Ashby", "Wilkinson", "Hollis", "Crawley", "Radcliffe", "Winstanley", "Bowden", "Merrick"],
  },
  es: {
    first: ["Álvaro", "Iker", "Rodrigo", "Pablo", "Sergio", "Javier", "Nico", "Marco", "Adrián", "Dani",
      "Unai", "Gonzalo", "Hugo", "Martín", "Diego", "Alejandro", "Mario", "Carlos", "Jorge", "Rubén",
      "Íñigo", "Aitor", "Borja", "Xabi", "Gerard", "Marc", "Oriol", "Pau", "Aleix", "Bryan",
      "Fermín", "Lamine", "Ansu", "Yeremy", "Samu", "Raúl"],
    last: ["Serrano", "Vidal", "Molina", "Cabrera", "Alarcón", "Iglesias", "Peñaranda", "Bermúdez", "Ferrer", "Ocaña",
      "Requena", "Villalba", "Navarro", "Domínguez", "Castillo", "Guerrero", "Cardona", "Espinosa", "Montoya", "Carrasco",
      "Pedraza", "Olmedo", "Zamora", "Bautista", "Cuesta", "Aranda", "Salinas", "Rojas", "Miralles", "Escudero"],
  },
  latam: {
    first: ["Mateo", "Thiago", "Santiago", "Lautaro", "Facundo", "Emiliano", "Gabriel", "Rafael", "Vinícius", "Joaquín",
      "Bruno", "Nicolás", "Matías", "Franco", "Julián", "Valentín", "Benjamín", "Agustín", "Tomás", "Lucas",
      "Rodrigo", "Enzo", "Gonzalo", "Alexis", "Cristian", "Éder", "Douglas", "Endrick", "Estêvão", "Wesley",
      "Marcelo", "Ricardo", "Everton", "Igor", "Kaio", "Léo", "Danilo", "Renan", "Yuri", "Hernán"],
    last: ["Ferreira", "Almeida", "Quintero", "Salazar", "Bustamante", "Ríos", "Cardoso", "Herrera", "Maldonado", "Vergara",
      "Ibarra", "Nascimento", "Silva", "Oliveira", "Ramírez", "Cáceres", "Zambrano", "Peralta", "Villalobos", "Arce",
      "Montero", "Guzmán", "Escobar", "Palacios", "Barreto", "Sepúlveda", "Núñez", "Aguirre", "Valdés", "Rocha"],
  },
  it: {
    first: ["Lorenzo", "Matteo", "Federico", "Alessandro", "Riccardo", "Nicolò", "Davide", "Gianluca", "Tommaso", "Andrea",
      "Simone", "Pietro", "Giacomo", "Francesco", "Luca", "Marco", "Stefano", "Filippo", "Emanuele", "Gabriele",
      "Samuele", "Leonardo", "Cristian", "Mattia", "Alberto", "Daniele", "Fabio", "Giulio", "Enrico", "Michele",
      "Antonio", "Salvatore", "Vincenzo", "Rosario", "Edoardo", "Manuel"],
    last: ["Rinaldi", "Bellandi", "Moretti", "Costa", "Fabbri", "Gallo", "Sartori", "Vitale", "Barbieri", "Lombardi",
      "Ricci", "Marchetti", "Ferrara", "Greco", "Rizzo", "Bruno", "Caputo", "Villa", "Serra", "Palmieri",
      "Testa", "Ferretti", "Orlando", "Cattaneo", "Bernardi", "Mancuso", "Fiore", "Grassi", "Silvestri", "Pagano"],
  },
  de: {
    first: ["Lukas", "Jonas", "Niklas", "Felix", "Maximilian", "Leon", "Jannik", "Tim", "Florian", "Moritz",
      "Elias", "Paul", "Ben", "Noah", "Luis", "Emil", "Julian", "David", "Fabian", "Marvin",
      "Nico", "Tobias", "Sebastian", "Philipp", "Kevin", "Dennis", "Robin", "Jannis", "Malte", "Erik",
      "Karim", "Youssoufa", "Mattis", "Linus", "Til", "Bastian"],
    last: ["Brandt", "Hofmann", "Kellner", "Wagner", "Reinhardt", "Sommer", "Kruger", "Baumann", "Vogel", "Eichel",
      "Stark", "Neumann", "Schuster", "Zimmermann", "Fuchs", "Weber", "Lehmann", "Böhm", "Frank", "Kaiser",
      "Bergmann", "Winkler", "Dietrich", "Hartmann", "Köhler", "Seidel", "Engel", "Wolff", "Ritter", "Lang"],
  },
  nl: {
    first: ["Sven", "Daan", "Jurriën", "Bram", "Ruben", "Thijs", "Stijn", "Lars", "Kai", "Mees",
      "Joost", "Wout", "Sem", "Finn", "Levi", "Luuk", "Milan", "Tijn", "Jesse", "Teun",
      "Cody", "Xavi", "Quinten", "Ryan", "Justin", "Donyell", "Steven", "Frenkie", "Micky", "Noa",
      "Brian", "Jorrel", "Sepp", "Ties"],
    last: ["van Dijken", "de Groot", "Bakker", "Vermeulen", "Hendriks", "Jansen", "van Rijn", "Kuipers", "Willemsen", "Smit",
      "Bosman", "Dekker", "de Vries", "van Leeuwen", "Meijer", "Visser", "Mulder", "de Boer", "van Beek", "Timmermans",
      "Hoekstra", "Postma", "van Loon", "Verhoeven", "Peters", "Kramer", "van Wijk", "Brouwer", "Scholten", "Groenewegen"],
  },
  slav: {
    first: ["Luka", "Marko", "Nikola", "Ivan", "Miloš", "Andrej", "Filip", "Stefan", "Dušan", "Petar",
      "Bohdan", "Kacper", "Josip", "Mateo", "Ante", "Domagoj", "Borna", "Lovro", "Roko", "Toma",
      "Jakub", "Tomáš", "Ondřej", "Vojtěch", "Bartosz", "Szymon", "Mateusz", "Piotr", "Wojciech", "Jan",
      "Andrii", "Oleksandr", "Mykola", "Vlad", "Cristian", "Ionuț", "Dimitris", "Giorgos", "Emre", "Kerem"],
    last: ["Kovačić", "Petrović", "Novák", "Marković", "Horvat", "Jovanović", "Nowak", "Kowalczyk", "Vasilenko", "Shevchuk",
      "Popescu", "Ilić", "Modrić", "Perišić", "Vlašić", "Stanković", "Milinković", "Todorović", "Svoboda", "Dvořák",
      "Wójcik", "Lewandowski", "Zieliński", "Kovalenko", "Bondarenko", "Constantinescu", "Papadopoulos", "Yılmaz", "Demir", "Çalhanoğlu"],
  },
  nordic: {
    first: ["Erling", "Viktor", "Emil", "Mathias", "Oskar", "Anton", "Sander", "Kasper", "Elias", "Jonas",
      "Rasmus", "Nils", "Alexander", "William", "Oliver", "Noah", "Lucas", "Filip", "Hugo", "Axel",
      "Isak", "Dejan", "Martin", "Andreas", "Kristoffer", "Sondre", "Håkon", "Fredrik", "Magnus", "Jesper",
      "Mikkel", "Christian", "Simon", "Joakim", "Gustav", "Alfons"],
    last: ["Lindqvist", "Haugen", "Berg", "Nygaard", "Sørensen", "Ahlberg", "Dahl", "Kristiansen", "Nilsen", "Holm",
      "Ek", "Bakken", "Johansson", "Andersson", "Karlsson", "Olsen", "Larsen", "Pedersen", "Hansen", "Møller",
      "Lund", "Strand", "Solberg", "Vik", "Sandberg", "Forsberg", "Norling", "Ødegaard", "Bjørnstad", "Eriksen"],
  },
  jp: {
    first: ["Takumi", "Sōta", "Ren", "Haruto", "Kaito", "Yuto", "Riku", "Daiki", "Sora", "Hayato",
      "Kenta", "Ryōsuke", "Yuki", "Sōma", "Itsuki", "Hinata", "Asahi", "Yamato", "Aoto", "Minato",
      "Kōki", "Shōta", "Takuma", "Naoki", "Kenji", "Junya", "Ritsu", "Ao", "Kaoru", "Daizen",
      "Takefusa", "Wataru", "Ayase", "Reo", "Shunsuke", "Hidemasa"],
    last: ["Nakamura", "Yoshida", "Tanaka", "Sasaki", "Fujimoto", "Ishikawa", "Morita", "Kobayashi", "Hasegawa", "Ueda",
      "Kuroda", "Miyazaki", "Suzuki", "Takahashi", "Watanabe", "Itō", "Yamamoto", "Nakajima", "Saitō", "Matsumoto",
      "Inoue", "Kimura", "Shimizu", "Hayashi", "Yamada", "Ogawa", "Endō", "Maeda", "Fujita", "Okazaki"],
  },
  kr: {
    first: ["Min-jun", "Ji-ho", "Seo-jun", "Do-yun", "Hyun-woo", "Jae-min", "Eun-woo", "Tae-yang", "Si-woo", "Joon-ho",
      "Ha-jun", "Yu-jin", "Heung-min", "Kang-in", "Min-jae", "Woo-young", "Seung-ho", "Ji-sung", "Chan-young", "Dong-jun",
      "Sang-ho", "Young-jun", "Hyun-jun", "Jae-sung", "Gyu-sung", "In-beom", "Ui-jo", "Tae-hwan", "Seok-ho", "Jun-seo",
      "Yeon-jun", "Ji-hoon", "Beom-seok", "Chang-hoon"],
    last: ["Kim", "Lee", "Park", "Choi", "Jung", "Kang", "Cho", "Yoon", "Jang", "Lim",
      "Han", "Oh", "Shin", "Seo", "Kwon", "Hwang", "Ahn", "Song", "Hong", "Yoo",
      "Baek", "Nam", "Moon", "Bae", "Ryu", "Jeon", "Ko", "Son"],
  },
  arab: {
    first: ["Salem", "Faisal", "Abdullah", "Omar", "Yousef", "Khalid", "Hamad", "Nasser", "Rashid", "Majed",
      "Tariq", "Saud", "Ali", "Hassan", "Mohammed", "Ahmed", "Sultan", "Fahad", "Turki", "Bandar",
      "Mansour", "Waleed", "Ziyad", "Ibrahim", "Nawaf", "Abdulrahman", "Mehdi", "Alireza", "Sardar", "Reza",
      "Amir", "Saman", "Ehsan", "Vahid", "Karim", "Milad"],
    last: ["Al-Harbi", "Al-Dosari", "Al-Mutairi", "Al-Ghamdi", "Al-Shammari", "Al-Qahtani", "Al-Sulaiti", "Al-Rashid", "Nazari", "Ghorbani",
      "Rezaei", "Karimi", "Al-Owais", "Al-Buraikan", "Al-Faraj", "Al-Najei", "Al-Hassan", "Al-Marri", "Al-Haydos", "Al-Ahrak",
      "Taremi", "Azmoun", "Jahanbakhsh", "Hosseini", "Ansarifard", "Beiranvand", "Mohammadi", "Noorollahi", "Torabi", "Gholizadeh"],
  },
  us: {
    first: ["Tyler", "Brandon", "Cole", "Jordan", "Ethan", "Austin", "Trevor", "Weston", "Cameron", "Logan",
      "Blake", "Dylan", "Christian", "Gio", "Ricardo", "Malik", "Josh", "Tanner", "Hunter", "Chase",
      "Caleb", "Mason", "Bryce", "Jaden", "Devin", "Grayson", "Preston", "Colton", "Zach", "Nolan",
      "Kellyn", "Timothy", "Folarin", "Haji", "Paxten", "Alejandro"],
    last: ["Reyna", "Whitaker", "Sullivan", "Brennan", "Callaghan", "Mercer", "Donovan", "Hayes", "Kessler", "Bradshaw",
      "Turner", "Vance", "Robinson", "Carter", "Mitchell", "Bennett", "Crawford", "Gallagher", "Sheridan", "Holloway",
      "McKenzie", "Sinclair", "Palmer", "Weston", "Alvarado", "Delgado", "Fitzgerald", "Marshall", "Hendricks", "Boyd"],
  },
};

const CAR_NATION_NAMES = {
  "France": "fr", "Belgique": "fr", "Suisse": "fr",
  "Sénégal": "westAfr", "Côte d'Ivoire": "westAfr", "Nigéria": "westAfr",
  "Ghana": "westAfr", "Cameroun": "westAfr",
  "Maroc": "maghreb", "Algérie": "maghreb", "Tunisie": "maghreb", "Égypte": "maghreb",
  "Angleterre": "en", "Écosse": "en", "Irlande": "en",
  "Espagne": "es",
  "Brésil": "latam", "Argentine": "latam", "Uruguay": "latam", "Colombie": "latam",
  "Chili": "latam", "Pérou": "latam", "Équateur": "latam", "Paraguay": "latam",
  "Mexique": "latam", "Portugal": "latam",
  "Italie": "it",
  "Allemagne": "de", "Autriche": "de",
  "Pays-Bas": "nl",
  "Croatie": "slav", "Serbie": "slav", "Ukraine": "slav", "Pologne": "slav",
  "Tchéquie": "slav", "Hongrie": "slav", "Roumanie": "slav", "Grèce": "slav",
  "Turquie": "slav",
  "Danemark": "nordic", "Suède": "nordic", "Norvège": "nordic",
  "Japon": "jp", "Corée du Sud": "kr",
  "Arabie saoudite": "arab", "Qatar": "arab", "Iran": "arab",
  "États-Unis": "us", "Canada": "us", "Australie": "us",
};

const CAR_FORM_EVENTS = [
  { key: "serie", label: "En feu sur plusieurs journées", weight: 0.30, form: 3 },
  { key: "regulier", label: "Régulier sur la période", weight: 0.34, form: 2 },
  { key: "utile", label: "Discret mais utile", weight: 0.36, form: 1 },
];

const CAR_TIERS = [
  {
    max: 58, label: "Deuxième division",
    fee: [40000, 600000], salary: [15000, 45000], euro: null, cupRounds: [0, 2],
    clubs: [
      { n: "EA Guingamp", d: "Ligue 2 (D2 FR)", g: 34 },
      { n: "SC Bastia", d: "Ligue 2 (D2 FR)", g: 34 },
      { n: "Amiens SC", d: "Ligue 2 (D2 FR)", g: 34 },
      { n: "Pau FC", d: "Ligue 2 (D2 FR)", g: 34 },
      { n: "Annecy FC", d: "Ligue 2 (D2 FR)", g: 34 },
      { n: "Stade Lavallois", d: "Ligue 2 (D2 FR)", g: 34 },
      { n: "Rodez AF", d: "Ligue 2 (D2 FR)", g: 34 },
      { n: "USL Dunkerque", d: "Ligue 2 (D2 FR)", g: 34 },
      { n: "Red Star FC", d: "Ligue 2 (D2 FR)", g: 34 },
      { n: "FC Martigues", d: "Ligue 2 (D2 FR)", g: 34 },
      { n: "Grenoble Foot 38", d: "Ligue 2 (D2 FR)", g: 34 },
      { n: "Rotherham United", d: "Championship (D2 ENG)", g: 46 },
      { n: "Plymouth Argyle", d: "Championship (D2 ENG)", g: 46 },
      { n: "Oxford United", d: "Championship (D2 ENG)", g: 46 },
      { n: "Portsmouth", d: "Championship (D2 ENG)", g: 46 },
      { n: "Luton Town", d: "Championship (D2 ENG)", g: 46 },
      { n: "Blackburn Rovers", d: "Championship (D2 ENG)", g: 46 },
      { n: "Albacete", d: "LaLiga 2 (D2 ESP)", g: 42 },
      { n: "Racing Ferrol", d: "LaLiga 2 (D2 ESP)", g: 42 },
      { n: "Eldense", d: "LaLiga 2 (D2 ESP)", g: 42 },
      { n: "Cartagena", d: "LaLiga 2 (D2 ESP)", g: 42 },
      { n: "Tenerife", d: "LaLiga 2 (D2 ESP)", g: 42 },
      { n: "Cosenza", d: "Serie B (D2 ITA)", g: 38 },
      { n: "Ternana", d: "Serie B (D2 ITA)", g: 38 },
      { n: "Ascoli", d: "Serie B (D2 ITA)", g: 38 },
      { n: "Reggiana", d: "Serie B (D2 ITA)", g: 38 },
      { n: "Cittadella", d: "Serie B (D2 ITA)", g: 38 },
      { n: "Eintracht Braunschweig", d: "2. Bundesliga (D2 GER)", g: 34 },
      { n: "SV Wehen Wiesbaden", d: "2. Bundesliga (D2 GER)", g: 34 },
      { n: "SSV Ulm", d: "2. Bundesliga (D2 GER)", g: 34 },
      { n: "Preußen Münster", d: "2. Bundesliga (D2 GER)", g: 34 },
      { n: "Jahn Ratisbonne", d: "2. Bundesliga (D2 GER)", g: 34 },
      { n: "Académico Viseu", d: "Liga 2 (D2 POR)", g: 34 },
      { n: "Leixões", d: "Liga 2 (D2 POR)", g: 34 },
      { n: "Torreense", d: "Liga 2 (D2 POR)", g: 34 },
      { n: "Feirense", d: "Liga 2 (D2 POR)", g: 34 },
      { n: "Helmond Sport", d: "Eerste Divisie (D2 NED)", g: 38 },
      { n: "TOP Oss", d: "Eerste Divisie (D2 NED)", g: 38 },
      { n: "FC Den Bosch", d: "Eerste Divisie (D2 NED)", g: 38 },
      { n: "MVV Maastricht", d: "Eerste Divisie (D2 NED)", g: 38 },
      { n: "Paysandu", d: "Série B (D2 BRA)", g: 38 },
      { n: "Ponte Preta", d: "Série B (D2 BRA)", g: 38 },
      { n: "Guarani", d: "Série B (D2 BRA)", g: 38 },
      { n: "Brusque", d: "Série B (D2 BRA)", g: 38 },
      { n: "Nueva Chicago", d: "Primera Nacional (D2 ARG)", g: 38 },
      { n: "Deportivo Morón", d: "Primera Nacional (D2 ARG)", g: 38 },
      { n: "Almagro", d: "Primera Nacional (D2 ARG)", g: 38 },
      { n: "Rampla Juniors", d: "Segunda División (D2 URU)", g: 30 },
      { n: "Central Español", d: "Segunda División (D2 URU)", g: 30 },
      { n: "Albion FC", d: "Segunda División (D2 URU)", g: 30 },
    ],
  },
  {
    max: 67, label: "Deuxième division — haut de tableau",
    fee: [600000, 4000000], salary: [45000, 130000], euro: null, cupRounds: [0, 3],
    clubs: [
      { n: "SM Caen", d: "Ligue 2 (D2 FR)", g: 34 },
      { n: "Clermont Foot", d: "Ligue 2 (D2 FR)", g: 34 },
      { n: "Troyes AC", d: "Ligue 2 (D2 FR)", g: 34 },
      { n: "AC Ajaccio", d: "Ligue 2 (D2 FR)", g: 34 },
      { n: "Le Mans FC", d: "Ligue 2 (D2 FR)", g: 34 },
      { n: "Norwich City", d: "Championship (D2 ENG)", g: 46 },
      { n: "Hull City", d: "Championship (D2 ENG)", g: 46 },
      { n: "Cardiff City", d: "Championship (D2 ENG)", g: 46 },
      { n: "Stoke City", d: "Championship (D2 ENG)", g: 46 },
      { n: "Middlesbrough", d: "Championship (D2 ENG)", g: 46 },
      { n: "Coventry City", d: "Championship (D2 ENG)", g: 46 },
      { n: "Preston North End", d: "Championship (D2 ENG)", g: 46 },
      { n: "Bristol City", d: "Championship (D2 ENG)", g: 46 },
      { n: "Millwall", d: "Championship (D2 ENG)", g: 46 },
      { n: "Swansea City", d: "Championship (D2 ENG)", g: 46 },
      { n: "Queens Park Rangers", d: "Championship (D2 ENG)", g: 46 },
      { n: "Sheffield Wednesday", d: "Championship (D2 ENG)", g: 46 },
      { n: "West Bromwich Albion", d: "Championship (D2 ENG)", g: 46 },
      { n: "Real Zaragoza", d: "LaLiga 2 (D2 ESP)", g: 42 },
      { n: "Sporting Gijón", d: "LaLiga 2 (D2 ESP)", g: 42 },
      { n: "Racing Santander", d: "LaLiga 2 (D2 ESP)", g: 42 },
      { n: "Elche CF", d: "LaLiga 2 (D2 ESP)", g: 42 },
      { n: "Levante UD", d: "LaLiga 2 (D2 ESP)", g: 42 },
      { n: "Real Oviedo", d: "LaLiga 2 (D2 ESP)", g: 42 },
      { n: "Eibar", d: "LaLiga 2 (D2 ESP)", g: 42 },
      { n: "Deportivo La Corogne", d: "LaLiga 2 (D2 ESP)", g: 42 },
      { n: "Sampdoria", d: "Serie B (D2 ITA)", g: 38 },
      { n: "Bari", d: "Serie B (D2 ITA)", g: 38 },
      { n: "Palerme", d: "Serie B (D2 ITA)", g: 38 },
      { n: "Brescia", d: "Serie B (D2 ITA)", g: 38 },
      { n: "Spezia", d: "Serie B (D2 ITA)", g: 38 },
      { n: "Cremonese", d: "Serie B (D2 ITA)", g: 38 },
      { n: "Salernitana", d: "Serie B (D2 ITA)", g: 38 },
      { n: "Pise", d: "Serie B (D2 ITA)", g: 38 },
      { n: "Hertha Berlin", d: "2. Bundesliga (D2 GER)", g: 34 },
      { n: "Hambourg SV", d: "2. Bundesliga (D2 GER)", g: 34 },
      { n: "Schalke 04", d: "2. Bundesliga (D2 GER)", g: 34 },
      { n: "Fortuna Düsseldorf", d: "2. Bundesliga (D2 GER)", g: 34 },
      { n: "Hanovre 96", d: "2. Bundesliga (D2 GER)", g: 34 },
      { n: "Karlsruher SC", d: "2. Bundesliga (D2 GER)", g: 34 },
      { n: "Nuremberg", d: "2. Bundesliga (D2 GER)", g: 34 },
      { n: "1. FC Kaiserslautern", d: "2. Bundesliga (D2 GER)", g: 34 },
      { n: "Estoril Praia", d: "Liga 2 (D2 POR)", g: 34 },
      { n: "Penafiel", d: "Liga 2 (D2 POR)", g: 34 },
      { n: "Tondela", d: "Liga 2 (D2 POR)", g: 34 },
      { n: "Roda JC", d: "Eerste Divisie (D2 NED)", g: 38 },
      { n: "De Graafschap", d: "Eerste Divisie (D2 NED)", g: 38 },
      { n: "VVV-Venlo", d: "Eerste Divisie (D2 NED)", g: 38 },
      { n: "FC Eindhoven", d: "Eerste Divisie (D2 NED)", g: 38 },
      { n: "Coritiba", d: "Série B (D2 BRA)", g: 38 },
      { n: "Santos FC", d: "Série B (D2 BRA)", g: 38 },
      { n: "Goiás", d: "Série B (D2 BRA)", g: 38 },
      { n: "América Mineiro", d: "Série B (D2 BRA)", g: 38 },
      { n: "San Martín", d: "Primera Nacional (D2 ARG)", g: 38 },
      { n: "Ferro Carril Oeste", d: "Primera Nacional (D2 ARG)", g: 38 },
      { n: "Colón", d: "Primera Nacional (D2 ARG)", g: 38 },
    ],
  },
  {
    max: 76, label: "Première division",
    fee: [4000000, 20000000], salary: [150000, 650000], euro: null, cupRounds: [1, 4],
    clubs: [
      { n: "Stade Brestois", d: "Ligue 1 (D1 FR)", g: 34 },
      { n: "Toulouse FC", d: "Ligue 1 (D1 FR)", g: 34 },
      { n: "Montpellier HSC", d: "Ligue 1 (D1 FR)", g: 34 },
      { n: "FC Nantes", d: "Ligue 1 (D1 FR)", g: 34 },
      { n: "Angers SCO", d: "Ligue 1 (D1 FR)", g: 34 },
      { n: "Le Havre AC", d: "Ligue 1 (D1 FR)", g: 34 },
      { n: "AJ Auxerre", d: "Ligue 1 (D1 FR)", g: 34 },
      { n: "Stade de Reims", d: "Ligue 1 (D1 FR)", g: 34 },
      { n: "RC Strasbourg", d: "Ligue 1 (D1 FR)", g: 34 },
      { n: "FC Metz", d: "Ligue 1 (D1 FR)", g: 34 },
      { n: "FC Lorient", d: "Ligue 1 (D1 FR)", g: 34 },
      { n: "Brentford", d: "Premier League (D1 ENG)", g: 38 },
      { n: "Everton", d: "Premier League (D1 ENG)", g: 38 },
      { n: "Fulham", d: "Premier League (D1 ENG)", g: 38 },
      { n: "Wolverhampton", d: "Premier League (D1 ENG)", g: 38 },
      { n: "Burnley", d: "Premier League (D1 ENG)", g: 38 },
      { n: "Crystal Palace", d: "Premier League (D1 ENG)", g: 38 },
      { n: "Nottingham Forest", d: "Premier League (D1 ENG)", g: 38 },
      { n: "Bournemouth", d: "Premier League (D1 ENG)", g: 38 },
      { n: "Southampton", d: "Premier League (D1 ENG)", g: 38 },
      { n: "Leeds United", d: "Premier League (D1 ENG)", g: 38 },
      { n: "Leicester City", d: "Premier League (D1 ENG)", g: 38 },
      { n: "Getafe", d: "LaLiga (D1 ESP)", g: 38 },
      { n: "Rayo Vallecano", d: "LaLiga (D1 ESP)", g: 38 },
      { n: "RCD Mallorca", d: "LaLiga (D1 ESP)", g: 38 },
      { n: "Celta Vigo", d: "LaLiga (D1 ESP)", g: 38 },
      { n: "CA Osasuna", d: "LaLiga (D1 ESP)", g: 38 },
      { n: "Deportivo Alavés", d: "LaLiga (D1 ESP)", g: 38 },
      { n: "UD Las Palmas", d: "LaLiga (D1 ESP)", g: 38 },
      { n: "Valence CF", d: "LaLiga (D1 ESP)", g: 38 },
      { n: "Espanyol", d: "LaLiga (D1 ESP)", g: 38 },
      { n: "Cagliari", d: "Serie A (D1 ITA)", g: 38 },
      { n: "Empoli", d: "Serie A (D1 ITA)", g: 38 },
      { n: "Udinese", d: "Serie A (D1 ITA)", g: 38 },
      { n: "Hellas Vérone", d: "Serie A (D1 ITA)", g: 38 },
      { n: "Torino FC", d: "Serie A (D1 ITA)", g: 38 },
      { n: "Genoa CFC", d: "Serie A (D1 ITA)", g: 38 },
      { n: "US Lecce", d: "Serie A (D1 ITA)", g: 38 },
      { n: "Parma Calcio", d: "Serie A (D1 ITA)", g: 38 },
      { n: "Venezia FC", d: "Serie A (D1 ITA)", g: 38 },
      { n: "Como 1907", d: "Serie A (D1 ITA)", g: 38 },
      { n: "Werder Brême", d: "Bundesliga (D1 GER)", g: 34 },
      { n: "FC Augsbourg", d: "Bundesliga (D1 GER)", g: 34 },
      { n: "Mayence 05", d: "Bundesliga (D1 GER)", g: 34 },
      { n: "VfL Bochum", d: "Bundesliga (D1 GER)", g: 34 },
      { n: "Heidenheim", d: "Bundesliga (D1 GER)", g: 34 },
      { n: "St. Pauli", d: "Bundesliga (D1 GER)", g: 34 },
      { n: "Holstein Kiel", d: "Bundesliga (D1 GER)", g: 34 },
      { n: "Union Berlin", d: "Bundesliga (D1 GER)", g: 34 },
      { n: "SC Fribourg", d: "Bundesliga (D1 GER)", g: 34 },
      { n: "Borussia M'gladbach", d: "Bundesliga (D1 GER)", g: 34 },
      { n: "TSG Hoffenheim", d: "Bundesliga (D1 GER)", g: 34 },
      { n: "VfL Wolfsbourg", d: "Bundesliga (D1 GER)", g: 34 },
      { n: "Vitória Guimarães", d: "Primeira Liga (D1 POR)", g: 34 },
      { n: "Boavista", d: "Primeira Liga (D1 POR)", g: 34 },
      { n: "Rio Ave", d: "Primeira Liga (D1 POR)", g: 34 },
      { n: "Famalicão", d: "Primeira Liga (D1 POR)", g: 34 },
      { n: "Moreirense", d: "Primeira Liga (D1 POR)", g: 34 },
      { n: "Casa Pia", d: "Primeira Liga (D1 POR)", g: 34 },
      { n: "FC Twente", d: "Eredivisie (D1 NED)", g: 34 },
      { n: "AZ Alkmaar", d: "Eredivisie (D1 NED)", g: 34 },
      { n: "FC Utrecht", d: "Eredivisie (D1 NED)", g: 34 },
      { n: "Go Ahead Eagles", d: "Eredivisie (D1 NED)", g: 34 },
      { n: "Sparta Rotterdam", d: "Eredivisie (D1 NED)", g: 34 },
      { n: "NEC Nimègue", d: "Eredivisie (D1 NED)", g: 34 },
      { n: "Grêmio", d: "Série A (D1 BRA)", g: 38 },
      { n: "Internacional", d: "Série A (D1 BRA)", g: 38 },
      { n: "Fluminense", d: "Série A (D1 BRA)", g: 38 },
      { n: "Vasco da Gama", d: "Série A (D1 BRA)", g: 38 },
      { n: "Athletico Paranaense", d: "Série A (D1 BRA)", g: 38 },
      { n: "Cruzeiro", d: "Série A (D1 BRA)", g: 38 },
      { n: "Bahia", d: "Série A (D1 BRA)", g: 38 },
      { n: "Fortaleza", d: "Série A (D1 BRA)", g: 38 },
      { n: "Racing Club", d: "Primera División (D1 ARG)", g: 30 },
      { n: "Independiente", d: "Primera División (D1 ARG)", g: 30 },
      { n: "Estudiantes", d: "Primera División (D1 ARG)", g: 30 },
      { n: "Vélez Sarsfield", d: "Primera División (D1 ARG)", g: 30 },
      { n: "San Lorenzo", d: "Primera División (D1 ARG)", g: 30 },
      { n: "Talleres", d: "Primera División (D1 ARG)", g: 30 },
      { n: "Defensor Sporting", d: "Primera División (D1 URU)", g: 30 },
      { n: "Danubio", d: "Primera División (D1 URU)", g: 30 },
      { n: "Liverpool Montevideo", d: "Primera División (D1 URU)", g: 30 },
      { n: "Montevideo City", d: "Primera División (D1 URU)", g: 30 },
    ],
  },
  {
    max: 84, label: "Coupe d'Europe",
    fee: [18000000, 65000000], salary: [700000, 3000000], euro: "Ligue Europa", cupRounds: [2, 5],
    clubs: [
      { n: "OGC Nice", d: "Ligue 1 (D1 FR)", g: 34 },
      { n: "RC Lens", d: "Ligue 1 (D1 FR)", g: 34 },
      { n: "Olympique Lyonnais", d: "Ligue 1 (D1 FR)", g: 34 },
      { n: "Stade Rennais", d: "Ligue 1 (D1 FR)", g: 34 },
      { n: "LOSC Lille", d: "Ligue 1 (D1 FR)", g: 34 },
      { n: "Aston Villa", d: "Premier League (D1 ENG)", g: 38 },
      { n: "Newcastle United", d: "Premier League (D1 ENG)", g: 38 },
      { n: "Tottenham", d: "Premier League (D1 ENG)", g: 38 },
      { n: "West Ham United", d: "Premier League (D1 ENG)", g: 38 },
      { n: "Brighton", d: "Premier League (D1 ENG)", g: 38 },
      { n: "Villarreal CF", d: "LaLiga (D1 ESP)", g: 38 },
      { n: "Real Betis", d: "LaLiga (D1 ESP)", g: 38 },
      { n: "Athletic Bilbao", d: "LaLiga (D1 ESP)", g: 38 },
      { n: "Real Sociedad", d: "LaLiga (D1 ESP)", g: 38 },
      { n: "Séville FC", d: "LaLiga (D1 ESP)", g: 38 },
      { n: "AS Roma", d: "Serie A (D1 ITA)", g: 38 },
      { n: "SS Lazio", d: "Serie A (D1 ITA)", g: 38 },
      { n: "Atalanta", d: "Serie A (D1 ITA)", g: 38 },
      { n: "Fiorentina", d: "Serie A (D1 ITA)", g: 38 },
      { n: "Bologne FC", d: "Serie A (D1 ITA)", g: 38 },
      { n: "Bayer Leverkusen", d: "Bundesliga (D1 GER)", g: 34 },
      { n: "RB Leipzig", d: "Bundesliga (D1 GER)", g: 34 },
      { n: "Eintracht Francfort", d: "Bundesliga (D1 GER)", g: 34 },
      { n: "VfB Stuttgart", d: "Bundesliga (D1 GER)", g: 34 },
      { n: "SL Benfica", d: "Primeira Liga (D1 POR)", g: 34 },
      { n: "FC Porto", d: "Primeira Liga (D1 POR)", g: 34 },
      { n: "Sporting CP", d: "Primeira Liga (D1 POR)", g: 34 },
      { n: "SC Braga", d: "Primeira Liga (D1 POR)", g: 34 },
      { n: "Ajax Amsterdam", d: "Eredivisie (D1 NED)", g: 34 },
      { n: "PSV Eindhoven", d: "Eredivisie (D1 NED)", g: 34 },
      { n: "Feyenoord", d: "Eredivisie (D1 NED)", g: 34 },
      { n: "Flamengo", d: "Série A (D1 BRA)", g: 38 },
      { n: "Palmeiras", d: "Série A (D1 BRA)", g: 38 },
      { n: "São Paulo FC", d: "Série A (D1 BRA)", g: 38 },
      { n: "Corinthians", d: "Série A (D1 BRA)", g: 38 },
      { n: "Botafogo", d: "Série A (D1 BRA)", g: 38 },
      { n: "Boca Juniors", d: "Primera División (D1 ARG)", g: 30 },
      { n: "River Plate", d: "Primera División (D1 ARG)", g: 30 },
      { n: "Peñarol", d: "Primera División (D1 URU)", g: 30 },
      { n: "Nacional Montevideo", d: "Primera División (D1 URU)", g: 30 },
    ],
  },
  {
    max: 999, label: "Élite mondiale",
    fee: [70000000, 200000000], salary: [3500000, 14000000], euro: "Ligue des champions", cupRounds: [3, 6],
    clubs: [
      { n: "Real Madrid", d: "LaLiga (D1 ESP)", g: 38 },
      { n: "FC Barcelone", d: "LaLiga (D1 ESP)", g: 38 },
      { n: "Atlético Madrid", d: "LaLiga (D1 ESP)", g: 38 },
      { n: "Manchester City", d: "Premier League (D1 ENG)", g: 38 },
      { n: "Liverpool FC", d: "Premier League (D1 ENG)", g: 38 },
      { n: "Arsenal FC", d: "Premier League (D1 ENG)", g: 38 },
      { n: "Manchester United", d: "Premier League (D1 ENG)", g: 38 },
      { n: "Chelsea FC", d: "Premier League (D1 ENG)", g: 38 },
      { n: "Bayern Munich", d: "Bundesliga (D1 GER)", g: 34 },
      { n: "Borussia Dortmund", d: "Bundesliga (D1 GER)", g: 34 },
      { n: "Paris Saint-Germain", d: "Ligue 1 (D1 FR)", g: 34 },
      { n: "Olympique de Marseille", d: "Ligue 1 (D1 FR)", g: 34 },
      { n: "AS Monaco", d: "Ligue 1 (D1 FR)", g: 34 },
      { n: "Inter Milan", d: "Serie A (D1 ITA)", g: 38 },
      { n: "AC Milan", d: "Serie A (D1 ITA)", g: 38 },
      { n: "Juventus", d: "Serie A (D1 ITA)", g: 38 },
      { n: "SSC Naples", d: "Serie A (D1 ITA)", g: 38 },
    ],
  },
];
  const CAR_START_POOL = [...CAR_TIERS[0].clubs];

const CAR_NATIONS = [
  { name: "France", pot: 1, comp: "Euro" }, { name: "Brésil", pot: 1, comp: "Copa América" },
  { name: "Argentine", pot: 1, comp: "Copa América" }, { name: "Angleterre", pot: 1, comp: "Euro" },
  { name: "Espagne", pot: 1, comp: "Euro" }, { name: "Allemagne", pot: 1, comp: "Euro" },
  { name: "Portugal", pot: 1, comp: "Euro" }, { name: "Pays-Bas", pot: 1, comp: "Euro" },
  { name: "Italie", pot: 1, comp: "Euro" }, { name: "Belgique", pot: 1, comp: "Euro" },
  { name: "Croatie", pot: 2, comp: "Euro" }, { name: "Uruguay", pot: 2, comp: "Copa América" },
  { name: "Colombie", pot: 2, comp: "Copa América" }, { name: "Maroc", pot: 2, comp: "CAN" },
  { name: "Sénégal", pot: 2, comp: "CAN" }, { name: "Japon", pot: 2, comp: "Coupe d'Asie" },
  { name: "Danemark", pot: 2, comp: "Euro" }, { name: "Suisse", pot: 2, comp: "Euro" },
  { name: "Mexique", pot: 2, comp: "Gold Cup" }, { name: "États-Unis", pot: 2, comp: "Gold Cup" },
  { name: "Autriche", pot: 2, comp: "Euro" }, { name: "Corée du Sud", pot: 2, comp: "Coupe d'Asie" },
  { name: "Suède", pot: 2, comp: "Euro" }, { name: "Pologne", pot: 2, comp: "Euro" },
  { name: "Écosse", pot: 3, comp: "Euro" }, { name: "Norvège", pot: 3, comp: "Euro" },
  { name: "Nigéria", pot: 3, comp: "CAN" }, { name: "Égypte", pot: 3, comp: "CAN" },
  { name: "Algérie", pot: 3, comp: "CAN" }, { name: "Côte d'Ivoire", pot: 3, comp: "CAN" },
  { name: "Ghana", pot: 3, comp: "CAN" }, { name: "Cameroun", pot: 3, comp: "CAN" },
  { name: "Tunisie", pot: 3, comp: "CAN" }, { name: "Australie", pot: 3, comp: "Coupe d'Asie" },
  { name: "Arabie saoudite", pot: 3, comp: "Coupe d'Asie" }, { name: "Qatar", pot: 3, comp: "Coupe d'Asie" },
  { name: "Chili", pot: 3, comp: "Copa América" }, { name: "Pérou", pot: 3, comp: "Copa América" },
  { name: "Équateur", pot: 3, comp: "Copa América" }, { name: "Paraguay", pot: 3, comp: "Copa América" },
  { name: "Canada", pot: 3, comp: "Gold Cup" },
];

  const CAR_CALLUP_THRESHOLD = { 1: 76, 2: 71, 3: 66 };

const CAR_BONUS_EVENTS = [
  { label: "Mois de folie devant le but", note: [2, 3], money: [6000, 22000] },
  { label: "Série de titularisations convaincantes", note: [1, 2], money: [1000, 7000] },
  { label: "Passage en pleine confiance", note: [2, 3], money: [3000, 14000] },
  { label: "Le staff s'appuie sur toi", note: [1, 2], money: [500, 6000] },
  { label: "Bonne dynamique collective", note: [1, 2], money: [1500, 8000] },
  { label: "Presse élogieuse sur ta période", note: [1, 2], money: [1500, 10000] },
  { label: "Sponsor séduit par ta forme", note: [1, 1], money: [15000, 55000] },
  { label: "Physique au top pendant des semaines", note: [2, 3], money: [500, 4500] },
  { label: "Rendement décisif sur le trimestre", note: [2, 3], money: [3000, 16000] },
  { label: "Le public t'a adopté", note: [1, 2], money: [500, 6000] },
];

const CAR_MALUS_EVENTS = [
  { label: "Longue disette devant le but", note: [-2, -1], money: [0, 0] },
  { label: "Passage à vide de plusieurs semaines", note: [-2, -1], money: [0, 0] },
  { label: "Relégué sur le banc", note: [-1, -1], money: [-3000, 0] },
  { label: "Période de blessures à répétition", note: [-2, -2], money: [-10000, -3000] },
  { label: "Méforme physique persistante", note: [-2, -1], money: [0, 0] },
  { label: "Tension avec le staff technique", note: [-1, -1], money: [-3500, 0] },
  { label: "Critiques de la presse sur ta période", note: [-1, -1], money: [0, 0] },
  { label: "Mauvaise dynamique collective", note: [-1, -1], money: [0, 0] },
  { label: "Coup de fatigue en fin de cycle", note: [-1, -1], money: [0, 0] },
  { label: "Suspension après une période indisciplinée", note: [-1, -1], money: [-7000, -1500] },
  { label: "Concurrence à ton poste", note: [-1, -1], money: [0, 0] },
  { label: "Confiance en berne", note: [-2, -1], money: [0, 0] },
];

const CAR_HORSFOOT_EVENTS = [
  "Contrat publicitaire",
  "Investissement immobilier",
  "Partenariat avec une marque",
  "Ouverture d'un restaurant",
  "Droits à l'image revalorisés",
  "Ligne de vêtements personnelle",
  "Apparition dans un jeu vidéo",
];

const CAR_SEASON_RESULTS = [
  { label: "Saison catastrophique", detail: "Relégation. Le vestiaire est à reconstruire.", place: "18e", prime: [0, 5000] },
  { label: "Saison difficile", detail: "Maintien arraché dans la douleur.", place: "15e", prime: [3000, 12000] },
  { label: "Saison moyenne", detail: "Milieu de tableau, sans relief.", place: "10e", prime: [8000, 25000] },
  { label: "Bonne saison", detail: "Qualification européenne décrochée.", place: "5e", prime: [25000, 70000] },
  { label: "Très bonne saison", detail: "Podium et grande campagne.", place: "2e", prime: [60000, 140000] },
  { label: "Champion", detail: "Titre remporté. Le stade a explosé.", place: "1er", prime: [150000, 350000] },
];

  // Small line-icon SVGs matching the original file's lucide-react icons —
  // used instead of emoji so the visuals match the source design (thin
  // monochrome icons, not colorful phone glyphs).
  function carIcon(name, size){
    const s = size || 14;
    const paths = {
      circle: '<circle cx="12" cy="12" r="9"/>',
      trendingUp: '<path d="m23 6-9.5 9.5-5-5L1 18"/><path d="M17 6h6v6"/>',
      trendingDown: '<path d="m23 18-9.5-9.5-5 5L1 6"/><path d="M17 18h6v-6"/>',
      coins: '<circle cx="8" cy="8" r="6"/><path d="M18.09 10.37A6 6 0 1 1 10.34 18M7 6h1v4M16.71 13.88l.7.71-.71.71"/>',
      flag: '<path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"/><path d="M4 22V3"/>',
      trophy: '<path d="M8 21h8M12 17v4M7 4h10v4a5 5 0 0 1-10 0V4Z"/><path d="M17 5h2a2 2 0 0 1 2 2 4 4 0 0 1-4 4M7 5H5a2 2 0 0 0-2 2 4 4 0 0 0 4 4"/>',
      shuffle: '<path d="m18 4 3 3-3 3M21 7H12.5a4 4 0 0 0-3.5 2M3 17h6.5a4 4 0 0 0 3.5-2M18 20l3-3-3-3M3 7h4M17 17h4"/>',
      crosshair: '<circle cx="12" cy="12" r="9"/><path d="M12 2v4M12 18v4M2 12h4M18 12h4"/>',
      target: '<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1"/>',
      send: '<path d="m3 11 18-8-8 18-2.5-8L3 11Z"/>',
      users: '<path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/>',
      flame: '<path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.4-1-2-1-3.5 0-1 .5-2 1.5-3 0 1 .5 2 1.5 2.5C14.5 9 16 10.5 16 13a6 6 0 1 1-12 0c0-1.5.5-3 2-4.5-.5 2 .5 4.5 2.5 6Z"/>',
      globe: '<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3a15 15 0 0 1 0 18M12 3a15 15 0 0 0 0 18"/>',
      arrowRightLeft: '<path d="m16 3 4 4-4 4M20 7H4M8 21l-4-4 4-4M4 17h16"/>',
      wallet: '<path d="M20 12V8a2 2 0 0 0-2-2H5a2 2 0 0 0 0 4h15a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7"/><circle cx="17" cy="14" r="1"/>',
      star: '<path d="m12 2 3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2Z"/>',
      rotateCcw: '<path d="M3 12a9 9 0 1 0 3-6.7"/><path d="M3 4v5h5"/>',
      chevronRight: '<path d="m9 18 6-6-6-6"/>',
      helpCircle: '<circle cx="12" cy="12" r="9"/><path d="M9.5 9a2.5 2.5 0 0 1 5 0c0 1.5-2.5 2-2.5 3.5M12 17h.01"/>',
    };
    return `<svg width="${s}" height="${s}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="display:inline-block;vertical-align:-2px;flex:none;">${paths[name]||paths.circle}</svg>`;
  }

  const CAR_CELL_ICON = { normale:'circle', bonus:'trendingUp', malus:'trendingDown', horsfoot:'coins' };
  const CAR_CELL_COLOR = { normale:'#9fb8a8', bonus:'#3f7d4f', malus:'#a83e3e', horsfoot:'#c9a227' };
  const CAR_CELL_NAME = { normale:'Match', bonus:'Bonus', malus:'Malus', horsfoot:'Hors foot' };
  const CAR_EMPTY_CAREER = { matchs:0, buts:0, passes:0, selections:0, butsInter:0, cleanSheets:0 };
  const CAR_EMPTY_FORM = { points:0, events:0 };

  // ---- HELPERS ----
  const crnd = (min,max) => Math.floor(Math.random()*(max-min+1))+min;
  const cpick = (arr) => arr[Math.floor(Math.random()*arr.length)];
  const cfmt = (n) => (n<0?'-':'') + Math.abs(Math.round(n)).toLocaleString('fr-FR') + ' €';

  function carClubInfo(name){
    for(const t of CAR_TIERS){
      const c = t.clubs.find(x => x.n === name);
      if(c) return Object.assign({}, c, { tier: t });
    }
    return { n:name, d:'?', g:34, tier: CAR_TIERS[0] };
  }
  function carLeagueFor(club){
    const c = carClubInfo(club);
    return { name: c.d, games: c.g };
  }
  function carWeightedCase(){
    const r = Math.random();
    let acc = 0;
    for(const pair of CAR_WEIGHTS){ acc += pair[1]; if(r <= acc) return pair[0]; }
    return 'normale';
  }
  function carWeightedPick(pool){
    const r = Math.random();
    let acc = 0;
    for(const item of pool){ acc += item.weight; if(r <= acc) return item; }
    return pool[pool.length-1];
  }
  function carRandomName(nation){
    const key = nation && CAR_NATION_NAMES[nation.name];
    const pool = CAR_NAME_POOLS[key] || CAR_NAME_POOLS.fr;
    return cpick(pool.first) + ' ' + cpick(pool.last);
  }
  function carRandomPoste(){ return 'attaquant'; }
  function carTierFor(note){
    return CAR_TIERS.find(t => note <= t.max) || CAR_TIERS[CAR_TIERS.length-1];
  }
  function carTournamentForYear(year, nation){
    if((year - 2026) % 4 === 0) return { name:'Coupe du monde', major:true };
    if((year - 2024) % 4 === 0) return { name: nation.comp, major:false };
    return null;
  }
  function carSimulateSeason(form, note, tier, club, poste){
    const league = carLeagueFor(club);
    const cupGames = crnd(tier.cupRounds[0], tier.cupRounds[1]);
    const euroGames = tier.euro ? (tier.euro === 'Ligue des champions' ? crnd(6,13) : crnd(6,11)) : 0;
    const totalFixtures = league.games + cupGames + euroGames;
    const formIdx = form.events > 0 ? Math.min(form.points/(form.events*2.2), 1) : 0.5;
    const availability = Math.min(0.62 + (note-55)/130 + formIdx*0.12, 0.94);
    const played = Math.max(8, Math.round(totalFixtures * availability * (0.92 + Math.random()*0.16)));
    if(poste === 'gardien'){
      const csBase = 0.07 + Math.max(0, note-48)*0.0068;
      const csRate = Math.min(0.58, Math.max(0.05, csBase*(0.8+formIdx*0.4)*(0.85+Math.random()*0.3)));
      const cleanSheets = Math.max(0, Math.round(played*csRate));
      const passes = Math.random() < 0.15 ? crnd(0,1) : 0; // the rare long-ball assist
      return {
        league: league.name, leagueGames: league.games, cupGames, euroGames, euroName: tier.euro,
        matchs: played, buts: 0, passes, cleanSheets, ratio: played ? (cleanSheets/played) * 4.0 : 0,
      };
    }
    const base = 0.14 + Math.max(0, note-48)*0.0155;
    const gpg = Math.min(1.05, Math.max(0.09, base*(0.75+formIdx*0.5)*(0.88+Math.random()*0.26)));
    const buts = Math.max(0, Math.round(played*gpg));
    const passes = Math.max(0, Math.round(played*gpg*(0.32+Math.random()*0.3)));
    return {
      league: league.name, leagueGames: league.games, cupGames, euroGames, euroName: tier.euro,
      matchs: played, buts, passes, cleanSheets:0, ratio: played ? (buts+passes)/played : 0,
    };
  }
  // Historically dominant clubs get an extra edge when it comes to actually
  // winning the league — matches how these clubs behave in real football,
  // where squad depth and financial power matter as much as one player's form.
  const CAR_SUPER_CLUBS = [
    'Real Madrid','Barcelone','Bayern Munich','Paris Saint-Germain','Manchester City',
    'Liverpool','Juventus','Inter Milan','Manchester United','Ajax','Porto','Benfica',
    'Boca Juniors','River Plate','Flamengo','Al Hilal','Al Nassr',
  ];
  function carClubStrength(clubName){
    // Deterministic per-club multiplier so the SAME club always has the
    // same relative pull across different careers — a small club never
    // randomly becomes a title-winning machine one career and a relegation
    // fighter the next.
    let hash = 0;
    for(let i=0;i<clubName.length;i++) hash = (hash * 31 + clubName.charCodeAt(i)) >>> 0;
    let strength = 0.65 + (hash % 1000) / 1000 * 0.7; // spread: 0.65–1.35
    if(CAR_SUPER_CLUBS.some(sc => clubName.includes(sc))) strength += 0.55;
    return strength;
  }
  function carClubTrophies(idx, tier, club, seasonStats){
    const out = [];
    const league = carLeagueFor(club);
    if(idx === 5){
      // A personal idx=5 season means you were part of a genuine title
      // challenge — but whether the CLUB actually lifts the trophy depends
      // on its real pulling power within its league, not just your form.
      const strength = carClubStrength(club);
      const titleChance = Math.max(0.08, Math.min(0.92, 0.15 + (strength - 0.65) * 0.75));
      if(Math.random() < titleChance) out.push('Champion — ' + league.name);
    }
    if(idx >= 4 && Math.random() < 0.45) out.push('Coupe nationale');
    if(CR.poste === 'gardien'){
      if(seasonStats.cleanSheets >= 7 && idx >= 3 && Math.random() < 0.5) out.push('Meilleur gardien — ' + league.name);
      if(seasonStats.cleanSheets >= 10 && idx >= 4 && Math.random() < 0.30) out.push("Gant d'Or");
      if(seasonStats.matchs && (seasonStats.cleanSheets/seasonStats.matchs) >= 0.42 && idx === 5 && Math.random() < 0.22) out.push('Record d\'invincibilité');
      if(CR.note >= 84 && idx === 5 && seasonStats.cleanSheets >= 6 && Math.random() < 0.26) out.push("Ballon d'Or");
    } else {
      if(seasonStats.buts >= 22 && idx >= 3 && Math.random() < 0.5) out.push('Meilleur buteur — ' + league.name);
      if(seasonStats.buts >= 28 && idx >= 4 && Math.random() < 0.30) out.push("Soulier d'Or");
      // A truly monster season (55+ combined goals+assists at a high note)
      // wins the Ballon d'Or outright — no dice roll needed, that level of
      // output speaks for itself. Otherwise it stays a rarer, probabilistic
      // honour for merely great (rather than historic) seasons.
      if(CR.note >= 87 && (seasonStats.buts + seasonStats.passes) >= 55){
        out.push("Ballon d'Or");
      } else if(CR.note >= 84 && idx === 5 && seasonStats.buts >= 14 && Math.random() < 0.26){
        out.push("Ballon d'Or");
      }
    }
    return out;
  }
  function carBuildOffers(count, note, currentClub){
    const baseIdx = CAR_TIERS.findIndex(t => note <= t.max);
    const idx = baseIdx === -1 ? CAR_TIERS.length-1 : baseIdx;
    const offers = [];
    const used = new Set([currentClub]);
    const kinds = ['lateral','up','loan'];
    for(let i=0;i<count;i++){
      const kind = i===0 ? 'lateral' : kinds[i % kinds.length];
      const tIdx = kind === 'up' ? Math.min(idx+1, CAR_TIERS.length-1) : idx;
      const t = CAR_TIERS[tIdx];
      const pool = t.clubs.filter(c => !used.has(c.n));
      const c = pool.length ? cpick(pool) : cpick(t.clubs);
      used.add(c.n);
      if(kind === 'loan'){
        offers.push({ id:'o'+i, kind:'loan', club:c.n, div:c.d, tier:t.label, fee:0, duration:1,
          salary: Math.round(crnd(t.salary[0], t.salary[1]) * 0.75), note:"Prêt d'une saison — temps de jeu garanti" });
      } else {
        offers.push({ id:'o'+i, kind, club:c.n, div:c.d, tier:t.label, duration: crnd(2,4),
          fee: crnd(t.fee[0], t.fee[1]), salary: crnd(t.salary[0], t.salary[1]),
          note: kind==='up' ? 'Palier supérieur — plus de pression' : 'Projet stable' });
      }
    }
    return offers;
  }
  function carRatingStyle(note){
    if(note >= 85) return {
      bg:'linear-gradient(135deg, rgba(255,255,255,.32) 0%, transparent 26%), linear-gradient(145deg, #f0cf6a 0%, #c9a227 35%, #3f7d4f 72%, #245332 100%)',
      text:'#f3efe2', tier:'Élite',
    };
    if(note >= 75) return {
      bg:'linear-gradient(135deg, rgba(255,255,255,.35) 0%, transparent 28%), linear-gradient(145deg, #f0cf6a 0%, #c9a227 55%, #93741a 100%)',
      text:'#1a1a1a', tier:'Or',
    };
    if(note >= 65) return {
      bg:'linear-gradient(135deg, rgba(255,255,255,.32) 0%, transparent 28%), linear-gradient(145deg, #c9ced2 0%, #9aa0a6 55%, #6e7378 100%)',
      text:'#1a1a1a', tier:'Argent',
    };
    return {
      bg:'linear-gradient(135deg, rgba(255,255,255,.24) 0%, transparent 28%), linear-gradient(145deg, #c9905a 0%, #8a5a2b 55%, #5c3a18 100%)',
      text:'#f3efe2', tier:'Bronze',
    };
  }
  function carInitials(name){
    const parts = (name||'').trim().split(/\s+/).filter(Boolean);
    if(!parts.length) return '?';
    return parts.slice(0,2).map(p => p[0].toUpperCase()).join('');
  }
  function carVerdict(peak, trophies, goals, caps, cleanSheets){
    cleanSheets = cleanSheets || 0;
    const outputOk = cleanSheets >= 190 || goals >= 300;
    if(peak >= 98 && trophies >= 15 && outputOk) return 'GOAT';
    if(peak >= 90 && trophies >= 8) return 'Légende du football';
    if(peak >= 87 && trophies >= 4) return 'Star mondiale';
    if(peak >= 82 && (trophies >= 2 || caps >= 40)) return 'Grand joueur';
    if(peak >= 78) return 'Très bonne carrière';
    if(peak >= 73 || goals >= 120 || cleanSheets >= 85) return 'Solide professionnel';
    if(peak >= 67) return 'Carrière honnête';
    if(goals >= 40 || cleanSheets >= 28) return 'Journeyman';
    return 'Carrière difficile';
  }

  // Career-completion XP for the player's MultiPoly profile — scales with
  // how good the career turned out (same tiers shown by carVerdict), so a
  // legendary career is worth meaningfully more than a difficult one.
  const CAR_XP_BY_VERDICT = {
    'Carrière difficile': 40,
    'Journeyman': 55,
    'Carrière honnête': 70,
    'Solide professionnel': 90,
    'Très bonne carrière': 115,
    'Grand joueur': 150,
    'Star mondiale': 200,
    'Légende du football': 280,
  };
  function carAwardCompletionXP(){
    if(CR.xpAwarded) return; // guard: only award once per finished career, even if the finished screen re-renders
    CR.xpAwarded = true;
    const verdict = carVerdict(CR.careerPeak, CR.careerTrophies.length, CR.careerStats.buts, CR.careerStats.selections, CR.careerStats.cleanSheets);
    const xp = CAR_XP_BY_VERDICT[verdict] || 50;
    awardXP(xp);
    if(typeof renderProfileButton === 'function') renderProfileButton();
    if(typeof updateBestCareerNote === 'function') updateBestCareerNote(CR.careerPeak);
    carRecordCareerResult();
    CR.xpEarned = xp;
  }

  // ---- TOP 5 LEADERBOARD ----
  // Automatically tracks the player's 5 best-ever careers (by peak rating),
  // no manual "save" step needed — every completed career is compared
  // against the current top 5 and slotted in if it's good enough.
  const CAR_TOP5_KEY = 'multipoly_career_top5_v1';
  function carLoadTop5(){
    try{ const raw = localStorage.getItem(CAR_TOP5_KEY); return raw ? JSON.parse(raw) : []; }
    catch(e){ return []; }
  }
  function carSaveTop5(){
    try{ localStorage.setItem(CAR_TOP5_KEY, JSON.stringify(carTop5)); } catch(e){}
  }
  let carTop5 = carLoadTop5();

  // ---- STATE ----
  let CR = null;

  function carMakeDraft(){
    const n = cpick(CAR_NATIONS);
    const startAge = crnd(CAR_MIN_START_AGE, CAR_MAX_START_AGE);
    const retireAge = crnd(CAR_RETIRE_AGE_MIN, CAR_RETIRE_AGE_MAX);
    const base = 52 + (startAge - CAR_MIN_START_AGE) * 1.5 + crnd(0, 9);
    const note = Math.round(base);
    const r = Math.random();
    const potential = r < 0.30 ? crnd(64,71) : r < 0.62 ? crnd(72,78) : r < 0.85 ? crnd(79,85) : r < 0.97 ? crnd(86,91) : crnd(92,97);
    return {
      nation: n, name: carRandomName(n), poste: CR.poste || 'attaquant',
      club: cpick(CAR_START_POOL).n, startAge, retireAge, note, potential,
    };
  }

  function carDefaultState(){
    const nation = cpick(CAR_NATIONS);
    const startAge = crnd(CAR_MIN_START_AGE, CAR_MAX_START_AGE);
    return {
      phase: 'setup', hasRandomized:false, name:'', poste:null,
      club: cpick(CAR_START_POOL).n, board:[], position:0, seasonNum:1,
      note:60, potential:80, argent:0, salaire:18000,
      seasonForm: Object.assign({}, CAR_EMPTY_FORM),
      careerStats: Object.assign({}, CAR_EMPTY_CAREER),
      careerTrophies:[], careerPeak:60, nation, capped:false,
      startAge, retireAge: crnd(CAR_RETIRE_AGE_MIN, CAR_RETIRE_AGE_MAX), endReason:null,
      shuffling:false, drafts:[], selectedDraft:-1,
      clubSpells:[], log:[], pendingSeasonEnd:false, pendingTransfer:false,
      transferOffers:null, seasonRecap:null, resultCard:null,
      rolling:false, diceFace:1, moving:false,
      xpAwarded:false, xpEarned:0, pendingShootout:null, contractEnd:null,
    };
  }

  function carAge(){ return CR.startAge + CR.seasonNum - 1; }
  function carTotalSeasons(){ return Math.max(1, CR.retireAge - CR.startAge + 1); }
  function carTotalCases(){ return CAR_SEASON_LEN * carTotalSeasons(); }
  function carPosInSeason(){ return CR.position - (CR.seasonNum - 1) * CAR_SEASON_LEN; }
  function carPushLog(text){ CR.log.push(text); }

  function carApplyDraft(d){
    CR.nation = d.nation; CR.name = d.name; CR.poste = d.poste;
    CR.club = d.club; CR.startAge = d.startAge; CR.retireAge = d.retireAge;
    CR.note = d.note; CR.potential = d.potential;
  }

  let carShuffleTimer = null;
  function carRegenerateAll(){
    if(CR.shuffling || CR.drafts.length >= CAR_MAX_DRAFTS || !CR.poste) return;
    CR.shuffling = true;
    renderCareerSetup();
    const wrap = document.getElementById('carCardWrap');
    wrap.classList.add('car-shuffling');
    let ticks = 0;
    carShuffleTimer = setInterval(() => {
      carApplyDraft(carMakeDraft());
      renderCareerIdentityOnly();
      ticks++;
      if(ticks >= 12){
        clearInterval(carShuffleTimer);
        const final = carMakeDraft();
        carApplyDraft(final);
        CR.drafts.push(final);
        CR.selectedDraft = CR.drafts.length - 1;
        CR.shuffling = false;
        CR.hasRandomized = true;
        renderCareerSetup();
        wrap.classList.remove('car-shuffling');
        wrap.classList.add('car-settling');
        setTimeout(() => wrap.classList.remove('car-settling'), 400);
      }
    }, 80);
  }
  function carChooseDraft(i){
    if(CR.shuffling || !CR.drafts[i]) return;
    CR.selectedDraft = i;
    carApplyDraft(CR.drafts[i]);
    renderCareerSetup();
  }

  function carStartGame(){
    if(!CR.name.trim()) CR.name = carRandomName(CR.nation);
    const seasons = carTotalSeasons();
    const board = [];
    for(let i=0;i<CAR_SEASON_LEN*seasons;i++) board.push(carWeightedCase());
    CR.board = board;
    CR.position = 0;
    CR.seasonNum = 1;
    // note/potential were already fixed at draft time (see carMakeDraft) —
    // this is exactly what the setup screen showed, so it never mismatches.
    CR.careerPeak = CR.note;
    CR.argent = 0;
    CR.salaire = 18000;
    // First professional contract runs 2 or 3 seasons — the first transfer
    // window only opens once it expires.
    CR.contractEnd = CAR_START_YEAR + crnd(2,3) - 1;
    CR.seasonForm = Object.assign({}, CAR_EMPTY_FORM);
    CR.careerStats = Object.assign({}, CAR_EMPTY_CAREER);
    CR.careerTrophies = [];
    CR.clubSpells = [];
    CR.capped = false;
    CR.endReason = null;
    CR.log = [];
    CR.pendingSeasonEnd = false;
    CR.pendingTransfer = false;
    CR.resultCard = null;
    CR.transferOffers = null;
    CR.seasonRecap = null;
    CR.pendingShootout = null;
    CR.diceFace = 1;
    carPushLog(`Début de carrière chez ${CR.club}, ${CR.startAge} ans.`);
    CR.phase = 'playing';
    renderCareerPhase();
  }

  function carNewCareer(){
    CR = carDefaultState();
    renderCareerPhase();
  }

  function carRetireNow(){
    document.getElementById('carRetireModal').style.display = 'none';
    CR.endReason = 'choice';
    CR.phase = 'finished';
    carAwardCompletionXP();
    renderCareerPhase();
  }

  let carRollTimer = null;
  function carThrowDice(resolve){
    if(CR.rolling) return;
    CR.rolling = true;
    renderCareerAction();
    let ticks = 0;
    carRollTimer = setInterval(() => {
      CR.diceFace = crnd(1,6);
      renderCareerDie();
      ticks++;
      if(ticks >= 10){
        clearInterval(carRollTimer);
        const final = crnd(1,6);
        CR.diceFace = final;
        CR.rolling = false;
        renderCareerAction();
        resolve(final);
      }
    }, 70);
  }

  let carWalkTimer = null;
  function carWalkTo(steps, cb){
    CR.moving = true;
    let s = 0;
    renderCareerAction();
    renderCareerRoute();
    carWalkTimer = setInterval(() => {
      s += 1;
      CR._moveOffset = s;
      renderCareerRoute();
      if(s >= steps){
        clearInterval(carWalkTimer);
        CR.moving = false;
        CR._moveOffset = 0;
        cb();
      }
    }, 180);
  }

  function carRollMove(){
    if(CR.phase !== 'playing' || CR.pendingSeasonEnd || CR.pendingTransfer || CR.resultCard || CR.transferOffers || CR.seasonRecap || CR.moving) return;
    carThrowDice((dice) => {
      const seasonEndIndex = CR.seasonNum * CAR_SEASON_LEN;
      const target = Math.min(CR.position + dice, seasonEndIndex);
      const steps = target - CR.position;
      if(steps <= 0) return;
      carWalkTo(steps, () => carLandOn(target, steps));
    });
  }

  function carLandOn(target, steps){
    steps = steps || 1;
    const type = CR.board[target-1];
    const weeklyPay = Math.round(CR.salaire / CAR_SEASON_LEN * steps);
    let dn = 0, dm = weeklyPay, title = '', lines = [];
    const L = (text, tone) => ({ text, tone: tone || 'neutral' });

    if(type === 'normale'){
      title = 'Match tranquille';
      lines = [L(`Salaire perçu : ${cfmt(weeklyPay)}`)];
    } else if(type === 'bonus'){
      const e = cpick(CAR_BONUS_EVENTS);
      dn = crnd(e.note[0], e.note[1]);
      const salaryCut = Math.round(CR.salaire * (0.03 + Math.random() * 0.10));
      dm += crnd(e.money[0], e.money[1]) + salaryCut;
      title = e.label;
    } else if(type === 'malus'){
      const acl = Math.random() < 0.006 + Math.max(0, carAge() - 28) * 0.0012;
      if(acl){
        CR.argent += weeklyPay;
        CR.position = target;
        CR.endReason = 'injury';
        carPushLog(`RUPTURE DES LIGAMENTS CROISÉS — carrière terminée à ${carAge()} ans.`);
        CR.resultCard = {
          kind: 'malus', title: 'Rupture des ligaments croisés', career_ending: true,
          lines: [L('Genou détruit sur un appui anodin.','negative'), L(`${carAge()} ans. Le genou ne suivra plus.`,'negative'), L('Fin de carrière forcée.','negative')],
        };
        renderCareerAction();
        return;
      }
      const e = cpick(CAR_MALUS_EVENTS);
      dn = crnd(e.note[0], e.note[1]);
      const salaryHit = e.money[0] < 0 ? -Math.round(CR.salaire * (0.02 + Math.random() * 0.05)) : 0;
      dm += crnd(e.money[0], e.money[1]) + salaryHit;
      title = e.label;
    } else if(type === 'horsfoot'){
      const gain = Math.round((500 + CR.note*80) * (0.7 + Math.random()*0.8)) + Math.round(CR.salaire * (0.04 + Math.random()*0.12));
      dm += gain;
      title = cpick(CAR_HORSFOOT_EVENTS);
      lines = [L(`Revenu annexe : ${cfmt(gain)}`,'positive')];
    }

    // Cap the note change against the potential ceiling BEFORE building the
    // display lines — showing the raw uncapped roll (e.g. "+2") while the
    // ceiling silently zeroed the real change out made bonuses look broken.
    let delta = dn;
    if(delta > 0){
      const room = CR.potential - CR.note;
      if(room <= 0) delta = 0;
      else if(room < 6) delta = Math.random() < room/6 ? 1 : 0;
    }

    if(type === 'bonus'){
      const extra = dm - weeklyPay;
      lines = [
        delta ? L(`Note générale +${delta}`,'positive') : null,
        extra ? L(`Prime : ${cfmt(extra)}`,'positive') : null,
      ].filter(Boolean);
    } else if(type === 'malus'){
      const extra = dm - weeklyPay;
      lines = [
        delta ? L(`Note générale ${delta}`,'negative') : null,
        extra ? L(`Frais : ${cfmt(extra)}`,'negative') : null,
      ].filter(Boolean);
    }

    if(type === 'normale' || type === 'bonus' || type === 'malus'){
      CR.seasonForm.events += 1;
    }
    if(type === 'bonus'){
      const ev = carWeightedPick(CAR_FORM_EVENTS);
      CR.seasonForm.points += ev.form;
      lines.push(L(`${ev.label} ⚡`,'positive'));
    }
    if(type === 'malus'){
      CR.seasonForm.points = Math.max(0, CR.seasonForm.points - 1);
    }

    CR.note = Math.max(35, Math.min(99, CR.note + delta));
    CR.argent += dm;
    CR.position = target;
    carPushLog(`Case ${target} — ${title}${delta ? ` (note ${delta>0?'+':''}${delta})` : ''}${dm ? `, ${cfmt(dm)}` : ''}.`);
    CR.resultCard = { kind: type, title, lines, deltaNote: delta, deltaMoney: dm };

    if(target % CAR_SEASON_LEN === 0) CR.pendingSeasonEnd = true;
    renderCareerPhase();
  }

  function carResolveSeasonEnd(){
    const tier = carTierFor(CR.note);
    const year = CAR_START_YEAR + CR.seasonNum - 1;
    const stats = carSimulateSeason(CR.seasonForm, CR.note, tier, CR.club, CR.poste);

    let idx;
    if(stats.ratio >= 1.32) idx = 5;
    else if(stats.ratio >= 1.06) idx = 4;
    else if(stats.ratio >= 0.82) idx = 3;
    else if(stats.ratio >= 0.58) idx = 2;
    else if(stats.ratio >= 0.36) idx = 1;
    else idx = 0;

    const r = CAR_SEASON_RESULTS[idx];
    const prime = crnd(r.prime[0], r.prime[1]);
    const honours = carClubTrophies(idx, tier, CR.club, stats);

    const threshold = CAR_CALLUP_THRESHOLD[CR.nation.pot];
    const eligible = CR.note >= threshold;
    const tourney = carTournamentForYear(year, CR.nation);

    const ctx = { tier, year, stats, idx, r, prime, honours, threshold, eligible, tourney };
    carCheckClubFinal(ctx);
  }

  function carCheckClubFinal(ctx){
    const { tier, idx, year } = ctx;
    if(tier.euro && idx >= 4){
      // Reaching a European final at all is already a big ask — only some
      // idx>=4 seasons actually get that far.
      const reachChance = tier.euro === 'Ligue des champions' ? 0.30 : 0.38;
      if(Math.random() < reachChance){
        const strength = carClubStrength(CR.club);
        const winChance = Math.max(0.15, Math.min(0.55, 0.20 + (strength-0.65)*0.4));
        const won = Math.random() < winChance;
        // Only SOME club finals get the interactive shootout treatment —
        // keeps it feeling special rather than routine, and keeps the
        // international final as the more common interactive moment.
        if(Math.random() < 0.45){
          CR.pendingShootout = {
            ctx, isClub: true, tourneyName: tier.euro, year, won,
            run: won ? 'Vainqueur' : 'Finaliste',
            kind: cpick(['penalty','penalty','coup franc','1 contre 1']),
            resolved: false,
          };
          renderCareerPhase();
          return;
        }
        if(won) ctx.honours.push(tier.euro);
      }
    }
    carCheckIntlFinal(ctx);
  }

  function carCheckIntlFinal(ctx){
    const { threshold, eligible, tourney } = ctx;
    if(eligible && tourney){
      // Big international final — instead of a silent background roll,
      // let the player step up and take the decisive shot themselves.
      // The underlying odds are exactly the same carefully-balanced
      // nation/skill formula as before; only the presentation changed.
      const firstCall = !CR.capped;
      const caps = crnd(5,8);
      const gpg = 0.12 + Math.max(0, CR.note - 70) * 0.022;
      const goals = CR.poste === 'gardien' ? 0 : Math.max(0, Math.round(caps * gpg * (0.7 + Math.random()*0.7)));
      // Nation strength matters as much as personal quality: elite
      // footballing nations (pot 1) get a bigger boost than weaker ones
      // (pot 3). Calibrated so that across a WHOLE CAREER (roughly 9 major
      // tournament attempts as your note grows), winning even once with a
      // weak nation stays a genuine underdog story (~30% career chance),
      // not something that happens most of the time.
      const skillGap = (CR.note - threshold) / 30;
      const natBonus = (4 - CR.nation.pot) * 0.055;
      const winProb = Math.max(0.01, Math.min(0.42, -0.09 + skillGap * 0.16 + natBonus));
      const roll = Math.random();
      let run, won;
      if(roll < winProb){ run = 'Vainqueur'; won = true; }
      else if(roll < winProb + 0.15) run = 'Finaliste';
      else if(roll < winProb + 0.35) run = 'Demi-finale';
      else if(roll < winProb + 0.60) run = 'Quart de finale';
      else run = 'Éliminé en poules';
      CR.pendingShootout = {
        ctx, isClub: false, firstCall, caps, goals, run, won, year: ctx.year, tourneyName: tourney.name,
        kind: cpick(['penalty','penalty','coup franc','1 contre 1']), // penalty most common, matches real shootouts
        stage: run === 'Vainqueur' || run === 'Finaliste' ? 'final' : run,
        resolved: false,
      };
      renderCareerPhase();
      return;
    }

    carFinishSeasonEnd(ctx, null);
  }

  function carFinishSeasonEnd(ctx, intlResult){
    const { tier, year, stats, idx, r, prime, honours, threshold, eligible } = ctx;
    let intl = null;

    if(intlResult){
      const { firstCall, caps, goals, run, won, tourneyName } = intlResult;
      if(firstCall) CR.capped = true;
      if(won) CR.careerTrophies.push({ season: CR.seasonNum, label: `${tourneyName} ${year}`, intl:true });
      CR.careerStats.selections += caps;
      CR.careerStats.butsInter += goals;
      intl = { firstCall, caps, goals, tourney: tourneyName, run, won, year };
    } else if(eligible && !ctx.tourney){
      // Eligible for the national team but no major tournament this cycle —
      // still gets caps/goals from regular fixtures, no shootout needed.
      const firstCall = !CR.capped;
      if(firstCall) CR.capped = true;
      const caps = crnd(4,9);
      const gpg = 0.12 + Math.max(0, CR.note - 70) * 0.022;
      const goals = CR.poste === 'gardien' ? 0 : Math.max(0, Math.round(caps * gpg * (0.7 + Math.random()*0.7)));
      CR.careerStats.selections += caps;
      CR.careerStats.butsInter += goals;
      intl = { firstCall, caps, goals, tourney: null, run: null, won: false, year };
    }

    const raw = (idx >= 4 ? 2 : idx === 3 ? 1 : 0) + (intl && intl.won ? 1 : 0);
    const decline = carAge() >= 33 ? -crnd(2,4) : carAge() >= 31 ? -crnd(1,2) : 0;
    const room = CR.potential - CR.note;
    const growth = raw > 0 && room > 0 ? Math.min(raw, Math.max(1, Math.round(room/2))) : 0;
    const noteGain = growth + decline;
    if(noteGain) CR.note = Math.max(35, Math.min(99, CR.note + noteGain));
    CR.careerPeak = Math.max(CR.careerPeak, CR.note);

    CR.argent += prime;
    CR.careerStats.matchs += stats.matchs;
    CR.careerStats.buts += stats.buts;
    CR.careerStats.passes += stats.passes;
    CR.careerStats.cleanSheets += stats.cleanSheets || 0;

    const sp = CR.clubSpells;
    const last = sp[sp.length-1];
    if(last && last.club === CR.club && last.endYear === year - 1){
      last.endYear = year; last.saisons += 1;
      last.matchs += stats.matchs; last.buts += stats.buts; last.passes += stats.passes;
      last.trophees += honours.length;
    } else {
      sp.push({ club: CR.club, startYear: year, endYear: year, saisons:1,
        matchs: stats.matchs, buts: stats.buts, passes: stats.passes, trophees: honours.length });
    }
    if(honours.length) CR.careerTrophies.push(...honours.map(h => ({ season: CR.seasonNum, label: h })));

    carPushLog(`SAISON ${year} — ${CR.club} ${r.place}. ${stats.matchs} matchs, ${CR.poste === 'gardien' ? `${stats.cleanSheets} clean sheets` : `${stats.buts} buts, ${stats.passes} passes`}.`);

    CR.seasonRecap = { season: CR.seasonNum, year, result:r, prime, honours, noteGain, club: CR.club, stats, intl, nation: CR.nation, eligible, threshold };
    CR.pendingSeasonEnd = false;
    CR.pendingShootout = null;
    renderCareerPhase();
  }

  function carCloseSeasonRecap(){
    CR.seasonRecap = null;
    CR.seasonForm = Object.assign({}, CAR_EMPTY_FORM);
    if(CR.position >= carTotalCases()){ CR.phase = 'finished'; carAwardCompletionXP(); renderCareerPhase(); return; }
    CR.seasonNum += 1;
    const year = CAR_START_YEAR + CR.seasonNum - 1;
    if(year > CR.contractEnd) carOpenMercato();
    else renderCareerPhase();
  }

  function carOpenMercato(){
    CR.pendingTransfer = false;
    const count = crnd(2,3);
    // Does the current club still want to keep you? Tied to how well you've
    // been playing relative to what the club expects — in-form players at
    // the right level get renewal offers; those who've fallen off usually
    // don't get a choice and must move on.
    const tier = carTierFor(CR.note);
    const clubInfo = carClubInfo(CR.club);
    const fitScore = CR.note - (clubInfo.tier ? clubInfo.tier.max - 12 : 55);
    const keepChance = Math.max(0.1, Math.min(0.88, 0.5 + fitScore * 0.025));
    const clubWantsToKeep = Math.random() < keepChance;
    CR.transferOffers = {
      label: count >= 3 ? 'Enchères ouvertes' : 'Des clubs te veulent',
      offers: carBuildOffers(count, CR.note, CR.club),
      clubWantsToKeep,
    };
    renderCareerPhase();
  }

  function carAcceptOffer(offer){
    CR.club = offer.club;
    CR.salaire = offer.salary;
    CR.transferOffers = null;
    const duration = offer.duration || crnd(2,4);
    CR.contractEnd = (CAR_START_YEAR + CR.seasonNum - 1) + duration - 1;
    const isLoan = offer.kind === 'loan';
    carPushLog(`TRANSFERT — ${isLoan?'Prêt à':'Signature à'} ${offer.club} (${offer.tier})${offer.fee?` pour ${cfmt(offer.fee)}`:''}. Contrat de ${duration} ans.`);
    CR.resultCard = {
      kind:'transfert', title: isLoan ? `Prêt à ${offer.club}` : `Direction ${offer.club}`,
      lines: [{text:offer.tier,tone:'neutral'}].concat(offer.fee ? [{text:`Indemnité : ${cfmt(offer.fee)}`,tone:'positive'}] : []).concat([{text:`Salaire : ${cfmt(offer.salary)}/saison`,tone:'positive'},{text:`Contrat de ${duration} ans`,tone:'neutral'}]),
    };
    renderCareerPhase();
  }
  function carDeclineOffers(){
    if(!CR.transferOffers || !CR.transferOffers.clubWantsToKeep) return; // must be offered a renewal to stay
    const bump = Math.round(CR.salaire * (0.03 + Math.random()*0.07));
    CR.salaire += bump;
    const duration = crnd(2,4);
    CR.contractEnd = (CAR_START_YEAR + CR.seasonNum - 1) + duration - 1;
    CR.transferOffers = null;
    carPushLog(`TRANSFERT — Offres refusées. ${CR.club} prolonge : +${cfmt(bump)}, contrat de ${duration} ans.`);
    CR.resultCard = { kind:'transfert', title:`Tu restes à ${CR.club}`, lines:[{text:'Fidélité récompensée',tone:'neutral'},{text:`Salaire revalorisé de +${cfmt(bump)}`,tone:'positive'},{text:`Contrat de ${duration} ans`,tone:'neutral'}] };
    renderCareerPhase();
  }

  function carDismissCard(){
    const wasCareerEnding = CR.resultCard && CR.resultCard.career_ending;
    CR.resultCard = null;
    if(wasCareerEnding){ CR.phase = 'finished'; carAwardCompletionXP(); renderCareerPhase(); return; }
    if(CR.pendingTransfer){ carOpenMercato(); return; }
    if(CR.pendingSeasonEnd){ carResolveSeasonEnd(); return; }
    if(CR.position >= carTotalCases()){ CR.phase = 'finished'; carAwardCompletionXP(); }
    renderCareerPhase();
  }

  const CAR_LB_BROKER = 'wss://broker.hivemq.com:8884/mqtt';
  const CAR_LB_TOPIC_PREFIX = 'multipoly-career-lb-v1/';
  const CAR_DEVICE_KEY = 'multipoly_career_device_id_v1';
  function carDeviceId(){
    try{
      let id = localStorage.getItem(CAR_DEVICE_KEY);
      if(!id){ id = 'd' + Math.random().toString(36).slice(2, 12); localStorage.setItem(CAR_DEVICE_KEY, id); }
      return id;
    } catch(e){ return 'd' + Math.random().toString(36).slice(2, 12); }
  }
  function carPublishGlobalBest(entry){
    if(typeof mqtt === 'undefined') return; // library failed to load — global leaderboard just won't have this entry, no crash
    try{
      const client = mqtt.connect(CAR_LB_BROKER, { clientId: 'multipoly-lb-' + Math.random().toString(16).slice(2), clean:true, connectTimeout:6000 });
      client.on('connect', () => {
        client.publish(CAR_LB_TOPIC_PREFIX + carDeviceId(), JSON.stringify(entry), { retain:true, qos:1 }, () => client.end());
      });
      client.on('error', () => { try{ client.end(true); } catch(e){} });
    } catch(e){}
  }

  function carRecordCareerResult(){
    const best = CR.clubSpells.slice().sort((a,b) => b.buts - a.buts)[0];
    const entry = {
      player: CR.name || 'Joueur', nation: CR.nation.name, startAge: CR.startAge, endAge: carAge(),
      peak: CR.careerPeak, verdict: carVerdict(CR.careerPeak, CR.careerTrophies.length, CR.careerStats.buts, CR.careerStats.selections, CR.careerStats.cleanSheets),
      matchs: CR.careerStats.matchs, buts: CR.careerStats.buts, passes: CR.careerStats.passes,
      selections: CR.careerStats.selections, butsInter: CR.careerStats.butsInter, trophies: CR.careerTrophies.length,
      topTrophies: CR.careerTrophies.slice(0,4).map(t => t.label), clubs: CR.clubSpells.length,
      bestClub: best ? { club: best.club, buts: best.buts, matchs: best.matchs } : null,
      argent: CR.argent, ended: CR.endReason === 'injury' ? 'Blessure' : CR.endReason === 'choice' ? 'Retraite' : 'Terme',
      poste: CR.poste, cleanSheets: CR.careerStats.cleanSheets,
      // Real player behind the fictional footballer — so the leaderboard
      // shows who actually achieved it, not just the in-game character name.
      profilePseudo: (typeof getProfilePseudo === 'function' && getProfilePseudo()) || 'Anonyme',
    };
    carTop5.push(entry);
    carTop5.sort((a,b) => b.peak - a.peak || b.buts - a.buts || b.trophies - a.trophies || b.passes - a.passes);
    carTop5 = carTop5.slice(0, CAR_TOP5_SIZE);
    carSaveTop5();
    // Share to the global leaderboard only if this is now this player's own
    // personal best (top of their own list) — keeps the global board to one
    // entry per device, always their finest career. Published as a RETAINED
    // MQTT message, so it stays visible to everyone indefinitely — until
    // this same device beats it — regardless of whether this device is
    // currently online or not; it doesn't need to stay connected.
    if(carTop5[0] === entry) carPublishGlobalBest(entry);
  }

  // ---- RENDER ----
  function renderCareerPhase(){
    document.getElementById('carSetup').style.display = CR.phase === 'setup' ? 'flex' : 'none';
    document.getElementById('carPlaying').style.display = CR.phase === 'playing' ? 'flex' : 'none';
    document.getElementById('carFinished').style.display = CR.phase === 'finished' ? 'flex' : 'none';
    if(CR.phase === 'setup') renderCareerSetup();
    else if(CR.phase === 'playing') renderCareerPlaying();
    else if(CR.phase === 'finished') renderCareerFinished();
  }

  function renderCareerIdentityOnly(){
    const rating = carRatingStyle(CR.note);
    document.getElementById('carRatingNum').textContent = CR.note;
    document.getElementById('carRatingTier').textContent = rating.tier;
    const badge = document.getElementById('carRatingBadge');
    badge.style.background = rating.bg;
    badge.style.color = rating.text;
    const cardWrap = document.getElementById('carCardWrap');
    cardWrap.style.background = rating.bg;
    document.getElementById('carAvatar').style.borderColor = (typeof rating.bg === 'string' && rating.bg.startsWith('#')) ? rating.bg : '#c9a227';
    document.getElementById('carAvatar').textContent = carInitials(CR.name);
    const nameInput = document.getElementById('carNameInput');
    if(document.activeElement !== nameInput) nameInput.value = CR.name;
    document.getElementById('carNationName').textContent = CR.nation.name;
    document.getElementById('carStartAge').textContent = CR.startAge;
    const info = carClubInfo(CR.club);
    document.getElementById('carClubName').textContent = CR.club;
    document.getElementById('carClubDiv').textContent = info.d;
    const crestEl = document.getElementById('carClubCrest');
    if(crestEl) crestEl.textContent = CR.club.replace(/^(FC|AC|AS|SC|CD|CF|RC|OGC|EA)\s+/i, '').slice(0, 3).toUpperCase();
  }

  function renderCareerSetup(){
    const rating = carRatingStyle(CR.note);
    document.getElementById('carRatingNum').textContent = CR.note;
    document.getElementById('carRatingTier').textContent = rating.tier;
    const badge = document.getElementById('carRatingBadge');
    badge.style.background = rating.bg;
    badge.style.color = rating.text;
    renderCareerIdentityOnly();
    const info = carClubInfo(CR.club);
    document.getElementById('carSelectionNation').textContent = CR.nation.name;
    document.getElementById('carSelectionThreshold').textContent = 'seuil ' + CAR_CALLUP_THRESHOLD[CR.nation.pot];
    document.getElementById('carSelectionComp').textContent = CR.nation.comp;
    const cardWrap = document.getElementById('carCardWrap');
    cardWrap.style.background = rating.bg;
    cardWrap.style.opacity = (CR.drafts.length || CR.shuffling) ? 1 : 0.28;
    document.getElementById('carAvatar').style.borderColor = (typeof rating.bg === 'string' && rating.bg.startsWith('#')) ? rating.bg : '#c9a227';

    const draftsBox = document.getElementById('carDrafts');
    if(CR.drafts.length > 0){
      draftsBox.style.display = 'block';
      document.getElementById('carDraftCount').textContent = CR.drafts.length;
      const row = document.getElementById('carDraftsRow');
      row.innerHTML = '';
      for(let i=0;i<CAR_MAX_DRAFTS;i++){
        const d = CR.drafts[i];
        const cell = document.createElement('div');
        if(!d){
          cell.className = 'car-draft-card empty';
          cell.innerHTML = '<span class="empty-label">Vide</span>';
        } else {
          const active = i === CR.selectedDraft;
          cell.className = 'car-draft-card' + (active ? ' active' : '');
          const shortName = d.name.split(' ')[1] || d.name;
          cell.innerHTML = `<div class="dn">${shortName}</div><div class="dm">${d.nation.name} · ${d.startAge} ans</div>`;
          cell.addEventListener('click', () => carChooseDraft(i));
        }
        row.appendChild(cell);
      }
    } else {
      draftsBox.style.display = 'none';
    }

    const shuffleBtn = document.getElementById('carShuffleBtn');
    if(CR.drafts.length < CAR_MAX_DRAFTS){
      shuffleBtn.style.display = 'flex';
      shuffleBtn.disabled = CR.shuffling || !CR.poste;
      shuffleBtn.className = 'start-btn ' + (CR.drafts.length === 0 ? 'car-btn-primary' : 'car-btn-shuffle-sub') + (CR.poste && CR.drafts.length === 0 && !CR.shuffling ? ' pulse-hint' : '');
      const remaining = CAR_MAX_DRAFTS - CR.drafts.length;
      const shuffleIcon = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linejoin="round" style="flex:none;"><rect x="3" y="3" width="18" height="18" rx="3"/><circle cx="8" cy="8" r="1.2" fill="currentColor" stroke="none"/><circle cx="16" cy="8" r="1.2" fill="currentColor" stroke="none"/><circle cx="12" cy="12" r="1.2" fill="currentColor" stroke="none"/><circle cx="8" cy="16" r="1.2" fill="currentColor" stroke="none"/><circle cx="16" cy="16" r="1.2" fill="currentColor" stroke="none"/></svg>';
      shuffleBtn.innerHTML = shuffleIcon + '<span>' + (CR.shuffling ? 'Tirage en cours…' : CR.drafts.length === 0 ? 'Tirer au sort' : `Relancer (${remaining} restant${remaining>1?'s':''})`) + '</span>';
    } else {
      shuffleBtn.style.display = 'none';
    }

    const posteHint = document.getElementById('carPosteHint');
    if(posteHint) posteHint.style.visibility = CR.poste ? 'hidden' : 'visible';
    const posteLocked = CR.drafts.length > 0;
    document.querySelectorAll('.car-poste-choice-btn').forEach(b => {
      b.disabled = posteLocked;
      b.classList.toggle('locked', posteLocked);
      b.classList.toggle('pulse-hint', !CR.poste);
    });

    const keepBtn = document.getElementById('carKeepBtn');
    keepBtn.style.display = (CR.hasRandomized && !CR.shuffling) ? 'flex' : 'none';
    keepBtn.classList.toggle('pulse-hint', CR.hasRandomized && !CR.shuffling);

    document.getElementById('carSeasonsHint').textContent = `${carTotalSeasons()} saisons — ${CR.startAge} à ${CR.retireAge} ans`;
  }

  function renderCareerPlaying(){
    const rating = carRatingStyle(CR.note);
    document.getElementById('carPlaySeasonLabel').textContent = `${CAR_START_YEAR + CR.seasonNum - 1}–${String(CAR_START_YEAR + CR.seasonNum).slice(2)} · ${carAge()} ans`;
    const badge = document.getElementById('carPlayRatingBadge');
    badge.style.background = rating.bg; badge.style.color = rating.text;
    document.getElementById('carPlayRatingNum').textContent = CR.note;
    document.getElementById('carPlayRatingTier').textContent = rating.tier;
    if(CR._lastShownNote !== undefined && CR._lastShownNote !== CR.note){
      const diff = CR.note - CR._lastShownNote;
      badge.classList.remove('car-note-up', 'car-note-down');
      void badge.offsetWidth; // restart the animation even if the same class was already applied
      badge.classList.add(diff > 0 ? 'car-note-up' : 'car-note-down');
      setTimeout(() => badge.classList.remove('car-note-up', 'car-note-down'), 700);
    }
    CR._lastShownNote = CR.note;
    document.getElementById('carPlayName').textContent = CR.name || 'Joueur';
    document.getElementById('carPlayClub').textContent = CR.club;
    document.getElementById('carPlayDiv').innerHTML = carClubInfo(CR.club).d + ' · ' + carIcon('flag',8) + ' ' + CR.nation.name;

    const hideTop = !!(CR.seasonRecap || CR.transferOffers);
    document.getElementById('carStatsRow').style.display = hideTop ? 'none' : 'grid';
    document.getElementById('carProgressBlock').style.display = hideTop ? 'none' : 'block';
    document.getElementById('carArgent').textContent = cfmt(CR.argent);
    document.getElementById('carSalaire').textContent = cfmt(CR.salaire);
    const yearsLeft = CR.contractEnd - (CAR_START_YEAR + CR.seasonNum - 1) + 1;
    document.getElementById('carContractLeft').textContent = yearsLeft <= 1 ? 'Dernière année' : `${yearsLeft} an${yearsLeft>1?'s':''}`;

    document.getElementById('carSeasonProgressLabel').textContent = `Saison ${CR.seasonNum}/${carTotalSeasons()}`;
    const pct = Math.round((carPosInSeason()/CAR_SEASON_LEN)*100);
    document.getElementById('carSeasonProgressPct').textContent = `${carPosInSeason()}/${CAR_SEASON_LEN} · ${pct}%`;
    document.getElementById('carProgressFill').style.width = pct + '%';
    renderCareerRoute();
    renderCareerAction();
  }

  function renderCareerRoute(){
    const routeEl = document.getElementById('carRoute');
    if(!routeEl) return;
    const center = CR.moving ? CR.position + (CR._moveOffset||0) : CR.position;
    const total = carTotalCases();
    let html = '';
    for(let off=-3; off<=3; off++){
      const g = center + off;
      if(g < 0 || g > total){ html += '<div class="car-route-empty"></div>'; continue; }
      if(!(g > 0 && g <= Math.max(CR.position, center))){
        html += '<div class="car-route-cell hidden-cell">?</div>';
        continue;
      }
      const t = CR.board[g-1];
      const isCurrent = g === center && g > 0;
      html += `<div class="car-route-cell${isCurrent?' current':''}" style="background:${CAR_CELL_COLOR[t]}" title="${CAR_CELL_NAME[t]}">${carIcon(CAR_CELL_ICON[t], isCurrent?16:13)}</div>`;
    }
    routeEl.innerHTML = html;
  }

  function renderCareerAction(){
    const zone = document.getElementById('carActionZone');
    if(!zone) return;
    if(CR.pendingShootout){
      const so = CR.pendingShootout;
      zone.innerHTML = careerShootoutHTML(so);
      if(!so.resolved) renderCareerDiePips(document.getElementById('carShootDie'), 1);
      const shootBtn = document.getElementById('carShootoutBtn');
      if(shootBtn) shootBtn.addEventListener('click', carTakeShot);
      const contBtn = document.getElementById('carShootoutContinueBtn');
      if(contBtn) contBtn.addEventListener('click', () => {
        if(so.isClub){
          if(so.won) so.ctx.honours.push(so.tourneyName);
          carCheckIntlFinal(so.ctx);
        } else {
          carFinishSeasonEnd(so.ctx, { firstCall: so.firstCall, caps: so.caps, goals: so.goals, run: so.run, won: so.won, tourneyName: so.tourneyName });
        }
      });
      return;
    }
    if(CR.seasonRecap){
      zone.innerHTML = careerRecapHTML(CR.seasonRecap);
      document.getElementById('carRecapContinueBtn').addEventListener('click', carCloseSeasonRecap);
      return;
    }
    if(CR.transferOffers){
      zone.innerHTML = careerMercatoHTML(CR.transferOffers, CR.club, CR.salaire);
      zone.querySelectorAll('.car-offer-card').forEach((el, i) => {
        el.addEventListener('click', () => carAcceptOffer(CR.transferOffers.offers[i]));
      });
      const declineBtn = document.getElementById('carDeclineBtn');
      if(declineBtn) declineBtn.addEventListener('click', carDeclineOffers);
      return;
    }
    if(CR.resultCard){
      zone.innerHTML = careerResultCardHTML(CR.resultCard);
      document.getElementById('carResultContinueBtn').addEventListener('click', carDismissCard);
      return;
    }
    const busy = CR.rolling || CR.moving;
    zone.innerHTML = `
      <div class="car-dice-panel">
        <div class="car-dice-label">${CR.moving ? 'Déplacement en cours…' : 'Lance le dé pour avancer'}</div>
        <div class="car-die${CR.rolling ? ' bob' : ''}" id="carDieEl"></div>
        <button class="start-btn" id="carRollBtn" type="button" style="margin:0;" ${busy?'disabled':''}>
          ${CR.rolling ? 'Lancer…' : CR.moving ? 'Ça avance…' : 'Lancer le dé'}
        </button>
      </div>
    `;
    renderCareerDie();
    document.getElementById('carRollBtn').addEventListener('click', carRollMove);
  }

  const CAR_PIPS = {
    1: [[1,1]], 2: [[0,0],[2,2]], 3: [[0,0],[1,1],[2,2]],
    4: [[0,0],[0,2],[2,0],[2,2]], 5: [[0,0],[0,2],[1,1],[2,0],[2,2]],
    6: [[0,0],[0,2],[1,0],[1,2],[2,0],[2,2]],
  };
  function renderCareerDie(){
    const die = document.getElementById('carDieEl');
    if(!die) return;
    const cells = CAR_PIPS[CR.diceFace] || CAR_PIPS[1];
    let html = '';
    for(let i=0;i<9;i++){
      const r = Math.floor(i/3), c = i%3;
      const on = cells.some(p => p[0]===r && p[1]===c);
      html += `<div style="display:flex;align-items:center;justify-content:center;">${on ? '<span class="car-die-pip"></span>' : ''}</div>`;
    }
    die.innerHTML = html;
  }

  const CAR_SHOT_FLAVOR = {
    penalty: { label: 'Penalty' },
    'coup franc': { label: 'Coup franc' },
    '1 contre 1': { label: 'Face-à-face' },
  };
  function careerShootoutHTML(so){
    const flavor = CAR_SHOT_FLAVOR[so.kind];
    const isGK = CR.poste === 'gardien';
    const forWhom = so.isClub ? CR.club : CR.nation.name;
    const stageLabel = so.isClub ? 'FINALE DE CLUB' : (so.run === 'Vainqueur' || so.run === 'Finaliste' ? 'FINALE' : so.run === 'Demi-finale' ? 'DEMI-FINALE' : 'PHASE FINALE');

    let cellsHtml = '';
    for(let n=1;n<=6;n++){
      const isShotZone = so.resolved && n === so.shotZone;
      const isDiveZone = so.resolved && n === so.diveZone;
      let mark = '';
      if(isShotZone && isDiveZone) mark = '💥';
      else if(isShotZone) mark = '⚽';
      else if(isDiveZone) mark = '🧤';
      cellsHtml += `<div class="car-goal-zone${isShotZone||isDiveZone?' marked':''}">${mark || `<span class="car-goal-zone-num">${n}</span>`}</div>`;
    }

    return `
      <div class="car-shootout">
        <p class="car-shootout-eyebrow">${stageLabel} — ${so.tourneyName} ${so.year}</p>
        <h3 class="car-shootout-title">${flavor.label} décisif${isGK ? ' — tu es le gardien' : ''}</h3>
        ${so.resolved ? '' : `<p class="car-shootout-desc">${isGK
          ? `L'attaquant s'avance. Lance le dé pour choisir où tu plonges…`
          : `${flavor.label} pour ${forWhom}. Lance le dé pour choisir où tu tires…`}</p>`}
        <div class="car-goal-wrap${so.resolved ? ' resolved' : ''}">
          <div class="car-goal-post"></div>
          <div class="car-goal-net"></div>
          <div class="car-goal-grid" id="carGoalGrid">${cellsHtml}</div>
        </div>
        ${so.resolved
          ? `<p class="car-shootout-result ${so.won ? 'goal' : 'miss'}">${
              isGK
                ? (so.won ? 'ARRÊT ! Tu plonges du bon côté !' : 'BUT ENCAISSÉ ! L\'attaquant a trompé ta détente.')
                : (so.won ? 'BUT ! Le gardien part du mauvais côté !' : 'ARRÊTÉ ! Le gardien a plongé du bon côté !')
            }</p>
             <p class="car-shootout-outcome">${so.run}${so.won ? ' — Titre remporté avec ' + forWhom + ' !' : ''}</p>
             <button class="start-btn car-btn-primary" id="carShootoutContinueBtn" type="button">Continuer</button>`
          : `<div class="car-die" id="carShootDie" style="width:64px;height:64px;padding:9px;margin:0 auto 16px;"></div>
             <button class="start-btn car-btn-primary" id="carShootoutBtn" type="button">Lancer le dé !</button>`
        }
      </div>
    `;
  }
  function carSetGoalZone(n, iconChar, locked){
    const grid = document.getElementById('carGoalGrid');
    if(!grid) return;
    const cells = grid.children;
    for(let i=0;i<cells.length;i++){
      const cellNum = i+1;
      if(cellNum !== n) continue;
      cells[i].classList.toggle('flicker', !locked);
      cells[i].classList.toggle('marked', !!locked);
      cells[i].innerHTML = iconChar || `<span class="car-goal-zone-num">${n}</span>`;
    }
  }
  function carResetGoalZones(){
    const grid = document.getElementById('carGoalGrid');
    if(!grid) return;
    const cells = grid.children;
    for(let i=0;i<cells.length;i++){
      cells[i].className = 'car-goal-zone';
      cells[i].innerHTML = `<span class="car-goal-zone-num">${i+1}</span>`;
    }
  }
  function carTakeShot(){
    const so = CR.pendingShootout;
    if(!so || so.resolved) return;
    const btn = document.getElementById('carShootoutBtn');
    if(btn) btn.disabled = true;
    const die = document.getElementById('carShootDie');
    const isGK = CR.poste === 'gardien';
    const myIcon = isGK ? '🧤' : '⚽';
    // Stage 1: flicker across all 6 zones, synced with the die, slowing
    // down toward the end like a wheel settling — feels far more natural
    // than a constant tick rate.
    const delays = [60,65,72,80,90,102,116,132,150,170,195];
    let step = 0;
    function tick(){
      const face = crnd(1,6);
      renderCareerDiePips(die, face);
      carResetGoalZones();
      carSetGoalZone(face, myIcon, false);
      step++;
      if(step < delays.length){
        setTimeout(tick, delays[step]);
      } else {
        const myZone = crnd(1,6); // the zone the player's roll lands on
        renderCareerDiePips(die, myZone);
        carResetGoalZones();
        carSetGoalZone(myZone, myIcon, true);
        // Stage 2: hold on the player's own zone for a beat — long enough
        // to actually read which number came up — before revealing the
        // opponent's side and the outcome.
        setTimeout(() => {
          // The opponent's zone is chosen to MATCH the roll when the player
          // should succeed at guessing right (GK save, or attacker finding
          // the gap), and to DIFFER when they shouldn't — the underlying
          // win/loss is still the same carefully-balanced probability roll
          // from before, this just gives it a concrete, readable shape.
          let otherZone;
          const matches = isGK ? so.won : !so.won;
          if(matches){
            otherZone = myZone;
          } else {
            do { otherZone = crnd(1,6); } while(otherZone === myZone);
          }
          so.shotZone = isGK ? otherZone : myZone;
          so.diveZone = isGK ? myZone : otherZone;
          so.resolved = true;
          renderCareerAction();
        }, 900);
      }
    }
    tick();
  }
  function renderCareerDiePips(die, face){
    if(!die) return;
    const patterns = {
      1:[4], 2:[0,8], 3:[0,4,8], 4:[0,2,6,8], 5:[0,2,4,6,8], 6:[0,2,3,5,6,8],
    };
    const on = new Set(patterns[face] || []);
    let html = '';
    for(let i=0;i<9;i++) html += on.has(i) ? '<div class="car-die-pip"></div>' : '<span></span>';
    die.innerHTML = html;
  }

  function careerResultCardHTML(card){
    const iconName = card.kind === 'saison' ? 'trophy' : card.kind === 'transfert' ? 'arrowRightLeft' : (CAR_CELL_ICON[card.kind] || 'circle');
    const icon = carIcon(iconName, 26);
    const color = card.kind === 'saison' ? '#2c5aa0' : card.kind === 'transfert' ? '#a83e3e' : (CAR_CELL_COLOR[card.kind] || '#9fb8a8');
    const lines = card.lines.map(l => {
      const toneColor = l.tone === 'positive' ? '#3f7d4f' : l.tone === 'negative' ? '#a83e3e' : '#0b2b1d';
      return `<p class="car-result-line" style="color:${toneColor};font-weight:${l.tone==='neutral'?400:600}">${l.text}</p>`;
    }).join('');
    return `
      <div class="car-result-card">
        <div class="car-result-icon" style="background:${color}">${icon}</div>
        <h3 class="car-result-title">${card.title}</h3>
        <div>${lines}</div>
        <button class="start-btn car-btn-primary" id="carResultContinueBtn" type="button" style="margin-top:14px;">Continuer</button>
      </div>
    `;
  }

  function careerMercatoHTML(market, currentClub, currentSalary){
    const offers = market.offers.map(o => {
      const better = o.salary > currentSalary;
      const tag = o.kind === 'up' ? '<span class="car-offer-tag up">Palier +</span>' : o.kind === 'loan' ? '<span class="car-offer-tag loan">Prêt</span>' : '';
      return `
        <div class="car-offer-card" role="button">
          <div class="car-offer-top">
            <div style="min-width:0;">
              <div class="car-offer-club">${o.club}</div>
              <div class="car-offer-div">${o.div}</div>
            </div>
            ${tag}
          </div>
          <div class="car-offer-money">
            <span style="color:${o.fee ? 'var(--pitch)' : 'var(--ink-soft)'}">${o.fee ? cfmt(o.fee) : 'Libre'}</span>
            <span style="color:${better ? 'var(--pitch)' : 'var(--red)'}">${cfmt(o.salary)}/saison ${better ? '↑' : '↓'}</span>
          </div>
          <div class="car-offer-note">${o.note} · contrat ${o.duration} an${o.duration>1?'s':''}</div>
        </div>
      `;
    }).join('');
    return `
      <div class="car-mercato-card">
        <div class="car-mercato-title">${carIcon('arrowRightLeft',20)} ${market.label}</div>
        <div class="car-mercato-sub">Contrat expiré à ${currentClub} — ${cfmt(currentSalary)}/saison</div>
        ${offers}
        ${market.clubWantsToKeep
          ? `<button class="car-decline-btn" id="carDeclineBtn" type="button">Refuser et rester à ${currentClub}</button>`
          : `<p class="car-mercato-forced-note">${currentClub} ne te propose pas de nouveau contrat. Il faut choisir un nouveau club.</p>`
        }
      </div>
    `;
  }

  function careerRecapHTML(recap){
    const s = recap.stats;
    const cells = CR.poste === 'gardien'
      ? [
          { icon: carIcon('users',15), label:'Matchs joués', value: s.matchs },
          { icon: '🧤', label:'Clean sheets', value: s.cleanSheets },
          { icon: '%', label:'Taux CS', value: s.matchs ? Math.round(s.cleanSheets/s.matchs*100)+'%' : '0%' },
        ]
      : [
          { icon: carIcon('users',15), label:'Matchs joués', value: s.matchs },
          { icon: carIcon('target',15), label:'Buts', value: s.buts },
          { icon: carIcon('send',15), label:'Passes décisives', value: s.passes },
        ];
    const cellsHtml = cells.map((c,i) => `
      <div class="car-stat3-cell" style="animation:panelFadeIn .3s ease ${i*80}ms backwards;">
        <span>${c.icon}</span><b>${c.value}</b><small>${c.label}</small>
      </div>
    `).join('');
    let intlHtml;
    if(recap.intl){
      const intl = recap.intl;
      intlHtml = `
        <div class="car-intl-box">
          <div class="car-intl-title">${carIcon('flag',14)} ${recap.nation.name}${intl.firstCall ? ' — première sélection !' : ''}</div>
          <div class="car-intl-nums"><span><b>${intl.caps}</b> sélections</span><span><b>${intl.goals}</b> buts</span></div>
          ${intl.tourney ? `<div class="car-intl-tourney${intl.won?' won':''}">${carIcon('globe',13)} ${intl.tourney} ${intl.year} — ${intl.run}</div>` : ''}
        </div>
      `;
    } else {
      intlHtml = `<div class="car-recap-box"><span style="font-size:11px;color:var(--ink-soft);">${carIcon('flag',10)} ${recap.nation.name} — pas encore appelé. Atteins <b>${recap.threshold}</b> de note générale.</span></div>`;
    }
    const honoursHtml = recap.honours.length ? recap.honours.map((h,i) => `<div class="car-trophy-row" style="animation:panelFadeIn .3s ease ${i*100}ms backwards;">${carIcon('trophy',12)} ${h}</div>`).join('') : '';
    return `
      <div class="car-recap-card">
        <div class="car-recap-header">
          <div class="car-recap-eyebrow">Saison ${recap.year}–${String(recap.year+1).slice(2)} · ${recap.club}</div>
          <div class="car-recap-title">${recap.result.label}</div>
          <div class="car-recap-detail">${recap.result.detail}</div>
        </div>
        <div class="car-recap-body">
          <div class="car-recap-box">
            <div class="car-recap-box-label">Calendrier</div>
            <div class="car-row"><span>${s.league}</span><b>${s.leagueGames} j.</b></div>
            ${s.cupGames > 0 ? `<div class="car-row"><span>Coupe nationale</span><b>${s.cupGames} m.</b></div>` : ''}
            ${s.euroGames > 0 ? `<div class="car-row"><span>${s.euroName}</span><b>${s.euroGames} m.</b></div>` : ''}
            <div class="car-row" style="border-top:1px solid var(--parchment);margin-top:4px;padding-top:6px;"><span>Classement final</span><b>${recap.result.place}</b></div>
            <div class="car-row"><span>Temps de jeu</span><b>${Math.round((s.matchs/(s.leagueGames+s.cupGames+s.euroGames))*100)}%</b></div>
          </div>
          <div class="car-stat3-grid">${cellsHtml}</div>
          ${intlHtml}
          ${honoursHtml}
          <div class="car-recap-box">
            <div class="car-row green"><span>Prime collective</span><b>+${cfmt(recap.prime)}</b></div>
            ${recap.noteGain !== 0 ? `<div class="car-row ${recap.noteGain>0?'green':'red'}"><span>Note générale</span><b>${recap.noteGain>0?'+':''}${recap.noteGain}</b></div>` : ''}
          </div>
          <button class="start-btn" id="carRecapContinueBtn" type="button" style="margin:6px 0 0;background:#2c5aa0;">Saison suivante</button>
        </div>
      </div>
    `;
  }

  function carCategorizeTrophy(t){
    if(t.intl){
      const isWorldCup = t.label.startsWith('Coupe du monde');
      return { tier: isWorldCup ? 4 : 3, icon: isWorldCup ? '🌍' : '🏆', group: t.label.replace(/ \d{4}$/, '') };
    }
    if(t.label === "Ballon d'Or") return { tier: 4, icon: '🥇', group: t.label };
    if(t.label === "Soulier d'Or") return { tier: 3, icon: '👟', group: t.label };
    if(t.label.startsWith('Champion')) return { tier: 2, icon: '🏆', group: t.label };
    if(/Ligue des champions|Ligue Europa|Copa Libertadores/.test(t.label)) return { tier: 2, icon: '🏆', group: t.label };
    if(t.label.startsWith('Meilleur buteur')) return { tier: 0, icon: '⚽', group: t.label };
    if(t.label.startsWith('Meilleur gardien')) return { tier: 0, icon: '🧤', group: t.label };
    if(t.label.startsWith("Gant d'Or")) return { tier: 3, icon: '🧤', group: t.label };
    if(t.label === "Record d'invincibilité") return { tier: 1, icon: '🛡️', group: t.label };
    return { tier: 1, icon: '🎖️', group: t.label };
  }

  function renderCareerFinished(){
    const injured = CR.endReason === 'injury';
    const bestClub = CR.clubSpells.slice().sort((a,b) => b.buts - a.buts)[0];
    const verdict = carVerdict(CR.careerPeak, CR.careerTrophies.length, CR.careerStats.buts, CR.careerStats.selections, CR.careerStats.cleanSheets);

    document.getElementById('carFinishedEyebrow').textContent = injured ? 'Carrière brisée' : CR.endReason === 'choice' ? 'Retraite anticipée' : 'Fin de carrière';
    document.getElementById('carFinishedName').textContent = CR.name || 'Le joueur';
    document.getElementById('carFinishedSub').innerHTML = `${carIcon('flag',10)} ${CR.nation.name} · ${CR.startAge}–${carAge()} ans · pic ${CR.careerPeak}`;
    document.getElementById('carFinishedVerdict').textContent = verdict;
    const headerEl = document.getElementById('carFinishedHeader');
    headerEl.classList.toggle('injured', injured);
    headerEl.classList.toggle('notinjured', !injured);

    let trophiesHtml;
    if(CR.careerTrophies.length > 0){
      const groups = {};
      CR.careerTrophies.forEach(t => {
        const cat = carCategorizeTrophy(t);
        if(!groups[cat.group]) groups[cat.group] = Object.assign({ count:0, firstYear:null, lastYear:null }, cat);
        const g = groups[cat.group];
        g.count++;
        const yr = CAR_START_YEAR + t.season - 1;
        if(g.firstYear === null || yr < g.firstYear) g.firstYear = yr;
        if(g.lastYear === null || yr > g.lastYear) g.lastYear = yr;
      });
      const sorted = Object.values(groups).sort((a,b) => b.tier - a.tier || b.count - a.count);
      trophiesHtml = `<div class="car-recap-box car-palmares-box">
        <div class="car-recap-box-label">🏆 Palmarès — ${CR.careerTrophies.length} titre${CR.careerTrophies.length>1?'s':''}</div>
        ${sorted.map(g => `
          <div class="car-trophy-row2${g.tier>=3?' major':''}">
            <span class="car-trophy-icon">${g.icon}</span>
            <span class="car-trophy-label">${g.group}</span>
            <span class="car-trophy-years">${g.firstYear===g.lastYear ? g.firstYear : g.firstYear+'–'+g.lastYear}</span>
            ${g.count>1 ? `<span class="car-trophy-count">×${g.count}</span>` : ''}
          </div>
        `).join('')}
      </div>`;
    } else {
      trophiesHtml = `<div class="car-recap-box"><div class="car-recap-box-label">🏆 Palmarès</div><p style="font-size:11px;color:#6b6552;">Aucun titre remporté cette carrière.</p></div>`;
    }

    const bestClubYears = bestClub ? (bestClub.endYear !== bestClub.startYear ? `${bestClub.startYear}–${bestClub.endYear}` : String(bestClub.startYear)) : '';
    const bestClubLabel = bestClub ? (CR.poste === 'gardien'
      ? `${bestClub.matchs} matchs · ${bestClubYears}`
      : `${bestClub.buts} buts en ${bestClub.matchs} matchs · ${bestClubYears}`) : '';
    const clubHistoryHtml = CR.clubSpells.length > 1 ? `
      <div class="car-recap-box">
        <div class="car-recap-box-label">🧳 Parcours en club</div>
        ${CR.clubSpells.map(cs => {
          const yrs = cs.endYear !== cs.startYear ? (cs.startYear + '–' + cs.endYear) : String(cs.startYear);
          const golLine = CR.poste !== 'gardien' ? (' · ' + cs.buts + ' buts') : '';
          return `
          <div class="car-club-history-row">
            <div class="car-club-history-club">${cs.club}</div>
            <div class="car-club-history-meta">${yrs} · ${cs.saisons} saison${cs.saisons>1?'s':''}${golLine}</div>
          </div>
        `;
        }).join('')}
      </div>
    ` : '';

    document.getElementById('carFinishedCard').innerHTML = `
      <div class="car-row green" style="background:#0b2b1d0f;border-radius:8px;padding:8px 12px;margin-bottom:11px;font-size:13px;">
        <span>⭐ XP gagnée pour ton profil</span><b>+${CR.xpEarned || 0} XP</b>
      </div>
      <div class="car-stat3-grid">
        ${CR.poste === 'gardien' ? `
        <div class="car-stat3-cell"><b>${CR.careerStats.cleanSheets}</b><small>Clean sheets</small></div>
        <div class="car-stat3-cell"><b>${CR.careerStats.matchs ? Math.round(CR.careerStats.cleanSheets/CR.careerStats.matchs*100) : 0}%</b><small>Taux CS</small></div>
        <div class="car-stat3-cell"><b>${CR.careerStats.matchs}</b><small>Matchs</small></div>
        ` : `
        <div class="car-stat3-cell"><b>${CR.careerStats.buts}</b><small>Buts</small></div>
        <div class="car-stat3-cell"><b>${CR.careerStats.passes}</b><small>Passes D.</small></div>
        <div class="car-stat3-cell"><b>${CR.careerStats.matchs}</b><small>Matchs</small></div>
        `}
      </div>
      <div class="car-stat3-grid">
        <div class="car-stat3-cell"><b>${CR.careerTrophies.length}</b><small>Trophées</small></div>
        <div class="car-stat3-cell"><b>${CR.careerStats.selections}</b><small>Sélections</small></div>
        <div class="car-stat3-cell"><b>${CR.careerStats.butsInter}</b><small>Buts int.</small></div>
      </div>
      ${bestClub ? `
        <div class="car-intl-box">
          <div class="car-intl-title" style="color:#c9a227;">Club de sa vie</div>
          <div style="font-family:'Oswald',sans-serif;font-weight:700;color:#f3efe2;font-size:14px;">${bestClub.club}</div>
          <div style="font-size:11px;color:rgba(243,239,226,.75);">${bestClubLabel}</div>
        </div>
      ` : ''}
      ${trophiesHtml}
      ${clubHistoryHtml}
      <div class="car-recap-box">
        ${CR.poste === 'gardien' ? `
        <div class="car-row"><span>Clean sheets/match</span><b>${CR.careerStats.matchs ? (CR.careerStats.cleanSheets/CR.careerStats.matchs).toFixed(2) : '—'}</b></div>
        ` : `
        <div class="car-row"><span>Ratio buts/match</span><b>${CR.careerStats.matchs ? (CR.careerStats.buts/CR.careerStats.matchs).toFixed(2) : '—'}</b></div>
        <div class="car-row"><span>Implication (B+PD)</span><b>${CR.careerStats.buts + CR.careerStats.passes}</b></div>
        `}
        <div class="car-row"><span>Saisons jouées</span><b>${CR.clubSpells.reduce((a,x)=>a+x.saisons,0)} · ${CR.startAge}–${carAge()} ans</b></div>
        <div class="car-row"><span>Clubs traversés</span><b>${CR.clubSpells.length}</b></div>
        <div class="car-row"><span>Fortune accumulée</span><b style="color:#3f7d4f;">${cfmt(CR.argent)}</b></div>
      </div>
    `;
  }

  function carRenderLeaderboardEntries(entries){
    const medals = ['🥇','🥈','🥉','4','5'];
    return entries.map((f, i) => `
      <div class="car-fav-item">
        <div class="car-fav-item-top">
          <div style="display:flex;align-items:center;gap:8px;min-width:0;">
            <span class="car-top5-rank">${medals[i] || (i+1)}</span>
            <div style="min-width:0;">
              <div class="car-fav-name">${f.player}</div>
              <div class="car-fav-meta">${f.nation} · ${f.startAge}–${f.endAge} ans · pic ${f.peak}</div>
              ${f.profilePseudo ? `<div class="car-top5-owner">par ${f.profilePseudo}</div>` : ''}
            </div>
          </div>
          <span class="car-fav-verdict">${f.verdict}</span>
        </div>
        <div class="car-fav-chips">${f.poste === 'gardien'
          ? `<span>🧤 ${f.cleanSheets||0}</span><span>${carIcon('users',11)} ${f.matchs}</span><span>${carIcon('trophy',11)} ${f.trophies}</span>`
          : `<span>${carIcon('target',11)} ${f.buts}</span><span>${carIcon('send',11)} ${f.passes}</span><span>${carIcon('users',11)} ${f.matchs}</span><span>${carIcon('trophy',11)} ${f.trophies}</span>`}</div>
        ${f.bestClub ? `<p style="font-size:10px;color:var(--ink-soft);">${f.bestClub.club} — ${f.bestClub.buts} buts</p>` : ''}
        ${f.selections > 0 ? `<p style="font-size:10px;color:#2c5aa0;">${f.selections} sélections · ${f.butsInter} buts en sélection</p>` : ''}
        <p style="font-size:9px;color:var(--ink-soft);font-family:'JetBrains Mono',monospace;margin-top:4px;">${cfmt(f.argent)} · fin : ${f.ended}</p>
      </div>
    `).join('');
  }

  let carTop5Tab = 'personal';
  function renderCareerTop5Modal(){
    document.getElementById('carTop5TabPersonal').classList.toggle('active', carTop5Tab === 'personal');
    document.getElementById('carTop5TabGlobal').classList.toggle('active', carTop5Tab === 'global');
    if(carTop5Tab === 'personal') renderCareerTop5Personal();
    else renderCareerTop5Global();
  }
  function renderCareerTop5Personal(){
    const list = document.getElementById('carTop5List');
    if(!carTop5.length){
      list.innerHTML = `<div class="car-favs-empty">Aucune carrière terminée pour l'instant. Termine une carrière pour apparaître dans ce classement.</div>`;
      return;
    }
    list.innerHTML = carRenderLeaderboardEntries(carTop5);
  }

  let carLbClient = null;
  function renderCareerTop5Global(){
    const list = document.getElementById('carTop5List');
    list.innerHTML = `<div class="car-top5-status">Recherche des autres joueurs…</div>`;
    if(typeof mqtt === 'undefined'){
      list.innerHTML = `<div class="car-top5-status">Classement en ligne indisponible pour le moment.</div>`;
      return;
    }
    if(carLbClient){ try{ carLbClient.end(true); } catch(e){} carLbClient = null; }
    const collected = {};
    try{
      carLbClient = mqtt.connect(CAR_LB_BROKER, { clientId: 'multipoly-lbview-' + Math.random().toString(16).slice(2), clean:true, connectTimeout:6000 });
    } catch(e){
      list.innerHTML = `<div class="car-top5-status">Classement en ligne indisponible pour le moment.</div>`;
      return;
    }
    carLbClient.on('connect', () => {
      carLbClient.subscribe(CAR_LB_TOPIC_PREFIX + '+', { qos:1 }, () => {});
    });
    carLbClient.on('message', (topic, payload) => {
      try{
        const entry = JSON.parse(payload.toString());
        collected[topic] = entry;
      } catch(e){}
    });
    carLbClient.on('error', () => {});
    setTimeout(() => {
      if(carLbClient){ try{ carLbClient.end(true); } catch(e){} carLbClient = null; }
      if(carTop5Tab !== 'global') return; // user switched tabs while waiting — don't overwrite
      const all = Object.values(collected).sort((a,b) => b.peak - a.peak || b.buts - a.buts || b.trophies - a.trophies || b.passes - a.passes).slice(0, 10);
      if(!all.length){
        list.innerHTML = `<div class="car-top5-status">Personne d'autre n'a encore terminé de carrière.</div>`;
        return;
      }
      list.innerHTML = carRenderLeaderboardEntries(all);
    }, 2200);
  }

  // ---- WIRING ----
  const CAR_TUTO_KEY = 'multipoly_career_tuto_seen_v1';
  document.getElementById('showCareerBtn').addEventListener('click', () => {
    document.getElementById('landing').style.display = 'none';
    document.getElementById('careerScreen').style.display = 'flex';
    if(!CR){
      CR = carDefaultState();
      renderCareerPhase();
      let seen = false;
      try{ seen = localStorage.getItem(CAR_TUTO_KEY) === '1'; } catch(e){}
      if(!seen) carOpenTutorial();
    } else if(CR.phase === 'playing'){
      document.getElementById('carResumeText').textContent =
        `${CR.name || 'Ton joueur'} en est à la saison ${CR.seasonNum}/${carTotalSeasons()}, ${carAge()} ans.`;
      document.getElementById('carResumeModal').style.display = 'flex';
    } else {
      renderCareerPhase();
    }
  });

  // ---- Tutorial slideshow ----
  const carTutoSlideEls = () => Array.from(document.querySelectorAll('#carTutoSlides .car-tuto-slide'));
  let carTutoIndex = 0;
  function carRenderTutoSlide(){
    const slides = carTutoSlideEls();
    slides.forEach((el, i) => {
      el.classList.toggle('active', i === carTutoIndex);
      el.classList.toggle('prev', i < carTutoIndex);
    });
    const dots = document.getElementById('carTutoDots');
    dots.innerHTML = slides.map((_, i) => `<span class="car-tuto-dot${i===carTutoIndex?' active':''}"></span>`).join('');
    document.getElementById('carTutoPrevBtn').style.visibility = carTutoIndex === 0 ? 'hidden' : 'visible';
    document.getElementById('carTutoNextBtn').textContent = carTutoIndex === slides.length - 1 ? 'Terminé' : 'Suivant ›';
  }
  function carOpenTutorial(){
    carTutoIndex = 0;
    document.getElementById('carTutoModal').style.display = 'flex';
    carRenderTutoSlide();
  }
  function carCloseTutorial(){
    document.getElementById('carTutoModal').style.display = 'none';
    try{ localStorage.setItem(CAR_TUTO_KEY, '1'); } catch(e){}
  }
  document.getElementById('carShowTutoBtn').addEventListener('click', carOpenTutorial);
  document.getElementById('carTutoCloseX').addEventListener('click', carCloseTutorial);
  document.getElementById('carTutoPrevBtn').addEventListener('click', () => {
    if(carTutoIndex > 0){ carTutoIndex--; carRenderTutoSlide(); }
  });
  document.getElementById('carTutoNextBtn').addEventListener('click', () => {
    const total = carTutoSlideEls().length;
    if(carTutoIndex < total - 1){ carTutoIndex++; carRenderTutoSlide(); }
    else carCloseTutorial();
  });
  document.getElementById('carResumeContinueBtn').addEventListener('click', () => {
    document.getElementById('carResumeModal').style.display = 'none';
    renderCareerPhase();
  });
  document.getElementById('carResumeNewBtn').addEventListener('click', () => {
    document.getElementById('carResumeModal').style.display = 'none';
    carNewCareer();
  });
  document.getElementById('carSetupBackBtn').addEventListener('click', () => {
    document.getElementById('careerScreen').style.display = 'none';
    document.getElementById('landing').style.display = 'flex';
  });
  document.getElementById('carPlayingBackBtn').addEventListener('click', () => {
    document.getElementById('careerScreen').style.display = 'none';
    document.getElementById('landing').style.display = 'flex';
  });
  document.getElementById('carFinishedBackBtn').addEventListener('click', () => {
    document.getElementById('careerScreen').style.display = 'none';
    document.getElementById('landing').style.display = 'flex';
  });
  document.getElementById('carNewCareerBtn2').addEventListener('click', carNewCareer);

  document.getElementById('carNameInput').addEventListener('input', (e) => {
    if(CR) CR.name = e.target.value;
  });
  document.querySelectorAll('.car-poste-choice-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      if(CR.shuffling || CR.drafts.length > 0) return;
      const poste = btn.dataset.poste;
      CR.poste = poste;
      document.querySelectorAll('.car-poste-choice-btn').forEach(b => b.classList.toggle('active', b.dataset.poste === poste));
      CR.drafts.forEach(d => d.poste = poste);
      const tag = document.getElementById('carPosteTag');
      if(poste === 'gardien'){
        tag.innerHTML = '<svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 4h16v9a8 8 0 0 1-8 8 8 8 0 0 1-8-8V4Z"/><path d="M9 11l2 2 4-4"/></svg>Gardien';
      } else {
        tag.innerHTML = '<svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><path d="M12 2v4M12 18v4M2 12h4M18 12h4"/></svg>Attaquant';
      }
      const shuffleBtn = document.getElementById('carShuffleBtn');
      if(shuffleBtn) shuffleBtn.disabled = CR.shuffling;
      const posteHint = document.getElementById('carPosteHint');
      if(posteHint) posteHint.style.visibility = 'hidden';
    });
  });
  document.getElementById('carShuffleBtn').addEventListener('click', carRegenerateAll);
  document.getElementById('carKeepBtn').addEventListener('click', carStartGame);
  document.getElementById('carShowTop5Btn').addEventListener('click', () => {
    document.getElementById('carTop5Modal').style.display = 'flex';
    carTop5Tab = 'personal';
    renderCareerTop5Modal();
  });
  document.getElementById('carTop5TabPersonal').addEventListener('click', () => {
    carTop5Tab = 'personal';
    renderCareerTop5Modal();
  });
  document.getElementById('carTop5TabGlobal').addEventListener('click', () => {
    carTop5Tab = 'global';
    renderCareerTop5Modal();
  });
  document.getElementById('carTop5CloseBtn').addEventListener('click', () => {
    document.getElementById('carTop5Modal').style.display = 'none';
    if(carLbClient){ try{ carLbClient.end(true); } catch(e){} carLbClient = null; }
  });

  document.getElementById('carRetireBtn').addEventListener('click', () => {
    document.getElementById('carRetireText').textContent =
      `${CR.name || 'Ton joueur'} a ${carAge()} ans et ${carTotalSeasons() - CR.seasonNum} saison${(carTotalSeasons()-CR.seasonNum)>1?'s':''} encore devant lui.`;
    document.getElementById('carRetireModal').style.display = 'flex';
  });
  document.getElementById('carRetireCancelBtn').addEventListener('click', () => {
    document.getElementById('carRetireModal').style.display = 'none';
  });
  document.getElementById('carRetireConfirmBtn').addEventListener('click', carRetireNow);

})();
