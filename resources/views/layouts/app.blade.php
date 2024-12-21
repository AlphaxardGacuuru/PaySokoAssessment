<!doctype html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">

<head>
	<meta charset="utf-8">
	<meta name="viewport"
		  content="width=device-width, initial-scale=1">
	{{-- Change address bar color Chrome, Firefox OS and Opera --}}
	<meta name="theme-color"
		  content="#FFF" />
	{{-- iOS Safari --}}
	<meta name="apple-mobile-web-app-status-bar-style"
		  content="#000000">
	<meta name="description"
		  content="The best Property Management App" />

	<!-- CSRF Token -->
	<meta name="csrf-token"
		  content="{{ csrf_token() }}">

	<title>{{ config('app.name', 'Marcus Miles') }}</title>

	<!-- Favicon  -->
	<link rel="icon"
		  href="https://home.paysoko.com/wp-content/uploads/2024/08/cropped-faviconpsoko-32x32.png">

	<!-- Fonts -->
	<link rel="dns-prefetch"
		  href="//fonts.gstatic.com">
	<link href="https://fonts.googleapis.com/css?family=Nunito"
		  rel="stylesheet">
	<link href="https://fonts.googleapis.com/css?family=Roboto:100,300,400,500,700"
		  rel="stylesheet">

	<!-- Manifest -->
	<link rel="manifest"
		  type="application/manifest+json"
		  href="manifest.webmanifest">

	<!-- Stylesheets -->

	<link href="{{ asset('css/app.css') }}"
		  rel="stylesheet">
	<link rel="stylesheet"
		  href="{{ asset('css/bootstrap.min.css') }}" />
	<link rel="stylesheet"
		  href="{{ asset('css/font-awesome.min.css') }}" />
	<link rel="stylesheet"
		  href="{{ asset('css/owl.carousel.css') }}" />
	<link rel="stylesheet"
		  href="{{ asset('css/style.css') }}" />

	<!-- Google Fonts -->
	<link href="https://fonts.googleapis.com/css?family=Raleway:400,400i,500,500i,600,600i,700,700i,800,800i"
		  rel="stylesheet">

	{{-- IOS support --}}
	<link rel="apple-touch-icon"
		  href="storage/img/musical-note.png">
	<meta name="apple-mobile-web-app-status-bar"
		  content="#aa7700">
</head>

<style>
	body {
		overflow-x: hidden;
	}
</style>

<body>
	<noscript>
		<center>
			<h2 class="m-5">
				We're sorry but {{ config('app.name') }}
				doesn't work properly without JavaScript enabled.
				Please enable it to continue.
			</h2>
		</center>
	</noscript>

	<div id="app"></div>

	<!-- Scripts -->
	<script src="{{ asset('js/app.js') }}"
			defer></script>

	{{-- Chart.js --}}
	<script src="https://cdn.jsdelivr.net/npm/chart.js"></script>

	<!--====== Javascripts & Jquery ======-->
	<script src="{{ asset('js/jquery-3.2.1.min.js') }}"></script>
	<script src="{{ asset('js/bootstrap.min.js') }}"></script>
	<script src="{{ asset('js/mixitup.min.js') }}"></script>
	<script src="{{ asset('js/circle-progress.min.js') }}"></script>
	<script src="{{ asset('js/owl.carousel.min.js') }}"></script>
	<script src="{{ asset('js/main.js') }}"></script>

</body>

</html>