<template>
    <div class="event">
        <span class="year">{{ parcour.year }}</span>
        <div class="content-parcours">
            <span>{{ parcour.title }}</span>
            <p v-html="parcour.description"> </p>
        </div>
    </div>
</template>


<style lang="scss" scoped>
    span{
        color : #E3B873;
    }
    .event{
        position: relative;
        align-items: center;
        margin-bottom: 100px;
        
        &::before {
            content: '';
            position: absolute;
            left: -10px;
            top: 10px;
            width: 15px;
            height: 15px;
            background-color: #c5b9b9;
            border-radius: 50%;
        }
        .year {
            font-size: 28px;
            position: absolute;
            left:-250px;
            top: 5px;
        }
        .content-parcours{
            max-width: 700px;
            margin-left: 30px;
            span{
                font-size: 25px;
                font-weight: 300;
            }
            p{
                color: #fff;
                font-size: 16px;
                font-weight: 300;
            }
            
        }
    }
    @media screen and (max-width:1200px) {

        .year{
            left: -200px!important;
        }
        
    }
    @media screen and (max-width:1050px){
        .content-parcours{
            max-width: 600px!important;
        }
    }
    @media screen and (max-width:768px){
        .event{
            margin-bottom: 50px;
        }
        .year{
            left: -100px!important;
            font-size: 15px!important;
        }
    }
</style>

<script lang="ts">
    export default{
        props : {
            parcour :{
                type : Object,
                required :true
            }
        },
        
    }
</script>