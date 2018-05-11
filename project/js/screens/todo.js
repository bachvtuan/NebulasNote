
const TodoList = {
  template: "#todo",
  data: function(){
  	return {
    notes: [
      {
        title: 'Make todo list',
        description:'',
        id:1
      },
      {
        title: 'Go skydiving',
        description:'',
        id:2
      }
    ]
  }
  } 
};
const Notification = {
  template: "#notification"
}


Vue.component('note-list', {
  template: '#note-list',
  props: {
    pnotes: {default: []}
  },
  data() {
    return {
      newNote: '',
      notes: JSON.parse( JSON.stringify(this.pnotes) )
    };
  },
  computed: {
    totalNotes() {
      return this.notes.length;
    }
  },
  methods: {
    addNote() {
      if (this.newNote) {
      	var date = new Date();
      	var time = date.getTime();
        this.notes.push({
          title: this.newNote,
          completed: false,
          id: time
        });
        this.newNote = '';
      }
    },
    editNote(note) {
    	console.log("move to edit");
      //task.completed = ! task.completed;
    },
    removeNote(index) {
      this.notes.splice(index, 1);
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