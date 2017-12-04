

import * as types from './mutation-types.js';
import {playMode} from 'common/js/config.js';
import {shuffle} from 'common/js/utill.js';
import {saveSearch, deleteSearch, clearSearch, savePlay, saveFavorite, deleteFavorite} from 'common/js/cache.js';

function findIndex(list, song){
	return list.findIndex((item) => {
		return item.id === song.id;
	});
}

//提交mutations里面的数据
export const selectPlay = function({commit, state}, {list, index}){
	commit(types.SET_SEQUENCELIST, list);   //顺序播放列表
	if(state.mode === playMode.random){
		let randomlist = shuffle(list);
		commit(types.SET_PLAYLIST, randomlist);   //播放列表(随机播放)
		index = findIndex(randomlist, list[index]);
	}else{
		commit(types.SET_PLAYLIST, list);   //播放列表(顺序播放)
	}
	
	commit(types.SET_FULL_SCREEN, true);   //全屏播放
	commit(types.SET_PLAYING_STATE, true);   //开启播放
	commit(types.SET_CURRENT_INDEX, index);   //当前播放的索引
}



export const randomPlay = function({commit}, {list}){
	commit(types.SET_PLAY_MODE, playMode.random);   //播放模式为随机模式
	commit(types.SET_SEQUENCELIST, list);   //顺序播放列表
	let randomlist = shuffle(list);
	commit(types.SET_PLAYLIST, randomlist);   //将播放列表随机打乱
	commit(types.SET_CURRENT_INDEX, 0);   //当前播放的索引，从randomlist第一个开始播放
	commit(types.SET_FULL_SCREEN, true);   //全屏播放
	commit(types.SET_PLAYING_STATE, true);   //开启播放
}


export const insertSong = function({commit, state}, song){   //在搜索历史记录中插入搜索的歌曲
	let playlist = state.playlist.slice();   //副本
	let sequenceList = state.sequenceList.slice();
	let currentIndex = state.currentIndex;
	//记录当前歌曲
	let currentSong = playlist[currentIndex];
	//查找当前歌曲中是否有待插入的歌曲并返回其索引值
	let fpIndex = findIndex(playlist, song);
	//因为是插入歌曲，所以索引值 +1；
	currentIndex ++;
	//插入这首歌曲到当前的索引值
	playlist.splice(currentIndex, 0, song);
	//如果歌曲列表已经有了插入的这首歌曲
	if(fpIndex > -1){
		//如果当前插入的序号大于列表中的序号
		if(currentIndex > fpIndex){
			playlist.splice(fpIndex, 1);  //将列表中原有的歌曲删除
			currentIndex --;
		}else{   //如果当前插入的序号小于列表中的序号
			playlist.splice(fpIndex +1, 1);   //将列表中原有的歌曲删除
		}
	}

	//找到在顺序播放列表中，插入当前的这首歌曲的索引值
	let currentSIndex = findIndex(sequenceList, currentSong) + 1;

	//找到在顺序播放列表中, 原来已经有的这首歌曲(与插入进来的歌曲进行对比)的索引值
	let fsIndex = findIndex(sequenceList, song);

	//将歌曲插入到顺序播放列表中(当前索引值的后面);
	sequenceList.splice(currentSIndex, 0, song);

	//如果顺序播放列表中已经有了插入的这首歌曲
	if(fsIndex > -1){
		if(currentSIndex > fsIndex){
			sequenceList.splice(fsIndex, 1);
		}else{
			sequenceList.splice(fsIndex + 1, 1);
		}
	}

	commit(types.SET_PLAYLIST, playlist);
	commit(types.SET_SEQUENCELIST, sequenceList);
	commit(types.SET_CURRENT_INDEX, currentIndex);
	commit(types.SET_FULL_SCREEN, true);
	commit(types.SET_PLAYING_STATE, true);
}





export const saveSearchHistory = function({commit}, query){   //保存历史记录
	commit(types.SET_SEARCH_HISTORY, saveSearch(query));
}

export const deleteSearchHistory = function({commit}, query){   //删除历史记录
	commit(types.SET_SEARCH_HISTORY, deleteSearch(query));
}

export const clearSearchHistory = function({commit}){   //删除历史记录(所有)
	commit(types.SET_SEARCH_HISTORY, clearSearch());
}


export const deleteSong = function({commit, state}, song){   //删除播放列表中的单首歌曲
	let playlist = state.playlist.slice();
	let sequenceList = state.sequenceList.slice();
	let currentIndex = state.currentIndex;

	let pIndex = findIndex(playlist, song);
	playlist.splice(pIndex, 1);   //从播放列表中删除

	let sIndex = findIndex(sequenceList, song);
	sequenceList.splice(sIndex, 1);   //从播放顺序列表中删除

	if(currentIndex > pIndex || currentIndex === playlist.length){
		currentIndex --;
	}

	commit(types.SET_PLAYLIST, playlist);
	commit(types.SET_SEQUENCELIST, sequenceList);
	commit(types.SET_CURRENT_INDEX, currentIndex);

	if(!playlist.length){   //如果都删完了就停止播放
		commit(types.SET_PLAYING_STATE, false);
	}else{
		commit(types.SET_PLAYING_STATE, true);  //否则就切换到播放状态
	}

}



 export const deleteSongList = function({commit}){   //删除播放列表中的全部歌曲
 	commit(types.SET_PLAYLIST, []);
 	commit(types.SET_SEQUENCELIST, []);
 	commit(types.SET_CURRENT_INDEX, -1);
 	commit(types.SET_PLAYING_STATE, false);
 }






export const savePlayHistory = function({commit, state}, song){   //最近播放列表
	commit(types.SET_PLAY_HISTORY, savePlay(song));
}





export const saveFavoriteList = function({commit}, song){   //保存收藏列表
	commit(types.SET_FAVORITE_LIST, saveFavorite(song));
}


export const deleteFavoriteList = function({commit}, song){  //删除收藏列表
	commit(types.SET_FAVORITE_LIST, deleteFavorite(song));
}












