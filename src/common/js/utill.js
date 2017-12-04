

//洗牌函数
//获取min到max的随机数，包括max
function getRandomInt(min, max){  
	return Math.floor(Math.random() * (max - min + 1) + min);
}

export function shuffle(arr){
	let _arr = arr.slice();   //复制数组
	for(let i=0; i<_arr.length; i++){
		let j = getRandomInt(0, i);
		let t = _arr[i];
		_arr[i] = _arr[j];
		_arr[j] = t;
	}
	return _arr;
}



//节流函数
export function debounce(fn, delay){
	let timer;
	return function(...args){
		if(timer){
			clearTimeout(timer);
		}
		timer = setTimeout(() => {
			fn.apply(this, args);
		}, delay);
	}
}





















































