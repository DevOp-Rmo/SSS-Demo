<?php
session_start();
header('Content-Type: application/json');

$db_file = __DIR__ . '/data/db.json';
$upload_dir = __DIR__ . '/uploads/';

// Helper to read database
function read_db() {
    global $db_file;
    if (!file_exists($db_file)) {
        return [
            "ticker" => [],
            "hero_slider" => [],
            "hall_of_fame" => [
                "board_results" => ["image_path" => "", "subtitle" => ""],
                "competitive_exam" => ["image_path" => "", "subtitle" => ""]
            ],
            "awards" => [
                ["id" => "1", "title" => "AWARD 1", "image_path" => ""],
                ["id" => "2", "title" => "AWARD 2", "image_path" => ""],
                ["id" => "3", "title" => "AWARD 3", "image_path" => ""],
                ["id" => "4", "title" => "AWARD 4", "image_path" => ""]
            ],
            "bulletin" => [],
            "chatbot_data" => []
        ];
    }
    return json_decode(file_get_contents($db_file), true);
}

// Helper to write database
function write_db($data) {
    global $db_file;
    file_put_contents($db_file, json_encode($data, JSON_PRETTY_PRINT));
}

// Helper for file upload validation & saving
function handle_upload($file_key, $allowed_types, $max_size = 50000000) { // 50MB max for video
    global $upload_dir;
    if (!isset($_FILES[$file_key]) || $_FILES[$file_key]['error'] !== UPLOAD_ERR_OK) {
        return null;
    }
    
    $file = $_FILES[$file_key];
    if ($file['size'] > $max_size) {
        throw new Exception("File is too large.");
    }
    
    $ext = strtolower(pathinfo($file['name'], PATHINFO_EXTENSION));
    if (!in_array($ext, $allowed_types)) {
        throw new Exception("Invalid file type. Allowed: " . implode(", ", $allowed_types));
    }
    
    if (!is_dir($upload_dir)) {
        mkdir($upload_dir, 0755, true);
    }
    
    $filename = uniqid('file_') . '.' . $ext;
    $dest_path = $upload_dir . $filename;
    
    if (move_uploaded_file($file['tmp_name'], $dest_path)) {
        return 'uploads/' . $filename;
    }
    
    throw new Exception("Failed to save uploaded file.");
}

// Parse request action
$action = isset($_GET['action']) ? $_GET['action'] : '';

// 1. Auth Actions (No login check needed)
if ($action === 'login') {
    $username = isset($_POST['username']) ? $_POST['username'] : '';
    $password = isset($_POST['password']) ? $_POST['password'] : '';
    if ($username === 'admin' && $password === 'passhrcl') {
        $_SESSION['admin_logged_in'] = true;
        echo json_encode(['success' => true, 'message' => 'Logged in successfully.']);
    } else {
        http_response_code(401);
        echo json_encode(['success' => false, 'message' => 'Invalid User ID or password.']);
    }
    exit;
}

if ($action === 'check_session') {
    $logged_in = isset($_SESSION['admin_logged_in']) && $_SESSION['admin_logged_in'] === true;
    echo json_encode(['logged_in' => $logged_in]);
    exit;
}

if ($action === 'logout') {
    $_SESSION = array();
    session_destroy();
    echo json_encode(['success' => true]);
    exit;
}

// 2. Authentication Gate
if (!isset($_SESSION['admin_logged_in']) || $_SESSION['admin_logged_in'] !== true) {
    http_response_code(401);
    echo json_encode(['success' => false, 'message' => 'Unauthorized. Please log in.']);
    exit;
}

// 3. Admin CRUD API Handlers
try {
    $db_data = read_db();
    
    if ($action === 'get_data') {
        echo json_encode($db_data);
        exit;
    }
    
    if ($action === 'save_ticker') {
        $ticker_json = isset($_POST['ticker']) ? $_POST['ticker'] : '[]';
        $ticker_list = json_decode($ticker_json, true);
        if (!is_array($ticker_list)) {
            throw new Exception("Invalid ticker data format.");
        }
        $db_data['ticker'] = $ticker_list;
        write_db($db_data);
        echo json_encode(['success' => true, 'message' => 'Ticker updated successfully.']);
        exit;
    }
    
    if ($action === 'save_award') {
        $award_id = isset($_POST['award_id']) ? strval($_POST['award_id']) : '';
        $delete_image = isset($_POST['delete_image']) && $_POST['delete_image'] === '1';
        
        $found_index = -1;
        foreach ($db_data['awards'] as $idx => $award) {
            if (strval($award['id']) === $award_id) {
                $found_index = $idx;
                break;
            }
        }
        
        if ($found_index === -1) {
            throw new Exception("Award ID not found.");
        }
        
        if ($delete_image) {
            // Delete old file if exists
            $old_path = $db_data['awards'][$found_index]['image_path'];
            if ($old_path && file_exists(__DIR__ . '/' . $old_path)) {
                @unlink(__DIR__ . '/' . $old_path);
            }
            $db_data['awards'][$found_index]['image_path'] = '';
        } else {
            $uploaded_path = handle_upload('image', ['jpg', 'jpeg', 'png', 'gif', 'webp']);
            if ($uploaded_path) {
                // Delete old file if exists
                $old_path = $db_data['awards'][$found_index]['image_path'];
                if ($old_path && file_exists(__DIR__ . '/' . $old_path)) {
                    @unlink(__DIR__ . '/' . $old_path);
                }
                $db_data['awards'][$found_index]['image_path'] = $uploaded_path;
            }
        }
        
        write_db($db_data);
        echo json_encode(['success' => true, 'message' => 'Award updated successfully.', 'data' => $db_data['awards'][$found_index]]);
        exit;
    }
    
    if ($action === 'save_hall_of_fame') {
        $category = isset($_POST['category']) ? $_POST['category'] : ''; // board_results or competitive_exam
        $subtitle = isset($_POST['subtitle']) ? $_POST['subtitle'] : '';
        
        if (!in_array($category, ['board_results', 'competitive_exam'])) {
            throw new Exception("Invalid category.");
        }
        
        $db_data['hall_of_fame'][$category]['subtitle'] = $subtitle;
        
        $uploaded_path = handle_upload('image', ['jpg', 'jpeg', 'png', 'gif', 'webp']);
        if ($uploaded_path) {
            // Delete old file if exists
            $old_path = $db_data['hall_of_fame'][$category]['image_path'];
            if ($old_path && strpos($old_path, 'uploads/') === 0 && file_exists(__DIR__ . '/' . $old_path)) {
                @unlink(__DIR__ . '/' . $old_path);
            }
            $db_data['hall_of_fame'][$category]['image_path'] = $uploaded_path;
        }
        
        write_db($db_data);
        echo json_encode(['success' => true, 'message' => 'Hall of fame category updated.', 'data' => $db_data['hall_of_fame'][$category]]);
        exit;
    }
    
    if ($action === 'save_hero_slide') {
        $slide_id = isset($_POST['slide_id']) ? strval($_POST['slide_id']) : '';
        $type = isset($_POST['type']) ? $_POST['type'] : 'image'; // image or video
        $duration_ms = isset($_POST['duration_ms']) ? intval($_POST['duration_ms']) : 5000;
        
        if (!in_array($type, ['image', 'video'])) {
            throw new Exception("Invalid slide type.");
        }
        
        $found_index = -1;
        if ($slide_id !== '') {
            foreach ($db_data['hero_slider'] as $idx => $slide) {
                if (strval($slide['id']) === $slide_id) {
                    $found_index = $idx;
                    break;
                }
            }
        }
        
        $allowed_exts = ($type === 'video') ? ['mp4', 'webm'] : ['jpg', 'jpeg', 'png', 'gif', 'webp'];
        $uploaded_path = handle_upload('media', $allowed_exts);
        
        if ($found_index !== -1) {
            // Edit existing slide
            $db_data['hero_slider'][$found_index]['type'] = $type;
            $db_data['hero_slider'][$found_index]['duration_ms'] = $duration_ms;
            
            if ($uploaded_path) {
                $old_path = $db_data['hero_slider'][$found_index]['media_path'];
                if ($old_path && strpos($old_path, 'uploads/') === 0 && file_exists(__DIR__ . '/' . $old_path)) {
                    @unlink(__DIR__ . '/' . $old_path);
                }
                $db_data['hero_slider'][$found_index]['media_path'] = $uploaded_path;
            }
            $slide_updated = $db_data['hero_slider'][$found_index];
        } else {
            // Add new slide (Limit to max 5)
            if (count($db_data['hero_slider']) >= 5) {
                throw new Exception("Hero slider limit reached (Max 5 slides).");
            }
            if (!$uploaded_path) {
                throw new Exception("Media file is required for a new slide.");
            }
            
            $new_slide = [
                'id' => strval(time()),
                'type' => $type,
                'media_path' => $uploaded_path,
                'duration_ms' => $duration_ms
            ];
            $db_data['hero_slider'][] = $new_slide;
            $slide_updated = $new_slide;
        }
        
        write_db($db_data);
        echo json_encode(['success' => true, 'message' => 'Hero slide saved successfully.', 'data' => $slide_updated]);
        exit;
    }
    
    if ($action === 'delete_hero_slide') {
        $slide_id = isset($_POST['slide_id']) ? strval($_POST['slide_id']) : '';
        
        $found_index = -1;
        foreach ($db_data['hero_slider'] as $idx => $slide) {
            if (strval($slide['id']) === $slide_id) {
                $found_index = $idx;
                break;
            }
        }
        
        if ($found_index === -1) {
            throw new Exception("Slide ID not found.");
        }
        
        $old_path = $db_data['hero_slider'][$found_index]['media_path'];
        if ($old_path && strpos($old_path, 'uploads/') === 0 && file_exists(__DIR__ . '/' . $old_path)) {
            @unlink(__DIR__ . '/' . $old_path);
        }
        
        array_splice($db_data['hero_slider'], $found_index, 1);
        write_db($db_data);
        echo json_encode(['success' => true, 'message' => 'Hero slide deleted successfully.']);
        exit;
    }
    
    if ($action === 'save_blog_post') {
        $post_id = isset($_POST['post_id']) ? strval($_POST['post_id']) : '';
        $title = isset($_POST['title']) ? $_POST['title'] : '';
        $content = isset($_POST['content']) ? $_POST['content'] : '';
        
        if (empty($title)) {
            throw new Exception("Post title is required.");
        }
        
        $found_index = -1;
        if ($post_id !== '') {
            foreach ($db_data['bulletin'] as $idx => $post) {
                if (strval($post['id']) === $post_id) {
                    $found_index = $idx;
                    break;
                }
            }
        }
        
        $uploaded_path = handle_upload('image', ['jpg', 'jpeg', 'png', 'gif', 'webp']);
        
        if ($found_index !== -1) {
            // Edit post
            $db_data['bulletin'][$found_index]['title'] = $title;
            $db_data['bulletin'][$found_index]['content'] = $content;
            if ($uploaded_path) {
                $old_path = $db_data['bulletin'][$found_index]['image_path'];
                if ($old_path && strpos($old_path, 'uploads/') === 0 && file_exists(__DIR__ . '/' . $old_path)) {
                    @unlink(__DIR__ . '/' . $old_path);
                }
                $db_data['bulletin'][$found_index]['image_path'] = $uploaded_path;
            }
            $post_updated = $db_data['bulletin'][$found_index];
        } else {
            // Create post (put latest at top)
            $new_post = [
                'id' => strval(time()),
                'title' => $title,
                'content' => $content,
                'image_path' => $uploaded_path ? $uploaded_path : '',
                'created_at' => date('Y-m-d\TH:i:s\Z')
            ];
            array_unshift($db_data['bulletin'], $new_post);
            $post_updated = $new_post;
        }
        
        write_db($db_data);
        echo json_encode(['success' => true, 'message' => 'Blog post saved successfully.', 'data' => $post_updated]);
        exit;
    }
    
    if ($action === 'delete_blog_post') {
        $post_id = isset($_POST['post_id']) ? strval($_POST['post_id']) : '';
        
        $found_index = -1;
        foreach ($db_data['bulletin'] as $idx => $post) {
            if (strval($post['id']) === $post_id) {
                $found_index = $idx;
                break;
            }
        }
        
        if ($found_index === -1) {
            throw new Exception("Post ID not found.");
        }
        
        $old_path = $db_data['bulletin'][$found_index]['image_path'];
        if ($old_path && strpos($old_path, 'uploads/') === 0 && file_exists(__DIR__ . '/' . $old_path)) {
            @unlink(__DIR__ . '/' . $old_path);
        }
        
        array_splice($db_data['bulletin'], $found_index, 1);
        write_db($db_data);
        echo json_encode(['success' => true, 'message' => 'Blog post deleted successfully.']);
        exit;
    }

    if ($action === 'save_notice') {
        $notice_id = isset($_POST['notice_id']) ? strval($_POST['notice_id']) : '';
        $title = isset($_POST['title']) ? $_POST['title'] : '';
        $section = isset($_POST['section']) ? $_POST['section'] : 'junior'; // junior / senior
        $class = isset($_POST['class']) ? $_POST['class'] : '';
        $category = isset($_POST['category']) ? $_POST['category'] : 'holiday'; // holiday / admission / exam
        $content = isset($_POST['content']) ? $_POST['content'] : '';
        
        if (empty($title)) {
            throw new Exception("Notice title is required.");
        }
        if (empty($class)) {
            throw new Exception("Class selection is required.");
        }
        
        // Ensure data/db.json has section_notices key
        if (!isset($db_data['section_notices']) || !is_array($db_data['section_notices'])) {
            $db_data['section_notices'] = [];
        }
        
        $found_index = -1;
        if ($notice_id !== '') {
            foreach ($db_data['section_notices'] as $idx => $notice) {
                if (strval($notice['id']) === $notice_id) {
                    $found_index = $idx;
                    break;
                }
            }
        }
        
        // Handle file upload (images & pdfs allowed)
        $uploaded_path = handle_upload('file', ['jpg', 'jpeg', 'png', 'gif', 'webp', 'pdf']);
        
        if ($found_index !== -1) {
            // Edit existing notice
            $db_data['section_notices'][$found_index]['title'] = $title;
            $db_data['section_notices'][$found_index]['section'] = $section;
            $db_data['section_notices'][$found_index]['class'] = $class;
            $db_data['section_notices'][$found_index]['category'] = $category;
            $db_data['section_notices'][$found_index]['content'] = $content;
            
            if ($uploaded_path) {
                // Delete old file if it was uploaded to uploads/
                $old_path = $db_data['section_notices'][$found_index]['file_path'];
                if ($old_path && strpos($old_path, 'uploads/') === 0 && file_exists(__DIR__ . '/' . $old_path)) {
                    @unlink(__DIR__ . '/' . $old_path);
                }
                $db_data['section_notices'][$found_index]['file_path'] = $uploaded_path;
            }
            $notice_updated = $db_data['section_notices'][$found_index];
        } else {
            // Add new notice
            $new_notice = [
                'id' => 'sn_' . time(),
                'section' => $section,
                'class' => $class,
                'category' => $category,
                'date' => date('Y-m-d'),
                'title' => $title,
                'content' => $content,
                'file_path' => $uploaded_path ? $uploaded_path : ''
            ];
            $db_data['section_notices'][] = $new_notice;
            $notice_updated = $new_notice;
        }
        
        write_db($db_data);
        echo json_encode(['success' => true, 'message' => 'Notice saved successfully.', 'data' => $notice_updated]);
        exit;
    }

    if ($action === 'delete_notice') {
        $notice_id = isset($_POST['notice_id']) ? strval($_POST['notice_id']) : '';
        
        if (empty($notice_id)) {
            throw new Exception("Notice ID is required.");
        }
        
        $found_index = -1;
        if (isset($db_data['section_notices'])) {
            foreach ($db_data['section_notices'] as $idx => $notice) {
                if (strval($notice['id']) === $notice_id) {
                    $found_index = $idx;
                    break;
                }
            }
        }
        
        if ($found_index === -1) {
            throw new Exception("Notice not found.");
        }
        
        // Delete associated file if it exists in uploads/
        $old_path = $db_data['section_notices'][$found_index]['file_path'];
        if ($old_path && strpos($old_path, 'uploads/') === 0 && file_exists(__DIR__ . '/' . $old_path)) {
            @unlink(__DIR__ . '/' . $old_path);
        }
        
        array_splice($db_data['section_notices'], $found_index, 1);
        write_db($db_data);
        echo json_encode(['success' => true, 'message' => 'Notice deleted successfully.']);
        exit;
    }

    if ($action === 'upload_chatbot_csv') {
        if (!isset($_FILES['csv']) || $_FILES['csv']['error'] !== UPLOAD_ERR_OK) {
            throw new Exception("No file uploaded or file upload error.");
        }
        $file = $_FILES['csv'];
        $ext = strtolower(pathinfo($file['name'], PATHINFO_EXTENSION));
        if ($ext !== 'csv') {
            throw new Exception("Invalid file type. Only CSV is allowed.");
        }
        $handle = fopen($file['tmp_name'], 'r');
        if ($handle === false) {
            throw new Exception("Unable to open uploaded file.");
        }
        
        $chatbot_data = [];
        $is_first = true;
        while (($row = fgetcsv($handle, 1000, ",")) !== false) {
            if (empty($row) || (count($row) === 1 && empty($row[0]))) {
                continue;
            }
            $query = isset($row[0]) ? trim($row[0]) : '';
            $keywords = isset($row[1]) ? trim($row[1]) : '';
            $response = isset($row[2]) ? trim($row[2]) : '';
            
            if ($is_first) {
                $is_first = false;
                if (strtolower($query) === 'query' || strtolower($keywords) === 'keywords') {
                    continue;
                }
            }
            
            if ($query !== '' || $keywords !== '' || $response !== '') {
                $chatbot_data[] = [
                    'query' => $query,
                    'keywords' => $keywords,
                    'response' => $response
                ];
            }
        }
        fclose($handle);
        
        $db_data['chatbot_data'] = $chatbot_data;
        write_db($db_data);
        echo json_encode(['success' => true, 'message' => 'Chatbot training data updated successfully.', 'data' => $chatbot_data]);
        exit;
    }

    if ($action === 'save_chatbot_item') {
        $index = isset($_POST['index']) ? $_POST['index'] : '';
        $query = isset($_POST['query']) ? trim($_POST['query']) : '';
        $keywords = isset($_POST['keywords']) ? trim($_POST['keywords']) : '';
        $response = isset($_POST['response']) ? trim($_POST['response']) : '';
        
        if ($query === '' || $keywords === '' || $response === '') {
            throw new Exception("All fields (Query, Keywords, Response) are required.");
        }
        
        if (!isset($db_data['chatbot_data']) || !is_array($db_data['chatbot_data'])) {
            $db_data['chatbot_data'] = [];
        }
        
        $item = [
            'query' => $query,
            'keywords' => $keywords,
            'response' => $response
        ];
        
        if ($index !== '') {
            $idx = intval($index);
            if ($idx >= 0 && $idx < count($db_data['chatbot_data'])) {
                $db_data['chatbot_data'][$idx] = $item;
            } else {
                throw new Exception("Invalid Q&A index.");
            }
        } else {
            $db_data['chatbot_data'][] = $item;
        }
        
        write_db($db_data);
        echo json_encode(['success' => true, 'message' => 'Q&A item saved successfully.', 'data' => $db_data['chatbot_data']]);
        exit;
    }

    if ($action === 'delete_chatbot_item') {
        $index = isset($_POST['index']) ? $_POST['index'] : '';
        if ($index === '') {
            throw new Exception("Index is required.");
        }
        
        $idx = intval($index);
        if (isset($db_data['chatbot_data']) && $idx >= 0 && $idx < count($db_data['chatbot_data'])) {
            array_splice($db_data['chatbot_data'], $idx, 1);
            write_db($db_data);
            echo json_encode(['success' => true, 'message' => 'Q&A item deleted successfully.', 'data' => $db_data['chatbot_data']]);
        } else {
            throw new Exception("Invalid Q&A index.");
        }
        exit;
    }

    if ($action === 'delete_chat_log') {
        $session_id = isset($_POST['session_id']) ? $_POST['session_id'] : '';
        if ($session_id === '') {
            throw new Exception("Session ID is required.");
        }
        
        if (isset($db_data['chat_logs']) && is_array($db_data['chat_logs'])) {
            $found_index = -1;
            foreach ($db_data['chat_logs'] as $idx => $log) {
                if ($log['session_id'] === $session_id) {
                    $found_index = $idx;
                    break;
                }
            }
            if ($found_index !== -1) {
                array_splice($db_data['chat_logs'], $found_index, 1);
                write_db($db_data);
                echo json_encode(['success' => true, 'message' => 'Chat log deleted successfully.']);
            } else {
                throw new Exception("Chat log session not found.");
            }
        } else {
            throw new Exception("No chat logs found.");
        }
        exit;
    }
    
    throw new Exception("Unknown action.");
    
} catch (Exception $e) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => $e->getMessage()]);
}
?>
