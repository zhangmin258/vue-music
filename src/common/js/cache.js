

import storage from 'good-storage';

const SEARCH_KEY = '__search__';
const SEARCH_MAX_LENGTH = 15;   //搜索列表最大只能缓存15条数据


const PLAY_KEY = '__play__';
const PLAY_MAX_LENGTH = 200;      //最近的播放列表最多缓存200条数据

const FAVORITE_KEY = '__favorite__';
const FAVORITE_MAX_LENGTH = 200;    //收藏列表最多缓存200条数据


function insertArray(arr, val, compare, maxLen){
	const index = arr.findIndex(compare);   //查找搜索的这条歌曲是否在这个搜索历史的列表中
	if(index === 0){   //搜索的这条歌曲在这个搜索历史列表的第一条
		return;
	}
	if(index > 0){  //搜索的这条歌曲已经存在这个搜索历史列表中了
		arr.splice(index, 1);   //将已经存在的这条歌曲删除
	}
	arr.unshift(val);   //然后把搜索的这条新歌曲添加到这个搜索历史列表中的第一位

	if(maxLen && arr.length > maxLen){   //如果有最大搜索条数的限制，并且搜索历史列表的长度大于最大限制的长度，那么就从这个数组的后面删除多余的歌曲
		arr.pop();
	}
}


function deleteArray(arr, compare){
	const index = arr.findIndex(compare);
	if(index > -1){   //如果这条数据已经存在
		arr.splice(index, 1);   //将这条数据从这个数组中删除
	}
}

export function saveSearch(query){    //保存某一条歌曲(把数据写入到本地缓存中)
	let searches = storage.get(SEARCH_KEY, []);  //没有存过就默认为空数组

	insertArray(searches, query, (item) => {
		return item === query;
	}, SEARCH_MAX_LENGTH);

	storage.set(SEARCH_KEY, searches);   //将这个列表存到SEARCH_KEY中
	return searches;      //最后返回这个列表
}



export function deleteSearch(query){    //删除某一条歌曲
	let searches = storage.get(SEARCH_KEY, []);  //没有存过就默认为空数组
	deleteArray(searches, (item) => {
		return item === query;
	});
	storage.set(SEARCH_KEY, searches);   //将这个列表存到SEARCH_KEY中
	return searches;      //最后返回这个列表
}



export function clearSearch(){   //删除所有的历史记录
	storage.remove(SEARCH_KEY);   
	return [];      //最后返回一个空数组
}


export function loadSearch(){
	return storage.get(SEARCH_KEY, []);    //从本地缓存中读取数据
}



export function savePlay(song){    //将数据保存到本地缓存中
	let songs = storage.get(PLAY_KEY, []);   //默认为空数组
	insertArray(songs, song, (item) => {
		return item.id === song.id;    //将当前播放的歌曲插入到数组中
	}, PLAY_MAX_LENGTH);
	storage.set(PLAY_KEY, songs);  //将这个数组存到PLAY_KEY中
	return songs;
}


export function loadPlay(){   //从本地缓存中读取数据
	return storage.get(PLAY_KEY, []);
}




export function saveFavorite(song){
	let songs = storage.get(FAVORITE_KEY, []);
	insertArray(songs, song, (item) => {
		return song.id === item.id;
	}, FAVORITE_MAX_LENGTH);
	storage.set(FAVORITE_KEY, songs);
	return songs;
}


export function deleteFavorite(song){
	let songs = storage.get(FAVORITE_KEY, []);
	deleteArray(songs, (item) => {
		return song.id === item.id;
	});
	storage.set(FAVORITE_KEY, songs);
	return songs;
}


export function loadFavorite(){
	return storage.get(FAVORITE_KEY, []);
}










