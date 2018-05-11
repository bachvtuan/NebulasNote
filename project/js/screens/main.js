
const Login = {
  template: "#login",
  data:function () {
    return {
      extension_installed:false,
      sample_param: "Hello World!",
      show_loading: false,
      checking:true,
      password:'',
      v_password:'',
      encrypt_password:null
    };
  },
  methods:{
    checkPassword: function(){
        var to = Vue.prototype.$dappAddress;
        var value = 0;
        var callFunction = "getPassword";
        var callArgs = "";
        
        var my_listener = this.listener;
        nebPay.simulateCall(to, value, callFunction, callArgs, {
            listener: my_listener  
        });
        
    },

    listener: function(resp) {
        
        // error, user need import wallet first
        if (typeof(resp) == "string"){
          return;
        }

        this.checking = false;
        console.log("resp.result",resp);
        
        this.encrypt_password =  (resp.result && resp.result !== "null") ?  JSON.parse(resp.result)   : null;
        var local_password = localStorage.getItem(Vue.prototype.$store_key);

        //password is stored, verify it
        if (local_password && this.encrypt_password){
          
          try{
            var plain_password = atob(local_password);
            var de_result = sjcl.decrypt( plain_password , this.encrypt_password);
            
            if (de_result == this.sample_param ){
              Vue.prototype.$appPassord = plain_password;
              this.$router.push("/todo");
            }
          }catch(error){
            console.log(error);
            
          }
        }
        
    },
    register:function(){
      if (!this.password){
        alert("Please input password");
        return;
      }
      
      // encrypt password and store on blockchain to map this address
      // this is string, not object
      var ciphertext = sjcl.encrypt(this.password, this.sample_param);
      var my_listener = this.registerListener;
      this.serialNumber = nebPay.call(Vue.prototype.$dappAddress, 0, "setPassword", JSON.stringify([ciphertext]), {
          listener: my_listener  //set listener for extension transaction result
      });

      this.show_loading = true;

      this.onrefreshClick();
    },

    login:function(){
      
      
      console.log(this.encrypt_password);
      try{
        var de_result = sjcl.decrypt(this.v_password, this.encrypt_password);
      
        if (de_result !== this.sample_param ){
          alert("Invalid password");
        }else{
          
          localStorage.setItem(Vue.prototype.$store_key, btoa(this.v_password));
          Vue.prototype.$appPassord = this.v_password;
          console.log(this.$router);
          this.$router.push("/todo");
        }
      }catch(error){
        console.log(error);
        alert("Invalid password");
      }
      

    },
    registerListener:function(resp){
      console.log("register listener", resp);
    },

    onrefreshClick: function() {
      var _this = this;
      setTimeout(function(){
          if (!_this.serialNumber) return;
          nebPay.queryPayInfo(_this.serialNumber)   //search transaction result from server (result upload to server by app)
          .then(function (resp) {

            
            if (!resp) return;
            resp = JSON.parse(resp);

              if (resp.code == 0 && resp.data.status == 1){
                console.log("finished");
                _this.show_loading = false;
                //set password  and go to list
                localStorage.setItem(Vue.prototype.$store_key, btoa(this.password));
                this.$router.push("/todo");
              }else{
                console.log("call again");
                _this.onrefreshClick();                
              }

          })
          .catch(function (err) {
              console.log("my error",error);
              
          });
      },10000);

    }

  },
   created: function(){
      this.extension_installed = typeof(window.webExtensionWallet) == "string";
      if (this.extension_installed){
        this.checkPassword()
      }
      
  }
};

