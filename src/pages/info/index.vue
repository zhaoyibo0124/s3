<template>
    <div class="info-wrap">
        <div class="content-block">
            <a-menu style="width: 226px" :default-selected-keys="['base']" mode="inline">
                <a-menu-item key="base" @click="handleClick">基本设置</a-menu-item>
                <a-menu-item key="password" @click="handleClick">密码设置</a-menu-item>
                <a-menu-item key="pay" @click="handleClick">支付设置</a-menu-item>
            </a-menu>
            <div class="info-block" v-show="showBase">
                <div class="title">基本信息</div>
                <a-form-model ref="ruleForm" :model="form" :rules="rules" layout="vertical">
                    <a-form-model-item label="姓名" prop="userName">
                        <a-input v-model="form.userName" placeholder="请输入" style="width:40%" />
                    </a-form-model-item>
                    <a-form-model-item label="电话" prop="userMobile">
                        <a-input v-model="form.userMobile" placeholder="请输入" :maxLength="11" style="width:40%" />
                    </a-form-model-item>
                    <a-form-model-item label="身份证号" prop="userCard">
                        <a-input v-model="form.userCard" placeholder="请输入" :maxLength="18" style="width:40%" />
                    </a-form-model-item>
                </a-form-model>
            </div>
            <div class="info-block" v-show="showPassword">
                <div class="title">修改密码</div>
                <a-form-model ref="formP" :model="formP" :rules="rules" layout="vertical">
                    <a-form-model-item label="旧密码" prop="oldLoginPassword">
                        <a-input-password v-model="formP.oldLoginPassword" placeholder="请输入" autocomplete="old-password"
                            style="width:40%" />
                    </a-form-model-item>
                    <a-form-model-item label="新密码" prop="loginPassword">
                        <a-input-password v-model="formP.loginPassword" placeholder="请输入" autocomplete="new-password"
                            style="width:40%" />
                    </a-form-model-item>
                    <a-form-model-item label="重复密码" prop="repeatPassword">
                        <a-input-password v-model="formP.repeatPassword" placeholder="请输入"
                            autocomplete="repeat-password" style="width:40%" />
                    </a-form-model-item>
                </a-form-model>
            </div>
            <div class="info-block" v-show="showPay">
                <div class="title">支付信息</div>
                <a-form-model ref="formPay" :model="formPay" :rules="rules" layout="vertical">
                    <a-form-model-item label="用户手机号" prop="userMobile">
                        <a-col :span="6"><a-input v-model="formPay.userMobile" placeholder="请输入" :maxLength="11"
                                :disabled="prepaidType == 3" /></a-col>
                    </a-form-model-item>
                    <a-form-model-item v-if="prepaidType != 3" label="短信验证码" prop="verificationCode">
                        <a-col :span="6"><a-input v-model="formPay.verificationCode" placeholder="请输入"
                                :maxLength="6" /></a-col>
                        <a-col :span="4">
                            <span class="desc" v-if="countdown">{{ count }}秒后重发</span>
                            <a-button v-else style="width:105px;margin-left: 15px;" type="primary"
                                @click="handleSendMsg">短信验证码</a-button>
                        </a-col>
                    </a-form-model-item>
                    <a-form-model-item v-if="prepaidType == 3" label="使用次数">
                        <a-col :span="6">
                            <a-input v-model="userCount" placeholder="请输入" :disabled="prepaidType == 3" />
                        </a-col>
                        <a-col :span="4">
                            <a-button type="primary" style="margin-left: 10px;" @click="visible = true">充值</a-button>
                        </a-col>
                    </a-form-model-item>
                </a-form-model>
            </div>
        </div>
        <div class="btn-block" v-if="prepaidType != 3">
            <span class="btn-my-primary" @click="handleSubmit">确定</span>
        </div>
        <a-modal title="充值" :visible="visible" @cancel="handleCancel" :maskClosable="false" centered width="500px">
            <template slot="footer">
                <template>
                    <a-button @click="handleCancel">取消</a-button>
                    <a-button type="primary" @click="handleOk" :loading="handleOkLoading">确定</a-button>
                </template>
            </template>
            <a-form-model ref="formPaying" :model="formPaying" :rules="rules">
                <a-form-model-item label="充值金额">
                    <div class="amount-list">
                        <div :class="['amount-item', item.checked ? 'checked' : '']"
                            v-for="(item, index) in queryJsonBasicList.payAmount" :key="index"
                            @click="handleSelect(item)">
                            <span>{{ item.name }}元</span>
                            <span>{{ item.code }}次</span>
                        </div>
                    </div>
                </a-form-model-item>
                <a-form-model-item label="充值方式">
                    <div class="payType-list">
                        <div :class="['payType-item', item.checked ? 'checked' : '']"
                            v-for="(item, index) in queryJsonBasicList.payType" :key="index"
                            @click="handleSelectType(item)">
                            <a-icon v-if="item.code == 'ZFB'" type="alipay" style="font-size:24px"
                                :style="item.checked ? { 'color': '#5a9ef7' } : {}" />
                            <a-icon v-if="item.code == 'WX'" type="wechat" style="font-size:24px"
                                :style="item.checked ? { 'color': '#43c93e' } : {}" />
                            <span>{{ item.name }}</span>
                        </div>
                    </div>
                </a-form-model-item>
                <a-form-model-item v-if="codeUrl" label="扫描二维码进行支付">
                    <img style="width: 200px; height: 200px;" :src="codeUrl" alt="payCode">
                </a-form-model-item>
            </a-form-model>
        </a-modal>
    </div>
</template>

<script>
import {
    GetUserInfo,
    UpdateUserInfo,
    UpdateUserPassword,
    FindByUserId,
    CreateMember,
    CloudCode,
    CloudBindUser,
    CloudUserPay
} from '@/services/commentApiList'
export default {
    name: 'viewPage',
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
            queryJsonBasicList: JSON.parse(sessionStorage.getItem('queryJsonBasicList')),
            createUser: sessionStorage.getItem('userId'),
            openKeys: ['base'],
            selectedKeys: [],
            form: {
                userName: '',
                userMobile: '',
                userCard: ''
            },
            formP: {
                loginPassword: '',
                oldLoginPassword: '',
                repeatPassword: ''
            },
            formPay: {
                userMobile: '',
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
                userCard: [
                    { required: true, message: '请输入身份证号', trigger: 'blur' },
                    { validator: validateidCard, trigger: 'blur' }
                ],
                loginPassword: [
                    { required: true, message: '请输入新密码', trigger: 'blur' },
                ],
                oldLoginPassword: [
                    { required: true, message: '请输入旧密码', trigger: 'blur' },
                ],
                repeatPassword: [
                    { required: true, message: '请再次输入密码', trigger: 'blur' },
                ],
                verificationCode: [
                    { required: true, message: '请输入验证码', trigger: 'blur' },
                ]
            },
            showBase: true,
            showPassword: false,
            showPay: false,
            countdown: false,
            count: 60,
            clearIntervalFlag: null,
            prepaidType: '',
            userCount: '',
            visible: false,
            handleOkLoading: false,
            formPaying: {
                payAmount: '',
                payType: '',
                payCount: ''
            },
            codeUrl: ''
        }
    },
    methods: {
        getInfo() {
            GetUserInfo({ id: this.createUser }).then(res => {
                const data = res.data
                if (data.code == 200) {
                    for (let k in this.form) {
                        this.form[k] = data.data[k]
                    }
                } else {
                    this.$message.error(data.msg)
                }
            })
        },
        handleClick({ key }) {
            if (key == 'base') {
                this.showBase = true
                this.showPassword = false
                this.showPay = false
            } else if (key == 'password') {
                this.showPassword = true
                this.showBase = false
                this.showPay = false
            } else if (key == 'pay') {
                this.showPassword = false
                this.showBase = false
                // 获取云商用户信息
                this.getCloudUserInfo()
            }
        },
        // 获取云商用户信息
        getCloudUserInfo() {
            FindByUserId({ id: this.createUser }).then(res => {
                const data = res.data
                if (data.code == 200) {
                    this.showPassword = false
                    this.showBase = false
                    this.showPay = true
                    this.prepaidType = data.data.prepaidType
                    if (this.prepaidType == 3) {
                        this.formPay.userMobile = data.data.userMobile
                        this.userCount = data.data.userCount
                    } else {
                        this.formPay.userMobile = this.form.userMobile
                    }
                } else {
                    this.showPay = false
                }
            })
        },
        // 创建云商用户并发送云商短信验证码
        createUserApi() {
            CreateMember({ userId: this.createUser }).then(res => {
                const data = res.data
                if (data.code == 200) {
                    // 发送云商短信验证码
                    this.getClondMsg()
                } else {
                    this.$message.error(data.msg)
                    clearInterval(this.clearIntervalFlag)
                    this.countdown = false
                    this.count = 60
                }
            }).catch((error) => {
                this.$message.error(error)
            })
        },
        // 创建用户后获取云商短信验证码
        getClondMsg() {
            CloudCode({ userId: this.createUser, userMobile: this.formPay.userMobile }).then(res => {
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
                    clearInterval(this.clearIntervalFlag)
                    this.countdown = false
                    this.count = 60
                }
            }).catch((error) => {
                this.$message.error(error)
            })
        },
        // 短信验证码按钮提交
        handleSendMsg() {
            if (!this.formPay.userMobile) {
                this.$message.error('请输入手机号')
                return
            }
            if (this.prepaidType == 1) {
                // 创建用户并发送验证码
                this.createUserApi()
            } else if (this.prepaidType == 2) {
                // 只发送验证码
                this.getClondMsg()
            }
        },
        // 充值弹窗打开
        handlePayShow() {
            this.visible = true
        },
        //充值弹窗关闭
        handleCancel() {
            this.visible = false
            this.codeUrl = ''
            this.formPaying = {
                payAmount: '',
                payType: '',
                payCount: ''
            }
            this.queryJsonBasicList.payAmount.map(item => {
                item.checked = false
            })
            this.queryJsonBasicList.payType.map(item => {
                item.checked = false
            })
        },
        // 选择充值金额
        handleSelect(row) {
            this.queryJsonBasicList.payAmount.map(item => {
                item.checked = false
            })
            row.checked = true
            this.$set(row, 'checked', true)
            this.formPaying.payAmount = row.name
            this.formPaying.payCount = row.code
            this.$forceUpdate()
        },
        // 选择充值方式
        handleSelectType(row) {
            this.queryJsonBasicList.payType.map(item => {
                item.checked = false
            })
            row.checked = true
            this.$set(row, 'checked', true)
            this.formPaying.payType = row.code
            this.$forceUpdate()
        },
        // 充值弹窗提交
        handleOk() {
            if (!this.formPaying.payAmount) {
                this.$message.warn('请选择充值金额')
                return
            }
            if (!this.formPaying.payType) {
                this.$message.warn('请选择充值方式')
                return
            }
            if (this.codeUrl) {
                this.handleCancel()
                return
            }
            this.handleOkLoading = true
            CloudUserPay({
                userId: this.createUser,
                ...this.formPaying
            }).then(res => {
                const data = res.data
                if (data.code == 200) {
                    this.handleOkLoading = false
                    // 更新云商用户信息
                    this.getCloudUserInfo()
                    this.codeUrl = data.data
                } else {
                    this.handleOkLoading = false
                    this.$message.error(data.msg)
                }
            })

        },
        handleSubmit() {
            if (this.showBase) {
                this.$refs.ruleForm.validate(valid => {
                    if (valid) {
                        let that = this
                        this.$confirm({
                            title: '确定修改基本信息？',
                            okText: '确定',
                            cancelText: '取消',
                            onOk() {
                                UpdateUserInfo({ id: that.createUser, ...that.form }).then(res => {
                                    const data = res.data
                                    if (data.code == 200) {
                                        that.$message.success('操作成功')

                                    } else {
                                        that.$message.error(data.msg)
                                    }
                                })
                            },
                            onCancel() {
                                that.getInfo()
                                console.log('Cancel')
                            },
                        })

                    } else {
                        console.log('error submit!!');
                        return false;
                    }
                });
            } else if (this.showPassword) {
                this.$refs.formP.validate(valid => {
                    if (valid) {
                        if (this.formP.loginPassword != this.formP.repeatPassword) {
                            this.$message.error('新密码与重复密码不一致！')
                            return
                        }
                        let that = this
                        this.$confirm({
                            title: '确定修改密码？',
                            okText: '确定',
                            cancelText: '取消',
                            onOk() {
                                UpdateUserPassword({
                                    id: that.createUser,
                                    loginPassword: that.formP.loginPassword,
                                    oldLoginPassword: that.formP.oldLoginPassword
                                }).then(res => {
                                    const data = res.data
                                    if (data.code == 200) {
                                        that.$message.success('操作成功')

                                    } else {
                                        that.$message.error(data.msg)
                                    }
                                })
                            },
                            onCancel() {
                                that.getInfo()
                                that.formP.loginPassword = ''
                                that.formP.oldLoginPassword = ''
                                that.formP.repeatPassword = ''
                                console.log('Cancel')
                            },
                        })

                    } else {
                        console.log('error submit!!');
                        return false;
                    }
                });
            } else if (this.showPay) {
                this.$refs.formPay.validate(valid => {
                    if (valid) {
                        CloudBindUser({ userId: this.createUser, ...this.formPay }).then(res => {
                            const data = res.data
                            if (data.code == 200) {
                                this.$message.success('绑定成功')
                                // 更新云商用户信息
                                this.getCloudUserInfo()
                            } else {
                                this.$message.error(data.msg)
                            }
                        })


                    } else {
                        console.log('error submit!!');
                        return false;
                    }
                });
            }
        },
    },
    created() {
        this.getInfo()
    }
}
</script>

<style lang="less" scoped>
.info-wrap {
    width: 100%;
    height: 890px;
    display: flex;
    flex-direction: column;

    .content-block {
        display: flex;
        flex-direction: row;
        width: 100%;
        height: calc(100% - 200px);
        background: #fff;

        .info-block {
            display: flex;
            flex-direction: column;
            width: calc(100% - 270px);
            padding-left: 47px;
            padding-top: 23px;

            .title {
                margin-bottom: 28px;
                font-family: 'SourceHanSansCN-Bold';
                font-size: 18px;
                font-weight: bold;
                color: #000;
            }

            .form-item {
                margin-top: 24px;

                input {
                    width: 675px;
                    height: 38px;
                    line-height: 38px;
                    margin-top: 12px;
                    border-radius: 2px;
                    border: 1px solid #DDDDDD;
                    padding: 1px 8px;
                    outline: none;
                }

                span {
                    margin-top: 6px;
                    font-family: 'SourceHanSansCN-Normal';
                    font-weight: 400;
                    font-size: 16px;
                    color: #000;
                }
            }
        }
    }

    .btn-block {
        margin-bottom: 0;
        margin-top: -100px;

        .btn-my-primary {
            margin-right: 24px;
        }
    }

}

.desc {
    display: inline-block;
    margin-left: 10px;
    width: 150px;
    line-height: 40px;
    text-align: center;
    color: #bfbfbf;
}

.amount-list {
    width: 100%;
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    align-items: center;
    justify-content: flex-start;

    .amount-item {
        width: 90px;
        height: 80px;
        background: #fff;
        border: 1px solid #D9D9D9;
        border-radius: 6px;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: flex-start;
        cursor: pointer;

        span {
            display: inline-block;
            height: 25px;
        }
    }

    .checked {
        border: 1px solid #5D83FF;
        color: #5D83FF;
    }
}

.payType-list {
    width: 100%;
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    align-items: center;
    justify-content: flex-start;

    .payType-item {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        width: 120px;
        height: 100px;
        background: #fff;
        border: 1px solid #D9D9D9;
        border-radius: 6px;
        margin-right: 16px;
        cursor: pointer;

        span {
            display: inline-block;
            height: 36px;
            font-size: 18px;
        }
    }

    .checked {
        border: 1px solid #5D83FF;
        color: #5D83FF;
    }
}

::v-deep.ant-form-item label {
    font-family: 'SourceHanSansCN-Normal';
    font-size: 12px;
}

::v-deep.ant-input {
    font-family: 'SourceHanSansCN-Normal';
    font-weight: 400;
    font-size: 14px;

    &::placeholder {
        font-family: 'SourceHanSansCN-Normal';
        font-weight: 400;
        font-size: 12px;
    }
}
</style>