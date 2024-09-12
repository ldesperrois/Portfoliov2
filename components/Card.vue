<template>
    <NuxtImg @click="handleClick" :src="projet.img" :id="projet.id" class="card--img"/>
    <p class="card--title">{{ projet.name }}</p>
</template>

<style lang="scss" scoped>

  img{
      width: 100%;
      height: 500px;
      object-fit: cover;
      transition: all 0.5s ease-in-out;
      border-radius: 30px;
  }
  p{
      pointer-events: none
      ;
      position: absolute;
      opacity: 0;
      font-size: 30px;
      transition: opacity 0.5s ease-in-out;
  }
</style>

<script lang="ts">
  export default{
      name : "Card",
      props : {
          projet :{
            type: Object,
            required: true
          }
      },
      emits:["click"],
      // Emission de l'evenement et du projet correspondant au composant parent
      methods:{
        handleClick(event){
          this.$emit('click',event,this.projet)
        }
      }
  }  
</script>
