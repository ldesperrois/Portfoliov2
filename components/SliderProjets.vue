<template>
    <Modal :data="selectedProjet" :isVisible="showModal" @close="handleClose" />
    <div class="swiper-container">  
      <button class="swiper-button-prev" id="modall"></button>
      <Swiper
        :modules="[SwiperAutoplay, SwiperEffectCreative, SwiperPagination, SwiperNavigation]"
        :slides-per-view="perView"
        :pagination="{ clickable: true,el:'.swiper-pagination' }"
        :autoplay="{ delay: 5000 }"
        :centeredSlides="true"
        :navigation="{ prevEl: '.swiper-button-prev', nextEl: '.swiper-button-next' }"
        :loop="true"
        :spaceBetween="40"
        :breakpoints="{
          1100 :{
            slidesPerView :2
          },
          0:{
            slidesPerView:1
          }
        }"
      >
        <SwiperSlide v-for="(data, index) in datas" :key="index">
          <Card :projet="data" @click="handleCardClick" />
        </SwiperSlide>
      </Swiper>
      <div class="swiper-pagination"></div>
      <button class="swiper-button-next" id="modald"></button>
    </div>
</template>



<style lang="scss"  >
  $side:40px;
    .swiper-container {
        position: relative;
        overflow: visible;
        width: 100%;
        .swiper-pagination{
            position: absolute;
            bottom: -20px;
        }
        .swiper-button-prev,
        .swiper-button-next {
            position: absolute;
            top: 50%;
            transform: translateY(-50%);
            z-index: 10;
            background-color: rgba(0, 0, 0, 0.5); 
            color: #fff;
            border: none;
            border-radius: 50%;
            width: 40px;
            height: 40px;
            
            cursor: pointer;
            &::after {
            font-size: 18px;
            }
        }
        .swiper-button-next{
           right : var(--swiper-navigation-sides-offset, 0px)
        }

        .swiper-button-prev{
          left:var($side, 0px) ;
        }
       
        
    }
    .swiper{
        width: 90%;
    }
    .swiper-slide.swiper-slide-active{
        border-radius: 30px;
        display: flex;
        flex-direction: column;
        justify-content: center;
        color: #fff;
        transition: all 0.5s ease-in-out;
        align-items: center;
        &:hover > img.card--img{
            filter: brightness(45%);
        }
        &:hover  > p{
            opacity: 1;
        }
    }
    .swiper-slide{
        cursor: pointer;
    }
    

    @media  screen and (max-width:1100px) {
      .swiper{
        width: 80%;
      }
      
    }

    @media screen and (max-width:1024px) {
      img.card--img{
        filter : brightness(55%)!important;
      }
      p{
        opacity: 1!important;
      }
      #modald.swiper-button-next,#modall.swiper-button-prev{
        visibility: hidden;
      }
    }

   

    @media screen and (max-width:768px) {
      .swiper{
        width: 90%;
      }
    }

    @media screen and (max-width:450px) {
      .swiper{
        width: 95%;
      }
    }

</style>


<script lang="ts">

   export default{
    data(){
      return{
        showModal: false,
        selectedProjet :null
      }
    },
    props:{
      datas:{
        required:true
      }
      ,
      perView:{
        required:true,
        type:Number
      }
    },
    methods:{
      /**
       * Foncion qui s'occupe de gérer l'evenement de click d'une card ( apparition de la modal)
       * et vérification que la card est au centre du slider (porte la classe active)
       * @param event 
       * @param projet 
       */
      handleCardClick(event,projet){
          
        // Récupère l'element cliqué
          const element = event.target;
          // Pour tester si la card est présente au milieu du Slider
          if(element.parentNode.classList.contains("swiper-slide-active")){
            const html = document.getElementsByTagName("html")
            html[0].style.overflow="hidden"
            this.selectedProjet = projet;
            this.showModal=true;
          }


        
      },
      /**
       * méthode qui s'occupe de gérer les évenements à effectuer lors de la fermture de la modal
       */
      handleClose(){
          const html = document.getElementsByTagName("html")
          html[0].style.overflow="visible"
          this.showModal=false
      }
    }
   
   }
</script>