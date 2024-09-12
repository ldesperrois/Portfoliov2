<template>
    <div class="section--projets" id="projet">
        <EffectTypingText :text="text"/>
        <SliderProjets :datas="projets" :perView="2"/>
    </div>
</template>
  


<style lang="scss">
    
    .section--projets{
        display: flex;
        flex-direction: column;
        align-items: center;
        width: 100%;
        margin-top: 5em;
       
        gap: 70px;
        margin-bottom: 5em;
        
        
        
    }
</style>

<script lang="ts">
   // Récupère l'ensemble des projets
   import projets from '~/src/projets';

    export default{
        name:"Projets",
        data(){
            return{
                text : "Mes projets",
                projets
            }
        },
        
        
    }
</script>