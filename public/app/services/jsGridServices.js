angular.module('jsGridServices', ['dateTimeServices'])
    .factory('Grid', function ($http, DateTime) {
        var gridFactory = {};
        gridFactory.fillGrid = function (usercosts, user, costtypes) {
            var costs = [];
            for (var i = 0; i < usercosts.length; i++) {
                var cost = {
                    _id: usercosts[i]._id,
                    costname: usercosts[i].costname,
                    username: usercosts[i].username,
                    costprice: usercosts[i].costprice,
                    paydate: DateTime.getDateTimeFromDate(usercosts[i].paydate),
                    costtype: usercosts[i].costtype,
                    costdescription: usercosts[i].costdescription
                };
                costs.push(cost);
            }

            function CostTypesJsGrid() {
                var selectCostTypes = [];
                for (var i = 0; i < costtypes.length; i++) {
                    var optionCost = { Name: costtypes[i], Id: i }
                    selectCostTypes.push(optionCost);
                }
                return selectCostTypes;
            }

            $("#jsGrid").jsGrid({
                width: "100%",
                height: "400px",
                inserting: true,
                editing: true,
                sorting: true,
                autoload: false,
                pageLoading: false,
                paging: true,
                pageSize: 10,
                pageButtonCount: 5,
                pageIndex: 1,
                data: costs,
                controller: {
                    loadData: function (filter) {
                        var d = $.Deferred();
                        $http.get('/api/costs/' + user).then(function (response) {
                            //var data = { data: response.data, itemsCount: response.data.length };
                            d.resolve(response.data);
                            return d.promise(response.data);
                        });
                    },
                    insertItem: function (item) {
                        item.username = user;
                        $http.post('/api/costs', item).then(function (data) {
                            if (!data.data.success) {
                                alert(data.data.message);
                            }
                        });
                    },
                    updateItem: function (item) {
                        $http.put('/api/costs/' + item._id, item).then(function (data) {
                            if (data.data.errors) {
                                alert(data.data.message);
                            }
                        });
                    },
                    deleteItem: function (item) {
                        $http.delete('/api/costs/' + item._id).then(function (data) {
                        });
                    }
                },
                fields: [
                    { type: "control" },
                    { name: "costname", type: "text", width: 100, validate: "required" },
                    {
                        name: "costprice", type: "number", width: 50,
                        itemTemplate: function (value) {
                            return value.toFixed(2);
                        }
                    },
                    { name: "paydate", type: "date", width: 100 },
                    { name: "costtype", type: "select", items: CostTypesJsGrid(), valueField: "Name", textField: "Name" },
                    { name: "costdescription", type: "text" }
                ]
            });

        };
        return gridFactory;

    });