<template>
	<a-modal :class="[simpleClass]" :bodyStyle="{ padding: 0 }" :title="title" :visible="visible" @cancel="handleCancel"
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
			<a-form-model-item label="菜单级别" prop="menuLevel">
				<a-select v-model="form.menuLevel" @change="queryMenuList(form.menuLevel, true)" placeholder="请选择"
					:disabled="title == '查看'" show-search option-filter-prop="children">
					<a-select-option v-for="(item, index) in queryJsonBasicList.secondLevelType" :value="item.code"
						:key="index">{{ item.name }}</a-select-option>
				</a-select>
			</a-form-model-item>
			<a-form-model-item label="菜单上级" prop="menuParent">
				<a-select v-model="form.menuParent" placeholder="请选择" :disabled="title == '查看'" show-search
					option-filter-prop="children">
					<a-select-option v-for="(item, index) in menuList" :value="item.value" :key="index">
						{{ item.key }}
					</a-select-option>
				</a-select>
			</a-form-model-item>
			<a-form-model-item label="菜单编号" prop="menuCode">
				<a-input v-model="form.menuCode" placeholder="请输入" :disabled="title == '查看'" />
			</a-form-model-item>
			<a-form-model-item label="菜单名称" prop="menuName">
				<a-input v-model="form.menuName" placeholder="请输入" :disabled="title == '查看'" />
			</a-form-model-item>
			<a-form-model-item label="菜单地址" prop="menuUrl">
				<a-input v-model="form.menuUrl" placeholder="请输入" :disabled="title == '查看'" />
			</a-form-model-item>
			<a-form-model-item label="菜单图标" prop="menuIcon">
				<a-input v-model="form.menuIcon" placeholder="请输入" :disabled="title == '查看'" />
			</a-form-model-item>
			<a-form-model-item label="菜单排序" prop="menuSort">
				<a-input-number style="width: 100%" :min="0" :max="9999" v-model="form.menuSort" placeholder="请输入"
					:disabled="title == '查看'" />
			</a-form-model-item>
			<a-form-model-item label="菜单备住" prop="menuContent">
				<a-textarea rows="4" v-model="form.menuContent" placeholder="请输入" :disabled="title == '查看'" />
			</a-form-model-item>
			<a-form-model-item label="菜单是否展示" prop="menuShow">
				<a-select v-model="form.menuShow" placeholder="请选择" :disabled="title == '查看'">
					<a-select-option v-for="(item, index) in queryJsonBasicList.yesNoType" :value="item.code"
						:key="index">
						{{ item.name }}
					</a-select-option>
				</a-select>
			</a-form-model-item>
			<a-form-model-item label="菜单关联系统" prop="menuSystemIds">
				<a-checkbox-group v-model="form.menuSystemIds" :options="systemList" :disabled="title == '查看'" />
			</a-form-model-item>
			<a-form-model-item label="菜单关联操作">
				<a-checkbox-group v-model="form.menuOperationIds" :options="operationList" :disabled="title == '查看'" />
			</a-form-model-item>
			<a-form-model-item label="菜单关联元素">
				<a-checkbox-group v-model="form.menuElementIds" :options="elementList" :disabled="title == '查看'" />
			</a-form-model-item>
			<a-form-model-item label="菜单关联文件">
				<a-checkbox-group v-model="form.menuFileIds" :options="fileList" :disabled="title == '查看'" />
			</a-form-model-item>
		</a-form-model>
	</a-modal>
</template>
<script>
import {
	MenuAdd,
	MenuUpdate,
	MenuQueryList,
	SystemQueryList,
	OperationQueryList,
	ElementQueryList,
	FileQueryList
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
	props: ['title', 'defaultData'],
	data() {
		return {
			queryJsonBasicList: JSON.parse(sessionStorage.getItem('queryJsonBasicList')),		// 存储数据菜单
			visible: true,
			handleOkLoading: false,
			labelCol: { span: 5, offset: 3 },
			wrapperCol: { span: 11, offset: 1 },
			form: {
				id: this.defaultData.data.id ? this.defaultData.data.id : '',
				menuParent: this.defaultData.data.menuParent ? this.defaultData.data.menuParent : undefined,
				menuLevel: this.defaultData.data.menuLevel ? this.defaultData.data.menuLevel : undefined,
				menuCode: this.defaultData.data.menuCode ? this.defaultData.data.menuCode : '',
				menuName: this.defaultData.data.menuName ? this.defaultData.data.menuName : '',
				menuUrl: this.defaultData.data.menuUrl ? this.defaultData.data.menuUrl : '',
				menuIcon: this.defaultData.data.menuIcon ? this.defaultData.data.menuIcon : '',
				menuContent: this.defaultData.data.menuContent ? this.defaultData.data.menuContent : '',
				menuSort: this.defaultData.data.menuSort ? this.defaultData.data.menuSort : '',
				menuSystemIds: this.defaultData.data.menuSystemIds ? this.defaultData.data.menuSystemIds : [],
				menuOperationIds: this.defaultData.data.menuOperationIds ? this.defaultData.data.menuOperationIds : [],
				menuElementIds: this.defaultData.data.menuElementIds ? this.defaultData.data.menuElementIds : [],
				menuFileIds: this.defaultData.data.menuFileIds ? this.defaultData.data.menuFileIds : [],
				menuShow: this.defaultData.data.menuShow ? this.defaultData.data.menuShow : undefined
			},
			rules: {
				menuLevel: [
					{ required: true, message: '请选择级别', trigger: 'blur' },
				],
				menuParent: [
					{ required: true, message: '请选择菜单上级', trigger: 'blur' },
				],
				menuCode: [
					{ required: true, message: '请输入菜单编号', trigger: 'blur' },
				],
				menuName: [
					{ required: true, message: '请输入菜单名称', trigger: 'blur' },
				],
				menuSort: [
					{ required: true, message: '请输入排序', trigger: 'blur' },
				],
				menuUrl: [
					{ required: true, message: '请输入地址', trigger: 'blur' },
				],
				menuIcon: [
					{ required: true, message: '请输入图标', trigger: 'blur' },
				],
				menuContent: [
					{ required: true, message: '请输入备注', trigger: 'blur' },
				],
				menuShow: [
					{ required: true, message: '请选择菜单是否展示', trigger: 'blur' },
				],
				menuSystemIds: [
					{ required: true, message: '请选择菜单关联系统', trigger: 'blur' },
				],
			},
			menuList: [],
			systemList: [],
			operationList: [],
			elementList: [],
			fileList: []
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
		if (this.title != '新增') {
			this.queryMenuList(this.form.menuLevel, false)
		}
		this.querySystemList()
		this.queryOperationList()
		this.queryElementList()
		this.queryFileList()
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
		queryOperationList() {
			const data = {
				pageNo: -1,
				pageSize: 10
			}
			OperationQueryList(data).then(res => {
				const data = res.data
				if (data.code == 200) {
					this.operationList = []
					let operationList = []
					data.data.list.forEach(item => {
						let template = {}
						template.value = item.id
						template.label = item.operationName
						operationList.push(template)
					})
					this.operationList = operationList
				} else {
					this.$message.error(data.msg)
				}
			})
		},
		queryElementList() {
			const data = {
				pageNo: -1,
				pageSize: 10
			}
			ElementQueryList(data).then(res => {
				const data = res.data
				if (data.code == 200) {
					this.elementList = []
					let elementList = []
					data.data.list.forEach(item => {
						let template = {}
						template.value = item.id
						template.label = item.elementName
						elementList.push(template)
					})
					this.elementList = elementList
				} else {
					this.$message.error(data.msg)
				}
			})
		},
		queryFileList() {
			const data = {
				pageNo: -1,
				pageSize: 10
			}
			FileQueryList(data).then(res => {
				const data = res.data
				if (data.code == 200) {
					this.fileList = []
					let fileList = []
					data.data.list.forEach(item => {
						let template = {}
						template.value = item.id
						template.label = item.fileName
						fileList.push(template)
					})
					this.fileList = fileList
				} else {
					this.$message.error(data.msg)
				}
			})
		},
		queryMenuList(menuLevel, flag) {
			if (flag) {
				this.form.menuParent = undefined
			}
			if (menuLevel == 1) {
				this.menuList = []
				let template = {}
				template.key = '初始菜单'
				template.value = '-1'
				this.menuList.push(template)
			} else {
				const data = {
					pageNo: -1,
					pageSize: 10,
					menuLevel: menuLevel - 1
				}
				MenuQueryList(data).then(res => {
					const data = res.data
					if (data.code == 200) {
						this.menuList = []
						let menuList = []
						data.data.list.forEach(item => {
							let template = {}
							template.key = item.menuName
							template.value = item.menuCode
							menuList.push(template)
						})
						this.menuList = menuList
					} else {
						this.$message.error(data.msg)
					}
				})
			}
		},
		handleOk() {
			this.$refs.ruleForm.validate(valid => {
				this.handleOkLoading = true
				if (valid) {
					if (this.title == '新增') {
						const data = {
							menuParent: this.form.menuParent,
							menuCode: this.form.menuCode,
							menuName: this.form.menuName,
							menuLevel: this.form.menuLevel,
							menuSort: this.form.menuSort,
							menuContent: this.form.menuContent,
							menuUrl: this.form.menuUrl,
							menuIcon: this.form.menuIcon,
							menuSystemIds: this.form.menuSystemIds,
							menuOperationIds: this.form.menuOperationIds,
							menuElementIds: this.form.menuElementIds,
							menuFileIds: this.form.menuFileIds,
							menuShow: this.form.menuShow
						}
						MenuAdd(data).then(res => {
							this.handleOkLoading = false
							const data = res.data
							if (data.code == 200) {
								this.$refs.ruleForm.resetFields()		// 清空表单
								this.resetModal()		// 重置Modal位置
								this.$emit('confirmValue', '')
							} else {
								this.$message.error(data.msg)
							}
						})
					} else if (this.title == '编辑') {
						const data = {
							id: this.form.id,
							menuParent: this.form.menuParent,
							menuCode: this.form.menuCode,
							menuName: this.form.menuName,
							menuLevel: this.form.menuLevel,
							menuSort: this.form.menuSort,
							menuContent: this.form.menuContent,
							menuUrl: this.form.menuUrl,
							menuIcon: this.form.menuIcon,
							menuSystemIds: this.form.menuSystemIds,
							menuOperationIds: this.form.menuOperationIds,
							menuElementIds: this.form.menuElementIds,
							menuFileIds: this.form.menuFileIds,
							menuShow: this.form.menuShow
						}
						MenuUpdate(data).then(res => {
							this.handleOkLoading = false
							const data = res.data
							if (data.code == 200) {
								this.$refs.ruleForm.resetFields()		// 清空表单
								this.resetModal()		// 重置Modal位置
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
			if (visible) {
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