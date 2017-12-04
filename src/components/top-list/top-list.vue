





<template>
	<transition name="slide">
		<music-list :title="title" :bgImage="bgImage" :songs="songs" :rank="rank"></music-list>
	</transition>
</template>




<script>

import MusicList from 'components/music-list/music-list.vue';
import {mapGetters} from 'vuex';
import {getMusicList} from 'api/rank.js'
import {ERR_OK} from 'api/config.js'
import {createSong} from 'common/js/song.js'



export default {
	data(){
		return {
			songs: [],
			rank: true
		}
	},
	computed: {
		title(){
			return this.toplist.topTitle;
		},
		bgImage(){
			if(this.songs.length){
				return this.songs[0].image;
			}
			return '';
		},
		...mapGetters([
			'toplist'
		])
	},
	created(){
		this._getMusicList();
	},
	methods: {
		_getMusicList(){
			if(!this.toplist.id){
				this.$router.push('/rank');
				return;
			}
			getMusicList(this.toplist.id).then((res) => {
				if(res.code === ERR_OK){
					this.songs = this._normalizeSongs(res.songlist);
					// console.log(this.songs);
				}
			});
		},
		_normalizeSongs(list){
			let ret = [];
			list.forEach((item) => {
				const musicData = item.data;
				if(musicData.songid && musicData.albumid){
					ret.push(createSong(musicData));
				}
			});
			return ret;
		}
	},
	components: {
		'music-list': MusicList
	}
}


</script>






<style lang="stylus" rel="stylesheet/stylus" scoped>
	@import '~common/stylus/variable.styl'


	.slide-enter-active, .slide-leave-active{
		transition: all 0.5s linear;
	}
	.slide-enter, .slide-leave-to{
		transform: translate3d(100%, 0, 0);
	}


</style>












































