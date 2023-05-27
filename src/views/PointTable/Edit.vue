<template>
    <div>
        <body>
            <header>
                <Header :routelist="routelist"></Header>
            </header>
            <div class="Edit">
                <el-tabs v-model="activeTab" type="border-card">
                    <el-tab-pane label="账户设置" name="account">
                        <el-form>
                            <el-form-item label="用户名">
                                <el-input v-model.trim="name" />
                            </el-form-item>
                            <el-form-item label="电子邮箱">
                                <el-input v-model.trim="email" />
                            </el-form-item>
                            <el-form-item label="更改密码">
                                <el-input v-model.trim="password" />
                            </el-form-item>
                            <el-form-item label="确认更改后的密码">
                                <el-input v-model.trim="confirm_password" />
                            </el-form-item>
                            <el-form-item>
                                <el-button type="primary" @click="submit">更新账户信息</el-button>
                            </el-form-item>
                        </el-form>
                    </el-tab-pane>
                    <el-tab-pane label="头像设置" name="change_avatar">
                        <div class="avatar-change">
                            <div class="avatar-change-section">
                                <div class="avatar-change-section-header"><span><i
                                            class="el-icon-picture-outline"></i>Change
                                        Avatar</span></div>
                                <div class="avatar-change-section-body">
                                    <div class="text-muted">
                                        点击下方虚线框，挑选你喜欢的头像：
                                    </div>
                                    <div style="text-align: center; margin-top: 10px;">
                                        <AvatarUploader :avatar="avatar" :region="options_OSS.region"
                                            :accessKeyId="options_OSS.accessKeyId"
                                            :accessKeySecret="options_OSS.accessKeySecret" :bucket="options_OSS.bucket"
                                            @avatarUrl="getAvatarUrl" @deleteAvatar="deleteAvatar">
                                        </AvatarUploader>
                                    </div>
                                </div>

                                <div class="avatar-change-section">
                                    <div class="avatar-change-section-header"><span><i
                                                class="el-icon-copy-document"></i>Clipboard</span></div>
                                    <div class="avatar-change-section-body">
                                        <div class="text-muted">
                                            点击下方按钮，复制上传头像的链接到剪切板：
                                        </div>
                                        <el-input v-model="inputData" placeholder="Please input"
                                            style="width:400px;max-width:100%;" />
                                        <el-button style="margin-left: 5px;" type="primary" icon="el-icon-document"
                                            @click="handleCopy(inputData, $event)">
                                            点击复制到剪切板
                                        </el-button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </el-tab-pane>
                </el-tabs>
                <el-button type="primary" @click="goBack">返回</el-button>
            </div>
        </body>
    </div>
</template>

<script>
import Header from '@/components/Header.vue';
import AvatarUploader from '@/components/AvatarUpload.vue'
import clip from '@/utils/clipboard'

export default {
    name:'PointEdit',
    components: { Header, AvatarUploader },
    data() {
        return {
            routelist: [
                { route: '/Home', name: '主页' },
                { route: '/Search', name: '搜索' },
                { route: '/Map', name: '地图' },
                { route: '/MapSearch', name: '周边搜索' },
                { route: '/Route', name: '路线展示' },
                { route: '/User', name: '个人中心' }
            ],
            name: '',
            email: '',
            password: '',
            avatar: '',
            options_OSS: {
                region: 'oss-cn-hangzhou',
                accessKeyId: 'LTAI5tFQrt6TNg6k2SoRtnmW',
                accessKeySecret: 'arpTCv67LVeoOy2CP8sZqF4DCOOBk6',
                bucket: 'picture-tjl'
            },
            inputData: '',
            activeTab: 'account',
        }
    },
    created() {
        this.$axios.get('http://127.0.0.1:8000/users/' + this.$route.params.id).then((res) => {
            this.name = res.data.name;
            this.email = res.data.email;
            this.password = res.data.hashed_password;
            this.avatar = res.data.avatar;
        }).catch(err => {
            console.log(err);
            this.$message.error('数据载入失败，请检查网络！');
        })
    },
    methods: {
        getAvatarUrl(avatarUrl) {
            console.log("头像url:", avatarUrl);
            this.inputData = avatarUrl;
        },
        deleteAvatar() {
        },
        handleCopy(text, event) {
            clip(text, event)
        },
        clipboardSuccess() {
            this.$message({
                message: '复制成功！',
                type: 'success',
                duration: 1500
            })
        },
        submit() {
            this.$axios.post('http://127.0.0.1:8000/users/').then((res) => {
                this.name = res.data.name;
                this.email = res.data.email;
                this.password = res.data.hashed_password;
                this.avatar = res.data.avatar;
            }).catch(err => {
                console.log(err);
                this.$message.error('用户信息更新成功！');
            })
        },
        goBack() {
            this.$router.replace({ name: "UserTable" });
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

.text-muted {
    font-size: 14px;
    color: #777;
    margin-top: 10px;
    margin-bottom: 10px;
}

body {
    background-color: white;
}

.avatar-change {
    color: #606266;
    font-size: 16px;

    span {
        padding-left: 4px;
    }

    .avatar-change-section {
        padding: 15px 0;

        .avatar-change-section-header {
            border-bottom: 1px solid #dfe6ec;
            padding-bottom: 10px;
            margin-bottom: 10px;
            font-weight: bold;
        }
    }
}

::v-deep .el-button {
    margin-top: 20px;
    margin-bottom: 20px;
}
</style>
