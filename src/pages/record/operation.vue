<template>
    <a-modal :bodyStyle="{ padding: 0 }" title="" :visible="visible" @cancel="handleCancel" :footer="null"
        :maskClosable="false" :closable="false" centered width="100%">
        <div class="bidSubproject">
            <div class="gutter-box">
                <div class="left-box"></div>
                <div class="right-box" v-if="title == '审核' && !show">
                    <div class="red-text">*该招标文件共检查出{{ num }}类，累计{{ total }}处建议修复内容~</div>
                    <div class="type-box">
                        <a-icon type="left" style="font-size: 22px;color: #999;cursor: pointer;" @click="prevContent" />
                        <div class="type-data">
                            <div :class="['type-item', colors[index]]"
                                v-for="item, index in types.slice((currentIndex - 1) * 4)" :key="index"
                                @click="handleClick(item)">
                                <span class="bt">{{ item.num }}<i>处</i></span>
                                <span class="desc">{{ item.name }}</span>
                            </div>
                        </div>
                        <a-icon type="right" style="font-size: 22px;color: #999;cursor: pointer;"
                            @click="nextContent" />
                    </div>
                    <div class="content-box">
                        <div :class="['content-item', colors[selectData.id]]">
                            <div class="desc">
                                “污水沿污水管网汇至东疏港路主千管网通过提升泵站最终排至市政污水处理厂处理”中，
                            </div>
                            <div class="red-desc">
                                “千管网通过提升”疑为错别字
                            </div>
                            <div class="action">
                                <div class="tips">建议修改为<i>“千管网通过提升”</i></div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="right-box" v-if="title == '审核' && show">
                    <div class="content-box">
                        <div class="radio-box">
                            审核意见<a-radio-group v-model="examineStatus" :options="options" />
                        </div>
                        <div>
                            备注
                        </div>
                        <div class="textarea">
                            <a-textarea v-model="reason" placeholder="请填写审核备注"
                                :auto-size="{ minRows: 5, maxRows: 8 }" />
                        </div>
                        <div class="btn-view">
                            <a-button type="primary" @click="confirm" style="width: 71px;">确定</a-button>
                        </div>
                    </div>
                </div>
                <div class="right-box" v-if="title == '查看'">
                    <div class="content-box">
                        <div class="text-box" style="margin-top: 29px;">
                            审核意见:啥啥名称啥啥名称啥啥名称啥啥名称啥啥名 啥啥名称啥啥名称啥啥名称啥啥
                        </div>
                        <div class="text-box">
                            审核状态：审核通过、审核未通过
                        </div>
                        <div class="text-box">
                            审核时间：2025-06-12 13:56
                        </div>
                        <div class="text-box">
                            审核人：张三
                        </div>
                        <div class="text-box">
                            创建人：李四
                        </div>
                        <div class="text-box">
                            创建时间：2025-06-12 13:56
                        </div>
                        <div class="btn-view">
                            <a-button @click="handleRecord"
                                style="width: 127px;border-color: #1F63D1;color: #1F63D1;">查看历史版本</a-button>
                        </div>
                    </div>
                </div>
            </div>
            <!-- <div class="btn-box">
                <a-button type="primary" @click="submit">审核</a-button>
            </div> -->
        </div>
    </a-modal>
</template>

<script>
export default {
    name: 'addModal',
    props: ['title', 'defaultData'],
    data() {
        return {
            visible: true,
            queryJsonBasicList: JSON.parse(sessionStorage.getItem('queryJsonBasicList')),		// 存储数据字典
            num: 7,
            total: 20,
            types: [
                {
                    id: 0,
                    name: '文件常规性',
                    num: 3,
                },
                {
                    id: 1,
                    name: '时间节点合规性',
                    num: 5,
                },
                {
                    id: 2,
                    name: '保证金合规性',
                    num: 6,
                },
                {
                    id: 3,
                    name: '提交时间审核',
                    num: 10,
                },
                {
                    id: 4,
                    name: '其他审核',
                    num: 2,
                }
            ],
            colors: ['blue', 'orange', 'green', 'brown', 'purple'],
            currentIndex: 1,
            selectData: {
                id: 0
            },
            show: false,
            options: [{ label: '审核通过', value: 1 }, { label: '审核不通过', value: 2 }],
            examineStatus: '',
            reason: ''
        }
    },
    methods: {
        nextContent() {
            // 切换到下一个内容，如果已经是最后一个，则循环到第一个
            this.currentIndex = (this.currentIndex + 1) % this.types.length;
        },
        prevContent() {
            // 切换到前一个内容，如果已经是第一个，则循环到最后一个
            this.currentIndex = (this.currentIndex - 1 + this.types.length) % this.types.length;
        },
        // 切换
        handleClick(row) {
            this.selectData = row
        },
        // 审核
        submit() {
            this.show = true
        },
        // 审核提交
        confirm() {
            if (this.examineStatus == '') {
                this.$message.warn('请选择审核意见')
                return
            }
            if (this.examineStatus == 2 && !this.reason) {
                this.$message.warn('请填写审核备注')
                return
            }
            this.$emit('confirmValue', '')
        },
        // 查看历史版本
        handleRecord() {
            this.$router.push('/record')
        },
        handleCancel() {
            this.$emit('cancelValue', '')
        },
    }
}
</script>

<style lang="less" scoped>
.bidSubproject {
    display: flex;
    flex-direction: column;
    // height: 100%;
    padding: 18px 18px 0 18px;
    background-color: #fff;

    .gutter-box {
        display: flex;

        .left-box {
            display: flex;
            width: calc(100% - 489px);
            height: 640px;
            background: #F5F9FF;
            border-radius: 6px;
        }

        .right-box {
            display: flex;
            flex-direction: column;
            width: 489px;
            height: 640px;
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
                        min-width: 84px;
                        height: 51px;
                        border-radius: 3px;
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
                display: flex;
                flex-direction: column;
                overflow: hidden;
                overflow-y: auto;
                margin: 0 29px;

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

                            i {
                                font-style: normal;
                                color: #1F63D1;
                            }
                        }
                    }
                }

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

    .btn-box {
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