<template>
    <div>

        <body>
            <header>
                <Header :routelist="routelist"></Header>
            </header>
            <div>
                <el-table :data="points.slice((currentPage - 1) * pageSize, currentPage * pageSize)" stripe
                    v-loading="loading" :border="true" :show-overflow-tooltip="true"
                    :header-cell-style="{ textAlign: 'center' }" :cell-style="{ textAlign: 'center' }">
                    <el-table-column prop="id" label="编号" width="50">
                    </el-table-column>
                    <el-table-column prop="name" label="地点名称" width="100">
                    </el-table-column>
                    <el-table-column prop="article_content" label="详情页内容" width="500">
                    </el-table-column>
                    <el-table-column prop="panel_imgURL_top" label="侧边栏下部图片" width="200">
                    </el-table-column>
                    <el-table-column prop="panel_imgURL_bottom" label="侧边栏上部图片" width="200">
                    </el-table-column>
                    <el-table-column prop="background_image" label="背景图片" width="200">
                    </el-table-column>
                    <el-table-column prop="like_times" label="被打卡次数" width="50">
                    </el-table-column>
                    <el-table-column label="操作">
                        <template slot-scope="scope">
                            <el-button type="success" size="small" @click="detail(scope.row.id)">详情</el-button>
                            <el-button type="primary" size="small" @click="Imageedit(scope.row.id)">图片</el-button>
                            <el-button type="primary" size="small" @click="edit(scope.row.id)">编辑</el-button>
                        </template>
                    </el-table-column>
                </el-table>
                <el-pagination align='center' @size-change="handleSizeChange" @current-change="handleCurrentChange"
                    :current-page="currentPage" :page-sizes="[1, 5, 10, 20]" :page-size="pageSize"
                    layout="total, sizes, prev, pager, next, jumper" :total="points.length">
                </el-pagination>
            </div>
        </body>
    </div>
</template>

<script>

import Header from '@/components/Header.vue';

export default {
    name: "PointTable",
    components: { Header },
    data() {
        return {
            routelist: [
                { route: '/Home', name: '主页' },
                { route: '/UserTable', name: '用户管理' },
                { route: '/PointTable', name: '地图点管理' },
                { route: '/AddPoint', name: '添加地图点' },
                { route: '/PickPoint', name: '坐标拾取' }
            ],
            points: [],
            currentPage: 1, // 当前页码
            total: 40, // 总条数
            pageSize: 5, // 每页的数据条数
            loading: true
        };
    },
    created() {
        this.$axios.get('http://127.0.0.1:8000/get_abstract_contents/', {
        }).then((res) => {
            this.points = res.data
            this.total = res.data.count;
            this.loading = false
        }).catch(err => {
            console.log(err);
            this.$message.error('详情页数据载入失败，请检查网络！');
        })
    },
    methods: {
        detail(id) {
            this.$router.push({ name: "Abstract", params: { id } });
        },
        edit(id) {
            this.$router.push({ name: "AbstractEdit", params: { id } });
        },
        Imageedit(id) {
            this.$router.push({ name: "AbstractImageEdit", params: { id } });
        },
        handleSizeChange(val) {
            console.log(`每页 ${val} 条`);
            this.currentPage = 1;
            this.pageSize = val;
        },
        //当前页改变时触发 跳转其他页
        handleCurrentChange(val) {
            console.log(`当前页: ${val}`);
            this.currentPage = val;
        }
    },
}
</script>

<style scoped>
body {
    font-family: system-ui, sans-serif;
    background: white;
    min-height: 100vh;
}
</style>
  