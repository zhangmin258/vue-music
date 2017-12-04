

<template>
	<scroll class="listview" :data="data" ref="listview" :listenScroll="listenScroll" :probeType="probeType" @scroll="scroll">
		<ul>
			<li v-for="group in data" class="list-group" ref="listGroup">
				<h2 class="list-group-title">{{group.title}}</h2>
				<ul>
					<li v-for="item in group.items" class="list-group-item" @click="selectItem(item)">
						<img v-lazy="item.avatar" :alt="item.name" class="avatar" width="50" height="50">
						<span class="name">{{item.name}}</span>
					</li>
				</ul>
			</li>
		</ul>
		<div class="list-shortcut" @touchstart="onShortcutTouchStart($event)" @touchmove="onShortcutTouchMove($event)">
			<ul>
				<li v-for="(item,index) in shortcutList" class="item" :data-index="index" :class="{'current': currentIndex === index}">{{item}}</li>
			</ul>
		</div>
		<div class="list-fixed" v-show="fixedTitle" ref="fixed">
			<h1 class="fixed-title">{{fixedTitle}}</h1>
		</div>
		<div class="loading-container" v-show="!data.length">
			<loading></loading>
		</div>
	</scroll>
</template>




<script>

import Scroll from 'base/scroll/scroll.vue'
import Loading from 'base/loading/loading.vue'
import {getData} from 'common/js/dom.js'

const ANCHOR_HEIGHT = 18;   //通过计算，每个元素的高度为18px，为固定值
const TITLE_HEIGHT = 30;    //标题的高度

export default {
	data(){
		return{
			currentIndex: 0,
			scrollY: -1,
			diff: -1,
			item1: 123
		}
	},
	created(){    //组件实例创建完毕
		this.touch = {};
		this.listenScroll = true;
		this.listHeight = [];
		this.probeType = 3;
	},
	props: {
		data: {
			type: Array,
			default: []
		}
	},
	computed: {
		shortcutList(){
			return this.data.map((item) => {
				return item.title.substr(0,1);
			});
		},
		fixedTitle(){
			if(this.scrollY > 0){
				return '';
			}
			return this.data[this.currentIndex] ? this.data[this.currentIndex].title : '';
		}
	},
	methods: {
		refresh(){
			this.$refs.listview.refresh();
		},
		selectItem(item){
			this.$emit('select',item);   //点击派发select这个事件，并且把item当做参数传过去
		},
		onShortcutTouchStart(e){
			let anchorIndex = getData(e.target, 'index');  //获取第一次点击该元素的索引值
			this.$refs.listview.scrollToElement(this.$refs.listGroup[anchorIndex],0);
			let firstTouch = e.touches[0];
			this.touch.y1 = firstTouch.pageY;
			this.touch.anchorIndex = anchorIndex;  
			this._scrollTo(anchorIndex);
		},
		onShortcutTouchMove(e){
			let firstTouch = e.touches[0];
			this.touch.y2 = firstTouch.pageY;
			let delta = (this.touch.y2 - this.touch.y1) / ANCHOR_HEIGHT | 0;   //向下取整
			let anchorIndex = parseInt(this.touch.anchorIndex) + delta;  //获取移动到目标元素的索引值
			// console.log(anchorIndex);
			this._scrollTo(anchorIndex);
		},
		scroll(pos){
			this.scrollY = pos.y;
		},
		_scrollTo(index){
			if(!index && index != 0){
				return;
			}
			if(index < 0){
				index = 0
			}else if(index > this.listHeight.length -2){
				index = this.listHeight.length - 2;
			}
			this.scrollY = -this.listHeight[index];
			this.$refs.listview.scrollToElement(this.$refs.listGroup[index],0);
			// console.log(index);
		},
		_calculateHeight(){
			this.listHeight = [];
			let height = 0;
			this.listHeight.push(height);
			let list = this.$refs.listGroup;
			for(let i=0; i<list.length; i++){
				let item = list[i];
				height += item.clientHeight;
				this.listHeight.push(height);
			}
			// console.log(this.listHeight);
		}
	},
	watch: {
		data(){
			setTimeout(() => {
				this._calculateHeight();
			}, 20);
		},
		scrollY(newY){   //newY为滚动条滚动的高度
			let listHeight = this.listHeight;
			//当滚动到顶部，newY>0
			if(newY > 0){
				this.currentIndex = 0;
				return;
			}
			//在中间部分滚动
			for(let i=0; i<listHeight.length - 1; i++){
				let height1 = listHeight[i];   //上限
				let height2 = listHeight[i+1]; //下限
				if(-newY >= height1 && -newY < height2){
					this.currentIndex = i;
					this.diff = height2 + newY; //下限的高度减去滚动条的高度
					return;
				}
			}
			//当滚动到底部，且-newY大于最后一个元素的上限
			this.currentIndex = listHeight.length - 2;
		},
		diff(newVal){   //监听this.diff值的变化
			let fixedTop = (newVal > 0 && newVal < TITLE_HEIGHT) ? newVal - TITLE_HEIGHT : 0;
			if(this.fixedTop == fixedTop){
				return;
			}
			this.fixedTop = fixedTop;
			this.$refs.fixed.style.transform = `translate3d(0, ${fixedTop}px, 0)`;
		}
	},
	components: {
		'scroll': Scroll,
		'loading': Loading
	}
}


</script>




<style lang="stylus" rel="stylesheet/stylus" scoped>
	@import '~common/stylus/variable.styl'

	.listview{
		position: relative;
		width: 100%;
		height: 100%;
		overflow: hidden;
		background: $color-background;
		ul{
			.list-group{
				padding-bottom: 30px;
				.list-group-title{
					height: 30px;
					line-height: 30px;
					padding-left: 20px;
					font-size: $font-size-small;
	        		color: $color-text-l;
	        		background: $color-highlight-background;
				}
				ul{
					.list-group-item{
						display: flex;
						padding: 20px 0 0 30px;
						align-items: center;
						.avatar{
							flex: 0 0 50px;
							width: 50px;
							height: 50px;
							border-radius: 50%;
						}
						.name{
							flex: 1;
							color: $color-text-l;
          					font-size: $font-size-medium;
          					margin-left: 20px;
						}
					}
				}
			}
		}
		.list-shortcut{
			position: absolute;
		    z-index: 30;
		    right: 0;
		    top: 50%;
		    transform: translateY(-50%);
		    width: 20px;
		    padding: 20px 0;
		    border-radius: 10px;
		    text-align: center;
		    background: $color-background-d;
		    font-family: Helvetica;
			.item{
				padding: 3px;
	        	line-height: 1;
	        	color: $color-text-l;
	        	font-size: $font-size-small;
	        	&.current{
	        		color: $color-theme;
	        	}
			}
		}
		.list-fixed{
			position: absolute;
			width: 100%;
			left: 0;
			top: 0;
			.fixed-title{
				height: 30px;
				line-height: 30px;
				padding-left: 20px;
				font-size: $font-size-small;
        		color: $color-text-l;
        		background: $color-highlight-background;
			}
		}
		.loading-container{
			position: absolute;
			width: 100%;
			top: 50%;
			transform: translateY(-50%);
		}
	}

</style>




























