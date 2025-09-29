
export interface Parcours{
    id:number,
    title:String,
    description:String,
    year:String
}


// Ensemble des formations/ jobs effectués
const parcours  : Parcours[]  =[
    {
        id:1,
        title:"Ingénieur Systèmes Embarqués \n ENSTA Bretagne",
        year:"2025-2028",
        description: `Formation d'ingénieur par alternance en systèmes embarqués qui m'a formé au développement et à l’amélioration de ces architectures électroniques complexes qui associent logiciels, matériels électroniques, algorithmes métiers et télécommunications. `
    },
    {
        id:2,
        title:"Concepteur/ Développeur Enedis",
        year:"2023-2025",
        description: "Premier poste occupé en tant que développeur au sein des IEG (entreprises de l'énergie). J'ai pu y développer mes compétences dans des frameworks récents de type Laravel/Vuejs pour des logiciels ERP. Apprendre à travailler dans une équipe de développeurs a été une expérience qui m'a beaucoup marqué. J'ai pu aussi travailler l'écoute des besoins métiers et du client essentiels pour la réussite d'un projet."

    },
    {
       id:3,
       title:"BUT Informatique ( IUT Lannion) ",
       year:"2022-2025",
       description: "Formation de trois ans qui m'a fait découvrir l'essentiel qu'un développeur doit connaître aujourd'hui dans le monde du travail. J'ai pu y réaliser de nombreux projets en équipes et renforcer mes compétences dans de nombreux domaines informatiques (réseaux,IA, développement web, data, Administration systèmes informatiques). Je me suis surtout spécialisé dans le Parcours C de ma formation : administration, gestion et exploitations des données."
    },
    {
        id:4,
        title:"Lycée naval",
        year:"2019-2022",
        description: "J'ai effectué trois ans au lycée militaire du centre d'instruction naval de Brest en secondaire. Expérience très enrichissante grâce notamment au cadre scolaire de qualité qui était proposé. J'ai pu découvrir le monde militaire et toutes les valeurs qu'il enseigne en termes de disciplines et motivations. Un monde que j'aimerais peut-être intégrer plus tard."
    },
]

export default parcours