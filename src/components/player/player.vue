


<template>
	<div class="player" v-show="playlist.length > 0">
		<transition name="normal" @enter="enter" @after-enter="afterEnter" @leave="leave" @after-leave="afterLeave">
			<div class="normal-player" v-show="fullScreen">
				<div class="background">
					<img :src="currentSong.image" alt="" width="100%" height="100%">
				</div>
				<div class="top">
					<div class="back" @click="back">
						<i class="icon-back"></i>
					</div>
					<h1 class="title" v-html="currentSong.name"></h1>
					<h2 class="subtitle" v-html="currentSong.singer"></h2>
				</div>
				<div class="middle" 
					@touchstart.prevent="middleTouchStart"
					@touchmove.prevent="middleTouchMove"
					@touchend="middleTouchEnd">
					<div class="middle-l" ref="middleL">
						<div class="cd-wrapper" ref="cdWrapper">
							<div class="cd" :class="cdCls">
								<img class="image" :src="currentSong.image" alt="">
							</div>
						</div>
						<div class="playing-lyric-wrapper">
							<div class="playing-lyric">{{playingLyric}}</div>
						</div>
					</div>
					<scroll class="middle-r" ref="lyricList" :data="currentLyric && currentLyric.lines">
						<div class="lyric-wrapper">
							<div v-if="currentLyric">
								<p v-for="(line, index) in currentLyric.lines" class="text" :class="{'current': currentLineNum === index}" ref="lyricLine">{{line.txt}}</p>
							</div>
						</div>
					</scroll>
				</div>
				<div class="bottom">
					<div class="dot-wrapper">
						<span class="dot" :class="{'active': currentShow === 'cd'}"></span>
						<span class="dot" :class="{'active': currentShow === 'lyric'}"></span>
					</div>
					<div class="progress-wrapper">
						<span class="time time-l">{{format(currentTime)}}</span>
						<div class="progress-bar-wrapper">
							<progress-bar :percent="percent" @percentChange="onProgressBarChange"></progress-bar>
						</div>
						<span class="time time-r">{{format(currentSong.duration)}}</span>
					</div>
					<div class="operators">
						<div class="icon i-left" @click="changeMode">
							<i :class="iconMode"></i>
						</div>
						<div class="icon i-left" @click="prev()" :class="disableCls">
							<i class="icon-prev"></i>
						</div>
						<div class="icon i-center" @click="togglePlaying()" :class="disableCls">
							<i :class="playIcon"></i>
						</div>
						<div class="icon i-right" @click="next()" :class="disableCls">
							<i class="icon-next"></i>
						</div>
						<div class="icon i-right" @click="toggleFavorite(currentSong)">
							<i class="icon" :class="getFavoriteIcon(currentSong)"></i>
						</div>
					</div>
				</div>
			</div>
		</transition>
		<transition name="mini">
			<div class="mini-player" v-show="!fullScreen" @click="open">
				<div class="icon">
					<img :src="currentSong.image" class="img" :class="cdCls" alt="" width="40" height="40">
				</div>
				<div class="text">
					<h2 class="name" v-html="currentSong.name"></h2>
					<p class="desc" v-html="currentSong.singer"></p>
				</div>
				<div class="control" @click.stop="togglePlaying()">
					<progress-circle :radius="radius" :percent="percent">
						<i :class="playMiniIcon" class="icon-mini"></i>
					</progress-circle>
				</div>
				<div class="control" @click.stop="showPlaylist()">
					<i class="icon-playlist"></i>
				</div>
			</div>
		</transition>
		<playlist ref="playlist"></playlist>
		<audio :src="currentSong.url" ref="audio" @play="ready" @error="error" @timeupdate="updateTime" @ended="end"></audio>
	</div>
</template>






<script>

import ProgressBar from 'base/progress-bar/progress-bar.vue';     //进度条组件
import ProgressCircle from 'base/progress-circle/progress-circle.vue';     //进度条组件
import Playlist from 'components/playlist/playlist.vue';   //播放列表组件
import Scroll from 'base/scroll/scroll.vue';

import {mapGetters, mapMutations, mapActions} from 'vuex'   //接收最后的状态
import animations from 'create-keyframe-animation'
import {prefixStyle} from 'common/js/dom.js'
import {playMode} from 'common/js/config.js'

import Lyric from 'lyric-parser'    //歌词解析插件

import {playerMixin} from 'common/js/mixin.js';   //js逻辑复用组件

const transform = prefixStyle('transform');
const transitionDuration = prefixStyle('transitionDuration');

export default{
	mixins: [playerMixin],
	data(){
		return {
			songReady: false,    //歌曲是否加载完毕
			currentTime: 0,    //当前播放的时间
			radius: 32,
			currentLyric: null,
			currentLineNum: 0,
			currentShow: 'cd',
			playingLyric: ''
		}
	},
	computed: {
		percent(){
			return this.currentTime / this.currentSong.duration;   //进度条播放比例
		},
		disableCls(){
			return this.songReady ? '' : 'disable';
		},
		cdCls(){
			return this.playing ? 'play' : 'play pause';
		},
		playIcon(){
			return this.playing ? 'icon-pause' : 'icon-play';
		},
		playMiniIcon(){
			return this.playing ? 'icon-pause-mini' : 'icon-play-mini';
		},
		...mapGetters([
			'fullScreen',
			'playing',
			'currentIndex'
		])
	},
	created(){
		this.touch = {};
	},
	methods: {
		showPlaylist(){
			this.$refs.playlist.show();
		},
		back(){
			this.setFullScreen(false);
		},
		open(){
			this.setFullScreen(true);
		},
		enter(el,done){
			const {x,y,scale} = this._getPosAndScale();
			const animation = {
				0: {
					transform: `translate3d(${x}px, ${y}px, 0) scale(${scale})`
				},
				60: {
					transform: `translate3d(0, 0, 0) scale(1.1)`
				},
				100: {
					transform: `translate3d(0, 0, 0) scale(1)`
				}
			};
			animations.registerAnimation({
				name: 'move',    //动画名称 
				animation,     //动画
				presets: {
					duration: 2000,   //动画时间
					easing: 'ease' 
				}
			});

			animations.runAnimation(this.$refs.cdWrapper, 'move', done);   //运行动画
		},
		afterEnter(){
			//清除动画
			animations.unregisterAnimation('move');
			this.$refs.cdWrapper.style.animation = '';
		},
		leave(el,done){
			const {x,y,scale} = this._getPosAndScale();
			this.$refs.cdWrapper.style.transition = 'all 2s ease';
			this.$refs.cdWrapper.style[transform] = `translate3d(${x}px, ${y}px, 0) scale(${scale})`;
			this.$refs.cdWrapper.addEventListener('transitionend', done);
		},
		afterLeave(){
			//清除动画
			this.$refs.cdWrapper.style.transition = '';
			this.$refs.cdWrapper.style[transform] = '';
		},
		togglePlaying(){
			if(!this.songReady){
				return;
			}
			this.setPlayingState(!this.playing);
			if(this.currentLyric){
				this.currentLyric.togglePlay();   //点击按钮开始播放/停止播放歌词
			}
		},
		next(){
			if(!this.songReady){
				return;
			}
			if(this.playlist.length === 1){
				this.loop();     //如果播放列表只有一条数据的时候，调用循环播放模式
				return;
			}else{
				let index = this.currentIndex + 1;
				if(index === this.playlist.length){
					index = 0;
				}
				this.setCurrentIndex(index);
				//当当前为暂停状态并且点击下一首歌曲的时候，为播放状态，改变播放按钮为暂停状态
				if(!this.playing){   
					this.togglePlaying();
				}
			}
			this.songReady = false;
		},
		prev(){
			if(!this.songReady){
				return;
			}
			if(this.playlist.length === 1){
				this.loop();
				return;
			}else{
				let index = this.currentIndex - 1;
				if(index == -1){
					index = this.playlist.length - 1;
				}
				this.setCurrentIndex(index);
				//当当前为暂停状态并且点击下一首歌曲的时候，为播放状态，改变播放按钮为暂停状态
				if(!this.playing){   
					this.togglePlaying();
				}
			}
			this.songReady = false;
		},
		loop(){
			this.$refs.audio.currentTime = 0;
			this.$refs.audio.play();
			if(this.currentLyric){
				this.currentLyric.seek(0);  //循环播放结束，歌词回到起点
			}
		},
		ready(){
			this.songReady = true;
			this.savePlayHistory(this.currentSong);
		},
		error(){
			this.songReady = true;
		},
		end(){
			if(this.mode === playMode.loop){   //如果是单曲循环
				this.loop();
			}else{	
				this.next();
			}
		},
		updateTime(e){
			this.currentTime = e.target.currentTime;
		},
		format(time){
			time = time | 0;    //向下取整
			const minute = time / 60 | 0;
			const second = (time % 60).toString().length < 2 ? '0' + (time % 60).toString() : time % 60;
			return `${minute}:${second}`;
		},
		onProgressBarChange(percent){
			const currentTime = percent * this.currentSong.duration;
			this.$refs.audio.currentTime = currentTime;
			if(!this.playing){
				this.togglePlaying();
			}
			if(this.currentLyric){
				this.currentLyric.seek(currentTime * 1000);
			}
		},
		getLyric(){
			this.currentSong.getLyric().then((lyric) => {
				if(this.currentSong.lyric !== lyric){
					return;
				}
				this.currentLyric = new Lyric(lyric, this.handleLyric);
				if(this.playing){
					this.currentLyric.play();
				}
			}).catch(() => {
				this.currentLyric = null;
				this.playingLyric = '';
				this.currentLineNum = 0;
			});
		},
		handleLyric({lineNum, txt}){
			this.currentLineNum = lineNum;
			if(lineNum > 5){
				let lineEl = this.$refs.lyricLine[lineNum - 5];
				this.$refs.lyricList.scrollToElement(lineEl, 1000);
			}else{
				this.$refs.lyricList.scrollTo(0, 0, 1000);
			}
			this.playingLyric = txt;    //显示当前的歌词
		},
		middleTouchStart(e){
			this.touch.initiated = true;   //初始化touchstart事件
			const touch = e.touches[0];
			this.touch.startX = touch.pageX;  //手指点击middle的位置相对于屏幕左边的距离
			this.touch.startY = touch.pageY;  //手指点击middle的位置相对于屏幕顶点的距离
		},
		middleTouchMove(e){
			if(!this.touch.initiated){
				return;
			}
			const touch = e.touches[0];
			//手指滑动的距离
			const deltaX = touch.pageX - this.touch.startX;
			const deltaY = touch.pageY - this.touch.startY;
			if(Math.abs(deltaY) > Math.abs(deltaX)){    //纵向滑动
				return;
			}
			const left = this.currentShow === 'cd' ? 0 : -window.innerWidth;
			const offsetWidth = Math.min(0, Math.max(-window.innerWidth, left + deltaX));
			this.touch.percent = Math.abs(offsetWidth / window.innerWidth);  //滑动的百分比
			this.$refs.lyricList.$el.style[transform] = `translate3d(${offsetWidth}px, 0, 0)`;
			this.$refs.lyricList.$el.style[transitionDuration] = 0;
			this.$refs.middleL.style.opacity = 1 - this.touch.percent;
			this.$refs.middleL.style[transitionDuration] = 0;
		},
		middleTouchEnd(){
			let offsetWidth;
			let opacity;
			if(this.currentShow === 'cd'){   //从右向左滑
				if(this.touch.percent > 0.1){
					offsetWidth = -window.innerWidth;
					opacity = 0;
					this.currentShow = 'lyric';
				}else{
					offsetWidth = 0;
					opacity = 1;
				}
			}else{    //从左向右滑
				if(this.touch.percent < 0.9){
					offsetWidth = 0;
					opacity = 1;
					this.currentShow = 'cd';
				}else{
					opacity = 0;
					offsetWidth = -window.innerWidth;
				}
			}
			const time = 1000;
			this.$refs.lyricList.$el.style[transform] = `translate3d(${offsetWidth}px, 0, 0)`;
			this.$refs.lyricList.$el.style[transitionDuration] = `${time}ms`;
			this.$refs.middleL.style.opacity = opacity;
			this.$refs.middleL.style[transitionDuration] = `${time}ms`;
		},
		_getPosAndScale(){
			const targetWidth = 40;    //底部图片的宽度
			const paddingLeft = 40;    //底部图片的中心原点离屏幕左边的距离
			const paddingBottom = 30;  //底部图片的中心原点离屏幕底部的距离
			const paddingTop = 80;     //头部的高度
			const width = window.innerWidth * 0.8;   //CD的宽度
			const scale = targetWidth / width;    //缩放比例的大小为：小图片的宽度/大图片的宽度
			const x = -(window.innerWidth / 2 - paddingLeft); //X轴位移距离
			const y = window.innerHeight - paddingBottom - paddingTop - width / 2;   //Y轴位移距离
			return {
				x,
				y,
				scale
			}
		},
		...mapMutations({
			setFullScreen: 'SET_FULL_SCREEN',
		}),
		...mapActions([
			'savePlayHistory'
		])
	},
	watch: {
		currentSong(newSong, oldSong){
			if(!newSong.id){
				return;
			}
			if(newSong.id === oldSong.id){
				return;
			}
			if(this.currentLyric){
				this.currentLyric.stop();
				// 重置为null
				this.currentLyric = null;
				this.currentTime = 0;
				this.playingLyric = '';
				this.currentLineNum = 0;
			}
			clearTimeout(this.timer);
			this.timer = setTimeout(() => {
				this.$refs.audio.play();
				this.getLyric();
			}, 1000);
		},
		playing(newPlaying){
			const audio = this.$refs.audio;
			this.$nextTick(() => {
				newPlaying ? audio.play() : audio.pause();
			});
		}
	},
	components: {
		'progress-bar': ProgressBar,
		'progress-circle': ProgressCircle,
		'scroll': Scroll,
		'playlist': Playlist
	}
}


</script>









<style scoped lang="stylus" rel="stylesheet/stylus">

	@import '~common/stylus/variable.styl'
	@import '~common/stylus/mixin.styl'

	.player{
		.normal-player{
			position: fixed;
      		left: 0;
      		right: 0;
      		top: 0;
      		bottom: 0;
      		z-index: 150;
      		width: 100%;
      		background: $color-background;
      		&.normal-enter-active, &.normal-leave-active{
      			transition: all 1s;
      			.top, .bottom{
      				transition: all 1s cubic-bezier(0.86, 0.18, 0.82, 1.32);
      			}
      		}
      		&.normal-enter, &.normal-leave-to{
      			opacity: 0;
      			.top{
      				transform: translate3d(0, -100px, 0);
      			}
      			.bottom{
      				transform: translate3d(0, 100px, 0);
      			}
      		}
      		.background{
      			position: absolute;
      			top: 0;
      			left: 0;
      			width: 100%;
      			height: 100%;
      			z-index: -1;
      			opacity: 0.6;
      			filter: blur(20px);
      		}
      		.top{
      			position: relative;
      			.back{
      				position: absolute;
      				top: 0;
      				left: 6px;
      				z-index: 50;
      				.icon-back{
      					display: block;
      					padding: 9px;
      					font-size: $font-size-large-x;
      					color: $color-theme;
      					transform: rotate(-90deg);
      				}
      			}
      			.title{
      				width: 70%;
      				margin: 0 auto;
      				height: 40px;
      				line-height: 40px;
      				text-align: center;
      				no-wrap();
      				font-size: $font-size-large;
      				color: $color-text;
      			}
      			.subtitle{
      				line-height: 20px;
			        text-align: center;
			        font-size: $font-size-medium;
			        color: $color-text;
      			}
      		}
      		.middle{
      			position: fixed;
        		width: 100%;
        		top: 80px;
        		bottom: 170px;
        		white-space: nowrap;
        		font-size: 0;
        		.middle-l{
        			display: inline-block;
          			vertical-align: top;
          			position: relative;
          			width: 100%;
          			height: 0;
          			padding-top: 80%;
          			.cd-wrapper{
          				position: absolute;
            			left: 10%;
            			top: 0;
            			width: 80%;
            			height: 100%;
            			.cd{
							width: 100%;
              				height: 100%;
              				box-sizing: border-box;
              				border: 10px solid rgba(255, 255, 255, 0.1);
              				border-radius: 50%;
              				&.play{
              					animation: rotate 20s linear infinite;
              				}
              				&.pause{
              					animation-play-state: paused;
              				}
              				.image{
              					position: absolute;
              					top: 0;
              					left: 0;
              					width: 100%;
              					height: 100%;
              					border-radius: 50%;
              				}
            			}
          			}
          			.playing-lyric-wrapper{
          				width: 100%;
          				text-align: center;
          				overflow: hidden;
          				margin-top: 30px;
          				.playing-lyric{
          					height: 20px;
          					line-height: 20px;
          					font-size: $font-size-medium;
          					color: green;
          				}
          			}
        		}
        		.middle-r{
        			display: inline-block;
        			vertical-align: top;
        			width: 100%;
        			height: 100%;
        			overflow: hidden;
        			.lyric-wrapper{
        				width: 80%;
        				margin: 0 auto;
        				text-align: center;
        				overflow: hidden;
        				.text{
        					line-height: 32px;
              				color: $color-text-l;
              				font-size: $font-size-medium;
              				&.current{
              					color: $color-text;
              				}
        				}
        			}
        		}
      		}
      		.bottom{
      			position: absolute;
      			bottom: 50px;
      			width: 100%;
      			.dot-wrapper{
      				text-align: center;
      				font-size: 0;
      				.dot{
      					display: inline-block;
      					vertical-align: middle;
      					margin: 0 4px;
      					width: 8px;
      					height: 8px;
      					border-radius: 50%;
      					background: $color-text-l;
      					&.active{
      						width: 20px;
      						border-radius: 5px;
      						background: $color-text-ll;
      					}
      				}
      			}
      			.progress-wrapper{
      				display: flex;
      				align-items: center;
      				width: 80%;
      				margin: 0 auto;
      				padding: 10px 0;
      				.time{
      					flex: 0 0 30px;
      					width: 30px;
      					line-height: 30px;
      					color: $color-text;
      					font-size: $font-size-small;
      					&.time-l{
      						text-align: left;
      					}
      					&.time-r{
      						text-align: right;
      					}
      				}
      				.progress-bar-wrapper{
      					flex: 1;
      				}
      			}
      			.operators{
      				display: flex;
          			align-items: center;
          			.icon{
          				flex: 1;
          				color: $color-theme;
          				&.disable{
          					color: $color-theme-d;
          				}
          				i{font-size: 30px;}
          			}
          			.i-left{
          				text-align: right;
          			}
          			.i-center{
          				padding: 0 20px;
            			text-align: center;
            			i{font-size: 40px;}
          			}
          			.i-right{
          				text-align: left;
          				.icon-favorite{
          					color: $color-sub-theme;
          				}
          			}
      			}
      		}
		}
		.mini-player{
			display: flex;
      		align-items: center;
      		position: fixed;
      		left: 0;
      		bottom: 0;
      		z-index: 180;
      		width: 100%;
      		height: 60px;
      		background: $color-highlight-background;
      		&.mini-enter-active, &.mini-leave-active{
      			transition: all 1s;
      		}
      		&.mini-enter, &.mini-leave-to{
      			opacity: 0;
      		}
      		.icon{
      			flex: 0 0 40px;
      			width: 40px;
      			padding: 0 10px 0 20px;
      			.img{
      				border-radius: 50%;
      				&.play{
      					animation: rotate 10s linear infinite;
      				}
      				&.pause{
      					animation-play-state: paused;
      				}
      			}
      		}
      		.text{
				display: flex;
				flex-direction: column;
				justify-content: center;
				flex: 1;
				line-height: 20px;
				overflow: hidden;
				.name{
					margin-bottom: 2px;
					no-wrap();
					font-size: $font-size-medium;
          			color: $color-text;
				}
				.desc{
					no-wrap();
          			font-size: $font-size-small;
          			color: $color-text-d;
				}
      		}
      		.control{
      			flex: 0 0 30px;
      			width: 30px;
      			padding: 0 10px;
      			no-wrap();
      			.icon-playlist, .icon-pause-mini, .icon-play-mini{
      				font-size: 30px;
          			color: $color-theme-d;
      			}
      			.icon-mini{
      				position: absolute;
					left: 0;
					top: 0;
					font-size: 32px;
      			}
      		}
		}
	}


	@keyframes rotate {
		0%{
			transform: rotate(0);
		}
		100%{
			transform: rotate(360deg);
		}
	}

</style>






























