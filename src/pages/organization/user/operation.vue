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
		width="700px"
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
			<a-form-model-item label="所属企业" prop="enterpriseId">
				<a-select v-model="form.enterpriseId" @change="queryDepartmentList(form.enterpriseId, true)" placeholder="请选择" :disabled="title == '查看'" show-search
					option-filter-prop="children">
					<a-select-option v-for="(item,index) in enterpriseList" :value="item.value" :key="index">
						{{item.key}}
					</a-select-option>
				</a-select>
			</a-form-model-item>
			<a-form-model-item label="所属部门" prop="departmentId">
				<a-select v-model="form.departmentId" @change="queryPositionList(form.departmentId, true)" placeholder="请选择" :disabled="title == '查看'" show-search
					option-filter-prop="children">
					<a-select-option v-for="(item,index) in departmentList" :value="item.value" :key="index">
						{{item.key}}
					</a-select-option>
				</a-select>
			</a-form-model-item>
			<a-form-model-item label="所属职位" prop="positionId">
				<a-select v-model="form.positionId" placeholder="请选择" :disabled="title == '查看'" show-search
					option-filter-prop="children">
					<a-select-option v-for="(item,index) in positionList" :value="item.value" :key="index">
						{{item.key}}
					</a-select-option>
				</a-select>
			</a-form-model-item>
			<a-form-model-item label="用户账号" prop="loginName">
				<a-input v-model="form.loginName" placeholder="请输入" :disabled="title == '查看'" />
			</a-form-model-item>
			<a-form-model-item label="用户密码" prop="loginPasswordPlainText">
				<a-input v-model="form.loginPasswordPlainText" placeholder="请输入" :disabled="title == '查看'" />
			</a-form-model-item>
			<a-form-model-item label="用户名称" prop="userName">
				<a-input v-model="form.userName" placeholder="请输入" :disabled="title == '查看'" />
			</a-form-model-item>
			<a-form-model-item label="用户电话" prop="userMobile">
				<a-input v-model="form.userMobile" placeholder="请输入" :disabled="title == '查看'" />
			</a-form-model-item>
			<a-form-model-item label="用户身份证" prop="userCard">
				<a-input v-model="form.userCard" placeholder="请输入" :disabled="title == '查看'" />
			</a-form-model-item>
			<a-form-model-item label="用户关联用户组" prop="userGroupIds">
				<a-checkbox-group v-model="form.userGroupIds" :options="groupList" :disabled="title == '查看'" />
			</a-form-model-item>
			<a-form-model-item label="用户关联系统" prop="userSystemIds">
				<a-checkbox-group v-model="form.userSystemIds" @change="queryRoleList(form.userSystemIds)" :options="systemList" :disabled="title == '查看'" />
			</a-form-model-item>
			<a-form-model-item label="用户关联角色" prop="userRoleIds">
				<a-checkbox-group v-model="form.userRoleIds" :options="roleList" :disabled="title == '查看'" />
			</a-form-model-item>
		</a-form-model>
	</a-modal>
</template>
<script>
	import {
		UserAdd,
		UserUpdate,
		EnterpriseQueryList,
		DepartmentFindDepartmentList,
		PositionFindPositionList,
		GroupQueryList,
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
					loginName: this.defaultData.data.loginName?this.defaultData.data.loginName:'',
					loginPasswordPlainText: this.defaultData.data.loginPasswordPlainText?this.defaultData.data.loginPasswordPlainText:'',
					userName: this.defaultData.data.userName?this.defaultData.data.userName:'',
					userMobile: this.defaultData.data.userMobile?this.defaultData.data.userMobile:'',
					userCard: this.defaultData.data.userCard?this.defaultData.data.userCard:'',
					enterpriseId: this.defaultData.data.enterpriseId?this.defaultData.data.enterpriseId:undefined,
					departmentId: this.defaultData.data.departmentId?this.defaultData.data.departmentId:undefined,
					positionId: this.defaultData.data.positionId?this.defaultData.data.positionId:undefined,
					userSystemIds: this.defaultData.data.userSystemIds?this.defaultData.data.userSystemIds:[],
					userRoleIds: this.defaultData.data.userRoleIds?this.defaultData.data.userRoleIds:[],
					userGroupIds: this.defaultData.data.userGroupIds?this.defaultData.data.userGroupIds:[],
				},
				rules: {
					loginName: [
						{required: true, message: '请输入用户账号', trigger: 'blur'},
					],
					loginPasswordPlainText: [
						{required: true, message: '请输入用户密码', trigger: 'blur'},
						{ pattern: /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[a-zA-Z\d]{6,16}$/, message: "密码格式要求:6-16位数字和字母(字母包含大小写)", trigger: "blur" }
					],
					userName: [
						{required: true, message: '请输入用户名称', trigger: 'blur'},
					],
					userMobile: [
						{required: true, message: '请输入用户电话', trigger: 'blur'},
					],
					userCard: [
						{required: true, message: '请输入用户身份证', trigger: 'blur'},
					],
					enterpriseId: [
						{required: true, message: '请选择所属企业', trigger: 'blur'},
					],
					departmentId: [
						{required: true, message: '请选择所属部门', trigger: 'blur'},
					],
					positionId: [
						{required: true, message: '请选择所属职位', trigger: 'blur'},
					],
				},
				enterpriseList: [],
				departmentList: [],
				positionList: [],
				groupList: [],
				systemList: [],
				roleList: [],
				userOrganizationIds: []
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
				this.queryRoleList(this.form.userSystemIds)
				this.queryDepartmentList(this.form.enterpriseId, false)
				this.queryPositionList(this.form.departmentId, false)
			}
			this.querySystemList()
			this.queryGroupList()
			this.queryEnterpriseList()
		},
		beforeDestroy() {
			this.removeMove()
			window.removeEventListener('mouseup', this.removeUp, false)
		},
    methods: {
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
							template.key = item.enterpriseName
							enterpriseList.push(template)
						})
						this.enterpriseList = enterpriseList
					} else {
						this.$message.error(data.msg)
					}
				})
			},
			queryDepartmentList(enterpriseId, flag) {
				if(flag){
					this.form.departmentId = undefined
					this.form.positionId = undefined
				}
				const data = {
					id: enterpriseId
				}
				DepartmentFindDepartmentList(data).then(res => {
					const data = res.data
					if (data.code == 200) {
						this.departmentList = []
						let departmentList = []
						data.data.forEach(item => {
							let template = {}
							template.value = item.id
							template.key = item.departmentName
							departmentList.push(template)
						})
						this.departmentList = departmentList
					} else {
						this.$message.error(data.msg)
					}
				})
			},
			queryPositionList(departmentId, flag) {
				if(flag){
					this.form.positionId = undefined
				}
				const data = {
					id: departmentId
				}
				PositionFindPositionList(data).then(res => {
					const data = res.data
					if (data.code == 200) {
						this.positionList = []
						let positionList = []
						data.data.forEach(item => {
							let template = {}
							template.value = item.id
							template.key = item.positionName
							positionList.push(template)
						})
						this.positionList = positionList
					} else {
						this.$message.error(data.msg)
					}
				})
			},
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
			queryGroupList() {
				const data = {
					pageNo: -1,
					pageSize: 10
				}
				GroupQueryList(data).then(res => {
					const data = res.data
					if (data.code == 200) {
						this.groupList = []
						let groupList = []
						data.data.list.forEach(item => {
							let template = {}
							template.value = item.id
							template.label = item.groupName
							groupList.push(template)
						})
						this.groupList = groupList
					} else {
						this.$message.error(data.msg)
					}
				})
			},
			queryRoleList(userSystemIds) {
				if(userSystemIds.length == 0){
					this.roleList = []
				}else{
					this.roleList = []
					userSystemIds.forEach(item => {
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
				this.userOrganizationIds = []
				this.userOrganizationIds.push(this.form.enterpriseId + ',' + this.form.departmentId + ',' + this.form.positionId)
				this.$refs.ruleForm.validate(valid => {
					this.handleOkLoading = true
					if(valid){
						if(this.title == '新增'){
							const data = {
								loginName: this.form.loginName,
								loginPassword: this.form.loginPasswordPlainText,
								userName: this.form.userName,
								userMobile: this.form.userMobile,
								userCard: this.form.userCard,
								userGroupIds: this.form.userGroupIds,
								userRoleIds: this.form.userRoleIds,
								userSystemIds: this.form.userSystemIds,
								userOrganizationIds: this.userOrganizationIds
							}
							UserAdd(data).then(res => {
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
								loginName: this.form.loginName,
								loginPassword: this.form.loginPasswordPlainText,
								userName: this.form.userName,
								userMobile: this.form.userMobile,
								userCard: this.form.userCard,
								userGroupIds: this.form.userGroupIds,
								userRoleIds: this.form.userRoleIds,
								userSystemIds: this.form.userSystemIds,
								userOrganizationIds: this.userOrganizationIds
							}
							UserUpdate(data).then(res => {
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