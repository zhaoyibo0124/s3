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
			<a-form-model-item label="所属省份" prop="provinceCode">
				<a-select v-model="form.provinceCode" placeholder="请选择" :disabled="title == '查看'" show-search
					option-filter-prop="children">
					<a-select-option v-for="(item,index) in provinceList" :value="item.value" :key="index">
						{{item.key}}
					</a-select-option>
				</a-select>
			</a-form-model-item>
			<a-form-model-item label="市区编码" prop="cityCode">
				<a-input v-model="form.cityCode" placeholder="请输入" :disabled="title == '查看'" />
			</a-form-model-item>
			<a-form-model-item label="市区名称" prop="cityName">
				<a-input v-model="form.cityName" placeholder="请输入" :disabled="title == '查看'" />
			</a-form-model-item>
			<a-form-model-item label="市区排序" prop="citySort">
				<a-input-number style="width: 100%" :min="0" :max="9999" v-model="form.citySort" placeholder="请输入" :disabled="title == '查看'" />
			</a-form-model-item>
			<a-form-model-item label="市区简称" prop="cityAlias">
				<a-input v-model="form.cityAlias" placeholder="请输入" :disabled="title == '查看'" />
			</a-form-model-item>
			<a-form-model-item label="市区经度" prop="cityLnt">
				<a-input v-model="form.cityLnt" placeholder="请输入" :disabled="title == '查看'" />
			</a-form-model-item>
			<a-form-model-item label="市区纬度" prop="cityLat">
				<a-input v-model="form.cityLat" placeholder="请输入" :disabled="title == '查看'" />
			</a-form-model-item>
			<a-form-model-item label="经纬度查询地址" prop="">
				<a style="color: red;" href="https://jingweidu.bmcx.com/" target="_blank">https://jingweidu.bmcx.com/</a>
			</a-form-model-item>
		</a-form-model>
	</a-modal>
</template>
<script>
	import {
		CityAdd,
		CityUpdate,
		ProvinceQueryList
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
					provinceCode: this.defaultData.data.provinceCode?this.defaultData.data.provinceCode:undefined,
					cityCode: this.defaultData.data.cityCode?this.defaultData.data.cityCode:'',
					cityName: this.defaultData.data.cityName?this.defaultData.data.cityName:'',
					cityAlias: this.defaultData.data.cityAlias?this.defaultData.data.cityAlias:'',
					cityLnt: this.defaultData.data.cityLnt?this.defaultData.data.cityLnt:'',
					cityLat: this.defaultData.data.cityLat?this.defaultData.data.cityLat:'',
					citySort: this.defaultData.data.citySort?this.defaultData.data.citySort:'',
				},
				rules: {
					provinceCode: [
						{required: true, message: '请选择所属省份', trigger: 'blur'},
					],
					cityCode: [
						{required: true, message: '请输入市区编号', trigger: 'blur'},
					],
					cityName: [
						{required: true, message: '请输入市区名称', trigger: 'blur'},
					],
					citySort: [
						{required: true, message: '请输入市区排序', trigger: 'blur'},
					],
				},
				provinceList: []
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
			this.queryProvinceList()
		},
		beforeDestroy() {
			this.removeMove()
			window.removeEventListener('mouseup', this.removeUp, false)
		},
    methods: {
			queryProvinceList() {
				const data = {
					pageNo: -1,
					pageSize: 10
				}
				ProvinceQueryList(data).then(res => {
					const data = res.data
					if (data.code == 200) {
						this.provinceList = []
						let provinceList = []
						data.data.list.forEach(item => {
							let template = {}
							template.key = item.provinceName
							template.value = item.provinceCode
							provinceList.push(template)
						})
						this.provinceList = provinceList
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
								provinceCode: this.form.provinceCode,
								cityCode: this.form.cityCode,
								cityName: this.form.cityName,
								cityAlias: this.form.cityAlias,
								cityLnt: this.form.cityLnt,
								cityLat: this.form.cityLat,
								citySort: this.form.citySort,
							}
							CityAdd(data).then(res => {
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
								provinceCode: this.form.provinceCode,
								cityCode: this.form.cityCode,
								cityName: this.form.cityName,
								cityAlias: this.form.cityAlias,
								cityLnt: this.form.cityLnt,
								cityLat: this.form.cityLat,
								citySort: this.form.citySort,
							}
							CityUpdate(data).then(res => {
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