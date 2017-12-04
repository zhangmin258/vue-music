

<template>
	<div class="m-header">
		<div class="icon"></div>
		<div class="text">Chicken Music</div>
		<router-link class="mine" tag="div" to="/user">
			<i class="icon-mine"></i>
		</router-link>
	</div>
</template>




<script>

export default {

}


</script>




<style lang="stylus" rel="stylesheet/stylus" scoped>
	@import '~common/stylus/variable.styl';
	@import '~common/stylus/mixin.styl';

	.m-header{
		position: relative;
		height: 44px;
		font-size: 0;
		text-align: center;
		color: $color-theme;
		.icon{
			display: inline-block;
			vertical-align: top;
			width: 30px;
			height: 32px;
			bg-image(logo);
			background-size: 100% 100%;
			background-repeat: no-repeat;
			margin-top: 6px;
			margin-right: 9px;
		}
		.text{
			display: inline-block;
			vertical-align: top;
			line-height: 44px;
			font-size: $font-size-large;
		}
		.mine{
			position: absolute;
			top: 0;
			right: 0;
			.icon-mine{
				display: block;
				padding: 12px;
				font-size: 20px;
				color: $color-theme;
			}
		}
	}

</style>








































