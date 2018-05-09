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
            
            working_list = [key];
        }else{
            working_list = JSON.parse(todo.working_list);
            working_list.push( key );
            
        }
        todo.working_list = JSON.stringify( working_list );

        todo.dataMap.set(key, value);
                
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

    
    iterate: function(limit, offset){

        var from = Blockchain.transaction.from;
        var todo = this.addessTodo.get(from);
        var working_list = todo ?  JSON.parse( todo.working_list ) : [];
        var size = working_list.length;
        limit = parseInt(limit);
        offset = parseInt(offset);
        if(offset>size){
           throw new Error("offset is not valid");
        }

        var number = offset+limit;

        if(number > size){
          number = size;
        }

        var result  = [];
        
        for(var i=offset;i<number;i++){
            var key = working_list[i];
            var object = todo.dataMap.get(key);
            result.push({ key: key, data: object});
        }

        return  JSON.stringify(result);
    },
    del: function (offset) {
        offset = parseInt(offset);
        var from = Blockchain.transaction.from;
        var todo = this.addessTodo.get(from);

        if (!todo){
            return false;
        }

        var working_list = JSON.parse( todo.working_list );
        var key = working_list[offset];
        if (offset >= working_list.length ){
            return;
        }
        working_list.splice(offset,1);
        
        if (key){
            todo.dataMap.del(key);
        }

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


{"result":"\"[{\\\"key\\\":123,\\\"data\\\":\\\"let do this\\\"},{\\\"key\\\":23234,\\\"data\\\":\\\"obladsf\\\"},{\\\"key\\\":4456456,\\\"data\\\":\\\"lsdgdfG\\\"}]\"","execute_err":"","estimate_gas":"20366"}