
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

Vue.component('notification', {
  template: '#notification'  ,
  props: ['message'],
  created: function() {
    // disapperar after 3 seconds
    var _this = this;
    setTimeout(function(){
      _this.$emit('hide');
    },3000)


  },
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
