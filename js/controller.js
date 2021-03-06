$.fn.isBound = function (type, fn)
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

    return (fn && $.inArray(fn, data) !== -1);
};

$(document).ready(function (e)
{
    var CLASS_LOADING = 'is-loading',
        CLASS_SELECTED = 'is-selected',
        URL_BASE = 'http://www.reddit.com',
        BODY_HEIGHT_MAX = 250,
        $window = $(window),
        $more = $('.articles-more'),
        $loading = $('.articles-loading'),
        $container = $('.articles'),
        $subreddits = $('.subreddits'),
        $frameContainer = $('.window-wrapper'),
        $frameNext = $frameContainer.children('.window-next'),
        $framePrev = $frameContainer.children('.window-prev'),
        $frameHide = $frameContainer.children('.window-hide'),
        $frame = null,
        $selected = null,
        masonry = new Masonry($container[0],
            {
                gutter            : 0,
                columnWidth       : 320,
                itemSelector      : 'article',
                transitionDuration: 0
            });

    $frameContainer.click(function ()
    {
        $frameContainer.fadeOut();
    });

    $frameNext.click(function (event)
    {
        var $next;

        event.preventDefault();
        event.stopPropagation();

        if ($selected)
        {
            $next = $selected.next();

            if ($next.length > 0)
            {
                $next.children('.article-link').click();
            }
        }

        return false;
    });

    $framePrev.click(function (event)
    {
        var $prev;

        event.preventDefault();
        event.stopPropagation();

        if ($selected)
        {
            $prev = $selected.prev();

            if ($prev.length > 0)
            {
                $prev.children('.article-link').click();
            }
        }

        return false;
    });

    $frameHide.click(function (event)
    {
        event.preventDefault();

        $frameContainer.fadeOut();

        return false;
    });

    var insert = function (listing)
    {
        var src,
            data = listing.data,
            uri = new URI(data.url),
            $article = $('<article />')
                .appendTo($container),
            $link = $('<a />')
                .addClass('article-link')
                .attr('href', data.url)
                .attr('target', '_blank')
                .appendTo($article),
            $title = $('<span />')
                .addClass('article-title')
                .text(data.title)
                .appendTo($link);

        if (data.thumbnail)
        {
            src = data.thumbnail;

            if (src == 'default' || src == 'self' || src == 'nsfw')
            {
                src = '/images/thumbnail.png';
            }

            $link.prepend($('<img />')
                .addClass('article-image')
                .attr('src', src));
        }

        if (data.selftext)
        {
            var $body = $('<p />')
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

        $link.click(function (evvent)
        {
            var src,
                href = $link.attr('href');

            event.preventDefault();

            if (!$frame)
            {
                $frame = $('<iframe />')
                    .addClass('window-contents')
                    .appendTo($frameContainer.children('.window'))
                    .click(function (event)
                    {
                        event.stopPropagation();
                    })
                    .load(function ()
                    {
                        $frame.removeClass(CLASS_LOADING);
                    });
            }

            src = $frame.attr('src');

            if (src != href)
            {
                $frame
                    .addClass(CLASS_LOADING)
                    .attr('src', href);
            }

            if (!$frameContainer.is(':visible'))
            {
                $frameContainer.fadeIn();
            }

            $selected = $article;

            return false;
        });

        return $article;
    };

    var init = function ()
    {
        if ($subreddits.children().length > 1)
        {
            return;
        }

        $.ajax(
            {
                url     : URL_BASE + '/subreddits/popular.json',
                jsonp   : 'jsonp',
                dataType: 'jsonp',
                success : function (response)
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

                    update();
                }
            });
    };

    var load = function (sub, sort, after)
    {
        var url = URL_BASE,
            data =
            {
                after: after
            };

        if (sub)
        {
            url = url + '/r/' + sub;
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
                url     : url,
                data    : data,
                jsonp   : 'jsonp',
                dataType: 'jsonp',
                success : function (response)
                {
                    var i,
                        $inserted,
                        listing = response.data,
                        articles = listing.children;

                    $more.show();
                    $more.data('after', listing.after);
                    $loading.removeClass(CLASS_LOADING);

                    if (articles.length == 0)
                    {
                        // warn
                    }
                    else
                    {
                        for (i = 0; i < articles.length; i++)
                        {
                            $inserted = insert(articles[i]);

                            masonry.appended($inserted)
                        }
                    }

                    update();
                }
            });
    };

    var update = function ()
    {
        var $links = $('a.navigation'),
            current = new URI();

        current.removeQuery('after');

        $links.each(function ()
        {
            var name,
                value,
                uri = new URI(),
                $this = $(this),
                href = $this.attr('href'),
                data = $this.data();

            uri.removeQuery('after');

            for (name in data)
            {
                value = data[name];

                if (value)
                {
                    uri.setQuery(name, value);
                }
                else
                {
                    uri.removeQuery(name);
                }
            }

            $this.attr('href', uri.normalize());
            $this.toggleClass(CLASS_SELECTED, uri.equals(current));

            if (!$this.isBound('click'))
            {
                $this.click(function (event)
                {
                    event.preventDefault();

                    var search = new URI($this.attr('href')).search() || '/';

                    History.pushState(null, window.document.title, search);

                    return false;
                });
            }
        });
    };

    var reset = function (uri)
    {
        uri = uri || window.location.href;
        uri = new URI(uri);

        var query = uri.query(true),
            sub = query.r,
            sort = query.sort,
            after = query.after,
            isList = (query.hasOwnProperty('list')) ? query['list'] : false;

        $container.toggleClass('is-list', isList);

        if (!after)
        {
            $container.empty();
        }

        $more.data('after', after);

        masonry.layout();

        init();
        load(sub, sort, after);
    };

    History.Adapter.bind(window, 'statechange', function ()
    {
        var state = History.getState();

        reset(state.url);
    });

    reset();

    $window.scroll(function ()
    {
        if ($window.scrollTop() + $window.height() >= $(document).height())
        {
            $more.click();
        }
    });
});