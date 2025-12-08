<template>
<a-card :bordered="false">
  <div>
    <a-form-model :model="form" style="max-width: 500px; margin: 40px auto 0;">
      <a-form-item :label="'自定义表单'" :labelCol="{span: 7}" :wrapperCol="{span: 17}">
        <a-select v-model="form.formId" placeholder="请选择" @change="queryAllList(form.formId)" show-search option-filter-prop="children">
					<a-select-option v-for="(item,index) in formList" :value="item.value" :key="index">
						{{item.key}}
					</a-select-option>
				</a-select>
      </a-form-item>
      <a-form-item :label="'显示字段集合'" :labelCol="{span: 7}" :wrapperCol="{span: 17}">
        <a-checkbox-group v-model="form.displayList" :options="returnList" />
      </a-form-item>
      <a-form-item :label="'操作字段集合'" :labelCol="{span: 7}" :wrapperCol="{span: 17}">
        <a-checkbox-group v-model="form.operationList" :options="columnList" />
      </a-form-item>
      <a-form-item :label="'查询字段集合'" :labelCol="{span: 7}" :wrapperCol="{span: 17}">
        <a-checkbox-group v-model="form.queryList" :options="queryList" />
      </a-form-item>
      <a-form-item :label="'导出字段集合'" :labelCol="{span: 7}" :wrapperCol="{span: 17}">
        <a-checkbox-group v-model="form.exportList" :options="exportList" />
      </a-form-item>
      <a-form-item :wrapperCol="{span: 17, offset: 7}">
        <span style="display: inline-block;">
          <a-button type="primary" @click="add">设置</a-button>
          <a-button style="margin-left: 8px" @click="clean">清除</a-button>
        </span>
      </a-form-item>
    </a-form-model>
  </div>
</a-card>
</template>

<script>
    import {
      CustomizeFormQueryList,
      CustomizeColumnQueryList,
      CustomizeQueryQueryList,
      CustomizeReturnQueryList,
      CustomizeSetUpFind,
      CustomizeSetUpAdd
	  } from '@/services/commentApiList'
    export default {
        name: 'detail',
        data() {
            return {
                queryJsonBasicList: JSON.parse(sessionStorage.getItem('queryJsonBasicList')),		// 存储数据角色
                form: {
                    formId: undefined,
                    displayList: [],
                    operationList: [],
                    queryList: [],
                    exportList: []
                },
                formList: [],
                columnList: [],
                returnList: [],
                queryList: [],
                exportList: []
            }
        },
    created() {
			this.queryFormList()
		},
    methods: {
        queryFormList() {
          const data = {
            pageNo: -1,
            pageSize: 10,
          }
          CustomizeFormQueryList(data).then(res => {
            const data = res.data
            if (data.code == 200) {
              this.formList = []
              let formList = []
              data.data.list.forEach(item => {
                let template = {}
                template.value = item.id
                template.key = item.formName
                formList.push(template)
              })
              this.formList = formList
            } else {
              this.$message.error(data.msg)
            }
          })
        },
        queryAllList(formId){
          this.queryReturnList(formId)
          this.queryColumnList(formId)
          this.queryQueryList(formId)
          this.FindSetUp(formId)
        },
        queryReturnList(formId) {
          const data = {
            formId: formId,
            pageNo: -1,
            pageSize: 10,
          }
          CustomizeReturnQueryList(data).then(res => {
            const data = res.data
            if (data.code == 200) {
              this.returnList = []
              let returnList = []
              data.data.list.forEach(item => {
                let template = {}
                template.value = item.id
							  template.label = item.returnNotes
                returnList.push(template)
              })
              this.returnList = returnList
            } else {
              this.$message.error(data.msg)
            }
          })
        },
        queryColumnList(formId) {
          const data = {
            formId: formId,
            pageNo: -1,
            pageSize: 10,
          }
          CustomizeColumnQueryList(data).then(res => {
            const data = res.data
            if (data.code == 200) {
              this.columnList = []
              let columnList = []
              data.data.list.forEach(item => {
                let template = {}
                template.value = item.id
                template.label = item.columnNotes
                columnList.push(template)
              })
              this.columnList = columnList
              this.exportList = columnList
            } else {
              this.$message.error(data.msg)
            }
          })
        },
        queryQueryList(formId) {
          const data = {
            formId: formId,
            pageNo: -1,
            pageSize: 10,
          }
          CustomizeQueryQueryList(data).then(res => {
            const data = res.data
            if (data.code == 200) {
              this.queryList = []
              let queryList = []
              data.data.list.forEach(item => {
                let template = {}
                template.value = item.id
							  template.label = item.queryNotes
                queryList.push(template)
              })
              this.queryList = queryList
            } else {
              this.$message.error(data.msg)
            }
          })
        },
        FindSetUp(formId) {
          const data = {
            id: formId
          }
          CustomizeSetUpFind(data).then(res => {
            const data = res.data
            if (data.code == 200) {
              this.form.displayList = []
              this.form.operationList = []
              this.form.queryList = []
              this.form.exportList = []
              let displayList = []
              let operationList = []
              let queryList = []
              let exportList = []
              data.data.forEach(item => {
                if(item.isDisplay == '1'){
                  displayList.push(item.returnId)
                }
                if(item.isOperation == '1'){
                  operationList.push(item.columnId)
                }
                if(item.isQuery == '1'){
                  queryList.push(item.queryId)
                }
                if(item.isExport == '1'){
                  exportList.push(item.exportId)
                }
              })
              this.form.displayList = displayList
              this.form.operationList = operationList
              this.form.queryList = queryList
              this.form.exportList = exportList
            } else {
              this.$message.error(data.msg)
            }
          })
        },
        add(){
          const data = {
            formId: this.form.formId,
            displayList: this.form.displayList,
            operationList: this.form.operationList,
            queryList: this.form.queryList,
            exportList : this.form.exportList
          }
          CustomizeSetUpAdd(data).then(res => {
            const data = res.data
            if (data.code == 200) {
              this.$message.success('设置成功！')
              this.form.formId = undefined
              this.form.displayList = []
              this.form.operationList = []
              this.form.queryList = []
              this.form.exportList = []
              this.columnList = []
              this.returnList = []
              this.queryList = []
              this.exportList = []
            } else {
              this.$message.error(data.msg)
            }
          })
        },
        clean(){
          this.form.formId = undefined
          this.form.displayList = []
          this.form.operationList = []
          this.form.queryList = []
          this.form.exportList = []
          this.columnList = []
          this.returnList = []
          this.queryList = []
          this.exportList = []
        }
    }
    }
</script>

<style scoped>

</style>
