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
			<a-form-model-item label="部门编码" prop="departmentCode">
				<a-input v-model="form.departmentCode" placeholder="请输入" :disabled="title == '查看'" />
			</a-form-model-item>
			<a-form-model-item label="部门名称" prop="departmentName">
				<a-input v-model="form.departmentName" placeholder="请输入" :disabled="title == '查看'" />
			</a-form-model-item>
			<a-form-model-item label="部门排序" prop="departmentSort">
				<a-input-number style="width: 100%" :min="0" :max="9999" v-model="form.departmentSort" placeholder="请输入" :disabled="title == '查看'" />
			</a-form-model-item>
			<a-form-model-item label="部门备住" prop="departmentContent">
				<a-textarea rows="4" v-model="form.departmentContent" placeholder="请输入" :disabled="title == '查看'"/>
			</a-form-model-item>
			<a-form-model-item label="部门关联企业" prop="departmentEnterpriseIds">
				<a-checkbox-group v-model="form.departmentEnterpriseIds" :options="enterpriseList" :disabled="title == '查看'" />
			</a-form-model-item>
			<a-form-model-item label="部门关联系统" prop="departmentSystemIds">
				<a-checkbox-group v-model="form.departmentSystemIds" @change="queryRoleList(form.departmentSystemIds)" :options="systemList" :disabled="title == '查看'" />
			</a-form-model-item>
			<a-form-model-item label="部门关联角色" prop="departmentRoleIds">
				<a-checkbox-group v-model="form.departmentRoleIds" :options="roleList" :disabled="title == '查看'" />
			</a-form-model-item>
		</a-form-model>
	</a-modal>
</template>
<script>
	import {
		DepartmentAdd,
		DepartmentUpdate,
		EnterpriseQueryList,
		SystemQueryList,
		RoleQueryRoleList
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
				queryJsonBasicList: JSON.parse(sessionStorage.getItem('queryJsonBasicList')),		// 存储数据角色
				visible: true,
				handleOkLoading: false,
				labelCol: {span: 5, offset: 3},
				wrapperCol: {span: 11, offset: 1},
				form: {
					id: this.defaultData.data.id?this.defaultData.data.id:'',
					departmentCode: this.defaultData.data.departmentCode?this.defaultData.data.departmentCode:'',
					departmentName: this.defaultData.data.departmentName?this.defaultData.data.departmentName:'',
					departmentSort: this.defaultData.data.departmentSort?this.defaultData.data.departmentSort:'',
					departmentContent: this.defaultData.data.departmentContent?this.defaultData.data.departmentContent:'',
					departmentSystemIds: this.defaultData.data.departmentSystemIds?this.defaultData.data.departmentSystemIds:[],
					departmentRoleIds: this.defaultData.data.departmentRoleIds?this.defaultData.data.departmentRoleIds:[],
					departmentEnterpriseIds: this.defaultData.data.departmentEnterpriseIds?this.defaultData.data.departmentEnterpriseIds:[],
				},
				rules: {
					departmentName: [
						{required: true, message: '请输入部门名称', trigger: 'blur'},
					],
					departmentCode: [
						{required: true, message: '请输入部门编码', trigger: 'blur'},
					],
					departmentSort: [
						{required: true, message: '请输入部门排序', trigger: 'blur'},
					],
					departmentContent: [
						{required: true, message: '请输入部门备注', trigger: 'blur'},
					],
					departmentEnterpriseIds: [
						{required: true, message: '请选择部门关联企业', trigger: 'blur'},
					],
				},
				enterpriseList: [],
				systemList: [],
				roleList: []
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
			if(this.title != '新增'){
				this.queryRoleList(this.form.departmentSystemIds)
			}
			this.querySystemList()
			this.queryEnterpriseList()
		},
		beforeDestroy() {
			this.removeMove()
			window.removeEventListener('mouseup', this.removeUp, false)
		},
    methods: {
			querySystemList() {
				const data = {
					pageNo: -1,
					pageSize: 10
				}
				SystemQueryList(data).then(res => {
					const data = res.data
					if (data.code == 200) {
						this.systemList = []
						let systemList = []
						data.data.list.forEach(item => {
							let template = {}
							template.value = item.id
							template.label = item.systemName
							systemList.push(template)
						})
						this.systemList = systemList
					} else {
						this.$message.error(data.msg)
					}
				})
			},
			queryEnterpriseList() {
				const data = {
					pageNo: -1,
					pageSize: 10
				}
				EnterpriseQueryList(data).then(res => {
					const data = res.data
					if (data.code == 200) {
						this.enterpriseList = []
						let enterpriseList = []
						data.data.list.forEach(item => {
							let template = {}
							template.value = item.id
							template.label = item.enterpriseName
							enterpriseList.push(template)
						})
						this.enterpriseList = enterpriseList
					} else {
						this.$message.error(data.msg)
					}
				})
			},
			queryRoleList(departmentSystemIds) {
				if(departmentSystemIds.length == 0){
					this.roleList = []
				}else{
					this.roleList = []
					departmentSystemIds.forEach(item => {
						const data = {
							pageNo: -1,
							pageSize: 10,
							systemId: item
						}
						RoleQueryRoleList(data).then(res => {
							const data = res.data
							if (data.code == 200) {
								data.data.list.forEach(item => {
									let template = {}
									template.value = item.id
									template.label = item.roleName
									this.roleList.push(template)
								})
							} else {
								this.$message.error(data.msg)
							}
						})
					})
				}
			},
			handleOk() {
				this.$refs.ruleForm.validate(valid => {
					this.handleOkLoading = true
					if(valid){
						if(this.title == '新增'){
							const data = {
								departmentCode: this.form.departmentCode,
								departmentName: this.form.departmentName,
								departmentSort: this.form.departmentSort,
								departmentContent: this.form.departmentContent,
								departmentSystemIds: this.form.departmentSystemIds,
								departmentRoleIds: this.form.departmentRoleIds,
								departmentEnterpriseIds: this.form.departmentEnterpriseIds,
							}
							DepartmentAdd(data).then(res => {
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
								departmentCode: this.form.departmentCode,
								departmentName: this.form.departmentName,
								departmentSort: this.form.departmentSort,
								departmentContent: this.form.departmentContent,
								departmentSystemIds: this.form.departmentSystemIds,
								departmentRoleIds: this.form.departmentRoleIds,
								departmentEnterpriseIds: this.form.departmentEnterpriseIds,
							}
							DepartmentUpdate(data).then(res => {
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