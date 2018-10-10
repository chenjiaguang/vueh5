import Vue from 'vue'
import main from './Video.vue'

let Main = Vue.extend(main)

let preview = {
  init: (obj) => {
    let {dynamic_id, video_id, poster, video_time, duration, has_like, like_num, comment_num, from} = obj
    let div = window.document.createElement('div')
    let _main = new Main({
      data: function () {
        return {
          timer: null,
          video: null,
          buffered: [{
            start: 0,
            end: 0
          }],
          pageData: {
            dynamic_id,
            video_id,
            poster,
            video_time,
            duration,
            has_like,
            like_num,
            comment_num,
            from,
            first: true,
            title: '',
            show_buttons: true,
            min: 0,
            max: 0,
            percent: 0,
            paused: true,
            ended: false,
            waiting: true,
            show_error: false
          },
          zIndex: new Date().getTime()
        }
      }
    })
    window.document.body.appendChild(div)
    _main.$mount(div)
    window._video = _main
  },
  show: (obj) => {
    let {dynamic_id, video_url, poster, video_time, duration, has_like, like_num, comment_num, from} = obj
    if (window._video) {
      // window._video.pageData.video_time = video_time
      // window._video.pageData.show = true
      // window._video.video.poster(poster)
      // window._video.video.src(video_url)
      // window._video.video.play()
      document.getElementsByClassName('pause-and-play')[0].click()
    }
  },
  hide: () => {
    if (window._video) {
      window._video.pageData.show = false
      window._video.video.reset()
    }
  },
  distory: () => {
    if (window._video) {
      window._video.video.dispose()
      window._video.pageData.show = false
      window._video = null
    }
  }
}

export default preview
