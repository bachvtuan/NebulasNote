// dApp smart contract address
Vue.prototype.$dappAddress = "n1xep1BsGhhk7FJaEuHaXsssoHyTJfTWz66";
//can use any text, pick this one
Vue.prototype.$store_key = 'password';
Vue.prototype.$user_reject = 'Error: Transaction rejected by user';


const Main = {
  template: "#main",
  mounted() {
    this.$router.push({name:"Login"});
  }
}



Vue.component('loading-item', {
  template: '#loading-item'  ,
  props: ['message']
});

var routes = [{
  path: "/todo",
  name: "Todo",
  component: TodoList
},  {
  path: "/login",
  name: "Login",
  component: Login
}];



var router = new VueRouter({
  routes: routes
});

new Vue({
  el: "#main",
  router: router,
  render: function render(h) {
    return h(Main);
  }
});
