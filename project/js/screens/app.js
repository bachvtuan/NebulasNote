
const TodoList = {
  template: "#todo"
};
const Notification = {
  template: "#notification"
}


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
},
  {
    path: "/notification",
    name: "Notification",
    component: Notification
  }];



var router = new VueRouter({
  routes: routes
});

new Vue({
  el: "#app",
  store: store,
  router: router,
  render: function render(h) {
    return h(Main);
  }
});
