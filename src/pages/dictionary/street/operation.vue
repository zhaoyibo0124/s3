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
				<a-select v-model="form.cityCode" @change="queryAreaList(form.cityCode, true)" placeholder="请选择" :disabled="title == '查看'" show-search
					option-filter-prop="children">
					<a-select-option v-for="(item,index) in cityList" :value="item.value" :key="index">
						{{item.key}}
					</a-select-option>
				</a-select>
			</a-form-model-item>
			<a-form-model-item label="所属地区" prop="areaCode">
				<a-select v-model="form.areaCode" placeholder="请选择" :disabled="title == '查看'" show-search
					option-filter-prop="children">
					<a-select-option v-for="(item,index) in areaList" :value="item.value" :key="index">
						{{item.key}}
					</a-select-option>
				</a-select>
			</a-form-model-item>
			<a-form-model-item label="街道编码" prop="streetCode">
				<a-input v-model="form.streetCode" placeholder="请输入" :disabled="title == '查看'" />
			</a-form-model-item>
			<a-form-model-item label="街道名称" prop="streetName">
				<a-input v-model="form.streetName" placeholder="请输入" :disabled="title == '查看'" />
			</a-form-model-item>
			<a-form-model-item label="街道排序" prop="streetSort">
				<a-input-number style="width: 100%" :min="0" :max="9999" v-model="form.streetSort" placeholder="请输入" :disabled="title == '查看'" />
			</a-form-model-item>
			<a-form-model-item label="街道简称" prop="streetAlias">
				<a-input v-model="form.streetAlias" placeholder="请输入" :disabled="title == '查看'" />
			</a-form-model-item>
			<a-form-model-item label="街道经度" prop="streetLnt">
				<a-input v-model="form.streetLnt" placeholder="请输入" :disabled="title == '查看'" />
			</a-form-model-item>
			<a-form-model-item label="街道纬度" prop="streetLat">
				<a-input v-model="form.streetLat" placeholder="请输入" :disabled="title == '查看'" />
			</a-form-model-item>
			<a-form-model-item label="经纬度查询地址" prop="">
				<a style="color: red;" href="https://jingweidu.bmcx.com/" target="_blank">https://jingweidu.bmcx.com/</a>
			</a-form-model-item>
		</a-form-model>
	</a-modal>
</template>
<script>
	import {
		StreetAdd,
		StreetUpdate,
		ProvinceQueryList,
		CityQueryList,
		AreaQueryList
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
					areaCode: this.defaultData.data.areaCode?this.defaultData.data.areaCode:undefined,
					streetCode: this.defaultData.data.streetCode?this.defaultData.data.streetCode:'',
					streetName: this.defaultData.data.streetName?this.defaultData.data.streetName:'',
					streetAlias: this.defaultData.data.streetAlias?this.defaultData.data.streetAlias:'',
					streetLnt: this.defaultData.data.streetLnt?this.defaultData.data.streetLnt:'',
					streetLat: this.defaultData.data.streetLat?this.defaultData.data.streetLat:'',
					streetSort: this.defaultData.data.streetSort?this.defaultData.data.streetSort:'',
				},
				rules: {
					provinceCode: [
						{required: true, message: '请选择所属省份', trigger: 'blur'},
					],
					cityCode: [
						{required: true, message: '请选择所属市区', trigger: 'blur'},
					],
					areaCode: [
						{required: true, message: '请选择所属地区', trigger: 'blur'},
					],
					streetCode: [
						{required: true, message: '请输入街道编号', trigger: 'blur'},
					],
					streetName: [
						{required: true, message: '请输入街道名称', trigger: 'blur'},
					],
					streetSort: [
						{required: true, message: '请输入街道排序', trigger: 'blur'},
					],
				},
				provinceList: [],
				cityList: [],
				areaList: []
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
			this.queryProvinceList();
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
					this.form.areaCode = undefined
					this.areaList = []
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
			queryAreaList(cityCode, flag) {
				if(flag){
					this.form.areaCode = undefined
				}
				const data = {
					pageNo: -1,
					pageSize: 10,
					cityCode: cityCode
				}
				AreaQueryList(data).then(res => {
					const data = res.data
					if (data.code == 200) {
						this.areaList = []
						let areaList = []
						data.data.list.forEach(item => {
							let template = {}
							template.key = item.areaName
							template.value = item.areaCode
							areaList.push(template)
						})
						this.areaList = areaList
					} else {
						this.$message.error(data.msg)
					}
				})
			},
			queryNowList() {
				const data = {
					pageNo: -1,
					pageSize: 10,
					areaCode: this.form.areaCode
				}
				AreaQueryList(data).then(res => {
					const data = res.data
					if (data.code == 200) {
						this.form.cityCode = data.data.list[0].cityCode
						this.queryAreaList(this.form.cityCode, false)
						const cityData = {
							pageNo: -1,
							pageSize: 10,
							cityCode: this.form.cityCode
						}
						CityQueryList(cityData).then(res => {
							const cityData = res.data
							if (cityData.code == 200) {
								this.form.provinceCode = cityData.data.list[0].provinceCode
								this.queryCityList(this.form.provinceCode, false)
							} else {
								this.$message.error(data.msg)
							}
						})
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
								areaCode: this.form.areaCode,
								streetCode: this.form.streetCode,
								streetName: this.form.streetName,
								streetAlias: this.form.streetAlias,
								streetLnt: this.form.streetLnt,
								streetLat: this.form.streetLat,
								streetSort: this.form.streetSort,
							}
							StreetAdd(data).then(res => {
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
								areaCode: this.form.areaCode,
								streetCode: this.form.streetCode,
								streetName: this.form.streetName,
								streetAlias: this.form.streetAlias,
								streetLnt: this.form.streetLnt,
								streetLat: this.form.streetLat,
								streetSort: this.form.streetSort,
							}
							StreetUpdate(data).then(res => {
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