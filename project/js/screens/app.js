

const Main = {
  template: "#main",
  mounted() {
    this.$router.push({name:"Login"});
  }
}

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
