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
			<a-form-model-item label="角色编码" prop="roleCode">
				<a-input v-model="form.roleCode" placeholder="请输入" :disabled="title == '查看'" />
			</a-form-model-item>
			<a-form-model-item label="角色名称" prop="roleName">
				<a-input v-model="form.roleName" placeholder="请输入" :disabled="title == '查看'" />
			</a-form-model-item>
			<a-form-model-item label="角色排序" prop="roleSort">
				<a-input-number style="width: 100%" :min="0" :max="9999" v-model="form.roleSort" placeholder="请输入" :disabled="title == '查看'" />
			</a-form-model-item>
			<a-form-model-item label="角色备住" prop="roleContent">
				<a-textarea rows="4" v-model="form.roleContent" placeholder="请输入" :disabled="title == '查看'"/>
			</a-form-model-item>
			<a-form-model-item label="角色关联系统" prop="roleSystemIds">
				<a-checkbox-group v-model="form.roleSystemIds" @change="queryPowerList(form.roleSystemIds)" :options="systemList" :disabled="title == '查看'" />
			</a-form-model-item>
			<a-form-model-item label="角色关联权限" prop="rolePowerIds">
				<a-checkbox-group v-model="form.rolePowerIds" :options="powerList" :disabled="title == '查看'" />
			</a-form-model-item>
		</a-form-model>
	</a-modal>
</template>
<script>
	import {
		RoleAdd,
		RoleUpdate,
		SystemQueryList,
		PowerQueryPowerList
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
					roleCode: this.defaultData.data.roleCode?this.defaultData.data.roleCode:'',
					roleName: this.defaultData.data.roleName?this.defaultData.data.roleName:'',
					roleContent: this.defaultData.data.roleContent?this.defaultData.data.roleContent:'',
					roleSort: this.defaultData.data.roleSort?this.defaultData.data.roleSort:'',
					roleSystemIds: this.defaultData.data.roleSystemIds?this.defaultData.data.roleSystemIds:[],
					rolePowerIds: this.defaultData.data.rolePowerIds?this.defaultData.data.rolePowerIds:[],
				},
				rules: {
					roleCode: [
						{required: true, message: '请输入角色编号', trigger: 'blur'},
					],
					roleName: [
						{required: true, message: '请输入角色名称', trigger: 'blur'},
					],
					roleSort: [
						{required: true, message: '请输入排序', trigger: 'blur'},
					],
					roleContent: [
						{required: true, message: '请输入备住', trigger: 'blur'},
					],
					roleSystemIds: [
						{required: true, message: '请选择角色关联系统', trigger: 'blur'},
					],
				},
				systemList: [],
				powerList: []
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
				this.queryPowerList(this.form.roleSystemIds)
			}
			this.querySystemList()
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
			queryPowerList(roleSystemIds) {
				if(roleSystemIds.length == 0){
					this.powerList = []
				}else{
					this.powerList = []
					roleSystemIds.forEach(item => {
						const data = {
							pageNo: -1,
							pageSize: 10,
							systemId: item
						}
						PowerQueryPowerList(data).then(res => {
							const data = res.data
							if (data.code == 200) {
								data.data.list.forEach(item => {
									let template = {}
									template.value = item.id
									template.label = item.powerName
									this.powerList.push(template)
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
								roleCode: this.form.roleCode,
								roleName: this.form.roleName,
								roleSort: this.form.roleSort,
								roleContent: this.form.roleContent,
								roleSystemIds: this.form.roleSystemIds,
								rolePowerIds: this.form.rolePowerIds,
							}
							RoleAdd(data).then(res => {
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
								roleCode: this.form.roleCode,
								roleName: this.form.roleName,
								roleSort: this.form.roleSort,
								roleContent: this.form.roleContent,
								roleSystemIds: this.form.roleSystemIds,
								rolePowerIds: this.form.rolePowerIds,
							}
							RoleUpdate(data).then(res => {
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