<template>
    <div class="ai-wrap">
        <admin-header :class="[{ 'fixed-tabs': fixedTabs, 'fixed-header': fixedHeader, 'multi-page': multiPage }]"
            :style="headerStyle" />
        <div class="left-menu">
            <div v-for="item in menuData" :key="item.id" :class="['left-menu-item', item.selected ? 'selected' : '']"
                @click="handleClick(item)">
                <img :src="item.icon" :alt="item.name">
                <span>{{ item.name }}</span>
            </div>
        </div>
        <div class="right-menu">
            <router-view :key="$route.fullPath" />
        </div>
    </div>
</template>

<script>
import { mapState } from 'vuex'
import AdminHeader from '../../layouts/header/AdminHeaderNew.vue'
export default {
    components: {
        AdminHeader
    },
    computed: {
        ...mapState('setting', ['isMobile', 'theme', 'layout', 'footerLinks', 'copyright', 'fixedHeader', 'fixedSideBar',
            'fixedTabs', 'hideSetting', 'multiPage']),
        headerStyle() {
            let width = (this.fixedHeader && this.layout !== 'head' && !this.isMobile) ? `100%` : '100%'
            let position = this.fixedHeader ? 'fixed' : 'static'
            return `width: ${width}; position: ${position};top:0px`
        },
    },
    data() {
        return {
            menuData: [
                {
                    id: 1,
                    name: 'AI编标',
                    icon: require('../../assets/img/ai-icon.png'),
                    path: '/index',
                    selected: true
                },
                {
                    id: 2,
                    name: '文件审核',
                    icon: require('../../assets/img/file-icon.png'),
                    path: '/review',
                    selected: false
                }
            ],
        }
    },
    methods: {
        handleClick(item) {
            this.menuData.map(item => {
                item.selected = false
            })
            item.selected = !item.selected
            if (this.$route.path !== item.path) {
                this.$router.push(item.path)
            }
        }
    }
}
</script>

<style lang="less" scoped>
.ai-wrap {
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-top: 48px;
    background: #F2F2F2;

    .left-menu {
        position: fixed;
        left: 0;
        top: 48px;
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        justify-content: flex-start;
        width: 75px;
        height: 100vh;
        box-shadow: 3px 0px 4px 0px rgba(0, 0, 0, 0.11);
        padding: 5px;
        background: #fff;
        z-index: 2;

        .left-menu-item {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            width: 100%;
            height: 69px;
            border-radius: 6px;
            margin-bottom: 5px;
            cursor: pointer;

            img {
                width: 27px;
                height: 27px;
                margin-bottom: 6px;
            }

            span {
                font-weight: 400;
                font-size: 12px;
                color: #000000;
            }

            &:hover {
                background: #E9EFFA;
            }
        }

        .selected {
            background: #E9EFFA;
        }
    }

    .right-menu {
        width: calc(100% - 79px);
        height: 100vh;
        margin-left: 79px;
        z-index: 1;
    }
}
</style>