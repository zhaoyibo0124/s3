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
			<a-form-model-item label="表单名称" prop="formName">
				<a-input v-model="form.formName" placeholder="请输入" :disabled="title == '查看'" />
			</a-form-model-item>
			<a-form-model-item label="表名称" prop="tableName">
				<a-input v-model="form.tableName" placeholder="请输入" :disabled="title == '查看'" />
			</a-form-model-item>
			<a-form-model-item label="是否创建表" prop="isCreateTable">
				<a-select v-model="form.isCreateTable" placeholder="请选择" :disabled="title == '查看'" show-search
					option-filter-prop="children">
					<a-select-option v-for="(item,index) in queryJsonBasicList.yesNoType" :value="item.code" :key="index">{{item.name}}</a-select-option>
				</a-select>
			</a-form-model-item>
			<a-form-model-item label="是否独立表名称" prop="isBuildOneself">
				<a-select v-model="form.isBuildOneself" placeholder="请选择" :disabled="title == '查看'" show-search
					option-filter-prop="children">
					<a-select-option v-for="(item,index) in queryJsonBasicList.yesNoType" :value="item.code" :key="index">{{item.name}}</a-select-option>
				</a-select>
			</a-form-model-item>
			<a-form-model-item label="是否使用视图查询" prop="isViewQuery">
				<a-select v-model="form.isViewQuery" placeholder="请选择" :disabled="title == '查看'" show-search
					option-filter-prop="children">
					<a-select-option v-for="(item,index) in queryJsonBasicList.yesNoType" :value="item.code" :key="index">{{item.name}}</a-select-option>
				</a-select>
			</a-form-model-item>
			<a-form-model-item label="表单简介" prop="formContent">
				<a-textarea rows="4" v-model="form.formContent" placeholder="请输入" :disabled="title == '查看'"/>
			</a-form-model-item>
		</a-form-model>
	</a-modal>
</template>
<script>
	import {
		CustomizeFormAdd,
		CustomizeFormUpdate
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
					formName: this.defaultData.data.formName?this.defaultData.data.formName:'',
					tableName: this.defaultData.data.tableName?this.defaultData.data.tableName:'',
					formContent: this.defaultData.data.formContent?this.defaultData.data.formContent:'',
					isBuildOneself: this.defaultData.data.isBuildOneself?this.defaultData.data.isBuildOneself:undefined,
					isCreateTable: this.defaultData.data.isBuildOneself==2?'1':this.defaultData.data.isBuildOneself==1?'2':undefined,
					isViewQuery: this.defaultData.data.isViewQuery?this.defaultData.data.isViewQuery:undefined,
				},
				rules: {
					formName: [
						{required: true, message: '请输入表单名称', trigger: 'blur'},
					],
					tableName: [
						{required: true, message: '请输入表名称', trigger: 'blur'},
					],
					formContent: [
						{required: true, message: '请输入表单简介', trigger: 'blur'},
					],
					isBuildOneself: [
						{required: true, message: '请选择是否独立表名称', trigger: 'blur'},
					],
					isCreateTable: [
						{required: true, message: '请选择是否创建表', trigger: 'blur'},
					],
					isViewQuery: [
						{required: true, message: '请选择是否使用视图查询', trigger: 'blur'},
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
								formName: this.form.formName,
								tableName: this.form.tableName,
								formContent: this.form.formContent,
								isBuildOneself: this.form.isBuildOneself,
								isCreateTable: this.form.isCreateTable,
								isViewQuery: this.form.isViewQuery,
							}
							CustomizeFormAdd(data).then(res => {
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
								formName: this.form.formName,
								tableName: this.form.tableName,
								formContent: this.form.formContent,
								isBuildOneself: this.form.isBuildOneself,
								isCreateTable: this.form.isCreateTable,
								isViewQuery: this.form.isViewQuery,
							}
							CustomizeFormUpdate(data).then(res => {
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