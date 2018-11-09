
/**
 * First we will load all of this project's JavaScript dependencies which
 * includes Vue and other libraries. It is a great starting point when
 * building robust, powerful web applications using Vue and Laravel.
 */

require('./bootstrap');

window.Vue = require('vue');
import { Form, HasError, AlertError } from 'vform'
window.Form = Form;

import VueRouter from 'vue-router';
Vue.use(VueRouter);

import moment from 'moment';
import VueProgressbar from 'vue-progressbar';
import swal from 'sweetalert2'
window.swal = swal;
window.Fire = new Vue();

const toast = swal.mixin({
    toast: true,
    position: 'top-end',
    showConfirmButton: false,
    timer: 3000
});

window.toast = toast;

Vue.use(VueProgressbar, {
    color: 'rgb(143, 255, 199)',
    fillerColor: 'red',
    height: '2px'
})


Vue.component(HasError.name, HasError)
Vue.component(AlertError.name, AlertError)

let routes=[
    {path: '/dashboard', component: require('./components/Dashboard.vue')},
    {path: '/developer', component: require('./components/Developer.vue')},
    {path: '/users', component: require('./components/Users.vue')},
    {path: '/profile', component: require('./components/Profile.vue')}
]

const router = new VueRouter({
    mode:'history',
    routes
})

/**
 * The following block of code may be used to automatically register your
 * Vue components. It will recursively scan this directory for the Vue
 * components and automatically register them with their "basename".
 *
 * Eg. ./components/ExampleComponent.vue -> <example-component></example-component>
 */

Vue.component('example-component', require('./components/ExampleComponent.vue'));

// const files = require.context('./', true, /\.vue$/i)

// files.keys().map(key => {
//     return Vue.component(_.last(key.split('/')).split('.')[0], files(key))
// })

/**
 * Next, we will create a fresh Vue application instance and attach it to
 * the page. Then, you may begin adding components to this application
 * or customize the JavaScript scaffolding to fit your unique needs.
 */

const app = new Vue({
    el: '#app',
    router
});

Vue.filter('capitalize', function (value) {
    if (!value) return ''
    value = value.toString()
    return value.charAt(0).toUpperCase() + value.slice(1)
  });

Vue.filter('upText', function (value) {
    return value.toUpperCase();
});

Vue.filter('myDate', function(created_at) {
    return moment(created_at).format('MMMM DD YYYY')
})

Vue.component(
    'passport-clients',
    require('./components/passport/Clients.vue')
);

Vue.component(
    'passport-authorized-clients',
    require('./components/passport/AuthorizedClients.vue')
);

Vue.component(
    'passport-personal-access-tokens',
    require('./components/passport/PersonalAccessTokens.vue')
);
// Client ID: 1
// Client Secret: ce4FW5Tp0HH2QLZMLhkv5Tea7Qdoi2XvwyWiMeaJ
// Password grant client created successfully.
// Client ID: 2
// Client Secret: faiy9nJDEKxjup6CV6Cm0bzXauWWXfoGLPS0Xijc

