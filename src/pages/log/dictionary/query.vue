<template>
	<div class="bidSubproject" :style="`min-height: ${pageMinHeight}px`">
		<div class="gutter-box">
			<div class="serchInfo">
				<div :class="advanced ? 'search' : null" v-if="operation.find">
					<a-form-model layout="inline" ref="ruleForm" :model="searchForm">
						<a-form-model-item label="操作表">
							<a-input placeholder="请输入" v-model="searchForm.operationTable" style="width: 174px;" />
						</a-form-model-item>
                        <a-form-model-item label="操作类型">
                            <a-select v-model="searchForm.operationType" placeholder="请选择" style="width: 174px;">
								<a-select-option v-for="(item,index) in queryJsonBasicList.operationType" :value="item.code" :key="index">
									{{item.name}}
								</a-select-option>
							</a-select>
						</a-form-model-item>
                        <a-form-model-item label="数据状态">
                            <a-select v-model="searchForm.isDelete" placeholder="请选择" style="width: 174px;">
								<a-select-option v-for="(item,index) in queryJsonBasicList.dataType" :value="item.code" :key="index">
									{{item.name}}
								</a-select-option>
							</a-select>
						</a-form-model-item>
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
							<a-button type="link" v-if="record.isReset == 2 && record.operationType != 1" @click="recoveryBtn(record)">
								还 原
							</a-button>
							<a-button type="link" v-if="record.isReset == 1 && record.operationType != 1" @click="reductionBtn(record)">
								恢 复
							</a-button>
						</a-space>
					</div>
					<template slot="operationType" slot-scope="text, record">
						<div v-for="(item,index) in queryJsonBasicList.operationType" :key="index">
							<span v-if="item.code == record.operationType">{{item.name}}</span>
						</div>
					</template>
					<template slot="resetType" slot-scope="text, record">
						<div v-for="(item,index) in queryJsonBasicList.resetType" :key="index">
							<span v-if="item.code == record.isReset">{{item.name}}</span>
						</div>
					</template>
					<template slot="operationSql" slot-scope="text, record">
						<span v-if="record.operationType == 1">{{record.operationAddSql}}</span>
						<span v-if="record.operationType == 2">{{record.operationUpdateSql}}</span>
						<span v-if="record.operationType == 3">{{record.operationDeleteSql}}</span>
					</template>
				</a-table>
				<div v-if="dataSource.length>0" class="tongji">共{{this.tablePagination.total}}条记录 第{{this.tablePagination.current}}/{{this.tablePagination.pages}}页</div>
			</a-card>
		</div>
	</div>
</template>
<script>
	import {mapState, mapMutations} from 'vuex'
	import {
		PowerFindPowerOperation,
		LogDictionaryQueryList,
		LogRecovery,
		LogReduction
	} from '@/services/commentApiList'
	// 获取表头
	const columns = [
		{
			title: '序号',
			fixed: 'left',
			dataIndex: 'serialNum',
		},
		{
			title: '操作表',
			dataIndex: 'operationTable',
		},
		{
			title: '操作模型',
			dataIndex: 'operationModel',
		},
        {
			title: '操作类型',
			dataIndex: 'operationType',
			scopedSlots: {customRender: 'operationType'},
		},
		{
			title: '操作组',
			dataIndex: 'operationGroup',
		},
		{
			title: '是否恢复',
			dataIndex: 'isReset',
			scopedSlots: {customRender: 'resetType'},
		},
		{
			title: '操作记录SQL',
			scopedSlots: {customRender: 'operationSql'},
		},
		{
			title: '操作恢复SQL',
			dataIndex: 'operationResetSql',
		},
		{
			title: '操作时间',
			dataIndex: 'createTime',
		},
		{
			title: '操作',
			dataIndex: 'action',
			fixed: 'right',
			scopedSlots: {customRender: 'action'},
		}
	]
	export default {
		name: 'userInfo',
		components: {
		},
		data() {
			let self = this
			return {
				queryJsonBasicList: JSON.parse(sessionStorage.getItem('queryJsonBasicList')),
				form: this.$form.createForm(this, {name: 'bidContentSearch' }),
				tableLoading: false,
				columns: columns,		// 获取表头
				dataSource: [],		// 获取数据
				tablePagination: {		// 分页配置
					defaultCurrent: 1,		// 默认的当前页数
					defaultPageSize: 10,	// 默认的每页条数
					hideOnSinglePage: false,	// 只有一页时是否隐藏分页器
					total: 0,		// 数据总数
					pages: 0,		// 总页数
					current: 1,
					onChange:function(page, pageSize){self.operation.table ? self.queryListData(page, pageSize) : ''}
				},
				advanced: true,
				searchForm: {
                    operationTable: '',
                    operationType: undefined,
                    isDelete: undefined
				},
				operation: {
					find: false,
					table: false
				},
				alertFlag: false,
				alertTitle: '',
				defaultData: {},
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
			findPowerOperation(){
				const data = {
					id: 'd4baf389cec340989cef7aa63c60fb37'
				}
				PowerFindPowerOperation(data).then(res => {
					this.handleOkLoading = false
					const data = res.data
					if(data.code == 200){
						this.operation.find = data.data.indexOf('find') > -1
						this.operation.table = data.data.indexOf('table') > -1
						if(this.operation.table){
							this.queryListData(this.tablePagination.defaultCurrent, this.tablePagination.defaultPageSize)
						}
					}else{
						this.$message.error(data.msg)
					}
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
                    operationTable: this.searchForm.operationTable,
                    operationType: this.searchForm.operationType,
                    isDelete: this.searchForm.isDelete,
					pageNo: page == undefined?this.tablePagination.defaultCurrent:page,
					pageSize: pageSize == undefined?this.tablePagination.defaultPageSize:pageSize
				}
				LogDictionaryQueryList(data).then(res => {
					// 全局loading隐藏
					this.showloadding(false)
					const data = res.data
					if(data.code == 200){
						this.dataSource = []
						let dataSource = []
						data.data.list.forEach((item, index) => {
							let template = {}
							template.key = index
                            template.serialNum = index + 1
                            template.id = item.id
							template.operationTable = item.operationTable
							template.operationModel = item.operationModel
							template.operationType = item.operationType
							template.operationGroup = item.operationGroup
							template.isReset = item.isReset
							template.operationAddSql = item.operationAddSql
							template.operationDeleteSql = item.operationDeleteSql
							template.operationUpdateSql = item.operationUpdateSql
							template.operationResetSql = item.operationResetSql
							template.createTime = item.createTime
							template.createUser = item.createUser
							template.createUserName = item.createUserName
							template.updateTime = item.updateTime
							template.updateUser = item.updateUser
							template.UpdateUserName = item.UpdateUserName
							template.isDelete = item.isDelete
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
				if(this.operation.table){
					this.queryListData(this.tablePagination.defaultCurrent, this.tablePagination.defaultPageSize)
				}
			},
			// 重置
			handleReset() {
				// 清空表单
                this.searchForm.operationTable = ''
                this.searchForm.operationType = undefined
                this.searchForm.isDelete = undefined
				if(this.operation.table){
					this.queryListData(this.tablePagination.defaultCurrent, this.tablePagination.defaultPageSize)
				}
			},
			// 还原
			recoveryBtn(record) {
				let that = this
				this.$confirm({
					title: '是否还原此项？',
					okText: '还原',
					okType: 'danger',
					cancelText: '取消',
					onOk() {
						const data = {
							group: record.operationGroup
						}
						LogRecovery(data).then(res => {
							const data = res.data
							if(data.code == 200){
								if(that.operation.table){
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
			reductionBtn(record) {
				let that = this
				this.$confirm({
					title: '是否恢复此项？',
					okText: '恢复',
					okType: 'danger',
					cancelText: '取消',
					onOk() {
						const data = {
							group: record.operationGroup
						}
						LogReduction(data).then(res => {
							const data = res.data
							if(data.code == 200){
								if(that.operation.table){
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