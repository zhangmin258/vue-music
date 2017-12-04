


<template>
	<transition name="slide">
		<music-list :bgImage="bgImage" :title="title" :songs="songs"></music-list>
	</transition>
</template>



<script>

import MusicList from 'components/music-list/music-list.vue'

import {mapGetters} from 'vuex'     //取出数据
import {getSingerDetail} from 'api/singer.js'
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
			'singer'
		]),
		bgImage(){
			return this.singer.avatar;
		},
		title(){
			return this.singer.name;
		}
	},
	created(){
		this._getDetail();
	},
	methods: {
		_getDetail(){
			if(!this.singer.id){   //当歌手不存在的时候，回退到歌手列表页
				this.$router.push('/singer');
				return;
			}
			getSingerDetail(this.singer.id).then((res) => {
				if(res.code === ERR_OK){
					// console.log(res.data.list);
					this.songs = this._normalizeSinger(res.data.list);
					// console.log(this.songs);
				}
			});
		},
		_normalizeSinger(list){
			let ret = [];
			list.forEach((item) => {
				// let musicData = item.musicData;
				let {musicData} = item;  //对象属性赋值，等同于上句
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
















