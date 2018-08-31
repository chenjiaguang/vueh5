//话题容器
<template>
  <div v-if="topicInfo && topicInfo.length > 0" class="topic-box clearfix">
    <div v-for="(item, idx) in topicInfo" :key="idx" @click="()=>click(item.id)" class="topic-item fl"><i class="iconfont icon-topic relative-topic-icon"></i>{{item.title}}</div>
  </div>
</template>
<script>
export default {
  props: ['topicInfo'],
  data () {
    return {}
  },
  computed: {},
  components: {},
  methods: {
    click (id) {
      this.$router.push({
        name: 'TopicDetail',
        query: { topic_id: id },
        params: {resetData: true}
      })
    }
  }
}
</script>
<style scoped>
.topic-box {
  overflow: hidden;
  padding: 0 0 14px 0;
}
.topic-item {
  height: 48px;
  line-height: 48px;
  background-color: #f0f0f0;
  padding: 0 20px;
  border-radius: 5px;
  margin: 0 14px 10px 0;
}
.fl {
  float: left;
}
.clearfix:after {
  content: "";
  display: block;
  width: 100%;
  height: 0;
  visibility: hidden;
  clear: both;
}
.relative-topic-icon {
  font-size: 24px;
  color: #ff611a;
  margin-right: 10px;
}
</style>
