<template>
  <div class="hello">
    <h1 @click="preview">{{ msg }}</h1>
    <h2 @click="hidePreview">Essential Links</h2>
    <ul>
      <li>
        <a
          href="https://vuejs.org"
          target="_blank"
        >
          Core Docs
        </a>
      </li>
      <li>
        <a
          href="https://forum.vuejs.org"
          target="_blank"
        >
          Forum
        </a>
      </li>
      <li>
        <a
          href="https://chat.vuejs.org"
          target="_blank"
        >
          Community Chat
        </a>
      </li>
      <li>
        <a
          href="https://twitter.com/vuejs"
          target="_blank"
        >
          Twitter
        </a>
      </li>
      <br>
      <li>
        <a
          href="http://vuejs-templates.github.io/webpack/"
          target="_blank"
        >
          Docs for This Template
        </a>
      </li>
    </ul>
    <h2>Ecosystem</h2>
    <ul>
      <li>
        <a
          href="http://router.vuejs.org/"
          target="_blank"
        >
          vue-router
        </a>
      </li>
      <li>
        <a
          href="http://vuex.vuejs.org/"
          target="_blank"
        >
          vuex
        </a>
      </li>
      <li>
        <a
          href="http://vue-loader.vuejs.org/"
          target="_blank"
        >
          vue-loader
        </a>
      </li>
      <li>
        <a
          href="https://github.com/vuejs/awesome-vue"
          target="_blank"
        >
          awesome-vue
        </a>
      </li>
    </ul>
  </div>
</template>

<script>
import ImagePreview from './imagePreview'
export default {
  name: 'HelloWorld',
  data () {
    return {
      msg: 'Welcome to Your Vue.js App'
    }
  },
  methods: {
    goActivity () {
      console.log('goActivity')
      this.$router.push({name: 'ActivityDetail', query: {id: 20}})
    },
    preview () {
      ImagePreview.show([
        'http://pic.pptbz.com/201506/2015070581208537.JPG',
        'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1531403270905&di=d86baceda90dad89a813018d3a46b936&imgtype=0&src=http%3A%2F%2Fp2.qhimg.com%2Ft011fc13354f12d1a46.jpg',
        'http://img.zcool.cn/community/01ca8c573c04b832f8757cb97b2444.jpg@1280w_1l_2o_100sh.jpg',
        'http://img.zcool.cn/community/0181845834f4eda8012060c8c95113.JPG@1280w_1l_2o_100sh.png'
        ],
        55
      )
    },
    hidePreview () {
      ImagePreview.hide(55)
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h1, h2 {
  font-weight: normal;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>
