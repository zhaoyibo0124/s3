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
			<a-form-model-item label="矛盾名称" prop="contradictionName">
				<a-input placeholder="请输入" v-model="form.contradictionName" :disabled="title == '查看'" />
			</a-form-model-item>
			<a-form-model-item label="矛盾排序" prop="contradictionSort">
				<a-input placeholder="请输入" v-model="form.contradictionSort" :disabled="title == '查看'" />
			</a-form-model-item>
			<a-form-model-item label="识别规则" prop="identifyRule">
				<a-input placeholder="请输入" v-model="form.identifyRule" :disabled="title == '查看'" />
			</a-form-model-item>
			<a-form-model-item label="内容规则" prop="contentRule">
				<a-input placeholder="请输入" v-model="form.contentRule" :disabled="title == '查看'" />
			</a-form-model-item>
			<a-form-model-item label="替换规则">
				<a-input placeholder="请输入" v-model="form.replaceRule" :disabled="title == '查看'" />
			</a-form-model-item>
			<a-form-model-item label="拆分规则">
				<a-input placeholder="请输入" v-model="form.splitRule" :disabled="title == '查看'" />
			</a-form-model-item>
			<a-form-model-item label="开始规则">
				<a-input placeholder="请输入" v-model="form.startRule" :disabled="title == '查看'" />
			</a-form-model-item>
			<a-form-model-item label="向上规则">
				<a-input placeholder="请输入" v-model="form.upRule" :disabled="title == '查看'" />
			</a-form-model-item>
			<a-form-model-item label="向下取几行">
				<a-input placeholder="请输入" v-model="form.downLine" :disabled="title == '查看'" />
			</a-form-model-item>
			<a-form-model-item label="是否引用标题" prop="isTitle">
				<a-radio-group v-model="form.isTitle" :disabled="title == '查看'">
					<a-radio :value="item.code" v-for="item in queryJsonBasicList.yesNoType" :key="item.code">
						{{ item.name }}
					</a-radio>
				</a-radio-group>
			</a-form-model-item>
			<a-form-model-item label="标签1">
				<a-input placeholder="请输入" v-model="form.labelOne" :disabled="title == '查看'" />
			</a-form-model-item>
			<a-form-model-item label="标签2">
				<a-input placeholder="请输入" v-model="form.labelTwo" :disabled="title == '查看'" />
			</a-form-model-item>
		</a-form-model>
	</a-modal>
</template>
<script>
import {
	contradictionAddApi,
	contradictionUpdateApi,
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
				contradictionName:'',
				contentRule:'',
				identifyRule:'',
				replaceRule:'',
				startRule:'',
				upRule:'',
				downLine:'',
				isTitle:'1',
				labelOne:'',
				labelTwo:'',
				templateId:undefined,
				splitRule:'',
				contradictionSort:''
			},
			rules: {
				contradictionName: [
					{ required: true, message: '请输入矛盾名称', trigger: 'blur' },
				],
				contentRule: [
					{ required: true, message: '请输入内容规则', trigger: 'blur' },
				],
				identifyRule: [
					{ required: true, message: '请输入识别规则', trigger: 'blur' },
				],
				isTitle: [
					{ required: true, message: '请选择是否引用标题', trigger: 'change' },
				],
				templateId: [
					{ required: true, message: '请选择范本', trigger: 'change' },
				],
				splitRule: [
					{ required: true, message: '请输入拆分规则', trigger: 'blur' },
				],
				contradictionSort: [
					{ required: true, message: '请输入矛盾排序', trigger: 'blur' },
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
						contradictionAddApi(data).then(res => {
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
						contradictionUpdateApi(data).then(res => {
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