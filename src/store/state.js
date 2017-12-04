

import {playMode} from 'common/js/config.js';
import {loadSearch, loadPlay, loadFavorite} from 'common/js/cache.js';


const state = {    //声明状态
	singer: {},        //歌手对象
	playing: false,    //播放的状态，默认为关闭
	fullScreen: false,	//是否显示全屏播放，默认为否
	playlist: [],      //播放列表，默认为空
	sequenceList: [],  //播放顺序列表，默认为空
	mode: playMode.sequence,   //播放模式，默认为顺序播放
	currentIndex: -1,    //当前播放的索引
	disc: {},     //歌单对象
	toplist: {},   //榜单对象
	searchHistory: loadSearch(),    //搜索历史列表(该数据从本地缓存中读取)
	playHistory: loadPlay(),     //最近播放列表(该数据从本地缓存中读取)
	favoriteList: loadFavorite()             //收藏列表

}



export default state;   //导出状态





















