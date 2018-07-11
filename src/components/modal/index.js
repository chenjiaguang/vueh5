import Vue from 'vue'
import main from './Modal.vue'

let Main = Vue.extend(main)

let Modal = {
    showAlert: (text, onClose) => {
        let div = window.document.createElement('div')
        let _main = new Main({
            data: function () {
                return {
                    text: text,
                    onClose: onClose || function () {}
                }
            }
        })
        let id = 'custom-modal-' + new Date().getTime()
        _main.id = id
        window.document.body.appendChild(div)
        _main.$mount(div)
    },
    hideAlert: (id, onClose) => {
        let modal = window.document.getElementById(id)
        window.document.body.removeChild(modal)
        console.log('onClose', onClose)
        if (onClose) {
            onClose()
        }
    }
}

export default Modal
