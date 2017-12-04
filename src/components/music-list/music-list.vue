



<template>
	<div class="music-list">
		<div class="back" @click="back">
			<span class="icon-back"></span>
		</div>
		<h1 class="title" v-html="title"></h1>
		<div class="bg-image" :style="bgImg" ref="bgImg">
			<div class="play-wrapper" ref="play" v-show="songs.length">
				<div class="paly" @click="random">
					<span class="icon-play"></span>
					<p class="text">随机播放全部</p>
				</div>
			</div>
			<div class="filter" ref="filter"></div>
		</div>
		<div class="bg-layer" ref="layer"></div>
		<scroll :data="songs" class="list" ref="list" :probeType="probeType" :listenScroll="listenScroll" @scroll="scroll">
			<div class="song-list-wrapper">
				<song-list :songs="songs" @select="selectItem" :rank="rank"></song-list>
			</div>
			<div class="loading-container" v-show="!songs.length">
				<loading></loading>
			</div>
		</scroll>
	</div>
</template>










<script>

import SongList from 'base/song-list/song-list.vue'
import Scroll from 'base/scroll/scroll.vue'
import {prefixStyle} from 'common/js/dom.js'
import Loading from 'base/loading/loading.vue'

import {mapActions} from 'vuex'
import {playListMixin} from 'common/js/mixin.js';

const RESERVED_HEIGHT = 40;
const transform = prefixStyle('transform');
const backdrop = prefixStyle('backdrop-filter');

export default {
	mixins: [playListMixin],  //如果方法同名，组件里面的方法会覆盖掉playListMixin里面的方法
	data(){
		return {
			scrollY: 0    //纵向滚动的距离
		}
	},
	props: {
		bgImage: {
			type: 	String,
			default: ''
		},
		title: {
			type: String,
			default: ''
		},
		songs: {
			type: Array,
			default: []
		},
		rank: {
			type: Boolean,
			default: false
		}
	},
	methods: {
		handlePlayList(playlist){
			const bottom = playlist.length > 0 ? '60' : '0';
			this.$refs.list.$el.style['bottom'] = `${bottom}px`;
			this.$refs.list.refresh();
		},
		back(){
			this.$router.back();
		},
		scroll(pos){
			this.scrollY = pos.y;  //纵向滚动的距离
		},
		selectItem(item, index){   //顺序播放
			this.selectPlay({
				list: this.songs,
				index: index
			});
		},
		random(){    //随机播放
			this.randomPlay({
				list: this.songs,
			});
		},
		...mapActions([
			'selectPlay',
			'randomPlay'
		])
	},
	watch: {    //当滚动的时候，时时监听滚动的距离
		scrollY(newVal){
			let translateY = Math.max(this.minTransalteY, newVal);   //2者之间取最大的那个值
			let zIndex = 0;
			let scale = 1;
			let blur = 0;
			let percent = Math.abs(newVal / this.imageHeight);
			this.$refs.layer.style[transform] = `translate3d(0, ${translateY}px, 0)`;
			if(newVal > 0){   //当向下滑动的时候
				scale = 1 + percent;
				zIndex = 10;
			}else{    //当向上滑动的时候
				blur = Math.min(20 * percent, 20);
			}
			this.$refs.filter.style[backdrop] = `blur(${blur}px)`;
			if(newVal < this.minTransalteY){   //当滚到顶点的时候
				zIndex = 10;
				this.$refs.bgImg.style.height = `${RESERVED_HEIGHT}px`;
				this.$refs.bgImg.style.paddingTop = 0;
				this.$refs.play.style.display = 'none';
			}else{
				this.$refs.bgImg.style.height = 0;
				this.$refs.bgImg.style.paddingTop = '70%';
				this.$refs.play.style.display = 'block';
			}
			this.$refs.bgImg.style.zIndex = zIndex;
			this.$refs.bgImg.style[transform] = `scale(${scale})`;
		}
	},
	computed: {
		bgImg(){
			return `background-image:url(${this.bgImage})`;
		}
	},
	created(){
		this.probeType = 3;
		this.listenScroll = true;
	},
	mounted(){
		this.imageHeight = this.$refs.bgImg.clientHeight;
		this.minTransalteY = -this.imageHeight + RESERVED_HEIGHT;
		this.$refs.list.$el.style.top = `${this.imageHeight}px`;
	},
	components: {
		'song-list': SongList,
		'scroll': Scroll,
		'loading': Loading
	}
}



</script>






<style scoped lang="stylus" rel="stylesheet/stylus">
	@import "~common/stylus/variable.styl";
  	@import "~common/stylus/mixin.styl";

	.music-list{
		position: fixed;
		z-index: 100;
		top: 0;
		bottom: 0;
		left: 0;
		right: 0;
		background: $color-background;
		.back{
			position: absolute;
			top: 0;
			left: 6px;
			z-index: 50;
			.icon-back{
				display: block;
				padding: 10px;
				font-size: $font-size-large-x;
				color: $color-theme;
			}
		}
		.title{
			position: absolute;
	      	top: 0;
	      	left: 10%;
	      	z-index: 40;
	      	width: 80%;
	      	no-wrap();
	      	text-align: center;
	      	line-height: 40px;
	      	font-size: $font-size-large;
	      	color: $color-text;
		}
		.bg-image{
			position: relative;
			width: 100%;
			height: 0;
			padding-top: 70%;
			background-size: cover;
			transform-origin: top;
			.play-wrapper{
				position: absolute;
				z-index: 100;
				width: 100%;
				bottom: 20px;
				.paly{
					width: 135px;
					text-align: center;
					padding: 7px 0;
					margin: 0 auto;
					box-sizing: border-box;
					border: 1px solid $color-theme;
					color: $color-theme;
					border-radius: 100px;
					font-size: 0;
					.icon-play{
						display: inline-block;
						vertical-align: middle;
						margin-right: 6px;
						font-size: $font-size-medium-x;
					}
					.text{
						display: inline-block;
						vertical-align: middle;
						font-size: $font-size-small;
					}
				}
			}
			.filter{
				position: absolute;
				width: 100%;
				height: 100%;
				top: 0;
				left: 0;
				background: rgba(7, 17, 27, 0.4);
			}
		}
		.bg-layer{
			position: relative;
			height: 100%;
			background: $color-background;
		}
		.list{
			position: absolute;
			width: 100%;
			top: 0;
			bottom: 0;
			background: $color-background;
			.song-list-wrapper{
				padding: 20px 30px;
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











