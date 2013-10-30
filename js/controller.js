$.fn.isBound = function(type, fn)
{
    var data,
        events = this.data('events');

    if (!events)
    {
        return false;
    }

    data = events[type];

    if (data === undefined || data.length === 0)
    {
        return false;
    }

    return ($.inArray(fn, data) !== -1);
};

$(document).ready(function(e)
{
    var CLASS_LOADING = 'is-loading',
        CLASS_SELECTED = 'is-selected',
        URL_BASE = 'http://www.reddit.com',
        THUMBNAIL_SELF = 'self',
        BODY_HEIGHT_MAX = 250,
        last = null,
        $window = $(window),
        $more = $('.articles-more'),
        $loading = $('.articles-loading'),
        $container = $('.articles'),
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

    var update = function(subreddit, sort, last)
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

                $more.show();
                $more.data('last', listing.after);
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
                    });
                }
            }
        });
    };

    var load = function(subreddit, sort)
    {
        if ($subreddits.children().length > 1)
        {
            return;
        }

        $.ajax(
            {
                url : URL_BASE + '/subreddits/popular.json',
                jsonp: 'jsonp',
                dataType : 'jsonp',
                success : function(response)
                {
                    var i,
                        uri,
                        sub,
                        link,
                        $link,
                        data = response.data;

                    for (i = 0; i < data.children.length; i++)
                    {
                        uri = new URI('/');
                        link = data.children[i].data,
                        sub = link.display_name.toLowerCase();

                        $link = $('<a />')
                            .text(link.display_name)
                            .data('r', sub)
                            .attr('href', '/')
                            .attr('title', link.title)
                            .addClass('navigation');

                        $subreddits.append($link);
                    }

                    init(subreddit, sort);
                }
            });
    };

    var init = function(subreddit, sort)
    {
        var $links = $('a.navigation');

        $links.each(function()
        {
            var name,
                uri = new URI(),
                $this = $(this),
                href = $this.attr('href'),
                data = $this.data();

            for (name in data)
            {
                uri.setQuery(name, data[name]);
            }

            $this.attr('href', uri.normalize());

            if (!$this.isBound('click'))
            {
                $this.click(function(event)
                {
                    event.preventDefault();

                    var search = new URI($this.attr('href')).search();

                    History.pushState(null, window.document.title, search);

                    return false;
                });
            }
        });
    };

    var reset = function(uri)
    {
        uri = uri || window.location.href;
        uri = new URI(uri);

        var query   = uri.query(true),
            sub     = query.r,
            sort    = query.sort,
            last    = query.last;

        $container.empty();
        $more.data('last', null);

        last = null;
        masonry.layout();

        init(sub, sort);
        load(sub, sort);
        update(sub, sort, last);
    };

    History.Adapter.bind(window, 'statechange', function()
    {
        var state = History.getState();

        reset(state.url);
    });

    reset();

    $window.scroll(function()
    {
        if ($window.scrollTop() + $window.height() >= $(document).height())
        {
           // $more.click();
        }
    });
});