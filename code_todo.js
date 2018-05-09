"use strict";

var SampleContract = function () {
   LocalContractStorage.defineMapProperty(this, "arrayMap");
   LocalContractStorage.defineMapProperty(this, "dataMap");
   LocalContractStorage.defineMapProperty(this, "dataStatus");
   LocalContractStorage.defineProperty(this, "size");
};

SampleContract.prototype = {
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


SampleContract.prototype = {
    init: function () {
        this.size = 0;
    },
    
    set: function (value) {
        // key is timestamped
        var date = new Date();
        var key = date.getTime();
        var index = this.size;
        this.arrayMap.set(index, key);
        this.dataMap.set(key, value);
        // 0 is not completed
        this.dataStatus.set(key, 0);
        this.size +=1;
    },
    get: function (key) {
        return this.dataMap.get(key);
    },

    len:function(){
      return this.size;
    },
    
    iterate: function(limit, offset){
        limit = parseInt(limit);
        offset = parseInt(offset);
        if(offset>this.size){
           throw new Error("offset is not valid");
        }
        var number = offset+limit;
        if(number > this.size){
          number = this.size;
        }
        var result  = "";
        for(var i=offset;i<number;i++){
            var key = this.arrayMap.get(i);
            var object = this.dataMap.get(key);
            result += "index:"+i+" key:"+ key + " value:" +object+"_";
        }
        return result;
    },
    del: function (offset) {
        var key = this.arrayMap.get(offset);
        if (key){
            this.arrayMap.del(offset);
            this.dataMap.del(key);
            this.size -=1;
        }
        return key;
    }
    
};

module.exports = SampleContract;

89982fd792f52a79cb039dcfc31e8edf100b1e18c2f03376809c9ad9614267b7
n1iswEkEbYuzZ5ux2VrFAotzXNGVZgrMPPk
[1,"tuan bach"] =>
