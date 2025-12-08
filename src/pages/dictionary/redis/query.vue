<template>
<a-card :bordered="false">
  <div>
    <a-form-model :model="form" style="max-width: 500px; margin: 40px auto 0;">
      <a-form-item :wrapperCol="{span: 17, offset: 7}">
        <a-button type="primary" @click="create">创建缓存</a-button>
      </a-form-item>
      <a-form-item :wrapperCol="{span: 17, offset: 7}">
        <a-button type="primary" @click="reset">重置缓存</a-button>
      </a-form-item>
    </a-form-model>
  </div>
</a-card>
</template>

<script>
    import {
      RedisCreateCache,
      RedisResetCache
	  } from '@/services/commentApiList'
    export default {
        name: 'detail',
        data() {
            return {
              form: {}
            }
        },
    created() {
		},
    methods: {
        create(){
          RedisCreateCache().then(res => {
            const data = res.data
            if (data.code == 200) {
              this.$message.success('创建缓存成功')
            } else {
              this.$message.error(data.msg)
            }
          })
        },
        reset(){
          RedisResetCache().then(res => {
            const data = res.data
            if (data.code == 200) {
              this.$message.success('重置缓存成功')
            } else {
              this.$message.error(data.msg)
            }
          })
        }
    }
    }
</script>

<style scoped>

</style>
