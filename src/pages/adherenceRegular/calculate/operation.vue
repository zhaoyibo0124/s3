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
			<a-form-model-item label="计算名称" prop="countName">
				<a-input placeholder="请输入" v-model="form.countName"  :disabled="title == '查看'" />
			</a-form-model-item>
			<a-form-model-item label="计算前内容" prop="contentIdFront">
				<a-select v-model="form.contentIdFront" placeholder="请选择" 
					:disabled="title == '查看'">
					<a-select-option v-for="item, index in contentOptions" :key="index" :value="item.id">{{ item.contentName
					}}</a-select-option>
				</a-select>
			</a-form-model-item>
			<a-form-model-item label="计算后内容" prop="contentIdAfter">
				<a-select v-model="form.contentIdAfter" placeholder="请选择" 
					:disabled="title == '查看'">
					<a-select-option v-for="item, index in contentOptions" :key="index" :value="item.id">{{ item.contentName
					}}</a-select-option>
				</a-select>
			</a-form-model-item>
			<a-form-model-item label="计算规则" prop="countRule">
				<a-select v-model="form.countRule" placeholder="请选择"  :disabled="title == '查看'">
					<a-select-option v-for="item, index in queryJsonBasicList.comparisonType" :key="index"
						:value="item.code">{{
							item.name }}</a-select-option>
				</a-select>
			</a-form-model-item>
			<a-form-model-item label="计算值" prop="countValue">
				<a-input placeholder="请输入" v-model="form.countValue"  :disabled="title == '查看'" />
			</a-form-model-item>
			<a-form-model-item label="是否是工作日" prop="isWeekday">
				<a-radio-group v-model="form.isWeekday"  :disabled="title == '查看'">
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
	timeCalculateAddApi,
	timeCalculateUpdateApi,
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
				countName: '',
				contentIdFront: undefined,
				contentIdAfter: undefined,
				countRule: undefined,
				countValue: '',
				isWeekday: '1'
			},
			rules: {
				templateId: [
					{ required: true, message: '请选择范本', trigger: 'change' },
				],
				countName: [
					{ required: true, message: '请输入计算名称', trigger: 'blur' },
				],
				contentIdFront: [
					{ required: true, message: '请选择计算前内容', trigger: 'change' },
				],
				contentIdAfter: [
					{ required: true, message: '请选择计算后内容', trigger: 'change' },
				],
				countRule: [
					{ required: true, message: '请选择计算规则', trigger: 'change' },
				],
				countValue: [
					{ required: true, message: '请输入计算值', trigger: 'blur' },
				],
				isWeekday: [
					{ required: true, message: '请选择是否工作日', trigger: 'change' },
				],
			},
			modelOptions: [],
			contentOptions:[]
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
						timeCalculateAddApi(data).then(res => {
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
						timeCalculateUpdateApi(data).then(res => {
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