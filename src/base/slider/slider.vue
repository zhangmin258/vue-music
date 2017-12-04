



<template>
	<div class="slider" ref="slider">
		<div class="slider-group" ref="sliderGroup">
			<slot></slot>
		</div>
		<div class="dots">
			<span class="dot" v-for="(dot,index) in dots" :class="{'active': currentPageIndex === index}"></span>
		</div>
	</div>
</template>




<script>

import BScroll from 'better-scroll'
import {addClass} from 'common/js/dom.js' 

export default {
	data(){
		return{
			dots: [],
			currentPageIndex: 0
		}
	},
	props: {
		loop: {   //默认循环轮播
			type: Boolean,
			default: true
		},
		autoPlay: {   //默认自动轮播
			type: Boolean,
			default: true
		},
		interval: {   //轮播间隔时间
			type: Number,
			default: 5000
		}
	},
	mounted(){   //数据加载完毕，执行DOM操作
		setTimeout(() => {
			this._setSliderWidth();
			this._initDots();
			this._initSlider();
			if(this.autoPlay){   //自动轮播
				this._play();
			}
		},20);
		window.addEventListener('resize',() => {
			if(!this.slider){
				return;
			}
			this._setSliderWidth(true);
			this.slider.refresh();
		});
	},
	methods: {
		_setSliderWidth(isResize){
			let width = 0;
			let sliderWidth = this.$refs.slider.clientWidth;
			this.children = this.$refs.sliderGroup.children;
			for(let i=0; i<this.children.length; i++){
				let child = this.children[i];
				addClass(child, 'slider-item');
				child.style.width = sliderWidth + 'px';
				width += sliderWidth;
			}
			if(this.loop && !isResize){   //无限循环滚动
				width += 2 * sliderWidth;
			}
			this.$refs.sliderGroup.style.width = width + 'px';
		},
		_initDots(){
			this.dots = new Array(this.children.length);
		},
		_initSlider(){
			this.slider = new BScroll(this.$refs.slider, {
				scrollX: true,
				scrollY: false,
				// click: true,
				momentum: false,
				snap: true,
		        snapLoop: this.loop,
		        snapThreshold: 0.3,
		        snapSpeed: 400
			});

			this.slider.on('scrollEnd', () => {
				let pageIndex = this.slider.getCurrentPage().pageX;
				if(this.loop){
					pageIndex -= 1;
				}
				this.currentPageIndex = pageIndex;
				if(this.autoPlay){
					clearInterval(this.timer);
					this._play();
				}
			});
		},
		_play(){
			let pageIndex = this.currentPageIndex + 1;
			if(this.loop){
				pageIndex += 1;
			}
			this.timer = setInterval(() => {
				this.slider.goToPage(pageIndex, 0, 400);
			},this.interval);
		}
	},
	destroyed(){
		clearInterval(this.timer);  //销毁组件的时候清除定时器，编程好习惯,有利于内存的释放
	} 
}

</script>





<style lang="stylus" rel="stylesheet/stylus" scoped>
	@import '~common/stylus/variable.styl'

	.slider{
		min-height: 1px;
		.slider-group{
			position: relative;
			overflow: hidden;
			white-space: nowrap;
			.slider-item{
				float: left;
				overflow: hidden;
				text-align: center;
				box-sizing: border-box;
				a{
					display: block;
					width: 100%;
					overflow: hidden;
					text-decoration: none;
					img{
						display: block;
						width: 100%;
					}
				}
			}
		}
		.dots{
			position: absolute;
			left: 0;
			right: 0;
			bottom: 12px;
			text-align: center;
			font-size: 0;
			transform: translateZ(1px);
			.dot{
				display: inline-block;
				width: 8px;
				height: 8px;
				border-radius: 50%;
				margin: 0 4px;
				background: $color-text-l;
				&.active{
					width: 20px;
					border-radius: 20px;
					background: #f90;
				}
			}
		}
	}

</style>

























