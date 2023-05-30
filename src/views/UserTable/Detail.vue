<template>
    <div>

        <body>
            <header>
                <Header :routelist="routelist"></Header>
            </header>
            <div class="Detail">
                <el-descriptions title="用户信息" direction="vertical" :border=true>
                    <el-descriptions-item label="姓名">{{ name }}</el-descriptions-item>
                    <el-descriptions-item label="邮箱">{{ email }}</el-descriptions-item>
                    <el-descriptions-item label="密码">{{ password }}</el-descriptions-item>
                    <el-descriptions-item label="用户头像">
                        <img :src="avatar" class="avatar">
                    </el-descriptions-item>
                    <el-descriptions-item label="用户喜爱的赏花点">青山公园，东湖磨山樱园</el-descriptions-item>
                </el-descriptions>
                <el-button type="primary" @click="goBack">返回</el-button>
            </div>
        </body>
    </div>
</template>
  
<script>
import Header from '@/components/Header.vue';

export default {
    components: { Header },
    name: "UserDetail",
    data() {
        return {
            routelist: [
                { route: '/Home', name: '主页' },
                { route: '/PointTable', name: '地图点管理' },
                { route: '/AbstractTable', name: '详情页管理' },
                { route: '/AddPoint', name: '添加地图点' },
                { route: '/PickPoint', name: '坐标拾取' }
            ],
            name: '',
            email: '',
            password: '',
            avatar: '',
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
        goBack() {
            this.$router.replace({ name: "UserTable" });
        }
    }
};
</script>
  
<style lang="scss" scoped>
::v-deep .el-button {
    margin-top: 20px;
    margin-bottom: 20px;
}

body {
    font-family: system-ui, sans-serif;
    background: white;
    min-height: 100vh;
}

.Detail {
    margin-left: 20px;
    margin-right: 20px;
    margin-bottom: 20px;
}

.avatar {
    width: 300px;
}
</style>
  