<template>
    <div class="bidSubproject">
        <div class="gutter1-box">
            <div class="serchInfo">
                <a-form-model layout="inline" ref="ruleForm" :model="searchForm">
                    <a-form-model-item label="标段编号">
                        <a-input placeholder="请输入" v-model="searchForm.projectCode" style="width: 170px;" />
                    </a-form-model-item>
                    <a-form-model-item label="标段名称">
                        <a-input placeholder="请输入" v-model="searchForm.projectName" style="width: 170px;" />
                    </a-form-model-item>
                    <!-- <a-form-model-item label="审核状态">
                        <a-select v-model="searchForm.status" placeholder="请选择" style="width: 150px;">
                            <a-select-option v-for="item, index in queryJsonBasicList.projectCategory" :key="index"
                                :value="item.code">{{ item.name }}</a-select-option>
                        </a-select>
                    </a-form-model-item>
                    <a-form-model-item label="文档类别">
                        <a-select v-model="searchForm.projectType" placeholder="请选择" style="width: 150px;">
                            <a-select-option v-for="item, index in queryJsonBasicList.projectType" :key="index"
                                :value="item.code">{{ item.name }}</a-select-option>
                        </a-select>
                    </a-form-model-item> -->
                    <a-form-model-item>
                        <span style="display: inline-block;">
                            <a-button type="primary" @click="handleSearch">查询</a-button>
                            <a-button style="margin-left: 10px" @click="handleReset">重置</a-button>
                        </span>
                    </a-form-model-item>
                </a-form-model>
            </div>
            <div class="content-box">
                <a-button style="margin-bottom: 25px" type="primary" @click="handleAdd">新增</a-button>
                <ul class="my-table">
                    <li v-for="record in dataSource" :key="record.id">
                        <div class="thumbnail">
                            <div
                                :class="['status', record.preparationStatus == 0 ? 'gray' : record.preparationStatus == 1 ? 'blue' : record.preparationStatus == 2 ? 'green' : 'red']">
                                {{ colors[record.preparationStatus] }}
                            </div>
                            <img :src="`${BASE_URL}/examine${record.projectCovertFile}`" alt="">
                        </div>
                        <div class="info">
                            <div class="name">{{ record.projectName }}</div>
                            <div class="code-info">
                                <div class="code">{{ record.projectCode }}</div>
                                <div class="type">{{queryJsonBasicList.projectClassify.filter(item =>
                                    item.code == record.projectClassify).map(item =>
                                        item.name).toString()}}</div>
                            </div>
                            <div class="desc">
                                <div class="time">编制时间:{{ record.createTime }}</div>
                                <div class="actions-box">
                                    <div v-if="record.preparationStatus == 1" class="actions"
                                        @click="handleGoOn(record)">继续编制</div>
                                    <div v-if="record.preparationStatus == 2 && record.isSynchronize == 2"
                                        class="actions" @click="handleExamine(record)">提交审核</div>
                                    <div v-if="record.preparationStatus == 2" class="actions"
                                        @click="handleClick(record)">下载文档</div>
                                </div>
                            </div>
                        </div>
                    </li>
                </ul>
                <a-pagination v-if="dataSource.length > 0" size="small" show-quick-jumper showSizeChanger
                    :default-current="tablePagination.current" :total="tablePagination.total" @change="queryListData"
                    @showSizeChange="queryListData" />
            </div>
        </div>

    </div>
</template>

<script>
const BASE_URL = process.env.VUE_APP_API_BASE_URL
import { mapState, mapMutations } from 'vuex'
import {
    exaUseQueryListApi,
    synchronizeApi
} from '@/services/commentApiList'
export default {
    data() {
        let self = this
        return {
            BASE_URL: BASE_URL,
            queryJsonBasicList: JSON.parse(sessionStorage.getItem('queryJsonBasicList')),		// 存储数据字典
            tableLoading: false,
            dataSource: [],		// 获取数据
            tablePagination: {		// 分页配置
                defaultCurrent: 1,		// 默认的当前页数
                defaultPageSize: 10,	// 默认的每页条数
                hideOnSinglePage: false,	// 只有一页时是否隐藏分页器
                total: 0,		// 数据总数
                pages: 0,		// 总页数
                current: 1,
                showQuickJumper: true,
                showSizeChanger: true,
                onChange: function (page, pageSize) { self.queryListData(page, pageSize) }
            },
            searchForm: {
                projectName: '',
                projectCode: '',
                projectCategory: undefined,
                projectType: undefined,
                projectScale: undefined,
                examineStatus: '2',
            },
            colors: ['', '编制中', '完成']
        }
    },
    computed: {
        ...mapState('setting', ['pageMinHeight']),
    },
    created() {
        this.handleSearch()
    },
    methods: {
        ...mapMutations('setting', ['showloadding']),
        // 获取列表
        queryListData(page, pageSize) {
            if (page) {
                this.tablePagination.current = page
            }
            // 全局loading显示
            this.showloadding(true)
            const data = {
                ...this.searchForm,
                pageNo: page == undefined ? this.tablePagination.defaultCurrent : page,
                pageSize: pageSize == undefined ? this.tablePagination.defaultPageSize : pageSize
            }
            exaUseQueryListApi(data).then(res => {
                // 全局loading隐藏
                this.showloadding(false)
                const data = res.data
                if (data.code == 200) {
                    this.dataSource = data.data.list
                    this.tablePagination.total = data.data.total
                    this.tablePagination.pages = data.data.pages
                } else {
                    this.$message.error(data.msg)
                }
            })
        },
        // 查询
        handleSearch() {
            this.queryListData(this.tablePagination.defaultCurrent, this.tablePagination.defaultPageSize)
        },
        // 重置
        handleReset() {
            // 清空表单
            this.searchForm = {
                projectName: '',
                projectCode: '',
                projectCategory: undefined,
                projectType: undefined,
                projectScale: undefined,
                examineStatus: '2',
            }
            this.queryListData(this.tablePagination.defaultCurrent, this.tablePagination.defaultPageSize)
        },
        handleAdd() {
            this.$router.push('ai')
        },
        // 继续编制
        handleGoOn(record) {
            this.$router.push({ path: '/init', query: { id: record.id } })
        },
        // 提交审核
        handleExamine(record) {
            this.$confirm({
                title: '确定要提交审核吗?',
                onOk() {
                    synchronizeApi({ id: record.id }).then(res => {
                        const data = res.data
                        if (data.code == 200) {
                            this.$message.success('操作成功')
                            this.handleSearch()
                        } else {
                            this.$message.error(data.msg)
                        }
                    })
                },
                onCancel() {
                    console.log('Cancel');
                },
                class: 'test',
            });

        },
        // 下载文档
        handleClick(record) {
            const BASE_URL = process.env.VUE_APP_API_BASE_URL;
			// 模拟下载操作
			let a = document.createElement('a')
			a.href = `${BASE_URL}/examine/examine/exaTemplatePreparation/downTemplateFile?id=${record.id}`
			a.click()
        }
    }
}
</script>

<style lang="less" scoped>
.bidSubproject {
    height: 100%;
    margin: 18px;
}

.gutter1-box {
    display: flex;
    flex-direction: column;

    .serchInfo {
        padding: 18px;
        background-color: #fff;
        margin-bottom: 10px;
    }

    .content-box {
        height: 100%;
        padding: 24px;
        background-color: #fff;

        .my-table {
            width: 100%;
            display: flex;
            flex-wrap: wrap;
            // margin-bottom: 30px;
            padding: 0;

            li {
                display: flex;
                justify-content: flex-start;
                align-items: center;
                width: calc(50% - 60px);
                list-style: none;
                margin-bottom: 20px;

                .thumbnail {
                    width: 81px;
                    height: 112px;
                    box-shadow: 2px 2px 3px 0px rgba(0, 0, 0, 0.11);
                    border-radius: 3px;
                    border: 1px solid #ECECEC;
                    // margin-left: 10px;
                    position: relative;

                    .icon {
                        position: absolute;
                        top: -3px;
                        left: -3px;
                        width: 26px;
                        height: 28px;
                    }

                    .status {
                        position: absolute;
                        top: -3px;
                        left: -3px;
                        width: 35px;
                        height: 36px;
                        padding: 2px 2px;
                        text-align: center;
                        font-weight: bold;
                        font-size: 9px;
                    }

                    .gray {
                        background: url('../../assets/img/icon-gray.png') no-repeat;
                        background-size: 100% 100%;
                        color: #666666;
                    }

                    .blue {
                        background: url('../../assets/img/icon-blue.png') no-repeat;
                        background-size: 100% 100%;
                        color: #1F63D1;
                    }

                    .green {
                        background: url('../../assets/img/icon-green.png') no-repeat;
                        background-size: 100% 100%;
                        color: #23C197;
                    }

                    .red {
                        background: url('../../assets/img/icon-red.png') no-repeat;
                        background-size: 100% 100%;
                        color: #EB2323;
                    }

                    img {
                        width: 81px;
                        height: 112px;
                    }
                }

                .info {
                    width: calc(100% - 94px);
                    display: flex;
                    justify-content: center;
                    align-items: flex-start;
                    flex-direction: column;
                    margin-left: 13px;

                    .name {
                        overflow: hidden;
                        display: -webkit-box;
                        -webkit-line-clamp: 2;
                        /* 设置最大显示行数 */
                        -webkit-box-orient: vertical;
                        text-overflow: ellipsis;
                        margin-bottom: 5px;
                        font-weight: 400;
                        font-size: 14px;
                        color: #222;
                    }

                    .text {
                        font-weight: 400;
                        font-size: 12px;
                        color: #999;
                    }

                    .code-info {
                        display: flex;
                        align-items: center;
                        margin-top: 9px;
                        margin-bottom: 15px;
                    }

                    .code {
                        height: 18px;
                        line-height: 18px;
                        padding: 0px 8px;
                        background: #FFF3ED;
                        border-radius: 12px;
                        // border: 1px solid rgba(153, 153, 153, 0.5);
                        font-size: 11px;
                        font-weight: 400;
                        color: #FF8B77;
                    }

                    .type {
                        height: 18px;
                        line-height: 18px;
                        margin-left: 3px;
                        padding: 0px 8px;
                        background: #E5EFFF;
                        border-radius: 12px;
                        font-size: 11px;
                        font-weight: 400;
                        color: #6561CB;
                    }

                    .desc {
                        display: flex;
                        align-items: center;
                        justify-content: space-between;
                        width: 100%;
                        position: relative;

                        .time {
                            display: flex;
                            justify-content: flex-start;
                            align-items: flex-end;
                            font-size: 12px;
                            color: #999999;
                        }

                        .actions-box {
                            display: flex;
                            justify-content: flex-start;
                            align-items: flex-end;

                            .actions {
                                margin-left: 10px;
                                padding: 5px 18px;
                                border-radius: 3px;
                                border: 1px solid #1F63D1;
                                font-weight: 400;
                                font-size: 12px;
                                color: #1F63D1;
                                cursor: pointer;
                            }

                            .actions:hover {
                                border: 1px solid rgb(64, 169, 255);
                                color: rgb(64, 169, 255);
                            }
                        }

                    }
                }
            }

            li:nth-child(odd) {
                margin-right: 60px;
            }
        }
    }
}
</style>