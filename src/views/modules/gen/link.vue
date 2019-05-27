<template>
    <div class="mod-config">
        <tables-info v-if="showTablesInfo" :dataList="tableInfoList" :linkId="linkId"
                     @changeTable="changeTable" @getDataList="linkHandle"></tables-info>
        <div v-else>
            <el-form :inline="true" :model="dataForm" @keyup.enter.native="getDataList()">
                <el-form-item>
                    <el-input v-model="dataForm.database" placeholder="数据库名称" clearable></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button @click="getDataList()">查询</el-button>
                    <el-button v-if="isAuth('gen:link:save')" type="primary" @click="addOrUpdateHandle()">新增
                    </el-button>
                    <el-button v-if="isAuth('gen:link:delete')" type="danger" @click="deleteHandle()"
                               :disabled="dataListSelections.length <= 0">批量删除
                    </el-button>
                </el-form-item>
            </el-form>
            <el-table
                :data="dataList"
                border
                :height="documentClientHeight - 268"
                v-loading="dataListLoading"
                @selection-change="selectionChangeHandle"
                style="width: 100%;">
                <el-table-column
                    type="selection"
                    header-align="center"
                    align="center"
                    width="50">
                </el-table-column>
                <el-table-column
                    prop="host"
                    header-align="center"
                    align="center"
                    label="主机地址">
                </el-table-column>
                <el-table-column
                    prop="port"
                    header-align="center"
                    align="center"
                    label="端口">
                </el-table-column>
                <el-table-column
                    prop="baseName"
                    header-align="center"
                    align="center"
                    label="数据库名称">
                </el-table-column>
                <el-table-column
                    prop="username"
                    header-align="center"
                    align="center"
                    label="用户名">
                </el-table-column>
                <el-table-column
                    prop="password"
                    header-align="center"
                    align="center"
                    label="密码">
                </el-table-column>
                <el-table-column
                    prop="type"
                    header-align="center"
                    align="center"
                    label="数据库类型">
                </el-table-column>
                <el-table-column
                    fixed="right"
                    header-align="center"
                    align="center"
                    width="150"
                    label="操作">
                    <template slot-scope="scope">
                        <el-button type="text" size="small" @click="addOrUpdateHandle(scope.row.id)">修改</el-button>
                        <el-button type="text" size="small" @click="linkHandle(scope.row.id, '')">链接</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <el-pagination
                @size-change="sizeChangeHandle"
                @current-change="currentChangeHandle"
                :current-page="pageIndex"
                :page-sizes="[10, 20, 50, 100]"
                :page-size="pageSize"
                :total="totalPage"
                layout="total, sizes, prev, pager, next, jumper">
            </el-pagination>
            <!-- 弹窗, 新增 / 修改 -->
            <add-or-update v-if="addOrUpdateVisible" ref="addOrUpdate" @refreshDataList="getDataList"></add-or-update>
        </div>
    </div>
</template>

<script>
    import AddOrUpdate from './link-add-or-update'
    import TablesInfo from './tables-info'

    export default {
        data () {
            return {
                dataForm: {
                    database: ''
                },
                dataList: [],
                pageIndex: 1,
                pageSize: 10,
                totalPage: 0,
                dataListLoading: false,
                dataListSelections: [],
                addOrUpdateVisible: false,
                showTablesInfo: false,
                tableInfoList: [],
                linkId: 0,
                documentClientHeight: 0
            }
        },
        components: {
            AddOrUpdate,
            TablesInfo
        },
        activated () {
            this.getDataList()
            this.documentClientHeight = this.$store.state.common.documentClientHeight
        },
        methods: {
            // 获取数据列表
            getDataList () {
                this.dataListLoading = true
                this.$http({
                    url: this.$http.adornUrl('/gen/link/list'),
                    method: 'get',
                    params: this.$http.adornParams({
                        'page': this.pageIndex,
                        'limit': this.pageSize,
                        'database': this.dataForm.database
                    })
                }).then(({data}) => {
                    if (data && data.code === 0) {
                        this.dataList = data.page.list
                        this.totalPage = data.page.totalCount
                    } else {
                        this.dataList = []
                        this.totalPage = 0
                    }
                    this.dataListLoading = false
                })
            },
            // 每页数
            sizeChangeHandle (val) {
                this.pageSize = val
                this.pageIndex = 1
                this.getDataList()
            },
            // 当前页
            currentChangeHandle (val) {
                this.pageIndex = val
                this.getDataList()
            },
            // 多选
            selectionChangeHandle (val) {
                this.dataListSelections = val
            },
            // 新增 / 修改
            addOrUpdateHandle (id) {
                this.addOrUpdateVisible = true
                this.$nextTick(() => {
                    this.$refs.addOrUpdate.init(id)
                })
            },
            // 删除
            deleteHandle (id) {
                var ids = id ? [id] : this.dataListSelections.map(item => {
                    return item.id
                })
                this.$confirm(`确定对[id=${ids.join(',')}]进行[${id ? '删除' : '批量删除'}]操作?`, '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.$http({
                        url: this.$http.adornUrl('/gen/link/delete'),
                        method: 'post',
                        data: this.$http.adornData(ids, false)
                    }).then(({data}) => {
                        if (data && data.code === 0) {
                            this.$message({
                                message: '操作成功',
                                type: 'success',
                                duration: 1500,
                                onClose: () => {
                                    this.getDataList()
                                }
                            })
                        } else {
                            this.$message.error(data.msg)
                        }
                    })
                })
            },

            // 连接数据库
            linkHandle (id, tableName) {
                this.$http({
                    url: this.$http.adornUrl('/gen/auto/list'),
                    method: 'get',
                    params: this.$http.adornParams({
                        'page': this.pageIndex,
                        'limit': this.pageSize,
                        'id': id,
                        'tableName': tableName
                    })
                }).then(({data}) => {
                    if (data && data.code === 0) {
                        this.linkId = id
                        this.showTablesInfo = true
                        this.tableInfoList = data.tables
                    }
                })
            },

            changeTable () {
                this.showTablesInfo = false
            }
        }
    }
</script>
