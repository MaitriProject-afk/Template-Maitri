<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">

        @php
            $site = \App\Models\SiteSetting::getSettings();
        @endphp
        <title inertia>{{ $site['site_name'] ?? config('app.name', 'Laravel') }}</title>

        <style>
            :root {
                --color-brand: {{ $site['color_primary'] ?? '#2563eb' }};
                --color-brand-hover: {{ $site['color_primary_hover'] ?? '#1d4ed8' }};
                --color-brand-accent: {{ $site['color_accent'] ?? '#38bdf8' }};
                --color-brand-subtle: {{ $site['color_subtle'] ?? '#e0f2fe' }};
                --color-brand-navy: {{ $site['color_navy'] ?? '#1e40af' }};
            }
        </style>

        <!-- Fonts -->
        <link rel="preconnect" href="https://fonts.googleapis.com">
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
        <link href="https://fonts.googleapis.com/css2?family=Architects+Daughter&family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Space+Mono:ital,wght@0,400;0,700;1,400&display=swap" rel="stylesheet">

        <!-- Scripts -->
        @routes
        @viteReactRefresh
        @vite(['resources/js/app.jsx', "resources/js/Pages/{$page['component']}.jsx"])
        @inertiaHead
    </head>
    <body class="font-sans antialiased">
        @inertia
    </body>
</html>
