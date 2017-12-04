




//初始化store的入口js

import Vue from 'vue'

import Vuex from 'vuex'

import * as actions from './actions.js'

import * as getters from './getters.js'

import state from './state.js'

import mutations from './mutations.js'

import createLogger from 'vuex/dist/logger'    //展示在mutations里修改数据的日志

Vue.use(Vuex);

const debug = process.env.NODE_ENV !== 'production';

export default new Vuex.Store({
	actions,
	getters,
	state,
	mutations,
	strict: debug,      //严格模式(开发环境使用)
	plugins: debug ? [createLogger()] : []   //应用的插件
});







