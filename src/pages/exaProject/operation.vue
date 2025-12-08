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
			<a-form-model-item label="项目规模" prop="projectScale">
				<a-select v-model="form.projectScale" placeholder="请选择" :disabled="title == '查看'">
					<a-select-option v-for="item, index in queryJsonBasicList.projectScale" :key="index"
						:value="item.code">{{
							item.name }}</a-select-option>
				</a-select>
			</a-form-model-item>
			<a-form-model-item label="项目类别" prop="projectCategory">
				<a-select v-model="form.projectCategory" placeholder="请选择" :disabled="title == '查看'">
					<a-select-option v-for="item, index in queryJsonBasicList.projectCategory" :key="index"
						:value="item.code">{{
							item.name }}</a-select-option>
				</a-select>
			</a-form-model-item>
			<a-form-model-item label="项目类型" prop="projectType">
				<a-select v-model="form.projectType" placeholder="请选择" :disabled="title == '查看'">
					<a-select-option v-for="item, index in queryJsonBasicList.projectType" :key="index"
						:value="item.code">{{
							item.name }}</a-select-option>
				</a-select>
			</a-form-model-item>
			<a-form-model-item label="终止规则" prop="terminationRule">
				<a-input v-model="form.terminationRule" placeholder="请输入" :disabled="title == '查看'" />
			</a-form-model-item>
			<!-- <a-form-model-item label="文件名称" prop="projectFileName">
				<a-input v-model="form.projectFileName" placeholder="请输入" :disabled="title == '查看'" />
			</a-form-model-item>
			<a-form-model-item label="文件别名" prop="projectFileAlias">
				<a-input v-model="form.projectFileAlias" placeholder="请输入" :disabled="title == '查看'" />
			</a-form-model-item>
			<a-form-model-item label="文件类型" prop="projectFileType">
				<a-input v-model="form.projectFileType" placeholder="请输入" :disabled="title == '查看'" />
			</a-form-model-item>
			<a-form-model-item label="文件路径" prop="projectFilePath">
				<a-input v-model="form.projectFilePath" placeholder="请输入" :disabled="title == '查看'" />
			</a-form-model-item>
			<a-form-model-item label="文件网络路径" prop="projectFileUrl">
				<a-input v-model="form.projectFileUrl" placeholder="请输入" :disabled="title == '查看'" />
			</a-form-model-item> -->
			<a-form-model-item label="范本名称" prop="templateName">
				<a-input v-model="form.templateName" placeholder="请输入" :disabled="title == '查看'" />
			</a-form-model-item>
			<a-form-model-item label="上传范本" prop="file" v-if="title == '新增'">
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
	exaFileUpdateApi,
	exaFileUploadApi
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
				projectScale: undefined,
				projectCategory: undefined,
				projectType: undefined,
				terminationRule: '',
				templateName: '',
				file: {}
			},
			rules: {
				// projectScale: [
				// 	{ required: true, message: '请选择项目规模', trigger: 'change' },
				// ],
				// projectCategory: [
				// 	{ required: true, message: '请选择项目类别', trigger: 'change' },
				// ],
				// projectType: [
				// 	{ required: true, message: '请选择项目类型', trigger: 'change' },
				// ],
				// terminationRule: [
				// 	{ required: true, message: '请输入终止规则', trigger: 'blur' },
				// ],
				// templateName: [
				// 	{ required: true, message: '请输入范本名称', trigger: 'blur' },
				// ],
				file: [
					{ required: true, message: '请上传文件', trigger: 'change' },
				],
				// projectFileAlias: [
				// 	{ required: true, message: '请输入文件别名', trigger: 'blur' },
				// ],
				// projectFileType: [
				// 	{ required: true, message: '请输入文件类型', trigger: 'blur' },
				// ],
				// projectFilePath: [
				// 	{ required: true, message: '请输入文件路径', trigger: 'blur' },
				// ],
				// projectFileUrl: [
				// 	{ required: true, message: '请输入文件网络路径', trigger: 'blur' },
				// ],
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
						formData.append("projectScale", this.form.projectScale);
						formData.append("projectCategory", this.form.projectCategory);
						formData.append("projectType", this.form.projectType);
						formData.append("terminationRule", this.form.terminationRule);
						formData.append("templateName", this.form.templateName);
						exaFileUploadApi(formData).then(res => {
							const data = res.data
							if (data.code == 200) {
								this.$refs.ruleForm.resetFields()		// 清空表单
								this.$emit('confirmValue', '')
							} else {
								this.$message.error(data.msg)
							}
						})
					} else if (this.title == '编辑') {
						const formData = new FormData();
						formData.append("projectScale", this.form.projectScale);
						formData.append("projectCategory", this.form.projectCategory);
						formData.append("projectType", this.form.projectType);
						formData.append("terminationRule", this.form.terminationRule);
						formData.append("templateName", this.form.templateName);
						formData.append("id", this.form.id);
						exaFileUpdateApi(formData).then(res => {
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