<?php
declare(strict_types=1);
require __DIR__ . '/../hosting/hostinger/api/enquiry.php';

function check(bool $condition, string $message): void {
    if (!$condition) throw new RuntimeException($message);
}
$details = ['name'=>'TEST — no callback required','phone'=>'+91 9999999999','course'=>'Master in Blender','qualification'=>'Class 12','message'=>'Course guidance','consent'=>true,'reference'=>'ARL-12345678-1234-1234-1234-123456789abc','website'=>''];
$calls = 0; $sent = [];
$send = static function ($url, $body) use (&$calls, &$sent) {
    $calls++; parse_str($body, $sent);
    check(strpos($url, 'https://docs.google.com/forms/') === 0, 'Unexpected form host');
    return [200, '<div>Your response has been recorded.</div>'];
};
$request = static function ($data, $transport = null, $method = 'POST', $origin = 'https://arenalucknow.in', $type = 'application/json') use ($send) {
    return arena_handle_enquiry($method, $origin, 'https://arenalucknow.in', $type, json_encode($data), $transport ?? $send);
};
[$status, $body] = $request($details);
check($status === 200 && $body === ['ok'=>true,'reference'=>$details['reference']], 'Valid response failed');
$expected = ['entry_759494523'=>$details['name'],'entry_345540192'=>"'".$details['phone'],'entry_604844296'=>$details['course'],'entry_133143954'=>$details['qualification'],'entry_1358187973'=>$details['message'],'entry_1176379031'=>$details['reference'],'entry_708883138'=>'Website — Arena Animation, Indira Nagar, Lucknow','entry_800698877'=>'I agree to share these details with Arena Animation, Indira Nagar for admission guidance.'];
foreach ($expected as $key=>$value) check(($sent[$key] ?? null) === $value, 'Missing/wrong field: '.$key);
echo "PASS PHP saves all enquiry fields and confirms the reference\n";

foreach ([static fn()=>[200,'Please answer this question'], static fn()=>[403,'Form closed'], static function(){throw new RuntimeException('timeout');}] as $badSend) {
    [$status, $body] = $request($details, $badSend);
    check($status === 502 && !isset($body['ok']), 'Unconfirmed save reported as success');
}
echo "PASS PHP refuses unconfirmed Google responses and handles failures\n";

$before = $calls;
foreach ([array_replace($details,['name'=>' ']),array_replace($details,['phone'=>'----------']),array_replace($details,['consent'=>false]),array_replace($details,['message'=>str_repeat('x',601)]),array_replace($details,['reference'=>'bad']),array_replace($details,['website'=>'bot']),null,[]] as $invalid) {
    check($request($invalid)[0] === 400, 'Invalid data accepted');
}
check($request($details,null,'GET')[0] === 405, 'GET accepted');
check($request($details,null,'POST','https://other.example')[0] === 403, 'Cross-site request accepted');
check($request($details,null,'POST','https://arenalucknow.in','text/plain')[0] === 415, 'Wrong content type accepted');
check(arena_handle_enquiry('POST',null,'https://arenalucknow.in','application/json',str_repeat('x',8001),$send)[0] === 413, 'Oversized request accepted');
check(arena_handle_enquiry('POST',null,'https://arenalucknow.in','application/json','{',$send)[0] === 400, 'Malformed JSON accepted');
check($calls === $before, 'Invalid data reached Google');
echo "PASS PHP validates data, consent, request size, origin and honeypot before sending\n";

$request(array_replace($details,['message'=>'=IMPORTXML("https://example.test","//a")']));
check(strpos($sent['entry_1358187973'], "'=") === 0, 'Formula-like text was not literal');
check($request(array_replace($details,['name'=>'0']))[0] === 200, 'Literal name rejected');
echo "PASS PHP preserves formula-like text as literal Sheet values\n";

$scholarship = array_replace($details,['email'=>'test@example.com','reference'=>'ARLS-12345678-1234-1234-1234-123456789abc','centre'=>'Wrong branch']);
$scholarshipSend = static function ($url, $body) use (&$sent) {
    check(strpos($url, '1FAIpQLSczh-XjXjRqJjPF6orHtp4kQr6Agy4uQ2p5JiISDAL4MLtwnw') !== false, 'Scholarship used the general form');
    parse_str($body,$sent);
    return [200,'Your response has been recorded.'];
};
$scholarshipRequest = static fn($data,$transport=null) => arena_handle_enquiry('POST','https://arenalucknow.in','https://arenalucknow.in','application/json',json_encode($data),$transport ?? $scholarshipSend,true);
[$status,$body] = $scholarshipRequest($scholarship);
check($status === 200 && $body['reference'] === $scholarship['reference'], 'Scholarship success failed');
check($sent['entry_788695738'] === $scholarship['email'], 'Scholarship email missing');
check($sent['entry_1625509079'] === 'Uttar Pradesh' && $sent['entry_660532691'] === 'Indira Nagar, Lucknow', 'Branch context was spoofed');
check(strpos($sent['entry_800698877'],'scholarship and admission guidance') !== false, 'Scholarship consent missing');
foreach (['','wrong',"a@b.com\nother@b.com"] as $email) check($scholarshipRequest(array_replace($scholarship,['email'=>$email]))[0] === 400, 'Invalid email accepted');
check($scholarshipRequest(array_replace($scholarship,['reference'=>$details['reference']]))[0] === 400, 'Wrong reference prefix accepted');
check($scholarshipRequest($scholarship,static fn()=>[200,'Please answer this question'])[0] === 502, 'Unconfirmed scholarship save accepted');
echo "PASS PHP scholarship routing, fields, branch context, validation and recorded-response confirmation\n";
