export interface Competences{
    id:number,
    title:string,
    linkimage:string
}

const competences : Competences[] = [
    {
        id:1,
        title:"Réaliser un développement d'applications",
        linkimage:"/img/competence1.webp"
    },
    {
        id:2,
        title:"Optimiser des applications informatiques",
        linkimage:"/img/competence2.webp"
    },
    {
        id:3,
        title:"Administrer des systèmes informatiques communicants",
        linkimage:"/img/competence3.webp"
    },
    {
        id:4,
        title:"Gérer des données de l'informations",
        linkimage:"/img/competence4.webp"
    },
    {
        id:5,
        title:"Conduite de projet",
        linkimage:"/img/competence5.webp"
    },
    {
        id:6,
        title:"Travailler dans une équipe informatique",
        linkimage:"/img/competence6.webp"
    },
];

export const competencesEn: Competences[] = [
    {
        id: 1,
        title: "Application Development",
        linkimage: "/img/competence1.webp"
    },
    {
        id: 2,
        title: "Application Optimization",
        linkimage: "/img/competence2.webp"
    },
    {
        id: 3,
        title: "Connected Systems Administration",
        linkimage: "/img/competence3.webp"
    },
    {
        id: 4,
        title: "Data & Information Management",
        linkimage: "/img/competence4.webp"
    },
    {
        id: 5,
        title: "Project Management",
        linkimage: "/img/competence5.webp"
    },
    {
        id: 6,
        title: "Teamwork in IT",
        linkimage: "/img/competence6.webp"
    }
];

export const getCompetences = (locale: string = 'fr'): Competences[] => {
    return locale === 'en' ? competencesEn : competences;
};

export default competences;