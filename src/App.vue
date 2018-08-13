<template>
  <div id="app">
    <keep-alive>
      <router-view v-if="$route.meta.keepAlive"></router-view>
    </keep-alive>
    <router-view v-if="!$route.meta.keepAlive"></router-view>
  </div>
</template>

<script>
export default {
  name: 'App',
  data () {
    return {
      transitionName: 'none'
    }
  }
}
</script>

<style>
  body{
    margin: 0;
    color: #333;
    /* background-color: #fff; */
  }
  *,::before,::after{
    margin:0;
    padding:0;
    /*清除移动端默认的点击高亮效果*/
    -webkit-tap-highlight-color:transparent;
    /*设置以边框开始计算宽度*/
    -webkit-box-sizing:border-box;
    box-sizing:border-box;
  }
  a{
    color:#333;
    text-decoration:none;
  }

  a:hover{
    text-decoration:none;
  }

  ul,ol{
    list-style:none;
  }

  input{
    border:none;
    outline:none;
    /*清除移动端默认的表单样式*/
    -webkit-appearance:none;
  }

  .clearfix:after {
    content: "";
    display: block;
    height: 0;
    clear: both;
    visibility: hidden;
  }
  .fl{
    float: left;
  }
  .fr{
    float: right;
  }
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
</style>
