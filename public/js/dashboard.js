// Sidebar Toggle
const sidebar = document.getElementById('sidebar');
const mainContent = document.getElementById('mainContent');
const overlay = document.getElementById('overlay');
const toggleSidebarDesktop = document.getElementById('toggleSidebarDesktop');
const toggleSidebarMobile = document.getElementById('toggleSidebarMobile');
const toggleSidebarNav = document.getElementById('toggleSidebarNav');

let isCollapsed = false;
let isMobile = window.innerWidth < 1024;

function checkMobile() {
    isMobile = window.innerWidth < 1024;
    if (isMobile) {
        sidebar.classList.remove('collapsed');
        sidebar.classList.add('mobile-hidden');
        mainContent.classList.add('sidebar-mobile-hidden');
        mainContent.classList.remove('sidebar-collapsed');
    } else {
        sidebar.classList.remove('mobile-hidden');
        mainContent.classList.remove('sidebar-mobile-hidden');
        if (isCollapsed) {
            sidebar.classList.add('collapsed');
            mainContent.classList.add('sidebar-collapsed');
        }
    }
}

function toggleSidebar() {
    if (isMobile) {
        sidebar.classList.toggle('mobile-open');
        overlay.classList.toggle('show');
    } else {
        isCollapsed = !isCollapsed;
        sidebar.classList.toggle('collapsed');
        mainContent.classList.toggle('sidebar-collapsed');

        // Update toggle button icon
        const icon = toggleSidebarDesktop.querySelector('svg path');
        if (isCollapsed) {
            icon.setAttribute('d', 'M9 18l6-6-6-6');
        } else {
            icon.setAttribute('d', 'M15 18l-6-6 6-6');
        }
    }
}

if (toggleSidebarDesktop) {
    toggleSidebarDesktop.addEventListener('click', toggleSidebar);
}
if (toggleSidebarMobile) {
    toggleSidebarMobile.addEventListener('click', toggleSidebar);
}
if (toggleSidebarNav) {
    toggleSidebarNav.addEventListener('click', toggleSidebar);
}

if (overlay) {
    overlay.addEventListener('click', () => {
        sidebar.classList.remove('mobile-open');
        overlay.classList.remove('show');
    });
}

window.addEventListener('resize', checkMobile);
checkMobile();

// Navigation
const navItems = document.querySelectorAll('.nav-item');
const pages = document.querySelectorAll('.page');

function showPage(pageId) {
    pages.forEach(page => {
        page.classList.toggle('hidden', page.dataset.page !== pageId);
    });
}

showPage('dashboard');
navItems.forEach(item => {
    item.addEventListener('click', (e) => {
        if (item.getAttribute('href').startsWith('#')) {
            e.preventDefault();
        }
        navItems.forEach(nav => nav.classList.remove('active'));
        item.classList.add('active');

        const pageId = item.getAttribute('data-page');
        if (pageId) {
            showPage(pageId);
        }

        if (isMobile) {
            sidebar.classList.remove('mobile-open');
            overlay.classList.remove('show');
        }
    });
});

// Report Filters
const reportFilters = document.getElementById('reportFilters');
const reportSections = document.querySelectorAll('.report-section');

function setReportType(type) {
    reportSections.forEach(section => {
        section.classList.toggle('hidden', section.dataset.report !== type);
    });
}

if (reportFilters) {
    const filterButtons = reportFilters.querySelectorAll('.filter-btn');
    filterButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            filterButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            setReportType(btn.dataset.reportType);
        });
    });
    setReportType('rental');
}

// Account Dropdown
const accountBtn = document.getElementById('accountBtn');
const accountDropdown = document.getElementById('accountDropdown');

if (accountBtn) {
    accountBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        accountDropdown.classList.toggle('show');
    });
}

document.addEventListener('click', () => {
    if (accountDropdown) {
        accountDropdown.classList.remove('show');
    }
});

if (accountDropdown) {
    accountDropdown.addEventListener('click', (e) => {
        e.stopPropagation();
    });
}

// Search Form
const searchForm = document.getElementById('searchForm');
if (searchForm) {
    searchForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const searchInput = document.getElementById('searchInput');
        console.log('Search:', searchInput.value);
    });
}

// Chart
const ctx = document.getElementById('revenueChart');
if (ctx) {
    const revenueChart = new Chart(ctx.getContext('2d'), {
        type: 'line',
        data: {
            labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
            datasets: [{
                label: 'Tren Penjualan',
                data: [8, 8.5, 8.2, 9.5, 9, 10],
                borderColor: 'rgb(66, 184, 131)',
                backgroundColor: 'rgba(66, 184, 131, 0.1)',
                tension: 0.4,
                fill: true
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    callbacks: {
                        label: function (context) {
                            const value = context.parsed.y;
                            return 'Penjualan: Rp' + value.toFixed(1) + ' juta';
                        }
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: false,
                    min: 0,
                    max: 12,
                    ticks: {
                        callback: function (value) {
                            return 'Rp' + value + ' jt';
                        },
                        stepSize: 2
                    }
                }
            }
        }
    });
}
