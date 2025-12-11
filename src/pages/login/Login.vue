<template>
	<div class="login-wrap">
		<div class="logo-wrap">
			<img src="../../assets/img/login-logo.png" alt="logo">
		</div>
		<div class="content-wrap">
			<div class="left-block">
				<span>招标文件智能编审</span>
				<!-- <span class="blue">降低扣分及废标风险</span> -->
				<img src="../../assets/img/login-img.png" alt="login">
			</div>
			<div class="right-block">
				<div class="login">
					<span class="bt">账号登录</span>
					<a-form @submit="onSubmit" :form="form" v-if="show">
						<a-form-item>
							<a-input size="large" placeholder="请输入账号"
								v-decorator="['name', { rules: [{ required: true, message: '请输入账号', whitespace: true }] }]">
								<a-icon slot="prefix" type="user" />
							</a-input>
						</a-form-item>
						<a-form-item>
							<a-input size="large" placeholder="请输入密码" type="password"
								v-decorator="['password', { rules: [{ required: true, message: '请输入密码', whitespace: true }] }]">
								<a-icon slot="prefix" type="lock" />
							</a-input>
						</a-form-item>
						<a-form-item>
							<a-row :gutter="[6, 0]">
								<a-col :span="14">
									<a-input size="large" placeholder="请输入验证码"
										v-decorator="['code', { rules: [{ required: true, message: '请输入验证码', whitespace: true }] }]">
									</a-input>
								</a-col>
								<a-col :span="5">
									<img class="code-img" :src="'data:image/jpeg;base64,' + codeUrl" alt=""
										@click="genPublicKey">
								</a-col>
							</a-row>
						</a-form-item>
						<a-form-item>
							<a-button class="btn-style" :loading="logging" size="large" htmlType="submit"
								type="primary">登录</a-button>
						</a-form-item>
					</a-form>
				</div>
			</div>
		</div>
	</div>
</template>
<script>
/* eslint-disable no-undef */
import axios from 'axios'
import { mapMutations } from 'vuex'
import { loadRoutes } from '@/utils/routerUtil'
import BlankView from '@/layouts/BlankView'
import {
	Login,
	MenuFindPowerMenu,
	QueryJsonBasicList,
	GenImageCode,
	GenPublicKey,
	SystemFindBySystemCode,
	GenSmsCode
} from '@/services/commentApiList'
export default {
	name: 'Login',
	data() {
		return {
			logging: false,
			caLoading: false,
			show: true,
			error: '',
			form: this.$form.createForm(this),
			caParams: {
				grant_type: 'ca'
			},
			codeUrl: '',
			imageId: '',
			publicId: '',
			publicKey: '',
			systemCode: '',
			systemId: '',
			visible: false,
			registerForm: {
				userName: '',
				userMobile: '',
				userCard: '',
				loginName: '',
				loginPassword: '',
				systemCode: 'client',
				verificationId: '',
				verificationCode: ''
			},
			rules: {

			},
			registerPublicKey: '',
			registerPublicId: '',
			registerCodeUrl: '',
			labelCol: { span: 5, offset: 3 },
			wrapperCol: { span: 11, offset: 0 },
			handleOkLoading: false,
			countdown: false,
			count: 600,
			clearIntervalFlag: null,
		}
	},
	mounted() {
		this.genPublicKey();
	},
	methods: {
		...mapMutations('account', ['setUser']),
		// 获取公钥
		genPublicKey() {
			axios.defaults.headers.common['Authorization'] = ''
			sessionStorage.removeItem('authorization')
			sessionStorage.removeItem('publicKey')
			sessionStorage.removeItem('userId')
			sessionStorage.removeItem('queryJsonBasicList')
			sessionStorage.removeItem('routesConfigData')
			sessionStorage.removeItem('code')
			GenPublicKey().then(res => {
				const data = res.data
				if (data.code == 200) {
					const { id, publicKey } = data.data
					if (this.visible) {
						// 注册验证码需要的key和id
						this.registerPublicKey = publicKey
						this.registerPublicId = id
					} else {
						this.publicKey = publicKey
						this.publicId = id
					}
					this.genImageCode({
						id: id,
						publicKey: publicKey
					})
				} else {
					this.$message.error(data.msg)
				}
			})
		},
		// 获取验证码
		genImageCode(data) {
			GenImageCode({ imageId: this.imageId }, data).then(res => {
				const data = res.data
				if (data.code == 200) {
					const { imageContent, imageId } = data.data
					if (this.visible) {
						this.registerForm.verificationId = imageId
						this.registerCodeUrl = imageContent
					} else {
						this.imageId = imageId
						this.codeUrl = imageContent
					}
				} else {
					this.$message.error(data.msg)
				}
			})
		},
		// 获取系统信息
		genSystemCode() {
			const code = this.$route.query.code
			if (code == '' || code == null || code == undefined) {
				this.systemCode = 'system'
			} else {
				this.systemCode = code;
			}
			const data = {
				id: this.systemCode
			}
			sessionStorage.setItem('code', this.systemCode)
			const config = { publicKey: this.publicKey, id: this.publicId }
			SystemFindBySystemCode(data, config).then(res => {
				const data = res.data
				if (data.code == 200) {
					if (data.data) {
						this.systemId = data.data
					}
					this.login()
				} else {
					this.$message.error(data.msg)
				}
			})
		},
		// 获取短信验证码
		handleSendMsg() {
			if (!this.registerForm.userMobile) {
				this.$message.error('请输入手机号')
				return
			}
			GenSmsCode({ mobile: this.registerForm.userMobile }).then(res => {
				const data = res.data
				if (data.code == 200) {
					this.countdown = true
					this.$message.info('发送成功');
					this.clearIntervalFlag = setInterval(() => {
						if (this.count == 0) {
							clearInterval(this.clearIntervalFlag)
							this.countdown = false
							this.count = 60
							return
						}
						this.count -= 1;
					}, 1000)
				} else {
					this.$message.error(data.msg)
				}
			})
		},
		// 登录
		login() {
			axios.defaults.headers.common['Authorization'] = ''
			sessionStorage.setItem('authorization', '')
			this.logging = true
			const data = {
				encryptionId: this.publicId,
				loginName: this.form.getFieldValue('name'),
				loginPassword: this.form.getFieldValue('password'),
				systemCode: this.systemCode,
				verificationCode: this.form.getFieldValue('code'),
				verificationId: this.imageId,
			}
			const config = { publicKey: this.publicKey, id: this.publicId }
			Login(data, config).then(res => {
				this.logging = false
				const data = res.data
				if (data.code == 200) {
					sessionStorage.setItem('publicKey', this.publicKey)
					axios.defaults.headers.common['Authorization'] = data.data
					sessionStorage.setItem('authorization', data.data)
					let dataArr = data.data.split(".")
					let Base64 = require('js-base64').Base64
					sessionStorage.setItem('userId', JSON.parse(Base64.decode(dataArr[1])).userId)
					let userInfo = {}
					userInfo.name = this.form.getFieldValue('name')
					userInfo.userHead = require('@/assets/img/headerImg1.png')
					this.setUser(userInfo)
					this.findPowerMenu()	// 获取动态路由
				} else {
					this.$message.error(data.msg)
				}
			})
		},
		onSubmit(e) {
			e.preventDefault()
			this.form.validateFields((err) => {
				if (!err) {
					this.genSystemCode()
				}
			})
		},
		// 获取动态路由
		findPowerMenu() {
			// 清除路由缓存
			this.$store.commit('account/setRoutesConfigData', '')
			const data = {
				id: this.systemId
			}
			// 请求动态路由
			MenuFindPowerMenu(data).then(res => {
				const data = res.data
				if (data.code == 200) {
					let router = this.$router.options.routes
					if (router[3].children.length == 0) {
						const routerTemplate = []
						data.data.forEach((item) => {
							if (item.menuLevel == '1') {
								const template = {}
								template.path = item.menuCode
								template.name = item.menuName
								template.menuShow = item.menuShow
								template.meta = {
									authority: {
										permission: "*"
									},
									pAuthorities: [],
									icon: item.menuIcon,
									page: {
										cacheAble: false
									}
								}
								if (item.menuUrl != '#') {
									template.component = () => import('@/pages/' + item.menuUrl.replace('@/pages/', ''))
								} else {
									template.component = BlankView
									template.children = []
									data.data.forEach((every) => {
										if (every.menuLevel == '2' && every.menuParent == item.menuCode) {
											const childrenTemplate = {}
											childrenTemplate.path = every.menuCode
											childrenTemplate.name = every.menuName
											childrenTemplate.menuShow = every.menuShow
											childrenTemplate.meta = {
												authority: {
													permission: "*"
												},
												pAuthorities: []
											}
											childrenTemplate.component = () => import('@/pages/' + every.menuUrl.replace('@/pages/', ''))
											template.children.push(childrenTemplate)
										}
									})
								}
								routerTemplate.push(template)
							}
						})
						routerTemplate.forEach((item, i) => {
							router[3].children.splice(++i, 0, item)
						})
						this.$router.addRoutes(router)		// 动态添加路由
						// 提取路由国际化数据
						loadRoutes()
					}
					// 保存后端路由数据
					this.$store.commit('account/setRoutesConfigData', data.data)
					this.queryJsonBasicList()
				} else {
					this.$message.error(data.msg)
				}
			})
		},
		// 获取数据字典
		queryJsonBasicList() {
			QueryJsonBasicList().then(res => {
				const data = res.data
				if (data.code == 200) {
					// 保存数据字典
					sessionStorage.setItem('queryJsonBasicList', JSON.stringify(data.data))
					if (this.systemCode == 'client') {
						this.$router.push('index')
					} else {
						this.$router.push('power/system')
					}
				} else {
					this.$message.error(data.msg)
				}
			})
		},
	}
}
</script>
<style lang="less" scoped>
.login-wrap {
	width: 100%;
	height: 100vh;
	background: url('../../assets/img/login-bg.png') no-repeat;
	background-size: cover;
	display: flex;
	flex-direction: column;
	margin: 0 auto;

	.logo-wrap {
		display: flex;
		justify-content: flex-start;
		width: 100%;
		padding-left: 170px;
		margin-top: 45px;
		img {
			width: 131px;
			height: 24px;
		}
	}

	.content-wrap {
		display: flex;
		justify-content: space-between;
		align-items: flex-start;
		width: 100%;
		height: 100%;
		padding: 0 170px;
		margin-top: 180px;
		.left-block {
			width: calc(100% - 365px);
			display: flex;
			flex-direction: column;

			span {
				font-family: 'SourceHanSansCN-Bold';
				font-weight: 800;
				font-size: 35px;
				user-select: none;
			}

			&:nth-child(1) {
				color: #000000;
			}

			.blue {
				/* 设置渐变背景 */
				background: linear-gradient(0deg, #1F63D1 0%, #3BC3FB 100%);
				-webkit-background-clip: text;
				background-clip: text;
				color: transparent;
				/* 确保文字颜色透明，这样背景色才会显示 */
			}

			img {
				width: 483px;
				height: 373px;
				margin-left: 150px;
			}
		}

		.right-block {
			width: 365px;
			height: 472px;
			background: #FFFFFF;
			box-shadow: 0px 0 3px 0px rgba(0, 0, 0, 0.25);
			border-radius: 6px 6px 6px 6px;

			.login {
				padding: 0 24px;

				.bt {
					position: relative;
					display: block;
					width: 317px;
					height: 43px;
					line-height: 31px;
					border-bottom: 1px solid #DDDDDD;
					margin-top: 56px;
					margin-bottom:38px;
					text-align: center;
					font-family: 'SourceHanSansCN-Normal';
					font-weight: 400;
					font-size: 21px;
					color: #000000;

					&::after {
						content: '';
						position: absolute;
						bottom: -2px;
						left: 83px;
						width: 148px;
						height: 3px;
						background: #1F63D1;

					}
				}

				.code-img {
					width: 110px;
					height: 40px;
					border-radius: 6px;
					margin-left: 16px;
					margin-top: -4px;
				}

				.btn-style {
					width: 317px;
					height: 42px;
					line-height: 42px;
					background: #1F63D1;
					border-radius: 6px;
					border-color: #1F63D1;
					margin-top: 24px;
					font-family: 'SourceHanSansCN-Normal';
					font-weight: 400;
					font-size: 16px;
				}
			}
		}
	}


}

::v-deep .ant-input {
	border-radius: 6px;
}

::v-deep .ant-input:focus {
	border-color: #1F63D1;
	box-shadow: none;
}

::v-deep .ant-input::placeholder {
	color: #666666;
}

::v-deep .ant-modal-header {
	text-align: center;
	height: 60px;
	background: #F6F9FF;
	border-radius: 6px;
	font-family: 'SourceHanSansCN-Bold';
	font-weight: 800;
	font-size: 18px;
	color: #000;
}

::v-deep .ant-modal-body {
	padding-top: 13px !important;
	padding-bottom: 58px !important;
}
</style>