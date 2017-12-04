



<template>
	<div class="search-box">
		<i class="icon-search"></i>
		<input type="text" class="box" ref="query" :placeholder="placeholder" v-model="query">
		<i v-show="query" class="icon-dismiss" @click="clear"></i>
	</div>
</template>




<script>

import {debounce} from 'common/js/utill.js';    //节流函数

export default {
	data(){
		return {
			query: ''
		}
	},
	props: {
		placeholder: {
			type: String,
			default: '搜索歌曲、歌手'
		}
	},
	created(){
		this.$watch('query', debounce((newQuery) => {
			//当组件实例创建完成，派发一个query事件，其目的就是将newQuery(input输入框里面的值)传递出去
			this.$emit('query', newQuery);
		}, 200));
	},
	methods: {
		clear(){
			this.query = '';
		},
		setQuery(query){
			this.query = query;    //该方法被父组件调用
		},
		blur(){
			this.$refs.query.blur();
		}
	}
}



</script>




<style scoped lang="stylus" rel="stylesheet/stylus">

	@import '~common/stylus/variable.styl';

	.search-box{
		display: flex;
		width: 100%;
		height: 40px;
		padding: 0 6px;
		box-sizing: border-box;
		background: $color-highlight-background;
		border-radius: 6px;
		align-items: center;   /*垂直居中*/
		.icon-search{
			font-size: 24px;
      		color: $color-background;
		}
		.box{
			flex: 1;
			margin: 0 5px;
			line-height: 18px;
			background: $color-highlight-background;
			color: $color-text;
			font-size: $font-size-medium;
			/*outline: 0;*/
			&::placeholder{
				color: $color-text-d;
			}
		}
		.icon-dismiss{
			font-size: 16px;
      		color: $color-background;
		}
	}



</style>









































