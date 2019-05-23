<template>
    <el-dialog
        :title="!dataForm.id ? '新增' : '修改'"
        :close-on-click-modal="false"
        :visible.sync="visible">
        <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmit()"
                 label-width="80px">
            <el-form-item label="主机地址" prop="host">
                <el-input v-model="dataForm.host" placeholder="主机地址"></el-input>
            </el-form-item>
            <el-form-item label="端口" prop="port">
                <el-input v-model="dataForm.port" placeholder="端口"></el-input>
            </el-form-item>
            <el-form-item label="名称" prop="baseName">
                <el-input v-model="dataForm.baseName" placeholder="数据库名称"></el-input>
            </el-form-item>
            <el-form-item label="用户名" prop="username">
                <el-input v-model="dataForm.username" placeholder="用户名"></el-input>
            </el-form-item>
            <el-form-item label="密码" prop="password">
                <el-input v-model="dataForm.password" placeholder="密码"></el-input>
            </el-form-item>
            <el-form-item label="类型" prop="type">
                <el-input v-model="dataForm.type" placeholder="数据库类型"></el-input>
            </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
      <el-button @click="visible = false">取消</el-button>
      <el-button type="primary" @click="dataFormSubmit()">确定</el-button>
    </span>
    </el-dialog>
</template>

<script>
    export default {
        data () {
            return {
                visible: false,
                dataForm: {
                    id: 0,
                    host: '',
                    port: '',
                    baseName: '',
                    username: '',
                    password: '',
                    type: ''
                },
                dataRule: {
                    host: [
                        {required: true, message: '主机地址不能为空', trigger: 'blur'}
                    ],
                    port: [
                        {required: true, message: '端口不能为空', trigger: 'blur'}
                    ],
                    baseName: [
                        {required: true, message: '名称不能为空', trigger: 'blur'}
                    ],
                    username: [
                        {required: true, message: '用户名不能为空', trigger: 'blur'}
                    ],
                    password: [
                        {required: true, message: '密码不能为空', trigger: 'blur'}
                    ],
                    type: [
                        {required: true, message: '数据库类型不能为空', trigger: 'blur'}
                    ]
                }
            }
        },
        methods: {
            init (id) {
                this.dataForm.id = id || 0
                this.visible = true
                this.$nextTick(() => {
                    this.$refs['dataForm'].resetFields()
                    if (this.dataForm.id) {
                        this.$http({
                            url: this.$http.adornUrl(`/gen/link/info/${this.dataForm.id}`),
                            method: 'get',
                            params: this.$http.adornParams()
                        }).then(({data}) => {
                            if (data && data.code === 0) {
                                this.dataForm.host = data.link.host
                                this.dataForm.port = data.link.port
                                this.dataForm.baseName = data.link.baseName
                                this.dataForm.username = data.link.username
                                this.dataForm.password = data.link.password
                                this.dataForm.type = data.link.type
                            }
                        })
                    }
                })
            },
            // 表单提交
            dataFormSubmit () {
                this.$refs['dataForm'].validate((valid) => {
                    if (valid) {
                        this.$http({
                            url: this.$http.adornUrl(`/gen/link/${!this.dataForm.id ? 'save' : 'update'}`),
                            method: 'post',
                            data: this.$http.adornData({
                                'id': this.dataForm.id || undefined,
                                'host': this.dataForm.host,
                                'port': this.dataForm.port,
                                'baseName': this.dataForm.baseName,
                                'username': this.dataForm.username,
                                'password': this.dataForm.password,
                                'type': this.dataForm.type
                            })
                        }).then(({data}) => {
                            if (data && data.code === 0) {
                                this.$message({
                                    message: '操作成功',
                                    type: 'success',
                                    duration: 1500,
                                    onClose: () => {
                                        this.visible = false
                                        this.$emit('refreshDataList')
                                    }
                                })
                            } else {
                                this.$message.error(data.msg)
                            }
                        })
                    }
                })
            }
        }
    }
</script>
