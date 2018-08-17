<template>
  <div class="activity-item" @click.stop="goActivity">
    <div class="activity-pic" :style="{backgroundImage: 'url(' + itemData.covers[0].compress + ')'}"></div>
    <div class="activity-overview">
      <div class="title">{{itemData.title}}</div>
      <div class="address">{{itemData.address || '线上活动'}}</div>
      <div class="time">{{itemData.time_text}}</div>
      <div class="fee">{{itemData.money || '免费'}}</div>
    </div>
    <div class="activity-status" :style="{color: itemData.status_text === '已结束' ? '#999' : '#1EB0FD', borderColor: itemData.status_text === '已结束' ? '#999' : '#1EB0FD'}">{{itemData.status_text}}</div>
  </div>
</template>

<style lang="scss" type="text/scss" scoped>
.clearfix:after{
  content: "";
  display: block;
  width: 100%;
  height: 0;
  visibility: hidden;
  clear: both;
}
.fl{
  float: left;
}
.fr{
  float: right;
}
.activity-item{
  width: 100%;
  padding: 0 4% 33px;
  min-height: 198px;
  box-sizing: border-box;
  position: relative;
  text-align: left;
  background-color: #fff;
}
.activity-item:after{
  content: "";
  display: block;
  width: 276%;
  height: 3px;
  position: absolute;
  left: 4%;
  bottom: 0;
  background: #E5E5E5;
  transform: scale(0.3333, 0.3333);
  transform-origin: 0 100%;
}
.activity-pic{
  width: 220px;
  height: 138px;
  position: absolute;
  left: 4%;
  top: 30px;
  background-repeat: no-repeat;
  background-size: cover;
  background-position: center;
}
.activity-overview{
  padding: 0 0 0 240px;
}
.title{
  font-size: 26px;
  line-height: 34px;
  color: #333;
  font-weight: bold;
  padding-top: 26px;
  white-space: normal;
}
.address{
  font-size: 24px;
  line-height: 32px;
  color: #999;
  padding-top: 8px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.time{
  font-size: 24px;
  line-height: 32px;
  color: #999;
  padding-top: 8px;
}
.fee{
  font-size: 24px;
  color: #FF3F53;
  line-height: 32px;
  padding-top: 20px;
}
.activity-status{
  width: 288px;
  height: 114px;
  line-height: 114px;
  border-style: solid;
  border-width: 3px;
  border-radius: 15px;
  text-align: center;
  position: absolute;
  right: 4%;
  bottom: 30px;
  transform: scale(0.3333, 0.3333);
  transform-origin: 100% 100%;
  font-size: 60px;
}
</style>

<script>
export default {
  props: {
    itemData: {
      type: Object,
      required: true
    }
  },
  data() {
    return {}
  },
  methods: {
    goActivity () { // 跳转活动详情页
      this.$router.push({name: 'ActivityDetail', query: { id: this.itemData.id}})
    }
  }
}
</script>
