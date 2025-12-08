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
			<a-form-model-item label="表单名称" prop="formId">
				<a-select v-model="form.formId" placeholder="请选择" :disabled="title == '查看'" show-search
					option-filter-prop="children">
					<a-select-option v-for="(item,index) in formList" :value="item.value" :key="index">{{item.key}}</a-select-option>
				</a-select>
			</a-form-model-item>
			<a-form-model-item label="字段名称" prop="columnName">
				<a-input v-model="form.columnName" placeholder="请输入" :disabled="title == '查看'" />
			</a-form-model-item>
			<a-form-model-item label="字段类型" prop="columnType">
				<a-select v-model="form.columnType" placeholder="请选择" :disabled="title == '查看'" show-search
					option-filter-prop="children">
					<a-select-option v-for="(item,index) in queryJsonBasicList.columnType" :value="item.code" :key="index">{{item.name}}</a-select-option>
				</a-select>
			</a-form-model-item>
			<a-form-model-item label="字段长度" prop="columnLength" v-if="form.columnType == 'varchar'">
				<a-input v-model="form.columnLength" placeholder="请输入" :disabled="title == '查看'" />
			</a-form-model-item>
			<a-form-model-item label="是否必填" prop="isNull">
				<a-select v-model="form.isNull" placeholder="请选择" :disabled="title == '查看'" show-search
					option-filter-prop="children">
					<a-select-option v-for="(item,index) in queryJsonBasicList.yesNoType" :value="item.code" :key="index">{{item.name}}</a-select-option>
				</a-select>
			</a-form-model-item>
			<a-form-model-item label="元素类型" prop="elementType">
				<a-select v-model="form.elementType" placeholder="请选择" :disabled="title == '查看'" show-search
					option-filter-prop="children">
					<a-select-option v-for="(item,index) in queryJsonBasicList.elementType" :value="item.code" :key="index">{{item.name}}</a-select-option>
				</a-select>
			</a-form-model-item>
			<a-form-model-item label="数据集类型" prop="dataSetType" v-if="form.elementType == 2">
				<a-select v-model="form.dataSetType" placeholder="请选择" :disabled="title == '查看'" show-search
					option-filter-prop="children">
					<a-select-option v-for="(item,index) in queryJsonBasicList.dataSetType" :value="item.code" :key="index">{{item.name}}</a-select-option>
				</a-select>
			</a-form-model-item>
			<a-form-model-item label="数据集" prop="dataSet" v-if="form.elementType == 2">
				<a-textarea rows="4" v-model="form.dataSet" placeholder="请输入" :disabled="title == '查看'"/>
			</a-form-model-item>
			<a-form-model-item label="字段注释" prop="columnNotes">
				<a-input v-model="form.columnNotes" placeholder="请输入" :disabled="title == '查看'" />
			</a-form-model-item>
			<a-form-model-item label="字段排序" prop="columnSort">
				<a-input-number style="width: 100%" :min="0" :max="9999" v-model="form.columnSort" placeholder="请输入" :disabled="title == '查看'" />
			</a-form-model-item>
		</a-form-model>
	</a-modal>
</template>
<script>
	import {
		CustomizeColumnAdd,
		CustomizeColumnUpdate,
		CustomizeFormQueryList
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
					formId: this.defaultData.data.formId?this.defaultData.data.formId:undefined,
					columnName: this.defaultData.data.columnName?this.defaultData.data.columnName:'',
					columnType: this.defaultData.data.columnType?this.defaultData.data.columnType:undefined,
					columnLength: this.defaultData.data.columnLength?this.defaultData.data.columnLength:'',
					isNull: this.defaultData.data.isNull?this.defaultData.data.isNull:undefined,
					elementType: this.defaultData.data.elementType?this.defaultData.data.elementType:undefined,
					dataSetType: this.defaultData.data.dataSetType?this.defaultData.data.dataSetType:undefined,
					dataSet: this.defaultData.data.dataSet?this.defaultData.data.dataSet:'',
					columnNotes: this.defaultData.data.columnNotes?this.defaultData.data.columnNotes:'',
					columnSort: this.defaultData.data.columnSort?this.defaultData.data.columnSort:'',
				},
				rules: {
					formId: [
						{required: true, message: '请选择表单名称', trigger: 'blur'},
					],
					columnName: [
						{required: true, message: '请输入字段名称', trigger: 'blur'},
					],
					columnType: [
						{required: true, message: '请选择字段类型', trigger: 'blur'},
					],
					columnLength: [
						{required: true, message: '请输入字段长度', trigger: 'blur'},
					],
					isNull: [
						{required: true, message: '请选择是否必填', trigger: 'blur'},
					],
					elementType: [
						{required: true, message: '请选择元素类型', trigger: 'blur'},
					],
					dataSetType: [
						{required: true, message: '请选择数据集类型', trigger: 'blur'},
					],
					dataSet: [
						{required: true, message: '请输入数据集', trigger: 'blur'},
					],
					columnNotes: [
						{required: true, message: '请输入字段注释', trigger: 'blur'},
					],
					columnSort: [
						{required: true, message: '请输入字段排序', trigger: 'blur'},
					],
				},
				formList: [],
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
			this.queryFormList()
		},
		beforeDestroy() {
			this.removeMove()
			window.removeEventListener('mouseup', this.removeUp, false)
		},
    methods: {
			queryFormList() {
				const data = {
					pageNo: -1,
					pageSize: 10
				}
				CustomizeFormQueryList(data).then(res => {
					const data = res.data
					if (data.code == 200) {
						this.formList = []
						let formList = []
						data.data.list.forEach(item => {
							let template = {}
							template.key = item.formName
							template.value = item.id
							formList.push(template)
						})
						this.formList = formList
					} else {
						this.$message.error(data.msg)
					}
				})
			},
			handleOk() {
				this.$refs.ruleForm.validate(valid => {
					this.handleOkLoading = true
					if(valid){
						if(this.title == '新增'){
							const data = {
								formId: this.form.formId,
								columnName: this.form.columnName,
								columnType: this.form.columnType,
								columnLength: this.form.columnLength,
								isNull: this.form.isNull,
								elementType: this.form.elementType,
								dataSetType: this.form.dataSetType,
								dataSet: this.form.dataSet,
								columnNotes: this.form.columnNotes,
								columnSort: this.form.columnSort,
							}
							CustomizeColumnAdd(data).then(res => {
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
								formId: this.form.formId,
								columnName: this.form.columnName,
								columnType: this.form.columnType,
								columnLength: this.form.columnLength,
								isNull: this.form.isNull,
								elementType: this.form.elementType,
								dataSetType: this.form.dataSetType,
								dataSet: this.form.dataSet,
								columnNotes: this.form.columnNotes,
								columnSort: this.form.columnSort,
							}
							CustomizeColumnUpdate(data).then(res => {
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