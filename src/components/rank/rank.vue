


<template>
	<div class="rank" ref="rank">
		<scroll class="toplist" :data="toplist" ref="toplist">
			<ul class="itemall">
				<li class="item" v-for="item in toplist" @click="selectItem(item)">
					<div class="icon">
						<img src="" alt="" width="100" height="100" v-lazy="item.picUrl">
					</div>
					<ul class="songlist">
						<li class="song" v-for="(song, index) in item.songList">
							<span>{{index + 1}}</span>
							<span>{{song.songname}}-{{song.singername}}</span>
						</li>
					</ul>
				</li>
			</ul>
			<div class="loading-container" v-show="!toplist.length">
				<loading></loading>
			</div>
		</scroll>
		<router-view></router-view>
	</div>
</template>



<script>

import {getTopList} from 'api/rank.js';
import {ERR_OK} from 'api/config.js';
import Scroll from 'base/scroll/scroll.vue';
import Loading from 'base/loading/loading.vue';
import {playListMixin} from 'common/js/mixin.js';
import {mapMutations} from 'vuex';

export default {
	mixins: [playListMixin],
	data(){
		return {
			toplist: []
		}
	},
	created(){
		this._getTopList();
	},
	methods: {
		_getTopList(){
			getTopList().then((res) => {
				if(res.code === ERR_OK){
					// console.log(res.data.topList);
					this.toplist = res.data.topList;
				}
			});
		},
		handlePlayList(playlist){
			const bottom = playlist.length ? '60' : '0';
			this.$refs.rank.style['bottom'] = `${bottom}px`;
			this.$refs.toplist.refresh();
		},
		selectItem(item){
			this.$router.push({
				path: `/rank/${item.id}`
			});
			this.setTopList(item);
		},
		...mapMutations({
			setTopList: 'SET_TOP_LIST'
		})
	},
	components: {
		'scroll': Scroll,
		'loading': Loading
	}
}

</script>





<style lang="stylus" rel="stylesheet/stylus" scoped>
	@import "~common/stylus/variable";
  	@import "~common/stylus/mixin";

  	.rank{
  		position: fixed;
  		width: 100%;
  		top: 88px;
  		bottom: 0;
  		.toplist{
  			height: 100%;
  			overflow: hidden;
  			.itemall{
  				.item{
  					display: flex;
  					margin: 0 20px;
  					padding-top: 20px;
  					height: 100px;
  					&:last-child{
  						padding-bottom: 20px;
  					}
  					.icon{
  						flex: 0 0 100px;
  						width: 100px;
  						height: 100px;
  					}
  					.songlist{
  						flex: 1;
  						display: flex;
  						flex-direction: column;   /* 纵向排列 */
  						 justify-content: center;   /* 垂直居中显示 */
  						padding: 0 20px;
  						height: 100px;
  						overflow: hidden;
  						background: $color-highlight-background;
  						color: $color-text-d;
  						font-size: $font-size-small;
  						.song{
  							no-wrap();
            				line-height: 26px;
  						}
  					}
  				}
  			}
  			.loading-container{
  				position: absolute;
  				width: 100%;
  				top: 50%;
  				transform: translateY(-50%);
  			}
  		}
  	}

</style>
































































