<template>
    <div class="typing-container">
     <span class="text_hide"></span>
      <span class="text">{{ text }}</span>
      <span class="text_cursor">|</span>
    </div>
</template>

<style lang="scss">
    .typing-container{
        position: relative;
        font-family: 'Plus Jakarta Sans'
    }
    .text{
   
    font-size: 2rem;
    }

    .text_hide{
        position: absolute;
        top: 0;
        bottom: 0;
        left: 0;
        right: 0;
        background-color:  #ECEFF1;
    }

    .text_cursor{
        position: absolute;
        top: 0;
        bottom: 0;
        left: 0;
        right: 0;
        background-color: transparent;
        border-left: 3px solid black;
    }
</style>
  
<script lang="ts">
  export default {
    props: {
      text: String
    },
    mounted() {
      this.typingAnimation();
    },
    /**
     * Fonction qui s'occupe de l'animation du titre projet
     */
    methods: {
        typingAnimation :  function():void{
    let text_element = document.querySelector(".text");
    
    let text_array = text_element.innerHTML.split("");
    
    let text_array_slice = text_element.innerHTML.split(" ");
    
    let text_len = text_array.length;

    const word_len = text_array_slice.map((word) => {
        return word.length;
    })


    let timings = {
        easing: `steps(${Number(word_len[0] + 1)}, end)`,
        delay: 2000,
        duration: 2000,
        fill: 'forwards'
    }

    let cursor_timings = {
        duration: 700,
        iterations: Infinity,
        easing: 'cubic-bezier(0,.26,.44,.93)'
    }

    document.querySelector(".text_cursor").animate([
        {
            opacity: 0
        },
        {
            opacity: 0, offset: 0.7
        },
        {
            opacity: 1
        }
    ], cursor_timings);

    if (text_array_slice.length == 1) {
        timings.easing = `steps(${Number(word_len[0])}, end)`;

        let reveal_animation = document.querySelector(".text_hide").animate([
            { left: '0%' },
            { left: `${(100 / text_len) * (word_len[0])}%` }
        ], timings);

        document.querySelector(".text_cursor").animate([
            { left: '0%' },
            { left: `${(100 / text_len) * (word_len[0])}%` }
        ], timings);

        reveal_animation.onfinish = () => {
            setTimeout(() => {
                document.querySelector('.text_hide').animate([
                    {left: '0%'}
                ], {
                    duration: 2000,
                    easing: 'cubic-bezier(.73,0,.38,.88)'
                });
                document.querySelector('.text_cursor').animate([
                    {left: '0%'}
                ], {
                    duration: 2000,
                    easing: 'cubic-bezier(.73,0,.38,.88)'
                });
                this.typingAnimation();
            }, 1000);
        }
    } else {
        document.querySelector(".text_hide").animate([
            { left: '0%' },
            { left: `${(100 / text_len) * (word_len[0] + 1)}%` }
        ], timings);

        document.querySelector(".text_cursor").animate([
            { left: '0%' },
            { left: `${(100 / text_len) * (word_len[0] + 1)}%` }
        ], timings);
    }


    for (let i = 1; i < text_array_slice.length; i++) {
        const single_word_len = word_len[i];
        if (i == 1) {
            var left_instance = (100 / text_len) * (word_len[i - 1] + 1);
        }

        let timings_2 = {
            easing: `steps(${Number(single_word_len + 1)}, end)`,
            delay: (2 * (i + 1) + (2 * i)) * (1000),
            duration: 2000,
            fill: 'forwards'
        }

        if (i == (text_array_slice.length - 1)) {
            timings_2.easing = `steps(${Number(single_word_len)}, end)`;
            let reveal_animation = document.querySelector(".text_hide").animate([
                { left: `${left_instance}%` },
                { left: `${left_instance + ((100 / text_len) * (word_len[i]))}%` }
            ], timings_2);

            document.querySelector(".text_cursor").animate([
                { left: `${left_instance}%` },
                { left: `${left_instance + ((100 / text_len) * (word_len[i]))}%` }
            ], timings_2);

            reveal_animation.onfinish = () => {
                setTimeout(() => {
                    document.querySelector('.text_hide').animate([
                        {left: '0%'}
                    ], {
                        duration: 2000,
                        easing: 'cubic-bezier(.73,0,.38,.88)'
                    });
                    document.querySelector('.text_cursor').animate([
                        {left: '0%'}
                    ], {
                        duration: 2000,
                        easing: 'cubic-bezier(.73,0,.38,.88)'
                    });
                    this.typingAnimation();
                }, 1000);
            }
        } else {
            document.querySelector(".text_hide").animate([
                { left: `${left_instance}%` },
                { left: `${left_instance + ((100 / text_len) * (word_len[i] + 1))}%` }
            ], timings_2);

            document.querySelector(".text_cursor").animate([
                { left: `${left_instance}%` },
                { left: `${left_instance + ((100 / text_len) * (word_len[i] + 1))}%` }
            ], timings_2);
        }

        left_instance = left_instance + ((100 / text_len) * (word_len[i] + 1));
    }
}
        
    },
}
  </script>