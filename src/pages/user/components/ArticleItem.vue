<template>
  <div class="article-item" @click.stop="goArticle">
    <!-- 大小写更改 -->
    <div class="article-left">
      <div class="article-title">{{itemData.name}}</div>
      <div class="article-overview">
        <div class="name">{{itemData.username}}</div>
        <div class="time">{{itemData.time}}</div>
      </div>
    </div>
    <div class="article-right">
      <div class="article-cover" :style="{backgroundImage: 'url(' + (itemData.covers[0].compress || itemData.covers[0].url) + ')'}"></div>
    </div>
  </div>
</template>

<style lang="scss" type="text/scss" scoped>
.article-item{
  display: flex;
  width: 100%;
  height: 230px;
  position: relative;
}
.article-left{
  flex-shrink: 1;
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  width: 0;
}
.article-title{
  font-size: 34px;
  line-height: 42px;
  padding-left: 30px;
  padding-top: 26px;
  overflow : hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  /*! autoprefixer: off */
  -webkit-box-orient: vertical;
  /* autoprefixer: on */
  white-space: normal;
  word-break: break-all;
}
.article-overview{
  width: 100%;
  overflow: hidden;
  font-size: 24px;
  color: #999;
  line-height: 32px;
  padding-bottom: 26px;
  display: flex;
}
.name{
  flex-grow: 0;
  flex-shrink: 1;
  padding-left: 30px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.time{
  flex-grow: 0;
  flex-shrink: 0;
  padding-left: 30px;
}
.article-right{
  flex-shrink: 0;
  flex-grow: 0;
  width: 286px;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}
.article-item:before{
  content: "";
  display: block;
  width: 100%;
  height: 2px;
  background: #E5E5E5;
  position: absolute;
  left: 0;
  bottom: 0;
  transform: scale(1, 0.5);
}
.article-cover{
  width: 226px;
  height: 170px;
  border-radius: 10px;
  background-repeat: no-repeat;
  background-size: cover;
  background-position: center;
  background-color: #f5f5f5;
}
</style>

<script>
export default {
  props: {
    itemData: {
      type: Object,
      required: true
    },
    router: {
      required: false
    }
  },
  data () {
    return {}
  },
  methods: {
    goArticle () {
      this.$router.push({name: 'NewsDetail', query: {id: this.itemData.id}})
    }
  }
}
</script>
