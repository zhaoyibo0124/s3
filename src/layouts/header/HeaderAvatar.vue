<template>
  <a-dropdown>
    <div class="header-avatar" style="cursor: pointer">
      <a-avatar class="avatar" size="small" shape="circle" :src="user.userHead" />
      <span class="name">{{ user.name }}</span>
    </div>
    <a-menu :class="['avatar-menu']" slot="overlay">
      <!-- <a-menu-item>
        <a-icon type="user" />
        <span>个人中心</span>
      </a-menu-item>
      <a-menu-item>
        <a-icon type="setting" />
        <span>设置</span>
      </a-menu-item>
      <a-menu-divider /> -->
      <a-menu-item @click="logout">
        <a-icon style="margin-right: 8px;" type="poweroff" />
        <span>退出登录</span>
      </a-menu-item>
    </a-menu>
  </a-dropdown>
</template>

<script>
import { mapGetters } from 'vuex'
import {
  Logout
} from '@/services/commentApiList'

export default {
  name: 'HeaderAvatar',
  computed: {
    ...mapGetters('account', ['user']),
  },
  methods: {
    logout() {
      Logout().then(res => {
        const data = res.data
        if (data.code == 200) {
          const code = sessionStorage.getItem('code')
          if (code == '' || code == null || code == undefined) {
            this.$router.push('/login')
          } else {
            this.$router.push('/login?code=' + code)
          }
          // 退出后将动态添加的路由清除
          this.$router.options.routes[4].children = []
        } else {
          this.$message.error(data.msg)
        }

      })
    }
  }
}
</script>

<style lang="less">
.header-avatar {
  display: inline-flex;

  .avatar,
  .name {
    align-self: center;
  }

  .avatar {
    margin-right: 8px;
  }

  .name {
    font-weight: 500;
  }
}

.avatar-menu {
  width: 150px;
}
</style>
