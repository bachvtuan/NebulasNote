
const TodoList = {
  template: "#todo",
  data: function(){
  	return {
    notes: [
      {
        title: 'Make todo list',
        description:'',
        completed: true,
        id:1
      },
      {
        title: 'Go skydiving',
        description:'',
        completed: false,
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
    incomplete() {
      return this.notes.filter(this.inProgress).length;
      
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
    completeTask(task) {
      task.completed = ! task.completed;
    },
    removeTask(index) {
      this.notes.splice(index, 1);
    },
    clearCompleted() {
    	console.log("SDFsdf");
      var temp = this.notes.filter(this.inProgress);

      this.notes = temp;
    },
    clearAll() {
      this.notes = [];
    },
    
    inProgress(task) {
      return ! this.isCompleted(task);
    },
    isCompleted(task) {
      return task.completed;
    }
  }
});

Vue.component('task-item', {
  template: '#task-item',
  props: ['task'],
  computed: {
    className() {
      let classes = ['tasks__item__toggle'];
      if (this.task.completed) {
        classes.push('tasks__item__toggle--completed');
      }
      return classes.join(' ');
    }
  }
});