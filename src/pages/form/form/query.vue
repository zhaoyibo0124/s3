<template>
	<div class="bidSubproject" :style="`min-height: ${pageMinHeight}px`">
		<div class="gutter-box">
			<div class="serchInfo">
				<div :class="advanced ? 'search' : null" v-if="operation.find">
					<a-form-model layout="inline" ref="ruleForm" :model="searchForm">
						<a-form-model-item label="表单名称">
							<a-input placeholder="请输入" v-model="searchForm.formName" style="width: 174px;" />
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
				<a-space>
					<a-button type="primary" @click="addBtn" v-if="operation.add">+ 新增</a-button>
				</a-space>
				<a-table
					:columns="columns"
					:dataSource="dataSource"
					:loading="tableLoading"
					:pagination="tablePagination"
					style="margin-top: 10px;"
					:scroll="{x: 1200}"
				>
					<template slot="buildOneselfType" slot-scope="text, record">
						<div v-for="(item,index) in queryJsonBasicList.yesNoType" :key="index">
							<span v-if="item.code == record.isBuildOneself">{{item.name}}</span>
						</div>
					</template>
					<template slot="viewQueryType" slot-scope="text, record">
						<div v-for="(item,index) in queryJsonBasicList.yesNoType" :key="index">
							<span v-if="item.code == record.isViewQuery">{{item.name}}</span>
						</div>
					</template>
					<div slot="action" slot-scope="text, record">
						<a-space>
							<a-button type="link" @click="columnBtn(record)" v-if="operation.add">
								字 段
							</a-button>
							<a-button type="link" @click="queryBtn(record)" v-if="operation.add">
								查 询
							</a-button>
							<a-button type="link" @click="returnBtn(record)" v-if="operation.add">
								返 回
							</a-button>
							<a-button type="link" @click="editorBtn(record)" v-if="operation.add">
								编 辑
							</a-button>
							<a-button type="link" @click="disableBtn(record)" v-if="operation.disable && record.isDelete == '2'">
								禁 用
							</a-button>
							<a-button type="link" @click="restoreBtn(record)" v-if="operation.recovery && record.isDelete == '1'">
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
			<info-alert v-if="alertFlag" :title="alertTitle" :defaultData="defaultData" @confirmValue="confirmValue" @cancelValue="cancelValue"></info-alert>
		</div>
	</div>
</template>
<script>
	import {mapState, mapMutations} from 'vuex'
	import infoAlert from '@/pages/form/form/operation'
	import {
		CustomizeFormDelete,
		CustomizeFormDisable,
		CustomizeFormRecovery,
		CustomizeFormQueryList,
		PowerFindPowerOperation
	} from '@/services/commentApiList'
	// 获取表头
	const columns = [
		{
			title: '序号',
			fixed: 'left',
			dataIndex: 'serialNum',
		},
		{
			title: '表单名称',
			dataIndex: 'formName',
		},
		{
			title: '表名称',
			dataIndex: 'tableName',
		},
        {
			title: '是否独立表名称',
			dataIndex: 'isBuildOneself',
			scopedSlots: {customRender: 'buildOneselfType'},
		},
		{
			title: '是否使用视图查询',
			dataIndex: 'isViewQuery',
			scopedSlots: {customRender: 'viewQueryType'},
		},
		{
			title: '表单简介',
			dataIndex: 'formContent',
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
			// StandardTable,
			infoAlert
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
					onChange:function(page, pageSize){self.operation.queryList ? self.queryListData(page, pageSize) : ''}
				},
				advanced: true,
				searchForm: {
                    formName: '',
                    isDelete: undefined
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
					id: '3d5316354d074623bac73d47fe26dd62'
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
						if(this.operation.queryList){
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
                    formName: this.searchForm.formName,
                    isDelete: this.searchForm.isDelete,
					pageNo: page == undefined?this.tablePagination.defaultCurrent:page,
					pageSize: pageSize == undefined?this.tablePagination.defaultPageSize:pageSize
				}
				CustomizeFormQueryList(data).then(res => {
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
							template.formName = item.formName
							template.tableName = item.tableName
							template.formContent = item.formContent
							template.isBuildOneself = item.isBuildOneself
							template.isViewQuery = item.isViewQuery
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
				if(this.operation.queryList){
					this.queryListData(this.tablePagination.defaultCurrent, this.tablePagination.defaultPageSize)
				}
			},
			// 重置
			handleReset() {
				// 清空表单
                this.searchForm.formName = ''
                this.searchForm.isDelete = undefined
				if(this.operation.queryList){
					this.queryListData(this.tablePagination.defaultCurrent, this.tablePagination.defaultPageSize)
				}
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
							id: record.id
						}
						CustomizeFormDelete(data).then(res => {
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
							id: record.id
						}
						CustomizeFormDisable(data).then(res => {
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
							id: record.id
						}
						CustomizeFormRecovery(data).then(res => {
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
			// 字段
			columnBtn(record) {
				this.$router.push('/form/customizeColumn?id=' + record.id)
			},
			// 查询
			queryBtn(record) {
				this.$router.push('/form/customizeQuery?id=' + record.id)
			},
			// 返回
			returnBtn(record) {
				this.$router.push('/form/customizeReturn?id=' + record.id)
			},
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