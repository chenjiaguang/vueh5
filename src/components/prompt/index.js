import Vue from 'vue'
import main from './Prompt.vue'

let Main = Vue.extend(main)

let Prompt = {
  showAlert: (options, onConfirm, onCancel) => {
    let {contentText, leftText, rightText} = options
    let div = window.document.createElement('div')
    let _main = new Main({
      data: function () {
        return {
          contentText,
          leftText,
          rightText,
          cancel: onCancel || function () {},
          confirm: onConfirm || function () {}
        }
      }
    })
    let id = 'custom-prompt-' + new Date().getTime()
    _main.id = id
    window.document.body.appendChild(div)
    _main.$mount(div)
  },
  hidePrompt: (id, callback) => {
    let prompt = window.document.getElementById(id)
    window.document.body.removeChild(prompt)
    if (callback) {
      callback()
    }
  }
}

export default Prompt
