<template>
	<div class="bidSubproject" :style="`min-height: ${pageMinHeight}px`">
		<div class="gutter-box">
			<a-card>
				<a-space>
					<a-button class="btn-create" v-if="flag" @click="expBtn">导出excel</a-button>
				</a-space>
				<div class="tableTitle" v-if="flag">
					{{title}}
				</div>
				<a-table
					:columns="columns"
					:dataSource="dataSource"
					:loading="tableLoading"
					:pagination="tablePagination"
					style="margin-top: 10px;"
					:scroll="{x: 1200}"
				>
				</a-table>
			</a-card>
		</div>
	</div>
</template>
<script>
	import {mapState, mapMutations} from 'vuex'
	import {
		StatisticsFormShow,
		StatisticsFormExport
	} from '@/services/commentApiList'
	export default {
		name: 'userInfo',
		components: {
		},
		data() {
			return {
				form: this.$form.createForm(this, {name: 'bidContentSearch' }),
				tableLoading: false,
				columns: [],		// 获取表头
				dataSource: [],		// 获取数据
				tablePagination: false,
				advanced: true,
				searchForm: {
					formId: ''
				},
				title: '',
				formList: [],
				flag: false,
				show: false
			}
		},
		computed: {
			...mapState('setting', ['pageMinHeight']),
			...mapState('tenderSectionMsg', ['tenderSectionId']),
		},
		created: function(){
			this.genFromId()
		},
		methods: {
			...mapMutations('setting', ['showloadding']),
			genFromId(){
				this.searchForm.formId = window.location.hash.split('/').slice(-1)[0].split('_')[1]
				this.handleSearch()
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
				StatisticsFormShow(data).then(res => {
					// 全局loading隐藏
					this.showloadding(false)
					const data = res.data
					if(data.code == 200){
						this.title = ''
						this.title = data.data.formName
						this.columns = []
						this.columns.push({title: '序号',fixed: 'left',dataIndex: 'number'})
						data.data.sqlDTO.sqlTitle.forEach((item) => {
							let keys = Object.keys(item)
							let values = Object.values(item)
							keys.forEach((item1, index) =>{
								let template = {}
								template.title = values[index]
								template.dataIndex = item1
								this.columns.push(template)
							})
						})
						this.dataSource = []
						data.data.sqlDTO.sqlContent.forEach((item, index) => {
							item.number = index + 1
							this.dataSource.push(item)
						})
						if(this.searchForm.formId != ''){
							this.flag = true
						}
					}else{
						this.$message.error(data.msg)
					}
				})
				
			},
			// 重置
			handleReset() {
				// 清空表单
                this.flag = false
				this.searchForm.formId = undefined
				this.columns = []
				this.dataSource = []
				this.searchForm = {}
				this.title = ''
				this.show = false
			},
			// 导出excel
			expBtn(){
				const data = {
					id: this.searchForm.formId,
				}
				StatisticsFormExport(data).then(res => {
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
			}
		},
	}
</script>
<style scoped>
	.tableTitle{
		width: 100%;
		height: 60px;
		line-height: 60px;
		text-align: center;
		font-size: 24px;
		font-family: Microsoft YaHei;
		font-weight: bold;
		color: #424754;
	}
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