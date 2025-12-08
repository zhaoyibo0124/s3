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
				<a-select v-model="form.provinceCode" @change="queryCityList(form.provinceCode, true)" placeholder="请选择" :disabled="title == '查看'" show-search
					option-filter-prop="children">
					<a-select-option v-for="(item,index) in provinceList" :value="item.value" :key="index">
						{{item.key}}
					</a-select-option>
				</a-select>
			</a-form-model-item>
			<a-form-model-item label="所属市区" prop="cityCode">
				<a-select v-model="form.cityCode" placeholder="请选择" :disabled="title == '查看'" show-search
					option-filter-prop="children">
					<a-select-option v-for="(item,index) in cityList" :value="item.value" :key="index">
						{{item.key}}
					</a-select-option>
				</a-select>
			</a-form-model-item>
			<a-form-model-item label="地区编码" prop="areaCode">
				<a-input v-model="form.areaCode" placeholder="请输入" :disabled="title == '查看'" />
			</a-form-model-item>
			<a-form-model-item label="地区名称" prop="areaName">
				<a-input v-model="form.areaName" placeholder="请输入" :disabled="title == '查看'" />
			</a-form-model-item>
			<a-form-model-item label="地区排序" prop="areaSort">
				<a-input-number style="width: 100%" :min="0" :max="9999" v-model="form.areaSort" placeholder="请输入" :disabled="title == '查看'" />
			</a-form-model-item>
			<a-form-model-item label="地区简称" prop="areaAlias">
				<a-input v-model="form.areaAlias" placeholder="请输入" :disabled="title == '查看'" />
			</a-form-model-item>
			<a-form-model-item label="地区经度" prop="areaLnt">
				<a-input v-model="form.areaLnt" placeholder="请输入" :disabled="title == '查看'" />
			</a-form-model-item>
			<a-form-model-item label="地区纬度" prop="areaLat">
				<a-input v-model="form.areaLat" placeholder="请输入" :disabled="title == '查看'" />
			</a-form-model-item>
			<a-form-model-item label="经纬度查询地址" prop="">
				<a style="color: red;" href="https://jingweidu.bmcx.com/" target="_blank">https://jingweidu.bmcx.com/</a>
			</a-form-model-item>
		</a-form-model>
	</a-modal>
</template>
<script>
	import {
		AreaAdd,
		AreaUpdate,
		ProvinceQueryList,
		CityQueryList
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
					cityCode: this.defaultData.data.cityCode?this.defaultData.data.cityCode:undefined,
					areaCode: this.defaultData.data.areaCode?this.defaultData.data.areaCode:'',
					areaName: this.defaultData.data.areaName?this.defaultData.data.areaName:'',
					areaAlias: this.defaultData.data.areaAlias?this.defaultData.data.areaAlias:'',
					areaLnt: this.defaultData.data.areaLnt?this.defaultData.data.areaLnt:'',
					areaLat: this.defaultData.data.areaLat?this.defaultData.data.areaLat:'',
					areaSort: this.defaultData.data.areaSort?this.defaultData.data.areaSort:'',
				},
				rules: {
					provinceCode: [
						{required: true, message: '请选择所属省份', trigger: 'blur'},
					],
					cityCode: [
						{required: true, message: '请选择所属市区', trigger: 'blur'},
					],
					areaCode: [
						{required: true, message: '请输入地区编号', trigger: 'blur'},
					],
					areaName: [
						{required: true, message: '请输入地区名称', trigger: 'blur'},
					],
					areaSort: [
						{required: true, message: '请输入地区排序', trigger: 'blur'},
					],
				},
				provinceList: [],
				cityList: []
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
			if(this.title != '新增'){
				this.queryNowList()
			}
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
			queryCityList(provinceCode, flag) {
				if(flag){
					this.form.cityCode = undefined
				}
				const data = {
					pageNo: -1,
					pageSize: 10,
					provinceCode: provinceCode
				}
				CityQueryList(data).then(res => {
					const data = res.data
					if (data.code == 200) {
						this.cityList = []
						let cityList = []
						data.data.list.forEach(item => {
							let template = {}
							template.key = item.cityName
							template.value = item.cityCode
							cityList.push(template)
						})
						this.cityList = cityList
					} else {
						this.$message.error(data.msg)
					}
				})
			},
			queryNowList() {
				const data = {
					pageNo: -1,
					pageSize: 10,
					cityCode: this.form.cityCode
				}
				CityQueryList(data).then(res => {
					const data = res.data
					if (data.code == 200) {
						this.form.provinceCode = data.data.list[0].provinceCode
						this.queryCityList(this.form.provinceCode, false)
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
								cityCode: this.form.cityCode,
								areaCode: this.form.areaCode,
								areaName: this.form.areaName,
								areaAlias: this.form.areaAlias,
								areaLnt: this.form.areaLnt,
								areaLat: this.form.areaLat,
								areaSort: this.form.areaSort,
							}
							AreaAdd(data).then(res => {
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
								cityCode: this.form.cityCode,
								areaCode: this.form.areaCode,
								areaName: this.form.areaName,
								areaAlias: this.form.areaAlias,
								areaLnt: this.form.areaLnt,
								areaLat: this.form.areaLat,
								areaSort: this.form.areaSort,
							}
							AreaUpdate(data).then(res => {
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