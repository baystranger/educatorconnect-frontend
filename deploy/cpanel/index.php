<?php

/*
 * Laravel front controller for cPanel's public_html.
 *
 * public_html holds the React build (index.html, assets/) plus this file, and the
 * Laravel app in public_html/educator-connect-backend (locked by its own
 * .htaccess — see deploy/cpanel/backend.htaccess).
 */

use Illuminate\Foundation\Application;
use Illuminate\Http\Request;

define('LARAVEL_START', microtime(true));

$laravelRoot = __DIR__.'/educator-connect-backend';

if (file_exists($maintenance = $laravelRoot.'/storage/framework/maintenance.php')) {
    require $maintenance;
}

require $laravelRoot.'/vendor/autoload.php';

/** @var Application $app */
$app = require_once $laravelRoot.'/bootstrap/app.php';

// public_path() must be public_html (uploads are served from public_html/storage).
$app->usePublicPath(__DIR__);

$app->handleRequest(Request::capture());
