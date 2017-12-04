

import * as types from './mutation-types.js'

//修改state里面的数据
const mutations = {
	[types.SET_SINGER](state, singer){   //第一个参数为已经声明过的状态，第二个参数为接收这个状态的变化的参数
		state.singer = singer;
	},
	[types.SET_PLAYING_STATE](state, flag){
		state.playing = flag;
	},
	[types.SET_FULL_SCREEN](state, flag){
		state.fullScreen = flag;
	},
	[types.SET_PLAYLIST](state, list){
		state.playlist = list;
	},
	[types.SET_SEQUENCELIST](state, list){
		state.sequenceList = list;
	},
	[types.SET_PLAY_MODE](state, mode){
		state.mode = mode;
	},
	[types.SET_CURRENT_INDEX](state, index){
		state.currentIndex = index;
	},
	[types.SET_DISC](state, disc){
		state.disc = disc
	},
	[types.SET_TOP_LIST](state, toplist){
		state.toplist = toplist;
	},
	[types.SET_SEARCH_HISTORY](state, history){
		state.searchHistory = history;
	},
	[types.SET_PLAY_HISTORY](state, history){
		state.playHistory = history;
	},
	[types.SET_FAVORITE_LIST](state, list){
		state.favoriteList = list;
	}
}




export default mutations;    //导出mutations













