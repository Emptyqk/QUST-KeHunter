<template>
    <div>
        <h2>寻主管理</h2>
        <el-table
            :data="tableData"
            border
            style="width: 100%">
            <el-table-column prop="openid" label="Openid"></el-table-column>
            <el-table-column prop="classify1" label="一级分类"></el-table-column>
            <el-table-column prop="classify2" label="二级分类"></el-table-column>
            <el-table-column prop="name" label="名字"></el-table-column>
            <el-table-column prop="date" label="日期"></el-table-column>
            <el-table-column prop="region" label="地区"></el-table-column>
            <el-table-column prop="phone" label="联系方式"></el-table-column>
            <el-table-column prop="desc" label="描述"></el-table-column>
            <el-table-column label="相关图片">
                <template slot-scope="scope">
                    <el-image style="width: 120px; height: 100px" :src="scope.row.imgList[0]" :preview-src-list="scope.row.imgList">
                    </el-image>
                </template>
            </el-table-column>
            <el-table-column width="160px" prop="time" label="发布时间"></el-table-column>
            <el-table-column label="审核状态" width="100px">
                <template slot-scope="scope">
                    <el-tag v-if="scope.row.auditStatus === 0" type="warning">待审核</el-tag>
                    <el-tag v-else-if="scope.row.auditStatus === 1" type="success">已通过</el-tag>
                    <el-tag v-else-if="scope.row.auditStatus === 2" type="danger">已拒绝</el-tag>
                </template>
            </el-table-column>
            <el-table-column label="操作" width="280px">
                <template slot-scope="scope">
                    <el-button 
                        v-if="scope.row.auditStatus === 0" 
                        type="success" 
                        size="mini" 
                        @click="auditItem(scope.row._id, 1)">
                        通过
                    </el-button>
                    <el-button 
                        v-if="scope.row.auditStatus === 0" 
                        type="danger" 
                        size="mini" 
                        @click="auditItem(scope.row._id, 2)">
                        拒绝
                    </el-button>
                    <el-popconfirm
                        title="是否确认删掉此条数据？不可恢复"
                        @confirm="deleteItem(scope.row._id)">
                        <el-button slot="reference" size="mini">删除</el-button>
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
    data() {
            return {
            tableData: [],
            page: 1,
            size:5,
            total: 0
        }
    },
    async created(){
        this.getTableData();
    },

    methods: {
        async getTableData(){
            const params = {
                type:0,
                page:this.page,
                size:this.size
            };
            const {data:{result,total}} = await this.$http.post("/admin/getLose",params);
            this.tableData =result.map((item)=>{
                return {
                    ...item,
                    time:dayjs(item.time).format("YYYY-MM-DD HH:mm:ss"),
                };
            });
            this.total = total;
        },
        handleSizeChange(val) {
            this.size = val;
            this.page = 1;
            this.getTableData();
        },
        handleCurrentChange(val) {
            this.page = val;
            this.getTableData();
        },
        async deleteItem(_id){
            const params = {_id};
            const {data} = await this.$http.post("/admin/delete",params);
            if(data === "success"){
                this.$message.success("删除成功");
                this.getTableData();
            }else{
                this.$message.error("删除失败");
            }
        },
        async auditItem(_id, auditStatus){
            let auditReason = '';
            if (auditStatus === 2) {
                // 如果拒绝，需要输入拒绝原因
                const { value } = await this.$prompt('请输入拒绝原因', '审核拒绝', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    inputType: 'textarea',
                    inputPlaceholder: '请输入拒绝原因'
                }).catch(() => {
                    return { value: null };
                });
                
                if (value === null) {
                    return; // 用户取消
                }
                auditReason = value;
            }
            
            const params = {
                _id,
                auditStatus,
                auditReason
            };
            const {data} = await this.$http.post("/admin/audit", params);
            if(data === "success"){
                this.$message.success(auditStatus === 1 ? "审核通过" : "已拒绝");
                this.getTableData();
            }else{
                this.$message.error("操作失败");
            }
        },
    },

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