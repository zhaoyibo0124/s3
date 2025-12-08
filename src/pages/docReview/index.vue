<template>
    <div class="bidSubproject" :style="`min-height: ${pageMinHeight}px`">
        <div class="gutter-box">
            <div class="serchInfo" v-if="operation.find">
                <div class="search-box">
                    <a-form-model layout="inline" ref="ruleForm" :model="searchForm">
                        <a-form-model-item label="标段名称">
                            <a-input placeholder="请输入" v-model="searchForm.projectName" allowClear
                                style="width: 180px;" />
                        </a-form-model-item>
                        <a-form-model-item label="标段编号">
                            <a-input placeholder="请输入" v-model="searchForm.projectCode" allowClear
                                style="width: 180px;" />
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
                        <a-form-model-item label="审核日期">
                            <a-range-picker v-model="searchForm.dateRange" :placeholder="['请选择', '请选择']"
                                @change="onChange" style="width: 230px;" />
                        </a-form-model-item>
                        <a-form-model-item style="margin-left: 60px;">
                            <span style="display: inline-block;">
                                <a-button type="primary" @click="handleSearch">查询</a-button>
                                <a-button style="margin-left: 10px" @click="handleReset">重置</a-button>
                            </span>
                        </a-form-model-item>
                    </a-form-model>
                </div>
            </div>
            <div class="content-box" v-if="operation.table" :style="`min-height: ${pageMinHeight}px`">
                <a-table :loading="tableLoading" :columns="columns" :dataSource="dataSource"
                    :rowKey="(record, index) => { return index }" :pagination="tablePagination"
                    style="margin-top: 20px;" :scroll="{ x: 1200 }">
                    <div slot="status" slot-scope="text, record">
                        {{ statusText[record.status] }}
                    </div>
                    <div slot="action" slot-scope="text, record" class="action-btn">
                        <a-button type="link" @click="examineBtn(record)">
                            审核
                        </a-button>
                        <a-button type="link" @click="toViewBtn(record)">
                            查看详情
                        </a-button>
                    </div>
                </a-table>
            </div>
            <!-- :row-selection="{ selectedRowKeys: selectedRowKeys, onChange: onSelectChange }" -->
        </div>
    </div>
</template>
<script>
import { mapState, mapMutations } from 'vuex'
import {
    reviewQueryListApi,
} from '@/services/commentApiList'

export default {
    name: 'docReview',
    data() {
        let self = this
        return {
            queryJsonBasicList: JSON.parse(sessionStorage.getItem('queryJsonBasicList')),		// 存储数据角色
            form: this.$form.createForm(this, { name: 'bidContentSearch' }),
            tableLoading: false,
            // 获取表头
            dataSource: [
                // {
                //     id: 1,
                //     archivesCode: 'BD12345678',
                //     archivesName: '标段名标段名标段名标段名标段名标段名标段名标段名',
                //     projectName: '档案名档案名档案名档案名档案名档案名档案名档案名',
                //     createTime: '2025-09-01 15:36',
                //     status: '1'
                // },
                // {
                //     id: 2,
                //     archivesCode: 'BD12345678',
                //     archivesName: '标段名标段名标段名标段名标段名标段名标段名标段名',
                //     projectName: '档案名档案名档案名档案名档案名档案名档案名档案名',
                //     createTime: '2025-09-01 15:36',
                //     status: '2'
                // },
                // {
                //     id: 3,
                //     archivesCode: 'BD12345678',
                //     archivesName: '标段名标段名标段名标段名标段名标段名标段名标段名',
                //     projectName: '档案名档案名档案名档案名档案名档案名档案名档案名',
                //     createTime: '2025-09-01 15:36',
                //     status: '3'
                // }
            ],
            searchForm: {
                projectName: '',
                projectCode: '',
                status: undefined,
                projectType: undefined,
                dateRange: [],
                startTime: '',
                endTime: ''
            },
            tablePagination: {		// 分页配置
                defaultCurrent: 1,		// 默认的当前页数
                defaultPageSize: 10,	// 默认的每页条数
                hideOnSinglePage: false,	// 只有一页时是否隐藏分页器
                total: 0,		// 数据总数
                pages: 0,		// 总页数
                current: 1,
                onChange: function (page, pageSize) { self.operation.queryList ? self.queryListData(page, pageSize) : '' }
            },
            operation: {
                batch: true,
                download: true,
                add: true,
                delete: true,
                update: true,
                queryList: true,
                find: true,
                table: true
            },
            alertFlag: false,
            defaultData: {},
            alertBatchFlag: false,
            alertBatchTitle: '',
            ids: [],
            selectedRowKeys: [],
            statusText: ['', '待审核', '审核通过', '审核未通过'],
            addFlag: false,
            title: '审核'
        }
    },
    computed: {
        ...mapState('setting', ['pageMinHeight']),
        columns() {
            let { filteredInfo } = this;
            filteredInfo = filteredInfo || {};
            const columns = [
                {
                    title: '序号',
                    key: 'index',
                    fixed: 'left',
                    dataIndex: 'index',
                    customRender: (text, record, index) => `${index + 1}`,
                    width: 60
                },
                {
                    title: '标段编号',
                    dataIndex: 'projectCode',
                },
                {
                    title: '标段名称',
                    dataIndex: 'projectName',
                    ellipsis: true,
                    width: 320
                },
                {
                    title: '上传人',
                    dataIndex: 'createUser',
                },
                {
                    title: '状态',
                    dataIndex: 'status',
                    scopedSlots: { customRender: 'status' },
                    filters: [
                        { text: '待审核', value: '1' },
                        { text: '审核通过', value: '2' },
                        { text: '审核未通过', value: '3' },
                    ],
                    filteredValue: filteredInfo.status || null,
                    onFilter: (value, record) => record.status == value,
                    filterIcon: () => (
                        <a-icon type="filter" style={{ color: '#BFBFBF' }} />
                    ),
                    width: 100
                },
                {
                    title: '上传时间',
                    dataIndex: 'createTime',
                    key: 'createTime',
                    defaultSortOrder: 'ascend',
                    sorter: (a, b) => a.createTime - b.createTime,
                    width: 180
                },
                {
                    title: '操作',
                    dataIndex: 'action',
                    fixed: 'right',
                    scopedSlots: { customRender: 'action' },
                    width: 120
                }
            ]
            return columns;
        }
    },
    created: function () {
        this.queryListData()
        // this.findPowerOperation()
    },
    methods: {
        ...mapMutations('setting', ['showloadding']),
        // findPowerOperation() {
        //     const data = {
        //         id: '486eec60416d4fb19af23e44e0674884'
        //     }
        //     PowerFindPowerOperation(data).then(res => {
        //         this.handleOkLoading = false
        //         const data = res.data
        //         if (data.code == 200) {
        //             this.operation.add = data.data.indexOf('add') > -1
        //             this.operation.delete = data.data.indexOf('delete') > -1
        //             this.operation.update = data.data.indexOf('update') > -1
        //             this.operation.queryList = data.data.indexOf('queryList') > -1
        //             this.operation.find = data.data.indexOf('find') > -1
        //             this.operation.table = data.data.indexOf('table') > -1
        //             if (this.operation.queryList) {
        //                 this.queryListData(this.tablePagination.defaultCurrent, this.tablePagination.defaultPageSize)
        //             }
        //         } else {
        //             this.$message.error(data.msg)
        //         }
        //     })
        // },
        onSelectChange(selectedRowKeys) {
            console.log('selectedRowKeys changed: ', selectedRowKeys);
            this.selectedRowKeys = selectedRowKeys;
        },
        onChange(date, dateString) {
            this.searchForm.startTime = dateString[0]
            this.searchForm.endTime = dateString[1]
        },
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
            // 全局loading隐藏
            this.showloadding(false)
            reviewQueryListApi(data).then(res => {
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
            if (this.operation.queryList) {
                this.queryListData(this.tablePagination.defaultCurrent, this.tablePagination.defaultPageSize)
            }
        },
        // 重置
        handleReset() {
            // 清空表单
            this.searchForm = {
                archivesName: '',
                projectName: '',
                dateRange: [],
                startTime: '',
                endTime: ''
            }
            if (this.operation.queryList) {
                this.queryListData(this.tablePagination.defaultCurrent, this.tablePagination.defaultPageSize)
            }
        },
        // 审核
        examineBtn(record) {
            this.$router.push({ path: '/reviewDetail', query: { id: record.id, type: 'examine' } })
        },
        // 查看
        toViewBtn(record) {
            this.$router.push({ path: '/reviewDetail', query: { id: record.id, type: 'view' } })
        }
    },
}
</script>
<style lang="less" scoped>
.bidSubproject {
    height: 100%;
    margin: 18px;
    background-color: #fff;
}

.gutter-box {
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: flex-start;
}

.serchInfo {
    display: flex;
    flex-direction: column;
    width: 100%;
    padding: 30px 0 30px 30px;
    background-color: #fff;

    .text {
        font-weight: 400;
        font-size: 12px;
        color: #999999;
    }

    .search-box {
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
        flex-direction: column;

        .bt {
            width: 288px;

            span {
                font-weight: bold;
                font-size: 36px;
            }

            span:nth-child(1) {
                color: #000000;
            }

            span:nth-child(2) {
                color: #5D83FF;
            }
        }

        .info-box {
            width: 100%;
            display: flex;
            justify-content: flex-start;
            align-items: center;
        }
    }
}

.download-icon {
    width: 17px;
    height: 18px;
    margin-right: 10px;
}

.export-icon {
    width: 21px;
    height: 21px;
    margin-right: 10px;
}

.add-icon {
    width: 21px;
    height: 21px;
    margin-right: 10px;
}

.my-btn {
    width: 135px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #5D83FF;
    border-color: #5D83FF;
    border-radius: 6px;
}

.select-view {
    display: flex;
    flex-direction: column;
    width: 100%;
    height: auto;
    padding: 0 30px;

    .select-box {
        width: 100%;
        display: flex;
        flex-wrap: nowrap;
        background: #EFF1FF;
        padding: 8px 11px;

        div {
            display: flex;
            align-items: center;
            margin-right: 30px;
            margin-bottom: 14px;
            font-size: 12px;
            color: #222222;

            img {
                width: 16px;
                height: 16px;
                margin-left: 6px;
                cursor: pointer;
            }

            i {
                font-style: normal;
                color: #5D83FF;
            }
        }
    }
}



.content-box {
    height: 100%;
    padding: 0 30px;
    background-color: #fff;

    .action-btn {
        display: flex;
        width: 120px;

        button {
            padding: 0;
        }

        button:nth-child(1) {
            position: relative;
            margin-right: 10px;

            &::after {
                content: '';
                position: absolute;
                top: 10px;
                right: -7px;
                width: 1px;
                height: 11px;
                background: #E9E9E9;
                border-radius: 0px 0px 0px 0px;
            }
        }
    }
}
</style>
<style lang="less">
/* 列表高度因padding和按钮原因被撑高 */
.ant-table-tbody>tr>td {
    padding: 11px 14px;
}

/* loading样式 */
.loaddingSpin>div>.ant-spin {
    position: fixed;
    top: 25%;
}

.loaddingSpin .ant-spin-blur {
    opacity: .9;
}

.loaddingSpin .ant-spin-blur::after {
    background: #000;
    opacity: .1;
}

::v-deep .ant-space-item {
    margin-right: 0 !important;
}
</style>