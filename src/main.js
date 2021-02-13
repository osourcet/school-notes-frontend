import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import vuetify from './plugins/vuetify'
import dayjs from 'dayjs'
import UUID from 'vue-uuid'
import axios from 'axios'
import VueClipboards from 'vue-clipboards'

Vue.config.productionTip = false

Vue.use(UUID)
Vue.use(VueClipboards)

Vue.prototype.$axios = axios
Vue.prototype.$navigator = navigator

Vue.mixin({
    methods: {
        openURL(url, newTab=false){
            if (newTab)
                window.open(url)
            else
                window.location = url
        }
    }
})

Vue.filter('formatDate', function(value) {
    if (value)
        return dayjs(String(value)).format('DD.MM.YYYY')
    else
        return ''
})

Vue.filter('formatDateFromUnix', function(value) {
    if (value)
        return dayjs(new Date(Number(value))).format('DD.MM.YYYY')
    else
        return ''
})

const vm = new Vue({
    router,
    store,
    vuetify,
    render: function (h) { return h(App) },
    beforeCreate () {
        this.$store.dispatch('init')
    }
}).$mount('#app')

export default vm
