import Vue from 'vue'
import main from './ImagePreview.vue'

let Main = Vue.extend(main)

let ImagePreview = {
    show: (obj) => {
        let {images, id, idx, options} = obj
        let _initialOptions = {
            width: window.innerWidth,
            height: window.innerHeight,
            initialSlide: idx
        }
        let _options = Object.assign({}, _initialOptions, options)
        let div = window.document.createElement('div')
        let _main = new Main({
            data: function () {
                return {
                    images: images,
                    id: 'custom-preview-image-' + (id || new Date().getTime()),
                    swiperOption: _options
                }
            }
        })
        window.document.body.appendChild(div)
        _main.$mount(div)
        return _main
    },
    hide: (element) => {
        let imagePreview = window.document.getElementById(element.id || element)
        window.document.body.removeChild(imagePreview)
    }
}

export default ImagePreview
