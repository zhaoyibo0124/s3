<template>
	<a-modal :bodyStyle="{ padding: 0 }" :title="title" :visible="visible" @cancel="handleCancel"
		:cancel-button-props="{ props: { display: true } }" :maskClosable="false" centered width="640px">
		<template slot="footer">
			<template v-if="title == '新增' || title == '编辑'">
				<a-button @click="handleCancel">取消</a-button>
				<a-button type="primary" @click="handleOk" :loading="handleOkLoading">确定</a-button>
			</template>
			<template v-if="title == '查看'">
				<a-button @click="handleCancel">关 闭</a-button>
			</template>
		</template>
		<a-form-model ref="ruleForm" :model="form" :rules="rules" :label-col="labelCol" :wrapper-col="wrapperCol"
			style="padding-top: 10px;">
			<a-form-model-item label="假日时间" prop="holidayTime">
				<a-date-picker v-model="form.holidayTime" placeholder="请选择日期" @change="onChange"
					:disabled="title == '查看'" />
			</a-form-model-item>
		</a-form-model>
	</a-modal>
</template>
<script>
import {
	holidayAddApi,
	holidayUpdateApi
} from '@/services/commentApiList'
export default {
	name: 'addAlert',
	props: ['title', 'defaultData'],
	data() {
		return {
			queryJsonBasicList: JSON.parse(sessionStorage.getItem('queryJsonBasicList')),		// 存储数据字典
			visible: true,
			handleOkLoading: false,
			labelCol: { span: 5, offset: 3 },
			wrapperCol: { span: 11, offset: 1 },
			form: {
				id: this.defaultData.data.id ? this.defaultData.data.id : '',
				holidayTime: ''
			},
			rules: {
				holidayTime: [
					{ required: true, message: '请输入假日时间', trigger: 'change' },
				],
			},
			dateFormat: 'YYYY/MM/DD',
		}
	},
	created() {
		this.handleData()
	},
	methods: {
		handleData() {
			for (let k in this.form) {
				this.form[k] = this.defaultData.data[k]
			}
		},
		onChange(date, dateString) {
			this.form.holidayTime = dateString
		},
		handleOk() {
			this.$refs.ruleForm.validate(valid => {
				this.handleOkLoading = true
				if (valid) {
					if (this.title == '新增') {
						const data = JSON.parse(JSON.stringify(this.form))
						delete data.id
						holidayAddApi(data).then(res => {
							this.handleOkLoading = false
							const data = res.data
							if (data.code == 200) {
								this.$refs.ruleForm.resetFields()		// 清空表单
								this.$emit('confirmValue', '')
							} else {
								this.$message.error(data.msg)
							}
						})
					} else if (this.title == '编辑') {
						const data = JSON.parse(JSON.stringify(this.form))
						holidayUpdateApi(data).then(res => {
							this.handleOkLoading = false
							const data = res.data
							if (data.code == 200) {
								this.$refs.ruleForm.resetFields()		// 清空表单
								this.$emit('confirmValue', '')
							} else {
								this.$message.error(data.msg)
							}
						})
					} else {
						this.handleOkLoading = false
						this.$message.info('title无效，请刷新重试！')
					}
				} else {
					this.handleOkLoading = false
					return false
				}
			})
		},
		handleCancel() {
			this.$refs.ruleForm.resetFields()		// 清空表单
			this.$emit('cancelValue')
		},
	}
}
</script>
<style lang="less" scoped>
.ant-form-item {
	margin-bottom: 10px;
}

.ant-modal-footer {
	text-align: center;
}

.colorRed {
	color: red;
}
</style>