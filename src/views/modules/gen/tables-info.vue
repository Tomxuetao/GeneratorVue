<template>
    <div>
        <el-form :inline="true" :model="dataForm" @keyup.enter.native="getDataList()">
            <el-form-item>
                <el-input v-model="dataForm.tableName" placeholder="表名称" clearable></el-input>
            </el-form-item>
            <el-form-item>
                <el-button @click="getDataList()">查询</el-button>
                <el-button @click="returnLinkTable()" type="primary">返回</el-button>
                <el-button type="primary" @click="showFields()"
                           :disabled="dataListSelections.length <= 0">展示字段
                </el-button>
            </el-form-item>
        </el-form>
        <el-table
            @selection-change="selectionChangeHandle"
            :data="dataList"
            border
            :height="documentClientHeight - 242"
            style="width: 100%;">
            <el-table-column
                type="selection"
                header-align="center"
                align="center"
                width="55">
            </el-table-column>
            <el-table-column
                prop="tableName"
                header-align="center"
                align="center"
                label="表名称">
            </el-table-column>
            <el-table-column
                prop="engine"
                header-align="center"
                align="center"
                label="Engine">
            </el-table-column>
            <el-table-column
                prop="tableComment"
                header-align="center"
                align="center"
                label="表备注">
            </el-table-column>
            <el-table-column
                prop="createTime"
                header-align="center"
                align="center"
                label="创建时间">
            </el-table-column>
        </el-table>
        <tables-fields v-if="tablesFieldsVisible" ref="tablesFields"></tables-fields>
    </div>
</template>

<script>
import TablesFields from './tables-fields'

export default {
    name: 'tables-info',
    props: {
        dataList: {
            type: Array,
            required: true
        },
        linkId: {
            type: Number,
            required: true
        }
    },
    components: {
        TablesFields
    },

    data () {
        return {
            dataForm: {
                tableName: ''
            },
            dataListSelections: [],
            tablesFieldsVisible: false,
            documentClientHeight: 0
        }
    },

    created () {
        this.documentClientHeight = this.$store.state.common.documentClientHeight
    },

    methods: {
        getDataList () {
            this.$emit('getDataList', this.linkId, this.dataForm.tableName)
        },
        returnLinkTable () {
            this.$emit('changeTable')
        },
        selectionChangeHandle (val) {
            this.dataListSelections = val
        },

        showFields () {
            this.tablesFieldsVisible = true
            let tableNameArray = this.dataListSelections.map(item => {
                return item.tableName
            })
            this.$nextTick(() => {
                this.$refs.tablesFields.getTableFields(this.linkId, tableNameArray)
            })
        }
    }
}
</script>

<style scoped>

</style>
