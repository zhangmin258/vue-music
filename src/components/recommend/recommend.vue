


<template>
	<div class="recommend" ref="recommend">
		<scroll class="recommend-content" :data="discList" ref="scroll">
			<div>
				<div class="slider-wrapper" v-if="recommends.length">
					<slider>
						<div v-for="item in recommends">
							<a :href="item.linkUrl"><img @load="loadImage()" :src="item.picUrl" alt="" class="needsclick"></a>
						</div>
					</slider>
				</div>
				<div class="recommend-list">
					<h1 class="list-title">热门歌单推荐</h1>
					<ul>
						<li class="item" v-for="item in discList" @click="selectItem(item)">
							<div class="icon">
								<img v-lazy="item.imgurl" alt="头像" width="60" height="60">
							</div>
							<div class="text">
								<h2 class="name" v-html="item.creator.name"></h2>
								<div class="desc" v-html="item.dissname"></div>
							</div>
						</li>
					</ul>
				</div>
			</div>
			<div class="loading-container" v-show="!discList.length">
				<loading></loading>
			</div>
		</scroll>
		<router-view></router-view>
	</div>
</template>







<script>

import {getRecommend,getDiscList} from 'api/recommend.js'
import {ERR_OK} from 'api/config.js'

import Slider from 'base/slider/slider.vue'
import Scroll from 'base/scroll/scroll.vue'
import Loading from 'base/loading/loading.vue'
import {playListMixin} from 'common/js/mixin.js'

import {mapMutations} from 'vuex';

export default {
	mixins: [playListMixin],
	data(){
		return{
			recommends: [],
			discList: [],
		}
	},
	created(){
		this._getRecommend();
		this._getDiscList();
	},
	methods: {
		handlePlayList(playlist){
			const bottom = playlist.length > 0 ? '60' : '0';
			this.$refs.recommend.style['bottom'] = `${bottom}px`;
			this.$refs.scroll.refresh();
		},
		_getRecommend(){
			getRecommend().then((res) => {
				if(res.code === ERR_OK){
					// console.log(res.data.slider);
					this.recommends = res.data.slider;
				}
			});
		},
		_getDiscList(){
			getDiscList().then((res) => {
				if(res.code === ERR_OK){
					this.discList = res.data.list;
				}
			});
		},
		loadImage(){
			if(!this.checkLoaded){
				this.$refs.scroll.refresh();
				this.checkLoaded = true;
			}
		},
		selectItem(item){
			this.$router.push({
				path: `/recommend/${item.dissid}`
			});
			this.setDisc(item);
		},
		...mapMutations({
			setDisc: 'SET_DISC'
		})
	},
	components: {
		'slider': Slider,
		'scroll': Scroll,
		'loading': Loading
	}
}

</script>





<style lang="stylus" rel="stylesheet/stylus" scoped>
	@import '~common/stylus/variable.styl'

	.recommend{
		position: fixed;
		top: 88px;
		bottom: 0;
		left: 0;
		width: 100%;
		.recommend-content{
			height: 100%;
			overflow: hidden;
			.slider-wrapper{
				position: relative;
				width: 100%;
				/*height: 0;*/
				/*padding-top: 40px;*/
				overflow: hidden;
			}
			.recommend-list{
				.list-title{
					height: 65px;
					line-height: 65px;
					text-align: center;
					color: $color-theme;
					font-size: $font-size-medium;
				}
				ul{
					.item{
						display: flex;
						padding: 0 20px 20px 20px;
						box-sizing: border-box;
						align-items: center;
						.icon{
							flex: 0 0 60px;
							width: 60px;
							padding-right: 20px;
						}
						.text{
							flex: 1;
							display: flex;
							flex-direction: column;
							justify-content: center;
							line-height: 20px;
							overflow: hidden;
							font-size: $font-size-medium;
							.name{
								margin-bottom: 5px;
								color: $color-text;
							}
							.desc{
								color: $color-text-d;
							}
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


























