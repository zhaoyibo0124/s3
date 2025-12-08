<template>
    <div class="step-wrap">
        <ul>
            <li v-for="item in steps" :key="item.id">
                <div class="item">
                    <span :class="item.selected ? 'active' : 'unactived'">
                        {{ item.id }}
                    </span>
                    <i :class="item.selected ? 'active-text' : ''">{{ item.text
                        }}</i>
                </div>
                <div v-if="item.id < 4" :class="item.line ? 'active-line' : 'line'"></div>
            </li>
        </ul>
    </div>
</template>

<script>
export default {
    name: 'Step',
    props: {
        step: {
            type: Number,
            default: 1
        },
        steps: {
            type: Array,
            default: () => {
                return [

                ]
            }
        }
    },
    data() {
        return {

        }
    },
    methods: {
        goStep(row) {
            if (row.line) {
                this.$emit('updateStep', row.id)
            }
        }
    }
}
</script>

<style lang="less" scoped>
.step-wrap {
    display: flex;
    align-items: flex-start;
    justify-content: center;
    width: 182px;
    height: 100%;
    // border-right: 1px solid #DDDDDD;
    margin-right: 24px;
    margin-top: 24px;
    position: relative;
    &::after{
        content: '';
        position: absolute;
        right: 0;
        top: 0;
        width: 1px;
        height: calc(100% - 48px);
        background:#DDDDDD ;
    }
    ul {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        width: 100%;
        height: 100%;
        padding-left: 0;
        margin-bottom: 0;

        li {
            display: flex;
            flex-direction: column;
            align-items: center;
            list-style: none;
            margin-bottom: 60px;

            .item {
                display: flex;
                flex-direction: column;
                align-items: center;
                width: 100%;
                margin-bottom: 50px;

                span {
                    display: inline-block;
                    width: 70px;
                    height: 70px;
                    line-height: 70px;
                    margin-bottom: 16px;
                    text-align: center;
                    font-family: 'SourceHanSansCN-Bold';
                    font-weight: bold;
                    font-size: 30px;
                    cursor: pointer;
                }

                .active {
                    background: url('../../assets/img/step-active-icon.png');
                    background-size: 100% 100%;
                    color: #fff;
                }

                .unactived {
                    background: url('../../assets/img/step-icon.png');
                    background-size: 100% 100%;
                    color: #999999;
                }

                .active-text {
                    color: #1F63D1;
                }

                i {
                    font-style: normal;
                    font-family: 'SourceHanSansCN-Normal';
                    font-size: 16px;
                    color: #999999;
                }
            }

            .line {
                width: 124px;
                height: 12px;
                background: url('../../assets/img/unactived-line.png') no-repeat;
                background-size: 100% 100%;
                transform: rotate(90deg);
            }

            .active-line {
                width: 124px;
                height: 12px;
                background: url('../../assets/img/active-line.png') no-repeat;
                background-size: 100% 100%;
                transform: rotate(90deg);
            }
        }

        li:last-child {
            margin-bottom: 0;
        }
    }
}
</style>