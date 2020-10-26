/* sotre>index.ts 统一规范
 * 1. 定义数据行为需在mutations-type中定义常量
 * 2. 储存数据保持精简，actions每个方法中需要添加注释
 * 至于为何需要添加mutations-type常量, 请在官网中寻找答案:
 * https://vuex.vuejs.org/zh/guide/mutations.html#使用常量代替-mutation-事件类型
 */
import Vue from 'vue';
import Vuex from 'vuex';
import { RECEIVE_COUNT } from './mutations-type';

Vue.use(Vuex);
/* 注意: count为示例案例, 项目中请自行删除 */
export default new Vuex.Store({
  state: {
    count: 18,
  },
  mutations: {
    [RECEIVE_COUNT]: (state, count) => (state.count = count),
  },
  actions: {
    // 接收count
    recCount({ commit }, count) {
      commit(RECEIVE_COUNT, count);
    },
  },
  getters: {},
});
