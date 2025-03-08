let OSS = require('ali-oss')
export let client = new OSS({
    region: '你的阿里云Oss所在的区域',
    accessKeyId: '你的阿里云Oss的key值',
    accessKeySecret: '你的阿里云Oss的key的密码',
    bucket: '你的阿里云Oss的bucket',
})
