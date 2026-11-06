<?php
declare(strict_types=1);
define('ARENA_ENQUIRY_LIBRARY', true);
require __DIR__ . '/enquiry.php';
if (PHP_SAPI !== 'cli') arena_respond(true);
