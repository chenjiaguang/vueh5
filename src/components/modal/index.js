import Vue from 'vue'
import main from './Modal.vue'

let Main = Vue.extend(main)

let Modal = {
  showAlert: (text, onClose, btnText) => {
    let div = window.document.createElement('div')
    let _main = new Main({
      data: function () {
        return {
          text: text,
          onClose: onClose || function () {},
          btnText: btnText || '确定'
        }
      }
    })
    let id = 'custom-modal-' + new Date().getTime()
    _main.id = id
    window.document.body.appendChild(div)
    _main.$mount(div)
    window._alert_id = id
  },
  hideAlert: (id, onClose) => {
    let modal = window.document.getElementById(id)
    window.document.body.removeChild(modal)
    window._alert_id = null
    console.log('onClose', onClose)
    if (onClose) {
      onClose()
    }
  }
}

export default Modal
