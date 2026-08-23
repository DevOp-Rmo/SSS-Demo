const DEFAULT_HERO_SLIDER = [
    {
        "id": "slide_history",
        "type": "image",
        "media_path": "assets/Banner/hitorybanner.webp",
        "duration_ms": 5000
    },
    {
        "id": "slide_1",
        "type": "image",
        "media_path": "assets/Banner/BANNER_1.jpg",
        "duration_ms": 5000
    },
    {
        "id": "slide_2",
        "type": "image",
        "media_path": "assets/Banner/BANNER_2.jpg",
        "duration_ms": 5000
    },
    {
        "id": "slide_3",
        "type": "image",
        "media_path": "assets/Banner/BANNER_3.jpg",
        "duration_ms": 5000
    },
    {
        "id": "slide_4",
        "type": "image",
        "media_path": "assets/Banner/BANNER_4.jpg",
        "duration_ms": 5000
    },
    {
        "id": "slide_5",
        "type": "image",
        "media_path": "assets/Banner/BANNER_5.jpg",
        "duration_ms": 5000
    },
    {
        "id": "slide_6",
        "type": "image",
        "media_path": "assets/Banner/BANNER_8.jpg",
        "duration_ms": 5000
    },
    {
        "id": "slide_7",
        "type": "image",
        "media_path": "assets/Banner/slider.jpg",
        "duration_ms": 5000
    }
];
// Render Hero Floating Notices (Transparent, Color-Coded, Pulsating / Blinking Glass Capsules)
const DEFAULT_HERO_NOTICES = [
    {
        "id": "hn_1",
        "tag": "CLASS XI ADMISSION (2027-28)",
        "title": "Online Application Portal for XI Admission (Non-SSY)",
        "subtitle": "Active: 25th July, 2026 to 11th Sep, 2026",
        "link_url": "notice-class-xi-non-ssy.html",
        "link_target": "_self",
        "color_theme": "cyan",
        "is_blinking": true,
        "is_active": true,
        "order": 1
    },
    {
        "id": "hn_2",
        "tag": "NURSERY - CLASS V (2027-28)",
        "title": "Online Application Forms for Nursery to Class V",
        "subtitle": "Helpline: +91 8100975564, +91 8100975565",
        "link_url": "notice-nursery-to-v.html",
        "link_target": "_self",
        "color_theme": "purple",
        "is_blinking": true,
        "is_active": true,
        "order": 2
    },
    {
        "id": "hn_3",
        "tag": "OLYMPIAD",
        "title": "Olympiad Registration Junior Section (LKG - V)",
        "subtitle": "Silverzone Olympiad Registration Open",
        "link_url": "https://r.silverzone.org/188963",
        "link_target": "_blank",
        "color_theme": "teal",
        "is_blinking": false,
        "is_active": true,
        "order": 3
    },
    {
        "id": "hn_4",
        "tag": "LIVE SURVEY",
        "title": "Survey Link for Education World School Ranking",
        "subtitle": "Participate in School Ranking Survey",
        "link_url": "https://www.surveymonkey.com/r/GIRLS-DAY",
        "link_target": "_blank",
        "color_theme": "gold",
        "is_blinking": true,
        "is_active": true,
        "order": 4
    },
    {
        "id": "hn_5",
        "tag": "FEE HELPLINE",
        "title": "Fee Related Queries Contact: Mr. Arnab — (033) 2282-6350",
        "subtitle": "Junior & Senior Section Fee Schedules",
        "link_url": "fee-structure.html",
        "link_target": "_self",
        "custom_actions": [
            {
                "label": "Junior Sec. Fees",
                "url": "assets/FEESTRUCTURE-2026-2027-JUNIOR.pdf"
            },
            {
                "label": "Senior Sec. Fees",
                "url": "assets/FEESTRUCTURE-2026-2027-SENIOR.pdf"
            }
        ],
        "color_theme": "lime",
        "is_blinking": false,
        "is_active": true,
        "order": 5
    }
];

function renderHeroNotices(notices) {
    const container = document.getElementById('hero-notices-container');
    if (!container) return;
    container.innerHTML = '';

    const list = Array.isArray(notices) && notices.length > 0 ? notices : DEFAULT_HERO_NOTICES;
    const activeNotices = list.filter(n => n.is_active !== false);
    if (activeNotices.length === 0) return;

    // Sort by order if available
    activeNotices.sort((a, b) => (a.order || 0) - (b.order || 0));

    activeNotices.forEach(item => {
        const theme = item.color_theme || 'cyan';
        const isBlink = item.is_blinking !== false ? `pulse-${theme}` : '';
        const target = item.link_target || '_self';
        const isExt = target === '_blank' || (item.link_url && item.link_url.startsWith('http'));
        const arrowIcon = isExt ? '<i class="ph-bold ph-arrow-square-out notice-arrow"></i>' : '<i class="ph-bold ph-arrow-up-right notice-arrow"></i>';
        
        const card = document.createElement('a');
        card.href = item.link_url || '#';
        card.target = target;
        card.className = `hero-glass-pill pill-${theme} ${isBlink}`;
        
        let customActionsHtml = '';
        if (Array.isArray(item.custom_actions) && item.custom_actions.length > 0) {
            customActionsHtml = '<div class="fee-pill-btns">' + 
                item.custom_actions.map(act => `<a href="${act.url}" target="_blank" class="fee-action-pill" onclick="event.stopPropagation();">${escapeHtml(act.label)}</a>`).join('') +
                '</div>';
        }

        let tagHtml = item.tag ? `<span class="pill-badge badge-${theme}">${escapeHtml(item.tag)}</span>` : '';
        let subtitleHtml = item.subtitle ? `<div class="pill-sub-text">${escapeHtml(item.subtitle)}</div>` : '';

        card.innerHTML = `
            <div class="pill-header-row">
                ${tagHtml}
                ${!customActionsHtml ? arrowIcon : ''}
            </div>
            <h4 class="pill-main-text">${escapeHtml(item.title)}</h4>
            ${subtitleHtml}
            ${customActionsHtml}
        `;

        container.appendChild(card);
    });
}


document.addEventListener('DOMContentLoaded', () => {
    // Visitor Counter implementation
    function initVisitorCounter() {
        const counterEl = document.querySelector('.visitor-counter');
        if (!counterEl) return;

        const isLocal = window.location.protocol === 'file:';
        const visitedSession = sessionStorage.getItem('visited_session') === 'true';

        function formatCount(num) {
            return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        }

        function updateUI(num) {
            const formatted = formatCount(num);
            let digitsHtml = '';
            for (let char of formatted) {
                digitsHtml += `<span class="visitor-digit">${char}</span>`;
            }
            counterEl.innerHTML = `
                <p style="margin: 0 0 0.5rem 0; font-size: 0.75rem; color: rgba(255,255,255,0.6); text-transform: uppercase; letter-spacing: 1.5px; font-weight: 600;">VISITOR COUNTER</p>
                <div class="visitor-digits-box">
                    ${digitsHtml}
                </div>
                <p style="margin: 0.5rem 0 0 0; font-size: 0.65rem; color: rgba(255,255,255,0.45); letter-spacing: 1px; text-transform: uppercase;">Shri Shikshayatan School</p>
            `;
        }

        if (isLocal) {
            let currentCount = parseInt(localStorage.getItem('school_visitor_count'), 10);
            if (isNaN(currentCount)) {
                currentCount = 1426192;
            }
            if (!visitedSession) {
                currentCount++;
                localStorage.setItem('school_visitor_count', currentCount);
                sessionStorage.setItem('visited_session', 'true');
            }
            updateUI(currentCount);
        } else {
            const endpoint = visitedSession ? 'api.php?action=get_visitor_count' : 'api.php?action=increment_visitor_count';
            fetch(endpoint)
            .then(res => res.json())
            .then(data => {
                if (data && data.visitor_count) {
                    sessionStorage.setItem('visited_session', 'true');
                    updateUI(data.visitor_count);
                }
            })
            .catch(err => {
                console.error("Error updating visitor counter:", err);
                updateUI(1426192);
            });
        }
    }
    initVisitorCounter();

    // 1d. Initialize Help Desk Chatbot (Initialize early to avoid being skipped by the local file return)
    initChatbot();

    // 1d-2. Initialize Homepage Notice Board
    initIndexNoticeBoard();

    // 1e. Dynamic Header Height Observer for positioning the sticky sidebar
    const headerWrapper = document.querySelector('.fixed-header-wrapper');
    if (headerWrapper && typeof ResizeObserver !== 'undefined') {
        const resizeObserver = new ResizeObserver(entries => {
            for (let entry of entries) {
                const height = entry.target.offsetHeight;
                document.documentElement.style.setProperty('--header-height', height + 'px');
            }
        });
        resizeObserver.observe(headerWrapper);
    } else if (headerWrapper) {
        const updateHeight = () => {
            document.documentElement.style.setProperty('--header-height', headerWrapper.offsetHeight + 'px');
        };
        window.addEventListener('resize', updateHeight);
        window.addEventListener('load', updateHeight);
        updateHeight();
    }

    // 1. Smooth scrolling for navigation links
    document.querySelectorAll('a.scroll-link').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId && targetId.startsWith('#')) {
                const targetElement = document.querySelector(targetId);
                if (targetElement) {
                    targetElement.scrollIntoView({
                        behavior: 'smooth'
                    });
                }
            }
        });
    });

    // 1b. Mobile Navigation Menu Toggle
    const mobileToggle = document.getElementById('mobile-nav-toggle');
    const navLinks = document.querySelector('.nav-links');
    const topDropdown = document.querySelector('.top-dropdown');
    
    if (mobileToggle && navLinks) {
        mobileToggle.addEventListener('click', (e) => {
            e.stopPropagation();
            navLinks.classList.toggle('active');
            const icon = mobileToggle.querySelector('i');
            if (icon) {
                if (navLinks.classList.contains('active')) {
                    icon.className = 'ph ph-x';
                } else {
                    icon.className = 'ph ph-list';
                }
            }
        });
    }

    // Toggle top-dropdown on click for mobile/touch devices
    if (topDropdown) {
        const topLink = topDropdown.querySelector('.top-link');
        if (topLink) {
            topLink.addEventListener('click', function(e) {
                if (window.innerWidth <= 768) {
                    e.preventDefault();
                    e.stopPropagation();
                    topDropdown.classList.toggle('active');
                }
            });
        }
    }

    // Close mobile menu & top dropdown when clicking outside
    document.addEventListener('click', (e) => {
        if (navLinks && mobileToggle && !navLinks.contains(e.target) && !mobileToggle.contains(e.target)) {
            navLinks.classList.remove('active');
            const icon = mobileToggle.querySelector('i');
            if (icon) {
                icon.className = 'ph ph-list';
            }
        }
        if (topDropdown && !topDropdown.contains(e.target)) {
            topDropdown.classList.remove('active');
        }
    });

    // 1c. Expandable Dropdowns on Mobile
    document.querySelectorAll('.nav-links li.dropdown > a').forEach(dropdownLink => {
        dropdownLink.addEventListener('click', function(e) {
            // Only toggle on mobile viewports (<= 768px)
            if (window.innerWidth <= 768) {
                e.preventDefault();
                e.stopPropagation();
                const parentLi = this.parentElement;
                
                // Toggle active class on this parent
                parentLi.classList.toggle('active');
                
                // Close other dropdowns at the same level
                const siblings = parentLi.parentElement.children;
                for (let sibling of siblings) {
                    if (sibling !== parentLi && sibling.classList.contains('dropdown')) {
                        sibling.classList.remove('active');
                    }
                }
            }
        });
    });

    // 2. Fetch and render dynamic database content
    const isLocalFile = window.location.protocol === 'file:' || window.location.hostname.includes('github.io') || window.location.hostname.includes('github.dev') || window.location.search.includes('demo=true');
    if (isLocalFile) {
        // Load from localStorage or use fallback default local data
        const stored = localStorage.getItem('school_db_data');
        let data = null;
        if (stored) {
            try {
                data = JSON.parse(stored);
                if (!data.hero_slider || data.hero_slider.length < 8 || !data.hero_slider[0].media_path.includes('hitorybanner') || !data.section_notices || data.section_notices[0]?.id !== 'wp_notice_53' || data.section_notices[1]?.title !== 'Congratulations') {
                    data.hero_slider = DEFAULT_HERO_SLIDER;
                    if (typeof getDefaultLocalNotices === 'function') {
                        data.section_notices = getDefaultLocalNotices();
                    }
                    localStorage.setItem('school_db_data', JSON.stringify(data));
                }
            } catch(e) {}
        }
        if (!data) {
            // Default local fallback data structure for offline previewing
            data = {
                "ticker": [
                    "ADMISSIONS OPEN FOR 2026-27 SESSION [LOCAL OFFLINE DEMO]",
                    "NEW MOBILE APP LAUNCHED FOR PARENTS",
                    "SHRI SHIKSHAYATAN RANKS TOP IN BOARD RESULTS",
                    "UPCOMING INTER-SCHOOL EVENTS"
                ],
                "hero_slider": [
    {
        "id": "slide_history",
        "type": "image",
        "media_path": "assets/Banner/hitorybanner.webp",
        "duration_ms": 5000
    },
    {
        "id": "slide_1",
        "type": "image",
        "media_path": "assets/Banner/BANNER_1.jpg",
        "duration_ms": 5000
    },
    {
        "id": "slide_2",
        "type": "image",
        "media_path": "assets/Banner/BANNER_2.jpg",
        "duration_ms": 5000
    },
    {
        "id": "slide_3",
        "type": "image",
        "media_path": "assets/Banner/BANNER_3.jpg",
        "duration_ms": 5000
    },
    {
        "id": "slide_4",
        "type": "image",
        "media_path": "assets/Banner/BANNER_4.jpg",
        "duration_ms": 5000
    },
    {
        "id": "slide_5",
        "type": "image",
        "media_path": "assets/Banner/BANNER_5.jpg",
        "duration_ms": 5000
    },
    {
        "id": "slide_6",
        "type": "image",
        "media_path": "assets/Banner/BANNER_8.jpg",
        "duration_ms": 5000
    },
    {
        "id": "slide_7",
        "type": "image",
        "media_path": "assets/Banner/slider.jpg",
        "duration_ms": 5000
    }
],
                "hall_of_fame": {
                    "board_results": {
                        "image_path": "assets/20260622International-Yoga-Day-at-Red-Road.jpeg",
                        "subtitle": "AISSE & AISSCE PERFORMANCE 2025 [DEMO]"
                    },
                    "competitive_exam": {
                        "image_path": "assets/20260622International-Yoga-Day-at-Red-Road.jpeg",
                        "subtitle": "JEE, NEET & OLYMPIAD QUALIFIERS [DEMO]"
                    }
                },
                "awards": [
                    { "id": "1", "title": "AWARD 1", "image_path": "assets/award1.jpg" },
                    { "id": "2", "title": "AWARD 2", "image_path": "assets/award2.jpg" },
                    { "id": "3", "title": "AWARD 3", "image_path": "assets/award3.jpg" },
                    { "id": "4", "title": "AWARD 4", "image_path": "assets/award4.jpg" }
                ],
                "bulletin": [
                    {
                        "id": "1",
                        "title": "STUDENT PERSPECTIVES",
                        "content": "<p>This is a local demo post for Student Perspectives.</p>",
                        "image_path": "",
                        "created_at": new Date().toISOString()
                    },
                    {
                        "id": "2",
                        "title": "FACULTY INSIGHTS",
                        "content": "<p>This is a local demo post for Faculty Insights.</p>",
                        "image_path": "",
                        "created_at": "2026-05-01T12:00:00Z"
                    },
                    {
                        "id": "3",
                        "title": "CAMPUS LIFE CHRONICLES",
                        "content": "<p>This is a local demo post for Campus Life Chronicles.</p>",
                        "image_path": "",
                        "created_at": new Date().toISOString()
                    },
                    {
                        "id": "4",
                        "title": "ALUMNI JOURNEYS",
                        "content": "<p>This is a local demo post for Alumni Journeys.</p>",
                        "image_path": "",
                        "created_at": "2026-05-01T12:00:00Z"
                    }
                ],
                "section_notices": [
                {
                    "id": "sn_1",
                    "section": "junior",
                    "class": "Class I",
                    "category": "holiday",
                    "date": "2026-06-06",
                    "title": "Class I - Summer Vacation Holidays",
                    "content": "<p>Dear Parents, this is to inform you that summer vacation holidays will commence shortly. Please ensure students complete their holiday homework assignments.</p>",
                    "file_path": "data:application/pdf;base64,JVBERi0xLjQKMSAwIG9iagogIDw8CiAgICAvVHlwZSAvQ2F0YWxvZwogICAgL1BhZ2VzIDIgMCBSCgogID4+CmVuZG9iagoyIDAgb2JqCiAgPDwKICAgIC9UeXBlIC9QYWdlcwogICAgL0tpZHMgWzMgMCBSXQogICAgL0NvdW50IDEKICA+PgplbmRvYmoKMyAwIG9iagogIDw8CiAgICAvVHlwZSAvUGFnZQogICAgL1BhcmVudCAyIDAgUgogICAgL01lZGlhQm94IFswIDAgNTk1IDg0Ml0KICAgIC9SZXNvdXJjZXMgPDwKICAgICAgL0ZvbnQgPDwKICAgICAgICAvRjEgNCAwIFIKICAgICAgPj4KICAgID4+CiAgICAvQ29udGVudHMgNSAwIFIKICA+PgplbmRvYmoKNCAwIG9iagogIDw8CiAgICAvVHlwZSAvRm9udAogICAgL1N1YnR5cGUgL1R5cGUxCiAgICAvQmFzZUZvbnQgL0hlbHZldGljYQogID4+CmVuZG9iago1IDAgb2JqCiAgPDwKICAgIC9MZW5ndGggNTEKICA+PgpzdHJlYW0KQlQKICAvRjEgMjQgVGYKICA3MCA3MDAgVGQKICAoU2hyaSBTaGlrc2hheWF0YW4gU2Nob29sIE5vdGljZSkgVGoKRVQKZW5kc3RyZWFtCmVuZG9iagp4cmVmCjAgNgowMDAwMDAwMDAwIDY1NTM1IGYgCjAwMDAwMDAwMTUgMDAwMDAgbiAKMDAwMDAwMDA3NCAwMDAwMCBuIAowMDAwMDAwMTMxIDAwMDAwIG4gCjAwMDAwMDAyNjMgMDAwMDAgbiAKMDAwMDAwMDMzNiAwMDAwMCBuIAp0cmFpbGVyCiAgPDwKICAgIC9TaXplIDYKICAgIC9Sb290IDEgMCBSCgogID4+CnN0YXJ0eHJlZgogIDQzOApfX0VPRgo="
                },
                {
                    "id": "sn_2",
                    "section": "junior",
                    "class": "Class I",
                    "category": "holiday",
                    "date": "2026-06-05",
                    "title": "Class I - Durga Puja & Festive Break",
                    "content": "<p>The school will remain closed on account of Durga Puja and Dussehra celebrations. Regular classes will resume after the break.</p>",
                    "file_path": ""
                },
                {
                    "id": "sn_3",
                    "section": "junior",
                    "class": "Class I",
                    "category": "holiday",
                    "date": "2026-06-04",
                    "title": "Class I - Winter Holidays Announcement",
                    "content": "<p>School will be closed for winter holidays. We wish all our students and their families a warm and happy holiday season.</p>",
                    "file_path": ""
                },
                {
                    "id": "sn_4",
                    "section": "junior",
                    "class": "Class I",
                    "category": "admission",
                    "date": "2026-05-28",
                    "title": "Class I - Admission Guidelines for Next Session",
                    "content": "<p>The registration link and detailed checklist for next term admissions are now available. Kindly submit the documents before the deadline.</p>",
                    "file_path": ""
                },
                {
                    "id": "sn_5",
                    "section": "junior",
                    "class": "Class I",
                    "category": "admission",
                    "date": "2026-05-20",
                    "title": "Class I - Interaction Schedule & Shortlisted List",
                    "content": "<p>Shortlisted student interaction lists have been updated. Please check the timings slot and arrive 15 minutes early.</p>",
                    "file_path": ""
                },
                {
                    "id": "sn_6",
                    "section": "junior",
                    "class": "Class I",
                    "category": "admission",
                    "date": "2026-05-15",
                    "title": "Class I - Document Verification Deadline Notice",
                    "content": "<p>Final call for pending document submissions for new admission enrollments. Documents must be verified by the admin office.</p>",
                    "file_path": ""
                },
                {
                    "id": "sn_7",
                    "section": "junior",
                    "class": "Class I",
                    "category": "exam",
                    "date": "2026-05-02",
                    "title": "Class I - First Term Examination Timetable",
                    "content": "<p>The schedule and syllabus details for the upcoming First Term assessment have been released. Examinations commence next week.</p>",
                    "file_path": ""
                },
                {
                    "id": "sn_8",
                    "section": "junior",
                    "class": "Class I",
                    "category": "exam",
                    "date": "2026-04-25",
                    "title": "Class I - Unit Test Datesheet Release",
                    "content": "<p>Please find the unit test schedule attached. Attendance is mandatory for all scheduled assessments.</p>",
                    "file_path": ""
                },
                {
                    "id": "sn_9",
                    "section": "junior",
                    "class": "Class I",
                    "category": "exam",
                    "date": "2026-04-18",
                    "title": "Class I - Mock Tests & Revision Schedule",
                    "content": "<p>Special mock test classes and revision sessions are scheduled to help students prepare for their final board exams.</p>",
                    "file_path": ""
                },
                {
                    "id": "sn_10",
                    "section": "junior",
                    "class": "Class I",
                    "category": "exam",
                    "date": "2026-04-10",
                    "title": "Class I - Report Card Parent-Teacher Meeting",
                    "content": "<p>The PTM for reviewing exam performance and distributing report cards is scheduled. Parents must attend along with their ward.</p>",
                    "file_path": ""
                },
                {
                    "id": "sn_11",
                    "section": "junior",
                    "class": "Class II",
                    "category": "holiday",
                    "date": "2026-06-06",
                    "title": "Class II - Summer Vacation Holidays",
                    "content": "<p>Dear Parents, this is to inform you that summer vacation holidays will commence shortly. Please ensure students complete their holiday homework assignments.</p>",
                    "file_path": ""
                },
                {
                    "id": "sn_12",
                    "section": "junior",
                    "class": "Class II",
                    "category": "holiday",
                    "date": "2026-06-05",
                    "title": "Class II - Durga Puja & Festive Break",
                    "content": "<p>The school will remain closed on account of Durga Puja and Dussehra celebrations. Regular classes will resume after the break.</p>",
                    "file_path": ""
                },
                {
                    "id": "sn_13",
                    "section": "junior",
                    "class": "Class II",
                    "category": "holiday",
                    "date": "2026-06-04",
                    "title": "Class II - Winter Holidays Announcement",
                    "content": "<p>School will be closed for winter holidays. We wish all our students and their families a warm and happy holiday season.</p>",
                    "file_path": ""
                },
                {
                    "id": "sn_14",
                    "section": "junior",
                    "class": "Class II",
                    "category": "admission",
                    "date": "2026-05-28",
                    "title": "Class II - Admission Guidelines for Next Session",
                    "content": "<p>The registration link and detailed checklist for next term admissions are now available. Kindly submit the documents before the deadline.</p>",
                    "file_path": ""
                },
                {
                    "id": "sn_15",
                    "section": "junior",
                    "class": "Class II",
                    "category": "admission",
                    "date": "2026-05-20",
                    "title": "Class II - Interaction Schedule & Shortlisted List",
                    "content": "<p>Shortlisted student interaction lists have been updated. Please check the timings slot and arrive 15 minutes early.</p>",
                    "file_path": ""
                },
                {
                    "id": "sn_16",
                    "section": "junior",
                    "class": "Class II",
                    "category": "admission",
                    "date": "2026-05-15",
                    "title": "Class II - Document Verification Deadline Notice",
                    "content": "<p>Final call for pending document submissions for new admission enrollments. Documents must be verified by the admin office.</p>",
                    "file_path": ""
                },
                {
                    "id": "sn_17",
                    "section": "junior",
                    "class": "Class II",
                    "category": "exam",
                    "date": "2026-05-02",
                    "title": "Class II - First Term Examination Timetable",
                    "content": "<p>The schedule and syllabus details for the upcoming First Term assessment have been released. Examinations commence next week.</p>",
                    "file_path": ""
                },
                {
                    "id": "sn_18",
                    "section": "junior",
                    "class": "Class II",
                    "category": "exam",
                    "date": "2026-04-25",
                    "title": "Class II - Unit Test Datesheet Release",
                    "content": "<p>Please find the unit test schedule attached. Attendance is mandatory for all scheduled assessments.</p>",
                    "file_path": ""
                },
                {
                    "id": "sn_19",
                    "section": "junior",
                    "class": "Class II",
                    "category": "exam",
                    "date": "2026-04-18",
                    "title": "Class II - Mock Tests & Revision Schedule",
                    "content": "<p>Special mock test classes and revision sessions are scheduled to help students prepare for their final board exams.</p>",
                    "file_path": ""
                },
                {
                    "id": "sn_20",
                    "section": "junior",
                    "class": "Class II",
                    "category": "exam",
                    "date": "2026-04-10",
                    "title": "Class II - Report Card Parent-Teacher Meeting",
                    "content": "<p>The PTM for reviewing exam performance and distributing report cards is scheduled. Parents must attend along with their ward.</p>",
                    "file_path": ""
                },
                {
                    "id": "sn_21",
                    "section": "junior",
                    "class": "Class III",
                    "category": "holiday",
                    "date": "2026-06-06",
                    "title": "Class III - Summer Vacation Holidays",
                    "content": "<p>Dear Parents, this is to inform you that summer vacation holidays will commence shortly. Please ensure students complete their holiday homework assignments.</p>",
                    "file_path": ""
                },
                {
                    "id": "sn_22",
                    "section": "junior",
                    "class": "Class III",
                    "category": "holiday",
                    "date": "2026-06-05",
                    "title": "Class III - Durga Puja & Festive Break",
                    "content": "<p>The school will remain closed on account of Durga Puja and Dussehra celebrations. Regular classes will resume after the break.</p>",
                    "file_path": ""
                },
                {
                    "id": "sn_23",
                    "section": "junior",
                    "class": "Class III",
                    "category": "holiday",
                    "date": "2026-06-04",
                    "title": "Class III - Winter Holidays Announcement",
                    "content": "<p>School will be closed for winter holidays. We wish all our students and their families a warm and happy holiday season.</p>",
                    "file_path": ""
                },
                {
                    "id": "sn_24",
                    "section": "junior",
                    "class": "Class III",
                    "category": "admission",
                    "date": "2026-05-28",
                    "title": "Class III - Admission Guidelines for Next Session",
                    "content": "<p>The registration link and detailed checklist for next term admissions are now available. Kindly submit the documents before the deadline.</p>",
                    "file_path": ""
                },
                {
                    "id": "sn_25",
                    "section": "junior",
                    "class": "Class III",
                    "category": "admission",
                    "date": "2026-05-20",
                    "title": "Class III - Interaction Schedule & Shortlisted List",
                    "content": "<p>Shortlisted student interaction lists have been updated. Please check the timings slot and arrive 15 minutes early.</p>",
                    "file_path": ""
                },
                {
                    "id": "sn_26",
                    "section": "junior",
                    "class": "Class III",
                    "category": "admission",
                    "date": "2026-05-15",
                    "title": "Class III - Document Verification Deadline Notice",
                    "content": "<p>Final call for pending document submissions for new admission enrollments. Documents must be verified by the admin office.</p>",
                    "file_path": ""
                },
                {
                    "id": "sn_27",
                    "section": "junior",
                    "class": "Class III",
                    "category": "exam",
                    "date": "2026-05-02",
                    "title": "Class III - First Term Examination Timetable",
                    "content": "<p>The schedule and syllabus details for the upcoming First Term assessment have been released. Examinations commence next week.</p>",
                    "file_path": ""
                },
                {
                    "id": "sn_28",
                    "section": "junior",
                    "class": "Class III",
                    "category": "exam",
                    "date": "2026-04-25",
                    "title": "Class III - Unit Test Datesheet Release",
                    "content": "<p>Please find the unit test schedule attached. Attendance is mandatory for all scheduled assessments.</p>",
                    "file_path": ""
                },
                {
                    "id": "sn_29",
                    "section": "junior",
                    "class": "Class III",
                    "category": "exam",
                    "date": "2026-04-18",
                    "title": "Class III - Mock Tests & Revision Schedule",
                    "content": "<p>Special mock test classes and revision sessions are scheduled to help students prepare for their final board exams.</p>",
                    "file_path": ""
                },
                {
                    "id": "sn_30",
                    "section": "junior",
                    "class": "Class III",
                    "category": "exam",
                    "date": "2026-04-10",
                    "title": "Class III - Report Card Parent-Teacher Meeting",
                    "content": "<p>The PTM for reviewing exam performance and distributing report cards is scheduled. Parents must attend along with their ward.</p>",
                    "file_path": ""
                },
                {
                    "id": "sn_31",
                    "section": "junior",
                    "class": "Class IV",
                    "category": "holiday",
                    "date": "2026-06-06",
                    "title": "Class IV - Summer Vacation Holidays",
                    "content": "<p>Dear Parents, this is to inform you that summer vacation holidays will commence shortly. Please ensure students complete their holiday homework assignments.</p>",
                    "file_path": ""
                },
                {
                    "id": "sn_32",
                    "section": "junior",
                    "class": "Class IV",
                    "category": "holiday",
                    "date": "2026-06-05",
                    "title": "Class IV - Durga Puja & Festive Break",
                    "content": "<p>The school will remain closed on account of Durga Puja and Dussehra celebrations. Regular classes will resume after the break.</p>",
                    "file_path": ""
                },
                {
                    "id": "sn_33",
                    "section": "junior",
                    "class": "Class IV",
                    "category": "holiday",
                    "date": "2026-06-04",
                    "title": "Class IV - Winter Holidays Announcement",
                    "content": "<p>School will be closed for winter holidays. We wish all our students and their families a warm and happy holiday season.</p>",
                    "file_path": ""
                },
                {
                    "id": "sn_34",
                    "section": "junior",
                    "class": "Class IV",
                    "category": "admission",
                    "date": "2026-05-28",
                    "title": "Class IV - Admission Guidelines for Next Session",
                    "content": "<p>The registration link and detailed checklist for next term admissions are now available. Kindly submit the documents before the deadline.</p>",
                    "file_path": ""
                },
                {
                    "id": "sn_35",
                    "section": "junior",
                    "class": "Class IV",
                    "category": "admission",
                    "date": "2026-05-20",
                    "title": "Class IV - Interaction Schedule & Shortlisted List",
                    "content": "<p>Shortlisted student interaction lists have been updated. Please check the timings slot and arrive 15 minutes early.</p>",
                    "file_path": ""
                },
                {
                    "id": "sn_36",
                    "section": "junior",
                    "class": "Class IV",
                    "category": "admission",
                    "date": "2026-05-15",
                    "title": "Class IV - Document Verification Deadline Notice",
                    "content": "<p>Final call for pending document submissions for new admission enrollments. Documents must be verified by the admin office.</p>",
                    "file_path": ""
                },
                {
                    "id": "sn_37",
                    "section": "junior",
                    "class": "Class IV",
                    "category": "exam",
                    "date": "2026-05-02",
                    "title": "Class IV - First Term Examination Timetable",
                    "content": "<p>The schedule and syllabus details for the upcoming First Term assessment have been released. Examinations commence next week.</p>",
                    "file_path": ""
                },
                {
                    "id": "sn_38",
                    "section": "junior",
                    "class": "Class IV",
                    "category": "exam",
                    "date": "2026-04-25",
                    "title": "Class IV - Unit Test Datesheet Release",
                    "content": "<p>Please find the unit test schedule attached. Attendance is mandatory for all scheduled assessments.</p>",
                    "file_path": ""
                },
                {
                    "id": "sn_39",
                    "section": "junior",
                    "class": "Class IV",
                    "category": "exam",
                    "date": "2026-04-18",
                    "title": "Class IV - Mock Tests & Revision Schedule",
                    "content": "<p>Special mock test classes and revision sessions are scheduled to help students prepare for their final board exams.</p>",
                    "file_path": ""
                },
                {
                    "id": "sn_40",
                    "section": "junior",
                    "class": "Class IV",
                    "category": "exam",
                    "date": "2026-04-10",
                    "title": "Class IV - Report Card Parent-Teacher Meeting",
                    "content": "<p>The PTM for reviewing exam performance and distributing report cards is scheduled. Parents must attend along with their ward.</p>",
                    "file_path": ""
                },
                {
                    "id": "sn_41",
                    "section": "junior",
                    "class": "Class V",
                    "category": "holiday",
                    "date": "2026-06-06",
                    "title": "Class V - Summer Vacation Holidays",
                    "content": "<p>Dear Parents, this is to inform you that summer vacation holidays will commence shortly. Please ensure students complete their holiday homework assignments.</p>",
                    "file_path": ""
                },
                {
                    "id": "sn_42",
                    "section": "junior",
                    "class": "Class V",
                    "category": "holiday",
                    "date": "2026-06-05",
                    "title": "Class V - Durga Puja & Festive Break",
                    "content": "<p>The school will remain closed on account of Durga Puja and Dussehra celebrations. Regular classes will resume after the break.</p>",
                    "file_path": ""
                },
                {
                    "id": "sn_43",
                    "section": "junior",
                    "class": "Class V",
                    "category": "holiday",
                    "date": "2026-06-04",
                    "title": "Class V - Winter Holidays Announcement",
                    "content": "<p>School will be closed for winter holidays. We wish all our students and their families a warm and happy holiday season.</p>",
                    "file_path": ""
                },
                {
                    "id": "sn_44",
                    "section": "junior",
                    "class": "Class V",
                    "category": "admission",
                    "date": "2026-05-28",
                    "title": "Class V - Admission Guidelines for Next Session",
                    "content": "<p>The registration link and detailed checklist for next term admissions are now available. Kindly submit the documents before the deadline.</p>",
                    "file_path": ""
                },
                {
                    "id": "sn_45",
                    "section": "junior",
                    "class": "Class V",
                    "category": "admission",
                    "date": "2026-05-20",
                    "title": "Class V - Interaction Schedule & Shortlisted List",
                    "content": "<p>Shortlisted student interaction lists have been updated. Please check the timings slot and arrive 15 minutes early.</p>",
                    "file_path": ""
                },
                {
                    "id": "sn_46",
                    "section": "junior",
                    "class": "Class V",
                    "category": "admission",
                    "date": "2026-05-15",
                    "title": "Class V - Document Verification Deadline Notice",
                    "content": "<p>Final call for pending document submissions for new admission enrollments. Documents must be verified by the admin office.</p>",
                    "file_path": ""
                },
                {
                    "id": "sn_47",
                    "section": "junior",
                    "class": "Class V",
                    "category": "exam",
                    "date": "2026-05-02",
                    "title": "Class V - First Term Examination Timetable",
                    "content": "<p>The schedule and syllabus details for the upcoming First Term assessment have been released. Examinations commence next week.</p>",
                    "file_path": ""
                },
                {
                    "id": "sn_48",
                    "section": "junior",
                    "class": "Class V",
                    "category": "exam",
                    "date": "2026-04-25",
                    "title": "Class V - Unit Test Datesheet Release",
                    "content": "<p>Please find the unit test schedule attached. Attendance is mandatory for all scheduled assessments.</p>",
                    "file_path": ""
                },
                {
                    "id": "sn_49",
                    "section": "junior",
                    "class": "Class V",
                    "category": "exam",
                    "date": "2026-04-18",
                    "title": "Class V - Mock Tests & Revision Schedule",
                    "content": "<p>Special mock test classes and revision sessions are scheduled to help students prepare for their final board exams.</p>",
                    "file_path": ""
                },
                {
                    "id": "sn_50",
                    "section": "junior",
                    "class": "Class V",
                    "category": "exam",
                    "date": "2026-04-10",
                    "title": "Class V - Report Card Parent-Teacher Meeting",
                    "content": "<p>The PTM for reviewing exam performance and distributing report cards is scheduled. Parents must attend along with their ward.</p>",
                    "file_path": ""
                },
                {
                    "id": "sn_51",
                    "section": "senior",
                    "class": "Class VI",
                    "category": "holiday",
                    "date": "2026-06-06",
                    "title": "Class VI - Summer Vacation Holidays",
                    "content": "<p>Dear Parents, this is to inform you that summer vacation holidays will commence shortly. Please ensure students complete their holiday homework assignments.</p>",
                    "file_path": "data:application/pdf;base64,JVBERi0xLjQKMSAwIG9iagogIDw8CiAgICAvVHlwZSAvQ2F0YWxvZwogICAgL1BhZ2VzIDIgMCBSCgogID4+CmVuZG9iagoyIDAgb2JqCiAgPDwKICAgIC9UeXBlIC9QYWdlcwogICAgL0tpZHMgWzMgMCBSXQogICAgL0NvdW50IDEKICA+PgplbmRvYmoKMyAwIG9iagogIDw8CiAgICAvVHlwZSAvUGFnZQogICAgL1BhcmVudCAyIDAgUgogICAgL01lZGlhQm94IFswIDAgNTk1IDg0Ml0KICAgIC9SZXNvdXJjZXMgPDwKICAgICAgL0ZvbnQgPDwKICAgICAgICAvRjEgNCAwIFIKICAgICAgPj4KICAgID4+CiAgICAvQ29udGVudHMgNSAwIFIKICA+PgplbmRvYmoKNCAwIG9iagogIDw8CiAgICAvVHlwZSAvRm9udAogICAgL1N1YnR5cGUgL1R5cGUxCiAgICAvQmFzZUZvbnQgL0hlbHZldGljYQogID4+CmVuZG9iago1IDAgb2JqCiAgPDwKICAgIC9MZW5ndGggNTEKICA+PgpzdHJlYW0KQlQKICAvRjEgMjQgVGYKICA3MCA3MDAgVGQKICAoU2hyaSBTaGlrc2hheWF0YW4gU2Nob29sIE5vdGljZSkgVGoKRVQKZW5kc3RyZWFtCmVuZG9iagp4cmVmCjAgNgowMDAwMDAwMDAwIDY1NTM1IGYgCjAwMDAwMDAwMTUgMDAwMDAgbiAKMDAwMDAwMDA3NCAwMDAwMCBuIAowMDAwMDAwMTMxIDAwMDAwIG4gCjAwMDAwMDAyNjMgMDAwMDAgbiAKMDAwMDAwMDMzNiAwMDAwMCBuIAp0cmFpbGVyCiAgPDwKICAgIC9TaXplIDYKICAgIC9Sb290IDEgMCBSCgogID4+CnN0YXJ0eHJlZgogIDQzOApfX0VPRgo="
                },
                {
                    "id": "sn_52",
                    "section": "senior",
                    "class": "Class VI",
                    "category": "holiday",
                    "date": "2026-06-05",
                    "title": "Class VI - Durga Puja & Festive Break",
                    "content": "<p>The school will remain closed on account of Durga Puja and Dussehra celebrations. Regular classes will resume after the break.</p>",
                    "file_path": ""
                },
                {
                    "id": "sn_53",
                    "section": "senior",
                    "class": "Class VI",
                    "category": "holiday",
                    "date": "2026-06-04",
                    "title": "Class VI - Winter Holidays Announcement",
                    "content": "<p>School will be closed for winter holidays. We wish all our students and their families a warm and happy holiday season.</p>",
                    "file_path": ""
                },
                {
                    "id": "sn_54",
                    "section": "senior",
                    "class": "Class VI",
                    "category": "admission",
                    "date": "2026-05-28",
                    "title": "Class VI - Admission Guidelines for Next Session",
                    "content": "<p>The registration link and detailed checklist for next term admissions are now available. Kindly submit the documents before the deadline.</p>",
                    "file_path": ""
                },
                {
                    "id": "sn_55",
                    "section": "senior",
                    "class": "Class VI",
                    "category": "admission",
                    "date": "2026-05-20",
                    "title": "Class VI - Interaction Schedule & Shortlisted List",
                    "content": "<p>Shortlisted student interaction lists have been updated. Please check the timings slot and arrive 15 minutes early.</p>",
                    "file_path": ""
                },
                {
                    "id": "sn_56",
                    "section": "senior",
                    "class": "Class VI",
                    "category": "admission",
                    "date": "2026-05-15",
                    "title": "Class VI - Document Verification Deadline Notice",
                    "content": "<p>Final call for pending document submissions for new admission enrollments. Documents must be verified by the admin office.</p>",
                    "file_path": ""
                },
                {
                    "id": "sn_57",
                    "section": "senior",
                    "class": "Class VI",
                    "category": "exam",
                    "date": "2026-05-02",
                    "title": "Class VI - First Term Examination Timetable",
                    "content": "<p>The schedule and syllabus details for the upcoming First Term assessment have been released. Examinations commence next week.</p>",
                    "file_path": ""
                },
                {
                    "id": "sn_58",
                    "section": "senior",
                    "class": "Class VI",
                    "category": "exam",
                    "date": "2026-04-25",
                    "title": "Class VI - Unit Test Datesheet Release",
                    "content": "<p>Please find the unit test schedule attached. Attendance is mandatory for all scheduled assessments.</p>",
                    "file_path": ""
                },
                {
                    "id": "sn_59",
                    "section": "senior",
                    "class": "Class VI",
                    "category": "exam",
                    "date": "2026-04-18",
                    "title": "Class VI - Mock Tests & Revision Schedule",
                    "content": "<p>Special mock test classes and revision sessions are scheduled to help students prepare for their final board exams.</p>",
                    "file_path": ""
                },
                {
                    "id": "sn_60",
                    "section": "senior",
                    "class": "Class VI",
                    "category": "exam",
                    "date": "2026-04-10",
                    "title": "Class VI - Report Card Parent-Teacher Meeting",
                    "content": "<p>The PTM for reviewing exam performance and distributing report cards is scheduled. Parents must attend along with their ward.</p>",
                    "file_path": ""
                },
                {
                    "id": "sn_61",
                    "section": "senior",
                    "class": "Class VII",
                    "category": "holiday",
                    "date": "2026-06-06",
                    "title": "Class VII - Summer Vacation Holidays",
                    "content": "<p>Dear Parents, this is to inform you that summer vacation holidays will commence shortly. Please ensure students complete their holiday homework assignments.</p>",
                    "file_path": ""
                },
                {
                    "id": "sn_62",
                    "section": "senior",
                    "class": "Class VII",
                    "category": "holiday",
                    "date": "2026-06-05",
                    "title": "Class VII - Durga Puja & Festive Break",
                    "content": "<p>The school will remain closed on account of Durga Puja and Dussehra celebrations. Regular classes will resume after the break.</p>",
                    "file_path": ""
                },
                {
                    "id": "sn_63",
                    "section": "senior",
                    "class": "Class VII",
                    "category": "holiday",
                    "date": "2026-06-04",
                    "title": "Class VII - Winter Holidays Announcement",
                    "content": "<p>School will be closed for winter holidays. We wish all our students and their families a warm and happy holiday season.</p>",
                    "file_path": ""
                },
                {
                    "id": "sn_64",
                    "section": "senior",
                    "class": "Class VII",
                    "category": "admission",
                    "date": "2026-05-28",
                    "title": "Class VII - Admission Guidelines for Next Session",
                    "content": "<p>The registration link and detailed checklist for next term admissions are now available. Kindly submit the documents before the deadline.</p>",
                    "file_path": ""
                },
                {
                    "id": "sn_65",
                    "section": "senior",
                    "class": "Class VII",
                    "category": "admission",
                    "date": "2026-05-20",
                    "title": "Class VII - Interaction Schedule & Shortlisted List",
                    "content": "<p>Shortlisted student interaction lists have been updated. Please check the timings slot and arrive 15 minutes early.</p>",
                    "file_path": ""
                },
                {
                    "id": "sn_66",
                    "section": "senior",
                    "class": "Class VII",
                    "category": "admission",
                    "date": "2026-05-15",
                    "title": "Class VII - Document Verification Deadline Notice",
                    "content": "<p>Final call for pending document submissions for new admission enrollments. Documents must be verified by the admin office.</p>",
                    "file_path": ""
                },
                {
                    "id": "sn_67",
                    "section": "senior",
                    "class": "Class VII",
                    "category": "exam",
                    "date": "2026-05-02",
                    "title": "Class VII - First Term Examination Timetable",
                    "content": "<p>The schedule and syllabus details for the upcoming First Term assessment have been released. Examinations commence next week.</p>",
                    "file_path": ""
                },
                {
                    "id": "sn_68",
                    "section": "senior",
                    "class": "Class VII",
                    "category": "exam",
                    "date": "2026-04-25",
                    "title": "Class VII - Unit Test Datesheet Release",
                    "content": "<p>Please find the unit test schedule attached. Attendance is mandatory for all scheduled assessments.</p>",
                    "file_path": ""
                },
                {
                    "id": "sn_69",
                    "section": "senior",
                    "class": "Class VII",
                    "category": "exam",
                    "date": "2026-04-18",
                    "title": "Class VII - Mock Tests & Revision Schedule",
                    "content": "<p>Special mock test classes and revision sessions are scheduled to help students prepare for their final board exams.</p>",
                    "file_path": ""
                },
                {
                    "id": "sn_70",
                    "section": "senior",
                    "class": "Class VII",
                    "category": "exam",
                    "date": "2026-04-10",
                    "title": "Class VII - Report Card Parent-Teacher Meeting",
                    "content": "<p>The PTM for reviewing exam performance and distributing report cards is scheduled. Parents must attend along with their ward.</p>",
                    "file_path": ""
                },
                {
                    "id": "sn_71",
                    "section": "senior",
                    "class": "Class VIII",
                    "category": "holiday",
                    "date": "2026-06-06",
                    "title": "Class VIII - Summer Vacation Holidays",
                    "content": "<p>Dear Parents, this is to inform you that summer vacation holidays will commence shortly. Please ensure students complete their holiday homework assignments.</p>",
                    "file_path": ""
                },
                {
                    "id": "sn_72",
                    "section": "senior",
                    "class": "Class VIII",
                    "category": "holiday",
                    "date": "2026-06-05",
                    "title": "Class VIII - Durga Puja & Festive Break",
                    "content": "<p>The school will remain closed on account of Durga Puja and Dussehra celebrations. Regular classes will resume after the break.</p>",
                    "file_path": ""
                },
                {
                    "id": "sn_73",
                    "section": "senior",
                    "class": "Class VIII",
                    "category": "holiday",
                    "date": "2026-06-04",
                    "title": "Class VIII - Winter Holidays Announcement",
                    "content": "<p>School will be closed for winter holidays. We wish all our students and their families a warm and happy holiday season.</p>",
                    "file_path": ""
                },
                {
                    "id": "sn_74",
                    "section": "senior",
                    "class": "Class VIII",
                    "category": "admission",
                    "date": "2026-05-28",
                    "title": "Class VIII - Admission Guidelines for Next Session",
                    "content": "<p>The registration link and detailed checklist for next term admissions are now available. Kindly submit the documents before the deadline.</p>",
                    "file_path": ""
                },
                {
                    "id": "sn_75",
                    "section": "senior",
                    "class": "Class VIII",
                    "category": "admission",
                    "date": "2026-05-20",
                    "title": "Class VIII - Interaction Schedule & Shortlisted List",
                    "content": "<p>Shortlisted student interaction lists have been updated. Please check the timings slot and arrive 15 minutes early.</p>",
                    "file_path": ""
                },
                {
                    "id": "sn_76",
                    "section": "senior",
                    "class": "Class VIII",
                    "category": "admission",
                    "date": "2026-05-15",
                    "title": "Class VIII - Document Verification Deadline Notice",
                    "content": "<p>Final call for pending document submissions for new admission enrollments. Documents must be verified by the admin office.</p>",
                    "file_path": ""
                },
                {
                    "id": "sn_77",
                    "section": "senior",
                    "class": "Class VIII",
                    "category": "exam",
                    "date": "2026-05-02",
                    "title": "Class VIII - First Term Examination Timetable",
                    "content": "<p>The schedule and syllabus details for the upcoming First Term assessment have been released. Examinations commence next week.</p>",
                    "file_path": ""
                },
                {
                    "id": "sn_78",
                    "section": "senior",
                    "class": "Class VIII",
                    "category": "exam",
                    "date": "2026-04-25",
                    "title": "Class VIII - Unit Test Datesheet Release",
                    "content": "<p>Please find the unit test schedule attached. Attendance is mandatory for all scheduled assessments.</p>",
                    "file_path": ""
                },
                {
                    "id": "sn_79",
                    "section": "senior",
                    "class": "Class VIII",
                    "category": "exam",
                    "date": "2026-04-18",
                    "title": "Class VIII - Mock Tests & Revision Schedule",
                    "content": "<p>Special mock test classes and revision sessions are scheduled to help students prepare for their final board exams.</p>",
                    "file_path": ""
                },
                {
                    "id": "sn_80",
                    "section": "senior",
                    "class": "Class VIII",
                    "category": "exam",
                    "date": "2026-04-10",
                    "title": "Class VIII - Report Card Parent-Teacher Meeting",
                    "content": "<p>The PTM for reviewing exam performance and distributing report cards is scheduled. Parents must attend along with their ward.</p>",
                    "file_path": ""
                },
                {
                    "id": "sn_81",
                    "section": "senior",
                    "class": "Class IX",
                    "category": "holiday",
                    "date": "2026-06-06",
                    "title": "Class IX - Summer Vacation Holidays",
                    "content": "<p>Dear Parents, this is to inform you that summer vacation holidays will commence shortly. Please ensure students complete their holiday homework assignments.</p>",
                    "file_path": ""
                },
                {
                    "id": "sn_82",
                    "section": "senior",
                    "class": "Class IX",
                    "category": "holiday",
                    "date": "2026-06-05",
                    "title": "Class IX - Durga Puja & Festive Break",
                    "content": "<p>The school will remain closed on account of Durga Puja and Dussehra celebrations. Regular classes will resume after the break.</p>",
                    "file_path": ""
                },
                {
                    "id": "sn_83",
                    "section": "senior",
                    "class": "Class IX",
                    "category": "holiday",
                    "date": "2026-06-04",
                    "title": "Class IX - Winter Holidays Announcement",
                    "content": "<p>School will be closed for winter holidays. We wish all our students and their families a warm and happy holiday season.</p>",
                    "file_path": ""
                },
                {
                    "id": "sn_84",
                    "section": "senior",
                    "class": "Class IX",
                    "category": "admission",
                    "date": "2026-05-28",
                    "title": "Class IX - Admission Guidelines for Next Session",
                    "content": "<p>The registration link and detailed checklist for next term admissions are now available. Kindly submit the documents before the deadline.</p>",
                    "file_path": ""
                },
                {
                    "id": "sn_85",
                    "section": "senior",
                    "class": "Class IX",
                    "category": "admission",
                    "date": "2026-05-20",
                    "title": "Class IX - Interaction Schedule & Shortlisted List",
                    "content": "<p>Shortlisted student interaction lists have been updated. Please check the timings slot and arrive 15 minutes early.</p>",
                    "file_path": ""
                },
                {
                    "id": "sn_86",
                    "section": "senior",
                    "class": "Class IX",
                    "category": "admission",
                    "date": "2026-05-15",
                    "title": "Class IX - Document Verification Deadline Notice",
                    "content": "<p>Final call for pending document submissions for new admission enrollments. Documents must be verified by the admin office.</p>",
                    "file_path": ""
                },
                {
                    "id": "sn_87",
                    "section": "senior",
                    "class": "Class IX",
                    "category": "exam",
                    "date": "2026-05-02",
                    "title": "Class IX - First Term Examination Timetable",
                    "content": "<p>The schedule and syllabus details for the upcoming First Term assessment have been released. Examinations commence next week.</p>",
                    "file_path": ""
                },
                {
                    "id": "sn_88",
                    "section": "senior",
                    "class": "Class IX",
                    "category": "exam",
                    "date": "2026-04-25",
                    "title": "Class IX - Unit Test Datesheet Release",
                    "content": "<p>Please find the unit test schedule attached. Attendance is mandatory for all scheduled assessments.</p>",
                    "file_path": ""
                },
                {
                    "id": "sn_89",
                    "section": "senior",
                    "class": "Class IX",
                    "category": "exam",
                    "date": "2026-04-18",
                    "title": "Class IX - Mock Tests & Revision Schedule",
                    "content": "<p>Special mock test classes and revision sessions are scheduled to help students prepare for their final board exams.</p>",
                    "file_path": ""
                },
                {
                    "id": "sn_90",
                    "section": "senior",
                    "class": "Class IX",
                    "category": "exam",
                    "date": "2026-04-10",
                    "title": "Class IX - Report Card Parent-Teacher Meeting",
                    "content": "<p>The PTM for reviewing exam performance and distributing report cards is scheduled. Parents must attend along with their ward.</p>",
                    "file_path": ""
                },
                {
                    "id": "sn_91",
                    "section": "senior",
                    "class": "Class X",
                    "category": "holiday",
                    "date": "2026-06-06",
                    "title": "Class X - Summer Vacation Holidays",
                    "content": "<p>Dear Parents, this is to inform you that summer vacation holidays will commence shortly. Please ensure students complete their holiday homework assignments.</p>",
                    "file_path": ""
                },
                {
                    "id": "sn_92",
                    "section": "senior",
                    "class": "Class X",
                    "category": "holiday",
                    "date": "2026-06-05",
                    "title": "Class X - Durga Puja & Festive Break",
                    "content": "<p>The school will remain closed on account of Durga Puja and Dussehra celebrations. Regular classes will resume after the break.</p>",
                    "file_path": ""
                },
                {
                    "id": "sn_93",
                    "section": "senior",
                    "class": "Class X",
                    "category": "holiday",
                    "date": "2026-06-04",
                    "title": "Class X - Winter Holidays Announcement",
                    "content": "<p>School will be closed for winter holidays. We wish all our students and their families a warm and happy holiday season.</p>",
                    "file_path": ""
                },
                {
                    "id": "sn_94",
                    "section": "senior",
                    "class": "Class X",
                    "category": "admission",
                    "date": "2026-05-28",
                    "title": "Class X - Admission Guidelines for Next Session",
                    "content": "<p>The registration link and detailed checklist for next term admissions are now available. Kindly submit the documents before the deadline.</p>",
                    "file_path": ""
                },
                {
                    "id": "sn_95",
                    "section": "senior",
                    "class": "Class X",
                    "category": "admission",
                    "date": "2026-05-20",
                    "title": "Class X - Interaction Schedule & Shortlisted List",
                    "content": "<p>Shortlisted student interaction lists have been updated. Please check the timings slot and arrive 15 minutes early.</p>",
                    "file_path": ""
                },
                {
                    "id": "sn_96",
                    "section": "senior",
                    "class": "Class X",
                    "category": "admission",
                    "date": "2026-05-15",
                    "title": "Class X - Document Verification Deadline Notice",
                    "content": "<p>Final call for pending document submissions for new admission enrollments. Documents must be verified by the admin office.</p>",
                    "file_path": ""
                },
                {
                    "id": "sn_97",
                    "section": "senior",
                    "class": "Class X",
                    "category": "exam",
                    "date": "2026-05-02",
                    "title": "Class X - First Term Examination Timetable",
                    "content": "<p>The schedule and syllabus details for the upcoming First Term assessment have been released. Examinations commence next week.</p>",
                    "file_path": ""
                },
                {
                    "id": "sn_98",
                    "section": "senior",
                    "class": "Class X",
                    "category": "exam",
                    "date": "2026-04-25",
                    "title": "Class X - Unit Test Datesheet Release",
                    "content": "<p>Please find the unit test schedule attached. Attendance is mandatory for all scheduled assessments.</p>",
                    "file_path": ""
                },
                {
                    "id": "sn_99",
                    "section": "senior",
                    "class": "Class X",
                    "category": "exam",
                    "date": "2026-04-18",
                    "title": "Class X - Mock Tests & Revision Schedule",
                    "content": "<p>Special mock test classes and revision sessions are scheduled to help students prepare for their final board exams.</p>",
                    "file_path": ""
                },
                {
                    "id": "sn_100",
                    "section": "senior",
                    "class": "Class X",
                    "category": "exam",
                    "date": "2026-04-10",
                    "title": "Class X - Report Card Parent-Teacher Meeting",
                    "content": "<p>The PTM for reviewing exam performance and distributing report cards is scheduled. Parents must attend along with their ward.</p>",
                    "file_path": ""
                },
                {
                    "id": "sn_101",
                    "section": "senior",
                    "class": "Class XI",
                    "category": "holiday",
                    "date": "2026-06-06",
                    "title": "Class XI - Summer Vacation Holidays",
                    "content": "<p>Dear Parents, this is to inform you that summer vacation holidays will commence shortly. Please ensure students complete their holiday homework assignments.</p>",
                    "file_path": ""
                },
                {
                    "id": "sn_102",
                    "section": "senior",
                    "class": "Class XI",
                    "category": "holiday",
                    "date": "2026-06-05",
                    "title": "Class XI - Durga Puja & Festive Break",
                    "content": "<p>The school will remain closed on account of Durga Puja and Dussehra celebrations. Regular classes will resume after the break.</p>",
                    "file_path": ""
                },
                {
                    "id": "sn_103",
                    "section": "senior",
                    "class": "Class XI",
                    "category": "holiday",
                    "date": "2026-06-04",
                    "title": "Class XI - Winter Holidays Announcement",
                    "content": "<p>School will be closed for winter holidays. We wish all our students and their families a warm and happy holiday season.</p>",
                    "file_path": ""
                },
                {
                    "id": "sn_104",
                    "section": "senior",
                    "class": "Class XI",
                    "category": "admission",
                    "date": "2026-05-28",
                    "title": "Class XI - Admission Guidelines for Next Session",
                    "content": "<p>The registration link and detailed checklist for next term admissions are now available. Kindly submit the documents before the deadline.</p>",
                    "file_path": ""
                },
                {
                    "id": "sn_105",
                    "section": "senior",
                    "class": "Class XI",
                    "category": "admission",
                    "date": "2026-05-20",
                    "title": "Class XI - Interaction Schedule & Shortlisted List",
                    "content": "<p>Shortlisted student interaction lists have been updated. Please check the timings slot and arrive 15 minutes early.</p>",
                    "file_path": ""
                },
                {
                    "id": "sn_106",
                    "section": "senior",
                    "class": "Class XI",
                    "category": "admission",
                    "date": "2026-05-15",
                    "title": "Class XI - Document Verification Deadline Notice",
                    "content": "<p>Final call for pending document submissions for new admission enrollments. Documents must be verified by the admin office.</p>",
                    "file_path": ""
                },
                {
                    "id": "sn_107",
                    "section": "senior",
                    "class": "Class XI",
                    "category": "exam",
                    "date": "2026-05-02",
                    "title": "Class XI - First Term Examination Timetable",
                    "content": "<p>The schedule and syllabus details for the upcoming First Term assessment have been released. Examinations commence next week.</p>",
                    "file_path": ""
                },
                {
                    "id": "sn_108",
                    "section": "senior",
                    "class": "Class XI",
                    "category": "exam",
                    "date": "2026-04-25",
                    "title": "Class XI - Unit Test Datesheet Release",
                    "content": "<p>Please find the unit test schedule attached. Attendance is mandatory for all scheduled assessments.</p>",
                    "file_path": ""
                },
                {
                    "id": "sn_109",
                    "section": "senior",
                    "class": "Class XI",
                    "category": "exam",
                    "date": "2026-04-18",
                    "title": "Class XI - Mock Tests & Revision Schedule",
                    "content": "<p>Special mock test classes and revision sessions are scheduled to help students prepare for their final board exams.</p>",
                    "file_path": ""
                },
                {
                    "id": "sn_110",
                    "section": "senior",
                    "class": "Class XI",
                    "category": "exam",
                    "date": "2026-04-10",
                    "title": "Class XI - Report Card Parent-Teacher Meeting",
                    "content": "<p>The PTM for reviewing exam performance and distributing report cards is scheduled. Parents must attend along with their ward.</p>",
                    "file_path": ""
                },
                {
                    "id": "sn_111",
                    "section": "senior",
                    "class": "Class XII",
                    "category": "holiday",
                    "date": "2026-06-06",
                    "title": "Class XII - Summer Vacation Holidays",
                    "content": "<p>Dear Parents, this is to inform you that summer vacation holidays will commence shortly. Please ensure students complete their holiday homework assignments.</p>",
                    "file_path": ""
                },
                {
                    "id": "sn_112",
                    "section": "senior",
                    "class": "Class XII",
                    "category": "holiday",
                    "date": "2026-06-05",
                    "title": "Class XII - Durga Puja & Festive Break",
                    "content": "<p>The school will remain closed on account of Durga Puja and Dussehra celebrations. Regular classes will resume after the break.</p>",
                    "file_path": ""
                },
                {
                    "id": "sn_113",
                    "section": "senior",
                    "class": "Class XII",
                    "category": "holiday",
                    "date": "2026-06-04",
                    "title": "Class XII - Winter Holidays Announcement",
                    "content": "<p>School will be closed for winter holidays. We wish all our students and their families a warm and happy holiday season.</p>",
                    "file_path": ""
                },
                {
                    "id": "sn_114",
                    "section": "senior",
                    "class": "Class XII",
                    "category": "admission",
                    "date": "2026-05-28",
                    "title": "Class XII - Admission Guidelines for Next Session",
                    "content": "<p>The registration link and detailed checklist for next term admissions are now available. Kindly submit the documents before the deadline.</p>",
                    "file_path": ""
                },
                {
                    "id": "sn_115",
                    "section": "senior",
                    "class": "Class XII",
                    "category": "admission",
                    "date": "2026-05-20",
                    "title": "Class XII - Interaction Schedule & Shortlisted List",
                    "content": "<p>Shortlisted student interaction lists have been updated. Please check the timings slot and arrive 15 minutes early.</p>",
                    "file_path": ""
                },
                {
                    "id": "sn_116",
                    "section": "senior",
                    "class": "Class XII",
                    "category": "admission",
                    "date": "2026-05-15",
                    "title": "Class XII - Document Verification Deadline Notice",
                    "content": "<p>Final call for pending document submissions for new admission enrollments. Documents must be verified by the admin office.</p>",
                    "file_path": ""
                },
                {
                    "id": "sn_117",
                    "section": "senior",
                    "class": "Class XII",
                    "category": "exam",
                    "date": "2026-05-02",
                    "title": "Class XII - First Term Examination Timetable",
                    "content": "<p>The schedule and syllabus details for the upcoming First Term assessment have been released. Examinations commence next week.</p>",
                    "file_path": ""
                },
                {
                    "id": "sn_118",
                    "section": "senior",
                    "class": "Class XII",
                    "category": "exam",
                    "date": "2026-04-25",
                    "title": "Class XII - Unit Test Datesheet Release",
                    "content": "<p>Please find the unit test schedule attached. Attendance is mandatory for all scheduled assessments.</p>",
                    "file_path": ""
                },
                {
                    "id": "sn_119",
                    "section": "senior",
                    "class": "Class XII",
                    "category": "exam",
                    "date": "2026-04-18",
                    "title": "Class XII - Mock Tests & Revision Schedule",
                    "content": "<p>Special mock test classes and revision sessions are scheduled to help students prepare for their final board exams.</p>",
                    "file_path": ""
                },
                {
                    "id": "sn_120",
                    "section": "senior",
                    "class": "Class XII",
                    "category": "exam",
                    "date": "2026-04-10",
                    "title": "Class XII - Report Card Parent-Teacher Meeting",
                    "content": "<p>The PTM for reviewing exam performance and distributing report cards is scheduled. Parents must attend along with their ward.</p>",
                    "file_path": ""
                }
            ]
            };
        }
        
        if (data.ticker) renderTicker(data.ticker);
        if (data.hall_of_fame) renderHof(data.hall_of_fame);
        if (data.awards) renderAwards(data.awards);
        if (data.bulletin) renderBulletin(data.bulletin);
        if (data.hero_slider) renderHeroSlider(data.hero_slider);
        renderHeroNotices(data.hero_notices);
        return;
    }

    fetch('api.php')
        .then(res => res.json())
        .then(data => {
            if (data) {
                if (data.ticker) renderTicker(data.ticker);
                if (data.hall_of_fame) renderHof(data.hall_of_fame);
                if (data.awards) renderAwards(data.awards);
                if (data.bulletin) renderBulletin(data.bulletin);
                if (data.hero_slider) renderHeroSlider(data.hero_slider);
                renderHeroNotices(data.hero_notices);
            }
        })
        .catch(err => {
            console.error('Error fetching API data, using static fallbacks:', err);
            renderHeroNotices(DEFAULT_HERO_NOTICES);
        });
});

// Helper: Escape HTML to prevent XSS
function escapeHtml(text) {
    if (!text) return '';
    const map = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#039;'
    };
    return text.replace(/[&<>"']/g, function(m) { return map[m]; });
}

// Render Announcements Marquee
function renderTicker(tickerItems) {
    const container = document.getElementById('ticker-move-container');
    if (!container) return;
    container.innerHTML = '';
    
    // Duplicate the marquee items for infinite scrolling loop
    const items = [...tickerItems, ...tickerItems];
    items.forEach(text => {
        const item = document.createElement('div');
        item.className = 'ticker-item';
        item.innerHTML = `<i class="ph-fill ph-star"></i> ${escapeHtml(text)}`;
        container.appendChild(item);
    });
}

// Render Academic Hall of Fame
function renderHof(hofData) {
    const boardImg = document.getElementById('hof-img-board_results');
    const boardText = document.getElementById('hof-text-board_results');
    const examImg = document.getElementById('hof-img-competitive_exam');
    const examText = document.getElementById('hof-text-competitive_exam');
    
    if (boardImg && hofData.board_results) {
        if (hofData.board_results.image_path) {
            if (hofData.board_results.image_path.startsWith('data:')) {
                boardImg.src = hofData.board_results.image_path;
            } else {
                boardImg.src = 'assets/sse_batch.jpg';
            }
        }
        boardText.textContent = (hofData.board_results.subtitle || 'AISSE & AISSCE PERFORMANCE 2025').replace(/\s*\[DEMO\]/gi, '');
    }
    
    if (examImg && hofData.competitive_exam) {
        if (hofData.competitive_exam.image_path) {
            if (hofData.competitive_exam.image_path.startsWith('data:')) {
                examImg.src = hofData.competitive_exam.image_path;
            } else {
                examImg.src = 'assets/ssce_batch.jpg';
            }
        }
        examText.textContent = (hofData.competitive_exam.subtitle || 'JEE, NEET & OLYMPIAD QUALIFIERS').replace(/\s*\[DEMO\]/gi, '');
    }
}

// Render Awards Grid
function renderAwards(awardsData) {
    const container = document.getElementById('awards-grid-container');
    if (!container) return;
    container.innerHTML = '';
    
    awardsData.forEach(award => {
        const card = document.createElement('div');
        card.className = 'award-card';
        
        let cardContent = '';
        if (award.image_path) {
            // Render uploaded custom image as full card background
            cardContent = `
                <i class="ph-fill ph-star star-icon" style="z-index:3;"></i>
                <div style="position:absolute; top:0; left:0; width:100%; height:100%; z-index:2; background: linear-gradient(rgba(26, 26, 75, 0.2), rgba(26, 26, 75, 0.65)); border-radius: 24px;"></div>
                <img src="${award.image_path}" alt="${escapeHtml(award.title)}" style="width: 100%; height: 100%; object-fit: cover; border-radius: 24px; position: absolute; top:0; left:0; z-index: 1;">
                <h3 style="position: relative; z-index: 3; color: var(--white); text-shadow: 1px 1px 6px rgba(0,0,0,0.8);">${escapeHtml(award.title)}</h3>
            `;
        } else {
            // Render standard medal layout
            cardContent = `
                <i class="ph-fill ph-star star-icon"></i>
                <i class="ph ph-medal main-icon"></i>
                <h3>${escapeHtml(award.title)}</h3>
            `;
        }
        
        card.innerHTML = cardContent;
        container.appendChild(card);
    });
}

// Render Bulletin Board Blogs
function renderBulletin(bulletinData) {
    const container = document.getElementById('bulletin-list-container');
    if (!container) return;
    container.innerHTML = '';
    
    // Only show the 4 latest bulletin items
    const posts = bulletinData.slice(0, 4);
    if (posts.length === 0) {
        container.innerHTML = '<p style="color: var(--primary-blue); font-size: 0.85rem; padding: 1.5rem; text-align: center; font-weight: 700;">NO BULLETIN NOTICES FOUND</p>';
        return;
    }

    posts.forEach(post => {
        const item = document.createElement('div');
        item.className = 'bulletin-item';
        
        // Calculate age for "NEW" blinking badge (7 days limit)
        const postDate = new Date(post.created_at);
        const diffTime = Math.abs(new Date() - postDate);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        
        let blinkBadge = '';
        if (diffDays <= 7) {
            blinkBadge = '<span class="new-blink">NEW</span>';
        }
        
        item.innerHTML = `
            <div class="bulletin-text">
                <span class="bulletin-title">${escapeHtml(post.title)}</span>
                ${blinkBadge}
            </div>
            <span class="badge">BLOG</span>
        `;
        
        item.addEventListener('click', () => {
            window.open(`blog.html?id=${post.id}`, '_blank');
        });
        
        container.appendChild(item);
    });
}

// Hero Slider Player and transition logic
let currentSlideIndex = 0;
let slideTimeout = null;
let slidesList = [];

function renderHeroSlider(sliderData) {
    const container = document.getElementById('hero-slider-container');
    if (!container) return;
    container.innerHTML = '';
    
    slidesList = (Array.isArray(sliderData) && sliderData.length > 0) ? sliderData : DEFAULT_HERO_SLIDER;
    if (!slidesList || slidesList.length === 0) {
        // Fallback default background slide
        container.innerHTML = `
            <div class="hero-slide active">
                <img src="assets/hero_bg.png" alt="Default Hero background">
            </div>
        `;
        return;
    }
    
    slidesList.forEach((slide, idx) => {
        const slideDiv = document.createElement('div');
        slideDiv.className = `hero-slide ${idx === 0 ? 'active' : ''}`;
        slideDiv.id = `hero-slide-${idx}`;
        
        if (slide.type === 'video') {
            slideDiv.innerHTML = `
                <video id="hero-video-${idx}" src="${slide.media_path}" muted playsinline style="width: 100%; height: 100%; object-fit: cover;"></video>
            `;
        } else {
            slideDiv.innerHTML = `
                <img src="${slide.media_path}" alt="Hero Slide">
            `;
        }
        container.appendChild(slideDiv);
    });
    
    currentSlideIndex = 0;
    startSlideTimer();
}

function startSlideTimer() {
    if (slideTimeout) clearTimeout(slideTimeout);
    if (slidesList.length <= 1) return;
    
    const currentSlide = slidesList[currentSlideIndex];
    const duration = currentSlide.duration_ms ? parseInt(currentSlide.duration_ms) : 5000;
    
    // Play video if slide type is video
    if (currentSlide.type === 'video') {
        const videoElement = document.getElementById(`hero-video-${currentSlideIndex}`);
        if (videoElement) {
            videoElement.currentTime = 0;
            videoElement.play().catch(e => console.log("Slider video autoplay blocked:", e));
        }
    }
    
    // Transition slide after the set duration (in ms)
    slideTimeout = setTimeout(() => {
        goToNextSlide();
    }, duration);
}

function goToNextSlide() {
    const currentSlideEl = document.getElementById(`hero-slide-${currentSlideIndex}`);
    if (currentSlideEl) {
        currentSlideEl.classList.remove('active');
        if (slidesList[currentSlideIndex].type === 'video') {
            const videoElement = document.getElementById(`hero-video-${currentSlideIndex}`);
            if (videoElement) videoElement.pause();
        }
    }
    
    currentSlideIndex = (currentSlideIndex + 1) % slidesList.length;
    
    const nextSlideEl = document.getElementById(`hero-slide-${currentSlideIndex}`);
    if (nextSlideEl) {
        nextSlideEl.classList.add('active');
    }
    
    startSlideTimer();
}

// ==========================================
// Help Desk Chatbot Dynamic Implementation
// ==========================================
function initChatbot() {
    // 1. Inject chatbot elements to body
    const botFloat = document.createElement('div');
    botFloat.className = 'chatbot-float';
    botFloat.id = 'chatbot-float-btn';
    botFloat.innerHTML = '<i class="ph ph-chat-circle"></i>';
    document.body.appendChild(botFloat);

    const botWindow = document.createElement('div');
    botWindow.className = 'chatbot-window';
    botWindow.id = 'chatbot-window';
    botWindow.innerHTML = `
        <div class="chatbot-header">
            <div class="chatbot-header-title">
                <span class="wave-emoji">👋</span>
                <span>HELP DESK</span>
            </div>
            <div class="chatbot-header-actions">
                <button class="chatbot-header-btn" id="chatbot-reset-btn" title="Reset Conversation"><i class="ph ph-arrow-counter-clockwise"></i></button>
                <button class="chatbot-close" id="chatbot-close-btn" style="margin-left: 0;"><i class="ph ph-x"></i></button>
            </div>
        </div>
        <div class="chatbot-messages" id="chatbot-messages-log"></div>
        <div class="chat-suggestions-container" id="chatbot-suggestions"></div>
        <div class="chatbot-footer">
            <div class="chatbot-input-container">
                <input type="text" class="chatbot-input" id="chatbot-text-input" placeholder="ASK A QUESTION..." autocomplete="off">
                <button class="chatbot-voice-btn" id="chatbot-voice-btn" title="Speak to chatbot"><i class="ph ph-microphone"></i></button>
            </div>
            <button class="chatbot-send-btn" id="chatbot-send-btn"><i class="ph ph-paper-plane-right"></i></button>
        </div>
    `;
    document.body.appendChild(botWindow);

    // 2. Load Session State
    let userName = sessionStorage.getItem('chat_user_name') || null;
    let chatSessionId = sessionStorage.getItem('chat_session_id') || 'sess_' + Date.now() + '_' + Math.random().toString(36).substring(2, 9);
    sessionStorage.setItem('chat_session_id', chatSessionId);

    // Conversational flow state manager
    let chatState = {
        flow: null,
        step: 0,
        section: null,
        data: {}
    };

    let chatHistory = [];
    try {
        const savedHistory = sessionStorage.getItem('chat_history');
        if (savedHistory) chatHistory = JSON.parse(savedHistory);
    } catch(e) {}

    const messagesLog = document.getElementById('chatbot-messages-log');
    const textInput = document.getElementById('chatbot-text-input');
    const sendBtn = document.getElementById('chatbot-send-btn');
    const voiceBtn = document.getElementById('chatbot-voice-btn');
    const closeBtn = document.getElementById('chatbot-close-btn');
    const resetBtn = document.getElementById('chatbot-reset-btn');
    const suggestionsBox = document.getElementById('chatbot-suggestions');

    // Inactivity variables
    let inactivityTimer = null;
    const INACTIVITY_LIMIT = 300000; // 5 minutes in milliseconds

    function resetInactivityTimer() {
        if (inactivityTimer) {
            clearTimeout(inactivityTimer);
        }
        if (textInput.disabled) return;
        if (botWindow.classList.contains('active')) {
            inactivityTimer = setTimeout(triggerInactivityCheckout, INACTIVITY_LIMIT);
        }
    }

    function triggerInactivityCheckout() {
        const checkoutMsg = "Thank you for visiting! 😊 If you need further assistance, please feel free to reset the chat. Have a wonderful day! 🙏";
        appendBotReply(checkoutMsg);
        
        textInput.disabled = true;
        textInput.placeholder = "Session ended. Click reset to start a new chat. 😊";
        sendBtn.disabled = true;
        voiceBtn.disabled = true;
        if (suggestionsBox) suggestionsBox.classList.remove('active');
    }

    // Toggle Chat window
    botFloat.addEventListener('click', () => {
        botWindow.classList.toggle('active');
        if (botWindow.classList.contains('active')) {
            // Scroll to bottom
            messagesLog.scrollTop = messagesLog.scrollHeight;
        }
        resetInactivityTimer();
    });

    closeBtn.addEventListener('click', () => {
        botWindow.classList.remove('active');
        if (inactivityTimer) {
            clearTimeout(inactivityTimer);
        }
    });

    // Send Button click
    sendBtn.addEventListener('click', () => {
        handleChatSubmit();
    });

    // Enter key submit
    textInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            handleChatSubmit();
        }
    });

    // Voice recognition click
    voiceBtn.addEventListener('click', () => {
        startVoiceRecognition();
    });

    // Inactivity event listeners for chat interaction
    botWindow.addEventListener('click', resetInactivityTimer);
    botWindow.addEventListener('input', resetInactivityTimer);
    botWindow.addEventListener('keypress', resetInactivityTimer);

    // Reset conversation button handler
    if (resetBtn) {
        resetBtn.addEventListener('click', () => {
            if (confirm("Would you like to start a new conversation?")) {
                sessionStorage.removeItem('chat_history');
                sessionStorage.removeItem('chat_user_name');
                userName = null;
                pendingQuery = null;
                nameConvinceShown = false;
                chatHistory = [];
                messagesLog.innerHTML = '';
                chatState = { flow: null, step: 0, section: null, data: {} }; // Clear flow state
                
                chatSessionId = 'sess_' + Date.now() + '_' + Math.random().toString(36).substring(2, 9);
                sessionStorage.setItem('chat_session_id', chatSessionId);
                
                // Re-enable inputs
                textInput.disabled = false;
                textInput.placeholder = "ASK A QUESTION...";
                sendBtn.disabled = false;
                voiceBtn.disabled = false;
                
                const greetingText = "Namaste 🙏! How can I help you today?";
                appendMessage('bot', greetingText, true);
                showQuickActionButtons();
                chatHistory.push({ sender: 'bot', text: greetingText, rating: 0 });
                sessionStorage.setItem('chat_history', JSON.stringify(chatHistory));
                
                resetInactivityTimer();
            }
        });
    }

    // Auto-suggestions container handler
    if (suggestionsBox) {
        textInput.addEventListener('input', () => {
            const inputVal = textInput.value.toLowerCase().trim();
            if (!inputVal) {
                suggestionsBox.classList.remove('active');
                suggestionsBox.innerHTML = '';
                return;
            }
            
            getChatbotData(dataList => {
                const matches = dataList.filter(item => {
                    return item.query.toLowerCase().includes(inputVal) || 
                           item.keywords.toLowerCase().split(',').some(k => k.trim().includes(inputVal));
                }).slice(0, 3);
                
                if (matches.length > 0) {
                    suggestionsBox.innerHTML = matches.map(m => `
                        <div class="chat-suggestion-item" data-query="${escapeHtml(m.query)}">${escapeHtml(m.query)}</div>
                    `).join('');
                    suggestionsBox.classList.add('active');
                    
                    suggestionsBox.querySelectorAll('.chat-suggestion-item').forEach(item => {
                        item.addEventListener('click', () => {
                            textInput.value = item.getAttribute('data-query');
                            suggestionsBox.classList.remove('active');
                            suggestionsBox.innerHTML = '';
                            handleChatSubmit();
                        });
                    });
                } else {
                    suggestionsBox.classList.remove('active');
                    suggestionsBox.innerHTML = '';
                }
            });
        });
        
        textInput.addEventListener('blur', () => {
            setTimeout(() => {
                suggestionsBox.classList.remove('active');
            }, 200);
        });
    }

    // Initialize messages log
    if (chatHistory.length > 0) {
        // Render saved messages
        chatHistory.forEach(msg => {
            appendMessage(msg.sender, msg.text, false, msg.isLink, msg.linkUrl, msg.showContactBtn);
        });
        if (chatHistory.length === 1 && chatHistory[0].sender === 'bot' && chatHistory[0].text.includes("Namaste")) {
            showQuickActionButtons();
        }
    } else {
        // Render initial greeting
        const greetingText = "Namaste 🙏! How can I help you today?";
        appendMessage('bot', greetingText, true);
        showQuickActionButtons();
        chatHistory.push({ sender: 'bot', text: greetingText, rating: 0 });
        sessionStorage.setItem('chat_history', JSON.stringify(chatHistory));
    }

    let pendingQuery = null;
    let nameConvinceShown = false;

    function isNegativeReply(text) {
        const clean = text.toLowerCase().trim();
        const negatives = [
            'no', 'never', 'not telling', 'why', 'private', 'no way', 
            'skip', 'i will not', 'dont want to', "don't want to", 
            'secret', 'not your business', 'not yours', 'none'
        ];
        return negatives.some(neg => clean === neg || clean.startsWith(neg + ' ') || clean.endsWith(' ' + neg) || clean.includes(' ' + neg + ' '));
    }

    function handleChatSubmit() {
        const query = textInput.value.trim();
        if (!query) return;

        // Reset inactivity timer on submit
        resetInactivityTimer();

        // Append user query to log
        appendMessage('user', query);
        textInput.value = '';

        // Conversation flow logic
        if (!userName) {
            // Check if this is the name reply
            if (pendingQuery !== null) {
                if (isNegativeReply(query) && !nameConvinceShown) {
                    nameConvinceShown = true;
                    saveChatMessage('user', query);
                    appendBotReply("We request your name to customize our assistance and address you warmly. 😊 Your privacy is fully respected. Would you mind sharing your first name, or would you prefer to proceed as Guest?", () => {
                        showGuestOrNameButtons();
                    });
                    return;
                }

                if (isNegativeReply(query)) {
                    userName = "Guest";
                } else {
                    userName = query;
                }
                
                sessionStorage.setItem('chat_user_name', userName);
                saveChatMessage('user', query);
                
                const hour = new Date().getHours();
                let timeOfDay = "day";
                if (hour >= 5 && hour < 12) timeOfDay = "morning";
                else if (hour >= 12 && hour < 17) timeOfDay = "afternoon";
                else if (hour >= 17 && hour < 22) timeOfDay = "evening";
                else timeOfDay = "night";
                
                const greetingMsg = userName === "Guest"
                    ? `Understood 😊! Let's proceed as Guest. A very good ${timeOfDay} to you. Let's find the information you need!`
                    : `Thank you 😊, ${userName}! A very good ${timeOfDay} to you. Let's find the information you need!`;

                appendBotReply(greetingMsg, () => {
                    const originalQuery = pendingQuery;
                    pendingQuery = null;
                    nameConvinceShown = false;
                    processQuery(originalQuery);
                });
            } else {
                // First question asked, ask for name
                pendingQuery = query;
                saveChatMessage('user', query);
                appendBotReply("Before we proceed, could you please tell me your name?");
            }
        } else {
            // Name is already set, process normally
            saveChatMessage('user', query);
            processQuery(query);
        }
    }

    function showGuestOrNameButtons() {
        const btnContainer = document.createElement('div');
        btnContainer.className = 'chat-btn-container';
        
        const button = document.createElement('button');
        button.className = 'chat-btn';
        button.innerHTML = `<span>PROCEED AS GUEST</span> <i class="ph ph-user-circle"></i>`;
        button.addEventListener('click', () => {
            const allButtons = btnContainer.querySelectorAll('.chat-btn');
            allButtons.forEach(b => {
                b.disabled = true;
                b.classList.add('selected');
            });
            
            appendMessage('user', "Proceed as Guest");
            saveChatMessage('user', "Proceed as Guest");
            
            userName = "Guest";
            sessionStorage.setItem('chat_user_name', userName);
            
            const hour = new Date().getHours();
            let timeOfDay = "day";
            if (hour >= 5 && hour < 12) timeOfDay = "morning";
            else if (hour >= 12 && hour < 17) timeOfDay = "afternoon";
            else if (hour >= 17 && hour < 22) timeOfDay = "evening";
            else timeOfDay = "night";
            
            appendBotReply(`Understood 😊! Let's proceed as Guest. A very good ${timeOfDay} to you. Let's find the information you need!`, () => {
                const originalQuery = pendingQuery;
                pendingQuery = null;
                nameConvinceShown = false;
                processQuery(originalQuery);
            });
        });
        btnContainer.appendChild(button);
        messagesLog.appendChild(btnContainer);
        messagesLog.scrollTop = messagesLog.scrollHeight;
    }

    function disableAllChatButtons() {
        const buttons = messagesLog.querySelectorAll('.chat-btn');
        buttons.forEach(btn => {
            btn.disabled = true;
            if (!btn.classList.contains('selected') && !btn.classList.contains('faded')) {
                btn.classList.add('faded');
            }
        });
    }

    function processQuery(query) {
        const cleanQuery = query.toLowerCase().trim();
        
        // Disable all previous buttons in the chat log
        disableAllChatButtons();

        // Check for general reset/menu command at any time
        if (cleanQuery === 'reset' || cleanQuery === 'exit' || cleanQuery === 'main menu' || cleanQuery === 'menu') {
            chatState = { flow: null, step: 0, section: null, data: {} };
            appendBotReply("Conversation reset. How can I help you today?", () => {
                showQuickActionButtons();
            });
            return;
        }
        
        // 0. Intercept for active conversational flows
        if (chatState.flow) {
            
            if (chatState.flow === 'fees') {
                handleFeesFlow(cleanQuery, query);
            } else if (chatState.flow === 'admission') {
                handleAdmissionFlow(cleanQuery, query);
            } else if (chatState.flow === 'timing') {
                handleTimingFlow(cleanQuery, query);
            } else if (chatState.flow === 'infrastructure') {
                handleInfrastructureFlow(cleanQuery, query);
            } else if (chatState.flow === 'feePolicy') {
                handleFeePolicyFlow(cleanQuery, query);
            } else if (chatState.flow === 'holiday') {
                handleHolidayFlow(cleanQuery, query);
            } else if (chatState.flow === 'course') {
                handleCourseFlow(cleanQuery, query);
            }
            return;
        }

        // 1. Check for Greetings
        const greetings = ['hi', 'hello', 'hey', 'namaste', 'good morning', 'good afternoon', 'good evening', 'greetings'];
        const isGreeting = greetings.some(g => cleanQuery === g || cleanQuery.startsWith(g + ' ') || cleanQuery.endsWith(' ' + g) || cleanQuery.includes(' ' + g + ' '));
        
        if (isGreeting) {
            const userNameVal = sessionStorage.getItem('chat_user_name') || userName;
            const greetingReplies = [
                userNameVal && userNameVal !== 'Guest' 
                    ? `Hello ${userNameVal}! 😊 How can I assist you with Shri Shikshayatan School today?`
                    : "Hello! 😊 How can I assist you with Shri Shikshayatan School today?",
                userNameVal && userNameVal !== 'Guest'
                    ? `Namaste ${userNameVal}! 🙏 What can I help you find regarding our school today?`
                    : "Namaste! 🙏 What can I help you find regarding our school today?",
                userNameVal && userNameVal !== 'Guest'
                    ? `Hi ${userNameVal}! I'm here to help you with admissions, fees, notices, or timings. What's on your mind?`
                    : "Hi! I'm here to help you with admissions, fees, notices, or timings. What's on your mind?"
            ];
            const randomGreeting = greetingReplies[Math.floor(Math.random() * greetingReplies.length)];
            appendBotReply(randomGreeting, () => {
                showQuickActionButtons();
            });
            return;
        }

        // 2. Check for Off-Topic queries
        const offTopicKeywords = [
            'joke', 'recipe', 'cook', 'bake', 'cake', 'food', 'dinner', 'lunch', 'pasta', 'pizza', 'chocolate',
            'weather', 'news', 'president', 'prime minister', 'world cup', 'bitcoin', 'crypto', 'stock', 'finance',
            'poem', 'song', 'story', 'coding', 'translate', 'sing', 'dance', 'game', 'play'
        ];
        const offTopicPhrases = [
            'how to make', 'how do i make', 'write a', 'tell me a', 'who is the president', 'who is the prime minister',
            'are you single', 'do you love me', 'how old are you'
        ];
        const schoolTerms = [
            'school', 'admission', 'fee', 'notice', 'timing', 'class', 'syllabus', 'curriculum', 'uniform', 
            'transport', 'bus', 'principal', 'teacher', 'student', 'exam', 'test', 'result', 'alumni', 
            'sports', 'co-curricular', 'extracurricular', 'facility', 'facilities', 'contact', 'office', 'phone', 'email'
        ];

        const isOffTopic = offTopicKeywords.some(kw => cleanQuery.includes(kw)) || 
                            offTopicPhrases.some(phrase => cleanQuery.includes(phrase));
        const hasSchoolTerm = schoolTerms.some(term => cleanQuery.includes(term));

        if (isOffTopic && !hasSchoolTerm) {
            const offTopicReplies = [
                "I apologize, but my training is focused on assisting with queries about Shri Shikshayatan School. I don't have information on that topic, but feel free to ask about our school!",
                "I'm here to help with admissions, fees, notices, and other school-related topics. I won't be able to help with that query, but let me know if you have school-related questions!",
                "That seems to be outside my scope as the school's help desk assistant. I'd be happy to guide you on admissions, curriculum, timings, or notices instead!",
                "I can only provide information regarding Shri Shikshayatan School's programs and details. Please let me know if you have any questions about the school!"
            ];
            const randomOffTopic = offTopicReplies[Math.floor(Math.random() * offTopicReplies.length)];
            appendBotReply(randomOffTopic);
            return;
        }

        // 3. Conversational Flow Entry Points
        if (cleanQuery.includes('policy') || cleanQuery.includes('refund') || cleanQuery.includes('late fee') || cleanQuery.includes('payment mode') || cleanQuery.includes('card charge') || cleanQuery.includes('fine')) {
            startFeePolicyFlow();
            return;
        }

        if (cleanQuery.includes('fee') || cleanQuery.includes('tuition') || cleanQuery.includes('payment') || cleanQuery.includes('pay') || cleanQuery.includes('bill')) {
            startFeesFlow();
            return;
        }

        if (cleanQuery.includes('admission') || cleanQuery.includes('apply') || cleanQuery.includes('registration') || cleanQuery.includes('register')) {
            startAdmissionFlow();
            return;
        }

        if (cleanQuery.includes('timing') || cleanQuery.includes('timings') || cleanQuery.includes('hours') || cleanQuery.includes('time') || cleanQuery.includes('timetable')) {
            startTimingFlow();
            return;
        }

        if (cleanQuery.includes('holiday') || cleanQuery.includes('holidays') || cleanQuery.includes('calendar') || cleanQuery.includes('vacation') || cleanQuery.includes('summer break') || cleanQuery.includes('puja vacation') || cleanQuery.includes('winter break')) {
            if (cleanQuery.includes('tomorrow') || cleanQuery.includes('today') || parseDateFromQuery(cleanQuery)) {
                handleDirectHolidayQuery(cleanQuery, query);
                return;
            }
            startHolidayFlow();
            return;
        }

        if (cleanQuery.includes('course') || cleanQuery.includes('courses') || cleanQuery.includes('subjects') || cleanQuery.includes('curriculum')) {
            startCourseFlow();
            return;
        }

        if (cleanQuery.includes('infrastructure') || cleanQuery.includes('labs') || cleanQuery.includes('facilities') || cleanQuery.includes('facility') || cleanQuery.includes('library') || cleanQuery.includes('swimming')) {
            startInfrastructureFlow();
            return;
        }

        if (cleanQuery.includes('notice') || cleanQuery.includes('notices') || cleanQuery.includes('circular') || cleanQuery.includes('announcement') || cleanQuery.includes('bulletin')) {
            chatState = { flow: null, step: 0, section: null, data: {} };
            appendBotReply("I can help you check our latest class notices and school announcements! 📋 Please select your school section to check notices:", () => {
                showClassSectionButtons();
            });
            return;
        }

        // 4. Default: check fallback database matches
        getChatbotData(dataList => {
            const reply = matchChatResponse(query, dataList);
            if (reply) {
                if (reply.isLink) {
                    appendBotReply(reply.text, null, true, reply.response);
                } else {
                    appendBotReply(reply.response);
                }
            } else {
                appendBotReply("I want to make sure you get the right information, but I don't have the details for that in my current records. Please feel free to reach out to our dedicated support team or contact our school office directly. We are always happy to assist you!", null, false, null, true);
            }
        });
    }

    // ====================================================
    // Chatbot Conversational Flow Management Functions
    // ====================================================

    function showFlowButtons(options) {
        const btnContainer = document.createElement('div');
        btnContainer.className = 'chat-btn-container';
        
        options.forEach(opt => {
            const button = document.createElement('button');
            button.className = 'chat-btn';
            button.innerHTML = `<span>${opt.toUpperCase()}</span> <i class="ph ph-caret-right"></i>`;
            button.addEventListener('click', () => {
                const allButtons = btnContainer.querySelectorAll('.chat-btn');
                allButtons.forEach(b => {
                    b.disabled = true;
                    if (b === button) {
                        b.classList.add('selected');
                    } else {
                        b.classList.add('faded');
                    }
                });

                appendMessage('user', opt);
                saveChatMessage('user', opt);
                processQuery(opt);
            });
            btnContainer.appendChild(button);
        });

        messagesLog.appendChild(btnContainer);
        messagesLog.scrollTop = messagesLog.scrollHeight;
    }

    function appendLinkButton(text, url) {
        appendBotReply(text, null, true, url);
        chatState = { flow: null, step: 0, section: null, data: {} }; // Reset flow state
    }

    // --- Fees Flow ---
    function startFeesFlow() {
        chatState.flow = 'fees';
        chatState.step = 1;
        chatState.section = null;
        
        appendBotReply("I can guide you through our Fee Structure! 😊 Are you inquiring about the Junior Section (Nursery to Class V) or the Senior Section (Class VI to Class XII)?", () => {
            showFlowButtons(["Junior Section", "Senior Section", "Main Menu"]);
        });
    }

    function handleFeesFlow(cleanQuery, query) {
        if (cleanQuery.includes('policy') || cleanQuery.includes('refund')) {
            startFeePolicyFlow();
            return;
        }
        if (cleanQuery.includes('junior')) {
            chatState.section = 'junior';
            chatState.step = 2;
            appendBotReply("For the Junior Section (Nursery to V), the fees consist of Tuition Fees, Activity & ICT Fees, and Assessment Fees. There is also a one-time Admission Fee of ₹98,000.\n\nWhat would you like to know next?", () => {
                showFlowButtons(["Quarterly Fee Amounts", "Payment Deadlines", "Fee Policy & Refund", "Senior Section Fees", "Main Menu"]);
            });
        } else if (cleanQuery.includes('senior')) {
            chatState.section = 'senior';
            chatState.step = 2;
            appendBotReply("For the Senior Section (Class VI to XII), the fees consist of Tuition Fees, Activity & ICT Fees, Assessment Fees, and subject-specific Laboratory Fees for Class XI & XII electives.\n\nWhat would you like to know next?", () => {
                showFlowButtons(["Quarterly Fee Amounts", "Elective Lab Fees", "Payment Deadlines", "Fee Policy & Refund", "Junior Section Fees", "Main Menu"]);
            });
        } else if (cleanQuery.includes('amounts') || cleanQuery.includes('amount') || cleanQuery.includes('how much') || cleanQuery.includes('quarterly fee')) {
            if (chatState.section === 'junior') {
                appendBotReply("For the 2026-2027 Session, the total quarterly fees are:\n• Nursery, LKG, UKG, SKG: ₹25,675 per quarter (Tuition: ₹17,250)\n• Classes I to V: ₹26,275 per quarter (Tuition: ₹17,400)\n\nWould you like to check the payment deadlines or fee policy & refund details?", () => {
                    showFlowButtons(["Payment Deadlines", "Fee Policy & Refund", "Main Menu"]);
                });
            } else {
                appendBotReply("For the 2026-2027 Session, the total quarterly fees (without practicals) are:\n• Class VI to VIII: ₹28,075 per quarter\n• Class IX: ₹28,125 per quarter (excl. ₹350 registration)\n• Class X: ₹28,350 per quarter (excl. ₹575 board exam fee)\n• Class XI & XII: Tuition is ₹19,050 per quarter (plus core fees & elective lab fees).\n\nWould you like to check the elective lab fees, payment deadlines, or fee policy & refund details?", () => {
                    showFlowButtons(["Elective Lab Fees", "Payment Deadlines", "Fee Policy & Refund", "Main Menu"]);
                });
            }
        } else if (cleanQuery.includes('lab') || cleanQuery.includes('elective')) {
            appendBotReply("Lab fees for elective subjects in Class XI & XII (per quarter):\n• Computer Science / AI / Web App: ₹2,375\n• Physics / Chemistry / Biology / Home Sci: ₹1,250 to ₹1,375\n• Hindustani Music / Painting / Mass Media: ₹1,125\n• Physical Education / Psychology: ₹550\n\nWould you like to know the payment deadlines or fee policy & refund details?", () => {
                showFlowButtons(["Payment Deadlines", "Quarterly Fee Amounts", "Fee Policy & Refund", "Main Menu"]);
            });
        } else if (cleanQuery.includes('deadline') || cleanQuery.includes('deadlines') || cleanQuery.includes('when') || cleanQuery.includes('schedule') || cleanQuery.includes('schedules')) {
            appendBotReply("School fees are cleared on a quarterly basis within the first month of each quarter:\n• Quarter 1 (Apr - Jun): Due by April 15\n• Quarter 2 (Jul - Sep): Due by July 15\n• Quarter 3 (Oct - Dec): Due by October 15\n• Quarter 4 (Jan - Mar): Due by January 15\n\nAll fees are paid online through the parent portal.", () => {
                appendLinkButtonNoReset("For more information and to view the official fee booklet, please visit our Fee Structure page:", "fee-structure.html");
                setTimeout(() => {
                    appendBotReply("Would you also like to know about our online Payment Modes or Refund Policy?", () => {
                        showFlowButtons(["Fee Policy & Refund", "Main Menu"]);
                    });
                }, 1000);
            });
        } else {
            appendBotReply("I didn't quite get that. Please select one of the options below:", () => {
                if (chatState.step === 1) {
                    showFlowButtons(["Junior Section", "Senior Section", "Main Menu"]);
                } else if (chatState.section === 'junior') {
                    showFlowButtons(["Quarterly Fee Amounts", "Payment Deadlines", "Fee Policy & Refund", "Senior Section Fees", "Main Menu"]);
                } else {
                    showFlowButtons(["Quarterly Fee Amounts", "Elective Lab Fees", "Payment Deadlines", "Fee Policy & Refund", "Junior Section Fees", "Main Menu"]);
                }
            });
        }
    }

    // --- Fee Policy & Refund Flow ---
    function startFeePolicyFlow() {
        chatState.flow = 'feePolicy';
        chatState.step = 1;
        
        appendBotReply("I can help you understand our Fee Policies and Refund Rules! 📋 What information are you looking for?", () => {
            showFlowButtons(["Payment Modes", "Refund Policy", "Late Payment Fine", "Main Menu"]);
        });
    }

    function handleFeePolicyFlow(cleanQuery, query) {
        if (cleanQuery.includes('mode') || cleanQuery.includes('modes') || cleanQuery.includes('how to pay')) {
            appendBotReply("All fees are payable strictly online via Debit Card, Credit Card, or Net Banking on our portal with NIL transaction charges. RTGS / NEFT / IMPS bank transfers, draft, or cash payments are strictly NOT accepted.", () => {
                showFlowButtons(["Refund Policy", "Late Payment Fine", "Main Menu"]);
            });
        } else if (cleanQuery.includes('refund') || cleanQuery.includes('refunds')) {
            appendBotReply("Our Refund Rules are:\n1. Admission Fee is strictly non-refundable under any circumstances.\n2. General quarterly fees are non-refundable unless parent transfer or health withdrawal is requested in writing 30 days in advance (processed pro-rata).\n3. Duplicate online payments are fully refunded.", () => {
                showFlowButtons(["Payment Modes", "Late Payment Fine", "Main Menu"]);
            });
        } else if (cleanQuery.includes('late') || cleanQuery.includes('fine') || cleanQuery.includes('fines')) {
            appendBotReply("If quarterly fees are not paid within the scheduled date, late fines or re-admission charges apply. Continued non-payment will result in the student's name being struck off from the register.", () => {
                showFlowButtons(["Payment Modes", "Refund Policy", "Main Menu"]);
            });
        } else {
            appendBotReply("I didn't quite get that. Please select one of the options below:", () => {
                showFlowButtons(["Payment Modes", "Refund Policy", "Late Payment Fine", "Main Menu"]);
            });
        }
        
        if (cleanQuery.includes('mode') || cleanQuery.includes('refund') || cleanQuery.includes('late') || cleanQuery.includes('fine')) {
            setTimeout(() => {
                appendLinkButton("For more policy guidelines and details, visit our Fee Policy page:", "fee-policy.html");
            }, 800);
        }
    }

    // --- Admission Flow ---
    function startAdmissionFlow() {
        chatState.flow = 'admission';
        chatState.step = 1;
        chatState.section = null;
        
        appendBotReply("I would love to help you with the Admission Procedure! 😊 Which section are you interested in?", () => {
            showFlowButtons(["Junior Section", "Senior Section", "Main Menu"]);
        });
    }

    function handleAdmissionFlow(cleanQuery, query) {
        if (cleanQuery.includes('policy') || cleanQuery.includes('refund')) {
            startFeePolicyFlow();
            return;
        }
        if (cleanQuery.includes('junior')) {
            chatState.section = 'junior';
            chatState.step = 2;
            appendBotReply("For the Junior Section (Nursery to Class V), admission is based on age eligibility and document submission. For Nursery, the child must be 3+ years old. Registration is done fully online.\n\nWhat would you like to know next?", () => {
                showFlowButtons(["Required Documents", "Registration Process", "Fee Structure", "Main Menu"]);
            });
        } else if (cleanQuery.includes('senior')) {
            chatState.section = 'senior';
            chatState.step = 2;
            appendBotReply("For the Senior Section (Class VI to XII), admissions depend on seat availability and academic merit. For Class XI, admissions open immediately after Class X Board results for Science, Commerce, and Humanities.\n\nWhat would you like to know next?", () => {
                showFlowButtons(["Required Documents", "Registration Process", "Subject Streams", "Main Menu"]);
            });
        } else if (cleanQuery.includes('document') || cleanQuery.includes('documents')) {
            appendBotReply("You will need to submit:\n1. Attested copy of Birth Certificate (Municipal Corporation)\n2. Proof of Address (Passport/Aadhaar/Utility Bill)\n3. Recent passport size photograph of the child and parents\n4. Report card of the previous class (if applicable)\n5. Transfer Certificate (TC) from the previous school.", () => {
                showFlowButtons(["Registration Process", "Main Menu"]);
            });
        } else if (cleanQuery.includes('process') || cleanQuery.includes('procedure') || cleanQuery.includes('how to apply') || cleanQuery.includes('apply') || cleanQuery.includes('registration')) {
            appendBotReply("Our online registration process is simple:\n1. Fill the registration form on our school portal.\n2. Upload scanned copies of the required documents.\n3. Pay the registration processing fee online.\n4. You will receive an email confirmation with further interaction dates.", () => {
                appendLinkButton("For more information and to start the online application, click below:", "procedure.html");
            });
        } else if (cleanQuery.includes('subject') || cleanQuery.includes('stream') || cleanQuery.includes('streams') || cleanQuery.includes('courses')) {
            appendBotReply("We offer three streams in Class XI & XII:\n• Science: Physics, Chemistry, Mathematics, Biology, Computer Science, Economics\n• Commerce: Accountancy, Business Studies, Economics, Mathematics, Entrepreneurship\n• Humanities: Political Science, History, Geography, Sociology, Psychology, English\n\nEnglish is compulsory for all streams.", () => {
                showFlowButtons(["Required Documents", "Registration Process", "Main Menu"]);
            });
        } else if (cleanQuery.includes('fee') || cleanQuery.includes('fees')) {
            startFeesFlow();
        } else {
            appendBotReply("I didn't quite get that. Please select one of the options below:", () => {
                if (chatState.step === 1) {
                    showFlowButtons(["Junior Section", "Senior Section", "Main Menu"]);
                } else if (chatState.section === 'junior') {
                    showFlowButtons(["Required Documents", "Registration Process", "Fee Structure", "Main Menu"]);
                } else {
                    showFlowButtons(["Required Documents", "Registration Process", "Subject Streams", "Main Menu"]);
                }
            });
        }
    }

    // --- Timings Flow ---
    function startTimingFlow() {
        chatState.flow = 'timing';
        chatState.step = 1;
        chatState.section = null;
        
        appendBotReply("I can guide you through our school timings! ⏰ Are you inquiring about the Primary Section (Nursery to Class V) or the Secondary Section (Class VI to Class XII)?", () => {
            showFlowButtons(["Primary (Nursery - V)", "Secondary (VI - XII)", "Main Menu"]);
        });
    }

    function handleTimingFlow(cleanQuery, query) {
        if (chatState.step === 1) {
            if (cleanQuery.includes('primary')) {
                chatState.section = 'primary';
                chatState.step = 2;
                appendBotReply("Please select your class to check timings:", () => {
                    showFlowButtons(["Nursery", "LKG & UKG", "SKG", "Class I", "Class II", "Class III - V", "Main Menu"]);
                });
            } else if (cleanQuery.includes('secondary')) {
                chatState.section = 'secondary';
                chatState.step = 2;
                appendBotReply("Please select your class level to check timings:", () => {
                    showFlowButtons(["Class VI - X", "Class XI - XII", "Main Menu"]);
                });
            } else {
                appendBotReply("Please select one of the sections below:", () => {
                    showFlowButtons(["Primary (Nursery - V)", "Secondary (VI - XII)", "Main Menu"]);
                });
            }
            return;
        }
        
        if (chatState.step === 2) {
            let classTiming = "";
            let matched = false;
            
            if (cleanQuery.includes('nursery')) {
                classTiming = "Class Nursery: 10:00 A.M. to 11:30 A.M.";
                matched = true;
            } else if (cleanQuery.includes('lkg') || cleanQuery.includes('ukg')) {
                classTiming = "Classes LKG & UKG: 08:50 A.M. to 12:00 NOON";
                matched = true;
            } else if (cleanQuery.includes('skg')) {
                classTiming = "Class SKG: 08:50 A.M. to 01:05 P.M.";
                matched = true;
            } else if (cleanQuery.includes('class i') && !cleanQuery.includes('class ii') && !cleanQuery.includes('iii') && !cleanQuery.includes('xi')) {
                classTiming = "Class I: 08:50 A.M. to 01:35 P.M.";
                matched = true;
            } else if (cleanQuery.includes('class ii') && !cleanQuery.includes('xii')) {
                classTiming = "Class II: 07:50 A.M. to 01:05 P.M.";
                matched = true;
            } else if (cleanQuery.includes('iii') || cleanQuery.includes('class iii') || cleanQuery.includes('iv') || cleanQuery.includes('v')) {
                classTiming = "Classes III to V: 07:50 A.M. to 01:20 P.M.";
                matched = true;
            } else if (cleanQuery.includes('vi') || cleanQuery.includes('x') || cleanQuery.includes('6') || cleanQuery.includes('10')) {
                classTiming = "Classes VI to X: 08:30 A.M. to 02:55 P.M.";
                matched = true;
            } else if (cleanQuery.includes('xi') || cleanQuery.includes('xii') || cleanQuery.includes('11') || cleanQuery.includes('12')) {
                classTiming = "Classes XI & XII: 08:30 A.M. to 02:05 P.M.";
                matched = true;
            }
            
            if (matched) {
                chatState.step = 3;
                appendBotReply(`For ${cleanQuery.toUpperCase()}, the school timing is **${classTiming.split(': ').slice(1).join(': ')}**.\n\nWould you also like to know about our Gate Arrival timings?`, () => {
                    showFlowButtons(["Yes, show Gate Timings", "No, back to Section", "Main Menu"]);
                });
            } else {
                appendBotReply("I didn't quite catch that. Please select a valid class from the list:", () => {
                    if (chatState.section === 'primary') {
                        showFlowButtons(["Nursery", "LKG & UKG", "SKG", "Class I", "Class II", "Class III - V", "Main Menu"]);
                    } else {
                        showFlowButtons(["Class VI - X", "Class XI - XII", "Main Menu"]);
                    }
                });
            }
            return;
        }
        
        if (chatState.step === 3) {
            if (cleanQuery.includes('yes') || cleanQuery.includes('gate')) {
                appendBotReply("Here are the Gate Entry Timings for student arrivals:\n• **Nursery**: Gate opens at 09:50 A.M. and closes at 10:05 A.M.\n• **LKG to Class I**: Gate opens at 08:30 A.M. and closes at 08:55 A.M.\n• **Class II to V**: Gate opens at 07:30 A.M. and closes at 07:55 A.M.\n• **Secondary (VI to XII)**: Gate opens at 08:00 A.M. and closes at 08:25 A.M.", () => {
                    appendLinkButton("For full details and guidelines, visit our School Timing page:", "school-timing.html");
                });
            } else if (cleanQuery.includes('no') || cleanQuery.includes('back')) {
                chatState.step = 2;
                appendBotReply("Back to section. Please select your class:", () => {
                    if (chatState.section === 'primary') {
                        showFlowButtons(["Nursery", "LKG & UKG", "SKG", "Class I", "Class II", "Class III - V", "Main Menu"]);
                    } else {
                        showFlowButtons(["Class VI - X", "Class XI - XII", "Main Menu"]);
                    }
                });
            } else {
                appendBotReply("Please select one of the options below:", () => {
                    showFlowButtons(["Yes, show Gate Timings", "No, back to Section", "Main Menu"]);
                });
            }
            return;
        }
    }

    // --- School Holiday & Calendar Flow ---
    const schoolHolidaysList = [
        { date: "2026-04-03", name: "Good Friday" },
        { date: "2026-04-14", name: "Ambedkar Jayanti" },
        { date: "2026-04-15", name: "Bengali New Year (Noboborsho)" },
        { date: "2026-05-01", name: "May Day" },
        { date: "2026-05-08", name: "Rabindra Jayanti" },
        { date: "2026-05-25", name: "Budha Purnima" },
        { date: "2026-06-16", name: "Id-ul-Zuha (Bakrid)" },
        { date: "2026-07-17", name: "Muharram" },
        { date: "2026-08-15", name: "Independence Day" },
        { date: "2026-08-27", name: "Janmashtami" },
        { date: "2026-09-05", name: "Fateha-Dwaz-Daham" },
        { date: "2026-10-02", name: "Gandhi Jayanti" },
        { date: "2026-10-11", name: "Mahalaya" },
        { date: "2026-10-17", name: "Maha Saptami" },
        { date: "2026-10-18", name: "Maha Ashtami" },
        { date: "2026-10-19", name: "Maha Navami" },
        { date: "2026-10-20", name: "Vijaya Dashami (Dussehra)" },
        { date: "2026-10-31", name: "Kali Puja / Diwali" },
        { date: "2026-11-08", name: "Bhatri Dwitiya (Bhai Dooj)" },
        { date: "2026-11-14", name: "Guru Nanak Birthday" },
        { date: "2026-12-25", name: "Christmas Day" },
        { date: "2027-01-01", name: "New Year's Day" },
        { date: "2027-01-23", name: "Netaji Birthday" },
        { date: "2027-01-26", name: "Republic Day" },
        { date: "2027-02-11", name: "Saraswati Puja (Vasant Panchami)" },
        { date: "2027-03-24", name: "Holi (Doljatra)" }
    ];

    function checkHolidayForDate(dateObj) {
        const yr = dateObj.getFullYear();
        const mo = String(dateObj.getMonth() + 1).padStart(2, '0');
        const dy = String(dateObj.getDate()).padStart(2, '0');
        const dateStr = `${yr}-${mo}-${dy}`;
        
        const exactMatch = schoolHolidaysList.find(h => h.date === dateStr);
        if (exactMatch) return exactMatch;
        
        // Check vacations: May 1 to May 31
        if (dateObj.getMonth() === 4) {
            return { name: "Summer Vacation" };
        }
        
        // October 15 to November 15
        const month = dateObj.getMonth();
        const dateVal = dateObj.getDate();
        if ((month === 9 && dateVal >= 15) || (month === 10 && dateVal <= 15)) {
            return { name: "Puja Vacation" };
        }
        
        // December 24 to January 3
        if ((month === 11 && dateVal >= 24) || (month === 0 && dateVal <= 3)) {
            return { name: "Winter Vacation" };
        }
        
        // Sunday
        if (dateObj.getDay() === 0) {
            return { name: "Sunday" };
        }
        
        return null;
    }

    function formatDateFriendly(dateObj) {
        const day = dateObj.getDate();
        const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
        const month = monthNames[dateObj.getMonth()];
        const weekdayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
        const weekday = weekdayNames[dateObj.getDay()];
        
        let suffix = "th";
        if (day === 1 || day === 21 || day === 31) suffix = "st";
        else if (day === 2 || day === 22) suffix = "nd";
        else if (day === 3 || day === 23) suffix = "rd";
        
        return `${day}${suffix} ${month}, ${weekday}`;
    }

    function parseDateFromQuery(query) {
        const clean = query.toLowerCase().trim();
        const monthNames = ["january", "february", "march", "april", "may", "june", "july", "august", "september", "october", "november", "december"];
        const monthAbbreviations = ["jan", "feb", "mar", "apr", "may", "jun", "jul", "aug", "sep", "oct", "nov", "dec"];
        
        let matchedMonth = -1;
        let matchedDay = -1;
        
        for (let i = 0; i < 12; i++) {
            if (clean.includes(monthNames[i])) {
                matchedMonth = i;
                break;
            }
        }
        if (matchedMonth === -1) {
            for (let i = 0; i < 12; i++) {
                if (clean.includes(monthAbbreviations[i])) {
                    matchedMonth = i;
                    break;
                }
            }
        }
        
        const numbers = clean.match(/\d+/);
        if (numbers) {
            matchedDay = parseInt(numbers[0]);
        }
        
        if (matchedMonth !== -1 && matchedDay !== -1 && matchedDay >= 1 && matchedDay <= 31) {
            const targetDate = new Date();
            targetDate.setMonth(matchedMonth);
            targetDate.setDate(matchedDay);
            const today = new Date();
            if (targetDate.getMonth() < today.getMonth() || (targetDate.getMonth() === today.getMonth() && targetDate.getDate() < today.getDate())) {
                targetDate.setFullYear(today.getFullYear() + 1);
            } else {
                targetDate.setFullYear(today.getFullYear());
            }
            return targetDate;
        }
        
        return null;
    }

    function handleDirectHolidayQuery(cleanQuery, query) {
        let targetDate = new Date();
        
        if (cleanQuery.includes('tomorrow')) {
            targetDate.setDate(targetDate.getDate() + 1);
        }
        
        const parsedDate = parseDateFromQuery(cleanQuery);
        if (parsedDate) {
            targetDate = parsedDate;
        }
        
        const friendlyDate = formatDateFriendly(targetDate);
        const holiday = checkHolidayForDate(targetDate);
        
        if (holiday) {
            if (cleanQuery.includes('tomorrow')) {
                appendBotReply(`Yes, it's a holiday tomorrow. Tomorrow is ${friendlyDate} (${holiday.name}).`);
            } else {
                appendBotReply(`Yes, it's a holiday. ${friendlyDate} is ${holiday.name}.`);
            }
        } else {
            if (cleanQuery.includes('tomorrow')) {
                appendBotReply(`No, there is no holiday tomorrow (${friendlyDate}).`);
            } else {
                appendBotReply(`No, there is no holiday on ${friendlyDate}.`);
            }
        }
        
        setTimeout(() => {
            appendLinkButton("To download the complete signed Holiday List circular, visit our School Calendar page:", "school-calendar.html");
        }, 1000);
    }

    function appendLinkButtonNoReset(text, url) {
        appendBotReply(text, null, true, url);
    }

    function startHolidayFlow() {
        chatState.flow = 'holiday';
        chatState.step = 1;
        
        appendBotReply("We have three major seasonal breaks in our academic calendar. Which vacation would you like to know about?", () => {
            showFlowButtons(["Summer Vacation", "Puja Vacation", "Winter Break", "Main Menu"]);
        });
    }

    function handleHolidayFlow(cleanQuery, query) {
        if (cleanQuery === 'yes' || cleanQuery === 'yeah' || cleanQuery === 'sure' || cleanQuery === 'ok' || cleanQuery === 'okay') {
            appendBotReply("Which vacation break would you like to know about?", () => {
                showFlowButtons(["Summer Vacation", "Puja Vacation", "Winter Break", "Main Menu"]);
            });
            return;
        }

        if (cleanQuery === 'no' || cleanQuery === 'nope' || cleanQuery === 'nothing' || cleanQuery === 'cancel') {
            chatState = { flow: null, step: 0, section: null, data: {} };
            appendBotReply("Alright! Let me know if you have any other questions.", () => {
                showQuickActionButtons();
            });
            return;
        }

        let answer = "";
        let nextOptions = [];
        
        if (cleanQuery.includes('summer')) {
            answer = "Summer Vacation is our longest term break, scheduled from mid-May to mid-June (approximately 4 weeks / 29 Days) for student relief from the summer heat.";
            nextOptions = ["Puja Vacation", "Winter Break", "Main Menu"];
        } else if (cleanQuery.includes('puja')) {
            answer = "Puja Vacation is our festive autumn break, scheduled in October—November (approximately 4 weeks / 28 Days) in celebration of Durga Puja and Dussehra.";
            nextOptions = ["Summer Vacation", "Winter Break", "Main Menu"];
        } else if (cleanQuery.includes('winter') || cleanQuery.includes('christmas') || cleanQuery.includes('break')) {
            answer = "Winter Break takes place in late December to early January (approximately 1 week / 11 Days) for Christmas and New Year celebrations.";
            nextOptions = ["Summer Vacation", "Puja Vacation", "Main Menu"];
        } else {
            appendBotReply("I didn't quite get that. Please select one of the options below:", () => {
                showFlowButtons(["Summer Vacation", "Puja Vacation", "Winter Break", "Main Menu"]);
            });
            return;
        }

        appendBotReply(`${answer}\n\nWould you like to know more about our other seasonal breaks?`, () => {
            showFlowButtons(nextOptions);
        });

        setTimeout(() => {
            appendLinkButtonNoReset("To download the complete signed Holiday List circular, visit our School Calendar page:", "school-calendar.html");
        }, 1000);
    }

    // --- Course Details Flow ---
    function startCourseFlow() {
        chatState.flow = 'course';
        chatState.step = 1;
        
        appendBotReply("Explore our comprehensive academic curriculum under CBSE affiliation! 📚 Which academic level details do you want to see?", () => {
            showFlowButtons(["Primary (Nursery-V)", "Secondary (VI-X)", "Senior Secondary (XI-XII)", "Main Menu"]);
        });
    }

    function handleCourseFlow(cleanQuery, query) {
        if (cleanQuery.includes('primary') || cleanQuery.includes('nursery')) {
            appendBotReply("For Nursery to Class V, we follow a child-centric interactive learning program focusing on Language, Math, Environmental Science (EVS), Performing Arts, and Physical Development.", () => {
                showFlowButtons(["Secondary (VI-X)", "Senior Secondary (XI-XII)", "Main Menu"]);
            });
        } else if (cleanQuery.includes('secondary') && !cleanQuery.includes('senior')) {
            appendBotReply("For Classes VI to X, the academic curriculum matches CBSE guidelines and covers English, Second Language (Bengali/Hindi), Mathematics, Science, Social Studies, and Information Technology.", () => {
                showFlowButtons(["Primary (Nursery-V)", "Senior Secondary (XI-XII)", "Main Menu"]);
            });
        } else if (cleanQuery.includes('senior') || cleanQuery.includes('xi') || cleanQuery.includes('xii')) {
            appendBotReply("For Class XI & XII, we offer three specialized subject streams:\n• Science: Physics, Chemistry, Math, Biology, Computer Science, Economics\n• Commerce: Accountancy, Business Studies, Economics, Math, Entrepreneurship\n• Humanities: History, Political Science, Geography, Sociology, Psychology, English", () => {
                showFlowButtons(["Primary (Nursery-V)", "Secondary (VI-X)", "Main Menu"]);
            });
        } else {
            appendBotReply("I didn't quite get that. Please select one of the options below:", () => {
                showFlowButtons(["Primary (Nursery-V)", "Secondary (VI-X)", "Senior Secondary (XI-XII)", "Main Menu"]);
            });
        }

        if (cleanQuery.includes('primary') || cleanQuery.includes('secondary') || cleanQuery.includes('senior') || cleanQuery.includes('nursery') || cleanQuery.includes('xi') || cleanQuery.includes('xii')) {
            setTimeout(() => {
                appendLinkButton("For full syllabus details and Streams combination criteria, visit our Procedure page:", "procedure.html");
            }, 800);
        }
    }

    // --- Infrastructure Flow ---
    function startInfrastructureFlow() {
        chatState.flow = 'infrastructure';
        chatState.step = 1;
        
        appendBotReply("Explore our modern campus and infrastructure! 🏫 Which facilities would you like to know about?", () => {
            showFlowButtons(["Academic Labs & Tech", "Library & Arts", "Sports & Wellness", "Main Menu"]);
        });
    }

    function handleInfrastructureFlow(cleanQuery, query) {
        if (cleanQuery.includes('labs') || cleanQuery.includes('lab') || cleanQuery.includes('tech') || cleanQuery.includes('academic')) {
            appendBotReply("We offer state-of-the-art academic facilities:\n• 5 specialized Computer Labs\n• Tablet-based teaching in Middle School classrooms\n• Modern Physics, Chemistry, Biology, Mathematics, and Geography labs.", () => {
                showFlowButtons(["Library & Arts", "Sports & Wellness", "Main Menu"]);
            });
        } else if (cleanQuery.includes('library') || cleanQuery.includes('arts') || cleanQuery.includes('art')) {
            appendBotReply("Our library is stocked with over 30,000 books, periodicals, and digital resources. For performing arts, we have the Kalabhavan art center and a large school auditorium for cultural events.", () => {
                showFlowButtons(["Academic Labs & Tech", "Sports & Wellness", "Main Menu"]);
            });
        } else if (cleanQuery.includes('sports') || cleanQuery.includes('wellness') || cleanQuery.includes('sport')) {
            appendBotReply("Student wellness and sports are key priorities:\n• Fully indoor heated Swimming Pool\n• Basketball courts and athletic training areas\n• Qualified medical personnel and rest rooms for student care.", () => {
                appendLinkButton("For more campus details, visit our Infrastructure page:", "infrastructure.html");
            });
        } else {
            appendBotReply("I didn't quite get that. Please select one of the options below:", () => {
                showFlowButtons(["Academic Labs & Tech", "Library & Arts", "Sports & Wellness", "Main Menu"]);
            });
        }
    }

    function appendBotReply(text, callback, isLink = false, linkUrl = null, showContactBtn = false) {
        // 1. Show Typing Indicator
        const typingId = showTypingIndicator();
        
        setTimeout(() => {
            // 2. Hide Typing Indicator
            removeTypingIndicator(typingId);
            
            // 3. Append message
            appendMessage('bot', text, true, isLink, linkUrl, showContactBtn);
            saveChatMessage('bot', text, isLink, linkUrl, showContactBtn);
            
            if (callback) callback();
        }, 650);
    }

    function showQuickActionButtons() {
        const btnContainer = document.createElement('div');
        btnContainer.className = 'chat-btn-container';
        
        const buttons = [
            { text: "ADMISSION ENQUIRY", query: "Admission Enquiry" },
            { text: "FEE STRUCTURE", query: "Fee Structure" },
            { text: "COURSE DETAILS", query: "Course Details" }
        ];

        buttons.forEach(btn => {
            const button = document.createElement('button');
            button.className = 'chat-btn';
            button.innerHTML = `<span>${btn.text}</span> <i class="ph ph-caret-right"></i>`;
            button.addEventListener('click', () => {
                const allButtons = btnContainer.querySelectorAll('.chat-btn');
                allButtons.forEach(b => {
                    b.disabled = true;
                    if (b === button) {
                        b.classList.add('selected');
                    } else {
                        b.classList.add('faded');
                    }
                });

                appendMessage('user', btn.query);
                if (!userName) {
                    pendingQuery = btn.query;
                    saveChatMessage('user', btn.query);
                    appendBotReply("Before we proceed, could you please tell me your name?");
                } else {
                    saveChatMessage('user', btn.query);
                    processQuery(btn.query);
                }
            });
            btnContainer.appendChild(button);
        });

        messagesLog.appendChild(btnContainer);
        messagesLog.scrollTop = messagesLog.scrollHeight;
    }

    function showClassSectionButtons() {
        const btnContainer = document.createElement('div');
        btnContainer.className = 'chat-btn-container';
        
        const sections = [
            { text: "Class I - V (Primary)", section: "junior" },
            { text: "Class VI - XII (Secondary)", section: "senior" }
        ];

        sections.forEach(sec => {
            const button = document.createElement('button');
            button.className = 'chat-btn';
            button.innerHTML = `<span>${sec.text}</span> <i class="ph ph-caret-right"></i>`;
            button.addEventListener('click', () => {
                const allButtons = btnContainer.querySelectorAll('.chat-btn');
                allButtons.forEach(b => {
                    b.disabled = true;
                    if (b === button) {
                        b.classList.add('selected');
                    } else {
                        b.classList.add('faded');
                    }
                });

                appendMessage('user', sec.text);
                saveChatMessage('user', sec.text);
                
                appendBotReply("Please select your specific class:", () => {
                    showClassDetailButtons(sec.section);
                });
            });
            btnContainer.appendChild(button);
        });

        messagesLog.appendChild(btnContainer);
        messagesLog.scrollTop = messagesLog.scrollHeight;
    }

    function showClassDetailButtons(section) {
        const btnContainer = document.createElement('div');
        btnContainer.className = 'chat-btn-container';
        
        let classesList = [];
        if (section === 'junior') {
            classesList = ['Class I', 'Class II', 'Class III', 'Class IV', 'Class V'];
        } else {
            classesList = ['Class VI', 'Class VII', 'Class VIII', 'Class IX', 'Class X', 'Class XI', 'Class XII'];
        }

        classesList.forEach(cls => {
            const button = document.createElement('button');
            button.className = 'chat-btn';
            button.innerHTML = `<span>${cls}</span> <i class="ph ph-caret-right"></i>`;
            button.addEventListener('click', () => {
                const allButtons = btnContainer.querySelectorAll('.chat-btn');
                allButtons.forEach(b => {
                    b.disabled = true;
                    if (b === button) {
                        b.classList.add('selected');
                    } else {
                        b.classList.add('faded');
                    }
                });

                appendMessage('user', cls);
                saveChatMessage('user', cls);
                
                const page = section === 'junior' ? 'junior.html' : 'senior.html';
                const url = `${page}?class=${encodeURIComponent(cls)}`;
                
                appendBotReply(`Here are the notices for ${cls}. Click the button below to view them:`, null, true, url);
            });
            btnContainer.appendChild(button);
        });

        messagesLog.appendChild(btnContainer);
        messagesLog.scrollTop = messagesLog.scrollHeight;
    }

    function appendMessage(sender, text, showSpeak = false, isLink = false, linkUrl = null, showContactBtn = false) {
        // Create container wrapper
        const msgContainer = document.createElement('div');
        msgContainer.className = `chat-msg-container ${sender}`;
        
        // 1. Create avatar icon
        const avatarDiv = document.createElement('div');
        avatarDiv.className = 'chat-avatar';
        if (sender === 'bot') {
            avatarDiv.innerHTML = '<img src="assets/sss_logo.png" alt="SSS Logo" class="bot-avatar-img">';
        } else {
            avatarDiv.innerHTML = '<i class="ph ph-user"></i>';
        }
        
        // 2. Create message bubble
        const msgDiv = document.createElement('div');
        msgDiv.className = `chat-msg ${sender}`;
        
        // Escape HTML
        let msgHtml = escapeHtml(text);
        
        if (showSpeak && 'speechSynthesis' in window) {
            msgHtml += ` <button class="chat-tts-btn" onclick="speakText('${text.replace(/'/g, "\\'")}')" title="Read aloud"><i class="ph ph-speaker-high"></i></button>`;
        }
        
        msgDiv.innerHTML = msgHtml;

        if (isLink && linkUrl) {
            const linkBtn = document.createElement('a');
            linkBtn.className = 'chat-link-btn';
            linkBtn.href = linkUrl;
            linkBtn.target = '_blank';
            
            let btnText = "Open Link";
            const lowerUrl = linkUrl.toLowerCase();
            if (lowerUrl.includes("fee-structure.html")) btnText = "FEE STRUCTURE";
            else if (lowerUrl.includes("fee-policy.html")) btnText = "FEE POLICY & SCHEDULE";
            else if (lowerUrl.includes("procedure.html")) btnText = "ADMISSION PROCEDURE";
            else if (lowerUrl.includes("school-timing.html")) btnText = "SCHOOL TIMINGS";
            else if (lowerUrl.includes("school-calendar.html")) btnText = "SCHOOL CALENDAR";
            else if (lowerUrl.includes("infrastructure.html")) btnText = "INFRASTRUCTURE";
            else if (lowerUrl.includes("junior.html")) btnText = "JUNIOR NOTICES";
            else if (lowerUrl.includes("senior.html")) btnText = "SENIOR NOTICES";
            else if (lowerUrl.includes("transfer-certificates.html")) btnText = "TRANSFER CERTIFICATES";
            else if (lowerUrl.includes("history.html")) btnText = "SCHOOL HISTORY";
            
            linkBtn.innerHTML = `<span>${btnText}</span> <i class="ph ph-arrow-square-out"></i>`;
            msgDiv.appendChild(document.createElement('br'));
            msgDiv.appendChild(linkBtn);
        }

        if (showContactBtn) {
            const contactBtn = document.createElement('button');
            contactBtn.className = 'chat-btn';
            contactBtn.style.marginTop = '0.5rem';
            contactBtn.innerHTML = `<span>CONTACT US</span> <i class="ph ph-phone"></i>`;
            contactBtn.addEventListener('click', () => {
                const contactsSection = document.getElementById('contacts');
                if (contactsSection) {
                    contactsSection.scrollIntoView({ behavior: 'smooth' });
                } else {
                    window.location.href = 'index.html#contacts';
                }
            });
            msgDiv.appendChild(document.createElement('br'));
            msgDiv.appendChild(contactBtn);
        }
        
        // Append elements to container
        if (sender === 'bot') {
            msgContainer.appendChild(avatarDiv);
            msgContainer.appendChild(msgDiv);
        } else {
            msgContainer.appendChild(msgDiv);
            msgContainer.appendChild(avatarDiv);
        }

        messagesLog.appendChild(msgContainer);
        
        // 3. 🤖 Conversation Feedback & Rating System :)
        // Only show rating buttons for actual bot answers
        const lowerText = text.toLowerCase();
        const isQuestionAnswer = sender === 'bot' && 
            !lowerText.includes("namaste") && 
            !lowerText.includes("please tell me your name") && 
            !lowerText.includes("privacy is fully respected") && 
            !lowerText.includes("thank you for visiting") && 
            !lowerText.includes("inactive for a while");

        if (isQuestionAnswer) {
            const msgIndex = chatHistory.length - 1; // get index in chatHistory
            
            const feedbackContainer = document.createElement('div');
            feedbackContainer.className = 'chat-feedback-container';
            feedbackContainer.innerHTML = `
                <button class="chat-feedback-btn up" title="Helpful"><i class="ph ph-thumbs-up"></i></button>
                <button class="chat-feedback-btn down" title="Not helpful"><i class="ph ph-thumbs-down"></i></button>
            `;
            
            const upBtn = feedbackContainer.querySelector('.up');
            const downBtn = feedbackContainer.querySelector('.down');
            
            // Re-apply active class if history has rating
            if (chatHistory[msgIndex]) {
                if (chatHistory[msgIndex].rating === 1) upBtn.classList.add('active');
                if (chatHistory[msgIndex].rating === -1) downBtn.classList.add('active');
            }
            
            upBtn.addEventListener('click', () => {
                const isActive = upBtn.classList.contains('active');
                upBtn.classList.toggle('active', !isActive);
                downBtn.classList.remove('active');
                
                const ratingValue = !isActive ? 1 : 0;
                logChatRatingToServer(msgIndex, ratingValue);
            });
            
            downBtn.addEventListener('click', () => {
                const isActive = downBtn.classList.contains('active');
                downBtn.classList.toggle('active', !isActive);
                upBtn.classList.remove('active');
                
                const ratingValue = !isActive ? -1 : 0;
                logChatRatingToServer(msgIndex, ratingValue);
            });
            
            messagesLog.appendChild(feedbackContainer);
        }

        messagesLog.scrollTop = messagesLog.scrollHeight;
    }

    function showTypingIndicator() {
        const msgContainer = document.createElement('div');
        msgContainer.className = 'chat-msg-container bot typing-container';
        const uniqueId = 'typing-' + Date.now();
        msgContainer.id = uniqueId;
        
        const avatarDiv = document.createElement('div');
        avatarDiv.className = 'chat-avatar';
        avatarDiv.innerHTML = '<img src="assets/sss_logo.png" alt="SSS Logo" class="bot-avatar-img">';
        
        const indicatorDiv = document.createElement('div');
        indicatorDiv.className = 'chat-msg bot typing-indicator';
        indicatorDiv.innerHTML = `
            <div class="typing-dot"></div>
            <div class="typing-dot"></div>
            <div class="typing-dot"></div>
        `;
        
        msgContainer.appendChild(avatarDiv);
        msgContainer.appendChild(indicatorDiv);
        
        messagesLog.appendChild(msgContainer);
        messagesLog.scrollTop = messagesLog.scrollHeight;
        return uniqueId;
    }

    function removeTypingIndicator(id) {
        const el = document.getElementById(id);
        if (el) el.remove();
    }

    function saveChatMessage(sender, text, isLink = false, linkUrl = null, showContactBtn = false) {
        const msgIndex = chatHistory.length;
        chatHistory.push({ sender, text, isLink, linkUrl, showContactBtn, rating: 0 });
        sessionStorage.setItem('chat_history', JSON.stringify(chatHistory));
        
        // Log to backend
        logChatMessageToServer(sender, text, msgIndex);
    }

    function startVoiceRecognition() {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (!SpeechRecognition) {
            alert("Voice dictation is not supported in this browser. Please use Google Chrome.");
            return;
        }
        const recognition = new SpeechRecognition();
        recognition.continuous = false;
        recognition.lang = 'en-US';
        recognition.interimResults = false;
        
        const micIcon = document.getElementById('chatbot-voice-btn');
        const micI = micIcon.querySelector('i');
        micIcon.classList.add('recording');
        if (micI) micI.className = 'ph-fill ph-microphone';
        
        recognition.onresult = function(event) {
            const resultText = event.results[0][0].transcript;
            textInput.value = resultText;
            micIcon.classList.remove('recording');
            if (micI) micI.className = 'ph ph-microphone';
            
            // Auto submit
            setTimeout(() => {
                handleChatSubmit();
            }, 500);
        };
        
        recognition.onerror = function() {
            micIcon.classList.remove('recording');
            if (micI) micI.className = 'ph ph-microphone';
        };
        
        recognition.onend = function() {
            micIcon.classList.remove('recording');
            if (micI) micI.className = 'ph ph-microphone';
        };
        
        recognition.start();
    }
}

function speakText(text) {
    if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
        
        // Strip out URL links for clean speech output
        let cleanText = text.replace(/https?:\/\/\S+/g, 'link');
        const utterance = new SpeechSynthesisUtterance(cleanText);
        window.speechSynthesis.speak(utterance);
    }
}

function getChatbotData(callback) {
    const isLocal = window.location.protocol === 'file:';
    const fallbackData = [
        {
            query: "Admission Procedure",
            keywords: "admission procedure, admission criteria, how to apply, registration, documents required, age criteria, admission, admissions, register, apply, document, documents, age, criteria",
            response: "To apply for admission, visit the Admission Procedure page: https://www.shrishikshayatanschool.com/ssswebsite/procedure.html. The process includes online registration, submitting documents (birth certificate, address proof), and meeting age requirements for classes."
        },
        {
            query: "Fee Structure",
            keywords: "fee structure, fees list, admission fee, tuition fee, fee amount",
            response: "You can view the detailed fee structure for different classes on our Fee Structure page: https://www.shrishikshayatanschool.com/ssswebsite/fee-structure.html"
        },
        {
            query: "Fee Policy & Payments",
            keywords: "fee policy, fee payment, payment deadline, fine, late fee, payment mode, refund, refund policy, transaction charge, refund rules, duplicate payment, duplicate refund, card charge, neft, rtgs, online payment, fee deadlines, online payment portal",
            response: "School fees must be paid according to the schedule on our Fee Policy page: https://www.shrishikshayatanschool.com/ssswebsite/fee-policy.html. Late payments attract a fine."
        },
        {
            query: "Courses & Subject Streams",
            keywords: "courses, subjects, science, commerce, humanities, stream, cbse curriculum, syllabus, languages",
            response: "We follow the CBSE curriculum and offer Science, Commerce, and Humanities streams in Senior Section (Class XI & XII). In addition to core subjects, we offer foreign languages (German, French, Mandarin) and specialized labs."
        },
        {
            query: "School Timings",
            keywords: "school timings, school hours, class timing, school timing",
            response: "Our school hours are detailed on our School Timing page: https://www.shrishikshayatanschool.com/ssswebsite/school-timing.html. Junior and Senior sections have separate timetables."
        },
        {
            query: "School Calendar & Holidays",
            keywords: "school calendar, holiday list, school event dates, academic calendar, vacation",
            response: "For lists of holidays, exam dates, and annual school events, please check the School Calendar page: https://www.shrishikshayatanschool.com/ssswebsite/school-calendar.html"
        },
        {
            query: "Infrastructure & Campus Facilities",
            keywords: "infrastructure, classroom, computer lab, library, swimming pool, sports facilities, kalabhavan, auditorium, safety, wellness, labs",
            response: "We offer state-of-the-art facilities including 5 computer labs, tablet teaching in middle school, specialized Science/Math/Geography labs, and a library with 30,000+ books. Explore more here: https://www.shrishikshayatanschool.com/ssswebsite/infrastructure.html"
        },
        {
            query: "Co-Curricular & Sports Clubs",
            keywords: "activities, sports, basketball, swimming, karate, rugby, music, dance, clubs, robotics, visual arts, performing arts",
            response: "We have 24 interactive clubs, including a Robotics club. We also offer professional training in basketball, table tennis, rugby, acrobatics, swimming, karate, classical dance, ballet, and music (guitar, drums, synthesizer, vocals)."
        },
        {
            query: "Transfer Certificate (TC) Enquiry",
            keywords: "transfer certificate, tc download, candidate list, download tc, tc status, serial number",
            response: "You can search and view Transfer Certificates (TC) issued by the school on the Transfer Certificates page: https://www.shrishikshayatanschool.com/ssswebsite/transfer-certificates.html"
        },
        {
            query: "Contact & Location Info",
            keywords: "contact number, phone number, email address, school address, map, fax, Lord Sinha Road, address",
            response: "Address: 11, Lord Sinha Road, 8, Lord Sinha Road, Kolkata 700 071. Phone: +91 33 22827752 / +91 33 22821776. Email: info@shrishikshayatanschool.com. Junior Department: +91 8100975564 / +91 8100975565. Pre-Primary: +91 8100975564 / +91 8100975565."
        },
        {
            query: "Vision and Mission",
            keywords: "vision, our mission, goal, values, objective, vision and mission, vision statement",
            response: "Our Vision is to impart value-based education to students so that they are competent to handle global challenges. Our Mission is to foster lifelong learning, social/environmental awareness, and empathetic leadership. Read more on their pages."
        },
        {
            query: "School History & Legacy",
            keywords: "history, foundation, establishment, trust, year, legacy, history and legacy",
            response: "Founded as part of the Shikshayatan Trust, Shri Shikshayatan School has been a pioneer in girls' education in Kolkata for decades, striving for academic and personal excellence."
        },
        {
            query: "Notices & Announcements",
            keywords: "notice, notices, announcement, notification, senior notice, junior notice, notice board, circular, class notice, class notices, todays notice, today's notices, circulars, announcements, notifications, bulletins",
            response: "Class-wise notices and holiday/exam schedules are updated regularly. View Junior Notices at: https://www.shrishikshayatanschool.com/ssswebsite/junior.html and Senior Notices at: https://www.shrishikshayatanschool.com/ssswebsite/senior.html"
        }
    ];

    if (isLocal) {
        const stored = localStorage.getItem('school_chatbot_data');
        if (stored) {
            try {
                const parsed = JSON.parse(stored);
                callback(parsed);
                return;
            } catch(e) {}
        }
        callback(fallbackData);
    } else {
        fetch('api.php?action=get_chatbot_data')
        .then(res => res.json())
        .then(data => {
            if (data && data.length > 0) {
                callback(data);
            } else {
                callback(fallbackData);
            }
        })
        .catch(() => callback(fallbackData));
    }
}

function matchChatResponse(query, dataList) {
    const cleanQuery = query.toLowerCase().trim();
    if (!dataList || dataList.length === 0) return null;
    
    // Look for keyword matching
    for (let item of dataList) {
        const keywords = item.keywords.toLowerCase().split(',').map(k => k.trim());
        for (let kw of keywords) {
            if (kw && cleanQuery.includes(kw)) {
                const isLink = item.response.trim().startsWith('http://') || item.response.trim().startsWith('https://');
                return {
                    query: item.query,
                    response: item.response,
                    text: isLink ? `I found a link for you regarding ${item.query}:` : item.response,
                    isLink: isLink
                };
            }
        }
    }
    
    return null;
}

// Helpers to log chat messages and ratings to the server API
function logChatMessageToServerDirect(sender, text, msgIndex, isLocal, chatSessionId, userName) {
    if (isLocal) {
        try {
            let localLogs = JSON.parse(localStorage.getItem('school_local_chat_logs') || '[]');
            let session = localLogs.find(l => l.session_id === chatSessionId);
            const msg = {
                sender,
                text,
                timestamp: new Date().toISOString().split('T')[0] + ' ' + new Date().toTimeString().split(' ')[0],
                rating: 0
            };
            
            if (session) {
                if (userName) session.user_name = userName;
                session.last_active = new Date().toISOString().split('T')[0] + ' ' + new Date().toTimeString().split(' ')[0];
                session.messages.push(msg);
                session.message_count = session.messages.length;
            } else {
                localLogs.push({
                    session_id: chatSessionId,
                    user_name: userName || 'Anonymous',
                    last_active: new Date().toISOString().split('T')[0] + ' ' + new Date().toTimeString().split(' ')[0],
                    messages: [msg],
                    message_count: 1
                });
            }
            localStorage.setItem('school_local_chat_logs', JSON.stringify(localLogs));
        } catch(e) {}
    } else {
        const formData = new FormData();
        formData.append('session_id', chatSessionId);
        formData.append('user_name', userName || '');
        formData.append('sender', sender);
        formData.append('text', text);
        
        fetch('api.php?action=log_chat_message', {
            method: 'POST',
            body: formData
        }).catch(err => console.error("Error logging message:", err));
    }
}

function logChatMessageToServer(sender, text, msgIndex) {
    const isLocal = window.location.protocol === 'file:';
    const chatSessionId = sessionStorage.getItem('chat_session_id');
    const userName = sessionStorage.getItem('chat_user_name');
    
    // Check if we need to log the initial greeting first
    const sessionGreetingLoggedKey = 'chat_greeting_logged_' + chatSessionId;
    const isGreetingLogged = sessionStorage.getItem(sessionGreetingLoggedKey) === 'true';
    
    if (!isGreetingLogged && sender !== 'bot') {
        sessionStorage.setItem(sessionGreetingLoggedKey, 'true');
        const greetingText = "Namaste 🙏! How can I help you today?";
        logChatMessageToServerDirect('bot', greetingText, 0, isLocal, chatSessionId, userName);
    }
    
    // Log the current message
    logChatMessageToServerDirect(sender, text, msgIndex, isLocal, chatSessionId, userName);
}

function logChatRatingToServer(msgIndex, rating) {
    const isLocal = window.location.protocol === 'file:';
    const chatSessionId = sessionStorage.getItem('chat_session_id');
    
    try {
        const historyStr = sessionStorage.getItem('chat_history');
        if (historyStr) {
            const history = JSON.parse(historyStr);
            if (history[msgIndex]) {
                history[msgIndex].rating = rating;
                sessionStorage.setItem('chat_history', JSON.stringify(history));
            }
        }
    } catch(e) {}
    
    if (isLocal) {
        try {
            let localLogs = JSON.parse(localStorage.getItem('school_local_chat_logs') || '[]');
            let session = localLogs.find(l => l.session_id === chatSessionId);
            if (session && session.messages[msgIndex]) {
                session.messages[msgIndex].rating = rating;
                localStorage.setItem('school_local_chat_logs', JSON.stringify(localLogs));
            }
        } catch(e) {}
    } else {
        const formData = new FormData();
        formData.append('session_id', chatSessionId);
        formData.append('message_index', msgIndex);
        formData.append('rating', rating);
        
        fetch('api.php?action=log_chat_rating', {
            method: 'POST',
            body: formData
        }).catch(err => console.error("Error logging rating:", err));
    }
}

// Homepage Notice Board Component Controller
function initIndexNoticeBoard() {
    const container = document.getElementById('index-notice-list-container');
    if (!container) return;

    let noticesData = [];
    const isLocal = window.location.protocol === 'file:' || window.location.hostname.includes('github.io') || window.location.hostname.includes('github.dev') || window.location.search.includes('demo=true');
    let activeFilter = 'all';

    // Filters out expired notices (past end_date) while keeping them preserved in backend
    function filterActiveNotices(notices) {
        if (!notices || !Array.isArray(notices)) return [];
        const now = new Date();
        return notices.filter(notice => {
            if (notice.start_date) {
                const timePart = notice.start_time || '00:00';
                const startDateTime = new Date(notice.start_date + 'T' + timePart + ':00');
                if (!isNaN(startDateTime.getTime()) && now < startDateTime) {
                    return false;
                }
            }
            if (notice.end_date) {
                const endDateTime = new Date(notice.end_date + 'T23:59:59');
                if (!isNaN(endDateTime.getTime()) && now > endDateTime) {
                    return false; // Removed from front end when notice end date passes
                }
            }
            return true;
        });
    }

    function loadAndRender() {
        if (isLocal) {
            const stored = localStorage.getItem('school_db_data');
            if (stored) {
                try {
                    const data = JSON.parse(stored);
                    if (data && data.section_notices && Array.isArray(data.section_notices)) {
                        if (typeof getDefaultLocalNotices === 'function' && (data.section_notices[0]?.id !== 'wp_notice_53' || data.section_notices[1]?.title !== 'Congratulations')) {
                            data.section_notices = getDefaultLocalNotices();
                            localStorage.setItem('school_db_data', JSON.stringify(data));
                        }
                        noticesData = filterActiveNotices(data.section_notices);
                        renderList(activeFilter);
                        return;
                    }
                } catch(e) {}
            }
            if (typeof getDefaultLocalNotices === 'function') {
                noticesData = filterActiveNotices(getDefaultLocalNotices());
            }
            renderList(activeFilter);
        } else {
            fetch('api.php?action=get_notices')
                .then(res => res.json())
                .then(data => {
                    let list = [];
                    if (Array.isArray(data)) {
                        list = data;
                    } else if (data && data.section_notices && Array.isArray(data.section_notices)) {
                        list = data.section_notices;
                    } else if (typeof getDefaultLocalNotices === 'function') {
                        list = getDefaultLocalNotices();
                    }
                    noticesData = filterActiveNotices(list);
                    renderList(activeFilter);
                })
                .catch(err => {
                    console.error("Error loading index notices:", err);
                    if (typeof getDefaultLocalNotices === 'function') {
                        noticesData = filterActiveNotices(getDefaultLocalNotices());
                    }
                    renderList(activeFilter);
                });
        }
    }

    let scrollAnimId = null;

    function buildNoticeItem(notice, visitedNotices, now) {
        const item = document.createElement('div');
        const isVisited = visitedNotices.includes(notice.id);
        item.className = `index-notice-item ${isVisited ? 'notice-visited' : ''}`;
        item.setAttribute('data-id', notice.id);

        const noticeDate = new Date(notice.date);
        const diffTime = Math.abs(now - noticeDate);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        const isNew = diffDays <= 7;

        const dateParts = notice.date ? notice.date.split('-') : [];
        const year = dateParts[0] || '';
        const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        const monthIndex = dateParts[1] ? parseInt(dateParts[1], 10) - 1 : 0;
        const monthStr = monthNames[monthIndex] || '';
        const dayStr = dateParts[2] || '';

        const categoryKey = notice.category || 'general';
        const categoryLabel = categoryKey.toUpperCase();

        const blinkBadge = isNew ? '<span class="new-blink">NEW</span>' : '';
        const readTag = isVisited ? '<span class="read-tag"><i class="ph-bold ph-check-circle"></i> READ</span>' : '';

        item.innerHTML = `
            <div class="notice-date-badge">
                <span class="notice-day">${dayStr}</span>
                <span class="notice-month">${monthStr}</span>
            </div>
            <div class="notice-content-body">
                <div class="notice-meta-line">
                    <span class="notice-category-tag cat-${categoryKey}">${categoryLabel}</span>
                    ${blinkBadge}
                    ${readTag}
                </div>
                <a href="notice_detail.html?id=${notice.id}" class="notice-title-link" target="_blank" onclick="event.stopPropagation();">
                    ${escapeHtml(notice.title)}
                </a>
            </div>
            <div class="notice-action-icon">
                <i class="ph-bold ph-caret-right"></i>
            </div>
        `;

        function handleNoticeClick() {
            try {
                let visited = JSON.parse(localStorage.getItem('visited_notices') || '[]');
                if (!visited.includes(notice.id)) {
                    visited.push(notice.id);
                    localStorage.setItem('visited_notices', JSON.stringify(visited));
                }
            } catch (err) {}

            document.querySelectorAll(`.index-notice-item[data-id="${notice.id}"]`).forEach(el => {
                el.classList.add('notice-visited');
                const metaLine = el.querySelector('.notice-meta-line');
                if (metaLine && !metaLine.querySelector('.read-tag')) {
                    const tag = document.createElement('span');
                    tag.className = 'read-tag';
                    tag.innerHTML = '<i class="ph-bold ph-check-circle"></i> READ';
                    metaLine.appendChild(tag);
                }
            });
            localStorage.setItem('active_highlight_id', notice.id);
        }

        item.addEventListener('click', (e) => {
            handleNoticeClick();
            if (!e.target.closest('.notice-title-link')) {
                window.open(`notice_detail.html?id=${notice.id}`, '_blank');
            }
        });

        const linkEl = item.querySelector('.notice-title-link');
        if (linkEl) {
            linkEl.addEventListener('click', handleNoticeClick);
        }

        return item;
    }

    function renderList(filter) {
        if (scrollAnimId) {
            cancelAnimationFrame(scrollAnimId);
            scrollAnimId = null;
        }

        const scrollerWrapper = document.getElementById('notice-scroller-wrapper');
        if (scrollerWrapper) {
            scrollerWrapper.scrollTop = 0;
        }
        container.innerHTML = '';

        if (!noticesData || noticesData.length === 0) {
            container.innerHTML = '<div class="notice-empty">No notices currently available.</div>';
            return;
        }

        // Sort by date descending
        const sorted = [...noticesData].sort((a, b) => new Date(b.date) - new Date(a.date));

        let filtered = sorted;
        if (filter === 'senior') {
            filtered = sorted.filter(n => n.section === 'senior' || n.section === 'both' || n.section === 'all');
        } else if (filter === 'junior') {
            filtered = sorted.filter(n => n.section === 'junior' || n.section === 'both' || n.section === 'all');
        }

        if (filtered.length === 0) {
            container.innerHTML = '<div class="notice-empty">No notices found for this section.</div>';
            return;
        }

        let visitedNotices = [];
        try {
            visitedNotices = JSON.parse(localStorage.getItem('visited_notices') || '[]');
        } catch (e) {
            visitedNotices = [];
        }

        const now = new Date();

        filtered.forEach(notice => {
            container.appendChild(buildNoticeItem(notice, visitedNotices, now));
        });

        if (scrollerWrapper && filtered.length > 2) {
            filtered.forEach(notice => {
                container.appendChild(buildNoticeItem(notice, visitedNotices, now));
            });

            let scrollPos = 0;
            const speed = 0.5;
            let isHovered = false;

            scrollerWrapper.onmouseenter = () => { isHovered = true; };
            scrollerWrapper.onmouseleave = () => { isHovered = false; };

            function step() {
                if (!isHovered) {
                    scrollPos += speed;
                    const halfHeight = container.scrollHeight / 2;
                    if (scrollPos >= halfHeight) {
                        scrollPos = 0;
                    }
                    scrollerWrapper.scrollTop = scrollPos;
                }
                scrollAnimId = requestAnimationFrame(step);
            }
            scrollAnimId = requestAnimationFrame(step);
        }
    }

    // Filter tab listeners
    document.querySelectorAll('.notice-tab').forEach(tab => {
        tab.addEventListener('click', () => {
            document.querySelectorAll('.notice-tab').forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            activeFilter = tab.dataset.filter || 'all';
            renderList(activeFilter);
        });
    });

    loadAndRender();
}


