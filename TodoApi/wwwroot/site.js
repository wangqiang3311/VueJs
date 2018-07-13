const uri = 'api/todo';
var app = new Vue({
    el: '#app-4',
    data: {
        todos: [],
        seen: false,
        selectedId: '',
        selectedName: '',
        ischoose: false,
        inputName: ''
    },
    methods: {
        editItem: function (id) {
            this.seen = true;
            var that = this;
            $.each(this.todos, function (key, item) {
                if (item.id === id) {
                    that.selectedId = id;
                    that.selectedName = item.name;
                    that.ischoose = item.isComplete;
                }
            });
        },
        deleteItem: function (id) {
            $.ajax({
                url: uri + '/' + id,
                type: 'DELETE',
                success: function (result) {
                    getData();
                }
            });

        },
        updateItem: function () {
            const item = {
                'name': this.selectedName,
                'isComplete': this.ischoose,
                'id': this.selectedId
            };

            $.ajax({
                url: uri + '/' + this.selectedId,
                type: 'PUT',
                accepts: 'application/json',
                contentType: 'application/json',
                data: JSON.stringify(item),
                success: function (result) {
                    getData();
                }
            });

            this.closeInput();
            return false;
        },
        addItem: function () {
            const item = {
                'name': this.inputName,
                'isComplete': false
            };
            var that = this;

            $.ajax({
                type: 'POST',
                accepts: 'application/json',
                url: uri,
                contentType: 'application/json',
                data: JSON.stringify(item),
                error: function (jqXHR, textStatus, errorThrown) {
                    alert('here');
                },
                success: function (result) {
                    getData();
                    that.inputName = '';
                }
            });
        },
        closeInput: function () {

            app.seen = false;

        }

    }
});


function getCount(data) {
    const el = $('#counter');
    let name = 'to-do';
    if (data) {
        if (data > 1) {
            name = 'to-dos';
        }
        el.text(data + ' ' + name);
    } else {
        el.html('No ' + name);
    }
}

$(document).ready(function () {
    getData();
});

function getData() {
    $.ajax({
        type: 'GET',
        url: uri,
        success: function (data) {
            getCount(data.length);
            app.todos.splice(0, app.todos.length);
            $.each(data, function (key, item) {
                const checked = item.isComplete;
                app.todos.push({
                    id: item.id,
                    name: item.name,
                    isComplete: item.isComplete,
                    enabled: checked
                });
            });
        }
    });
}