"use strict";

var SampleContract = function () {
   LocalContractStorage.defineMapProperty(this, "arrayMap");
   LocalContractStorage.defineMapProperty(this, "dataMap");
   LocalContractStorage.defineMapProperty(this, "dataStatus");
   LocalContractStorage.defineProperty(this, "size");
};

SampleContract.prototype = {
    init: function () {
        this.size = 0;
    },
    toString: function() {
        return this.size.toString();
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
};


ListTodo.prototype = {
    init: function () {
        
    },
    
    set: function (key,value) {
        
        var from = Blockchain.transaction.from;
        var todo = this.addessTodo.get(from);
        if ( !todo ){

            // create new instance to store todo from this address
            todo = new SampleContract();
        }

        var index = todo.size;
        todo.arrayMap.set(index, key);
        todo.dataMap.set(key, value);
        // 0 is not completed
        todo.dataStatus.set(key, 0);
        todo.size +=1;
        
        this.addessTodo.put(from, todo);


    },
    get: function (key) {
        var from = Blockchain.transaction.from;
        var todo = this.addessTodo.get(from);
        if (!todo){
            return "";
        }else{
            return todo.dataMap.get(key);
        }
        
    },

    len:function(){
        var from = Blockchain.transaction.from;
        var todo = this.addessTodo.get(from);
        return todo ? todo.size : 0;
      
    },
    
    iterate: function(limit, offset){

        var from = Blockchain.transaction.from;
        var todo = this.addessTodo.get(from);
        var size = todo ? todo.size : 0;

        limit = parseInt(limit);
        offset = parseInt(offset);
        if(offset>size){
           throw new Error("offset is not valid");
        }
        var number = offset+limit;

        if(number > size){
          number = size;
        }

        var result  = "";
        for(var i=offset;i<number;i++){
            var key = todo.arrayMap.get(i);
            var object = todo.dataMap.get(key);
            result += "index:"+i+" key:"+ key + " value:" +object+"_";
        }
        return result;
    },
    del: function (offset) {
        var from = Blockchain.transaction.from;
        var todo = this.addessTodo.get(from);

        if (!todo){
            return false;
        }

        var key = todo.arrayMap.get(offset);
        if (key){
            todo.arrayMap.del(offset);
            todo.dataMap.del(key);
            todo.size -=1;
        }

        //update back
        this.addessTodo.put(from, todo);
        return true;
    }
    
};

module.exports = ListTodo;

7c90e4c3741be27b6b772d40a033bd7f0d36e9682689260e97f8288450a22faa
n1qdwDUp59pcrXiK1tmPeNUyeBWWfnEuJur
[1,"tuan bach"] =>
