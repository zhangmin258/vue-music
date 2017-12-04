


<template>
	<div ref="wrapper">
		<slot></slot>
	</div>
</template>






<script>

import BScroll from 'better-scroll'

export default {
	props: {
		probeType: {
			type: Number,
			default: 1
		},
		click: {
			type: Boolean,
			default: true
		},
		data: {
			type: Array,
			default: null
		},
		listenScroll: {     //监听滚动事件
			type: Boolean,
			default: false
		},
		pullup: {    //上拉加载
			type: Boolean,
			default: false
		},
		beforeScroll: {   //监听滚动之前的事情
			type: Boolean,
			default: false
		},
		refreshDelay: {
			type: Number,
			default: 20
		}
	},
	mounted(){   //模板编译完毕
		setTimeout(() => {
			this._initScroll();
		}, this.refreshDelay);
	},
	methods :{
		_initScroll(){
			if(!this.$refs.wrapper){
				return;
			}
			this.scroll = new BScroll(this.$refs.wrapper, {
				probeType: this.probeType,
				click: this.click
			});

			if(this.listenScroll){
				let me = this;    //this指向vue的实例
				this.scroll.on('scroll',(pos) => {
					me.$emit('scroll',pos);   //如果这里也用this的话，那么这个this指向的是this.scroll，也就是BScroll的实例化，而并非vue本身的实例化，所以这里为什么要这样写，因为$emit的实例化对象只能是vue本身
				});
			}

			if(this.pullup){
				this.scroll.on('scrollEnd', () => {
					if(this.scroll.y <= (this.scroll.maxScrollY + 50)){
						this.$emit('scrollToEnd');
					}
				});
			}

			if(this.beforeScroll){
				this.scroll.on('beforeScrollStart', () =>{
					this.$emit('beforeScroll');
				});
			}
		},
		enable(){
			this.scroll && this.scroll.enable();
		},
		disable(){
			this.scroll && this.scroll.disable();
		},
		refresh(){
			this.scroll && this.scroll.refresh();
		},
		scrollTo(){
			this.scroll && this.scroll.scrollTo.apply(this.scroll, arguments);
		},
		scrollToElement(){
			this.scroll && this.scroll.scrollToElement.apply(this.scroll, arguments);
		}
	},
	watch: {  // 监听数据发生改变，重新计算scroll的高度
		data(){
			setTimeout(() => {
				this.refresh();
			}, 20);
		}
	}
}




</script>







<style scoped lang="stylus" rel="stylesheet/stylus"></style>











































