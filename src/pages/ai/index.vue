<template>
    <div class="bidSubproject">
        <div class="gutter1-box">
            <div class="back-box" v-html="backText" @click="back"></div>
            <div class="process-box">
                <div class="banner"></div>
            </div>
            <div class="content-block">
                <div class="content-box">
                    <div class="left-box">
                        <div class="bt-box">
                            <span class="bt"></span>
                            <span>第一步：选择文件范本</span>
                        </div>
                        <div class="file-box">
                            <span class="upload-icon"></span>
                            <span v-if="defaultData.projectFileAlias" class="desc">{{ defaultData.projectFileAlias
                                }}.docx</span>
                            <span v-else class="desc">请选择所需的文件范本</span>
                            <a-button type="primary" size="small" style="font-size: 12px;"
                                @click="selectFileModal">选择范本</a-button>
                        </div>
                    </div>
                    <div class="right-box">
                        <div class="bt-box">
                            <span class="bt"></span>
                            <span>第二步：上传招标文件</span>
                        </div>
                        <div class="file-box">
                            <div class="input">
                                标段名称
                                <a-input type="text" class="my-input" v-model="projectName" />
                            </div>
                            <a-tabs v-model="activeKey" default-active-key="1" @change="callback" style="width: 96%;">
                                <a-tab-pane key="1" tab="上传文档">
                                    <div class="upload-box">
                                        <a-upload ref="uploadModel" accept=".doc,.docx" action="#"
                                            :showUploadList="false" :before-upload="beforeUpload"
                                            @change="handleChangeDocument">
                                            <div class="upload">
                                                <img src="../../assets/img/icon-upload.png" alt="">
                                                上传招标文件
                                            </div>
                                        </a-upload>
                                        <span v-if="file.name" class="desc">{{ file.name }}</span>
                                        <span class="desc">支持doc,docx格式</span>
                                    </div>
                                </a-tab-pane>
                                <a-tab-pane key="2" tab="内容录入">
                                    <div class="input-box">
                                        <a-textarea v-model="content" placeholder="请输入"
                                            :auto-size="{ minRows: 5, maxRows: 8 }" />
                                    </div>
                                </a-tab-pane>
                                <a-tab-pane key="3" tab="关键信息">
                                    <a-form-model ref="ruleForm" :model="form" :rules="rules" :label-col="labelCol"
                                        :wrapper-col="wrapperCol">
                                        <a-form-model-item label="项目编号:" prop="projectCode">
                                            <a-input type="text" class="my-input" v-model="form.projectCode" />
                                        </a-form-model-item>
                                        <a-form-model-item label="项目分类:" prop="projectClassify">
                                            <a-select v-model="form.projectClassify" placeholder="请选择" class="my-input">
                                                <a-select-option
                                                    v-for="item, index in queryJsonBasicList.projectClassify"
                                                    :key="index" :value="item.code">{{ item.name
                                                    }}</a-select-option>
                                            </a-select>
                                        </a-form-model-item>
                                        <a-form-model-item label="资金来源:" prop="projectFundSource">
                                            <a-select v-model="form.projectFundSource" placeholder="请选择"
                                                class="my-input">
                                                <a-select-option v-for="item, index in queryJsonBasicList.fundSource"
                                                    :key="index" :value="item.code">{{ item.name
                                                    }}</a-select-option>
                                            </a-select>
                                        </a-form-model-item>
                                    </a-form-model>
                                </a-tab-pane>
                            </a-tabs>
                        </div>
                    </div>
                    <div class="btn-box">
                        <a-button type="primary" @click="submit">开启智能编制</a-button>
                    </div>
                </div>

            </div>
        </div>
        <a-modal v-model="show" title="选择范本" width="800px" @cancel="handleCancel" @ok="handleOk">
            <a-checkbox-group v-model="checkedValues" @change="onChange">
                <a-row>
                    <a-col :span="24" v-for="item in lists" :key="item.id">
                        <a-checkbox :value="item.id">
                            {{ item.templateName }}
                        </a-checkbox>
                    </a-col>
                </a-row>
            </a-checkbox-group>
        </a-modal>
    </div>
</template>

<script>
import {
    exaFileQueryListApi,
    documentUploadApi,
    contentEntryApi,
    infoEntryApi
} from '@/services/commentApiList'
export default {
    data() {
        return {
            queryJsonBasicList: JSON.parse(sessionStorage.getItem('queryJsonBasicList')),		// 存储数据字典
            backText: '<返回',
            colors: ['待提交', '审核中', '审核通过', '审核未通过'],
            content: '',
            show: false,
            lists: [],
            checkedValues: [],
            defaultData: {}, //选择的范本数据
            form: {
                projectCode: '',
                projectClassify: undefined,
                projectFundSource: undefined
            },
            rules: {
                projectCode: [
                    { required: true, message: '请选择项目编号', trigger: 'blur' },
                ],
                projectClassify: [
                    { required: true, message: '请选择项目分类', trigger: 'change' },
                ],
                projectFundSource: [
                    { required: true, message: '请选择资金来源', trigger: 'change' },
                ],
            },
            labelCol: { span: 4, offset: 0 },
            wrapperCol: { span: 14, offset: 1 },
            activeKey: '1',
            projectName: '',
            templateId: '',
            file: {},//招标文件
        }
    },
    created() {

    },
    methods: {
        back() {
            this.$router.go(-1)
        },
        // 继续编制
        goOn() {

        },
        callback() {

        },
        // 选择范本弹窗
        selectFileModal() {
            this.defaultData = {}
            this.lists = []
            this.checkedValues = []
            const data = {
                pageNo: -1,
                pageSize: -1
            }
            exaFileQueryListApi(data).then(res => {
                const data = res.data
                if (data.code == 200) {
                    this.lists = data.data.list
                    this.show = true
                } else {
                    this.show = false
                    this.$message.error(data.msg)
                }
            })
        },
        // 范本选择取消
        handleCancel() {
            this.show = false
        },
        // 选择范本
        onChange(checkedValues) {
            this.checkedValues = checkedValues.slice(-1)
        },
        // 选择范本确定提交
        handleOk() {
            this.show = false
            this.lists.map(item => {
                if (item.id == this.checkedValues[0]) {
                    this.defaultData = item
                }
            })
        },
        // 取消自动上传文件
        beforeUpload(file) {
            this.file = {};
            this.file = file;
            return false;
        },
        // 文档上传
        handleChangeDocument() {
            const formData = new FormData();
            formData.append("file", this.file);
        },
        // 智能编制
        submit() {
            // 上传文档
            if (this.activeKey == 1) {
                const formData = new FormData();
                formData.append("projectName", this.projectName);
                formData.append("templateId", this.defaultData.id);
                formData.append("type", this.activeKey);
                formData.append("file", this.file);
                documentUploadApi(formData).then(res => {
                    const data = res.data
                    if (data.code == 200) {
                        this.$message.success('操作成功')
                        this.$router.push('/init')
                    } else {
                        this.$message.error(data.msg)
                    }
                })
            }
            // 内容录入
            if (this.activeKey == 2) {
                contentEntryApi({
                    projectName: this.projectName,
                    templateId: this.defaultData.id,
                    textContent: this.content,
                    type: this.activeKey
                }).then(res => {
                    const data = res.data
                    if (data.code == 200) {
                        this.$message.success('操作成功')
                        this.$router.push('/init')
                    } else {
                        this.$message.error(data.msg)
                    }
                })
            }
            // 关键信息
            if (this.activeKey == 3) {
                infoEntryApi({
                    projectName: this.projectName,
                    templateId: this.defaultData.id,
                    ...this.form,
                    type: this.activeKey
                }).then(res => {
                    const data = res.data
                    if (data.code == 200) {
                        this.$message.success('操作成功')
                        this.$router.push({ path: '/init', query: { id: data.data } })
                    } else {
                        this.$message.error(data.msg)
                    }
                })
            }

        }
    }
}
</script>

<style lang="less" scoped>
.bidSubproject {
    height: 100%;
    background-color: #fff;
}

.gutter1-box {
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: flex-start;

    .back-box {
        display: flex;
        margin-top: 10px;
        margin-bottom: 10px;
        padding: 0 20px;
        cursor: pointer;
    }

    .process-box {
        display: flex;
        justify-content: space-between;
        align-items: center;
        background-color: #fff;
        margin-bottom: 13px;
        padding: 0 20px;
        width: 100%;

        .banner {
            width: 100%;
            height: 139px;
            background-image: url('../../assets/img/banner.png');
            background-size: contain;
            /* 或者使用 cover */
            background-repeat: no-repeat;
            background-position: center;
            /* 确保图片居中 */
        }
    }

    .content-block {
        display: flex;
        flex-direction: column;
        width: calc(100% - 40px);
        background: #FFFFFF;
        box-shadow: 0px 0px 20px 0px rgba(31, 99, 209, 0.16);
        border-radius: 6px;
        margin: 0 auto;

        .content-box {
            width: 100%;
            display: flex;
            margin: 18px;

            div.bt-box {
                display: flex;
                align-items: center;

                .bt {
                    display: inline-block;
                    width: 2px;
                    height: 20px;
                    background: url('../../assets/img/icon-bt.png') no-repeat;
                    background-size: 100% 100%;
                    margin-right: 6px;
                }

                span {
                    font-weight: 400;
                    font-size: 17px;
                    color: #000000;
                }
            }

            .left-box {
                display: flex;
                flex-direction: column;
                width: 350px;
                margin-right: 54px;

                .file-box {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    width: 347px;
                    height: 421px;
                    background: #FFFFFF;
                    border-radius: 6px;
                    border: 1px solid #DDDDDD;
                    margin-top: 18px;

                    .upload-icon {
                        display: inline-block;
                        width: 60px;
                        height: 75px;
                        background: url('../../assets/img/icon-image.png') no-repeat;
                        background-size: 100% 100%;
                    }

                    span.desc {
                        margin-top: 9px;
                        margin-bottom: 24px;
                        font-weight: 400;
                        font-size: 11px;
                        color: #000000;
                    }
                }
            }

            .right-box {
                display: flex;
                flex-direction: column;
                justify-content: flex-start;
                align-items: flex-start;
                width: calc(100% - 404px);

                .file-box {
                    width: 100%;
                    display: flex;
                    flex-direction: column;
                    align-items: flex-start;
                    justify-content: flex-start;
                    margin-top: 15px;

                    .input {
                        width: 100%;
                        display: flex;
                        justify-content: flex-start;
                        align-items: center;
                        margin-bottom: 24px;

                        .my-input {
                            width: 88%;
                            margin-left: 12px;
                        }
                    }

                    // .my-input {
                    //     width: 300px;
                    // }

                    .upload-box,
                    .input-box {
                        width: 100%;
                        height: 347px;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        flex-direction: column;
                    }

                    .upload {
                        display: flex;
                        justify-content: center;
                        align-items: center;
                        flex-direction: column;
                        width: 122px;
                        height: 96px;
                        background: #FFFFFF;
                        border-radius: 6px;
                        border: 1px solid #DDDDDD;
                        font-weight: 400;
                        font-size: 12px;
                        color: #222222;
                        cursor: pointer;

                        img {
                            width: 36px;
                            height: 36px;
                        }
                    }

                    .desc {
                        margin-top: 15px;
                        font-weight: 400;
                        font-size: 12px;
                        color: #999999;
                    }

                    .input-box {
                        justify-content: flex-start;
                    }
                }
            }

            .btn-box {
                position: fixed;
                left: 100px;
                bottom: 0px;
                display: flex;
                align-items: center;
                justify-content: center;
                width: calc(100% - 118px);
                height: 56px;
                background: #FFFFFF;
                box-shadow: 0px -3px 4px 0px rgba(0, 0, 0, 0.11);
                border-radius: 0px 0px 6px 6px;
                margin: 0 auto;
            }
        }


    }


}
</style>
<style>
.custom-progress .ant-progress-circle-trail {
    stroke: #CDCDCD !important;
    /* 设置背景色为灰色 */
}
</style>