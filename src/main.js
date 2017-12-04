
import 'babel-polyfill'    //对ES6的API做转义

import Vue from 'vue'
import App from './App'

import router from './router/router.js'   //引入路由组件

import VueLazyLoad from 'vue-lazyload'   //引入懒加载插件

import fastclick from 'fastclick'   //对移动端点击300ms延迟进行修复

import 'common/stylus/index.styl'    //引入基础样式和字体样式  	 

import store from './store/index.js'   //引入vuex的状态管理	 


fastclick.attach(document.body);

Vue.use(VueLazyLoad,{
	loading: require('common/image/default.png')
});


/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})






