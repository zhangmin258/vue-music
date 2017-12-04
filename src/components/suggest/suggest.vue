


<template>
	<scroll class="suggest" :data="result" :pullup="pullup" :beforeScroll="beforeScroll" @scrollToEnd="searchMore" @beforeScroll="listScroll" ref="suggest">
		<ul class="suggest-list">
			<li class="suggest-item" v-for="item in result" @click="selectItem(item)">
				<div class="icon">
					<i :class="getIconCls(item)"></i>
				</div>
				<div class="name">
					<p class="text" v-html="getDisplayName(item)"></p>
				</div>
			</li>
			<loading v-show="hasMore" title="正在加载中..."></loading>
		</ul>
		<div class="no-result-wrapper" v-show="!hasMore && result.length == 0">
			<no-result title="抱歉，暂无搜索结果"></no-result>
		</div>
	</scroll>
</template>





<script>

import {search} from 'api/search.js';
import {ERR_OK} from 'api/config.js';
// import {filterSinger} from 'common/js/song.js';
import {createSong} from 'common/js/song.js';
import Scroll from 'base/scroll/scroll.vue';
import Loading from 'base/loading/loading.vue';
import Singer from 'common/js/singer.js';
import {mapMutations, mapActions} from 'vuex';
import NoResult from 'base/no-result/no-result.vue';


const TYPE_SINGER = 'singer';
const perpage = 20;   //每一页的搜索条数

export default {
	data(){
		return {
			page: 1,    //默认为第一页
			result: [],
			pullup: true,    //上拉加载
			beforeScroll: true,
			hasMore: true
		}
	},
	props: {
		query: {
			type: String,
			default: ''
		},
		showSinger: {
			type: Boolean,
			default: true
		}
	},
	methods: {
		refresh(){
			this.$refs.suggest.refresh();
		},
		selectItem(item){
			if(item.type === TYPE_SINGER){   //如果点击的是歌手
				const singer = new Singer({
					id: item.singermid,
					name: item.singername
				});
				this.$router.push({
					path: `/search/${singer.id}`
				});
				this.setSinger(singer);   //跳转路由之后，将歌手的数据传递到歌手详情页，那边用mapGetters来接收数据
			}else{     //如果点击的是歌曲
				this.insertSong(item);
			}

			this.$emit('select');
		},
		search(){
			this.hasMore = true;
			this.page = 1;
			this.$refs.suggest.scrollTo(0, 0);
			search(this.query, this.page, this.showSinger, perpage).then((res) => {
				if(res.code === ERR_OK){
					this.result = this._genResult(res.data);
					this._checkMore(res.data);
					// console.log(this.result);
				}
			});
		},
		searchMore(){
			if(!this.hasMore){
				return;
			}
			this.page ++;
			search(this.query, this.page, this.showSinger, perpage).then((res) => {
				if(res.code === ERR_OK){
					this.result = this.result.concat(this._genResult(res.data));
					this._checkMore(res.data);
				}
			});
		},
		listScroll(){
			this.$emit('listScroll');
		},
		_checkMore(data){
			const song = data.song;
			if(!song.list.length || (song.curnum + song.curpage * perpage) >= song.totalnum){
				this.hasMore = false;
			}
		},
		_genResult(data){
			let ret = [];
			if(data.zhida && data.zhida.singerid){
				ret.push({...data.zhida, ...{type: TYPE_SINGER}});
			}
			if(data.song){
				ret = ret.concat(this._normalizeSongs(data.song.list));
			} 
			return ret;
		},
		_normalizeSongs(list){
			let ret = [];
			list.forEach((musicData) => {
				if(musicData.songid && musicData.albumid){
					ret.push(createSong(musicData));
				}
			});
			return ret;
		},
		getIconCls(item){
			if(item.type === TYPE_SINGER){
				return 'icon-mine';
			}else{
				return 'icon-music';
			}
		},
		getDisplayName(item){
			if(item.type === TYPE_SINGER){
				return item.singername;
			}else{
				return `${item.name}-${item.singer}`;
			}
		},
		...mapMutations({
			setSinger: 'SET_SINGER'
		}),
		...mapActions([
			'insertSong'
		])
	},
	watch: {
		query(){
			this.search();
		}
	},
	components: {
		'scroll': Scroll,
		'loading': Loading,
		'no-result': NoResult
	}
}



</script>





<style lang="stylus" rel="stylesheet/stylus" scoped>

	@import '~common/stylus/variable.styl';
	@import '~common/stylus/mixin.styl';

	.suggest{
		height: 100%;
		overflow: hidden;
		.suggest-list{
			padding: 0 30px;
			.suggest-item{
				display: flex;
				align-items: center;   /*垂直居中*/
				padding-bottom: 20px;
				.icon{
					flex: 0 0 30px;
					width: 30px;
				}
				.name{
					flex: 1;
					font-size: $font-size-medium;
					color: $color-text-d;
					overflow: hidden;
					.text{
						no-wrap();
					}
				}
			}
		}
		.no-result-wrapper{
			position: absolute;
			width: 100%;
			top: 50%;
			transform: translateY(-50%);
		}
	}












</style>



























