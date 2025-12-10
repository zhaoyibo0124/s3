<template>
    <div class="bidSubproject">
        <div class="back-box" v-html="backText" @click="back"></div>
        <div class="gutter-box">
            <div class="left-box">
                <Wps ref="wps" v-if="show" :detailData="detailData" />
            </div>
            <div class="right-box">
                <div class="red-text">*该招标文件共检查出{{ num }}类，累计{{ total }}处建议修复内容~</div>
                <div class="type-box">
                    <a-icon type="left" style="font-size: 22px;color: #999;cursor: pointer;" @click="prevContent" />
                    <div class="type-data">
                        <div :class="['type-item', colors[index]]"
                            v-for="item, index in lists.slice((currentIndex - 1) * 4)" :key="index"
                            @click="handleClick(item, index)">
                            <span class="bt">{{ item.errorCount }}<i>处</i></span>
                            <span class="desc">{{ item.classifyName }}</span>
                        </div>
                    </div>
                    <a-icon type="right" style="font-size: 22px;color: #999;cursor: pointer;" @click="nextContent" />
                </div>
                <div class="content-box">
                    <div class="content-height">
                        <div :class="['content-item', colors[selectIndex]]" v-for="error in errorList" :key="error.id">
                            <div class="desc">
                                {{ error.examineJudgmentContent }}
                            </div>
                            <div class="red-desc">
                                {{ error.examineResult }}
                            </div>
                            <div class="action">
                                <div class="tips">{{ error.examineRule }}</div>
                            </div>
                        </div>
                    </div>
                    <div class="examine-box" v-if="type == 'examine' && !show">
                        <div class="radio-box">
                            审核意见<a-radio-group v-model="examineStatus" :options="options" />
                        </div>
                        <div v-if="type == 'examine' && !show">
                            备注
                        </div>
                        <div class="textarea" v-if="type == 'examine' && !show">
                            <a-textarea v-model="reason" placeholder="请填写审核备注"
                                :auto-size="{ minRows: 5, maxRows: 8 }" />
                        </div>
                    </div>
                    <div class="examine-result" v-if="type == 'view'">
                        <div class="text-box" style="margin-top: 29px;">
                            审核意见:{{ detailData.examineRemark }}
                        </div>
                        <div class="text-box">
                            审核状态：{{ detailData.examineStatus == 3 ? '审核通过' : '审核未通过' }}
                        </div>
                        <div class="text-box">
                            审核时间：{{ detailData.examineTime }}
                        </div>
                        <div class="text-box">
                            审核人：{{ detailData.examineUserName }}
                        </div>
                        <div class="text-box">
                            创建人：{{ detailData.createUserName }}
                        </div>
                        <div class="text-box">
                            创建时间：{{ detailData.createTime }}
                        </div>
                        <!-- <div class="btn-view">
                            <a-button @click="handleRecord"
                                style="width: 127px;border-color: #1F63D1;color: #1F63D1;">查看历史版本</a-button>
                        </div> -->
                    </div>
                </div>
            </div>
        </div>
        <div class="btn-box" v-if="type != 'view'">
            <a-button style="margin-right:20px" @click="close">取消</a-button>
            <a-button type="primary" @click="confirm">审核</a-button>
        </div>
    </div>
</template>

<script>
import Wps from '../../components/wps'
import {
    reviewDetailApi,
    queryTypeListApi,
    examineActionApi
} from '@/services/commentApiList'

export default {
    name: 'detailPage',
    components: {
        Wps
    },
    data() {
        let self = this
        return {
            backText: '<返回',
            type: self.$route.query.type,
            queryJsonBasicList: JSON.parse(sessionStorage.getItem('queryJsonBasicList')),		// 存储数据字典
            num: 0,
            total: 0,
            colors: ['blue', 'orange', 'green', 'brown', 'purple'],
            currentIndex: 1,
            options: [{ label: '审核通过', value: 3 }, { label: '审核不通过', value: 4 }],
            examineStatus: '',
            reason: '',
            detailData: {},
            errorList: [],
            lists: [],
            selectIndex: 0,
            show: false
        }
    },
    created() {
        this.getDetail()
        this.getList()
    },
    methods: {
        back() {
            this.$router.go(-1)
        },
        // 获取详情
        getDetail() {
            reviewDetailApi({ id: this.$route.query.id }).then(res => {
                const data = res.data
                if (data.code == 200) {
                    this.detailData = data.data
                    this.show = true
                } else {
                    this.$message.error(data.msg)
                }
            })
        },
        // 获取右侧数据
        getList() {
            queryTypeListApi({ id: this.$route.query.id }).then(res => {
                const data = res.data
                if (data.code == 200) {
                    this.lists = data.data
                    this.total = data.data.reduce((accumulator, currentValue) => {
                        return accumulator + Number(currentValue.errorCount);
                    }, 0); // 初始值为0
                    this.num = this.lists.length
                    this.errorList = this.lists[0].errorList
                } else {
                    this.$message.error(data.msg)
                }
            })

        },
        nextContent() {
            // 切换到下一个内容，如果已经是最后一个，则循环到第一个
            this.currentIndex = (this.currentIndex + 1) % this.types.length;
        },
        prevContent() {
            // 切换到前一个内容，如果已经是第一个，则循环到最后一个
            this.currentIndex = (this.currentIndex - 1 + this.types.length) % this.types.length;
        },
        // 切换
        handleClick(row, index) {
            this.errorList = row.errorList
            this.selectIndex = index
        },
        // 关闭
        close() {
            this.$router.go(-1)
        },
        // 审核提交
        confirm() {
            if (this.examineStatus == '') {
                this.$message.warn('请选择审核意见')
                return
            }
            examineActionApi({ id: this.$route.query.id, examineRemark: this.reason, examineStatus: this.examineStatus }).then(res => {
                const data = res.data
                if (data.code == 200) {
                    this.$message.success('操作成功')
                    this.$router.go(-1)
                } else {
                    this.$message.error(data.msg)
                }
            })
        },
        // 查看历史版本
        handleRecord() {
            this.$router.push('/record')
        },
    }
}
</script>

<style lang="less" scoped>
.bidSubproject {
    display: flex;
    flex-direction: column;
    height: 100%;
    padding: 18px 18px 0 18px;
    background-color: #fff;

    .back-box {
        display: flex;
        margin-top: 0px;
        margin-bottom: 10px;
        cursor: pointer;
    }

    .gutter-box {
        display: flex;
        height: 100vh;

        .left-box {
            display: flex;
            width: calc(100% - 489px);
            height: 100%;
            background: #F5F9FF;
            border-radius: 6px;
        }

        .right-box {
            display: flex;
            flex-direction: column;
            width: 489px;
            height: 100%;
            background: #FFFFFF;
            box-shadow: 0px 0px 20px 0px rgba(31, 99, 209, 0.16);
            border-radius: 6px;
            margin-left: 18px;

            .red-text {
                margin-top: 29px;
                margin-left: 29px;
                font-weight: 400;
                font-size: 11px;
                color: #EB2323;
            }

            .type-box {
                display: flex;
                align-items: center;
                justify-content: center;
                margin: 9px 0;

                .type-data {
                    width: calc(100% - 63px);
                    display: flex;
                    margin: 0 5px;
                    overflow: hidden;

                    .type-item {
                        display: flex;
                        flex-direction: column;
                        align-items: center;
                        justify-content: center;
                        min-width: 81px;
                        height: 51px;
                        border-radius: 3px;
                        margin-right: 3px;
                        cursor: pointer;

                        .bt {
                            font-weight: bold;
                            font-size: 15px;

                            i {
                                font-style: normal;
                                font-weight: 400;
                                font-size: 10px;
                            }
                        }

                        .desc {
                            font-size: 10px;
                            color: #222222;
                        }
                    }

                }
            }

            .blue {
                background: #E5EFFF;

                .bt {
                    color: #1F63D1;
                }
            }

            .orange {
                background: #FFF0ED;

                .bt {
                    color: #FF8B77;
                }
            }

            .green {
                background: #E8FFF9;

                .bt {
                    color: #23C197;
                }
            }

            .brown {
                background: #FFF3ED;

                .bt {
                    color: #BD3A00;
                }
            }

            .purple {
                background: #F2F1FF;

                .bt {
                    color: #6561CB;
                }
            }

            .content-box {
                width: calc(100% - 58px);
                margin: 0 29px;
                display: flex;
                flex-direction: column;

                .content-height {
                    width: 100%;
                    height: 270px;
                    overflow: hidden;
                    overflow-y: auto;
                    display: flex;
                    flex-direction: column;
                }

                .content-item {
                    display: flex;
                    align-items: center;
                    justify-content: flex-start;
                    flex-direction: column;
                    width: 100%;
                    height: 83px;
                    border-radius: 6px;
                    border: 1px solid #DDDDDD;
                    padding: 9px 9px 0 9px;
                    margin-bottom: 9px;

                    .desc {
                        width: 100%;
                        font-weight: 400;
                        font-size: 11px;
                        color: #000000;
                        display: -webkit-box;
                        -webkit-line-clamp: 1;
                        -webkit-box-orient: vertical;
                        overflow: hidden;


                    }

                    .red-desc {
                        width: 100%;
                        position: relative;
                        font-weight: 400;
                        font-size: 11px;
                        color: #EB2323;
                        display: -webkit-box;
                        -webkit-line-clamp: 1;
                        -webkit-box-orient: vertical;
                        overflow: hidden;

                        &::after {
                            content: '';
                            position: absolute;
                            left: 2%;
                            bottom: 0;
                            width: 98%;
                            height: 1px;
                            border-bottom: 1px dashed #DDDDDD;
                        }
                    }

                    .action {
                        display: flex;
                        align-items: center;
                        justify-content: space-between;
                        width: 100%;
                        height: 39px;

                        .tips {
                            font-weight: 400;
                            font-size: 11px;
                            color: #000000;
                            display: -webkit-box;
                            -webkit-line-clamp: 1;
                            -webkit-box-orient: vertical;
                            overflow: hidden;

                            i {
                                font-style: normal;
                                color: #1F63D1;
                            }
                        }
                    }
                }

                .examine-box {
                    display: flex;
                    flex-direction: column;

                    .radio-box {
                        margin-top: 29px;
                        margin-bottom: 27px;

                        .ant-radio-group {
                            margin-left: 29px;
                        }
                    }

                    .textarea {
                        margin-top: 9px;
                        margin-bottom: 29px;
                    }
                }

                .examine-result {
                    display: flex;
                    flex-direction: column;

                    .text-box {
                        margin-bottom: 13px;
                        color: #000000;
                    }

                    .btn-view {
                        display: flex;
                        align-items: center;
                        justify-content: flex-start;
                        width: 100%;
                        margin-top: 19px;
                    }
                }
            }
        }
    }

    .btn-box {
        position: fixed;
        bottom: 0;
        left: 0;
        display: flex;
        align-items: center;
        justify-content: center;
        width: 100%;
        height: 56px;
        background: #FFFFFF;
        box-shadow: 0px -3px 4px 0px rgba(0, 0, 0, 0.11);
        border-radius: 0px 0px 6px 6px;
        margin: 0 auto;
    }
}
</style>