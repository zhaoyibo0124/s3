<template>
	<div>
		<a-row style="background-color: #fff;">
			<a-col class="gutter-row" :span="23">
				<a-space class="header" direction="vertical" size="0" :style="unfold?'height:auto':'height:50px'">
					<p><span class="headertitle">标段名称：<span v-text="sectionName"></span></span></p>
					<div v-if="unfold">
						<p><span>标段编号：</span><span v-text="sectionNum"></span></p>
					</div>
					<div class="btn-box">
						<a-space>
							<a-button style="margin-right: 8px" @click="viewTenderDocuments()">
								查看招标文件
							</a-button>
							<!-- <a-button style="margin-right: 8px" @click="vewClarificationFile()">
								查看澄清文件
							</a-button> -->
						</a-space>
					</div>
				</a-space>
			</a-col>
			<a-col class="gutter-row" :span="1">
				<div style="margin: 14px 15px 0 0;text-align: right;" @click="unfoldBtn()">
					<a-icon :type="unfold?'up':'down'" style="color: #1890ff;" />
				</div>
			</a-col>
		</a-row>
	</div>
</template>
<script>
	import {mapState} from 'vuex'
	import {
		TendertendList,
	} from '@/services/bidEvaluationPrepare'
	export default {
		name: 'roleManagement',
		data () {
			return {
				sectionNum: '',		// 标段编号
				sectionName: '',		// 标段名称
				evalMethod: '',		// 是否选择评标办法
				unfold: false
			}
		},
		computed: {
			...mapState('setting', ['pageMinHeight']),
			...mapState('tenderSectionMsg', ['tenderSectionId']),
		},
		created: function(){
			this.tendertendList()
		},
		methods: {
			// 获取标段信息
			tendertendList() {
				const data = {
					tenderSectionId: this.tenderSectionId !=''?this.tenderSectionId:sessionStorage.getItem('tenderSectionId')		// 标段id
				}
				TendertendList(data).then(res => {
					const data = res.data
					if(data.code == 200){
						this.sectionNum = data.data.list[0].tenderSectionNo
						this.sectionName = data.data.list[0].tenderSectionName
						this.evalMethod = data.data.list[0].evalMethod
						this.$emit('isevalMethod', this.evalMethod, data.data.list[0])
					}else{
						this.$message.error(data.msg)
					}
				})
			},
			// 查看招标文件
			viewTenderDocuments() {
				this.$message.info('查看招标文件')
			},
			// 查看澄清文件
			// vewClarificationFile() {
			// 	this.$message.info('查看澄清文件')
			// },
			// 展开
			unfoldBtn() {
				this.unfold = !this.unfold
			},
		},
		components: {
			
		},
	}
</script>
<style scoped>
	.header p{
		margin: 0;
		line-height: 50px;
		margin-left: 15px;
		font-size: 16px;
		position: relative;
	}
	.header p .headertitle{
		font-weight: bold;
	}
	.btn-box{
		position: absolute;
		right: 0px;
		top: 10px;
	}
</style>
