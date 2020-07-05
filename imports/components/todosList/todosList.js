import angular from 'angular';
import angularMeteor from 'angular-meteor';
import { Tasks } from "../../api/tasks.js";

import template from './todosList.html';

class TodosListCtrl {
    constructor($scope) {
        $scope.viewModel(this);

        this.hideCompleted = false;

        this.helpers({
            tasks() {
                const selector = {};

                // If hide completed is checked, filter tasks
                if (this.getReactively('hideCompleted')) {
                    selector.checked = {
                        $ne: true
                    };
                }

                // Show newest tasks at the top
                return Tasks.find(selector, {
                    sort: {
                        createdAt: -1
                    }
                });
            },
            incompleteCount() {
                return Tasks.find({
                    checked: {
                        $ne: true
                    }
                }).count();
            }
        });

        // this.tasks = [
        //     { text: 'This is task 1' },
        //     { text: 'This is task 2' },
        //     { text: 'This is task 3' }
        // ];
    }

    addTask(newTask) {
        // Insert a task into the collection
        Tasks.insert({
            text: newTask,
            createdAt: new Date
        });

        // clear form
        this.newTask = '';
    }

    removeTask(task) {
        Tasks.remove(task._id);
    }

    setChecked(task) {
        // Set the checked property to the opposite of the current value
        Tasks.update(task._id, {
            $set: {
                checked: !task.checked
            }
        });
    }
}

export default angular.module('todosList', [ angularMeteor ])
    .component('todosList', {
    templateUrl: 'imports/components/todosList/todosList.html',
    controller: [ '$scope', TodosListCtrl ]
    });
