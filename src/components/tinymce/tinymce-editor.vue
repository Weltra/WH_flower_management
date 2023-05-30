<template>
    <div class="tinymce-editor">
        <editor v-model="myValue" :init="init" :disabled="disabled" @onClick="onClick">
        </editor>
    </div>
</template>
  
<script>
import tinymce from 'tinymce/tinymce'
import Editor from '@tinymce/tinymce-vue'
import 'tinymce/themes/silver/theme'
import 'tinymce/plugins/image'
import 'tinymce/plugins/media'
import 'tinymce/plugins/table'
import 'tinymce/plugins/lists'
import 'tinymce/plugins/contextmenu'
import 'tinymce/plugins/wordcount'
import 'tinymce/plugins/colorpicker'
import 'tinymce/plugins/textcolor'
import 'tinymce/plugins/preview'
import 'tinymce/icons/default/icons.min.js'
import 'tinymce/skins/ui/oxide/skin.min.css'
import 'tinymce/skins/ui/oxide/content.inline.min.css'

import { client } from './oss.js'
export default {
    components: {
        Editor
    },
    props: {
        // 传入一个value，使组件支持v-model绑定
        value: {
            type: String,
            default: ''
        },
        disabled: {
            type: Boolean,
            default: false
        },
        plugins: {
            type: [String, Array],
            default: 'lists image media table textcolor wordcount contextmenu preview'
        },
        toolbar: {
            type: [String, Array],
            default: 'undo redo |  formatselect | bold italic | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | lists image media table | removeformat preview'
        }
    },
    data() {
        return {
            // 初始化配置
            init: {
                height: 700,
                width: 1480,
                plugins: this.plugins,
                toolbar: this.toolbar,
                branding: false,
                menubar: true,
                // 此处为图片上传处理函数，这里以阿里云oss上传图片为例，
                // 如需ajax上传可参考https://www.tiny.cloud/docs/configure/file-image-upload/#images_upload_handler
                images_upload_handler: (blobInfo, success, failure) => {
                    var filename = blobInfo.filename()
                    var index = filename.lastIndexOf('.')
                    var suffix = filename.substring(index + 1, filename.length)
                    // 重构文件名 加上时间序列防止重名
                    filename = this.$md5(blobInfo.base64()) + this.getTime() + '.' + suffix
                    client.multipartUpload(filename, blobInfo.blob()).then(function (result) {
                        if (result.res.requestUrls) {
                            console.log('返回结果', result)
                            success(result.res.requestUrls[0].split('?')[0])
                        }
                    }).catch(function (err) {
                        console.log(err)
                    })
                }
            },
            myValue: this.value
        }
    },
    mounted() {
        tinymce.init({
            selector: 'tinymce-editor'
        })
    },
    methods: {
        // 添加相关的事件，可用的事件参照文档=> https://github.com/tinymce/tinymce-vue => All available events
        // 需要什么事件可以自己增加
        onClick(e) {
            this.$emit('onClick', e, tinymce)
        },
        // 可以添加一些自己的自定义事件，如清空内容
        clear() {
            this.myValue = ''
        },
        getTime() {
            var Time = new Date()
            var year = Time.getFullYear()
            var month = Time.getMonth() + 1
            var date = Time.getDate()
            var hours = Time.getHours()
            var minute = Time.getMinutes()
            var seconds = Time.getSeconds()
            var time = year + month + date + hours + minute + seconds
            return time
        }
    },
    watch: {
        value(newValue) {
            this.myValue = newValue
        },
        myValue(newValue) {
            this.$emit('input', newValue)
        }
    }
}

</script>