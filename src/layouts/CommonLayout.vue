<template>
  <div class="common-layout">
		<div class="content">
			<div class="title">{{ systemName }}</div>
			<div class="content-body">
				<div class="conBj"></div>
				<slot></slot>
			</div>
		</div>
  </div>
</template>

<script>
import {mapState} from 'vuex'

export default {
  name: 'CommonLayout',
  computed: {
    ...mapState('setting', ['footerLinks', 'copyright','systemName'])
  }
}
</script>

<style scoped lang="less">
.common-layout{
  display: flex;
  flex-direction: column;
	min-width: 1300px;
  height: 100vh;
  overflow: auto;
  background-color: #fff;
  background-image: url('../assets/img/mainBg.png');
  background-repeat: no-repeat;
  background-size: 100% 100%;
	padding-top: 117px;
	.content{
		width: 100%;
		height: 640px;
		position: relative;
		.title{
			width: 100%;
			text-align: center;
			font-size: 36px;
			font-family: Microsoft YaHei;
			font-weight: bold;
			color: #2450A8;
		}
		.conBj{
			width: 530px;
			height: 370px;
			background-image: url(../assets/img/conBj.png);
			background-repeat: no-repeat;
			background-size: 100% 100%;
		}
		.content-body{
			width: 1000px;
			display: flex;
			align-items: center;
			justify-content: space-between;
			left: 50%;
			margin: 113px auto 0;
		}
	}
}
</style>
