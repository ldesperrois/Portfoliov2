<template>
    <Transition name="fade" @before-enter="beforeEnter" @enter="enter" @leave="leave">
        <div v-if="isVisible" class="section--modal" @click="closeSection">
            <div class="modal" >
                <div class="title">
                    <div class="head-modal">
                        <h3>{{ data.name }}</h3>
                        <NuxtLink  v-show="data.website" :href="data.link">
                            <FontAwesome  icon="link"/>
                        </NuxtLink>
                    </div>
                    
                    <font-awesome id="close" @click='close' class="socialnetwork" icon="close" />
                </div>
                <div class="content">
                    <SliderModal :imageList="data.listeProjet"/>
                    <div class="projet--text">
                        <div class="description">
                            <h4>Description</h4>
                            <p>{{ data.description }}</p>
                        </div>
                        <div class="techno">
                            <div>
                                <h4>Technologies utilisées</h4>
                                <div id="programation">
                                    <NuxtImg class="svgLanguage" v-for="(img,i) in data.langages" :key="i" :src="'/img/'+img+'.svg'"/>                          

                                </div>
            
                            </div>
                            <div>
                                <NuxtLink :to="data.github">
                                    <font-awesome class="github" :icon="['fab', 'github']" />
                                </NuxtLink>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>  
    </Transition>
</template>


<script lang="ts">
export default{
    props: {
        data: {
            type: Object,
        },
        isVisible:{
            type:Boolean,
        }
        
    },
    methods:{
        // Emettre un evenement de close au composant Parent
        close(e){
            
                this.$emit('close')
            
            
        },
        closeSection(e){
            if(!e.target.closest('.modal')){
                this.$emit('close')
            }
        },
        // Avant l'apparition de la modal
        beforeEnter(el) {
            el.style.opacity = 0;
        },
        // à l'apparition
        enter(el, done) {
            el.offsetHeight; // Trigger reflow
            el.style.transition = 'opacity 0.5s';
            el.style.opacity = 1;
            done();
        },
        // en quittant la modal
        leave(el, done) {
            el.style.transition = 'opacity 0.5s';
            el.style.opacity = 0;
            done();
        },
    }, 
}
</script>
<style lang="scss" scoped>
    svg.language{
        width: 30px;
        height: 30px;
    }
    .section--modal{
        position: fixed;
        top: 0;
        left: 0;
        bottom: 0;
        right: 0;
        
        background: rgba(255, 255, 255, 0.3); 
        z-index: 100;
        align-items: center;
        justify-content: center;
        backdrop-filter: blur(20px); 
    
        .modal{
            max-height: 88dvh;
            overflow-y: auto;
            padding:20px;
            z-index: 110;
            border-radius: 20px;
            background: #fff;
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%,-50%);
            width: 50%;
            box-shadow: 0 5px 30px rgba(0,0,0,.30);
            transition: 0.5s all;
            
            .title{
                display: flex;
                flex-direction: row;
                justify-content: space-between;
                align-items: center;
                margin-bottom: 20px;
            .head-modal{
                display: flex;
                align-items: center;
                gap: 20px;
                h3{
                    font-size: 23px;
                }
            }
            
            .socialnetwork{
                font-size: 20px;
                cursor: pointer;
            }
            p{
                margin:0;
            }
        }
        .content{
            display: flex;
            flex-direction: column;
            gap: 8px;
            .projet--text{
                display: flex;
                flex-direction: column;
                .techno{
                    display: flex;
                    flex-direction: row;
                    justify-content: space-between;
                    align-items: end;
                    div{
                        a{
                            color: #000;
                        .github{
                            font-size: 40px;
                        }
                        }
                        div{
                            display: flex;
                            flex-direction: row;
                            gap: 20px;
                            img{
                                width: 50px;
                            }
                        }
                    }
                }
                h4{
                    
                    font-size: 19px;
                }
                p{
                    font-size: 15px;
                    font-weight: 300;
                }
            }
        }
        }
    }
    .section--modal.active{
        visibility: visible;
        opacity: 1;
        display: block;
    }
    @media screen and (max-width:1024px) {
        #programation{
            flex-wrap: wrap;
        }
        .modal{
            width: 85%!important;
        }
        .projet--text{
            h4{
                font-size: 25px!important;
            }
            p{
                font-size: 20px!important;
            }
        }
        h3{
            font-size: 28px!important;
        }
    }
    

    
</style>