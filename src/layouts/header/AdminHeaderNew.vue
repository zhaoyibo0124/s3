<template>
  <a-layout-header :class="[headerTheme, 'admin-header']" style="height: 64px; line-height: 64px;">
    <div :class="['admin-header-wide', layout, pageWidth]">
      <router-link v-if="isMobile || layout === 'head'" to="/" :class="['logo', isMobile ? null : 'pc', headerTheme]">
        <img width="32" src="@/assets/img/login-logo.png" />
        <!-- <h1 v-if="!isMobile">{{ systemName }}</h1> -->
      </router-link>
      <a-divider v-if="isMobile" type="vertical" />
      <!-- <a-icon v-if="layout !== 'head'" class="trigger" :type="collapsed ? 'menu-unfold' : 'menu-fold'" @click="toggleCollapse"/> -->
      <div v-if="layout !== 'side' && !isMobile" class="admin-header-menu" :style="`width: ${menuWidth};`">
        <i-menu class="head-menu" :theme="headerTheme" mode="horizontal" :options="menuData" @select="onSelect" />
      </div>
      <div class="logo-custom">
        <router-link to="/index">
          <img width="131" src="@/assets/img/login-logo.png" />
          <span>{{ systemName }}</span>
        </router-link>

        <div class="desc-box">
          <img src="../../assets/img/icon-header1.png" alt="" />
          <span>审查精准化</span>
          <img src="../../assets/img/icon-header2.png" alt="" />
          <span>编制标准化</span>
          <img src="../../assets/img/icon-header3.png" alt="" />
          <span>流程高效化</span>
        </div>
      </div>
      <div :class="['admin-header-right', headerTheme]">
        <!-- <header-search class="header-item" @active="val => searchActive = val" />
          <a-tooltip class="header-item" title="帮助文档" placement="bottom" >
            <a href="https://iczer.gitee.io/vue-antd-admin-docs/" target="_blank">
              <a-icon type="question-circle-o" />
            </a>
          </a-tooltip> -->
        <!-- <header-notice class="header-item"/> -->
        <header-avatar class="header-item" />
        <!-- <a-dropdown class="lang header-item">
            <div>
              <a-icon type="global"/> {{langAlias}}
            </div>
            <a-menu @click="val => setLang(val.key)" :selected-keys="[lang]" slot="overlay">
              <a-menu-item v-for=" lang in langList" :key="lang.key">{{lang.key.toLowerCase() + ' ' + lang.name}}</a-menu-item>
            </a-menu>
          </a-dropdown> -->
      </div>
    </div>
  </a-layout-header>
</template>

<script>
// import HeaderSearch from './HeaderSearch'
// import HeaderNotice from './HeaderNotice'
import HeaderAvatar from './HeaderAvatar'
import IMenu from '@/components/menu/menu'
import { mapState, mapMutations } from 'vuex'

export default {
  name: 'AdminHeader',
  components: { IMenu, HeaderAvatar },
  props: ['collapsed', 'menuData'],
  data() {
    return {
      langList: [
        { key: 'CN', name: '简体中文', alias: '简体' },
        { key: 'HK', name: '繁體中文', alias: '繁體' },
        { key: 'US', name: 'English', alias: 'English' }
      ],
      searchActive: false
    }
  },
  computed: {
    ...mapState('setting', ['theme', 'isMobile', 'layout', 'systemName', 'lang', 'pageWidth']),
    headerTheme() {
      if (this.layout == 'side' && this.theme.mode == 'dark' && !this.isMobile) {
        return 'light'
      }
      return this.theme.mode
    },
    langAlias() {
      let lang = this.langList.find(item => item.key == this.lang)
      return lang.alias
    },
    menuWidth() {
      const { layout, searchActive } = this
      const headWidth = layout === 'head' ? '100% - 188px' : '100%'
      const extraWidth = searchActive ? '600px' : '400px'
      return `calc(${headWidth} - ${extraWidth})`
    }
  },
  methods: {
    toggleCollapse() {
      this.$emit('toggleCollapse')
    },
    onSelect(obj) {
      this.$emit('menuSelect', obj)
    },
    ...mapMutations('setting', ['setLang'])
  }
}
</script>

<style lang="less" scoped>
.admin-header {
  padding: 0;
  z-index: 10;
  position: relative;
  background: #F2F6FA;

  .logo-custom {
    display: flex;
    align-items: center;
    float: left;

    img {
      width: 131px;
      height: 24px;
      margin-right: 9px;
    }

    span {
      font-weight: bold;
      font-size: 18px;
      color: #4F5867;
    }

    .desc-box {
      display: flex;
      align-items: center;
      justify-content: center;
      margin-left: 13px;

      img {
        width: 18px;
        height: 18px;
        margin-left: 14px;
        margin-right: 0;
      }

      span {
        margin-left: 6px;
        font-weight: 400;
        font-size: 12px;
        color: #4F5867;
      }
    }
  }

  .head-menu {
    height: 48px;
    line-height: 48px;
    vertical-align: middle;
    box-shadow: none;
  }

  &.dark {
    background: @header-bg-color-dark;
    color: white;
  }

  &.night {
    .head-menu {
      background: @base-bg-color;
    }
  }

  .admin-header-wide {
    padding-left: 24px;

    &.head.fixed {
      max-width: 1400px;
      margin: auto;
      padding-left: 0;
    }

    &.side {
      padding-right: 12px;
    }

    .logo {
      height: 48px;
      line-height: 48px;
      vertical-align: top;
      display: inline-block;
      padding: 0 12px 0 24px;
      cursor: pointer;
      font-size: 20px;
      color: inherit;

      &.pc {
        padding: 0 12px 0 0;
      }

      img {
        vertical-align: middle;
      }

      h1 {
        color: inherit;
        display: inline-block;
        font-size: 16px;
      }
    }

    .trigger {
      font-size: 20px;
      line-height: 48px;
      padding: 0 24px;
      cursor: pointer;
      transition: color .3s;

      &:hover {
        color: @primary-color;
      }
    }

    .admin-header-menu {
      display: inline-block;
    }

    .admin-header-right {
      float: right;
      display: flex;
      color: inherit;

      .header-item {
        color: inherit;
        padding: 0 12px;
        cursor: pointer;
        align-self: center;

        a {
          color: inherit;

          i {
            font-size: 16px;
          }
        }
      }

      each(@theme-list, {
        &.@{value} .header-item {
          &:hover {
            @class: ~'hover-bg-color-@{value}';
            background-color: @@class;
          }
        }
      })
  }
}
}
</style>
