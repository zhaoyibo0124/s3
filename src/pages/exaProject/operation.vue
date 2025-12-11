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
			<a-form-model-item label="项目编号" prop="projectCode">
				<a-input v-model="form.projectCode" placeholder="请输入" :disabled="title == '查看'" />
			</a-form-model-item>
			<a-form-model-item label="项目名称" prop="projectName">
				<a-input v-model="form.projectName" placeholder="请输入" :disabled="title == '查看'" />
			</a-form-model-item>
			<a-form-model-item label="项目类型" prop="projectType">
				<a-select v-model="form.projectType" placeholder="请选择" :disabled="title == '查看'"
					@change="changeProject">
					<a-select-option v-for="item, index in queryJsonBasicList.projectType" :key="index"
						:value="item.code">{{
							item.name }}</a-select-option>
				</a-select>
			</a-form-model-item>
			<a-form-model-item label="项目类别" prop="projectCategory">
				<a-select v-model="form.projectCategory" placeholder="请选择" :disabled="title == '查看'"
					@change="changeProject">
					<a-select-option v-for="item, index in queryJsonBasicList.projectCategory" :key="index"
						:value="item.code">{{
							item.name }}</a-select-option>
				</a-select>
			</a-form-model-item>
			<a-form-model-item label="项目规模" prop="projectScale">
				<a-select v-model="form.projectScale" placeholder="请选择" :disabled="title == '查看'"
					@change="changeProject">
					<a-select-option v-for="item, index in queryJsonBasicList.projectScale" :key="index"
						:value="item.code">{{
							item.name }}</a-select-option>
				</a-select>
			</a-form-model-item>
			<a-form-model-item label="范本" prop="templateId" v-if="modelOptions.length > 0">
				<a-select :show-search="true" option-filter-prop="children" v-model="form.templateId" placeholder="请选择"
					:disabled="title == '查看'">
					<a-select-option v-for="item, index in modelOptions" :key="index" :value="item.id">{{
						item.templateName
					}}</a-select-option>
				</a-select>
			</a-form-model-item>
			<a-form-model-item label="项目分类" prop="projectClassify">
				<a-select v-model="form.projectClassify" placeholder="请选择" :disabled="title == '查看'">
					<a-select-option v-for="item, index in queryJsonBasicList.projectClassify" :key="index"
						:value="item.code">{{
							item.name }}</a-select-option>
				</a-select>
			</a-form-model-item>
			<a-form-model-item label="资金来源" prop="projectFundSource">
				<a-select v-model="form.projectFundSource" placeholder="请选择" :disabled="title == '查看'">
					<a-select-option v-for="item, index in queryJsonBasicList.fundSource" :key="index"
						:value="item.code">{{
							item.name }}</a-select-option>
				</a-select>
			</a-form-model-item>
			<a-form-model-item label="上传文件" prop="file" v-if="title == '新增'">
				<a-upload ref="upload" name="file" accept=".doc,.docx" :before-upload="beforeUpload"
					:disabled="title != '新增'">
					<a-button> <a-icon type="upload" />选择文件</a-button>
				</a-upload>
			</a-form-model-item>

		</a-form-model>
	</a-modal>
</template>
<script>
import {
	exaProjectUpdateApi,
	exaProjectAddApi,
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
				projectName: '',
				projectCode: '',
				projectScale: undefined,
				projectCategory: undefined,
				projectType: undefined,
				projectClassify: undefined,
				projectFundSource: undefined,
				templateId: undefined,
				file: {}
			},
			rules: {
				projectName: [
					{ required: true, message: '请输入项目名称', trigger: 'blur' },
				],
				projectCode: [
					{ required: true, message: '请输入项目编号', trigger: 'blur' },
				],
				projectScale: [
					{ required: true, message: '请选择项目规模', trigger: 'change' },
				],
				projectCategory: [
					{ required: true, message: '请选择项目类别', trigger: 'change' },
				],
				projectType: [
					{ required: true, message: '请选择项目类型', trigger: 'change' },
				],
				projectClassify: [
					{ required: true, message: '请选择项目分类', trigger: 'change' },
				],
				projectFundSource: [
					{ required: true, message: '请选择资金来源', trigger: 'change' },
				],
				templateId: [
					{ required: true, message: '请输入范本名称', trigger: 'blur' },
				],
				file: [
					{ required: true, message: '请上传文件', trigger: 'change' },
				],

			},
			modelOptions: []
		}
	},
	created() {
		this.handleData()
		if (this.title == '编辑') {
			this.getModelOptions()
		}
	},
	methods: {
		getModelOptions() {
			const data = {
				projectScale: this.form.projectScale,
				projectCategory: this.form.projectCategory,
				projectType: this.form.projectType,
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
		changeProject() {
			if (this.form.projectType && this.form.projectCategory && this.form.projectScale) {
				this.getModelOptions()
			}
		},
		//文件上传校验
		beforeUpload(file) {
			this.form.file = {}
			this.form.file = file
			return false;
		},
		handleOk() {
			this.$refs.ruleForm.validate(valid => {
				this.handleOkLoading = true
				if (valid) {
					if (this.title == '新增') {
						const formData = new FormData();
						formData.append("file", this.form.file);
						formData.append("projectName", this.form.projectName);
						formData.append("projectCode", this.form.projectCode);
						formData.append("projectScale", this.form.projectScale);
						formData.append("projectCategory", this.form.projectCategory);
						formData.append("projectType", this.form.projectType);
						formData.append("projectClassify", this.form.projectClassify);
						formData.append("projectFundSource", this.form.projectFundSource);
						formData.append("templateId", this.form.templateId);
						exaProjectAddApi(formData).then(res => {
							const data = res.data
							if (data.code == 200) {
								this.$message.success('操作成功')
								this.$refs.ruleForm.resetFields()		// 清空表单
								this.$emit('confirmValue', '')
							} else {
								this.$message.error(data.msg)
							}
						})
					} else if (this.title == '编辑') {
						const formData = new FormData();
						formData.append("projectName", this.form.projectName);
						formData.append("projectCode", this.form.projectCode);
						formData.append("projectScale", this.form.projectScale);
						formData.append("projectCategory", this.form.projectCategory);
						formData.append("projectType", this.form.projectType);
						formData.append("projectClassify", this.form.projectClassify);
						formData.append("projectFundSource", this.form.projectFundSource);
						formData.append("templateId", this.form.templateId);
						formData.append("id", this.form.id);
						exaProjectUpdateApi(formData).then(res => {
							this.handleOkLoading = false
							const data = res.data
							if (data.code == 200) {
								this.$message.success('操作成功')
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