<template>
    <section id="programming-language">
        <div id="anchor-programming"></div>
        <h2>{{ t('outils.title') }}</h2>
        <div id="container-programming">
            <div class="canvas-wrapper">
                <canvas ref="canvas"></canvas>
            </div>
        </div>
    </section>
</template>

<style lang="scss" scoped>
    #anchor-programming{
      position: relative;
      top: -100px;
    }
    #programming-language{
        margin-top: 150px;
        margin-bottom: 50px;
        width: 100%;
        h2{
            text-align: center;
            font-size: 35px ;
            margin-bottom: 2.5rem;
        }
        #container-programming{
            display: flex;
            flex-direction: row;
            justify-content: center;
            width: 100%;
            
            .canvas-wrapper {
                width: 80%;
                display: flex;
                justify-content: center;
                border-radius: 24px;
                overflow: hidden;
                box-shadow: 0 15px 35px -10px rgba(0, 0, 0, 0.12), 0 0 0 1px rgba(0, 0, 0, 0.06);
                background: #ECEFF1;
                
                canvas{
                    width: 100%;
                    display: block;
                    cursor: grab;
                    touch-action: pan-y;
                }
            }
        }
    }
    @media screen and (max-width:1024px){
        .canvas-wrapper{
            width: 90%!important;
        }
    }
</style>

<script>




import Matter from 'matter-js';
import { usePortfolioI18n } from '~/composables/usePortfolioI18n';

export default {
  data() {
    return {
      engine: null,
      render: null,
      runner: null,
      mouseConstraint: null,
      customTouchStart: null,
      customTouchMove: null,
      customTouchEnd: null,
    };
  },
  setup() {
    const { t } = usePortfolioI18n();
    return { t };
  },
  mounted() {
    const canvas = this.$refs.canvas;
    if (!canvas) return;
    
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
    this.engine = Engine.create();
    const engine = this.engine;
    const world = engine.world;

    // Créer le renderer
    this.render = Render.create({
      canvas: canvas,
      engine: engine,
      options: {
        width: 900,
        height: 650,
        showAngleIndicator: false,
        wireframes: false, // Réalisme des objets
        background: '#ECEFF1',
        wireframeBackground: 'transparent',
        antialias: true,    

      },
    });
    const render = this.render;

    const context = render.context;
    context.imageSmoothingEnabled = true;
    context.imageSmoothingQuality = 'high'; 

    Render.run(render);

    // Créer un runner pour animer le monde
    this.runner = Runner.create();
    const runner = this.runner;
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
            xScale: 2.5,
            yScale: 2.5,
          }
        }
      });

      Composite.add(world, body); 
    });

    // Interaction souris pour attraper et lancer les éléments
    const mouse = Mouse.create(render.canvas);
    this.mouseConstraint = MouseConstraint.create(engine, {
      mouse: mouse,
      constraint: {
        stiffness: 0.2,
        render: {
          visible: false,
        },
      },
    });
    const mouseConstraint = this.mouseConstraint;

    Composite.add(world, mouseConstraint);
    render.mouse = mouse;

    // Ne pas intercepter le scroll de la page (roulette de souris & trackpad)
    if (mouse.element) {
      mouse.element.removeEventListener('wheel', mouse.mousewheel);
      mouse.element.removeEventListener('mousewheel', mouse.mousewheel);
      mouse.element.removeEventListener('DOMMouseScroll', mouse.mousewheel);

      // Permettre le défilement tactile naturel sur mobile si l'utilisateur ne touche pas directement un logo
      mouse.element.removeEventListener('touchstart', mouse.mousedown);
      mouse.element.removeEventListener('touchmove', mouse.mousemove);
      mouse.element.removeEventListener('touchend', mouse.mouseup);

      let isTouchingBody = false;

      this.customTouchStart = (e) => {
        const position = Mouse._getRelativeMousePosition(e, mouse.element, mouse.pixelRatio);
        const nonStaticBodies = Composite.allBodies(world).filter((b) => !b.isStatic);
        const hit = Matter.Query.point(nonStaticBodies, position);
        if (hit.length > 0) {
          isTouchingBody = true;
          mouse.mousedown(e);
          if (e.cancelable) e.preventDefault();
        } else {
          isTouchingBody = false;
        }
      };

      this.customTouchMove = (e) => {
        if (isTouchingBody) {
          mouse.mousemove(e);
          if (e.cancelable) e.preventDefault();
        }
      };

      this.customTouchEnd = (e) => {
        if (isTouchingBody) {
          mouse.mouseup(e);
          isTouchingBody = false;
        }
      };

      canvas.addEventListener('touchstart', this.customTouchStart, { passive: false });
      canvas.addEventListener('touchmove', this.customTouchMove, { passive: false });
      canvas.addEventListener('touchend', this.customTouchEnd, { passive: false });
    }

    // Gestion du curseur au survol
    Events.on(mouseConstraint, 'mousemove', () => {
      if (mouseConstraint.body) {
        canvas.style.cursor = 'grabbing';
      } else {
        const nonStaticBodies = Composite.allBodies(world).filter((b) => !b.isStatic);
        const hit = Matter.Query.point(nonStaticBodies, mouse.position);
        canvas.style.cursor = hit.length > 0 ? 'grab' : 'default';
      }
    });

    Events.on(mouseConstraint, 'startdrag', () => {
      canvas.style.cursor = 'grabbing';
    });

    Events.on(mouseConstraint, 'enddrag', () => {
      canvas.style.cursor = 'grab';
    });

    Render.lookAt(render, {
      min: { x: 0, y: 150 },
      max: { x: 800, y: 600 },
    });
  },
  beforeUnmount() {
    const canvas = this.$refs.canvas;
    if (canvas && this.customTouchStart) {
      canvas.removeEventListener('touchstart', this.customTouchStart);
      canvas.removeEventListener('touchmove', this.customTouchMove);
      canvas.removeEventListener('touchend', this.customTouchEnd);
    }
    if (this.runner) {
      Matter.Runner.stop(this.runner);
      this.runner = null;
    }
    if (this.render) {
      Matter.Render.stop(this.render);
      if (this.render.frameRequestId) {
        cancelAnimationFrame(this.render.frameRequestId);
      }
      this.render = null;
    }
    if (this.mouseConstraint) {
      Matter.Events.off(this.mouseConstraint);
      this.mouseConstraint = null;
    }
    if (this.engine) {
      Matter.Events.off(this.engine);
      Matter.World.clear(this.engine.world, false);
      Matter.Engine.clear(this.engine);
      this.engine = null;
    }
  },
}
</script>

