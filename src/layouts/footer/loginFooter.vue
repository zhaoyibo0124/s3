<template>
  <div class="footer">
    <div class="copyright">
			<span class="texta">地址：河北省石家庄市工农路486号 电话：400-789-8058/8055 E-mail：zbjtwlgs@sina.com</span>
			<span class="textb">Copyright © 河北招标集团网络科技有限公司 备案号 冀ICP备05001022号-1 冀公网安备 13010402001565号</span>
			<span class="textb">访问量:102929970</span>
    </div>
  </div>
</template>

<script>
export default {
  name: 'loginFooter',
  props: ['copyright', 'linkList']
}
</script>

<style lang="less" scoped>
  .footer{
    padding: 30px 16px 24px;
    text-align: center;
    .copyright{
			font-size: 14px;
			font-family: MicrosoftYaHei;
			color: #666666;
      color: @text-color-second;
      font-size: 14px;
			.texta{
				display: block;
				color: #666666;
				line-height: 30px;
			}
			.textb{
				display: block;
				color: #999999;
				line-height: 30px;
			}
    }
  }
</style>
