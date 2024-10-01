<template>
    
    <main>
        <sectionAccueil/>
        <div class="container--propos--projets">
            <sectionApropos/>
            <sectionProgrammingLanguage/>
            <sectionProjets/>
        </div>
        <SectionParcours/>
    </main>
    
</template>

<style lang="scss">
    html{
        overflow: scroll;
    }
    main{
        display: flex;
        flex-direction: column;
        
        background-color: #ECEFF1;
        .container--propos--projets{
            display: flex;
            flex-direction: column;
            padding-left: 3em;
            padding-right: 3em;
        }
    }

    @media screen and (max-width:1200px) {
        .container--propos--projets{
            padding-right: 1em!important;
            padding-left: 1em !important; ;
        }
    }
</style>

