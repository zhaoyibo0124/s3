<template>
	<div class="bidSubproject" :style="`min-height: ${pageMinHeight}px`">
		<div class="gutter-box">
			<a-card v-if="operation.table">
				<a-table :columns="columns" :dataSource="dataSource" :loading="tableLoading"
					:rowKey="(record) => { return record.id }" :pagination="tablePagination">
					<div slot="action" slot-scope="text, record">
						<a-space>
							<a-button type="link" @click="toDownBtn(record)">
								下载
							</a-button>
						</a-space>
					</div>
				</a-table>
			</a-card>
		</div>
	</div>
</template>
<script>
import { mapState, mapMutations } from 'vuex'
import {
	exaUseQueryListApi,
	PowerFindPowerOperation
} from '@/services/commentApiList'
export default {
	name: 'usePage',
	data() {
		let self = this
		return {
			queryJsonBasicList: JSON.parse(sessionStorage.getItem('queryJsonBasicList')),
			tableLoading: false,
			columns: [
				{
					title: '序号',
					key: 'index',
					dataIndex: 'index',
					customRender: (text, record, index) => `${index + 1}`,
					width: 100
				},
				{
					title: '项目规模',
					dataIndex: 'projectScale',
					customRender: (text, record) => <span>{this.queryJsonBasicList.projectScale.filter(item => item.code == record.projectScale).map(item =>
						item.name)}</span>,
					width: 100
				},
				{
					title: '项目类别',
					dataIndex: 'projectCategory',
					customRender: (text, record) => <span>{this.queryJsonBasicList.projectCategory.filter(item => item.code == record.projectCategory).map(item =>
						item.name)}</span>,
					width: 120
				},
				{
					title: '项目类型',
					dataIndex: 'projectType',
					customRender: (text, record) => <span>{this.queryJsonBasicList.projectType.filter(item => item.code == record.projectType).map(item =>
						item.name)}</span>,
					width: 140
				},
				{
					title: '终止规则',
					dataIndex: 'terminationRule',
					ellipsis: true,
					width: 180,
					customRender: (text, record) => <a-tooltip placement="topLeft" title={record.terminationRule}>{record.terminationRule}</a-tooltip>
				},
				{
					title: '范本名称',
					dataIndex: 'templateName',
					ellipsis: true,
					width: 180,
					customRender: (text, record) => <a-tooltip placement="topLeft" title={record.templateName}>{record.templateName}</a-tooltip>
				},
				{
					title: '创建人',
					dataIndex: 'createUser',
				},
				{
					title: '操作',
					dataIndex: 'action',
					fixed: 'right',
					scopedSlots: { customRender: 'action' },
				}
			],		// 获取表头
			dataSource: [],			// 获取数据
			tablePagination: {		    // 分页配置
				defaultCurrent: 1,		 // 默认的当前页数
				defaultPageSize: 10,	  // 默认的每页条数
				showSizeChanger: true,	  // 是否可以快速跳转至某页
				showQuickJumper: true,	  // 是否可以改变 pageSize
				hideOnSinglePage: false,  // 只有一页时是否隐藏分页器
				total: 0,		// 数据总数
				pages: 0,		// 总页数
				current: 1,
				onChange: function (page, pageSize) { self.operation.queryList ? self.queryListData(page, pageSize) : '' }
			},
			advanced: true,
			searchForm: {
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
	},
	created: function () {
		this.findPowerOperation()
	},
	methods: {
		...mapMutations('setting', ['showloadding']),
		findPowerOperation() {
			const data = {
				id: 'aa5a597d9df744e699986ab0737d305c'
			}
			PowerFindPowerOperation(data).then(res => {
				this.handleOkLoading = false
				const data = res.data
				if (data.code == 200) {
					this.operation.add = data.data.indexOf('add') > -1
					this.operation.delete = data.data.indexOf('delete') > -1
					this.operation.update = data.data.indexOf('update') > -1
					this.operation.queryList = data.data.indexOf('queryList') > -1
					this.operation.disable = data.data.indexOf('disable') > -1
					this.operation.recovery = data.data.indexOf('recovery') > -1
					this.operation.find = data.data.indexOf('find') > -1
					this.operation.table = data.data.indexOf('table') > -1
					if (this.operation.queryList) {
						this.queryListData(this.tablePagination.defaultCurrent, this.tablePagination.defaultPageSize)
					}
				} else {
					this.$message.error(data.msg)
				}
			})
		},
		// 获取列表
		queryListData(page, pageSize) {
			if (page) {
				this.tablePagination.current = page
			}
			// 全局loading显示
			this.showloadding(true)
			const data = {
				pageNo: page == undefined ? this.tablePagination.defaultCurrent : page,
				pageSize: pageSize == undefined ? this.tablePagination.defaultPageSize : pageSize
			}
			exaUseQueryListApi(data).then(res => {
				// 全局loading隐藏
				this.showloadding(false)
				const data = res.data
				if (data.code == 200) {
					this.dataSource = data.data.list
					this.tablePagination.total = data.data.total
					this.tablePagination.pages = data.data.pages
				} else {
					this.$message.error(data.msg)
				}
			})
		},
		// 下载
		toDownBtn(record) {
			const BASE_URL = process.env.VUE_APP_API_BASE_URL;
			// 模拟下载操作
			let a = document.createElement('a')
			a.href = `${BASE_URL}/examine/examine/exaTemplatePreparation/downTemplateFile?id=${record.id}`
			a.click()
		}
	},
}
</script>
<style scoped>
.bidSubproject {
	height: 100%;
}

.gutter-box {
	height: 990px;
	padding-top: 0;
	min-height: 900px;
	overflow-y: auto;
}

.serchInfo {
	padding: 24px;
	background-color: #fff;
	position: relative;
	border: 1px solid #f0f0f0;
	margin-bottom: 10px;
}

.operator {
	margin-bottom: 10px;
}
</style>
<style>
/* 列表高度因padding和按钮原因被撑高 */
.ant-table-tbody>tr>td {
	padding: 11px 14px;
}

/* loading样式 */
.loaddingSpin>div>.ant-spin {
	position: fixed;
	top: 25%;
}

.loaddingSpin .ant-spin-blur {
	opacity: .9;
}

.loaddingSpin .ant-spin-blur::after {
	background: #000;
	opacity: .1;
}
</style>