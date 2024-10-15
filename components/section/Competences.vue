<template>
    <section id="competences">
        <h1>Compéténces</h1>
        <div class="container-competences">
            <CardCompetences v-for="(competence,index) in competences" :key="index" :compt="competence"/>
        </div>
    </section>
</template>

<style lang="scss" scoped>
    #competences{
        width: 100%;
        margin-top: 150px;
        margin-bottom: 150px;
        h1{
            font-size: 35px;
            text-align: center;
        }
        .container-competences {
            align-content: center;
    margin-top: 100px;
    display: grid;
    gap: 30px;
    grid-template-columns: repeat(3, 1fr); /* 3 colonnes par défaut */

    @media (max-width: 1024px) {
      grid-template-columns: repeat(2, 1fr); /* 2 colonnes en écran tablette */
    }

    @media (max-width: 480px) {
      grid-template-columns: 1fr; /* 1 colonne sur écran mobile */
    }
  }
    }
</style>


<script lang="ts">
    import competences, { type Competences } from '~/src/competences';
    export default{
        data() {
            return{
                competences
            }
        },
        setup(props, ctx) {
            let transitionTab : [] = [];
            const tabThreeElement  = [];  
            console.log(competences)
            competences.forEach((compt)=>{
                transitionTab.push(compt)
                if(transitionTab.length==3){
                    tabThreeElement.push(transitionTab)
                    transitionTab=[];
                }
                
            })
            return{
                tabThreeElement
            }
        }
    }
    
</script>


