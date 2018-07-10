import Vue from 'vue'
import main from './Modal.vue'

let Main = Vue.extend(main)

let Modal = {
    showAlert: (text) => {
        let div = window.document.createElement('div')
        let _main = new Main({
            data: function () {
                return {
                    text: text
                }
            }
        })
        _main.id = '_custom_modal_'
        window.document.body.appendChild(div)
        _main.$mount(div)
    },
    hideAlert: () => {
        let modal = window.document.getElementById('_custom_modal_')
        window.document.body.removeChild(modal)
    }
}

export default Modal
