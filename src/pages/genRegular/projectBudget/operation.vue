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
			<a-form-model-item label="项目性质" prop="projectType">
				<a-select v-model="form.projectType" placeholder="请选择"  :disabled="title == '查看'">
					<a-select-option v-for="item, index in queryJsonBasicList.projectType" :key="index"
						:value="item.code">{{
							item.name }}</a-select-option>
				</a-select>
			</a-form-model-item>
			<a-form-model-item label="项目类型" prop="projectScale">
				<a-select v-model="form.projectScale" placeholder="请选择"  :disabled="title == '查看'">
					<a-select-option v-for="item, index in queryJsonBasicList.projectScale" :key="index"
						:value="item.code">{{
							item.name }}</a-select-option>
				</a-select>
			</a-form-model-item>
			<a-form-model-item label="预算金额" prop="budget">
				<a-input placeholder="请输入" v-model="form.budget"  :disabled="title == '查看'" />
			</a-form-model-item>
		</a-form-model>
	</a-modal>
</template>
<script>
import {
	projectBudgetAddApi,
	projectBudgetUpdateApi
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
				projectType: undefined,
				projectScale: undefined,
				budget: ''
			},
			rules: {
				projectType: [
					{ required: true, message: '请选择项目性质', trigger: 'change' },
				],
				projectScale: [
					{ required: true, message: '请选择项目类型', trigger: 'change' },
				],
				budget: [
					{ required: true, message: '请输入预算金额', trigger: 'blur' },
				],
			}
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
		handleOk() {
			this.$refs.ruleForm.validate(valid => {
				this.handleOkLoading = true
				if (valid) {
					if (this.title == '新增') {
						const data = JSON.parse(JSON.stringify(this.form))
						delete data.id
						projectBudgetAddApi(data).then(res => {
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
						projectBudgetUpdateApi(data).then(res => {
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