<template>
  <div class="promotion-page">
    <div>推广首页</div>
    <div v-if="$route.query.activity_id">活动id:{{$route.query.activity_id}}</div>
  </div>
</template>
