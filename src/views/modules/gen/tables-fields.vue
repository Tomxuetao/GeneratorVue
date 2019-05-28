<template>
    <el-dialog
        title="请选择字段"
        width="1000px"
        :close-on-click-modal="false"
        :visible.sync="visible">
        <el-table
            :data="fieldArray"
            @selection-change="selectChangeHandle"
            height="400"
            border
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
                width="120"
                label="表名称">
            </el-table-column>
            <el-table-column
                prop="columnName"
                header-align="center"
                align="center"
                width="120"
                label="字段名称">
            </el-table-column>
            <el-table-column
                prop="columnComment"
                header-align="center"
                align="center"
                label="字段备注">
            </el-table-column>
            <el-table-column
                prop="dataType"
                header-align="center"
                align="center"
                width="120"
                label="字段类型">
            </el-table-column>
            <el-table-column
                fixed="right"
                header-align="center"
                align="center"
                width="150"
                label="isForm">
            </el-table-column>
        </el-table>
        <span slot="footer" class="dialog-footer">
            <el-button @click="visible = false">取消</el-button>
            <el-button type="primary" @click="generatorCode()" :disabled="columnArray.length <= 0">生成</el-button>
        </span>
    </el-dialog>
</template>

<script>

export default {
    name: 'tables-fields',
    data () {
        return {
            visible: false,
            isForm: '0',
            fieldObject: {},
            fieldArray: [],
            columnArray: [],
            commentArray: [],
            dataTypeArray: []
        }
    },
    methods: {
        getTableFields (linkId, tableNames) {
            this.fieldArray = []
            this.$http({
                url: this.$http.adornUrl('/gen/auto/fields'),
                method: 'get',
                params: this.$http.adornParams({
                    'id': linkId,
                    'tableNames': tableNames.join(',')
                })
            }).then(({ data }) => {
                this.visible = true
                if (data && data.code === 0) {
                    this.fieldObject = data.fields
                    for (let i = 0; i < tableNames.length; i++) {
                        this.fieldArray.push(...this.fieldObject[tableNames[i]])
                    }
                }
            })
        },

        selectChangeHandle (selection) {
            selection.forEach(item => {
                this.columnArray.push(item.columnName)
                this.commentArray.push(item.columnComment)
                this.dataTypeArray.push(item.dataType)
            })
        },

        generatorCode () {
            this.$http({
                url: this.$http.adornUrl('/gen/auto/code'),
                method: 'post',
                responseType: 'blob',
                data: this.$http.adornData({
                    'columns': this.columnArray.join(),
                    'comments': this.commentArray.join(),
                    'dataType': this.dataTypeArray.join()
                })
            }).then(({ data }) => {
                let blob = new Blob([data])
                let url = window.URL.createObjectURL(blob)
                let link = document.createElement('a')
                link.style.display = 'none'
                link.href = url
                link.setAttribute('download', 'gogen.zip')
                document.body.appendChild(link)
                link.click()
            })
        }
    }
}
</script>

<style scoped>

</style>
