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
                                <div class="avatar-change-section">
                                    <div class="avatar-change-section-header"><span><i
                                                class="el-icon-document-checked"></i>Submit</span></div>
                                    <div class="avatar-change-section-body">
                                        <div class="text-muted">
                                            点击下方按钮，提交更改到数据库：
                                        </div>
                                        <el-button style="margin-left: 5px;" type="primary"
                                            @click="changeavatar">提交到数据库</el-button>
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
    name: 'UserEdit',
    components: { Header, AvatarUploader },
    data() {
        return {
            routelist: [
                { route: '/Home', name: '主页' },
                { route: '/PointTable', name: '地图点管理' },
                { route: '/AbstractTable', name: '详情页管理' },
                { route: '/AddPoint', name: '添加地图点' },
            ],
            name: '',
            email: '',
            password: '',
            confirm_password: '',
            avatar: '',
            options_OSS: {
                region: 'oss-cn-hangzhou',
                accessKeyId: 'LTAI5tFQrt6TNg6k2SoRtnmW',
                accessKeySecret: 'arpTCv67LVeoOy2CP8sZqF4DCOOBk6',
                bucket: 'picture-tjl'
            },
            inputData: '',
            activeTab: 'account',
            user: {
                name: '',
                email: '',
                password: '',
            }
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
            if (this.email === '') {
                this.$message.error('邮箱不能为空！');
            }
            else if (this.name === '') {
                this.$message.error('用户名不能为空！');
            }
            else if (this.confirm_password != this.password) {
                this.$message.error('两次输入的密码应一致！');
            }
            else {
                this.user.name = this.name
                this.user.email = this.email
                this.user.password = this.password
                this.$axios.post('http://127.0.0.1:8000/update_user_info/' + this.$route.params.id, this.user).then((res) => {
                    if (res.data.code == '0000') {
                        this.$message({
                            message: '用户信息更新成功！',
                            type: 'success'
                        });
                        this.$axios.get('http://127.0.0.1:8000/users/' + this.$route.params.id).then((res) => {
                            this.name = res.data.name;
                            this.email = res.data.email;
                            this.password = res.data.hashed_password;
                            this.avatar = res.data.avatar;
                        }).catch(err => {
                            console.log(err);
                            this.$message.error('数据载入失败，请检查网络！');
                        })
                    }
                    else if (res.data.code == '0001') {
                        this.$message.error('参数错误，用户信息更新失败！');
                    }
                }).catch(err => {
                    console.log(err);
                    this.$message.error('用户信息更新失败！');
                })
            }
        },
        goBack() {
            this.$router.replace({ name: "UserTable" });
        },
        changeavatar() {
            this.$axios.post('http://127.0.0.1:8000/update_user_avatar/', {
                email: this.email,
                avatar: this.inputData
            }).then((res) => {
                if (res.data.code == '0000') {
                    this.$message({
                        message: '用户头像更新成功！',
                        type: 'success'
                    });
                }
                else if (res.data.code == '0001') {
                    this.$message.error('参数错误，用户头像更新失败！');
                }
            }).catch(err => {
                console.log(err);
                this.$message.error('用户头像更新失败！');
            })
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
    margin-top: 10px;
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
