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
			<a-form-model-item label="规则名称" prop="ruleName">
				<a-input v-model="form.ruleName" placeholder="请输入" :disabled="title == '查看'" />
			</a-form-model-item>
			<a-form-model-item label="规则类型" prop="ruleType">
				<a-radio-group v-model="form.ruleType" :disabled="title == '查看'">
					<a-radio :value="item.code" v-for="item in queryJsonBasicList.extractType" :key="item.code">
						{{ item.name }}
					</a-radio>
				</a-radio-group>
			</a-form-model-item>
			<a-form-model-item v-if="form.ruleType==2" label="模型名称" prop="modelName">
				<a-input v-model="form.modelName" placeholder="请输入" :disabled="title == '查看'" />
			</a-form-model-item>
			<a-form-model-item v-if="form.ruleType==2" label="模型地址" prop="modelUrl">
				<a-input v-model="form.modelUrl" placeholder="请输入" :disabled="title == '查看'" />
			</a-form-model-item>
			<a-form-model-item v-if="form.ruleType==2" label="模型提示词" prop="modelPrompt">
				<a-input v-model="form.modelPrompt" placeholder="请输入" :disabled="title == '查看'" />
			</a-form-model-item>
		</a-form-model>
	</a-modal>
</template>
<script>
import {
	completeAddApi,
	completeUpdateApi
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
				modelName: '',
				modelPrompt: '',
				modelUrl: '',
				ruleName: '',
				ruleType: undefined
			},
			rules: {
				modelName: [
					{ required: true, message: '请输入模型名称', trigger: 'blur' },
				],
				modelPrompt: [
					{ required: true, message: '请输入模型提示词', trigger: 'blur' },
				],
				modelUrl: [
					{ required: true, message: '请输入模型地址', trigger: 'blur' },
				],
				ruleName: [
					{ required: true, message: '请输入规则名称', trigger: 'blur' },
				],
				ruleType: [
					{ required: true, message: '请选择规则类型', trigger: 'change' },
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
						completeAddApi(data).then(res => {
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
						completeUpdateApi(data).then(res => {
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