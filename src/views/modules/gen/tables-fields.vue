<template>
    <el-dialog
        :close-on-click-modal="false"
        :visible.sync="visible">
        <div>123</div>
        <span slot="footer" class="dialog-footer">
            <el-button @click="visible = false">取消</el-button>
             <el-button type="primary">生成</el-button>
        </span>
    </el-dialog>
</template>

<script>
    export default {
        name: "tables-fields",
        data () {
            return {
                visible: false,
            }
        },
        methods: {
            getTableFields (linkId, tableNames) {
                this.$http({
                    url: this.$http.adornUrl('/gen/auto/fields'),
                    method: 'get',
                    params: this.$http.adornParams({
                        'id': linkId,
                        'tableNames': tableNames.join(',')
                    })
                }).then(({data}) => {
                    this.visible = true;
                    if (data && data.code === 0) {
                        debugger;
                        this.fieldList = data.fields;
                    }
                })
            }
        }
    }
</script>

<style scoped>

</style>
