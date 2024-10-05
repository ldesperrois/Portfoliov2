<template>
    <div class="section--projets" >
        <div id="projet" class="anchor-projets"></div>
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
        margin-bottom: 100px;
        margin-top: 100px;
        
        
        
    }
    .anchor-projets{
        position: relative;
        top: -100px;
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