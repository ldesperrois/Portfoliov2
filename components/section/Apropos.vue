<template>
    <div class="section--apropos" id="decouvrir" >
        <div class="container--apropos">
            <div class="container--image">
                <NuxtImg class="image--apropos" src="/img/watibg.webp" />
            </div>
            <div class="container--text--apropos" >
                <div class="text--metier">
                    <h2>Développeur Web</h2>
                    <p class="text--metier">
                        Découvrez mes projets de développemet web réalisés 
                        dans le cadre universitair ou personelle. Je me passionne aussi pour d’autres domaines 
                        du développement et notamment celui de 
                        l’embarqué que j’approfondi personellement. Ayant eu une éxperience à travers un Lycée de la défense, j'aimerai plus tard 
                         mettre mes compétences acquises au service des armées. Un univers que j'apprécie, que ce soit par le cadre qu'il propose mais
                       aussi les valeurs qu'il enseigne.
                    </p>
                </div>
                <div class="text--experience" >
                    <h2>Expérience</h2>
                    <p class="text--experience">
                        J’ai réalisé au cours de mes études et de mon alternance de nombreux projets qui 
                        m’ont appris à collaborer et amener mes équipes vers le haut. Vous avez l’occasion 
                        à travers mon Portfolio de découvrir cetains de ces projets.  Selon moi 
                        l’expérience est importante car elle démontre nôtre intérêt mais  
                        surtout notre capacité à se dépasser. Vous pouvez d'ailleurs télécharger mon CV ci-dessous.
                    </p>
                </div>
                <a class="button-cv button--antiman button--round-l button--text-medium" download="CV_Lucas_Desperrois.pdf" href="/public/files/CV_Lucas_Desperrois.pdf">
                    <i class="button__icon icon icon-map-marker"></i><span>Télécharger</span>
                </a>
            </div>
        </div>
    </div>
</template>

<style lang="scss" scoped>
    .section--apropos{
        display: flex;
        flex-direction: column;
        width: 100%;
        z-index: 10;
        margin-top: 5em;
        margin-bottom: 5em;
        .container--apropos{
            display: flex;
            flex-direction: row;
            justify-content: center;
            .container--image{
                display: flex;
                justify-content: center;
                flex:1;
                .image--apropos{
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
                    gap: 10px;
                    h2{
                        font-size: 35px;
                    }
                    p{
                        font-size: 17px;
                        font-weight: 300;
                    }
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
