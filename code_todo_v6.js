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
    
    set: function (value) {
        //key is timestamp
        var key = parseInt(Blockchain.block.timestamp);
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


    }
    //bulk delete
    del: function () {
        
        var todo = this.addessTodo.get(Blockchain.transaction.from);

        if (!todo){
            return false;
        }

        var working_list = JSON.parse( todo.working_list );

        var offset = -1;
        
        for(var i =working_list.length-1; i>=0; i--  ){
            var index= arguments.indexOf(=working_list[i]);
            if (index != -1){
                var key = working_list[i];
                working_list.splice(index,1);
                todo.dataMap.del(key);
            }
        }
        
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

f99048d9e7c55f9cd3b2561aaaefea80c696cd8db7d46137eeb560d33dd3be32
n1wNeC5br2duK9RAQ2YLTWkTSdrmBZ6MkiQ
[1,"tuan bach"] =>


{"result":"\"[{\\\"key\\\":123,\\\"data\\\":\\\"let do this\\\"},{\\\"key\\\":23234,\\\"data\\\":\\\"obladsf\\\"},{\\\"key\\\":4456456,\\\"data\\\":\\\"lsdgdfG\\\"}]\"","execute_err":"","estimate_gas":"20366"}