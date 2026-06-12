<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');

$db_file = __DIR__ . '/data/db.json';

if (!file_exists($db_file)) {
    echo json_encode(['error' => 'Database file not found']);
    exit;
}

$db_content = file_get_contents($db_file);

if (isset($_GET['action']) && $_GET['action'] === 'get_chatbot_data') {
    $db_data = json_decode($db_content, true);
    if (isset($db_data['chatbot_data'])) {
        echo json_encode($db_data['chatbot_data']);
    } else {
        echo json_encode([]);
    }
    exit;
}

if (isset($_GET['action']) && $_GET['action'] === 'log_chat_message') {
    $session_id = isset($_POST['session_id']) ? trim($_POST['session_id']) : '';
    $user_name = isset($_POST['user_name']) ? trim($_POST['user_name']) : '';
    $sender = isset($_POST['sender']) ? trim($_POST['sender']) : '';
    $text = isset($_POST['text']) ? trim($_POST['text']) : '';
    
    if (empty($session_id) || empty($sender) || empty($text)) {
        http_response_code(400);
        echo json_encode(['success' => false, 'message' => 'Missing required fields']);
        exit;
    }
    
    $db_data = json_decode($db_content, true);
    if (!isset($db_data['chat_logs']) || !is_array($db_data['chat_logs'])) {
        $db_data['chat_logs'] = [];
    }
    
    // Find if session already exists
    $found_index = -1;
    foreach ($db_data['chat_logs'] as $idx => $log) {
        if ($log['session_id'] === $session_id) {
            $found_index = $idx;
            break;
        }
    }
    
    $msg = [
        'sender' => $sender,
        'text' => $text,
        'timestamp' => date('Y-m-d H:i:s'),
        'rating' => 0 // 0 = no rating, 1 = thumbs up, -1 = thumbs down
    ];
    
    if ($found_index !== -1) {
        if (!empty($user_name)) {
            $db_data['chat_logs'][$found_index]['user_name'] = $user_name;
        }
        $db_data['chat_logs'][$found_index]['last_active'] = date('Y-m-d H:i:s');
        $db_data['chat_logs'][$found_index]['messages'][] = $msg;
        $db_data['chat_logs'][$found_index]['message_count'] = count($db_data['chat_logs'][$found_index]['messages']);
    } else {
        $db_data['chat_logs'][] = [
            'session_id' => $session_id,
            'user_name' => !empty($user_name) ? $user_name : 'Anonymous',
            'last_active' => date('Y-m-d H:i:s'),
            'messages' => [$msg],
            'message_count' => 1
        ];
    }
    
    file_put_contents($db_file, json_encode($db_data, JSON_PRETTY_PRINT));
    echo json_encode(['success' => true]);
    exit;
}

if (isset($_GET['action']) && $_GET['action'] === 'log_chat_rating') {
    $session_id = isset($_POST['session_id']) ? trim($_POST['session_id']) : '';
    $message_index = isset($_POST['message_index']) ? intval($_POST['message_index']) : -1;
    $rating = isset($_POST['rating']) ? intval($_POST['rating']) : 0;
    
    if (empty($session_id) || $message_index < 0) {
        http_response_code(400);
        echo json_encode(['success' => false, 'message' => 'Missing required fields']);
        exit;
    }
    
    $db_data = json_decode($db_content, true);
    if (isset($db_data['chat_logs']) && is_array($db_data['chat_logs'])) {
        foreach ($db_data['chat_logs'] as $idx => $log) {
            if ($log['session_id'] === $session_id) {
                if (isset($log['messages'][$message_index])) {
                    $db_data['chat_logs'][$idx]['messages'][$message_index]['rating'] = $rating;
                    file_put_contents($db_file, json_encode($db_data, JSON_PRETTY_PRINT));
                    echo json_encode(['success' => true]);
                    exit;
                }
            }
        }
    }
    
    http_response_code(404);
    echo json_encode(['success' => false, 'message' => 'Session or message not found']);
    exit;
}

if (isset($_GET['action']) && $_GET['action'] === 'increment_visitor_count') {
    $db_data = json_decode($db_content, true);
    $visitor_count = isset($db_data['visitor_count']) ? intval($db_data['visitor_count']) : 1426192;
    $visitor_count++;
    $db_data['visitor_count'] = $visitor_count;
    file_put_contents($db_file, json_encode($db_data, JSON_PRETTY_PRINT));
    echo json_encode(['visitor_count' => $visitor_count]);
    exit;
}

if (isset($_GET['action']) && $_GET['action'] === 'get_visitor_count') {
    $db_data = json_decode($db_content, true);
    $visitor_count = isset($db_data['visitor_count']) ? intval($db_data['visitor_count']) : 1426192;
    echo json_encode(['visitor_count' => $visitor_count]);
    exit;
}

if (isset($_GET['blog_id'])) {
    $db_data = json_decode($db_content, true);
    $blog_id = $_GET['blog_id'];
    $found_blog = null;
    if (isset($db_data['bulletin'])) {
        foreach ($db_data['bulletin'] as $blog) {
            if (strval($blog['id']) === strval($blog_id)) {
                $found_blog = $blog;
                break;
            }
        }
    }
    if ($found_blog) {
        echo json_encode($found_blog);
    } else {
        http_response_code(404);
        echo json_encode(['error' => 'Blog post not found']);
    }
    exit;
}

// Default response: all data
echo $db_content;
?>
