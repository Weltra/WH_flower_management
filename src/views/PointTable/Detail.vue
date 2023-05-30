<template>
    <div>
        <body>
            <header>
                <Header :routelist="routelist"></Header>
            </header>
            <div class="Detail">
                <el-descriptions title="用户信息" direction="vertical" :border=true>
                    <el-descriptions-item label="地点名称">{{ name }}</el-descriptions-item>
                    <el-descriptions-item label="位置">{{ description }}</el-descriptions-item>
                    <el-descriptions-item label="交通">{{ traffic }}</el-descriptions-item>
                    <el-descriptions-item label="门票价格">{{ ticket }}</el-descriptions-item>
                </el-descriptions>
                <el-descriptions direction="vertical" :border=true>
                    <el-descriptions-item label="经度">{{ longitude }}</el-descriptions-item>
                    <el-descriptions-item label="纬度">{{ latitude }}</el-descriptions-item>
                    <el-descriptions-item label="开放时间">{{ open_time }}</el-descriptions-item>
                    <el-descriptions-item label="赏花点图片">
                        <img :src="imgURL" class="avatar">
                    </el-descriptions-item>
                    <el-descriptions-item label="花卉品种">{{ flower_class }}</el-descriptions-item>
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
    name: "PointDetail",
    data() {
        return {
            routelist: [
                { route: '/Home', name: '主页' },
                { route: '/UserTable', name: '用户管理' },
                { route: '/AbstractTable', name: '详情页管理' },
                { route: '/AddPoint', name: '添加地图点' },
                { route: '/PickPoint', name: '坐标拾取' }
            ],
            name: '',
            description: '',
            traffic: '',
            ticket: '',
            latitude: '',
            longitude: '',
            imgURL: '',
            open_time: '',
            flower_class: '',
        }
    },
    created() {
        this.$axios.get('http://127.0.0.1:8000/points/' + this.$route.params.id).then((res) => {
            this.name = res.data.name
            this.description = res.data.description
            this.traffic = res.data.traffic
            this.ticket = res.data.ticket
            this.latitude = res.data.latitude
            this.longitude = res.data.longitude
            this.imgURL = res.data.imgURL
            this.open_time = res.data.open_time
            this.flower_class = res.data.flower_class
        }).catch(err => {
            console.log(err);
            this.$message.error('数据载入失败，请检查网络！');
        })
    },
    methods: {
        goBack() {
            this.$router.replace({ name: "PointTable" });
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
  