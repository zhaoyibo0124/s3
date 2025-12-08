<template>
    <div class="bidSubproject" :style="`min-height: ${pageMinHeight}px`">
        <div class="gutter-box">
            <img src="../../assets/img/icon-success.png" alt="">
            <span class="tip">编审完成</span>
            <span class="desc">你已完成对该招标文件的编审</span>
            <span class="name">河北省某某厅啥啥平台啥啥平台项目招标文档</span>
            <a-button type="primary" style="width: 85px;font-size: 12px;" @click="submit">下载文件</a-button>
        </div>
    </div>
</template>

<script>
import { mapState, mapMutations } from 'vuex'
export default {
    data() {
        // let self = this
        return {
            queryJsonBasicList: JSON.parse(sessionStorage.getItem('queryJsonBasicList')),		// 存储数据字典
            num: 7,
            totla: 20,
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
            }
        }
    },
    computed: {
        ...mapState('setting', ['pageMinHeight']),
    },
    methods: {
        ...mapMutations('setting', ['showloadding']),
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
        // 完成校验
        submit() {

        }
    },
    created() {
        // 全局loading显示
        this.showloadding(true)
    },
    mounted() {
        this.showloadding(false)
    }
}
</script>

<style lang="less" scoped>
.bidSubproject {
    display: flex;
    flex-direction: column;
    height: 100%;
    background-color: #fff;

    .gutter-box {
        height: 720px;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;

        img {
            width: 54px;
            height: 54px;
        }

        .tip {
            font-weight: 400;
            font-size: 18px;
            color: #23C197;
        }

        .desc {
            margin-top: 6px;
            font-weight: 400;
            font-size: 11px;
            color: #999999;
        }

        .name {
            margin: 18px 0;
            text-decoration: underline;
            font-weight: 400;
            font-size: 14px;
            color: #1F63D1;
        }
    }
}
</style>