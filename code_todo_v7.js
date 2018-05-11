"use strict";

var SampleContract = function () {
   LocalContractStorage.defineMapProperty(this, "dataMap");
   
   LocalContractStorage.defineProperty(this, "working_list");
};

SampleContract.prototype = {
    init: function () {
        
    },
    toString: function() {
        return this.working_list ? this.working_list.toString() : "[]";
    }
};


var ListTodo = function () {
    // map address to list
    LocalContractStorage.defineMapProperty(this, "addessTodo", {
        parse: function(text) {
            return new SampleContract(text);
        },
        stringify: function(o) {
            return o.toString();
        }
    });

    LocalContractStorage.defineMapProperty(this, "listPassword");
};


ListTodo.prototype = {
    init: function () {
        
    },
    //this is encrypt string
    setPassword: function(password){
        var from = Blockchain.transaction.from;
        var exist_password = this.listPassword.get(from);
        if (exist_password){
            //user already set password, this is one time password
            return false;
        }else{
            this.listPassword.set(from, password);
            return true;
        }
    },
    //this is encrypt string
    getPassword: function(){
        var from = Blockchain.transaction.from;
        return this.listPassword.get(from);
    },
    //ussally key is timestamp
    set: function (key,value) {
        
        var from = Blockchain.transaction.from;
        var todo = this.addessTodo.get(from);
        var found = false;
        var working_list;
        if ( !todo ){
            // create new instance to store todo from this address
            todo = new SampleContract();
            working_list = [key];
        }else{
            found = true;
            working_list = JSON.parse(todo.working_list);
            working_list.push( key );
        }
        todo.working_list = JSON.stringify( working_list );
        todo.dataMap.set(key, value);
        //only put for first time
        if (!found){
            this.addessTodo.put(from, todo);
        }

    },
    get: function (key) {
        var from = Blockchain.transaction.from;
        var todo = this.addessTodo.get(from);
        if (!todo){
            return null;
        }else{
            return todo.dataMap.get(key);
        }
        
    },
    list: function(){

        var todo = this.addessTodo.get(Blockchain.transaction.from);
        var result  = [];
        if (!todo){
            return result;
        }

        var working_list = JSON.parse( todo.working_list );
        var size = working_list.length;
        
        for(var i=0;i<size;i++){
            var key = working_list[i];
            var object = todo.dataMap.get(key);
            result.push({ key: key, data: object});
        }
        return  result;
    },
    update: function(key, value){

        var found = false;
        key = parseInt(key);
        var todo = this.addessTodo.get(Blockchain.transaction.from);

        if (!todo){
            return found;
        }

        var working_list = JSON.parse( todo.working_list );        
        
        for(var i =0,i1= working_list.length; i<i1; i++  ){
            if ( working_list[i] == key ){
                todo.dataMap.set(key, value);
                found= true;
                break;
            }
        }
        return found;

    },
    del: function (key) {
        key = parseInt(key);
        var todo = this.addessTodo.get(Blockchain.transaction.from);

        if (!todo){
            return false;
        }

        var working_list = JSON.parse( todo.working_list );

        var offset = -1;
        for(var i =0,i1= working_list.length; i<i1; i++  ){
            if (working_list[i]== key){
                offset = i;
                break;
            }
        }
        if (offset == -1){
            return false;
        }
        
        working_list.splice(offset,1);
        todo.dataMap.del(key);

        todo.working_list = JSON.stringify( working_list );
        return true;
    },
    workingList:function(){
        var from = Blockchain.transaction.from;
        var todo = this.addessTodo.get(from);

        if (!todo){
            return [];
        }
        return  JSON.parse(todo.working_list);
    }
    
};


module.exports = ListTodo;