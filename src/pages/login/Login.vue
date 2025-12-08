<template>
	<div class="login-wrap">
		<div class="logo-wrap">
			<img src="../../assets/img/login-logo.png" alt="logo">
		</div>
		<div class="content-wrap">
			<div class="left-block">
				<span>基于招标要求快速优化文件</span>
				<span class="blue">降低扣分及废标风险</span>
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
								<a-col :span="17">
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
				<div class="register">还没有账号？点击<span @click="register">立即注册</span></div>
			</div>
		</div>
		<a-modal :bodyStyle="{ padding: 0 }" title="请填写注册信息" :visible="visible" :maskClosable="true" :footer="null"
			centered width="700px" @cancel="handleCancel">
			<div class="register-wrap">
				<a-form-model ref="ruleForm" :model="registerForm" :rules="rules" :label-col="labelCol"
					:wrapper-col="wrapperCol" style="padding-top: 10px;">
					<a-form-model-item label="用户账号" prop="loginName">
						<a-input v-model="registerForm.loginName" placeholder="请输入账号" autocomplete="off" />
					</a-form-model-item>
					<a-form-model-item label="用户密码" prop="loginPassword">
						<a-input-password v-model="registerForm.loginPassword" placeholder="请输入密码"
							auto-complete="new-password" autocomplete="new-password" />
					</a-form-model-item>
					<a-form-model-item label="用户姓名" prop="userName">
						<a-input v-model="registerForm.userName" placeholder="请输入姓名" />
					</a-form-model-item>
					<a-form-model-item label="用户手机号" prop="userMobile">
						<a-input v-model="registerForm.userMobile" placeholder="请输入手机号" :maxLength="11" />
					</a-form-model-item>
					<a-form-model-item label="短信验证码" prop="mobileCode">
						<a-col :span="14"><a-input v-model="registerForm.mobileCode" placeholder="请输入短信验证码"
								:maxLength="6" /></a-col>
						<a-col :span="10">
							<span class="desc" v-if="countdown">{{ count }}秒后重发</span>
							<a-button v-else style="width:105px;margin-left: 15px;" type="primary"
								@click="handleSendMsg">短信验证码</a-button>
						</a-col>
					</a-form-model-item>
					<a-form-model-item label="用户身份证号" prop="userCard">
						<a-input v-model="registerForm.userCard" placeholder="请输入身份证号" :maxLength="18" />
					</a-form-model-item>
					<a-form-model-item label="图片验证码" prop="verificationCode">
						<a-row>
							<a-col :span="14"><a-input v-model="registerForm.verificationCode"
									placeholder="请输入图片验证码" /></a-col>
							<a-col :span="10"><img
									style="width:105px;height:32px;border-radius: 6px; margin-left: 15px; margin-top: -3px;"
									:src="'data:image/jpeg;base64,' + registerCodeUrl" alt=""
									@click="genPublicKey" /></a-col>
						</a-row>
					</a-form-model-item>
				</a-form-model>
				<div class="my-btn-view">
					<a-button style="width:260px" type="primary" @click="handleOk"
						:loading="handleOkLoading">注册</a-button>
				</div>
			</div>
		</a-modal>
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
	Register,
	GenSmsCode
} from '@/services/commentApiList'
export default {
	name: 'Login',
	data() {
		var validateidCard = (rule, value, callback) => {
			// 简单的身份证号校验规则
			const idCardRegex = /^[1-9]\d{5}(18|19|20)?\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{3}(\d|[Xx])$/;
			if (!idCardRegex.test(value)) {
				callback(new Error('请输入有效的身份证号'));
			} else {
				callback();
			}
		}
		var validateidPhone = (rule, value, callback) => {
			// 简单的手机号校验规则
			const phoneRegex = /^1[3456789]\d{9}$/;
			if (!phoneRegex.test(value)) {
				callback(new Error('请输入有效的手机号'));
			} else {
				callback();
			}
		}
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
				userName: [
					{ required: true, message: '请输入姓名', trigger: 'blur' },
				],
				userMobile: [
					{ required: true, message: '请输入手机号', trigger: 'blur' },
					{ validator: validateidPhone, trigger: 'blur' }
				],
				mobileCode: [{ required: true, message: '请输入短信验证码', trigger: 'blur' }],
				userCard: [
					{ required: true, message: '请输入身份证号', trigger: 'blur' },
					{ validator: validateidCard, trigger: 'blur' }
				],
				loginName: [
					{ required: true, message: '请输入账号', trigger: 'blur' },
				],
				loginPassword: [
					{ required: true, message: '请输入密码', trigger: 'blur' },
					{ pattern: /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[a-zA-Z\d]{6,16}$/, message: "密码格式要求:6-16位数字和字母(字母包含大小写)", trigger: "blur" }
				],
				verificationCode: [
					{ required: true, message: '请输入验证码', trigger: 'blur' },
				],
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
					this.$router.push('power/system') 
				} else {
					this.$message.error(data.msg)
				}
			})
		},
		passLogin() {
			this.show = true
		},
		//立即注册
		register() {
			this.visible = true
			this.genPublicKey()
		},
		// 关闭注册弹窗
		handleCancel() {
			this.visible = false
			this.registerForm = {
				userName: '',
				userMobile: '',
				mobileCode: '',
				userCard: '',
				loginName: '',
				loginPassword: '',
				systemCode: 'client',
				verificationId: '',
				verificationCode: ''
			}
			this.genPublicKey()
		},
		// 免责声明点击
		readDesc() {
			this.visibleDesc = !this.visibleDesc
		},
		// 已阅读免责声明
		read() {
			this.visibleDesc = false
			this.isRead = true
		},
		// 注册提交
		handleOk() {
			this.$refs.ruleForm.validate(valid => {
				if (valid) {
					this.handleOkLoading = true
					const data = {
						...this.registerForm
					}
					Register(data).then(res => {
						this.handleOkLoading = false
						const data = res.data
						if (data.code == 200) {
							this.$refs.ruleForm.resetFields()		// 清空表单
							let that = this
							this.$confirm({
								title: '注册成功！，请进行登录操作',
								okText: '确定',
								okCancel: false,
								onOk() {
									that.handleCancel()
								}
							})
						} else {
							this.$message.error(data.msg)
						}
					})
				} else {
					this.handleOkLoading = false
					return false
				}
			})
		}
	}
}
</script>
<style lang="less" scoped>
.login-wrap {
	width: 100%;
	height: 100vh;
	background: url('../../assets/img/login-bg.png') no-repeat;
	background-size: 100% 100%;
	display: flex;
	flex-direction: column;
	padding: 0 360px;

	.logo-wrap {
		margin-top: 60px;

		img {
			width: 175px;
			height: 32px;
		}
	}

	.content-wrap {
		display: flex;
		margin-top: 107px;

		.left-block {
			display: flex;
			flex-direction: column;
			margin-top: 16px;
			margin-right: 38px;

			span {
				font-family: 'SourceHanSansCN-Bold';
				font-weight: 800;
				font-size: 46px;
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
				width: 644px;
				height: 497px;
				margin-left: 30px;
			}
		}

		.right-block {
			width: 486px;
			height: 629px;
			background: #fff;
			box-shadow: 0px 0px 4px 0px rgba(0, 0, 0, 0.25);
			border-radius: 8px;

			.login {
				padding: 0 32px;

				.bt {
					position: relative;
					display: block;
					width: 422px;
					height: 63px;
					line-height: 41px;
					border-bottom: 1px solid #DDDDDD;
					margin-top: 74px;
					margin-bottom: 50px;
					padding-bottom: 15px;
					text-align: center;
					font-family: 'SourceHanSansCN-Normal';
					font-weight: 400;
					font-size: 28px;
					color: #000000;

					&::after {
						content: '';
						position: absolute;
						bottom: -3px;
						left: 137px;
						width: 148px;
						height: 5px;
						background: #1F63D1;

					}
				}

				.code-img {
					width: 110px;
					height: 56px;
					border-radius: 8px;
					margin-left: 6px;
					margin-top: -4px;
				}

				.btn-style {
					width: 422px;
					height: 48px;
					line-height: 48px;
					background: #1F63D1;
					border-radius: 8px;
					border-color: #1F63D1;
					margin-top: 24px;
					font-family: 'SourceHanSansCN-Normal';
					font-weight: 400;
					font-size: 18px;
				}
			}

			.register {
				display: flex;
				justify-content: center;
				align-items: center;
				font-family: 'SourceHanSansCN-Normal';
				font-weight: 400;
				font-size: 16px;
				color: #999999;

				span {
					color: #1F63D1;
					cursor: pointer;
				}
			}
		}
	}

	.register-wrap {
		display: flex;
		flex-direction: column;
	}

}

.code-block {
	display: flex;
	justify-content: flex-start;
	align-items: center;

	.code-img {
		width: 120px;
		height: 43px;
		border-radius: 6px;
		margin-left: 6px;
		// margin-top: -4px;
	}
}



.my-btn-view {
	width: 100%;
	display: flex;
	justify-content: center;
	align-items: center;
	margin-top: 20px;
}

.desc {
	display: inline-block;
	margin-left: 10px;
	width: 150px;
	text-align: center;
	color: #bfbfbf;
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