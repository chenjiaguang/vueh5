import Vue from 'vue'
import main from './ImagePreview.vue'

let Main = Vue.extend(main)

let ImagePreview = {
    show: (obj, router) => {
        let {images, id, idx, options} = obj
        let _initialOptions = {
            width: window.innerWidth,
            height: window.innerHeight,
            initialSlide: idx
        }
        let _options = Object.assign({}, _initialOptions, options)
        let div = window.document.createElement('div')
        let _id = 'custom-preview-image-' + (id || new Date().getTime())
        let _main = new Main({
            data: function () {
                return {
                    images: images,
                    id: _id,
                    swiperOption: _options,
                    timestap: new Date().getTime()
                }
            },
            methods: {
                onHide: function () {
                    window.previewImageId = null
                    router && router.go(-1)
                }
            }
        })
        window.document.body.appendChild(div)
        _main.$mount(div)
        window.previewImageId = _id // 查看大图窗口id
        let _query = JSON.parse(JSON.stringify(router.history.current.query))
        let _params = JSON.parse(JSON.stringify(router.history.current.params))
        router && router.push({name: router.name, query: Object.assign({}, _query, {previewImage: true}), params: Object.assign({}, _params, {previewImage: true})})
        return _main
    },
    hide: (element) => {
        let imagePreview = window.document.getElementById(element.id || element)
        window.document.body.removeChild(imagePreview)
    }
}

export default ImagePreview
