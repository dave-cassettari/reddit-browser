'use strict';

var URL_BASE = 'http://www.reddit.com',
    app = angular.module('tabs', ['ngResource']);

app.factory('Reddit', ['$resource', function ($resource)
{
    return $resource(URL_BASE + '//.json',
        {

        },
        {
            query: {
                method: 'JSONP',
                params: {
                    jsonp: 'JSON_CALLBACK'
                }
            }
        });
}]);

app.directive('preventDefault', function ()
{
    return {
        restrict: 'A',
        link    : function ($scope, $element, attributes)
        {
            $element.on(attributes.preventDefault, function (event)
            {
                event.preventDefault();

                return false;
            });
        }
    };
});

app.directive('frame', function ()
{
    return {
        restrict: 'A',
        template: '<iframe class="window is-loading"></iframe>',
        link    : function ($scope, $element, attributes)
        {
            $element.children('iframe')
                .load(function ()
                {
                    $(this).removeClass('is-loading');
                })
                .attr('src', attributes.frame);
        }
    };
});

var ViewController = function ($scope, Reddit)
{
    angular.extend($scope,
        {
            items  : [],
            loaded : [],
            current: null,
            build  : function ()
            {
                var data = {};

                Reddit.query(data, function (response)
                {
                    var i;

                    $scope.items = response.data.children;

                    console.log($scope.items);

                    for (i = 0; i < $scope.items.length; i++)
                    {
                        $scope.items[i].data.permalink = URL_BASE + $scope.items[i].data.permalink;

                        switch ($scope.items[i].data.thumbnail)
                        {
                            case 'self':
                            case 'nsfw':
                            case 'default':
                                $scope.items[i].data.thumbnail = '/images/thumbnail.png';
                                break;
                        }
                    }
                });
            },
            select : function (url)
            {
                var i;

                $scope.selected = null;

                for (i = 0; i < this.loaded.length; i++)
                {
                    if (this.loaded[i].url == url)
                    {
                        $scope.selected = this.loaded[i];

                        break;
                    }
                }
            },
            remove : function (url)
            {
                var i, index = -1;

                for (i = 0; i < this.loaded.length; i++)
                {
                    if (this.loaded[i].url == url)
                    {
                        index = i;

                        break;
                    }
                }

                if (index > -1)
                {
                    this.loaded.splice(index, 1);
                }

                if (this.selected.url == url)
                {
                    if (this.loaded.length > 0)
                    {
                        var nextIndex = Math.max(index - 1, 0);

                        this.select(this.loaded[nextIndex].url);
                    }
                    else
                    {
                        this.select(null);
                    }
                }
            },
            load   : function (url, title)
            {
                var i;

                for (i = 0; i < this.loaded.length; i++)
                {
                    if (this.loaded[i].url == url)
                    {
                        this.select(url);

                        return;
                    }
                }

                this.loaded.push({
                    url  : url,
                    title: title
                });

                if (this.loaded.length == 1)
                {
                    this.select(url);
                }
            }
        });

    $scope.build();
};

app.controller('ViewController', ['$scope', 'Reddit', ViewController]);