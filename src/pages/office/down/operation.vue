<template>
	<a-modal
		:class="[simpleClass]"
		:bodyStyle="{padding:0}"
		:title="title"
		:visible="visible"
		@cancel="handleCancel"
		:cancel-button-props="{props: {display: true}}"
		:maskClosable="false"
		centered
		width="640px"
	>
		<template slot="footer">
			<template v-if="title == '新增' || title == '编辑'">
				<a-button @click="handleCancel">取消</a-button>
				<a-button type="primary"  @click="handleOk" :loading="handleOkLoading">确定</a-button>
			</template>
			<template v-if="title == '查看'">
				<a-button @click="handleCancel">关 闭</a-button>
			</template>
		</template>
		<a-form-model
			ref="ruleForm"
			:model="form"
			:rules="rules"
			:label-col="labelCol"
			:wrapper-col="wrapperCol"
			style="padding-top: 10px;"
		>
			<a-form-model-item label="文件分类" prop="fileClassify">
				<a-select v-model="form.fileClassify" placeholder="请选择" :disabled="title == '查看'" show-search
					option-filter-prop="children">
					<a-select-option v-for="(item,index) in queryJsonBasicList.fileClassifyType" :value="item.code" :key="index">{{item.name}}</a-select-option>
				</a-select>
			</a-form-model-item>
			<a-form-model-item label="文件主键" prop="fileParentId">
				<a-input v-model="form.fileParentId" placeholder="请输入" :disabled="title == '查看'" />
			</a-form-model-item>
			<a-form-model-item label="文件名称" prop="fileName">
				<a-input v-model="form.fileName" placeholder="请输入" :disabled="title == '查看'" />
			</a-form-model-item>
			<a-form-model-item label="文件别名" prop="fileAlias">
				<a-input v-model="form.fileAlias" placeholder="请输入" :disabled="title == '查看'" />
			</a-form-model-item>
			<a-form-model-item label="文件类型" prop="fileType">
				<a-input v-model="form.fileType" placeholder="请输入" :disabled="title == '查看'" />
			</a-form-model-item>
			<a-form-model-item label="本地保存地址" prop="filePath">
				<a-input v-model="form.filePath" placeholder="请输入" :disabled="title == '查看'" />
			</a-form-model-item>
			<a-form-model-item label="网络访问地址" prop="fileUrl">
				<a-input v-model="form.fileUrl" placeholder="请输入" :disabled="title == '查看'" />
			</a-form-model-item>
		</a-form-model>
	</a-modal>
</template>
<script>
	import {
		DownFileAdd,
		DownFileUpdate
	} from '@/services/commentApiList'
	var mouseDownX = 0
	var mouseDownY = 0
	var deltaX = 0
	var deltaY = 0
	var sumX = 0
	var sumY = 0
	var header = null
	var contain = null
	var modalContent = null
	var onmousedown = false
  export default {
    name: 'addAlert',
    props: ['title','defaultData'],
    data() {
      return {
				queryJsonBasicList: JSON.parse(sessionStorage.getItem('queryJsonBasicList')),		// 存储数据字典
				visible: true,
				handleOkLoading: false,
				labelCol: {span: 5, offset: 3},
				wrapperCol: {span: 11, offset: 1},
				form: {
					id: this.defaultData.data.id?this.defaultData.data.id:'',
					fileClassify: this.defaultData.data.fileClassify?this.defaultData.data.fileClassify:undefined,
					fileParentId: this.defaultData.data.fileParentId?this.defaultData.data.fileParentId:'',
					fileName: this.defaultData.data.fileName?this.defaultData.data.fileName:'',
					fileAlias: this.defaultData.data.fileAlias?this.defaultData.data.fileAlias:'',
					fileType: this.defaultData.data.fileType?this.defaultData.data.fileType:'',
					filePath: this.defaultData.data.filePath?this.defaultData.data.filePath:'',
					fileUrl: this.defaultData.data.fileUrl?this.defaultData.data.fileUrl:'',
				},
				rules: {
					fileClassify: [
						{required: true, message: '请选择文件分类', trigger: 'blur'},
					],
					fileParentId: [
						{required: true, message: '请输入文件主键', trigger: 'blur'},
					],
					fileName: [
						{required: true, message: '请输入文件名称', trigger: 'blur'},
					],
					fileAlias: [
						{required: true, message: '请输入文件别名', trigger: 'blur'},
					],
					fileType: [
						{required: true, message: '请输入文件类型', trigger: 'blur'},
					],
					filePath: [
						{required: true, message: '请输入本地保存地址', trigger: 'blur'},
					],
					fileUrl: [
						{required: true, message: '请输入网络访问地址', trigger: 'blur'},
					],
				}
			}
    },
    computed: {
			simpleClass() {
				return Math.random().toString(36).substring(2)
			}
		},
		watch: {
			visible() {
				this.$nextTick(() => {
					this.initialEvent(this.visible)
				})
			}
		},
		mounted() {
			this.$nextTick(() => {
				this.initialEvent(this.visible)
			})
		},
		created() {
		},
		beforeDestroy() {
			this.removeMove()
			window.removeEventListener('mouseup', this.removeUp, false)
		},
    methods: {
			handleOk() {
				this.$refs.ruleForm.validate(valid => {
					this.handleOkLoading = true
					if(valid){
						if(this.title == '新增'){
							const data = {
								fileClassify: this.form.fileClassify,
								fileParentId: this.form.fileParentId,
								fileName: this.form.fileName,
								fileAlias: this.form.fileAlias,
								fileType: this.form.fileType,
								filePath: this.form.filePath,
								fileUrl: this.form.fileUrl,
							}
							DownFileAdd(data).then(res => {
								this.handleOkLoading = false
								const data = res.data
								if(data.code == 200){
									this.$refs.ruleForm.resetFields()		// 清空表单
									this.resetModal()		// 重置Modal位置
									this.$emit('confirmValue', '')
								}else{
									this.$message.error(data.msg)
								}
							})
						}else if(this.title == '编辑'){
							const data = {
								id: this.form.id,
								fileClassify: this.form.fileClassify,
								fileParentId: this.form.fileParentId,
								fileName: this.form.fileName,
								fileAlias: this.form.fileAlias,
								fileType: this.form.fileType,
								filePath: this.form.filePath,
								fileUrl: this.form.fileUrl,
							}
							DownFileUpdate(data).then(res => {
								this.handleOkLoading = false
								const data = res.data
								if(data.code == 200){
									this.$refs.ruleForm.resetFields()		// 清空表单
									this.resetModal()		// 重置Modal位置
									this.$emit('confirmValue', '')
								}else{
									this.$message.error(data.msg)
								}
							})
						}else{
							this.handleOkLoading = false
							this.$message.info('title无效，请刷新重试！')
						}
					}else{
						this.handleOkLoading = false
						return false
					}
					this.resetModal()		// 重置Modal位置
				})
			},
			handleCancel() {
				this.resetModal()		// 重置Modal位置
				this.$refs.ruleForm.resetFields()		// 清空表单
				this.$emit('cancelValue')
			},
			// 可拖动相关
			resetNum() {
				mouseDownX = 0
				mouseDownY = 0
				deltaX = 0
				deltaY = 0
				sumX = 0
				sumY = 0
			},
			handleMove(event) {
				const delta1X = event.pageX - mouseDownX
				const delta1Y = event.pageY - mouseDownY
				deltaX = delta1X
				deltaY = delta1Y
				modalContent.style.transform = `translate(${delta1X + sumX}px, ${delta1Y + sumY}px)`
			},
			initialEvent(visible) {
				if(visible){
					setTimeout(() => {
						window.removeEventListener('mouseup', this.removeUp, false)
						contain = document.getElementsByClassName(this.simpleClass)[0]
						header = contain.getElementsByClassName('ant-modal-header')[0]
						modalContent = contain.getElementsByClassName('ant-modal-content')[0]
						modalContent.style.left = 0
						modalContent.style.transform = 'translate(0px,0px)'
						header.style.cursor = 'all-scroll'
						header.onmousedown = (e) => {
							onmousedown = true
							mouseDownX = e.pageX
							mouseDownY = e.pageY
							document.body.onselectstart = () => false
							window.addEventListener('mousemove', this.handleMove, false)
						}
						window.addEventListener('mouseup', this.removeUp, false)
					}, 0)
				}
			},
			removeMove() {
				window.removeEventListener('mousemove', this.handleMove, false)
			},
			removeUp(e) {
				document.body.onselectstart = () => true
				if (onmousedown && !(e.pageX === mouseDownX && e.pageY === mouseDownY)) {
					onmousedown = false
					sumX = sumX + deltaX
					sumY = sumY + deltaY
				}
				this.removeMove()
			},
			// 重置弹框位置
			resetModal() {
				mouseDownX = 0
				mouseDownY = 0
				deltaX = 0
				deltaY = 0
				sumX = 0
				sumY = 0
				header = null
				contain = null
				modalContent = null
				onmousedown = false
			},
    }
  }
</script>
<style lang="less" scoped>
	.ant-form-item{
		margin-bottom: 10px;
	}
	.ant-modal-footer{
		text-align: center;
	}
	.colorRed{
		color: red;
	}
</style>