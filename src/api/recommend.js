



import axios from 'axios'
import jsonp from 'common/js/jsonp.js'
import {commonParams,options} from './config.js'


export function getRecommend(){
	const url = 'https://c.y.qq.com/musichall/fcgi-bin/fcg_yqqhomepagerecommend.fcg';

	const data = Object.assign({}, commonParams, {
		platform: 'h5',
		uin: 0,
		needNewCode: 1
	});

	return jsonp(url, data, options);
}



export function getDiscList(){
	const url = '/api/getDiscList';


	//Object.assign() 方法用于将所有可枚举的属性的值从一个或多个源对象复制到目标对象。它将返回目标对象。第一个参数为目标对象，其它的参数为源对象
	const data = Object.assign({}, commonParams, {
		platform: 'yqq',
		needNewCode: 0,
		categoryId: 10000000,
		sortId: 5,
		hostUin: 0,
		sin: 0,
		ein: 29,
		format: 'json',
		rnd: Math.random()
	});

	return axios.get(url,{
		params: data
	}).then((res) => {
		return Promise.resolve(res.data);
	});
}







export function getSongList(disstid){
	const url = 'https://c.y.qq.com/qzone/fcg-bin/fcg_ucc_getcdinfo_byids_cp.fcg';

	const data = Object.assign({}, commonParams, {
		disstid,
		type: 1,
		json: 1,
		utf8: 1,
		onlysong: 0,
		platform: 'yqq',
		hostUin: 0,
		needNewCode: 0,
	});

	return jsonp(url, data, options);
}
























