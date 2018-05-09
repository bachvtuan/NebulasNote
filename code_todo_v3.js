"use strict";

var SampleContract = function () {
   LocalContractStorage.defineMapProperty(this, "arrayMap");
   LocalContractStorage.defineMapProperty(this, "dataMap");
   LocalContractStorage.defineMapProperty(this, "dataStatus");
   LocalContractStorage.defineProperty(this, "size");
};

SampleContract.prototype = {
    init: function () {
        
    },
    toString: function() {
        return this.size ? this.size.toString() : "0";
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
            todo.size = 0;
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
            todo.dataStatus.del(key);
            todo.size -=1;
        }

        //update back
        //this.addessTodo.put(from, todo);
        return true;
    }
    
};

module.exports = ListTodo;

347e1dd5bd66ebee7cbb9a504a80ee1fea574ebcd43f5016d797d1a99f0e4cc6
n1fYXSjNdz3b5We8jXWGBNUFK3Q3mMFhJ1q
[1,"tuan bach"] =>
