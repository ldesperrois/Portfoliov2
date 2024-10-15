<template>
    <div class="phce card card-1">
    <div :style="backgroundImage"  class="content">
        <h1>{{ this.compt.title }}</h1>
    </div>
  </div>
</template>
  
<script>
import { onMounted } from 'vue'

export default {
  props:{
    compt:{
      type:Object,
      required:true
    }
    
  },
  setup() {
    // Exécuter uniquement après que le DOM est disponible
    onMounted(() => {
      const phceEls = document.querySelectorAll(".phce") || []
      
      phceEls.forEach(phceEl => {
        phceEl.addEventListener("pointermove", phceSetPositions)
        
      })
      
      function phceSetPositions({ currentTarget: el, layerX: x, layerY: y }) {
        const { width: w, height: h } = el.getBoundingClientRect()
        el.style.setProperty("--posX", phceMapPositions(x, [0, w]))
        el.style.setProperty("--posY", phceMapPositions(y, [0, h]))
      }

      function phceMapPositions(value, from, to = [-1, 1], decimals = 2) {
        const newValue = (value - from[0]) * (to[1] - to[0]) / (from[1] - from[0]) + to[0]
        const val = Math.min(Math.max(newValue, to[0]), to[1])
        return decimals && decimals > 0
          ? Number(Math.round(val + 'e' + decimals) + 'e-' + decimals)
          : val
      }
    })
  },
  computed:{
    backgroundImage(){
      return{
      backgroundImage: `url(${this.compt.linkimage})`,
      backgroundSize: 'cover',  // tu peux personnaliser les autres styles ici
      backgroundPosition: 'center'
    }
    }
    
    
  },

}
</script>




  
<style lang="scss" scoped>
.phce {
  perspective: 1000px;
  position: relative;
}
h1{
  font-weight: 300;
  text-align: center;
  font-size: 20px;
}
.phce .content {
  position: relative;
  overflow: hidden;
  transform-style: preserve-3d;
}
.phce .content::before, .phce .content::after {
  content: "";
  position: absolute;
  inset: 0;
  z-index: -1;
  transform-style: preserve-3d;
}
.phce .content::before {
  background-image: var(--bg-image);
  background-size: cover;
}
.phce .content::after {
  background: var(--bg-overlay, none);
}
.phce:hover > .content::before {
  transform: scale(1.33) translateX(calc(-12.5% * var(--posX,0))) translateY(calc(-12.5% * var(--posY,0)));
}
.phce:hover > .content {
  transform: rotateX(calc(22.5deg * var(--posY,0))) rotateY(calc(-22.5deg * var(--posX,0)));
}
.phce:not(:hover) > .content, .phce:not(:hover) > .content::before {
  transition: transform var(--transition-duration, 500ms) var(--transition-timing-function, linear);
}

.card {
  width: min(30rem, 100%);
}



.content {
  display: grid;
  place-items: center;
  min-height: 16rem;
  padding: 2rem;
  border-radius: 1rem;
  font-family: system-ui, sans-serif;
  font-size: 2rem;
  color: white;
  --bg-overlay: rgb(0 0 0 / .5);
}

</style>