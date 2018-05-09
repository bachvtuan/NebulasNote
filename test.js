
var working_list = [1,2,3,4];
var list_key = [ 2,3];
var offset = -1;

for(var i = working_list.length-1; i>=0; i--  ){

    var index= list_key.indexOf(working_list[i]);

    if (index != -1){
        
        working_list.splice(index,1);
        
    }
}

console.log(working_list);
