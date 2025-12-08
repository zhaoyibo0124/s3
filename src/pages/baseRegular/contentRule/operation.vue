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
			<a-form-model-item label="目录名称" prop="catalogueName">
				<a-input v-model="form.catalogueName" placeholder="请输入" :disabled="title == '查看'" />
			</a-form-model-item>
			<a-form-model-item label="目录排序" prop="catalogueSort">
				<a-input v-model="form.catalogueSort" placeholder="请输入" :disabled="title == '查看'" />
			</a-form-model-item>
			<a-form-model-item label="是否精确" prop="isAccurate">
				<a-radio-group v-model="form.isAccurate" :disabled="title == '查看'">
					<a-radio :value="item.code" v-for="item in queryJsonBasicList.yesNoType" :key="item.code">
						{{ item.name }}
					</a-radio>
				</a-radio-group>
			</a-form-model-item>
			<a-form-model-item label="是否标题" prop="isTitle">
				<a-radio-group v-model="form.isTitle" :disabled="title == '查看'">
					<a-radio :value="item.code" v-for="item in queryJsonBasicList.yesNoType" :key="item.code">
						{{ item.name }}
					</a-radio>
				</a-radio-group>
			</a-form-model-item>
			<a-form-model-item label="是否相同" prop="isSame">
				<a-radio-group v-model="form.isSame" :disabled="title == '查看'">
					<a-radio :value="item.code" v-for="item in queryJsonBasicList.yesNoType" :key="item.code">
						{{ item.name }}
					</a-radio>
				</a-radio-group>
			</a-form-model-item>
		</a-form-model>
	</a-modal>
</template>
<script>
import {
	intContentRuleAddApi,
	intContentRuleUpdateApi,
	modelListApi
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
				catalogueName: '',
				catalogueSort: '',
				isAccurate: '1',
				isTitle: '1',
				isSame: '1',
			},
			rules: {
				templateId: [
					{ required: true, message: '请选择范本', trigger: 'change' },
				],
				catalogueName: [
					{ required: true, message: '请输入目录名称', trigger: 'blur' },
				],
				catalogueSort: [
					{ required: true, message: '请输入目录排序', trigger: 'blur' },
				],
				isAccurate: [
					{ required: true, message: '请选择是否精确', trigger: 'change' },
				],
				isTitle: [
					{ required: true, message: '请选择是否标题', trigger: 'change' },
				],
				isSame: [
					{ required: true, message: '请选择是否相同', trigger: 'change' },
				],
			},
			modelOptions: []
		}
	},
	created() {
		this.getModelOptions()
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
						intContentRuleAddApi(data).then(res => {
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
						intContentRuleUpdateApi(data).then(res => {
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