"use strict";

var Note = function() {

  LocalContractStorage.defineMapProperty(this, "dataMap");
  LocalContractStorage.defineProperty(this, "working_list");

};


Note.prototype = {
  init: function() {},
  toString: function() {
    return this.working_list ? this.working_list.toString() : "[]";
  }
};


var UserNotes = function() {
  // map address to list
  LocalContractStorage.defineMapProperty(this, "addressNote", {
    parse: function(text) {
      return new Note(text);
    },
    stringify: function(o) {
      return o.toString();
    }
  });

  LocalContractStorage.defineMapProperty(this, "listPassword");
};


UserNotes.prototype = {
  init: function() {

  },
  //this is encrypt string
  setPassword: function(password) {
    var from = Blockchain.transaction.from;
    var exist_password = this.listPassword.get(from);
    if (exist_password) {
      //user already set password, this is one time password
      return false;
    } else {
      this.listPassword.set(from, password);
      return true;
    }
  },
  //this is encrypt string, only decrypt from client with given password
  getPassword: function() {
    var from = Blockchain.transaction.from;
    return this.listPassword.get(from);
  },
  set: function(key, value) {

    var from = Blockchain.transaction.from;
    var note = this.addressNote.get(from);
    var found = false;
    var working_list;
    if (!note) {
      // create new instance to store note from this address
      note = new Note();
      working_list = [key];
    } else {
      found = true;
      working_list = JSON.parse(note.working_list);
      working_list.push(key);
    }
    note.working_list = JSON.stringify(working_list);
    note.dataMap.set(key, value);
    //only put for first time
    if (!found) {
      this.addressNote.put(from, note);
    }

  },
  //get single note by key
  get: function(key) {
    var from = Blockchain.transaction.from;
    var note = this.addressNote.get(from);
    if (!note) {
      return null;
    } else {
      return note.dataMap.get(key);
    }

  },
  // get all notes 
  list: function() {

    var note = this.addressNote.get(Blockchain.transaction.from);
    var result = [];
    if (!note) {
      return result;
    }

    var working_list = JSON.parse(note.working_list);
    var size = working_list.length;

    for (var i = 0; i < size; i++) {
      var key = working_list[i];
      var object = note.dataMap.get(key);
      result.push({
        key: key,
        data: object
      });
    }
    return result;
  },

  update: function(key, value) {

    var found = false;
    key = parseInt(key);
    var note = this.addressNote.get(Blockchain.transaction.from);

    if (!note) {
      return found;
    }

    var working_list = JSON.parse(note.working_list);

    for (var i = 0, i1 = working_list.length; i < i1; i++) {
      if (working_list[i] == key) {
        note.dataMap.set(key, value);
        found = true;
        break;
      }
    }
    return found;

  },
  del: function(key) {
    key = parseInt(key);
    var note = this.addressNote.get(Blockchain.transaction.from);

    if (!note) {
      return false;
    }

    var working_list = JSON.parse(note.working_list);

    var offset = -1;
    for (var i = 0, i1 = working_list.length; i < i1; i++) {
      if (working_list[i] == key) {
        offset = i;
        break;
      }
    }
    if (offset == -1) {
      return false;
    }

    working_list.splice(offset, 1);
    note.dataMap.del(key);

    note.working_list = JSON.stringify(working_list);
    return true;
  },
  workingList: function() {
    var from = Blockchain.transaction.from;
    var note = this.addressNote.get(from);

    if (!note) {
      return [];
    }
    return JSON.parse(note.working_list);
  }

};


module.exports = UserNotes;