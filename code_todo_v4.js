"use strict";

var SampleContract = function () {
   LocalContractStorage.defineMapProperty(this, "arrayMap");
   LocalContractStorage.defineMapProperty(this, "dataMap");
   LocalContractStorage.defineMapProperty(this, "dataStatus");
   LocalContractStorage.defineProperty(this, "size");
   LocalContractStorage.defineProperty(this, "working_list");
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
        key = parseInt(key);
        var from = Blockchain.transaction.from;
        var todo = this.addessTodo.get(from);
        var working_list;
        if ( !todo ){
            // create new instance to store todo from this address
            todo = new SampleContract();
            todo.size = 0;
            working_list = [key];
        }else{
            working_list = JSON.parse(todo.working_list);
            working_list.push( key );
            
        }
        todo.working_list = JSON.stringify( working_list );

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
        var working_list = JSON.parse( todo.working_list );
        for(var i=offset;i<number;i++){
            var key = working_list[i];
            var object = todo.dataMap.get(key);
            result += "index:"+i+" key:"+ key + " value:" +object+"_";
        }
        return result;
    },
    del: function (offset) {
        offset = parseInt(offset);
        var from = Blockchain.transaction.from;
        var todo = this.addessTodo.get(from);

        if (!todo){
            return false;
        }

        var working_list = JSON.parse( todo.working_list );
        if (offset >= working_list.length ){
            return;
        }
        working_list.splice(offset,1);
        // var key = todo.arrayMap.get(offset);
        // if (key){
        //     todo.arrayMap.del(offset);
        //     todo.dataMap.del(key);
        //     todo.dataStatus.del(key);
        //     todo.size -=1;
        // }
        todo.working_list = JSON.stringify( working_list );

        //update back
        //this.addessTodo.put(from, todo);
        return true;
    },
    workingList:function(){
        var from = Blockchain.transaction.from;
        var todo = this.addessTodo.get(from);

        if (!todo){
            return "empty";
        }
        return todo.working_list;
    }
    
};

module.exports = ListTodo;

f99048d9e7c55f9cd3b2561aaaefea80c696cd8db7d46137eeb560d33dd3be32
n228mRphXeoT483gFH57Vaz8rL5NWjUgnst
[1,"tuan bach"] =>
