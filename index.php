<!DOCTYPE html>
<!--[if lt IE 7]>
<html class='lt-ie9 lt-ie8 lt-ie7'> <![endif]-->
<!--[if IE 7]>
<html class='lt-ie9 lt-ie8'> <![endif]-->
<!--[if IE 8]>
<html class='lt-ie9'> <![endif]-->
<!--[if gt IE 8]><!-->
<html class=''> <!--<![endif]-->
<head>
	<title>Reddit Browser</title>

	<meta charset='UTF-8'>
	<meta http-equiv='X-UA-Compatible' content='IE=edge, chrome=1'>
	<meta name='viewport' content='width=device-width, height=device-height, initial-scale=1.0, minimum-scale=1.0, maximum-scale=1.0, user-scalable=0'>

	<link rel='stylesheet' type='text/css' href='//fonts.googleapis.com/css?family=Open+Sans:300,600'x>
	<link rel='stylesheet' type='text/css' href='/css/compiled/style.css'>

	<link rel='shortcut icon' href='/favicon.ico' type='image/x-icon'>
	<link rel='icon' href='/favicon.ico' type='image/x-icon'>

	<!--[if lt IE 9]>
	<script src='/js/vendor/html5shiv.js'></script>
	<![endif]-->

	<script src='/js/vendor/jquery.js'></script>
	<script src='/js/vendor/fancybox.js'></script>
	<script src='/js/vendor/imagesLoaded.js'></script>
	<script src='/js/vendor/markdown.js'></script>
	<script src='/js/vendor/masonry.js'></script>
	<script src='/js/vendor/history.js'></script>
	<script src='/js/vendor/URI.js'></script>
	<script src='/js/controller.js'></script>
</head>
<body>

<header>
	<h1>
		<a href='/'>Reddit Browser</a>
	</h1>

	<div class='menu subreddits'>
		<a href='/' data-r='' class='navigation is-selected'>Front Page</a>
	</div>

	<div class='menu'>
		<a href='/?sort=top'            data-sort='top'             class='navigation is-selected'>Top</a>
		<a href='/?sort=hot'            data-sort='hot'             class='navigation'>Hot</a>
		<a href='/?sort=new'            data-sort='new'             class='navigation'>New</a>
		<a href='/?sort=controversial'  data-sort='controversial'   class='navigation'>Controversial</a>
		<a href='/?sort=random'         data-sort='random'          class='navigation'>Random</a>
	</div>
</header>

<div class='articles'>

</div>

<img class='articles-loading' src='/images/loading.gif' alt='Loading' />

<a href='/' class='navigation articles-more' data-after=''>Load More</a>

</body>
</html>