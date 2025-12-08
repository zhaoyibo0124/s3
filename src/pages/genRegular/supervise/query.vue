<template>
	<div class="bidSubproject" :style="`min-height: ${pageMinHeight}px`">
		<div class="gutter-box">
			<div class="serchInfo">
				<div :class="advanced ? 'search' : null" v-if="operation.find">
					<a-form-model layout="inline" ref="ruleForm" :model="searchForm">
						<a-form-model-item label="数据状态">
							<a-select v-model="searchForm.isDelete" placeholder="请选择" style="width: 174px;">
								<a-select-option v-for="(item, index) in queryJsonBasicList.dataType" :value="item.code"
									:key="index">
									{{ item.name }}
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
				<a-space style="margin-bottom: 18px;">
					<a-button type="primary" @click="addBtn" v-if="operation.add">+ 新增</a-button>
				</a-space>
				<a-table :columns="columns" :dataSource="dataSource" :loading="tableLoading"
					:rowKey="(record) => { return record.id }" :pagination="tablePagination">
					<div slot="action" slot-scope="text, record">
						<a-space>
							<a-button type="link" @click="editorBtn(record)" v-if="operation.update">
								编 辑
							</a-button>
							<a-button type="link" @click="disableBtn(record)"
								v-if="operation.disable && record.isDelete == '2'">
								禁 用
							</a-button>
							<a-button type="link" @click="restoreBtn(record)"
								v-if="operation.recovery && record.isDelete == '1'">
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
			</a-card>
			<info-alert v-if="alertFlag" :title="alertTitle" :defaultData="defaultData" @confirmValue="confirmValue"
				@cancelValue="cancelValue"></info-alert>
		</div>
	</div>
</template>
<script>
import { mapState, mapMutations } from 'vuex'
import infoAlert from './operation.vue'
import {
	superviseDeleteApi,
	superviseDisableApi,
	superviseRecoveryApi,
	superviseQueryListApi,
	PowerFindPowerOperation
} from '@/services/commentApiList'
export default {
	name: 'supervisePage',
	components: {
		infoAlert
	},
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
					title: '项目分类',
					dataIndex: 'projectClassify',
					customRender: (text, record) => <span>{this.queryJsonBasicList.projectClassify.filter(item => item.code == record.projectClassify).map(item =>
                        item.name)}</span>
				},
				{
					title: '监督关键字',
					dataIndex: 'superviseKey',
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
				isDelete: this.searchForm.isDelete,
				pageNo: page == undefined ? this.tablePagination.defaultCurrent : page,
				pageSize: pageSize == undefined ? this.tablePagination.defaultPageSize : pageSize
			}
			superviseQueryListApi(data).then(res => {
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
		// 展开/关闭
		toggleAdvanced() {
			this.advanced = !this.advanced
		},
		// 查询
		handleSearch() {
			if (this.operation.queryList) {
				this.queryListData(this.tablePagination.defaultCurrent, this.tablePagination.defaultPageSize)
			}
		},
		// 重置
		handleReset() {
			// 清空表单
			this.searchForm.isDelete = undefined
			if (this.operation.queryList) {
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
			if (this.operation.queryList) {
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
					superviseDeleteApi(data).then(res => {
						const data = res.data
						if (data.code == 200) {
							if (that.operation.queryList) {
								that.queryListData(that.tablePagination.defaultCurrent, that.tablePagination.defaultPageSize)
							}
						} else {
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
					superviseDisableApi(data).then(res => {
						const data = res.data
						if (data.code == 200) {
							if (that.operation.queryList) {
								that.queryListData(that.tablePagination.defaultCurrent, that.tablePagination.defaultPageSize)
							}
						} else {
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
					superviseRecoveryApi(data).then(res => {
						const data = res.data
						if (data.code == 200) {
							if (that.operation.queryList) {
								that.queryListData(that.tablePagination.defaultCurrent, that.tablePagination.defaultPageSize)
							}
						} else {
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