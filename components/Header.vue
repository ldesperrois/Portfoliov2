<template>
    <header class="header">
            <NuxtImg class="header--img" src="/img/Sublimateur_Pixelcut_Export.webp" height="73"/>
            <div class="header--menu">
                <div class="menu--link">
                    <NuxtLink to="#accueil" @click="closeMenu">Accueil</NuxtLink>
                    <div class="surligne"></div>
                </div>
                <div  class="menu--link">
                    <NuxtLink @click="closeMenu" to="#decouvrir">A propos</NuxtLink>
                    <div class="surligne"></div>
                </div>
                <div class="menu--link">
                    <NuxtLink to="#projet" @click="closeMenu">Projets</NuxtLink>
                    <div class="surligne"></div>
                </div>
                <div class="menu--link">
                    <NuxtLink to="#parcours" @click="closeMenu">Parcours</NuxtLink>
                    <div class="surligne"></div>
                </div>
                <div class="menu--link">
                    <NuxtLink to="#contact" @click="closeMenu">Contact</NuxtLink>
                    <div class="surligne"></div>
                </div>
            </div>
            <div class="menu--hamburger" @click="menu">
                <font-awesome class="hamburger" :icon="icon" />
            </div>
       
    </header>
</template>


<style lang="scss" scoped>
    
                
    .header{

        display: flex;
        flex-direction: row;
        justify-content: space-between;
        z-index: 99;
        min-height: 90px;
        align-items: center;
        position: sticky;
        background-color: #fff;
        top: 0;
        
        box-shadow: rgba(100, 100, 111, 0.2) 0px 7px 29px 0px;
        img{
            margin-left: 10px;
        }
        .header--menu{
            display: flex;
            flex-direction: row;
            gap: 30px;
            align-items: center;
            font-size: 20px;
            margin-right: 2em;
            .menu--link{
                
                .surligne{
                    width: 0%;
                    margin-top: 1px;
                    background-color: rgb(30, 28, 28);
                    height: 3px;
                    transition: all .4s;
                }
                a:hover+.surligne{
                    width: 100%;
                }
                a:hover{
                    cursor: pointer;
                }
                a{
                    color: black;
                    font-weight: 300;
                }
            }
        }
        .menu--hamburger{
            display: none;
            cursor: pointer;
        }
            
    }



@media screen and (max-width:768px) {
    
    .menu--hamburger{
        display: block!important;
        margin-right: 10px;
        font-size: 30px;
    }
    nav{
        align-items: center;
    }
    .header--menu{
        position: absolute!important;
        left: -100%;
        top: 88px;
        gap: 0!important;
        margin: 0;
        flex-direction: column!important;
        width: 100%;
        height: fit-content;
        justify-content: center;
        background-color: #fff;
        transition: 0.3s;
        
        .menu--link{
            
            border-bottom: dashed ;
            width: 80%;
            height: 100px;
            div{
                display: none
            }
        }
    }
    
    .header--menu.active{
        left: 0;
        .menu--link{
            display: flex;
            justify-content: center;
            align-items: center;
            &:last-child{
                border-bottom: 0;
            }
        }
    }
    
}

    
</style>


<script>

export default{
    data(){
        return{
            iconChange:false
        }
    },
    methods:{
        
        menu() {
            const phoneMenu = document.querySelector(".header--menu");
            if(this.iconChange==true){
                this.iconChange=false;
            }
            else{
                this.iconChange=true
            }
            phoneMenu.classList.toggle("active");

            
        },
        closeMenu(){
            const phoneMenu = document.querySelector(".header--menu");
            this.iconChange=false
            phoneMenu.classList.remove("active")
        }
    },
    computed:{
        icon(){
          return  this.iconChange == true ? "close": "bars"
        },
    }
}





</script>