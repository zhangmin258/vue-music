


/*

共享组件之间复用的js逻辑都应该写到mixin.js里面

 */


import {mapGetters, mapMutations, mapActions} from 'vuex';
import {playMode} from 'common/js/config.js';
import {shuffle} from 'common/js/utill.js';

export const playListMixin = {
	computed: {
		...mapGetters([
			'playlist'
		])
	},
	mounted(){   //模板编译完成(组件加载完成，DOM已经生成，数据已经渲染)
		this.handlePlayList(this.playlist);
	}, 
	activated(){   //组件被激活时调用(用于keep-alive)
		this.handlePlayList(this.playlist);
	},
	methods: {
		handlePlayList(){
			throw new Error('component must implement handlePlayList method');   //组件必须实现handlePlayList方法
		}
	},
	watch: {
		playlist(newVal){    //监听playlist的改变
			this.handlePlayList(newVal);
		}
	}
}






export const playerMixin = {
	computed: {
		iconMode(){
			return this.mode === playMode.sequence ? 'icon-sequence' : this.mode === playMode.loop ? 'icon-loop' : 'icon-random';
		},
		...mapGetters([
			'sequenceList',
			'currentSong',
			'playlist',
			'mode',
			'favoriteList'
		])
	},
	methods: {
		changeMode(){
			const mode = (this.mode + 1) % 3;
			this.setPlayMode(mode);
			let list = null;
			if(mode === playMode.random){   //如果是随机播放
				list = shuffle(this.sequenceList);
			}else{
				list = this.sequenceList;
			}
			this.setPlayList(list);
			this.resetCurrentIndex(list);
		},
		resetCurrentIndex(list){
			let index = list.findIndex((item) => {
				return item.id === this.currentSong.id;
			});
			this.setCurrentIndex(index);
		},
		getFavoriteIcon(song){
			if(this.isFavorite(song)){
				return 'icon-favorite';
			}else{
				return 'icon-not-favorite';
			}
		},
		toggleFavorite(song){
			if(this.isFavorite(song)){
				this.deleteFavoriteList(song);
			}else{
				this.saveFavoriteList(song);
			}
		},
		isFavorite(song){
			let index = this.favoriteList.findIndex((item) => {
				return song.id === item.id;
			});
			return index > -1;
		},
		//修改状态只能通过mutations
		...mapMutations({
			setPlayingState: 'SET_PLAYING_STATE',
			setCurrentIndex: 'SET_CURRENT_INDEX',
			setPlayMode: 'SET_PLAY_MODE',
			setPlayList: 'SET_PLAYLIST'
		}),
		...mapActions([
			'saveFavoriteList',
			'deleteFavoriteList'
		])
	}
}





export const searchMixin = {
	data(){
		return {
			query: '',
			refreshDelay: 100
		}
	},
	computed: {
		...mapGetters([
			'searchHistory'
		])
	},
	methods: {
		onQueryChange(query){
			this.query = query;
		},
		blurInput(){
			this.$refs.searchBox.blur();
		},
		addQuery(query){
			this.$refs.searchBox.setQuery(query);
		},
		saveSearch(){
			this.saveSearchHistory(this.query);
		},
		...mapActions([
			'saveSearchHistory',
			'deleteSearchHistory'
		])
	}
}




















