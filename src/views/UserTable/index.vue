<template>
    <div>
        <header>
            <Header :routelist="routelist"></Header>
        </header>

        <body>
            <div>
                <el-table :data="points.slice((currentPage - 1) * pageSize, currentPage * pageSize)" stripe
                    v-loading="loading" :border="true" :show-overflow-tooltip="true"
                    :header-cell-style="{ textAlign: 'center' }" :cell-style="{ textAlign: 'center' }">
                    <el-table-column prop="id" label="编号" width="50">
                    </el-table-column>
                    <el-table-column prop="name" label="姓名" width="200">
                    </el-table-column>
                    <el-table-column prop="email" label="电子邮箱" width="200">
                    </el-table-column>
                    <el-table-column prop="hashed_password" label="密码" width="300">
                    </el-table-column>
                    <el-table-column prop="avatar" label="头像链接" width="400">
                    </el-table-column>
                    <el-table-column label="操作">
                        <template slot-scope="scope">
                            <el-button type="success" size="small" @click="detail(scope.row.id)">详情</el-button>
                            <el-button type="primary" size="small" @click="edit(scope.row.id)">编辑</el-button>
                            <el-button type="danger" size="small" @click="del(scope.row.id)">删除</el-button>
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
    name: "UserTable",
    components: { Header },
    data() {
        return {
            routelist: [
                { route: '/Home', name: '主页' },
                { route: '/PointTable', name: '地图点管理' },
                { route: '/AbstractTable', name: '详情页管理' },
                { route: '/AddPoint', name: '添加地图点' },
                { route: '/PickPoint', name: '坐标拾取' }
            ],
            points: [],
            currentPage: 1, // 当前页码
            total: 40, // 总条数
            pageSize: 10, // 每页的数据条数
            loading: true
        };
    },
    created() {
        this.$axios.get('http://127.0.0.1:8000/users/', {
        }).then((res) => {
            this.points = res.data
            this.total = res.data.count;
            this.loading = false
        }).catch(err => {
            console.log(err);
            this.$message.error('地图点载入失败，请检查网络！');
        })
    },
    methods: {
        detail(id) {
            this.$router.push({ path: "UserDetail/" + id });
        },
        edit(id) {
            this.$router.push({ path: "UserEdit/" + id });
        },
        del(id) {
            this.$axios.post('http://127.0.0.1:8000/delete_user/' + id).then(() => {
                this.$message({
                    message: '删除成功！',
                    type: 'success'
                });
                this.$router.go(0)
            }).catch(err => {
                console.log(err);
                this.$message.error('删除失败！');
            })

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

.pagination {
    margin-bottom: 20px;
}
</style>
  