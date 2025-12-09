<template>
    <div class="bidSubproject">
        <div class="back-box" v-html="backText" @click="back"></div>
        <div class="gutter-box">
            <div class="left-box">
                <Wps ref="wps" v-if="show" :detailData="detailData" />
            </div>
            <!-- <div class="right-box">
                <div class="bt-box">
                    <img src="../../assets/img/icon1.png" alt="">
                    <span class="name">Hi~我是智能助手</span>
                </div>
                <div class="nav-box">
                    <a-button type="primary" @click="submit">商务条款</a-button>
                    <a-button style="margin-left: 5px;" @click="submit">解决争议方式</a-button>
                </div>
                <div class="content-box">
                    <div class="checkbox-flex">
                        <a-checkbox v-for="item in items" :key="item.id" :value="item.value">
                            <p class="checkbox-item">{{ item.label }}</p>
                        </a-checkbox>
                    </div>
                    <div class="btn-flex">
                        <a-button style="width:80px" type="primary" @click="submit">完成</a-button>
                    </div>
                </div>
                <div class="ai-box">

                </div>
            </div> -->
        </div>
        <div class="btn-box">
            <a-button style="margin-right:15px" @click="AppletFullEdit()">全屏编辑</a-button>
            <a-button style="margin-right:15px" @click="SaveFile">保存文档</a-button>
            <a-button type="primary" @click="submit">生成正文</a-button>
        </div>
    </div>
</template>

<script>

import {
    infoEntryDetailApi,
    updatePreparationStatusApi
} from '@/services/commentApiList'
import { mapState, mapMutations } from 'vuex'
import Wps from '../../components/wps'
export default {
    components: {
        Wps
    },
    data() {
        // let self = this
        return {
            backText: '<返回',
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
            items: [
                {
                    label: '商务条款内容商务条款内容商务条款，内容商务条款内容商务条款内容商务条款内容商务条款内容。商务条款内容，商务条款内容商务条款内容商务条款内容。',
                    value: 1
                },
                {
                    label: '模糊查询结果标题模糊查询结果标题模糊查询结果',
                    value: 2
                },
                {
                    label: '哈哈',
                    value: 3
                },
                {
                    label: '商务条款内容商务条款内容商务条款，内容商务条款内容商务条款内容商务条款内容商务条款内容。商务条款内容，商务条款内容商务条款内容商务条款内容。',
                    value: 4
                },
                {
                    label: '模糊查询结果标题模糊查询结果标题模糊查询结果',
                    value: 5
                },
                {
                    label: '哈哈',
                    value: 6
                },
                {
                    label: '商务条款内容商务条款内容商务条款，内容商务条款内容商务条款内容商务条款内容商务条款内容。商务条款内容，商务条款内容商务条款内容商务条款内容。',
                    value: 7
                },
            ],
            detailData: {},
            show:false
        }
    },
    computed: {
        ...mapState('setting', ['pageMinHeight']),
    },
    created() {
        this.getDetail()
    },
    methods: {
        ...mapMutations('setting', ['showloadding']),
        back() {
            this.$router.go(-1)
        },
        getDetail() {
            infoEntryDetailApi({
                id: this.$route.query.id
            }).then(res => {
                // 全局loading隐藏
                this.showloadding(false)
                const data = res.data
                if (data.code == 200) {
                    this.detailData = data.data
                    this.show = true
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
        handleClick(row) {
            this.selectData = row
        },
        // 替换
        handleReplace() {

        },
        // 忽略
        handleIgnore() {

        },
        // 生成正文
        submit() {
            this.showloadding(true)
            this.$refs.wps.SaveFile()
            updatePreparationStatusApi({
                id: this.$route.query.id
            }).then(res => {
                // 全局loading隐藏
                this.showloadding(false)
                const data = res.data
                if (data.code == 200) {
                    this.$message.success('操作成功')
                    this.$router.go(-1)
                } else {
                    this.$message.error(data.msg)
                }
            })
        },
        // 
        AppletFullEdit(){
            this.$refs.wps.AppletFullEdit()
        },
        SaveFile(){
            this.$refs.wps.SaveFile()
        }
        
    },
}
</script>

<style lang="less" scoped>
.bidSubproject {
    display: flex;
    flex-direction: column;
    height: 100%;
    padding: 18px 0px 0 18px;
    background-color: #fff;
    .back-box {
        display: flex;
        margin-top: 0px;
        margin-bottom: 10px;
        cursor: pointer;
    }
    .gutter-box {
        display: flex;
        margin-right: 0px;
        .left-box {
            display: flex;
            // width: calc(100% - 489px);
            width: 100%;
            height: 940px;
            background: #F5F9FF;
            border-radius: 6px;
        }

        .right-box {
            display: flex;
            flex-direction: column;
            width: 489px;
            height: 940px;
            background: #FFFFFF;
            margin-left: 19px;

            .bt-box {
                display: flex;
                justify-content: flex-start;
                align-items: center;
                height: 30px;

                img {
                    width: 30px;
                    height: 30px;
                }

                .name {
                    margin-left: 6px;
                    font-weight: bold;
                    font-size: 18px;
                    color: #000000;
                }
            }

            .nav-box {
                margin-top: 24px;
            }

            .content-box {
                width: 100%;
                height: 356px;
                display: flex;
                flex-direction: column;
                align-items: flex-start;
                justify-content: flex-start;
                box-shadow: 0px 0 20px 0px rgba(31, 99, 209, 0.16);
                border-radius: 6px;
                margin-top: 8px;
                margin-bottom: 17px;
                padding-left: 18px;

                .checkbox-flex {
                    width: 100%;
                    height: 295px;
                    display: flex;
                    flex-direction: column;
                    align-items: flex-start;
                    justify-content: flex-start;
                    margin-top: 20px;
                    overflow: hidden;
                    overflow-y: scroll;
                }

                .btn-flex {
                    width: 100%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    margin-bottom: 9px;
                }
            }

            .ai-box {
                display: flex;
                align-items: center;
                justify-content: center;
                width: 100%;
                height: 256px;
                background: #FFFFFF;
                border-radius: 6px;
                border: 1px solid #6996E0;
            }
        }
    }

    .btn-box {
        position: fixed;
        left: 98px;
        bottom: 0px;
        display: flex;
        align-items: center;
        justify-content: center;
        width: calc(100% - 82px);
        height: 56px;
        background: #FFFFFF;
        box-shadow: 0px -3px 4px 0px rgba(0, 0, 0, 0.11);
        border-radius: 0px 0px 6px 6px;
        margin: 0 auto;
    }
}
</style>
<style lang="less" scoped>
::v-deep .ant-checkbox-wrapper {
    display: flex;
    align-items: flex-start;
}

.ant-checkbox-wrapper+.ant-checkbox-wrapper {
    margin-left: 0px;
}

::v-deep .ant-checkbox {
    top: 3px;
}
</style>