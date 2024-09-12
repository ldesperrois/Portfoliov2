<template>
  
  <div id="app">
    <div id="content">
      <Header/>
      <NuxtPage/>
      <Footer/>
    </div>
  </div>

</template>


<style lang="scss">
  
  #app{
    min-height: 100%;
  }
  #content.active{
    filter: blur(20px);
    user-select: none;
    pointer-events: none;
    overflow: none;
  }



</style>
