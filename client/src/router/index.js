import Vue from 'vue'
import Router from 'vue-router'
import VeeValidate from 'vee-validate'
// import HelloWorld from '@/components/HelloWorld'
import FrontPage from '@/components/HO_FrontPage'
import Content from '@/components/HO_Content'
import AddThread from '@/components/HO_AddThread'
import Thread from '@/components/HO_Thread'
import VueResource from 'vue-resource'
import '@/assets/bootstrap/css/bootstrap.min.css'
import '@/assets/bootstrap/css/style/style.css'
import '@/assets/bootstrap/font-awesome/css/font-awesome.min.css'
import '@/assets/bootstrap/js/jquery.min.js'
import '@/assets/bootstrap/js/bootstrap.min.js'

Vue.use(Router)
Vue.use(VeeValidate)
Vue.use(VueResource)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Hello',
      component: Content
    },
    {
      path: '/thread/:slug',
      name: 'Thread',
      component: Thread
    },
    {
      path: '/user/:userId',
      name: 'User',
      component: AddThread
    }
  ]
})
