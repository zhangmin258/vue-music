


<template>
	<transition name="slide">
		<div class="user-center">
			<div class="back" @click="back">
				<i class="icon-back"></i>
			</div>
			<div class="switches-wrapper">
				<switches :switches="switches" :currentIndex="currentIndex" @switch="switchSelect"></switches>
			</div>
			<div class="play-btn" @click="random">
				<i class="icon-play"></i>
				<span class="text">随机播放全部</span>
			</div>
			<div class="list-wrapper" ref="listWrapper">
				<scroll class="list-scroll" v-if="currentIndex === 0" :data="favoriteList" ref="favoriteList">
					<div class="list-inner">
						<song-list :songs="favoriteList" @select="selectSong"></song-list>
					</div>
				</scroll>
				<scroll class="list-scroll" v-if="currentIndex === 1" :data="playHistory" ref="playList">
					<div class="list-inner">
						<song-list :songs="playHistory" @select="selectSong"></song-list>
					</div>
				</scroll>
			</div>
			<div class="no-result-wrapper" v-show="noResult">
				<no-result :title="title"></no-result>
			</div>
		</div>
	</transition>
</template>




<script>

import {mapGetters, mapActions} from 'vuex';
import Scroll from 'base/scroll/scroll.vue';
import SongList from 'base/song-list/song-list.vue';
import Song from 'common/js/song.js'; 
import NoResult from 'base/no-result/no-result.vue';

import Switches from 'base/switches/switches.vue';
import {playListMixin} from 'common/js/mixin.js';

export default {
	mixins: [playListMixin],
	data(){
		return {
			switches: [
				{name: '我收藏的'},
				{name: '最近听的'}
			],
			currentIndex: 0
		}
	},
	computed: {
		...mapGetters([
			'playHistory',
			'favoriteList'
		]),
		noResult(){
			if(this.currentIndex === 0){
				return !this.favoriteList.length;
			}else{
				return !this.playHistory.length;
			}
		},
		title(){
			if(this.currentIndex === 0){
				return '暂无收藏歌曲';
			}else{
				return '暂无听过的歌曲';
			}
		}
	},
	methods: {
		handlePlayList(playlist){
			const bottom = playlist.length > 0 ? 60 : 0;
			this.$refs.listWrapper.style['bottom'] = `${bottom}px`;
			this.$refs.favoriteList && this.$refs.favoriteList.refresh();
			this.$refs.playList && this.$refs.playList.refresh();
		},
		random(){
			let list = this.currentIndex === 0 ? this.favoriteList : this.playHistory;
			if(list.length === 0){
				return;
			}
			list = list.map((song) => {
				return new Song(song);
			});
			this.randomPlay({
				list
			});
		},
		back(){
			this.$router.back();
		},
		switchSelect(index){
			this.currentIndex = index;
		},
		selectSong(song, index){
			this.insertSong(new Song(song));
		},
		...mapActions([
			'insertSong',
			'randomPlay'
		])
	},
	components: {
		'switches': Switches,
		'scroll': Scroll,
		'song-list': SongList,
		'no-result': NoResult
	}
}



</script>






<style scoped lang="stylus" rel="stylesheet/stylus">

	@import '~common/stylus/variable.styl';

	.user-center{
		position: fixed;
		top: 0;
		bottom: 0;
		left: 0;
		right: 0;
		width: 100%;
		z-index: 100;
		background: $color-background;
		&.slide-enter-active, &.slide-leave-active{
			transition: all 1s;
		}
		&.slide-enter, &.slide-leave-to{
			transform: translate3d(100%, 0, 0);
		}
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
		.switches-wrapper{
			margin: 10px 0 30px 0;
		}
		.play-btn{
			width: 135px;
			padding: 7px 0;
			margin: 0 auto;
			text-align: center;
			color: $color-text-l;
			border: 1px solid  $color-text-l;
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
		.list-wrapper{
			position: absolute;
			top: 110px;
			bottom: 0;
			width: 100%;
			.list-scroll{
				height: 100%;
				overflow: hidden;
				.list-inner{
					padding: 20px 30px;
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











