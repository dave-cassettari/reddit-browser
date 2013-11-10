<!DOCTYPE html>
<!--[if lt IE 7]>
<html data-ng-app='tabs' class='lt-ie9 lt-ie8 lt-ie7'> <![endif]-->
<!--[if IE 7]>
<html data-ng-app='tabs' class='lt-ie9 lt-ie8'> <![endif]-->
<!--[if IE 8]>
<html data-ng-app='tabs' class='lt-ie9'> <![endif]-->
<!--[if gt IE 8]><!-->
<html data-ng-app='tabs' class=''> <!--<![endif]-->
<head>
	<title>Reddit Browser</title>

	<meta charset='UTF-8'>
	<meta http-equiv='X-UA-Compatible' content='IE=edge, chrome=1'>
	<meta name='viewport'
	      content='width=device-width, height=device-height, initial-scale=1.0, minimum-scale=1.0, maximum-scale=1.0, user-scalable=0'>

	<link rel='stylesheet' type='text/css' href='//fonts.googleapis.com/css?family=Open+Sans:300,600'>
	<link rel='stylesheet' type='text/css' href='/css/compiled/tabs.css'>

	<!--[if lt IE 9]>
	<script src='/js/vendor/html5shiv.js'></script>
	<![endif]-->

	<script src='/js/vendor/jquery.js'></script>
	<script src='/js/vendor/angular.min.js'></script>
	<script src='/js/vendor/angular-resource.min.js'></script>
	<script src='/js/tabs.js'></script>
</head>
<body data-ng-controller='ViewController'>

<div class='sidebar'>
	<div class='navigation'>
		<!-- subreddit menu -->
	</div>

	<div class='items'>
		<div class='item' data-ng-repeat='item in items'>
			<img src='{{ item.data.thumbnail }}' class='item-image'/>

			<a href='{{ item.data.url }}' class='item-score'
			   data-ng-show='item.data.url != item.data.permalink'
			   data-ng-click='load(item.data.url, item.data.title)'
			   data-prevent-default='click'>{{ item.data.score }}</a>

			<a href='{{ item.data.permalink }}' class='item-comments'
			   data-ng-click='load(item.data.permalink, item.data.title)'
			   data-prevent-default='click'>{{ item.data.num_comments }}</a>

			<span class='item-title' data-ng-class='{ "is-wide" : !item.data.thumbnail }'>{{ item.data.title }}</span>
		</div>
	</div>
</div>

<ul class='tabs'>
	<li class='tab' data-ng-repeat='item in loaded'
	    data-ng-class='{ "is-selected" : item.url == selected.url }'>

		<a href='{{ item.url }}' class='tab-remove'
		   data-ng-click='remove(item.url)'
		   data-prevent-default='click'>x</a>

		<a href='{{ item.url }}' title='{{selected.url}}'
		   data-ng-click='select(item.url)'
		   data-prevent-default='click'>{{ item.title }}</a>
	</li>
</ul>

<div class='windows'>
	<div class='window-wrapper'
	     data-ng-repeat='item in loaded'
	     data-ng-show='item.url == selected.url'
	     data-frame='{{ item.url }}'></div>
</div>

</body>
</html>