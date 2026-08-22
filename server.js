const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');
const querystring = require('querystring');

const PORT = 3000;
const DB_FILE = path.join(__dirname, 'data', 'db.json');

// Ensure data folder and db.json exist
if (!fs.existsSync(path.join(__dirname, 'data'))) {
    fs.mkdirSync(path.join(__dirname, 'data'));
}
if (!fs.existsSync(DB_FILE)) {
    fs.writeFileSync(DB_FILE, JSON.stringify({
        ticker: [
            "ADMISSIONS OPEN FOR 2026-27 SESSION",
            "NEW MOBILE APP LAUNCHED FOR PARENTS",
            "SHRI SHIKSHAYATAN RANKS TOP IN BOARD RESULTS",
            "UPCOMING INTER-SCHOOL EVENTS"
        ],
        hero_slider: [
            {
                id: "1",
                type: "image",
                media_path: "assets/hero_bg.png",
                duration_ms: 5000
            }
        ],
        hall_of_fame: {
            board_results: {
                image_path: "assets/board_results.png",
                subtitle: "AISSE & AISSCE PERFORMANCE 2025"
            },
            competitive_exam: {
                image_path: "assets/exam_success.png",
                subtitle: "JEE, NEET & OLYMPIAD QUALIFIERS"
            }
        },
        awards: [
            { id: "1", title: "AWARD 1", image_path: "" },
            { id: "2", title: "AWARD 2", image_path: "" },
            { id: "3", title: "AWARD 3", image_path: "" },
            { id: "4", title: "AWARD 4", image_path: "" }
        ],
        bulletin: [],
        section_notices: [],
        chatbot_data: []
    }, null, 2), 'utf8');
}

const MIME_TYPES = {
    '.html': 'text/html',
    '.css': 'text/css',
    '.js': 'application/javascript',
    '.json': 'application/json',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.gif': 'image/gif',
    '.svg': 'image/svg+xml',
    '.pdf': 'application/pdf',
    '.ico': 'image/x-icon'
};

function parseCSVLine(line) {
    const result = [];
    let current = '';
    let inQuotes = false;
    for (let i = 0; i < line.length; i++) {
        const char = line[i];
        if (char === '"') {
            inQuotes = !inQuotes;
        } else if (char === ',' && !inQuotes) {
            result.push(current.trim());
            current = '';
        } else {
            current += char;
        }
    }
    result.push(current.trim());
    return result.map(val => {
        if (val.startsWith('"') && val.endsWith('"')) {
            return val.substring(1, val.length - 1);
        }
        return val;
    });
}

function parseRequestBody(req, callback) {
    let body = [];
    req.on('data', chunk => body.push(chunk));
    req.on('end', () => {
        const buffer = Buffer.concat(body);
        const contentType = req.headers['content-type'] || '';
        const fields = {};
        const files = {};

        if (contentType.includes('multipart/form-data')) {
            const boundaryMatch = contentType.match(/boundary=(.+)/);
            if (boundaryMatch) {
                const boundary = boundaryMatch[1];
                const boundaryBuffer = Buffer.from('--' + boundary);
                let parts = [];
                let startPos = 0;
                
                while (true) {
                    const idx = buffer.indexOf(boundaryBuffer, startPos);
                    if (idx === -1) break;
                    if (startPos !== 0) {
                        parts.push(buffer.subarray(startPos, idx));
                    }
                    startPos = idx + boundaryBuffer.length;
                }
                
                for (let part of parts) {
                    if (part.length === 0) continue;
                    const headerEnd = part.indexOf('\r\n\r\n');
                    if (headerEnd !== -1) {
                        const headers = part.subarray(0, headerEnd).toString('utf8');
                        let data = part.subarray(headerEnd + 4);
                        
                        const nameMatch = headers.match(/name="([^"]+)"/);
                        if (nameMatch) {
                            const name = nameMatch[1];
                            let value = data;
                            if (value.length >= 2 && value[value.length - 2] === 13 && value[value.length - 1] === 10) {
                                value = value.subarray(0, value.length - 2);
                            }
                            
                            const filenameMatch = headers.match(/filename="([^"]*)"/);
                            if (filenameMatch && filenameMatch[1]) {
                                const fileObj = {
                                    filename: filenameMatch[1],
                                    data: value
                                };
                                if (files[name]) {
                                    if (Array.isArray(files[name])) {
                                        files[name].push(fileObj);
                                    } else {
                                        files[name] = [files[name], fileObj];
                                    }
                                } else {
                                    files[name] = fileObj;
                                }
                            } else {
                                fields[name] = value.toString('utf8').trim();
                            }
                        }
                    }
                }
            }
        } else {
            const params = querystring.parse(buffer.toString('utf8'));
            for (let key in params) {
                fields[key] = params[key];
            }
        }
        callback(fields, files);
    });
}

const server = http.createServer((req, res) => {
    const parsedUrl = url.parse(req.url, true);
    const pathname = parsedUrl.pathname;
    const query = parsedUrl.query;

    // Handle api.php and admin_api.php mock endpoints
    if (pathname === '/api.php') {
        const action = query.action;
        if (req.method === 'POST') {
            parseRequestBody(req, (fields) => {
                const db = JSON.parse(fs.readFileSync(DB_FILE, 'utf8'));
                if (action === 'log_chat_message') {
                    const session_id = fields.session_id || '';
                    const user_name = fields.user_name || '';
                    const sender = fields.sender || '';
                    const text = fields.text || '';
                    if (!session_id || !sender || !text) {
                        res.writeHead(400, { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' });
                        res.end(JSON.stringify({ success: false, message: 'Missing fields' }));
                        return;
                    }
                    if (!db.chat_logs) db.chat_logs = [];
                    let foundIdx = db.chat_logs.findIndex(log => log.session_id === session_id);
                    const msg = {
                        sender: sender,
                        text: text,
                        timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
                        rating: 0
                    };
                    if (foundIdx !== -1) {
                        if (user_name) db.chat_logs[foundIdx].user_name = user_name;
                        db.chat_logs[foundIdx].last_active = msg.timestamp;
                        db.chat_logs[foundIdx].messages.push(msg);
                        db.chat_logs[foundIdx].message_count = db.chat_logs[foundIdx].messages.length;
                    } else {
                        db.chat_logs.push({
                             session_id: session_id,
                             user_name: user_name || 'Anonymous',
                             last_active: msg.timestamp,
                             messages: [msg],
                             message_count: 1
                        });
                    }
                    fs.writeFileSync(DB_FILE, JSON.stringify(db, null, 2), 'utf8');
                    res.writeHead(200, { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' });
                    res.end(JSON.stringify({ success: true }));
                } else if (action === 'log_chat_rating') {
                    const session_id = fields.session_id || '';
                    const message_index = parseInt(fields.message_index, 10);
                    const rating = parseInt(fields.rating, 10) || 0;
                    if (!session_id || isNaN(message_index)) {
                        res.writeHead(400, { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' });
                        res.end(JSON.stringify({ success: false, message: 'Missing fields' }));
                        return;
                    }
                    if (db.chat_logs) {
                        let foundIdx = db.chat_logs.findIndex(log => log.session_id === session_id);
                        if (foundIdx !== -1 && db.chat_logs[foundIdx].messages[message_index]) {
                            db.chat_logs[foundIdx].messages[message_index].rating = rating;
                            fs.writeFileSync(DB_FILE, JSON.stringify(db, null, 2), 'utf8');
                            res.writeHead(200, { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' });
                            res.end(JSON.stringify({ success: true }));
                            return;
                         }
                    }
                    res.writeHead(404, { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' });
                    res.end(JSON.stringify({ success: false, message: 'Session or message not found' }));
                } else {
                    res.writeHead(400, { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' });
                    res.end(JSON.stringify({ success: false, message: 'Unknown post action' }));
                }
            });
            return;
        }
        
        if (action === 'get_chatbot_data') {
            const db = JSON.parse(fs.readFileSync(DB_FILE, 'utf8'));
            res.writeHead(200, { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' });
            res.end(JSON.stringify(db.chatbot_data || []));
            return;
        }

        if (action === 'increment_visitor_count') {
            const db = JSON.parse(fs.readFileSync(DB_FILE, 'utf8'));
            let count = parseInt(db.visitor_count, 10) || 1426192;
            count++;
            db.visitor_count = count;
            fs.writeFileSync(DB_FILE, JSON.stringify(db, null, 2), 'utf8');
            res.writeHead(200, { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' });
            res.end(JSON.stringify({ visitor_count: count }));
            return;
        }

        if (action === 'get_visitor_count') {
            const db = JSON.parse(fs.readFileSync(DB_FILE, 'utf8'));
            let count = parseInt(db.visitor_count, 10) || 1426192;
            res.writeHead(200, { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' });
            res.end(JSON.stringify({ visitor_count: count }));
            return;
        }
        res.writeHead(200, { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' });
        const dbContent = JSON.parse(fs.readFileSync(DB_FILE, 'utf8'));
        if (dbContent.feedbacks && Array.isArray(dbContent.feedbacks)) {
            dbContent.feedbacks = dbContent.feedbacks.filter(fb => !fb.status || fb.status === 'approved');
        }
        res.end(JSON.stringify(dbContent, null, 2));
        return;
    }

    if (pathname === '/admin_api.php') {
        const action = query.action;
        const cookies = querystring.parse(req.headers.cookie, '; ');
        const loggedIn = cookies.admin_logged_in === 'true';

        // 1. No auth actions
        if (action === 'login') {
            parseRequestBody(req, (fields) => {
                const username = fields.username;
                const password = fields.password;
                if (username === 'admin' && password === 'passhrcl') {
                    res.writeHead(200, {
                        'Content-Type': 'application/json',
                        'Set-Cookie': 'admin_logged_in=true; Path=/; HttpOnly'
                    });
                    res.end(JSON.stringify({ success: true, message: 'Logged in successfully.' }));
                } else {
                    res.writeHead(401, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ success: false, message: 'Invalid User ID or password.' }));
                }
            });
            return;
        }

        if (action === 'check_session') {
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ logged_in: loggedIn }));
            return;
        }

        if (action === 'logout') {
            res.writeHead(200, {
                'Content-Type': 'application/json',
                'Set-Cookie': 'admin_logged_in=false; Path=/; Max-Age=0; HttpOnly'
            });
            res.end(JSON.stringify({ success: true }));
            return;
        }

        // Public action: submit_feedback (no auth required — users submit from frontend)
        if (action === 'submit_feedback') {
            parseRequestBody(req, (fields) => {
                const db = JSON.parse(fs.readFileSync(DB_FILE, 'utf8'));
                if (!db.feedbacks) db.feedbacks = [];

                const name = fields.name || fields.title || '';
                const relation = fields.relation || fields.subtitle || '';
                const content = fields.content || '';
                const section = fields.section || 'junior';
                const rating = parseInt(fields.rating) || 5;

                if (!name || !relation || !content) {
                    res.writeHead(400, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ success: false, message: 'Please fill in all fields.' }));
                    return;
                }

                const newFb = {
                    id: 'fb_' + Date.now() + '_' + Math.floor(Math.random() * 1000),
                    section: section,
                    type: 'text',
                    title: name,
                    subtitle: relation,
                    content: content,
                    rating: rating,
                    file_paths: [],
                    status: 'pending'
                };

                db.feedbacks.unshift(newFb);
                fs.writeFileSync(DB_FILE, JSON.stringify(db, null, 2), 'utf8');
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ success: true, message: 'Testimonial submitted for review.' }));
            });
            return;
        }

        // Authentication check for all other actions
        if (!loggedIn) {
            res.writeHead(401, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ success: false, message: 'Unauthorized. Please log in.' }));
            return;
        }

        if (action === 'get_data') {
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(fs.readFileSync(DB_FILE, 'utf8'));
            return;
        }

        if (action === 'upload_chatbot_csv') {
            parseRequestBody(req, (fields, files) => {
                const csvFile = files.csv;
                if (csvFile) {
                    const csvText = csvFile.data.toString('utf8');
                    const lines = csvText.split(/\r?\n/);
                    const chatbot_data = [];
                    let isFirst = true;
                    for (let line of lines) {
                        if (!line.trim()) continue;
                        const cols = parseCSVLine(line);
                        if (cols.length < 3) continue;
                        const query = cols[0];
                        const keywords = cols[1];
                        const response = cols[2];
                        if (isFirst) {
                            isFirst = false;
                            if (query.toLowerCase() === 'query' || keywords.toLowerCase() === 'keywords') {
                                continue;
                            }
                        }
                        chatbot_data.push({ query, keywords, response });
                    }
                    const db = JSON.parse(fs.readFileSync(DB_FILE, 'utf8'));
                    db.chatbot_data = chatbot_data;
                    fs.writeFileSync(DB_FILE, JSON.stringify(db, null, 2), 'utf8');
                    
                    res.writeHead(200, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ success: true, message: 'Chatbot training data updated successfully.', data: chatbot_data }));
                } else {
                    res.writeHead(400, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ success: false, message: 'Invalid CSV upload' }));
                }
            });
            return;
        }

        if (action === 'save_ticker') {
            parseRequestBody(req, (fields) => {
                const tickerList = JSON.parse(fields.ticker || '[]');
                const db = JSON.parse(fs.readFileSync(DB_FILE, 'utf8'));
                db.ticker = tickerList;
                fs.writeFileSync(DB_FILE, JSON.stringify(db, null, 2), 'utf8');
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ success: true, message: 'Ticker updated successfully.' }));
            });
            return;
        }

        if (action === 'save_hall_of_fame') {
            parseRequestBody(req, (fields, files) => {
                const category = fields.category;
                const subtitle = fields.subtitle;
                
                if (!['board_results', 'competitive_exam'].includes(category)) {
                    res.writeHead(400, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ success: false, message: 'Invalid category' }));
                    return;
                }
                
                const db = JSON.parse(fs.readFileSync(DB_FILE, 'utf8'));
                if (!db.hall_of_fame) db.hall_of_fame = {};
                if (!db.hall_of_fame[category]) db.hall_of_fame[category] = { image_path: '', subtitle: '' };
                
                db.hall_of_fame[category].subtitle = subtitle;
                
                const imageFile = files.image;
                if (imageFile && imageFile.filename && imageFile.data && imageFile.data.length > 0) {
                    const ext = path.extname(imageFile.filename).toLowerCase();
                    const safeName = 'hof_' + category + ext;
                    const uploadsDir = path.join(__dirname, 'uploads');
                    if (!fs.existsSync(uploadsDir)) {
                        fs.mkdirSync(uploadsDir);
                    }
                    fs.writeFileSync(path.join(uploadsDir, safeName), imageFile.data);
                    db.hall_of_fame[category].image_path = 'uploads/' + safeName;
                }
                
                fs.writeFileSync(DB_FILE, JSON.stringify(db, null, 2), 'utf8');
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ success: true, message: 'Hall of fame category updated.', data: db.hall_of_fame[category] }));
            });
            return;
        }

        if (action === 'save_award') {
            parseRequestBody(req, (fields, files) => {
                const awardId = fields.award_id;
                const deleteImage = fields.delete_image === '1';
                
                const db = JSON.parse(fs.readFileSync(DB_FILE, 'utf8'));
                if (!db.awards) db.awards = [];
                
                const foundIndex = db.awards.findIndex(a => String(a.id) === String(awardId));
                if (foundIndex === -1) {
                    res.writeHead(400, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ success: false, message: 'Award ID not found' }));
                    return;
                }
                
                if (deleteImage) {
                    db.awards[foundIndex].image_path = '';
                } else {
                    const imageFile = files.image;
                    if (imageFile && imageFile.filename && imageFile.data && imageFile.data.length > 0) {
                        const ext = path.extname(imageFile.filename).toLowerCase();
                        const safeName = 'award_' + awardId + ext;
                        const uploadsDir = path.join(__dirname, 'uploads');
                        if (!fs.existsSync(uploadsDir)) {
                            fs.mkdirSync(uploadsDir);
                        }
                        fs.writeFileSync(path.join(uploadsDir, safeName), imageFile.data);
                        db.awards[foundIndex].image_path = 'uploads/' + safeName;
                    }
                }
                
                fs.writeFileSync(DB_FILE, JSON.stringify(db, null, 2), 'utf8');
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ success: true, message: 'Award updated successfully.', data: db.awards[foundIndex] }));
            });
            return;
        }

        if (action === 'save_hero_slide') {
            parseRequestBody(req, (fields, files) => {
                const slideId = fields.slide_id || '';
                const type = fields.type || 'image';
                const durationMs = parseInt(fields.duration_ms || '5000', 10);
                
                const db = JSON.parse(fs.readFileSync(DB_FILE, 'utf8'));
                if (!db.hero_slider) db.hero_slider = [];
                
                let foundIndex = -1;
                if (slideId) {
                    foundIndex = db.hero_slider.findIndex(s => String(s.id) === String(slideId));
                }
                
                let mediaPath = '';
                const mediaFile = files.media;
                if (mediaFile && mediaFile.filename && mediaFile.data && mediaFile.data.length > 0) {
                    const ext = path.extname(mediaFile.filename).toLowerCase();
                    const safeName = 'slide_' + (slideId || Date.now()) + ext;
                    const uploadsDir = path.join(__dirname, 'uploads');
                    if (!fs.existsSync(uploadsDir)) {
                        fs.mkdirSync(uploadsDir);
                    }
                    fs.writeFileSync(path.join(uploadsDir, safeName), mediaFile.data);
                    mediaPath = 'uploads/' + safeName;
                }
                
                let slideUpdated;
                if (foundIndex !== -1) {
                    db.hero_slider[foundIndex].type = type;
                    db.hero_slider[foundIndex].duration_ms = durationMs;
                    if (mediaPath) {
                        db.hero_slider[foundIndex].media_path = mediaPath;
                    }
                    slideUpdated = db.hero_slider[foundIndex];
                } else {
                    if (db.hero_slider.length >= 5) {
                        res.writeHead(400, { 'Content-Type': 'application/json' });
                        res.end(JSON.stringify({ success: false, message: 'Hero slider limit reached (Max 5 slides).' }));
                        return;
                    }
                    slideUpdated = {
                        id: String(Date.now()),
                        type: type,
                        media_path: mediaPath,
                        duration_ms: durationMs
                    };
                    db.hero_slider.push(slideUpdated);
                }
                
                fs.writeFileSync(DB_FILE, JSON.stringify(db, null, 2), 'utf8');
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ success: true, message: 'Hero slide saved successfully.', data: slideUpdated }));
            });
            return;
        }

        if (action === 'delete_hero_slide') {
            parseRequestBody(req, (fields) => {
                const slideId = fields.slide_id || '';
                const db = JSON.parse(fs.readFileSync(DB_FILE, 'utf8'));
                if (!db.hero_slider) db.hero_slider = [];
                
                const foundIndex = db.hero_slider.findIndex(s => String(s.id) === String(slideId));
                if (foundIndex === -1) {
                    res.writeHead(400, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ success: false, message: 'Slide ID not found.' }));
                    return;
                }
                
                db.hero_slider.splice(foundIndex, 1);
                fs.writeFileSync(DB_FILE, JSON.stringify(db, null, 2), 'utf8');
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ success: true, message: 'Hero slide deleted successfully.' }));
            });
            return;
        }

        if (action === 'save_blog_post') {
            parseRequestBody(req, (fields, files) => {
                const postId = fields.post_id || '';
                const title = fields.title || '';
                const content = fields.content || '';
                
                if (!title) {
                    res.writeHead(400, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ success: false, message: 'Post title is required.' }));
                    return;
                }
                
                const db = JSON.parse(fs.readFileSync(DB_FILE, 'utf8'));
                if (!db.bulletin) db.bulletin = [];
                
                let foundIndex = -1;
                if (postId) {
                    foundIndex = db.bulletin.findIndex(p => String(p.id) === String(postId));
                }
                
                let imagePath = '';
                const imageFile = files.image;
                if (imageFile && imageFile.filename && imageFile.data && imageFile.data.length > 0) {
                    const ext = path.extname(imageFile.filename).toLowerCase();
                    const safeName = 'blog_' + (postId || Date.now()) + ext;
                    const uploadsDir = path.join(__dirname, 'uploads');
                    if (!fs.existsSync(uploadsDir)) {
                        fs.mkdirSync(uploadsDir);
                    }
                    fs.writeFileSync(path.join(uploadsDir, safeName), imageFile.data);
                    imagePath = 'uploads/' + safeName;
                }
                
                let postUpdated;
                if (foundIndex !== -1) {
                    db.bulletin[foundIndex].title = title;
                    db.bulletin[foundIndex].content = content;
                    if (imagePath) {
                        db.bulletin[foundIndex].image_path = imagePath;
                    }
                    postUpdated = db.bulletin[foundIndex];
                } else {
                    postUpdated = {
                        id: String(Date.now()),
                        title: title,
                        content: content,
                        image_path: imagePath,
                        created_at: new Date().toISOString()
                    };
                    db.bulletin.unshift(postUpdated);
                }
                
                fs.writeFileSync(DB_FILE, JSON.stringify(db, null, 2), 'utf8');
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ success: true, message: 'Blog post saved successfully.', data: postUpdated }));
            });
            return;
        }

        if (action === 'delete_blog_post') {
            parseRequestBody(req, (fields) => {
                const postId = fields.post_id || '';
                const db = JSON.parse(fs.readFileSync(DB_FILE, 'utf8'));
                if (!db.bulletin) db.bulletin = [];
                
                const foundIndex = db.bulletin.findIndex(p => String(p.id) === String(postId));
                if (foundIndex === -1) {
                    res.writeHead(400, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ success: false, message: 'Post ID not found.' }));
                    return;
                }
                
                db.bulletin.splice(foundIndex, 1);
                fs.writeFileSync(DB_FILE, JSON.stringify(db, null, 2), 'utf8');
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ success: true, message: 'Blog post deleted successfully.' }));
            });
            return;
        }

        if (action === 'save_notice') {
            parseRequestBody(req, (fields, files) => {
                const db = JSON.parse(fs.readFileSync(DB_FILE, 'utf8'));
                if (!db.section_notices) db.section_notices = [];
                
                const noticeId = fields.notice_id || '';
                const isEdit = !!noticeId;
                
                let filePaths = [];
                if (fields.existing_files) {
                    try {
                        filePaths = JSON.parse(fields.existing_files);
                    } catch (e) {
                        filePaths = [fields.existing_files];
                    }
                }
                
                // Parse class if it's a JSON array string
                let classToSave = fields.class || 'Class I';
                if (typeof classToSave === 'string' && classToSave.startsWith('[')) {
                    try {
                        classToSave = JSON.parse(classToSave);
                    } catch (e) {}
                }
                
                // Handle multiple files uploads
                let uploadedPaths = [];
                const noticeFiles = files['files[]'];
                if (noticeFiles) {
                    const noticeFilesArray = Array.isArray(noticeFiles) ? noticeFiles : [noticeFiles];
                    const uploadsDir = path.join(__dirname, 'uploads');
                    if (!fs.existsSync(uploadsDir)) {
                        fs.mkdirSync(uploadsDir);
                    }
                    
                    noticeFilesArray.forEach((fileObj, index) => {
                        if (fileObj && fileObj.filename && fileObj.data && fileObj.data.length > 0) {
                            const ext = path.extname(fileObj.filename).toLowerCase();
                            const safeName = 'notice_' + Date.now() + '_' + index + ext;
                            fs.writeFileSync(path.join(uploadsDir, safeName), fileObj.data);
                            uploadedPaths.push('uploads/' + safeName);
                        }
                    });
                }
                
                if (uploadedPaths.length > 0) {
                    // Delete old files on edit if new files are uploaded
                    if (isEdit) {
                        const idx = db.section_notices.findIndex(n => String(n.id) === String(noticeId));
                        if (idx !== -1) {
                            const oldPaths = db.section_notices[idx].file_paths || (db.section_notices[idx].file_path ? [db.section_notices[idx].file_path] : []);
                            oldPaths.forEach(oldPath => {
                                if (oldPath && oldPath.startsWith('uploads/')) {
                                    const fullOldPath = path.join(__dirname, oldPath);
                                    if (fs.existsSync(fullOldPath)) {
                                        try {
                                            fs.unlinkSync(fullOldPath);
                                        } catch (e) {}
                                    }
                                }
                            });
                        }
                    }
                    filePaths = uploadedPaths;
                } else if (!isEdit && filePaths.length > 0) {
                    // Copy Notice operation: duplicate files on disk to prevent reference break
                    const duplicatedPaths = [];
                    const uploadsDir = path.join(__dirname, 'uploads');
                    filePaths.forEach((oldPath, index) => {
                        if (oldPath && oldPath.startsWith('uploads/')) {
                            const fullOldPath = path.join(__dirname, oldPath);
                            if (fs.existsSync(fullOldPath)) {
                                const ext = path.extname(oldPath).toLowerCase();
                                const safeName = 'notice_copy_' + Date.now() + '_' + index + ext;
                                const fullNewPath = path.join(uploadsDir, safeName);
                                try {
                                    fs.copyFileSync(fullOldPath, fullNewPath);
                                    duplicatedPaths.push('uploads/' + safeName);
                                } catch (e) {
                                    duplicatedPaths.push(oldPath);
                                }
                            } else {
                                duplicatedPaths.push(oldPath);
                            }
                        } else {
                            duplicatedPaths.push(oldPath);
                        }
                    });
                    filePaths = duplicatedPaths;
                }
                
                const start_date = fields.start_date || '';
                const start_time = fields.start_time || '';
                const end_date = fields.end_date || '';
                
                let finalNotice;
                
                if (isEdit) {
                    const idx = db.section_notices.findIndex(n => String(n.id) === String(noticeId));
                    if (idx !== -1) {
                        db.section_notices[idx].title = fields.title || '';
                        db.section_notices[idx].section = fields.section || 'junior';
                        db.section_notices[idx].class = classToSave;
                        db.section_notices[idx].category = fields.category || 'holiday';
                        db.section_notices[idx].content = fields.content || '';
                        db.section_notices[idx].start_date = start_date;
                        db.section_notices[idx].start_time = start_time;
                        db.section_notices[idx].end_date = end_date;
                        db.section_notices[idx].file_paths = filePaths;
                        db.section_notices[idx].file_path = filePaths.length > 0 ? filePaths[0] : '';
                        finalNotice = db.section_notices[idx];
                    } else {
                        finalNotice = {
                            id: 'sn_' + Date.now(),
                            section: fields.section || 'junior',
                            class: classToSave,
                            category: fields.category || 'holiday',
                            date: new Date().toISOString().split('T')[0],
                            title: fields.title || '',
                            content: fields.content || '',
                            start_date: start_date,
                            start_time: start_time,
                            end_date: end_date,
                            file_paths: filePaths,
                            file_path: filePaths.length > 0 ? filePaths[0] : ''
                        };
                        db.section_notices.push(finalNotice);
                    }
                } else {
                    finalNotice = {
                        id: 'sn_' + Date.now(),
                        section: fields.section || 'junior',
                        class: classToSave,
                        category: fields.category || 'holiday',
                        date: new Date().toISOString().split('T')[0],
                        title: fields.title || '',
                        content: fields.content || '',
                        start_date: start_date,
                        start_time: start_time,
                        end_date: end_date,
                        file_paths: filePaths,
                        file_path: filePaths.length > 0 ? filePaths[0] : ''
                    };
                    db.section_notices.push(finalNotice);
                }
                
                fs.writeFileSync(DB_FILE, JSON.stringify(db, null, 2), 'utf8');
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ success: true, message: 'Notice saved successfully.', data: finalNotice }));
            });
            return;
        }

        if (action === 'save_tc') {
            parseRequestBody(req, (fields, files) => {
                const db = JSON.parse(fs.readFileSync(DB_FILE, 'utf8'));
                if (!db.transfer_certificates) db.transfer_certificates = [];

                const name = fields.name || '';
                const studentClass = fields.studentClass || '';
                const dateRaw = fields.dateRaw || '';
                const displayDate = fields.displayDate || '';

                if (!name || !studentClass || !dateRaw) {
                    res.writeHead(400, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ success: false, message: 'Full Name, Class, and Date are required.' }));
                    return;
                }

                let filePath = '';
                const tcFile = files.pdf;
                if (tcFile) {
                    const destDir = path.join(__dirname, 'assets', 'TC', 'downloaded_pdfs');
                    if (!fs.existsSync(destDir)) {
                        fs.mkdirSync(destDir, { recursive: true });
                    }
                    const ext = path.extname(tcFile.filename).toLowerCase();
                    const cleanName = name.replace(/[^a-zA-Z0-9_-]/g, '_');
                    const safeName = 'tc_' + Date.now() + '_' + cleanName + ext;
                    fs.writeFileSync(path.join(destDir, safeName), tcFile.data);
                    filePath = 'assets/TC/downloaded_pdfs/' + safeName;
                }

                const newTc = {
                    id: 'tc_' + Date.now(),
                    name: name,
                    class: studentClass,
                    date_raw: dateRaw,
                    date: displayDate,
                    file_path: filePath,
                    addedAt: new Date().toISOString()
                };

                db.transfer_certificates.unshift(newTc);
                fs.writeFileSync(DB_FILE, JSON.stringify(db, null, 2), 'utf8');

                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ success: true, message: 'TC saved successfully.', data: newTc }));
            });
            return;
        }

        if (action === 'delete_tc') {
            parseRequestBody(req, (fields) => {
                const id = fields.id;
                if (!id) {
                    res.writeHead(400, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ success: false, message: 'TC ID is required.' }));
                    return;
                }

                const db = JSON.parse(fs.readFileSync(DB_FILE, 'utf8'));
                if (db.transfer_certificates) {
                    const entry = db.transfer_certificates.find(e => String(e.id) === String(id));
                    if (entry && entry.file_path) {
                        const fullPath = path.join(__dirname, entry.file_path);
                        if (fs.existsSync(fullPath)) {
                            try {
                                fs.unlinkSync(fullPath);
                            } catch (e) {}
                        }
                    }
                    db.transfer_certificates = db.transfer_certificates.filter(e => String(e.id) !== String(id));
                }
                fs.writeFileSync(DB_FILE, JSON.stringify(db, null, 2), 'utf8');
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ success: true, message: 'TC entry deleted successfully.' }));
            });
            return;
        }

        if (action === 'save_feedback') {
            parseRequestBody(req, (fields, files) => {
                const db = JSON.parse(fs.readFileSync(DB_FILE, 'utf8'));
                if (!db.feedbacks) db.feedbacks = [];

                const id = fields.id || '';
                const section = fields.section || 'junior';
                const type = fields.type || 'text';
                const title = fields.title || '';
                const subtitle = fields.subtitle || '';
                const content = fields.content || '';

                if (!title) {
                    res.writeHead(400, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ success: false, message: 'Title/Name is required.' }));
                    return;
                }

                let uploadedPaths = [];
                const uploadedFiles = files['files[]'] || files['files'];
                if (uploadedFiles) {
                    const filesArray = Array.isArray(uploadedFiles) ? uploadedFiles : [uploadedFiles];
                    const uploadsDir = path.join(__dirname, 'uploads');
                    if (!fs.existsSync(uploadsDir)) {
                        fs.mkdirSync(uploadsDir, { recursive: true });
                    }

                    filesArray.forEach((fileObj, index) => {
                        if (fileObj && fileObj.filename && fileObj.data && fileObj.data.length > 0) {
                            const ext = path.extname(fileObj.filename).toLowerCase();
                            const safeName = 'feedback_' + Date.now() + '_' + index + ext;
                            fs.writeFileSync(path.join(uploadsDir, safeName), fileObj.data);
                            uploadedPaths.push('uploads/' + safeName);
                        }
                    });
                }

                let finalFb;
                const foundIndex = db.feedbacks.findIndex(f => String(f.id) === String(id));

                if (foundIndex !== -1) {
                    db.feedbacks[foundIndex].section = section;
                    db.feedbacks[foundIndex].type = type;
                    db.feedbacks[foundIndex].title = title;
                    db.feedbacks[foundIndex].subtitle = subtitle;
                    db.feedbacks[foundIndex].content = content;
                    db.feedbacks[foundIndex].status = fields.status || db.feedbacks[foundIndex].status || 'approved';

                    if (type === 'images' && uploadedPaths.length > 0) {
                        const oldPaths = db.feedbacks[foundIndex].file_paths || [];
                        oldPaths.forEach(oldPath => {
                            if (oldPath && oldPath.startsWith('uploads/')) {
                                const fullPath = path.join(__dirname, oldPath);
                                if (fs.existsSync(fullPath)) {
                                    try {
                                        fs.unlinkSync(fullPath);
                                    } catch (e) {}
                                }
                            }
                        });
                        db.feedbacks[foundIndex].file_paths = uploadedPaths;
                    }
                    finalFb = db.feedbacks[foundIndex];
                } else {
                    finalFb = {
                        id: 'fb_' + Date.now(),
                        section: section,
                        type: type,
                        title: title,
                        subtitle: subtitle,
                        content: content,
                        file_paths: type === 'images' ? uploadedPaths : [],
                        status: fields.status || 'approved'
                    };
                    db.feedbacks.unshift(finalFb);
                }

                fs.writeFileSync(DB_FILE, JSON.stringify(db, null, 2), 'utf8');
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ success: true, message: 'Feedback saved successfully.', data: finalFb }));
            });
            return;
        }


        if (action === 'approve_feedback') {
            parseRequestBody(req, (fields) => {
                const id = fields.id;
                if (!id) {
                    res.writeHead(400, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ success: false, message: 'Feedback ID is required.' }));
                    return;
                }

                const db = JSON.parse(fs.readFileSync(DB_FILE, 'utf8'));
                if (db.feedbacks) {
                    const foundIndex = db.feedbacks.findIndex(f => String(f.id) === String(id));
                    if (foundIndex !== -1) {
                        db.feedbacks[foundIndex].status = 'approved';
                    } else {
                        res.writeHead(404, { 'Content-Type': 'application/json' });
                        res.end(JSON.stringify({ success: false, message: 'Feedback not found.' }));
                        return;
                    }
                }

                fs.writeFileSync(DB_FILE, JSON.stringify(db, null, 2), 'utf8');
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ success: true, message: 'Feedback approved successfully.' }));
            });
            return;
        }

        if (action === 'reject_feedback') {
            parseRequestBody(req, (fields) => {
                const id = fields.id;
                if (!id) {
                    res.writeHead(400, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ success: false, message: 'Feedback ID is required.' }));
                    return;
                }

                const db = JSON.parse(fs.readFileSync(DB_FILE, 'utf8'));
                if (db.feedbacks) {
                    const foundIndex = db.feedbacks.findIndex(f => String(f.id) === String(id));
                    if (foundIndex !== -1) {
                        db.feedbacks[foundIndex].status = 'rejected';
                    } else {
                        res.writeHead(404, { 'Content-Type': 'application/json' });
                        res.end(JSON.stringify({ success: false, message: 'Feedback not found.' }));
                        return;
                    }
                }

                fs.writeFileSync(DB_FILE, JSON.stringify(db, null, 2), 'utf8');
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ success: true, message: 'Feedback rejected successfully.' }));
            });
            return;
        }

        if (action === 'delete_feedback') {
            parseRequestBody(req, (fields) => {
                const id = fields.id;
                if (!id) {
                    res.writeHead(400, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ success: false, message: 'Feedback ID is required.' }));
                    return;
                }

                const db = JSON.parse(fs.readFileSync(DB_FILE, 'utf8'));
                if (db.feedbacks) {
                    const foundIndex = db.feedbacks.findIndex(f => String(f.id) === String(id));
                    if (foundIndex !== -1) {
                        const filePaths = db.feedbacks[foundIndex].file_paths || [];
                        filePaths.forEach(filePath => {
                            if (filePath && filePath.startsWith('uploads/')) {
                                const fullPath = path.join(__dirname, filePath);
                                if (fs.existsSync(fullPath)) {
                                    try {
                                        fs.unlinkSync(fullPath);
                                    } catch (e) {}
                                }
                            }
                        });
                        db.feedbacks.splice(foundIndex, 1);
                    }
                }

                fs.writeFileSync(DB_FILE, JSON.stringify(db, null, 2), 'utf8');
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ success: true, message: 'Feedback deleted successfully.' }));
            });
            return;
        }

        if (action === 'delete_notice') {
            parseRequestBody(req, (fields) => {
                const noticeId = fields.notice_id;
                const db = JSON.parse(fs.readFileSync(DB_FILE, 'utf8'));
                if (db.section_notices) {
                    const notice = db.section_notices.find(n => String(n.id) === String(noticeId));
                    if (notice) {
                        const oldPaths = notice.file_paths || (notice.file_path ? [notice.file_path] : []);
                        oldPaths.forEach(oldPath => {
                            if (oldPath && oldPath.startsWith('uploads/')) {
                                const fullOldPath = path.join(__dirname, oldPath);
                                if (fs.existsSync(fullOldPath)) {
                                    try {
                                        fs.unlinkSync(fullOldPath);
                                    } catch (e) {}
                                }
                            }
                        });
                    }
                    db.section_notices = db.section_notices.filter(n => String(n.id) !== String(noticeId));
                }
                fs.writeFileSync(DB_FILE, JSON.stringify(db, null, 2), 'utf8');
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ success: true, message: 'Notice deleted successfully.' }));
            });
            return;
        }

        if (action === 'save_chatbot_item') {
            parseRequestBody(req, (fields) => {
                const db = JSON.parse(fs.readFileSync(DB_FILE, 'utf8'));
                if (!db.chatbot_data) db.chatbot_data = [];
                const index = fields.index;
                const queryVal = fields.query || '';
                const keywords = fields.keywords || '';
                const response = fields.response || '';
                
                if (!queryVal || !keywords || !response) {
                    res.writeHead(400, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ success: false, message: 'All fields (Query, Keywords, Response) are required.' }));
                    return;
                }
                
                const item = { query: queryVal, keywords, response };
                
                if (index !== undefined && index !== '') {
                    const idx = parseInt(index, 10);
                    if (idx >= 0 && idx < db.chatbot_data.length) {
                        db.chatbot_data[idx] = item;
                    } else {
                        res.writeHead(400, { 'Content-Type': 'application/json' });
                        res.end(JSON.stringify({ success: false, message: 'Invalid index' }));
                        return;
                    }
                } else {
                    db.chatbot_data.push(item);
                }
                
                fs.writeFileSync(DB_FILE, JSON.stringify(db, null, 2), 'utf8');
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ success: true, message: 'Q&A item saved successfully.', data: db.chatbot_data }));
            });
            return;
        }

        if (action === 'delete_chatbot_item') {
            parseRequestBody(req, (fields) => {
                const db = JSON.parse(fs.readFileSync(DB_FILE, 'utf8'));
                const index = fields.index;
                if (index === undefined || index === '') {
                    res.writeHead(400, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ success: false, message: 'Index is required' }));
                    return;
                }
                const idx = parseInt(index, 10);
                if (db.chatbot_data && idx >= 0 && idx < db.chatbot_data.length) {
                    db.chatbot_data.splice(idx, 1);
                    fs.writeFileSync(DB_FILE, JSON.stringify(db, null, 2), 'utf8');
                    res.writeHead(200, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ success: true, message: 'Q&A item deleted successfully.', data: db.chatbot_data }));
                } else {
                    res.writeHead(400, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ success: false, message: 'Invalid index' }));
                }
            });
            return;
        }

        if (action === 'delete_chat_log') {
            parseRequestBody(req, (fields) => {
                const db = JSON.parse(fs.readFileSync(DB_FILE, 'utf8'));
                const session_id = fields.session_id;
                if (!session_id) {
                    res.writeHead(400, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ success: false, message: 'Session ID is required' }));
                    return;
                }
                if (db.chat_logs) {
                    const originalLength = db.chat_logs.length;
                    db.chat_logs = db.chat_logs.filter(log => log.session_id !== session_id);
                    if (db.chat_logs.length < originalLength) {
                        fs.writeFileSync(DB_FILE, JSON.stringify(db, null, 2), 'utf8');
                        res.writeHead(200, { 'Content-Type': 'application/json' });
                        res.end(JSON.stringify({ success: true, message: 'Chat log deleted successfully.' }));
                        return;
                    }
                }
                res.writeHead(404, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ success: false, message: 'Chat log not found.' }));
            });
            return;
        }

        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: true, message: 'Action mock completed' }));
        return;
    }

    // Serve static files
    let filePath = path.join(__dirname, pathname === '/' ? 'index.html' : decodeURIComponent(pathname));
    
    if (!filePath.startsWith(__dirname)) {
        res.writeHead(403);
        res.end('Forbidden');
        return;
    }

    fs.stat(filePath, (err, stats) => {
        if (err || !stats.isFile()) {
            res.writeHead(404);
            res.end('File not found');
            return;
        }

        const ext = path.extname(filePath).toLowerCase();
        const contentType = MIME_TYPES[ext] || 'application/octet-stream';

        res.writeHead(200, { 
            'Content-Type': contentType,
            'Cache-Control': 'no-cache, no-store, must-revalidate',
            'Pragma': 'no-cache',
            'Expires': '0'
        });
        const stream = fs.createReadStream(filePath);
        stream.pipe(res);
    });
});

server.listen(PORT, () => {
    console.log(`\n======================================================`);
    console.log(` Shri Shikshayatan School local web server is running!`);
    console.log(` Preview URL: http://localhost:${PORT}`);
    console.log(` Admin URL:   http://localhost:${PORT}/admin.html`);
    console.log(`======================================================\n`);
});
