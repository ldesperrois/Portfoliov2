<template>
    <section id="programming-language">
        <div id="anchor-programming"></div>
        <h2>Outils manipulés</h2>
        <div id="container-programming">
            <canvas ref="canvas"></canvas>
        </div>
    </section>

</template>

<style lang="scss" scoped>
    #anchor-programming{
      position: relative;
      top: -100px;
    }
    #programming-language{
        margin-top: 50px;
        margin-bottom: 50px;
        width: 100%;
        h2{
            text-align: center;
            font-size: 35px ;
            margin-bottom: 2em;
        }
        #container-programming{
            display: flex;
            flex-direction: row;
            justify-content: center;
            width: 100%;
            ;
            canvas{
                width: 80%;
               display: block;
            }
        }
    }
    @media screen and (max-width:1024px){
        h2{
            margin-bottom: 1em;
        }
        canvas{
            width: 90%!important;
        }
    }
</style>

<script>




import Matter from 'matter-js'

export default {
  mounted() {
    const canvas = this.$refs.canvas;
    
    const listImage = ["/img/python.svg","/img/html.svg","/img/typescript.svg","/img/nuxtjs.svg","/img/php.svg","/img/css.svg","/img/postgresql.svg","/img/c.svg","/img/javascript.svg","/img/docker.svg","/img/laravel.svg","/img/vuejs.svg"]
   
    const Engine = Matter.Engine,
      Render = Matter.Render,
      Runner = Matter.Runner,
      Body = Matter.Body,
      Events = Matter.Events,
      Composite = Matter.Composite,
      Composites = Matter.Composites,
      Common = Matter.Common,
      MouseConstraint = Matter.MouseConstraint,
      Mouse = Matter.Mouse,
      Bodies = Matter.Bodies;

    // Créer l'engine et le monde
    const engine = Engine.create();
    const world = engine.world;

    // Créer le renderer
    const render = Render.create({
      canvas: canvas,
      engine: engine,
      options: {
        width: 800,
        height: 550,
        showAngleIndicator: false,
        wireframes: false, // Réalisme des objets
        background: '#ECEFF1',
        wireframeBackground: 'transparent',
        antialias: true,    

      },
    });

    const context = render.context;
    context.imageSmoothingEnabled = true;
    context.imageSmoothingQuality = 'high'; 

    Render.run(render);

    // Créer un runner pour animer le monde
    const runner = Runner.create();
    Runner.run(runner, engine);

    // Ajouter des corps statiques (bordures)
    Composite.add(world, [
      Bodies.rectangle(400, 0, 800, 50, { isStatic: true,render: {
      fillStyle: '#ECEFF1' 
    } }),
      Bodies.rectangle(400, 600, 800, 50, { isStatic: true,render: {
      fillStyle: '#ECEFF1' 
    } }),
      Bodies.rectangle(800, 300, 50, 600, { isStatic: true ,render: {
      fillStyle: '#ECEFF1' 
    } }),
      Bodies.rectangle(0, 300, 50, 600, { isStatic: true,render: {
      fillStyle: '#ECEFF1' 
    } }),
    ]);

    // Fonction explosion
    const explosion = (engine, delta) => {
      const timeScale = (1000 / 60) / delta;
      const bodies = Composite.allBodies(engine.world);

      bodies.forEach(body => {
        if (!body.isStatic && body.position.y >= 500) {
          const forceMagnitude = (0.06 * body.mass) * timeScale;
          Body.applyForce(body, body.position, {
            x: (forceMagnitude + Common.random() * forceMagnitude) * Common.choose([1, -1]),
            y: -forceMagnitude + Common.random() * -forceMagnitude,
          });
        }
      });
    };

    // Gestion du temps
    let timeScaleTarget = 1;
    let lastTime = Common.now();

    Events.on(engine, 'afterUpdate', (event) => {
      const timeScale = (event.delta || (1000 / 60)) / 1000;
      engine.timing.timeScale += (timeScaleTarget - engine.timing.timeScale) * 12 * timeScale;

      if (Common.now() - lastTime >= 2000) {
        timeScaleTarget = timeScaleTarget < 1 ? 1 : 0;
        explosion(engine, event.delta);
        lastTime = Common.now();
      }
    });

    const bodyOptions = {
      frictionAir: 0,
      friction: 0.0001,
      restitution: 0.8,
    };

    listImage.forEach((imagePath, index) => {
      const xPosition = 100 + index+1 * 70; 
      const yPosition = 100;
      const body = Bodies.rectangle(xPosition, yPosition, 80, 80, {
        bodyOptions,
        render: {
          sprite: {
            texture: imagePath,
            xScale: 2,
            yScale: 2,
          }
        }
      });

      Composite.add(world, body); 
    });

   

    
    Render.lookAt(render, {
      min: { x: 0, y: 150 },
      max: { x: 800, y: 600 },
    });
  },
}
</script>

