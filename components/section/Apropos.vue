<template>
    <div class="section--apropos"  >
        <div id="decouvrir" ></div>
        <div class="container--apropos">
            <div class="container--image">
                <NuxtImg class="image--apropos" src="/img/LucasD.webp" />
            </div>
            <div class="container--text--apropos" >
                <div class="text--metier">
                    <h2>Développeur </h2>
                    <p class="text--metier">
                        Découvrez l’ensemble de mes projets réalisés aussi bien dans le cadre universitaire que personnel. 
                        J’ai développé mes compétences à <a target="_blank" href="https://iut-lannion.univ-rennes.fr/">l’IUT de Lannion</a>, au sein du parcours Administration, Gestion et Exploitation de la Donnée, tout en me passionnant pour d’autres domaines du développement, 
                        en particulier les systèmes embarqués, que j’approfondis personnellement et que j’ai pu consolider au sein de  <a target="_blank" href="https://www.ensta-bretagne.fr/fr">l’ENSTA Bretagne</a> en formation d’ingénieur. Fort d’une expérience au sein d’un Lycée de la Défense, j’aimerais, à terme, mettre mes compétences au service des armées, 
                        un univers que j’apprécie autant pour le cadre qu’il offre que pour les valeurs qu’il transmet.
                    </p>
                </div>
                <div class="text--experience" >
                    <h2>Expérience</h2>
                    <p class="text--experience">
                        J’ai réalisé au cours de mes études et de mon alternance de nombreux projets qui 
                        m’ont appris à collaborer et amener mes équipes vers le haut. Vous avez l’occasion 
                        à travers mon Portfolio de découvrir cetains de ces projets.  Selon moi 
                        l’expérience est importante, elle témoigne nôtre intérêt mais  
                        surtout notre capacité à se surpasser. Vous pouvez d'ailleurs télécharger mon CV ci-dessous.
                    </p>
                </div>
                <a class="button-cv button--antiman button--round-l button--text-medium" download="CV_Lucas_Desperrois.pdf" href="/files/CV_Lucas_Desperrois.pdf">
                    <i class="button__icon icon icon-map-marker"></i><span>Mon CV</span>
                </a>
            </div>
        </div>
    </div>
</template>

<style lang="scss" scoped>
    #decouvrir{
        position: relative;
        top: -100px;
    }
    .section--apropos{
        display: flex;
        scroll-margin-top:500px;
        flex-direction: column;
        width: 100%;
        z-index: 10;
        margin-top: 100px;
        margin-bottom:200px;
        .container--apropos{
            display: flex;
            flex-direction: row;
            justify-content: center;
            .container--image{
                display: flex;
                justify-content: center;
                flex:1;
                .image--apropos{
                    object-position: left;
                    width: 500px;
                    object-fit: cover;
                    border-radius: 20px;
                    max-height: 700px;
                }
            }
            .container--text--apropos{
                display: flex;
                flex-direction: column;
                align-items: start;
                width: 40%;
                flex:1;
                gap: 30px;
                .text--metier, .text--experience{
                    display: flex;
                    flex-direction: column;
                    a{
                        display: contents;
                    }
                    gap: 10px;
                    h2{
                        font-size: 35px;
                    }
                    p{
                        font-size: 17px;
                        font-weight: 300;
                    }
                }
                a::before{
                    border-color: black;
                }
            }

        }
        
    }
@media screen and (max-width:1200px){
    
    .image--apropos{
        width: 400px!important;
    }
    
}

@media screen and (max-width:950px){
    .container--apropos{
        flex-direction: column!important;
        gap: 30px;
    }
    .container--text--apropos{
        width: 90%!important;
        align-self: center;
    }
    .image--apropos{
        max-height: 350px!important;
    }
}
</style>
