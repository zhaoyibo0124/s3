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
			<a-form-model-item label="范本" prop="templateId" v-if="modelOptions.length > 0">
				<a-select :show-search="true" option-filter-prop="children" v-model="form.templateId" placeholder="请选择"
					:disabled="title == '查看'">
					<a-select-option v-for="item, index in modelOptions" :key="index" :value="item.id">{{
						item.templateName
					}}</a-select-option>
				</a-select>
			</a-form-model-item>
			<a-form-model-item label="审核内容" prop="contentId" v-if="contentOptions.length > 0">
				<a-select :show-search="true" option-filter-prop="children" v-model="form.contentId" placeholder="请选择"
					:disabled="title == '查看'">
					<a-select-option v-for="item, index in contentOptions" :key="index" :value="item.id">{{
						item.contentName
					}}</a-select-option>
				</a-select>
			</a-form-model-item>
		</a-form-model>
	</a-modal>
</template>
<script>
import {
	timeRuleAddApi,
	timeRuleUpdateApi,
	modelListApi,
	importantQueryListApi
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
				templateId: undefined,
				contentId: ''
			},
			rules: {
				templateId: [
					{ required: true, message: '请选择范本', trigger: 'change' },
				],
				contentId: [
					{ required: true, message: '请选择审核内容', trigger: 'change' },
				],
			},
			modelOptions: [],
			contentOptions: []
		}
	},
	created() {
		this.getModelOptions()
		this.getContentOptions()
		this.handleData()
	},
	methods: {
		getModelOptions() {
			const data = {
				pageNo: -1,
				pageSize: -1
			}
			modelListApi(data).then(res => {
				const data = res.data
				if (data.code == 200) {
					this.modelOptions = data.data.list
				} else {
					this.$message.error(data.msg)
				}
			})
		},
		getContentOptions() {
			const data = {
				pageNo: -1,
				pageSize: -1
			}
			importantQueryListApi(data).then(res => {
				const data = res.data
				if (data.code == 200) {
					this.contentOptions = data.data.list
				} else {
					this.$message.error(data.msg)
				}
			})
		},
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
						timeRuleAddApi(data).then(res => {
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
						timeRuleUpdateApi(data).then(res => {
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
</style>