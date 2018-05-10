
var store = new Vuex.Store({
  state: {
    list: [{
      id: 1,
      title: "Ceremony at Monkey Forest",
      location: "Alas Kedaton, Tabanan",
      date: "18 Mar 2018",
      hour: "14:00 PM",
      joined: 32,
      imageURL: "https://c2.staticflickr.com/8/7390/11206634984_44f61f926d.jpg",
      desc: "The temple ceremony in Alas Kedaton Temple is carried out every 210 days a year. It is on <i>Anggarakasih Medangsia</i> (Balinese Hindu calendar) or on every Tuesday where on that time the society do the worship or pray to request the safety and prosperity. The unique in this ceremony is do not use the fire and do not hence Penjor and also finished before the sunset or before the night is come."
    }]
  }
});


var contract_address = "n1yJTnQwxLYg1GvQ3k1taxVNq84sofYXoD7";
//can use any text, pick this one

const Login = {
  template: "#login",
  data:function () {
    return {
      store_key: 'password',
      sample_param: "Hello World!",
      checking:true,
      password:'',
      v_password:'',
      encrypt_password:null
    };
  },
  methods:{
    checkPassword: function(){
        var to = contract_address;
        var value = 0;
        var callFunction = "getPassword";
        var callArgs = "";
        
        var my_listener = this.listener;
        nebPay.simulateCall(to, value, callFunction, callArgs, {
            listener: my_listener  
        });
        
    },

    listener: function(resp) {
        this.checking = false;
        
        this.encrypt_password = resp.result !== "null" ?  JSON.parse(resp.result)   : null;
        var local_password = localStorage.getItem(this.store_key);

        //password is stored, verify it
        if (local_password && this.encrypt_password){
          
          try{
            var de_result = sjcl.decrypt( atob(local_password), this.encrypt_password);
            
            if (de_result == this.sample_param ){

              this.$router.push("/todo");
            }
          }catch(error){
            console.log(error);
            
          }
        }
        
    },
    register:function(){
      if (!this.password){
        return;
      }
      console.log("register", this.password);

      // encrypt password and store on blockchain to map this address
      // this is string, not object
      var ciphertext = sjcl.encrypt(this.password, this.sample_param);
      var my_listener = this.registerListener;
      this.serialNumber = nebPay.call(contract_address, 0, "setPassword", JSON.stringify([ciphertext]), {
          listener: my_listener  //set listener for extension transaction result
      });

      this.onrefreshClick();
    },

    login:function(){
      
      
      console.log(this.encrypt_password);
      try{
        var de_result = sjcl.decrypt(this.v_password, this.encrypt_password);
      
        if (de_result !== this.sample_param ){
          alert("Invalid password");
        }else{
          
          localStorage.setItem(this.store_key, btoa(this.v_password));

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
      
          nebPay.queryPayInfo(_this.serialNumber)   //search transaction result from server (result upload to server by app)
          .then(function (resp) {
            if (!resp) return;
            resp = JSON.parse(resp);

              if (resp.code == 0 && resp.data.status == 1){
                console.log("finished");
              }else{
                console.log("call again");
                _this.onrefreshClick();                
              }

          })
          .catch(function (err) {
              console.log(err);
          });
      },10000);

    }

  },
   created: function(){
      this.checkPassword()
  }
};

