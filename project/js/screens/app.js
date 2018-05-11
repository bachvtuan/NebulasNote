
Vue.prototype.$dappAddress = "n1yJTnQwxLYg1GvQ3k1taxVNq84sofYXoD7";
//can use any text, pick this one
Vue.prototype.$store_key = 'password';


const Main = {
  template: "#main",
  mounted() {
    this.$router.push({name:"Login"});
  }
}



Vue.component('loading-item', {
  template: '#loading-item'  
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
