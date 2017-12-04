


<template>
	<transition name="drop">
		<div class="top-tip" v-show="showFlag" @click.stop="hide()">
			<slot></slot>
		</div>
	</transition>
</template>



<script>

export default {
	data(){
		return {
			showFlag: false
		}
	},
	props: {
		delay: {
			type: Number,
			default: 2000
		}
	},
	methods: {
		show(){
			this.showFlag = true;
			clearTimeout(this.timer);
			this.timer = setTimeout(() => {
				this.hide();
			}, this.delay);
		},
		hide(){
			this.showFlag = false;
		}
	}

}

</script>







<style scoped lang="stylus" rel="stylesheet/stylus">

	@import '~common/stylus/variable.styl';


	.top-tip{
		position: fixed;
		width: 100%;
		top: 0;
		z-index: 500;
		background: $color-dialog-background;
		&.drop-enter-active, &.drop-leave-active{
			transition: all 1s;
		}
		&.drop-enter, &.drop-leave-to{
			transform: translate3d(0, -100%, 0);
		}
	}


</style>
















