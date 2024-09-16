// ~/data/projets.ts

// Classe pour un projet
export interface Projet {
    id: number;
    name: string;
    description: string;
    github: string | boolean;
    listeProjet: string[];
    langages: string[];
    img: string;
    website:boolean;
    link:string | null;
  }
  // Liste des projets
  const projets: Projet[] = [
    {
      id: 1,
      name: "Alhaiz Breizh",
      description: "Site web de locations de logements en bretagne, réalisé en équipe de 7 dans le cadre universitaire. Mise en place d'une gestion ( méthode Scrum) et développement en équipe sur 4 semaines. Présentation à des clients (fictifs) des avancés.",
      github: "https://github.com/KazouDev/MKWeb",
      langages: ["html", "php", "javascript", "css","postgresql"],
      img: "/img/AlhaizBreizh.webp",
      listeProjet:["/img/Alhaiz_Breizh_1.webp","/img/Alhaiz_Breizh_2.webp"],
      website:false,
      link:null
    },
    {
      id: 2,
      name: "Portfoliov1",
      description: "Projet de Portfolio de première année qui permettait d'appliquer mes premières connaissances dans le développement web, présentation compétences et domaines que j'étudie.",
      github: "https://github.com/ldesperrois/PortFolio_Desperrois",
      langages: ["html", "css", "javascript"],
      listeProjet:["/img/Portfoliov1_1.webp","/img/Portfoliov1_2.webp"],
      img: "/img/Portfoliov1.webp",
      website:true,
      link:"https://ldesperrois.github.io/PortFolio_Desperrois/"

    },
    
    {
      id: 3,
      name: "Puissance4",
      description: "Projet Réalisé en C, qui présente le jeu Puissance4 pour appliquer les fondatamentaux de ce langage en interface console. Possibilité de jouer contre humain ou ordinateur.",
      github: "https://github.com/ldesperrois/Strategie-Puissance4",
      langages: ["c"],
      listeProjet:["/img/Puissance4_1.webp","/img/Puissance4_2.webp"],
      img: "/img/Puissance4.webp",
      website:false,
      link:null
    },
    {
      id: 4,
      name: "Portfoliov2",
      description: "Nouvelle version de mon Portfolio plus sobre et moderne avec l'utilisation de technologies plus récentes. Met en lumière mes projets et formations que j'ai effectué.",
      github: false,
      langages: ["nuxtjs", "css", "typescript"],
      listeProjet:["/img/Portfoliov2_1.webp","/img/Portfoliov2_2.webp"],
      img: "/img/Portfoliov2.webp",
      website:true,
      link:"https://www.lucas-desperrois.fr/"
    },
    {
      id: 5,
      name: "Koh Sport",
      description: "Premier projet de développement web en équipe de cinq pour découvrir les fondamentaux d'un projet de développement web. Ecoute des bésoins, gestion d'équipe, maquettage et charte graphique.",
      github: "https://github.com/ldesperrois/Website",
      langages: ["html","css"],
      listeProjet:["/img/Koh_Sport_1.webp","/img/Koh_Sport_2.webp"],
      img: "/img/KohSport.webp",
      website:true,
      link:"https://ldesperrois.github.io/Website/fr/index.html"
    },
    {
      id:6,
      name:'8 dames',
      description:"Résolution du problème des 8 dames à l'aides d'algorithmes optimisés en python. Projet de groupe qui met en avant différentes stratégies de résolutions. Possiblité de voir les solutions avec des images pdf.",
      langages:["python"],
      img:"/img/Dames.webp",
      listeProjet:["/img/8Dames_1.webp","/img/8Dames_2.webp"],
      github:"https://github.com/ldesperrois/8-dames" ,
      website:false,
      link:null
    },
    {
      id:7,
      name:"Parcoursup",
      description:"Projet qui consitait à implémenter, peupler et concevoir des vues pour exploiter des données. L'objectif est de tester la corrélations de plusieurs données sur le taux d'affectation à des formations.",
      github:"https://github.com/ldesperrois/Parcoursup",
      langages:["postgresql","python"],
      img:"/img/Parcoursup.webp",
      listeProjet:["/img/Parcoursup_1.webp","/img/Parcoursup_2.webp","/img/Parcoursup_3.webp"],
      website:false,
      link:null
    },
    {
      id:8,
      name:"PokemonGo API",
      description:"API réalisée en groupe, qui permet de présenter la liste de tous les pokemons de pokemon GO avec différentes versions d'affichage (version complète : V5). Affichage des caractéristiques des pokemons, faiblesses etc ...",
      github:"https://github.com/Sinay1005/PokemonWebSiteIUTLannion/tree/main",
      langages:["html","css","javascript"],
      img:"/img/Pokemon.webp",
      listeProjet:["/img/PokemonGo_1.webp","/img/PokemonGo_2.webp"],
      website:true,
      link:"https://sinay1005.github.io/PokemonWebSiteIUTLannion/"
    }
      
  ];
  
  export default projets;
  