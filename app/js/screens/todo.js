const TodoList = {
  template: "#todo",
  data: function() {
    //console.log("Vue.prototype.$appPassord",Vue.prototype.$appPassord);
    return {
      notes: []
    }
  }
};
const Notification = {
  template: "#notification"
}


Vue.component('note-list', {
  template: '#note-list',
  props: {
    pnotes: {
      default: []
    }
  },
  data() {
    return {
      newNote: '',
      workingAction:'',
      pendingIndex:null,
      pendingNote: {},
      pendingTx:'',
      loading_message:'',
      update_note:null,
      notes: JSON.parse(JSON.stringify(this.pnotes))
    };
  },
  computed: {
    totalNotes() {
      return this.notes.length;
    }
  },
  created: function() {

    this.getList()


  },
  methods: {
    logOut() {
      localStorage.removeItem(Vue.prototype.$store_key);
      this.$router.push("/login");
    },
    getList: function() {
      var to = Vue.prototype.$dappAddress;
      var value = 0;
      var callFunction = "list";
      var callArgs = "";
      this.loading_message = "Please wait to get data";
      var my_listener = this.listenerList;
      nebPay.simulateCall(to, value, callFunction, callArgs, {
        listener: my_listener
      });
    },
    listenerList: function(resp) {
      this.loading_message = "";
      // error, user need import wallet first
      if (typeof(resp) == "string") {
        return;
      }
      
      if (resp.result) {
        var result = JSON.parse(resp.result);
        
        for (var i = result.length - 1; i >= 0; i--) {
          try{

            var plain = sjcl.decrypt(Vue.prototype.$appPassord, result[i].data);
            this.notes.push(JSON.parse(plain));
          }catch(error){
            console.log(error);
          }

        }
      }
    },
    addNote() {
      if (this.newNote) {
        var date = new Date();
        var time = date.getTime();

        this.pendingNote = {
          title: this.newNote,
          description: '',
          id: time
        };

        this.newNote = '';
        this.workingAction = 'addNote';
        var my_listener = this.listener;
        var params = [time.toString(), sjcl.encrypt(Vue.prototype.$appPassord, JSON.stringify(this.pendingNote)) ];
        nebPay.call(Vue.prototype.$dappAddress, 0, "set", JSON.stringify(params), {
          listener: my_listener //set listener for extension transaction result
        });

        this.loading_message = "Wait for confirm";


      }
    },
    editNote(note) {
      console.log("move to edit");
      this.update_note = JSON.parse( JSON.stringify(note) );
      //task.completed = ! task.completed;
    },
    removeNote(index) {
      var select_note = this.notes[index];
      this.loading_message = "Wait for confirm";
      var my_listener = this.listener;
      var params = [select_note.id.toString()];
      this.workingAction = "removeNote";
      this.pendingIndex =  index;
      nebPay.call(Vue.prototype.$dappAddress, 0, "del", JSON.stringify(params), {
        listener: my_listener 
      });
      
    },
    updateNote: function(note){
    	console.log("note",note);
    	this.update_note = null;

    	for(var i = 0; i < this.notes.length; i++){
        if (this.notes[i].id == note.id){
          this.pendingIndex = i;
          break;
        }
      }
      if (this.pendingIndex === null) return;

    	
    	
    	this.workingAction = "updateNote";
      this.loading_message = "Wait for confirm";
      var my_listener = this.listener;

      this.pendingNote = note;
      var params = [note.id.toString(), sjcl.encrypt(Vue.prototype.$appPassord, JSON.stringify(this.pendingNote))];
      console.log("this.pendingIndex",this.pendingIndex);
      
      nebPay.call(Vue.prototype.$dappAddress, 0, "update", JSON.stringify(params), {
        listener: my_listener 
      });

      
    },
    closeUpdate:function(){
    	this.update_note = null;
    },
    listener: function(resp) {
      
      if (Vue.prototype.$user_reject == resp){
        this.loading_message = "";
        return;
      }
      this.loading_message = "Please wait for confirmation on network";
      this.pendingTx = resp.txhash;
      this.onrefreshClick();
    },

    onrefreshClick: function() {
      var _this = this;
      setTimeout(function() {
        if (!_this.pendingTx) return;
        
        neb.api.getTransactionReceipt(_this.pendingTx).then(function(resp){
            if ( resp && resp.status == 1) {
              _this.pendingTx = "";
              
              _this.loading_message = "";
              switch(_this.workingAction){
                case 'removeNote':
                  if (_this.pendingIndex !== null){
                    _this.notes.splice(_this.pendingIndex, 1);
                    _this.pendingIndex = null;                    
                  }

                  break;

                case 'addNote':
                  
                  _this.notes.splice(0, 0, _this.pendingNote);
                  //_this.notes.push(_this.pendingNote);
                  _this.pendingNote = {};
                  break;

                case 'updateNote':
                  console.log("update note", _this.pendingNote, _this.pendingIndex);
                  _this.notes[_this.pendingIndex] =  _this.pendingNote;
                  _this.pendingIndex = null;
                  _this.pendingNote = {};
                  break;
              }
              


            } else {
              console.log("call again");
              _this.onrefreshClick();
            }
        }).catch(function(err){ console.log("my error", err); })
        
      }, 10000);

    }
  }
});

Vue.component('note-item', {
  template: '#note-item',
  props: ['note'],
  computed: {
    className() {
      let classes = ['notes__item__toggle'];

      return classes.join(' ');
    }
  }
});


Vue.component('update-note', {
  template: '#update-note',
  props: ['pnote'],
  data() {
  	var note = JSON.parse(JSON.stringify(this.pnote));
  	var date = new Date( parseInt(note.id)  );
    return {
      note: note,
      created_date :date.toDateString()
    };
  },
  methods:{
  	update:function(){
  		console.log(this.note);
  		this.$emit('update', this.note)
  	},
    close:function(event){
      if (event.target.className == "update-note"){
        this.$emit('close');
      }


    }
  }
  
});