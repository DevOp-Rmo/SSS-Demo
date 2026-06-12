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
    const isLocalFile = window.location.protocol === 'file:' || window.location.hostname.includes('github.io');
    if (isLocalFile) {
        // Load from localStorage or use fallback default local data
        const stored = localStorage.getItem('school_db_data');
        let data = null;
        if (stored) {
            try {
                data = JSON.parse(stored);
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
                        "id": "1",
                        "type": "image",
                        "media_path": "assets/hero_bg.png",
                        "duration_ms": 5000
                    }
                ],
                "hall_of_fame": {
                    "board_results": {
                        "image_path": "assets/board_results.png",
                        "subtitle": "AISSE & AISSCE PERFORMANCE 2025 [DEMO]"
                    },
                    "competitive_exam": {
                        "image_path": "assets/exam_success.png",
                        "subtitle": "JEE, NEET & OLYMPIAD QUALIFIERS [DEMO]"
                    }
                },
                "awards": [
                    { "id": "1", "title": "AWARD 1", "image_path": "" },
                    { "id": "2", "title": "AWARD 2", "image_path": "" },
                    { "id": "3", "title": "AWARD 3", "image_path": "" },
                    { "id": "4", "title": "AWARD 4", "image_path": "" }
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
            }
        })
        .catch(err => {
            console.error('Error fetching API data, using static fallbacks:', err);
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
            boardImg.src = hofData.board_results.image_path + '?v=' + Date.now();
        }
        boardText.textContent = hofData.board_results.subtitle;
    }
    
    if (examImg && hofData.competitive_exam) {
        if (hofData.competitive_exam.image_path) {
            examImg.src = hofData.competitive_exam.image_path + '?v=' + Date.now();
        }
        examText.textContent = hofData.competitive_exam.subtitle;
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
                ${escapeHtml(post.title)} 
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
    
    slidesList = sliderData;
    if (slidesList.length === 0) {
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

    function processQuery(query) {
        const cleanQuery = query.toLowerCase().trim();
        
        if (cleanQuery === 'class notices' || cleanQuery === 'notices') {
            appendBotReply("Please select your school section:", () => {
                showClassSectionButtons();
            });
            return;
        }

        // Get chatbot trained QA data
        getChatbotData(dataList => {
            const reply = matchChatResponse(query, dataList);
            if (reply) {
                if (reply.isLink) {
                    appendBotReply(reply.text, null, true, reply.response);
                } else {
                    appendBotReply(reply.response);
                }
            } else {
                // Fallback: Contact Us
                appendBotReply("I want to make sure you get the right information, but I don't have the details for that in my current records. Please feel free to reach out to our dedicated support team or contact our school office directly. We are always happy to assist you!", null, false, null, true);
            }
        });
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
            { text: "COURSE DETAILS", query: "Course Details" },
            { text: "CLASS NOTICES", query: "Class Notices" }
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
            linkBtn.innerHTML = `<span>Open Link</span> <i class="ph ph-arrow-square-out"></i>`;
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
            query: "Admission Enquiry",
            keywords: "admission,apply,enquiry,admission procedure,how to apply",
            response: "https://www.shrishikshayatanschool.com/ssswebsite/senior.html"
        },
        {
            query: "Fee Structure",
            keywords: "fee,fees,payment,fee policy,structure",
            response: "The school fees structure varies by section. You can check details under the Admission dropdown, or visit this link: https://www.shrishikshayatanschool.com/ssswebsite/index.html"
        },
        {
            query: "Course Details",
            keywords: "courses,subjects,curriculum,cbse,syllabus",
            response: "We follow the CBSE curriculum, offering Science, Commerce, and Humanities streams in senior classes. Check our Academics section for more information."
        },
        {
            query: "School Timings",
            keywords: "timing,timings,hours,school hours,schedule",
            response: "Our school hours are from 8:00 AM to 2:00 PM (Monday to Friday) and 8:00 AM to 12:30 PM (Saturdays)."
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
