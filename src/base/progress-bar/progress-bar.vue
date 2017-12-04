


<template>
	<div class="progress-bar" ref="progressBar" @click="progressClick">
		<div class="bar-inner">
			<div class="progress" ref="progress"></div>
			<div class="progress-btn-wrapper" ref="progressBtn" @touchstart.prevent="progressTouchStart"
			@touchmove.prevent="progressTouchMove"
			@touchend="progressTouchEnd">
				<div class="progress-btn"></div>
			</div>
		</div>
	</div>
</template>




<script>

import {prefixStyle} from 'common/js/dom.js';

const transform = prefixStyle('transform');
const progressBtnWidth = 16;

export default {
	props: {
		percent: {
			type: Number,
			default: 0
		}
	},
	created(){
		this.touch = {};    //创建一个touch的空对象
	},
	methods: {
		progressTouchStart(e){
			this.touch.initiated = true;   //初始化touchstart事件
			this.touch.startX = e.touches[0].pageX;  //鼠标/手指点击按钮的位置相对于屏幕左边的距离
			this.touch.left = this.$refs.progress.clientWidth;  //进度条滚动的距离
			// console.log(this.touch.startX);
		},
		progressTouchMove(e){
			if(!this.touch.initiated){
				return;
			}
			//按钮滑动的距离
			const deltaX = e.touches[0].pageX - this.touch.startX;  
			//按钮从起点到终点的偏移量
			const offsetWidth = Math.min(this.$refs.progressBar.clientWidth - progressBtnWidth, Math.max(0, this.touch.left + deltaX));
			this._offset(offsetWidth);
		},
		progressTouchEnd(){
			this.touch.initiated = false;   //结束touch事件
			this._triggerPercent();  //touch结束之后，派发一个事件，计算移动到该位置时当前的时间
		},
		progressClick(e){
			const rect = this.$refs.progressBar.getBoundingClientRect();
			//console.log(rect.left);   //进度条离屏幕左侧的距离
			//console.log(e.pageX);     //手指在进度条滑动的位置离屏幕左侧的距离
			const offsetWidth = e.pageX - rect.left;
			//console.log(offsetWidth);
			this._offset(offsetWidth);   //progressBar的偏移量
			this._triggerPercent();
		},
		_triggerPercent(){
			const barWidth = this.$refs.progressBar.clientWidth - progressBtnWidth;
			const percent = this.$refs.progress.clientWidth / barWidth;
			this.$emit('percentChange', percent);
		},
		_offset(offsetWidth){
			this.$refs.progress.style.width = `${offsetWidth}px`;
			this.$refs.progressBtn.style[transform] = `translate3d(${offsetWidth}px, 0, 0)`;
		}
	},	
	watch: {
		percent(newPercent){
			if(newPercent >= 0 && !this.touch.initiated){
				const barWidth = this.$refs.progressBar.clientWidth - progressBtnWidth;
				const offsetWidth = newPercent * barWidth;
				this._offset(offsetWidth);
			}
		}
	}
}

</script>






<style scoped lang="stylus" rel="stylesheet/stylus">
	@import '~common/stylus/variable.styl'

	.progress-bar{
		height: 30px;
		.bar-inner{
			position: relative;
			height: 4px;
			top: 13px;
			background: rgba(0, 0, 0, 0.3);
			.progress{
				position: absolute;
				height: 100%;
				background: $color-theme;
			}
			.progress-btn-wrapper{
				position: absolute;
		        left: -8px;
		        top: -13px;
		        width: 30px;
		        height: 30px;
		        .progress-btn{
		        	position: relative;
		        	top: 7px;
		        	left: 7px;
		        	box-sizing: border-box;
		        	width: 16px;
		        	height: 16px;
		        	border: 3px solid $color-text;
		        	border-radius: 50%;
		        	background: $color-theme;
		        }
			}
		}
	}

</style>



































