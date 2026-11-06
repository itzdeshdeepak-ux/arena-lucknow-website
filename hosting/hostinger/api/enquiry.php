<?php
declare(strict_types=1);

// Hostinger PHP equivalent of worker/index.js. No Google credentials required.
function arena_google_submit(string $url, string $body): array
{
    if (!function_exists('curl_init')) {
        throw new RuntimeException('PHP cURL is required.');
    }
    $curl = curl_init($url);
    curl_setopt_array($curl, [
        CURLOPT_POST => true,
        CURLOPT_POSTFIELDS => $body,
        CURLOPT_HTTPHEADER => ['Content-Type: application/x-www-form-urlencoded'],
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_FOLLOWLOCATION => true,
        CURLOPT_MAXREDIRS => 3,
        CURLOPT_PROTOCOLS => CURLPROTO_HTTPS,
        CURLOPT_REDIR_PROTOCOLS => CURLPROTO_HTTPS,
        CURLOPT_CONNECTTIMEOUT => 5,
        CURLOPT_TIMEOUT => 15,
        CURLOPT_SSL_VERIFYPEER => true,
        CURLOPT_SSL_VERIFYHOST => 2,
    ]);
    $html = curl_exec($curl);
    $status = (int) curl_getinfo($curl, CURLINFO_HTTP_CODE);
    curl_close($curl);
    return [$status, is_string($html) ? $html : ''];
}

function arena_handle_enquiry(string $method, ?string $origin, string $requestOrigin, string $contentType, string $raw, ?callable $send = null, bool $scholarship = false): array
{
    if ($method !== 'POST') return [405, ['error' => 'Please submit the enquiry form.']];
    if ($origin !== null && $origin !== $requestOrigin) return [403, ['error' => 'Please submit from our website.']];
    if (stripos($contentType, 'application/json') === false) return [415, ['error' => 'Invalid enquiry format.']];
    if (strlen($raw) > 8000) return [413, ['error' => 'Please shorten your enquiry.']];
    try {
        $data = json_decode($raw, false, 32, JSON_THROW_ON_ERROR);
        if (!is_object($data)) return [400, ['error' => 'Invalid enquiry details.']];
        $text = static function (string $key, int $max) use ($data): ?string {
            if (!isset($data->$key) || !is_string($data->$key)) return null;
            $value = trim($data->$key);
            return preg_match_all('/./us', $value) <= $max ? $value : null;
        };
        $name = $text('name', 80); $phone = $text('phone', 18);
        $course = $text('course', 180); $qualification = $text('qualification', 40);
        $message = $text('message', 600); $reference = $text('reference', 50);
        $email = $scholarship ? $text('email', 120) : null;
        $referencePattern = $scholarship ? '/^ARLS-[a-f0-9-]{36}$/D' : '/^ARL-[a-f0-9-]{36}$/D';
        if ($scholarship && ($email === null || !preg_match('/^[^\s@]+@[^\s@]+\.[^\s@]+$/D', $email))) return [400, ['error' => 'Please enter a valid email address.']];
        if ($name === null || $name === '' || $phone === null || !preg_match('/^([+]91|91)?[ ]?[6-9][0-9]{9}$/D', $phone)
            || $course === null || $course === '' || $qualification === null || $message === null
            || ($data->consent ?? null) !== true || $reference === null || !preg_match($referencePattern, $reference)) {
            return [400, ['error' => 'Please check your name, mobile number and contact consent.']];
        }
        if (!empty($data->website)) return [400, ['error' => 'We couldn’t accept this enquiry. Please contact us on WhatsApp.']];
        $literal = static fn(string $value): string => preg_match('/^[=+@-]/', $value) ? "'" . $value : $value;
        $fields = [
            'entry.759494523' => $literal($name),
            'entry.345540192' => $literal($phone),
            'entry.604844296' => $literal($course),
            'entry.133143954' => $literal($qualification),
            'entry.1358187973' => $literal($message),
            'entry.800698877' => $scholarship ? 'I agree to share these details with Arena Animation, Indira Nagar for scholarship and admission guidance.' : 'I agree to share these details with Arena Animation, Indira Nagar for admission guidance.',
            'entry.708883138' => $scholarship ? 'Website — Scholarship enquiry — Arena Animation, Indira Nagar, Lucknow' : 'Website — Arena Animation, Indira Nagar, Lucknow',
            'entry.1176379031' => $reference,
            'entry.800698877_sentinel' => '', 'fvv' => '1', 'pageHistory' => '0',
        ];
        if ($scholarship) {
            $fields['entry.788695738'] = $literal($email);
            $fields['entry.1625509079'] = 'Uttar Pradesh';
            $fields['entry.660532691'] = 'Indira Nagar, Lucknow';
        }
        $action = $scholarship
            ? 'https://docs.google.com/forms/u/0/d/e/1FAIpQLSczh-XjXjRqJjPF6orHtp4kQr6Agy4uQ2p5JiISDAL4MLtwnw/formResponse?hl=en'
            : 'https://docs.google.com/forms/u/0/d/e/1FAIpQLSf0xv8GcVXMEuAPvVRFFU0o3xfLM-qOvjbLVKRGffpIsNL9ow/formResponse?hl=en';
        [$status, $html] = ($send ?? 'arena_google_submit')($action, http_build_query($fields, '', '&', PHP_QUERY_RFC3986));
        // Google also returns 200 for validation errors; never infer a saved lead from status alone.
        if ($status < 200 || $status >= 300 || strpos($html, 'Your response has been recorded.') === false) {
            throw new RuntimeException('Google did not confirm the saved response.');
        }
        return [200, ['ok' => true, 'reference' => $reference]];
    } catch (JsonException $error) {
        return [400, ['error' => 'Invalid enquiry details.']];
    } catch (Throwable $error) {
        return [502, ['error' => 'We couldn’t confirm your enquiry was saved. Please contact our team on WhatsApp, or try again later.']];
    }
}

// CLI can load the same handler for tests without sending a real enquiry.
function arena_respond(bool $scholarship = false): void {
    header('Content-Type: application/json; charset=utf-8');
    header('Cache-Control: no-store');
    header('X-Robots-Tag: noindex, nofollow');
    $scheme = !empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off' ? 'https' : 'http';
    $requestOrigin = $scheme . '://' . ($_SERVER['HTTP_HOST'] ?? 'arenalucknow.in');
    $raw = file_get_contents('php://input', false, null, 0, 8001);
    [$status, $body] = arena_handle_enquiry($_SERVER['REQUEST_METHOD'] ?? 'GET', $_SERVER['HTTP_ORIGIN'] ?? null,
        $requestOrigin, $_SERVER['CONTENT_TYPE'] ?? '', $raw === false ? '' : $raw, null, $scholarship);
    if ($status === 405) header('Allow: POST');
    http_response_code($status);
    echo json_encode($body, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
}
if (PHP_SAPI !== 'cli' && !defined('ARENA_ENQUIRY_LIBRARY')) arena_respond();
