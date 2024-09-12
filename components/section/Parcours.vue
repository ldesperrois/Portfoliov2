<template>
    <div class="section--parcours" id="parcours">
        <h1>Parcours Professionel</h1>
        <div>
            <div class="timeline">
                <Event v-for="(parcour,index) in parcours" :key="index" :parcour="parcour"/>
            </div>
        </div>
    </div>
</template>


<style lang="scss">
    .section--parcours{
        display: flex;
        flex-direction: column;
        background-color:#322A64;
        padding-left: 3em;
        padding-right: 3em;
        align-items: center;
        h1{
            font-size: 35px;
            color : #fff;
            margin-top: 2em;
            text-align: center;
        }
        .timeline{
            margin-top: 2em;
            margin-bottom: 2em;
            display: flex;
            flex-direction: column;
            margin-left: 200px;
            
            position: relative;
            border-left: 4px solid #fff;
            .event:first-child{
                margin-top: 50px;
            }
            .event:last-child{
                margin-bottom: 10px;
            }
           
        }
        
    }
    @media screen and (max-width:1200px) {
      .section--parcours{
        padding-left: 1em;
        padding-right: 1em;
        
      }
      h1{
        align-self: center;
      }
      
    }
    @media screen and (max-width:768px) {
        .timeline{
            margin-left: 100px!important;
        }
    }
</style>


<script lang="ts">
    import Event from '#components'
    import parcours from '~/src/parcours'
    export default{
        data(){
            return{
                parcours
            }
        }
        ,components:{
            'Event':Event
        }
    }
</script>