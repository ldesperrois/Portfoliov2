<template>
    <div class="form-control">
    <input :type="type" required :name="name">
        <label :for="text">
            <span v-for="(lettre,index) in text" :key="index" :style="{transitionDelay: `${index * 50}ms` }">
                {{ lettre }}
            </span>
        </label>
    </div>
</template>

<script lang="ts">
export default {
    data(){
        return{
            transition:0
        }
    },
    props: {
        type: {
            required: true,
            type: String
        },
        text: {
            required: true,
            type: String
        },
        name:{
            type:String
        }
    }
}
</script>

<style lang="scss" scoped >

.form-control {
  position: relative;
  margin: 20px 0 40px;
  flex: 1;
}

.form-control input {
  background-color: transparent;
  border: 0;
  border-bottom: 2px gray solid;
  display: block;
  
  padding-top: 15px;
  font-size: 18px;
  color: #000;
}

.form-control input:focus,
.form-control input:valid {
  outline: 0;
  border-bottom-color: #000
}

.form-control label {
  position: absolute;
  top: 5px;
  left: 0;
  pointer-events: none;
}

.form-control label span {
  display: inline-block;
  font-size: 18px;
  min-width: 5px;
  color: gray;
  transition: 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55);
}

.form-control input:focus+label span,
.form-control input:valid+label span {
  color: #000;
  transform: translateY(-20px);
}


</style>
