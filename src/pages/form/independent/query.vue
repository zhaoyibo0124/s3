<template>
	<div class="bidSubproject" :style="`min-height: ${pageMinHeight}px`">
		<div class="gutter-box">
			<div class="serchInfo">
				<div :class="advanced ? 'search' : null" v-if="operation.find">
					<a-form-model layout="inline" ref="ruleForm" :model="searchForm">
						<template v-for="(item, index) in queryList">
							<a-form-model-item :label=item.queryNotes :key="index" v-if="show && (item.elementType == '1' || item.elementType == '4')">
								<a-input v-model="searchForm[item.requiredFields]" placeholder="请输入"  style="width: 174px;" />
							</a-form-model-item>
							<a-form-model-item :label=item.queryNotes :key="index" v-else-if="show && item.elementType == '2'">
								<a-select v-model="searchForm[item.requiredFields]" v-if="item.dataSetType == '1'" placeholder="请选择" style="width: 174px;">
									<a-select-option v-for="(item,index) in queryJsonBasicList[item.dataSet]" :value="item.code" :key="index">{{item.name}}</a-select-option>
								</a-select>
								<a-select v-model="searchForm[item.requiredFields]" v-else-if="item.dataSetType == '2'" placeholder="请选择" style="width: 174px;">
									<a-select-option v-for="(item,index) in JSON.parse(item.dataSet)" :value="item.code" :key="index">{{item.name}}</a-select-option>
								</a-select>
								<a-select v-model="searchForm[item.requiredFields]" v-else-if="item.dataSetType == '3'" placeholder="请选择" style="width: 174px;">
									<a-select-option v-for="(item,index) in dataSetList[item.requiredFields]" :value="item.code" :key="index">{{item.name}}</a-select-option>
								</a-select>
							</a-form-model-item>
							<a-form-model-item :label=item.queryNotes :key="index" v-else-if="show && item.elementType == '3'">
								<a-input-number :min="0" :max="9999" v-model="searchForm[item.requiredFields.split(',')[0]]" placeholder="请输入" style="width: 90px;" />
								~
								<a-input-number :min="0" :max="9999" v-model="searchForm[item.requiredFields.split(',')[1]]" placeholder="请输入" style="width: 90px;" />	
							</a-form-model-item>
							<a-form-model-item :label=item.queryNotes :key="index" v-else-if="show && item.elementType == '5'">
								<a-range-picker v-model="searchForm[item.queryName]" type="date" :showTime="true" format="YYYY-MM-DD HH:mm:ss" style="width: 348px;" />
							</a-form-model-item>
						</template>
						<a-form-model-item>
							<span style="display: inline-block;">
								<a-button type="primary" @click="handleSearch">查询</a-button>
								<a-button style="margin-left: 8px" @click="handleReset">重置</a-button>
							</span>
						</a-form-model-item>
					</a-form-model>
				</div>
			</div>
			<a-card v-if="operation.table">
				<a-space>
					<a-button type="primary" class="btn-create" v-if="flag" @click="addBtn">+ 新增</a-button>
					<a-button type="primary" class="btn-create" v-if="flag" @click="impBtn">导入excel</a-button>
					<a-button type="primary" class="btn-create" v-if="flag" @click="expBtn">导出excel</a-button>
					<a-button type="primary" class="btn-create" v-if="flag" @click="tempBtn">下载模板</a-button>
				</a-space>
				<a-table
					:columns="columns"
					:dataSource="dataSource"
					:loading="tableLoading"
					:pagination="tablePagination"
					style="margin-top: 10px;"
					:scroll="{x: 1200}"
				>
					<div slot="action" slot-scope="text, record">
						<a-space>
							<a-button type="link" @click="editorBtn(record)" v-if="operation.update">
								编 辑
							</a-button>
							<a-button type="link" @click="disableBtn(record)" v-if="operation.disable && record.is_delete == '2'">
								禁 用
							</a-button>
							<a-button type="link" @click="restoreBtn(record)" v-if="operation.recovery && record.is_delete == '1'">
								恢 复
							</a-button>
							<a-button type="link" @click="deleteBtn(record)" v-if="operation.delete">
								删 除
							</a-button>
							<a-button type="link" @click="toViewBtn(record)">
								查 看
							</a-button>
						</a-space>
					</div>
				</a-table>
				<div v-if="dataSource.length>0" class="tongji">共{{this.tablePagination.total}}条记录 第{{this.tablePagination.current}}/{{this.tablePagination.pages}}页</div>
			</a-card>
			<info-alert v-if="alertFlag" :title="alertTitle" :formId="searchForm.formId" :columnList="columnList" :defaultData="defaultData" @confirmValue="confirmValue" @cancelValue="cancelValue"></info-alert>
		</div>
		<form id="fromCont" action="" method="post" style="display:none">
			<input ref="filElem" type="file" class="upload-file" @change="getFile" />
		</form>
	</div>
</template>
<script>
	import {mapState, mapMutations} from 'vuex'
	import infoAlert from '@/pages/form/independent/operation'
	import {
		CustomizeSetUpSql,
		CustomizeSetUpDetail,
		CustomizeOperationQueryList,
		CustomizeOperationDelete,
		CustomizeOperationDisable,
		CustomizeOperationRecovery,
		PowerFindPowerOperation,
		CustomizeExportData,
		CustomizeExportTemplate,
		CustomizeImportData
	} from '@/services/commentApiList'
	export default {
		name: 'userInfo',
		components: {
			infoAlert
		},
		data() {
			let self = this
			return {
				queryJsonBasicList: JSON.parse(sessionStorage.getItem('queryJsonBasicList')),		// 存储数据角色
				form: this.$form.createForm(this, {name: 'bidContentSearch' }),
				tableLoading: false,
				columns: [],		// 获取表头
				dataSource: [],		// 获取数据
				tablePagination: {		// 分页配置
					defaultCurrent: 1,		// 默认的当前页数
					defaultPageSize: 10,	// 默认的每页条数
					hideOnSinglePage: false,	// 只有一页时是否隐藏分页器
					total: 0,		// 数据总数
					pages: 0,		// 总页数
					current: 1,
					onChange:function(page, pageSize){self.operation.queryList ? self.queryListData(page, pageSize) : ''}
				},
				advanced: true,
				searchForm: {
				},
				operation: {
					add: false,
					delete: false,
					update: false,
					queryList: false,
					disable: false,
					recovery: false,
					find: false,
					table: false
				},
				alertFlag: false,
				alertTitle: '',
				defaultData: {},
				columnList: [],
				queryList: [],
				dataSetList: {},
				flag: false,
				show: false
			}
		},
		computed: {
			...mapState('setting', ['pageMinHeight']),
			...mapState('tenderSectionMsg', ['tenderSectionId']),
		},
		created: function(){
			this.findPowerOperation()
		},
		methods: {
			...mapMutations('setting', ['showloadding']),
			genFromId(){
				this.searchForm.formId = window.location.hash.split('/').slice(-1)[0].split('_')[1]
				this.handleSearch()
			},
			findPowerOperation(){
				const data = {
					id: 'dfa7c56cf9614205a1039bd46d0e72b0'
				}
				PowerFindPowerOperation(data).then(res => {
					this.handleOkLoading = false
					const data = res.data
					if(data.code == 200){
						this.operation.add = data.data.indexOf('add') > -1
						this.operation.delete = data.data.indexOf('delete') > -1
						this.operation.update = data.data.indexOf('update') > -1
						this.operation.queryList = data.data.indexOf('queryList') > -1
						this.operation.disable = data.data.indexOf('disable') > -1
						this.operation.recovery = data.data.indexOf('recovery') > -1
						this.operation.find = data.data.indexOf('find') > -1
						this.operation.table = data.data.indexOf('table') > -1
						this.genFromId()
					}else{
						this.$message.error(data.msg)
					}
				})
			},
			genDataSetList(){
				this.queryList.forEach((item) => {
					if(item.elementType == '2'){
						if(item.dataSetType == '3'){
							const data = {
								sql: item.dataSet
							}
							CustomizeSetUpSql(data).then(res => {
								const data = res.data
								if (data.code == 200) {
									this.dataSetList[item.requiredFields] = data.data
								} else {
									this.$message.error(data.msg)
								}
							})
						}
					}
					this.show = true
				})
			},
			// 获取列表
			queryListData(page, pageSize) {
				if(page){
					this.tablePagination.current = page
				}
				// 全局loading显示
				this.showloadding(true)
				const data = {
					formId: this.searchForm.formId,
					data: {
						pageNum: page == undefined?this.tablePagination.defaultCurrent:page,
						pageSize: pageSize == undefined?this.tablePagination.defaultPageSize:pageSize
					}
				}
				this.queryList.forEach((item) => {
					if(item.requiredFields.indexOf(',') > -1){
						if(item.elementType == '5'){
							data.data[item.requiredFields.split(',')[0]] = this.searchForm[item.queryName] != undefined && this.searchForm[item.queryName].length > 0 ? this.$moment(this.searchForm[item.queryName][0]).format('YYYY-MM-DD HH:mm:ss') : ''
							data.data[item.requiredFields.split(',')[1]] = this.searchForm[item.queryName] != undefined && this.searchForm[item.queryName].length > 0 ? this.$moment(this.searchForm[item.queryName][1]).format('YYYY-MM-DD HH:mm:ss') : ''
						}
						if(item.elementType == '3'){
							data.data[item.requiredFields.split(',')[0]] = this.searchForm[item.requiredFields.split(',')[0]]
							data.data[item.requiredFields.split(',')[1]] = this.searchForm[item.requiredFields.split(',')[1]]
						}
					}else{
						data.data[item.requiredFields] = this.searchForm[item.requiredFields]
					}
				})
				CustomizeOperationQueryList(data).then(res => {
					// 全局loading隐藏
					this.showloadding(false)
					const data = res.data
					if(data.code == 200){
						this.dataSource = []
						let dataSource = []
						data.data.list.forEach((item, index) => {
							let template = {}
							template.key = index
							template.number = index + 1 + (page - 1) * pageSize
							template.id = item.id
							for(let i = 1; i < this.columns.length - 1; i++){
								template[this.columns[i].dataIndex] = item[this.columns[i].dataIndex]
							}
							for(let i = 0; i < this.columnList.length; i++){
								template[this.columnList[i].columnName] = item[this.columnList[i].columnName]
							}
							template.is_delete = item.is_delete
							dataSource.push(template)
						})
						this.dataSource = dataSource
						this.tablePagination.total = data.data.total
						this.tablePagination.pages = data.data.pages
					}else{
						this.$message.error(data.msg)
					}
				})
			},
			// 展开/关闭
			toggleAdvanced() {
				this.advanced = !this.advanced
			},
			// 查询
			handleSearch() {
				const data = {
					id: this.searchForm.formId
				}
				CustomizeSetUpDetail(data).then(res => {
					// 全局loading隐藏
					this.showloadding(false)
					const data = res.data
					if(data.code == 200){
						this.columnList = []
						this.columnList = data.data.columnList
						this.queryList = []
						this.queryList = data.data.queryList
						this.columns = []
						this.columns.push({title: '序号',fixed: 'left',dataIndex: 'number'})
						data.data.returnList.forEach((item) => {
							let template = {}
							template.title = item.returnNotes
							template.dataIndex = item.returnName
							if(item.isConvert == '1'){
								if(item.dataSetType == '1'){
									template.customRender = (text) => {
										let value = ''
										this.queryJsonBasicList[item.dataSet].forEach((every) => {
											if(every.code == text){
												value = every.name
											}
										})
										return value
									}
								}
								if(item.dataSetType == '2'){
									template.customRender = (text) => {
										let value = ''
										JSON.parse(item.dataSet).forEach((every) => {
											if(every.code == text){
												value = every.name
											}
										})
										return value
									}
								}
								if(item.dataSetType == '3'){
									const data = {
										sql: item.dataSet
									}
									CustomizeSetUpSql(data).then(res => {
										const data = res.data
										if (data.code == 200) {
											template.customRender = (text) => {
												let value = ''
												data.data.forEach((every) => {
													if(every.code == text){
														value = every.name
													}
												})
												return value
											}
										} else {
											this.$message.error(data.msg)
										}
									})
								}
							}
							this.columns.push(template)
						})
						this.columns.push({title: '操作',dataIndex: 'action',fixed: 'right',scopedSlots: { customRender: 'action' }})
						this.dataSource = []
						if(this.operation.queryList){
							this.queryListData(this.tablePagination.defaultCurrent, this.tablePagination.defaultPageSize)
						}
						if(this.searchForm.formId != ''){
							this.flag = true
						}
						this.genDataSetList()
					}else{
						this.$message.error(data.msg)
					}
				})
			},
			// 重置
			handleReset() {
				let formId = this.searchForm.formId
				this.searchForm = {}
				this.searchForm.formId = formId
				this.handleSearch()
			},
			// 新增
			addBtn() {
				this.alertTitle = '新增'
				this.alertFlag = true
				this.defaultData.data = {}
			},
			// 子组件alert确认btn
			confirmValue() {
				this.alertFlag = false
				if(this.operation.queryList){
					this.queryListData(this.tablePagination.defaultCurrent, this.tablePagination.defaultPageSize)
				}
			},
			// 子组件alert取消btn
			cancelValue() {
				this.alertFlag = false
			},
			// 编辑
			editorBtn(record) {
				this.alertTitle = '编辑'
				this.alertFlag = true
				this.defaultData.data = record
			},
			// 查看
			toViewBtn(record) {
				this.alertTitle = '查看'
				this.alertFlag = true
				this.defaultData.data = record
			},
			// 删除
			deleteBtn(record) {
				let that = this
				this.$confirm({
					title: '是否删除此项？',
					okText: '删除',
					okType: 'danger',
					cancelText: '取消',
					onOk() {
						const data = {
							data: {
								id: record.id
							},
							formId: that.searchForm.formId,
						}
						CustomizeOperationDelete(data).then(res => {
							const data = res.data
							if(data.code == 200){
								if(that.operation.queryList){
									that.queryListData(that.tablePagination.defaultCurrent, that.tablePagination.defaultPageSize)
								}
							}else{
								that.$message.error(data.msg)
							}
						})
					},
					onCancel() {
						console.log('Cancel')
					},
				})
			},
			// 禁用
			disableBtn(record) {
				let that = this
				this.$confirm({
					title: '是否禁用此项？',
					okText: '禁用',
					okType: 'danger',
					cancelText: '取消',
					onOk() {
						const data = {
							data: {
								id: record.id
							},
							formId: that.searchForm.formId
						}
						CustomizeOperationDisable(data).then(res => {
							const data = res.data
							if(data.code == 200){
								if(that.operation.queryList){
									that.queryListData(that.tablePagination.defaultCurrent, that.tablePagination.defaultPageSize)
								}
							}else{
								that.$message.error(data.msg)
							}
						})
					},
					onCancel() {
						console.log('Cancel')
					},
				})
			},
			// 恢复
			restoreBtn(record) {
				let that = this
				this.$confirm({
					title: '是否恢复此项？',
					okText: '恢复',
					okType: 'danger',
					cancelText: '取消',
					onOk() {
						const data = {
							data: {
								id: record.id
							},
							formId: that.searchForm.formId,
						}
						CustomizeOperationRecovery(data).then(res => {
							const data = res.data
							if(data.code == 200){
								if(that.operation.queryList){
									that.queryListData(that.tablePagination.defaultCurrent, that.tablePagination.defaultPageSize)
								}
							}else{
								that.$message.error(data.msg)
							}
						})
					},
					onCancel() {
						console.log('Cancel')
					},
				})
			},
			// 导出excel
			expBtn(){
				const data = {
					id: this.searchForm.formId,
				}
				CustomizeExportData(data).then(res => {
					const data = res.data
					if(data.code == 200){
						// 模拟下载操作
						let a = document.createElement('a')
						a.href = `${process.env.VUE_APP_API_BASE_URL}/file/office/down/formFile?id=` + data.data
						a.click()
					}else{
						this.$message.error(data.msg)
					}
				})
			},
			// 导出模板
			tempBtn(){
				const data = {
					id: this.searchForm.formId,
				}
				CustomizeExportTemplate(data).then(res => {
					const data = res.data
					if(data.code == 200){
						// 模拟下载操作
						let a = document.createElement('a')
						a.href = `${process.env.VUE_APP_API_BASE_URL}/file/office/down/formFile?id=` + data.data
						a.click()
					}else{
						this.$message.error(data.msg)
					}
				})
			},
			// 导入数据
			impBtn() {
				this.$refs.filElem.click()
			},
			getFile() {
				var fileObj = this.$refs.filElem.files[0]
				var formData = new window.FormData()
				formData.append('file', fileObj)
				formData.append('formId', this.searchForm.formId)
				CustomizeImportData(formData).then(res => {
					// 全局loading隐藏
					this.showloadding(false)
					const data = res.data
					if(data.code == 200){
						if(this.operation.queryList){
							this.queryListData(this.tablePagination.defaultCurrent, this.tablePagination.defaultPageSize)
						}
					}else{
						this.$message.error(data.msg)
					}
				})
			}
		},
	}
</script>
<style scoped>
	.bidSubproject{
		height: 100%;
	}
	.gutter-box{
		height: 990px;
		padding-top: 0;
		min-height: 900px;
		overflow-y: auto;
	}
	.serchInfo{
		padding: 24px;
		background-color: #fff;
		position: relative;
		border: 1px solid #f0f0f0;
		margin-bottom: 10px;
	}
	
	.operator{
		margin-bottom: 10px;
	}
</style>
<style>
	/* 列表高度因padding和按钮原因被撑高 */
	.ant-table-tbody > tr > td{
		padding: 11px 14px;
	}
	/* loading样式 */
	.loaddingSpin > div > .ant-spin{
		position: fixed;
		top: 25%;
	}
	.loaddingSpin .ant-spin-blur{
		opacity: .9;
	}
	.loaddingSpin .ant-spin-blur::after{
		background: #000;
		opacity: .1;
	}
</style>