<template>
    <div>

        <body>
            <header>
                <Header :routelist="routelist"></Header>
            </header>
            <div class="Edit">
                <div class="release_tinymce">
                    <tinymce-editor v-model="content" :disabled="disabled" @onClick="onClick" ref="editor"></tinymce-editor>
                </div>
                <el-button type="primary" @click="goBack">返回</el-button>
                <el-button type="primary" @click="submit">确认</el-button>
            </div>
        </body>
    </div>
</template>

<script>
import Header from '@/components/Header.vue';
import TinymceEditor from '@/components/tinymce/tinymce-editor.vue';

export default {
    name: 'AbstracttEdit',
    components: { Header, TinymceEditor },
    data() {
        return {
            routelist: [
                { route: '/Home', name: '主页' },
                { route: '/UserTable', name: '用户管理' },
                { route: '/PointTable', name: '地图点管理' },
                { route: '/AddPoint', name: '添加地图点' },
                { route: '/PickPoint', name: '坐标拾取' }
            ],
            content: '',
            disabled: false,
            name: '',
            background_image: '',
            panel_imgURL_top: '',
            panel_imgURL_bottom: '',
            like_times: '',
        }
    },
    mounted: function () {
    },
    created() {
        console.log(this.$route.params.id)
        this.$axios.get('http://127.0.0.1:8000/abstract_content/' + this.$route.params.id).then((res) => {
            this.name = res.data.name;
            this.background_image = res.data.background_image;
            this.content = res.data.article_content;
            console.log(this.content)
            this.panel_imgURL_top = res.data.panel_imgURL_top;
            this.panel_imgURL_bottom = res.data.panel_imgURL_bottom;
            this.like_times = res.data.like_times;
        }).catch(err => {
            console.log(err);
            this.$message.error('数据载入失败，请检查网络！');
        })
    },
    watch: {
    },
    methods: {
        goBack() {
            this.$router.replace({ name: "AbstractTable" });
        },
        onClick(e, editor) {
            console.log('Element clicked')
            console.log(e)
            console.log(editor)
        },
        // 清空内容
        clear() {
            this.$refs.editor.clear()
        },
        submit() {
            console.log(this.content)
            let u_content = {
                article_content: this.content
            }
            if (this.content == '') {
                this.$message.error('详情页内容不能为空！');
            }
            else {
                this.$axios.post('http://127.0.0.1:8000/update_abstract_content/' + this.$route.params.id, u_content).then((res) => {
                    if (res.data.code == '0000') {
                        this.$message({
                            message: '详情页内容更新成功！',
                            type: 'success'
                        });
                    }
                    else if (res.data.code == '0001') {
                        this.$message.error('参数错误，详情页内容更新失败！');
                    }
                }).catch(err => {
                    console.log(err);
                    this.$message.error('详情页内容更新失败！');
                })
            }
        }
    }
}
</script>

<style lang="scss" scoped>
body {
    font-family: system-ui, sans-serif;
    background: white;
    min-height: 100vh;
}

.Edit {
    margin-left: 20px;
    margin-right: 20px;
    margin-bottom: 20px;
}

::v-deep .el-button {
    margin-top: 20px;
    margin-bottom: 20px;
}
</style>
