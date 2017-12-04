

<template>
	<transition name="slide">
		<music-list :bgImage="bgImage" :title="title" :songs="songs"></music-list>
	</transition>
</template>




<script>

import MusicList from 'components/music-list/music-list.vue';
import {mapGetters} from 'vuex';
import {getSongList} from 'api/recommend.js'
import {ERR_OK} from 'api/config.js'
import {createSong} from 'common/js/song.js'



export default {
	data(){
		return {
			songs: []
		}
	},
	computed: {
		...mapGetters([
			'disc'
		]),
		bgImage(){
			return this.disc.imgurl;
		},
		title(){
			return this.disc.dissname;
		}
	},
	created(){
		this._getSongList();
	},
	methods: {
		_getSongList(){
			if(!this.disc.dissid){
				this.$router.push('/recommend');
				return;
			}
			getSongList(this.disc.dissid).then((res) => {
				if(res.code === ERR_OK){
					console.log(res.cdlist[0].songlist);
					this.songs = this._normalizeSongs(res.cdlist[0].songlist);
				}
			});
		},
		_normalizeSongs(list){
			let ret = [];
			list.forEach((musicData) => {
				if(musicData.songid && musicData.albummid){
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












