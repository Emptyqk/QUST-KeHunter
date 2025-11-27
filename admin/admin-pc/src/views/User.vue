<template>
    <div>
        <h2>用户管理</h2>
        <el-table
            :data="tableData"
            border
            style="width: 100%">
            <el-table-column prop="openid" label="Openid"></el-table-column>
            <el-table-column prop="username" label="用户名"></el-table-column>
            <el-table-column prop="password" label="密码"></el-table-column>
            <el-table-column prop="date" label="注册时间"></el-table-column>
            <el-table-column label="操作">
                <template slot-scope="scope">
                    <el-popconfirm
                        title="是否确认删掉此条数据？不可恢复"
                        @confirm="deleteItem(scope.row._id)">
                        <el-button slot="reference">删除</el-button>
                    </el-popconfirm>
                </template>
            </el-table-column>
        </el-table>
        <el-pagination class="pagaination"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="page"
            :page-sizes="[5, 10, 15, 20]"
            :page-size="size"
            layout="total, sizes, prev, pager, next, jumper"
            :total="total">
        </el-pagination>
    </div>
</template>

<script>
    import dayjs from 'dayjs';
    export default {
        data(){
            return {
                tableData: [],
                page: 1,
                size: 5,
                total: 0,
            }
        },
            async created(){
        const params = {
            page:this.page,
            size:this.size
        };
        const {data:{result,total}} = await this.$http.post("/admin/getUser",params);
        this.tableData =result.map((item)=>{
            return {
                ...item,
                date:dayjs(item.date).format("YYYY-MM-DD HH:mm:ss"),
            };
        });
        this.total = total;
    },
        methods:{
            handleSizeChange(val) {
                this.size = val;
                this.getData();
            },
            handleCurrentChange(val) {
                this.page = val;
                this.getData();
            },
            async deleteItem(_id) {
                const {data} = await this.$http.post("/admin/deleteUser",{_id});
                if(data.status === 200){
                    this.$message.success("删除成功");
                }
            }
        }
    }
</script>

<style lang="less" scoped>
    .body {
        padding: 20px;
        background-color: #fff;
        border-radius: 20px;
        width: 100%;
        max-width: 100%;
    }
    .pagaination {
        margin-top: 20px;
    }
</style>