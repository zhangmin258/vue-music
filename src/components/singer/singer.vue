

<template>
	<div class="singer" ref="singer">
		<listview :data="singers" @select="selectSinger" ref="list"></listview>
		<router-view></router-view>
	</div>
</template>







<script>

import ListView from 'base/listView/listView.vue'
import {getSingerList} from 'api/singer.js'
import {ERR_OK} from 'api/config.js'
import Singer from 'common/js/singer.js'
import {mapMutations} from 'vuex'   //写入数据
import {playListMixin} from 'common/js/mixin.js'

const HOT_NAME = '热门';
const HOT_SINGER_LEN = 10;

export default {
	mixins: [playListMixin],   //如果方法同名，组件里面的方法会覆盖掉playListMixin里面的方法
	data(){
		return{
			singers: []
		}
	},
	created(){
		// setTimeout(() => {
		// 	this._getSingerList();
		// }, 1000);
		this._getSingerList();
	},
	methods: {
		handlePlayList(playlist){
			const bottom = playlist.length > 0 ? '60' : '0';
			this.$refs.singer.style['bottom'] = `${bottom}px`;
			this.$refs.list.refresh();
		},
		selectSinger(singer){  //singer为$emit传过来的参数
			// console.log(singer);
			this.$router.push({
				path: `/singer/${singer.id}`
			});
			this.setSinger(singer);   //传入数据
		},
		...mapMutations({
			setSinger: 'SET_SINGER'
		}),
		_getSingerList(){
			getSingerList().then((res) => {
				if(res.code === ERR_OK){
					this.singers = this._normalizeSinger(res.data.list);
					// console.log(this.singers);
				}
			});
		},
		_normalizeSinger(list){
			let map = {
				hot: {
					title: HOT_NAME,
					items: []
				}
			};
			list.forEach((item,index) => {
				if(index < HOT_SINGER_LEN){
					map.hot.items.push(new Singer({
						id: item.Fsinger_mid,
						name: item.Fsinger_name
					}));
				}
				const key = item.Findex;
				if(!map[key]){
					map[key] = {
						title: key,
						items: []
					}
				}
				map[key].items.push(new Singer({
					id: item.Fsinger_mid,
					name: item.Fsinger_name
				}));
			});
			
			// 为了得到有序的列表，我们需要处理map
			let hot = [];
			let ret = [];
			for(let key in map){
				let val = map[key];
				if(val.title.match(/[a-zA-Z]/)){
					ret.push(val);
				}else if(val.title === HOT_NAME){
					hot.push(val);
				}
			}
			//对ret这个数组进行排序
			ret.sort((a,b) => {
				return a.title.charCodeAt(0) - b.title.charCodeAt(0);
			});
			return hot.concat(ret);
		}
	},
	components: {
		'listview': ListView
	}
}

</script>





<style lang="stylus" rel="stylesheet/stylus" scoped>
	@import '~common/stylus/variable.styl'
	
	.singer{
		position: fixed;
		width: 100%;
		top: 88px;
		bottom: 0
	}





</style>
























