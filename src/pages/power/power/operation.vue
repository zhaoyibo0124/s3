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
			<a-form-model-item label="权限编码" prop="powerCode">
				<a-input v-model="form.powerCode" placeholder="请输入" :disabled="title == '查看'" />
			</a-form-model-item>
			<a-form-model-item label="权限名称" prop="powerName">
				<a-input v-model="form.powerName" placeholder="请输入" :disabled="title == '查看'" />
			</a-form-model-item>
			<a-form-model-item label="权限排序" prop="powerSort">
				<a-input-number style="width: 100%" :min="0" :max="9999" v-model="form.powerSort" placeholder="请输入" :disabled="title == '查看'" />
			</a-form-model-item>
			<a-form-model-item label="权限备住" prop="powerContent">
				<a-textarea rows="4" v-model="form.powerContent" placeholder="请输入" :disabled="title == '查看'"/>
			</a-form-model-item>
			<a-form-model-item label="权限关联系统" prop="powerSystemIds">
				<a-checkbox-group v-model="form.powerSystemIds" @change="queryMenuList(form.powerSystemIds)" :options="systemList" :disabled="title == '查看'" />
			</a-form-model-item>
			<a-form-model-item label="权限设置" prop="powerList">
				<a-tree :tree-data="powerTreeList" v-model="checkPowerTreeList" checkable />
			</a-form-model-item>
		</a-form-model>
	</a-modal>
</template>
<script>
	import {
		PowerAdd,
		PowerUpdate,
		SystemQueryList,
		PowerFindPowerList
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
				queryJsonBasicList: JSON.parse(sessionStorage.getItem('queryJsonBasicList')),		// 存储数据权限
				visible: true,
				handleOkLoading: false,
				labelCol: {span: 5, offset: 3},
				wrapperCol: {span: 11, offset: 1},
				form: {
					id: this.defaultData.data.id?this.defaultData.data.id:'',
					powerCode: this.defaultData.data.powerCode?this.defaultData.data.powerCode:'',
					powerName: this.defaultData.data.powerName?this.defaultData.data.powerName:'',
					powerContent: this.defaultData.data.powerContent?this.defaultData.data.powerContent:'',
					powerSort: this.defaultData.data.powerSort?this.defaultData.data.powerSort:'',
					powerSystemIds: this.defaultData.data.powerSystemIds?this.defaultData.data.powerSystemIds:[],
					powerList: this.defaultData.data.powerList?this.defaultData.data.powerList:[],
				},
				rules: {
					powerCode: [
						{required: true, message: '请输入权限编号', trigger: 'blur'},
					],
					powerName: [
						{required: true, message: '请输入权限名称', trigger: 'blur'},
					],
					powerSort: [
						{required: true, message: '请输入排序', trigger: 'blur'},
					],
					powerContent: [
						{required: true, message: '请输入备住', trigger: 'blur'},
					],
					powerSystemIds: [
						{required: true, message: '请选择权限关联系统', trigger: 'blur'},
					],
					powerList: [
						{required: true, message: '请选择权限信息', trigger: 'blur'},
					],
				},
				systemList: [],
				powerTreeList: [],
				checkPowerTreeList: [],
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
				this.queryMenuList(this.form.powerSystemIds)
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
			queryMenuList(powerSystemIds) {
				if(powerSystemIds.length == 0){
					this.powerTreeList = []
				}else{
					this.powerTreeList = []
					powerSystemIds.forEach(item => {
						const data = {
							id: item
						}
						PowerFindPowerList(data).then(res => {
							const data = res.data
							if(data.code == 200){
								data.data.forEach(item => {
									this.powerTreeList.push(item)
								})
							}else{
								this.$message.error(data.msg)
							}
						})
						this.checkPowerTreeList = this.form.powerList
						
					})
				}
			},
			handleOk() {
				this.powerList = []
				this.checkPowerTreeList.forEach((item) => {
					let menu = item.split('-')
					if (menu[0] == 'menu') {
						let template = {}
						template.menuId = menu[1]
						let elementIds = []
						this.checkPowerTreeList.forEach((item) => {
							let element = item.split('-')
							if (element[0] == 'element' && menu[1] == element[1] && element.length == 3) {
								elementIds.push(element[2])
							}
						})
						template.elementIds = elementIds
						let operationIds = []
						this.checkPowerTreeList.forEach((item) => {
							let operation = item.split('-')
							if (operation[0] == 'operation' && menu[1] == operation[1] && operation
								.length == 3) {
								operationIds.push(operation[2])
							}
						})
						template.operationIds = operationIds
						let fileIds = []
						this.checkPowerTreeList.forEach((item) => {
							let operation = item.split('-')
							if (operation[0] == 'file' && menu[1] == operation[1] && operation
								.length == 3) {
								fileIds.push(operation[2])
							}
						})
						template.fileIds = fileIds
						this.powerList.push(template)
					}
					if (menu[0] == 'element' && menu.length == 3) {
						let flag = true
						if (this.powerList.length != 0) {
							this.powerList.forEach((item) => {
								if (item.menuId == menu[1]) {
									flag = false
								}
							})
						}
						if (flag) {
							let template = {}
							template.menuId = menu[1]
							let elementIds = []
							this.checkPowerTreeList.forEach((item) => {
								let element = item.split('-')
								if (element[0] == 'element' && menu[1] == element[1] && element.length ==
									3) {
									elementIds.push(element[2])
								}
							})
							template.elementIds = elementIds
							let operationIds = []
							this.checkPowerTreeList.forEach((item) => {
								let operation = item.split('-')
								if (operation[0] == 'operation' && menu[1] == operation[1] && operation
									.length == 3) {
									operationIds.push(operation[2])
								}
							})
							template.operationIds = operationIds
							let fileIds = []
							this.checkPowerTreeList.forEach((item) => {
								let operation = item.split('-')
								if (operation[0] == 'file' && menu[1] == operation[1] && operation
									.length == 3) {
									fileIds.push(operation[2])
								}
							})
							template.fileIds = fileIds
							this.powerList.push(template)
						}
					}
					if (menu[0] == 'operation' && menu.length == 3) {
						let flag = true
						if (this.powerList.length != 0) {
							this.powerList.forEach((item) => {
								if (item.menuId == menu[1]) {
									flag = false
								}
							})
						}
						if (flag) {
							let template = {}
							template.menuId = menu[1]
							let elementIds = []
							this.checkPowerTreeList.forEach((item) => {
								let element = item.split('-')
								if (element[0] == 'element' && menu[1] == element[1] && element.length ==
									3) {
									elementIds.push(element[2])
								}
							})
							template.elementIds = elementIds
							let operationIds = []
							this.checkPowerTreeList.forEach((item) => {
								let operation = item.split('-')
								if (operation[0] == 'operation' && menu[1] == operation[1] && operation
									.length == 3) {
									operationIds.push(operation[2])
								}
							})
							template.operationIds = operationIds
							let fileIds = []
							this.checkPowerTreeList.forEach((item) => {
								let operation = item.split('-')
								if (operation[0] == 'file' && menu[1] == operation[1] && operation
									.length == 3) {
									fileIds.push(operation[2])
								}
							})
							template.fileIds = fileIds
							this.powerList.push(template)
						}
					}
					if (menu[0] == 'file' && menu.length == 3) {
						let flag = true
						if (this.powerList.length != 0) {
							this.powerList.forEach((item) => {
								if (item.menuId == menu[1]) {
									flag = false
								}
							})
						}
						if (flag) {
							let template = {}
							template.menuId = menu[1]
							let elementIds = []
							this.checkPowerTreeList.forEach((item) => {
								let element = item.split('-')
								if (element[0] == 'element' && menu[1] == element[1] && element.length ==
									3) {
									elementIds.push(element[2])
								}
							})
							template.elementIds = elementIds
							let operationIds = []
							this.checkPowerTreeList.forEach((item) => {
								let operation = item.split('-')
								if (operation[0] == 'operation' && menu[1] == operation[1] && operation
									.length == 3) {
									operationIds.push(operation[2])
								}
							})
							template.operationIds = operationIds
							let fileIds = []
							this.checkPowerTreeList.forEach((item) => {
								let operation = item.split('-')
								if (operation[0] == 'file' && menu[1] == operation[1] && operation
									.length == 3) {
									fileIds.push(operation[2])
								}
							})
							template.fileIds = fileIds
							this.powerList.push(template)
						}
					}
				})
				this.form.powerList = this.powerList
				this.$refs.ruleForm.validate(valid => {
					this.handleOkLoading = true
					if(valid){
						if(this.title == '新增'){
							const data = {
								powerCode: this.form.powerCode,
								powerName: this.form.powerName,
								powerSort: this.form.powerSort,
								powerContent: this.form.powerContent,
								powerSystemIds: this.form.powerSystemIds,
								powerList: this.form.powerList,
							}
							PowerAdd(data).then(res => {
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
								powerCode: this.form.powerCode,
								powerName: this.form.powerName,
								powerSort: this.form.powerSort,
								powerContent: this.form.powerContent,
								powerSystemIds: this.form.powerSystemIds,
								powerList: this.form.powerList,
							}
							PowerUpdate(data).then(res => {
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