$(document).ready(function(e)
{
    var CLASS_LOADING = 'is-loading',
        CLASS_SELECTED = 'is-selected',
        URL_BASE = 'http://www.reddit.com',
        THUMBNAIL_SELF = 'self',
        BODY_HEIGHT_MAX = 250,
        subreddit = null,
        sort = null,
        last = null,
        $window = $(window),
        $more = $('.articles-more'),
        $loading = $('.articles-loading'),
        $container = $('.articles'),
        $sorts = $('.sorts'),
        $subreddits = $('.subreddits'),
        masonry = new Masonry($container[0],
            {
                gutter : 0,
                columnWidth : 320,
                itemSelector : 'article',
                transitionDuration : 0
            });

    var insert = function(listing)
    {
        var src,
            data = listing.data,
            uri = new URI(data.url),
            $article = $('<article />')
                .appendTo($container),
            $link = $('<a />')
                .addClass('article-link')
                .attr('href', data.url)
                .appendTo($article),
            $title = $('<span />')
                .addClass('article-title')
                .text(data.title)
                .appendTo($link);

        if (data.thumbnail)
        {
            src = data.thumbnail;

            if (src == THUMBNAIL_SELF)
            {
                src = '/images/thumbnail.png';
            }

            $link.prepend($('<img />')
                .addClass('article-image')
                .attr('src', src));
        }

//        switch (uri.domain())
//        {
//            case 'imgur.com':
//                $link.prepend($('<img />')
//                    .addClass('article-image')
//                    .attr('src', uri));
//                break;
//        }

        if (data.selftext)
        {
           var $body =  $('<p />')
               .addClass('article-body')
               .html(markdown.toHTML(data.selftext))
               .appendTo($article);

            if ($body.height() > BODY_HEIGHT_MAX)
            {
                $body.addClass('article-body-long');
            }
        }

        $('<span />')
            .addClass('article-score')
            .text(data.score)
            .appendTo($article);

        $('<a />')
            .addClass('article-comments')
            .attr('href', URL_BASE + data.permalink)
            .attr('target', '_blank')
            .text(data.num_comments)
            .appendTo($article);

        return $article;
    };

    var update = function()
    {
        var url = URL_BASE,
            data =
            {
                last : last
            };

        if (subreddit)
        {
            url = url + '/r/' + subreddit;
        }

        if (sort)
        {
            url = url + '/' + sort;
        }

        url = url + '/.json';

        $more.hide();
        $loading.addClass(CLASS_LOADING);

        $subreddits.children('a').each(function()
        {
            var $this = $(this),
                uri = new URI();

            uri.setQuery('r', $this.data('subreddit'));

            $this.attr('href', uri);
        });

        $sorts.children('a').each(function()
        {
            var $this = $(this),
                uri = new URI();

            uri.setQuery('sort', $this.data('sort'));

//            console.log(uri);

            $this.attr('href', uri);
        });

        $.ajax(
        {
            url : url,
            data : data,
            jsonp: 'jsonp',
            dataType : 'jsonp',
            success : function(response)
            {
                var i,
                    listing = response.data,
                    articles = listing.children,
                    $inserted = [];

                last = listing.after;

                $more.show();
                $loading.removeClass(CLASS_LOADING);

                if (articles.length == 0)
                {
                    // warn
                }
                else
                {
                    for (i = 0; i < articles.length; i++)
                    {
                        $inserted.push(insert(articles[i]));
                    }

                    imagesLoaded($container, function()
                    {
                        for (i = 0; i < $inserted.length; i++)
                        {
                            masonry.appended($inserted[i]);
                        }
                        //masonry.addItems($inserted);
                    });
                }
            }
        });
    };

    var reset = function()
    {
        $container.empty();

        last = null;
        masonry.layout();

        update();
    };

    $more.click(function(event)
    {
        event.preventDefault();

        update();

        return false;
    });

//    $('.sorts a').click(function(event)
//    {
//        event.preventDefault();
//
//        var $this = $(this);
//
//        $this.addClass(CLASS_SELECTED).siblings().removeClass(CLASS_SELECTED);
//
//        sort = $this.data('sort');
//
//        reset();
//
//        return false;
//    });

    var loadSubs = function()
    {
        $.ajax(
            {
                url : URL_BASE + '/subreddits/popular.json',
                jsonp: 'jsonp',
                dataType : 'jsonp',
                success : function(response)
                {
                    var i,
                        uri,
                        link,
                        $link,
                        data = response.data;

                    for (i = 0; i < data.children.length; i++)
                    {
                        uri = new URI();
                        link = data.children[i].data;

                        uri.setSearch('r', link.display_name.toLowerCase());

                        $link = $('<a />')
                            .text(link.display_name)
                            .attr('href', uri)
                            .attr('title', link.title)
                            .data('subreddit', link.display_name.toLowerCase())
                            .addClass('navigation');

                        $subreddits.append($link);
                    }

                    init();

                    //            $subreddits.children('a').click(function(event)
                    //            {
                    //                event.preventDefault();
                    //
                    //                subreddit = $(this).data('subreddit');
                    //
                    //                reset();
                    //
                    //                return false;
                    //            });
                }
            });
    };

    var init = function()
    {
        var $links = $('a.navigation');

        $links.each(function()
        {
            var $this = $(this);

            if ($this.data('init'))
            {
                return;
            }

            $this.click(function(event)
            {
                event.preventDefault();

                var query = new URI($this.attr('href')).query();

                console.log(query);

                History.pushState(null, null, '?' + query);

                return false;
            });

            $this.data('init', true);
        });
    };

    init();
    loadSubs();

    var History = window.History;

    History.Adapter.bind(window, 'statechange', function()
    {
        var state = History.getState();

        console.log(state);
    });

    reset();

    $window.scroll(function()
    {
        if ($window.scrollTop() + $window.height() >= $(document).height())
        {
            update();
        }
    });
});