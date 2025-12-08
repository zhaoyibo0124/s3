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
			<a-form-model-item label="职位级别" prop="positionLevel">
				<a-select v-model="form.positionLevel" @change="queryPositionList(form.positionLevel, true)" placeholder="请选择" :disabled="title == '查看'" show-search
					option-filter-prop="children">
					<a-select-option v-for="(item,index) in queryJsonBasicList.secondLevelType" :value="item.code" :key="index">{{item.name}}</a-select-option>
				</a-select>
			</a-form-model-item>
			<a-form-model-item label="职位上级" prop="positionParent">
				<a-select v-model="form.positionParent" placeholder="请选择" :disabled="title == '查看'" show-search
					option-filter-prop="children">
					<a-select-option v-for="(item,index) in positionList" :value="item.value" :key="index">
						{{item.key}}
					</a-select-option>
				</a-select>
			</a-form-model-item>
			<a-form-model-item label="职位编码" prop="positionCode">
				<a-input v-model="form.positionCode" placeholder="请输入" :disabled="title == '查看'" />
			</a-form-model-item>
			<a-form-model-item label="职位名称" prop="positionName">
				<a-input v-model="form.positionName" placeholder="请输入" :disabled="title == '查看'" />
			</a-form-model-item>
			<a-form-model-item label="职位排序" prop="positionSort">
				<a-input-number style="width: 100%" :min="0" :max="9999" v-model="form.positionSort" placeholder="请输入" :disabled="title == '查看'" />
			</a-form-model-item>
			<a-form-model-item label="职位备住" prop="positionContent">
				<a-textarea rows="4" v-model="form.positionContent" placeholder="请输入" :disabled="title == '查看'"/>
			</a-form-model-item>
			<a-form-model-item label="职位关联部门" prop="positionDepartmentIds">
				<a-checkbox-group v-model="form.positionDepartmentIds" :options="departmentList" :disabled="title == '查看'" />
			</a-form-model-item>
			<a-form-model-item label="职位关联系统" prop="positionSystemIds">
				<a-checkbox-group v-model="form.positionSystemIds" @change="queryRoleList(form.positionSystemIds)" :options="systemList" :disabled="title == '查看'" />
			</a-form-model-item>
			<a-form-model-item label="职位关联角色" prop="positionRoleIds">
				<a-checkbox-group v-model="form.positionRoleIds" :options="roleList" :disabled="title == '查看'" />
			</a-form-model-item>
		</a-form-model>
	</a-modal>
</template>
<script>
	import {
		PositionAdd,
		PositionUpdate,
		DepartmentQueryList,
		SystemQueryList,
		RoleQueryRoleList,
		PositionQueryList
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
					positionCode: this.defaultData.data.positionCode?this.defaultData.data.positionCode:'',
					positionName: this.defaultData.data.positionName?this.defaultData.data.positionName:'',
					positionSort: this.defaultData.data.positionSort?this.defaultData.data.positionSort:'',
					positionContent: this.defaultData.data.positionContent?this.defaultData.data.positionContent:'',
					positionLevel: this.defaultData.data.positionLevel?this.defaultData.data.positionLevel:undefined,
					positionParent: this.defaultData.data.positionParent?this.defaultData.data.positionParent:undefined,
					positionSystemIds: this.defaultData.data.positionSystemIds?this.defaultData.data.positionSystemIds:[],
					positionRoleIds: this.defaultData.data.positionRoleIds?this.defaultData.data.positionRoleIds:[],
					positionDepartmentIds: this.defaultData.data.positionDepartmentIds?this.defaultData.data.positionDepartmentIds:[],
				},
				rules: {
					positionName: [
						{required: true, message: '请输入职位名称', trigger: 'blur'},
					],
					positionCode: [
						{required: true, message: '请输入职位编码', trigger: 'blur'},
					],
					positionSort: [
						{required: true, message: '请输入职位排序', trigger: 'blur'},
					],
					positionContent: [
						{required: true, message: '请输入职位备注', trigger: 'blur'},
					],
					positionLevel: [
						{required: true, message: '请选择职位级别', trigger: 'blur'},
					],
					positionParent: [
						{required: true, message: '请选择职位上级', trigger: 'blur'},
					],
					positionDepartmentIds: [
						{required: true, message: '请选择职位关联部门', trigger: 'blur'},
					],
				},
				departmentList: [],
				systemList: [],
				roleList: [],
				positionList: []
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
				this.queryRoleList(this.form.positionSystemIds)
				this.queryPositionList(this.form.positionLevel, false)
			}
			this.querySystemList()
			this.queryDepartmentList()
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
			queryDepartmentList() {
				const data = {
					pageNo: -1,
					pageSize: 10
				}
				DepartmentQueryList(data).then(res => {
					const data = res.data
					if (data.code == 200) {
						this.departmentList = []
						let departmentList = []
						data.data.list.forEach(item => {
							let template = {}
							template.value = item.id
							template.label = item.departmentName
							departmentList.push(template)
						})
						this.departmentList = departmentList
					} else {
						this.$message.error(data.msg)
					}
				})
			},
			queryRoleList(positionSystemIds) {
				if(positionSystemIds.length == 0){
					this.roleList = []
				}else{
					this.roleList = []
					positionSystemIds.forEach(item => {
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
			queryPositionList(positionLevel, flag) {
				if(flag){
					this.form.positionParent = undefined
				}
				if(positionLevel == 1){
					this.positionList = []
					let template = {}
					template.key = '初始职位'
					template.value = '-1'
					this.positionList.push(template)
				}else{
					const data = {
						pageNo: -1,
						pageSize: 10,
						positionLevel: positionLevel - 1
					}
					PositionQueryList(data).then(res => {
						const data = res.data
						if (data.code == 200) {
							this.positionList = []
							let positionList = []
							data.data.list.forEach(item => {
								let template = {}
								template.key = item.positionName
								template.value = item.id
								positionList.push(template)
							})
							this.positionList = positionList
						} else {
							this.$message.error(data.msg)
						}
					})
				}
			},
			handleOk() {
				this.$refs.ruleForm.validate(valid => {
					this.handleOkLoading = true
					if(valid){
						if(this.title == '新增'){
							const data = {
								positionLevel: this.form.positionLevel,
								positionParent: this.form.positionParent,
								positionCode: this.form.positionCode,
								positionName: this.form.positionName,
								positionSort: this.form.positionSort,
								positionContent: this.form.positionContent,
								positionSystemIds: this.form.positionSystemIds,
								positionRoleIds: this.form.positionRoleIds,
								positionDepartmentIds: this.form.positionDepartmentIds,
							}
							PositionAdd(data).then(res => {
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
								positionLevel: this.form.positionLevel,
								positionParent: this.form.positionParent,
								positionCode: this.form.positionCode,
								positionName: this.form.positionName,
								positionSort: this.form.positionSort,
								positionContent: this.form.positionContent,
								positionSystemIds: this.form.positionSystemIds,
								positionRoleIds: this.form.positionRoleIds,
								positionDepartmentIds: this.form.positionDepartmentIds,
							}
							PositionUpdate(data).then(res => {
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