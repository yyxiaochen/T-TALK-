import Vue from 'vue'
import App from './App'

Vue.config.productionTip = false

App.mpType = 'app'

import $app from './static/js/common.js';
Vue.prototype.app = $app;



const app = new Vue({
    ...App
})
app.$mount()
