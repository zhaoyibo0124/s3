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
			<a-form-model-item label="企业级别" prop="enterpriseLevel">
				<a-select v-model="form.enterpriseLevel" @change="queryEnterpriseList(form.enterpriseLevel, true)" placeholder="请选择" :disabled="title == '查看'" show-search
					option-filter-prop="children">
					<a-select-option v-for="(item,index) in queryJsonBasicList.secondLevelType" :value="item.code" :key="index">{{item.name}}</a-select-option>
				</a-select>
			</a-form-model-item>
			<a-form-model-item label="企业上级" prop="enterpriseParent">
				<a-select v-model="form.enterpriseParent" placeholder="请选择" :disabled="title == '查看'" show-search
					option-filter-prop="children">
					<a-select-option v-for="(item,index) in enterpriseList" :value="item.value" :key="index">
						{{item.key}}
					</a-select-option>
				</a-select>
			</a-form-model-item>
			<a-form-model-item label="企业编码" prop="enterpriseCode">
				<a-input v-model="form.enterpriseCode" placeholder="请输入" :disabled="title == '查看'" />
			</a-form-model-item>
			<a-form-model-item label="企业名称" prop="enterpriseName">
				<a-input v-model="form.enterpriseName" placeholder="请输入" :disabled="title == '查看'" />
			</a-form-model-item>
			<a-form-model-item label="企业排序" prop="enterpriseSort">
				<a-input-number style="width: 100%" :min="0" :max="9999" v-model="form.enterpriseSort" placeholder="请输入" :disabled="title == '查看'" />
			</a-form-model-item>
			<a-form-model-item label="企业备住" prop="enterpriseContent">
				<a-textarea rows="4" v-model="form.enterpriseContent" placeholder="请输入" :disabled="title == '查看'"/>
			</a-form-model-item>
			<a-form-model-item label="企业关联系统" prop="enterpriseSystemIds">
				<a-checkbox-group v-model="form.enterpriseSystemIds" @change="queryRoleList(form.enterpriseSystemIds)" :options="systemList" :disabled="title == '查看'" />
			</a-form-model-item>
			<a-form-model-item label="企业关联角色" prop="enterpriseRoleIds">
				<a-checkbox-group v-model="form.enterpriseRoleIds" :options="roleList" :disabled="title == '查看'" />
			</a-form-model-item>
		</a-form-model>
	</a-modal>
</template>
<script>
	import {
		EnterpriseAdd,
		EnterpriseUpdate,
		SystemQueryList,
		RoleQueryRoleList,
		EnterpriseQueryList
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
					enterpriseCode: this.defaultData.data.enterpriseCode?this.defaultData.data.enterpriseCode:'',
					enterpriseName: this.defaultData.data.enterpriseName?this.defaultData.data.enterpriseName:'',
					enterpriseSort: this.defaultData.data.enterpriseSort?this.defaultData.data.enterpriseSort:'',
					enterpriseContent: this.defaultData.data.enterpriseContent?this.defaultData.data.enterpriseContent:'',
					enterpriseLevel: this.defaultData.data.enterpriseLevel?this.defaultData.data.enterpriseLevel:undefined,
					enterpriseParent: this.defaultData.data.enterpriseParent?this.defaultData.data.enterpriseParent:undefined,
					enterpriseSystemIds: this.defaultData.data.enterpriseSystemIds?this.defaultData.data.enterpriseSystemIds:[],
					enterpriseRoleIds: this.defaultData.data.enterpriseRoleIds?this.defaultData.data.enterpriseRoleIds:[],
				},
				rules: {
					enterpriseName: [
						{required: true, message: '请输入企业名称', trigger: 'blur'},
					],
					enterpriseCode: [
						{required: true, message: '请输入企业编码', trigger: 'blur'},
					],
					enterpriseSort: [
						{required: true, message: '请输入企业排序', trigger: 'blur'},
					],
					enterpriseContent: [
						{required: true, message: '请输入企业备注', trigger: 'blur'},
					],
					enterpriseLevel: [
						{required: true, message: '请选择企业级别', trigger: 'blur'},
					],
					enterpriseParent: [
						{required: true, message: '请选择企业上级', trigger: 'blur'},
					],
				},
				systemList: [],
				roleList: [],
				enterpriseList: []
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
				this.queryRoleList(this.form.enterpriseSystemIds)
				this.queryEnterpriseList(this.form.enterpriseLevel, false)
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
			queryRoleList(enterpriseSystemIds) {
				if(enterpriseSystemIds.length == 0){
					this.roleList = []
				}else{
					this.roleList = []
					enterpriseSystemIds.forEach(item => {
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
			queryEnterpriseList(enterpriseLevel, flag) {
				if(flag){
					this.form.enterpriseParent = undefined
				}
				if(enterpriseLevel == 1){
					this.enterpriseList = []
					let template = {}
					template.key = '初始企业'
					template.value = '-1'
					this.enterpriseList.push(template)
				}else{
					const data = {
						pageNo: -1,
						pageSize: 10,
						enterpriseLevel: enterpriseLevel - 1
					}
					EnterpriseQueryList(data).then(res => {
						const data = res.data
						if (data.code == 200) {
							this.enterpriseList = []
							let enterpriseList = []
							data.data.list.forEach(item => {
								let template = {}
								template.key = item.enterpriseName
								template.value = item.id
								enterpriseList.push(template)
							})
							this.enterpriseList = enterpriseList
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
								enterpriseCode: this.form.enterpriseCode,
								enterpriseName: this.form.enterpriseName,
								enterpriseSort: this.form.enterpriseSort,
								enterpriseContent: this.form.enterpriseContent,
								enterpriseLevel: this.form.enterpriseLevel,
								enterpriseParent: this.form.enterpriseParent,
								enterpriseSystemIds: this.form.enterpriseSystemIds,
								enterpriseRoleIds: this.form.enterpriseRoleIds,
							}
							EnterpriseAdd(data).then(res => {
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
								enterpriseCode: this.form.enterpriseCode,
								enterpriseName: this.form.enterpriseName,
								enterpriseSort: this.form.enterpriseSort,
								enterpriseContent: this.form.enterpriseContent,
								enterpriseLevel: this.form.enterpriseLevel,
								enterpriseParent: this.form.enterpriseParent,
								enterpriseSystemIds: this.form.enterpriseSystemIds,
								enterpriseRoleIds: this.form.enterpriseRoleIds,
							}
							EnterpriseUpdate(data).then(res => {
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