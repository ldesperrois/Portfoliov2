<template>
    <div class="swiper-container" id="modal-swiper">
        
        <Swiper
        :modules="[SwiperAutoplay, SwiperEffectCreative, SwiperPagination, SwiperNavigation]"
        
        :pagination="{ clickable: true}"
        :space-between="50"
        :navigation="{ prevEl: '.swiper-button-prev', nextEl: '.swiper-button-next' }"
        :loop="true"
        :autoplay="{ delay: 5000 }"
        >
        <button class="swiper-button-prev custom--button"></button>
            <SwiperSlide v-for="(image,index) in imageList" :key="index">
                <NuxtImg :src="image" class="modal--img"/>
            </SwiperSlide>
            <button class="swiper-button-next custom--button"></button>
        </Swiper>
    </div>
</template>

<script lang="ts">


    export default{
        props:{
            imageList:{
                
                required:true

            }
        }
    }

</script>

<style lang="scss" scoped>

.modal--img{
    box-shadow: rgba(0, 0, 0, 0.24) 0px 3px 8px;
    
    max-width: 500px;
    width: 80%;
    height: 250px;
}
#modal-swiper{
    position: relative;
    overflow: visible;
    width: 100%;
    .swiper-button-prev
        .swiper-button-next {
            position: absolute;
            top: 50%;
            transform: translateY(-50%);
            z-index: 10;
            color: #000;
            border: none;
            border-radius: 50%;
            width: 40px;
            height: 40px;
            display: flex;
            justify-content: center;
            align-items: center;
            cursor: pointer;
            &::after {
            font-size: 18px;
            }
        }
}

    
.custom--button{
    background-color: transparent !important;
    color: #000 !important;
}

@media screen and (max-width:1300px) {
    #modal-swiper{
        .swiper-button-next{
            right: var(--swiper-navigation-sides-offset, -15px);
        }
        .swiper-button-prev{
            left: var(--swiper-navigation-sides-offset, -15px);
        }
    }

}

@media screen and (max-width:1024px){
        button{
            visibility: hidden;
        }
        .modal--img{width: 100%;
        min-height: 250px;}
    }

</style>