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
			<template v-for="(item, index) in columnList">
				<a-form-model-item :label=item.columnNotes :key="index" v-if="item.elementType == '1'" :prop=item.columnName>
					<a-input v-model="form[item.columnName]" placeholder="请输入" :disabled="title == '查看'" />
				</a-form-model-item>
				<a-form-model-item :label=item.columnNotes :key="index" v-else-if="item.elementType == '2'" :prop=item.columnName>
					<a-select v-model="form[item.columnName]" v-if="item.dataSetType == '1'" placeholder="请选择" :disabled="title == '查看'" show-search option-filter-prop="children">
						<a-select-option v-for="(item,index) in queryJsonBasicList[item.dataSet]" :value="item.code" :key="index">{{item.name}}</a-select-option>
					</a-select>
					<a-select v-model="form[item.columnName]" v-else-if="item.dataSetType == '2'" placeholder="请选择" :disabled="title == '查看'" show-search option-filter-prop="children">
						<a-select-option v-for="(item,index) in JSON.parse(item.dataSet)" :value="item.code" :key="index">{{item.name}}</a-select-option>
					</a-select>
					<a-select v-model="form[item.columnName]" v-else-if="item.dataSetType == '3'" placeholder="请选择" :disabled="title == '查看'" show-search option-filter-prop="children">
						<a-select-option v-for="(item,index) in dataSetList[item.columnName]" :value="item.code" :key="index">{{item.name}}</a-select-option>
					</a-select>
				</a-form-model-item>
				<a-form-model-item :label=item.columnNotes :key="index" v-else-if="item.elementType == '3'" :prop=item.columnName>
					<a-input-number style="width: 100%" :min="0" :max="9999" v-model="form[item.columnName]" placeholder="请输入" :disabled="title == '查看'" />
				</a-form-model-item>
				<a-form-model-item :label=item.columnNotes :key="index" v-else-if="item.elementType == '4'" :prop=item.columnName>
					<a-textarea rows="4" v-model="form[item.columnName]" placeholder="请输入" :disabled="title == '查看'"/>
				</a-form-model-item>
				<a-form-model-item :label=item.columnNotes :key="index" v-if="item.elementType == '5'" :prop=item.columnName>
					<a-date-picker v-model="form[item.columnName]" type="date" :showTime="true" format="YYYY-MM-DD HH:mm:ss" placeholder="请选择" :disabled="title == '查看'" style="width: 100%;" />
				</a-form-model-item>
			</template>
		</a-form-model>
	</a-modal>
</template>
<script>
	import {
		CustomizeSetUpSql,
		CustomizeOperationAdd,
		CustomizeOperationUpdate
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
    props: ['title','defaultData','formId','columnList'],
    data() {
		const formData = {}
		const ruleData = {}
		const sqlData = {}
		const dateData = []
		formData.id = this.defaultData.data.id ? this.defaultData.data.id:''
		this.columnList.forEach((item) => {
			if(item.elementType == '2'){
				if(item.dataSetType == '3'){
					sqlData[item.columnName] = {}
				}
				formData[item.columnName] = this.defaultData.data[item.columnName] ? this.defaultData.data[item.columnName] : undefined
				if(item.isNull == '1'){
					ruleData[item.columnName] = [{required: true, message: '请选择' + item.columnNotes, trigger: 'blur'}]
				}
			}else if(item.elementType == '5'){
				dateData.push(item.columnName)
				formData[item.columnName] = this.defaultData.data[item.columnName] ? this.$moment(this.defaultData.data[item.columnName], 'YYYY-MM-DD HH:mm:ss') : ''
			}else{
				formData[item.columnName] = this.defaultData.data[item.columnName] ? this.defaultData.data[item.columnName] : ''
				if(item.isNull == '1'){
					ruleData[item.columnName] = [{required: true, message: '请输入' + item.columnNotes, trigger: 'blur'}]
				}
			}
		})
      return {
				queryJsonBasicList: JSON.parse(sessionStorage.getItem('queryJsonBasicList')),		// 存储数据角色
				visible: true,
				handleOkLoading: false,
				labelCol: {span: 5, offset: 3},
				wrapperCol: {span: 11, offset: 1},
				form: formData,
				rules: ruleData,
				dataSetList: sqlData,
				dateList: dateData
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
			this.genDataSetList()
		},
		beforeDestroy() {
			this.removeMove()
			window.removeEventListener('mouseup', this.removeUp, false)
		},
    methods: {
		genDataSetList(){
			this.columnList.forEach((item) => {
				if(item.elementType == '2'){
					if(item.dataSetType == '3'){
						const data = {
							sql: item.dataSet
						}
						CustomizeSetUpSql(data).then(res => {
							const data = res.data
							if (data.code == 200) {
								this.dataSetList[item.columnName] = data.data
							} else {
								this.$message.error(data.msg)
							}
						})
					}
				}
			})
		},
		handleOk() {
			this.$refs.ruleForm.validate(valid => {
				this.handleOkLoading = true
				if(valid){
					this.dateList.forEach((item) => {
						this.form[item] = this.form[item] != undefined && this.form[item] != null ? this.$moment(this.form[item]).format('YYYY-MM-DD HH:mm:ss') : ''
					})
					if(this.title == '新增'){
						const data = {
							formId: this.formId,
							data: this.form
						}
						CustomizeOperationAdd(data).then(res => {
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
							formId: this.formId,
							data: this.form
						}
						CustomizeOperationUpdate(data).then(res => {
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