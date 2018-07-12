import Vue from 'vue'
import main from './ImagePreview.vue'

let Main = Vue.extend(main)

let ImagePreview = {
    show: (images, id, options) => {
        let _initialOptions = {
            width: window.innerWidth,
            height: window.innerHeight
        }
        let _options = Object.assign({}, _initialOptions, options)
        let div = window.document.createElement('div')
        let _main = new Main({
            data: function () {
                return {
                    images: images,
                    id: 'custom-preview-image-' + id,
                    swiperOption: _options
                }
            }
        })
        window.document.body.appendChild(div)
        _main.$mount(div)
    },
    hide: (id) => {
        let imagePreview = window.document.getElementById('custom-preview-image-' + id)
        window.document.body.removeChild(imagePreview)
    }
}

export default ImagePreview
