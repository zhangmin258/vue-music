
import {getLyric} from 'api/song.js';
import {ERR_OK} from 'api/config.js';
import {Base64} from 'js-base64';


//定义一个类
export default class Song {
	//ES6中新型构造器，参数特别多的时候，可以支持传入一个对象
	constructor({id, mid, singer, name, album, duration, image, url}){
		this.id = id;
		this.mid = mid;
		this.singer = singer;
		this.name = name;
		this.album = album;
		this.duration = duration;
		this.image = image;
		this.url = url;
	}

	getLyric(){
		if(this.lyric){
			return Promise.resolve(this.lyric);    //返回一个以给定值解析后的Promise对象
		}
		return new Promise((resolve, reject) => {
			getLyric(this.mid).then((res) => {
				if(res.retcode === ERR_OK){
					this.lyric = Base64.decode(res.lyric);
					// console.log(this.lyric);
					resolve(this.lyric);   //返回一个定值解析后的Promise对象
				}else{
					reject('no lyric');   //返回一个被拒绝的Promise对象
				}
			});
		});
	}
}




//工厂模式，返回实例对象
export function createSong(musicData){
	return new Song({
		id: musicData.songid,
		mid: musicData.songmid,
		singer: filterSinger(musicData.singer),
		name: musicData.songname,
		album: musicData.albumname,
		duration: musicData.interval,
		image: `https://y.gtimg.cn/music/photo_new/T002R300x300M000${musicData.albummid}.jpg?max_age=2592000`,
		url: `http://ws.stream.qqmusic.qq.com/${musicData.songid}.m4a?fromtag=46`
	});
}




export function filterSinger(singer){
	let ret = [];
	if(!singer){
		return '';
	}
	singer.forEach((s) => {
		ret.push(s.name);
	});

	return ret.join('/');
}






















