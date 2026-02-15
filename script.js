// Theme Toggle Functionality
const themeToggle = document.getElementById('themeToggle');
const htmlElement = document.documentElement;

// Check for saved theme preference or default to 'dark'
const currentTheme = localStorage.getItem('theme') || 'dark';
htmlElement.setAttribute('data-theme', currentTheme);

themeToggle.addEventListener('click', function() {
    const currentTheme = htmlElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    
    htmlElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    
    // Add a little bounce animation
    this.style.transform = 'scale(0.9)';
    setTimeout(() => {
        this.style.transform = '';
    }, 150);
});

// Search and Filter Functionality
const searchInput = document.getElementById('searchInput');
const posts = document.querySelectorAll('.post');
const categoryPills = document.querySelectorAll('.category-pill');
let activeCategory = 'all';

function filterPosts() {
    const query = searchInput.value.toLowerCase();

    posts.forEach(post => {
        const textMatch = post.innerText.toLowerCase().includes(query);
        const categoryMatch = activeCategory === 'all' || post.dataset.category === activeCategory;
        
        if (textMatch && categoryMatch) {
            post.style.display = '';
            post.style.animation = 'fadeInScale 0.5s ease-out both';
        } else {
            post.style.display = 'none';
        }
    });
}

searchInput.addEventListener('input', filterPosts);

// Category filtering
categoryPills.forEach(pill => {
    pill.addEventListener('click', function() {
        categoryPills.forEach(p => p.classList.remove('active'));
        this.classList.add('active');
        activeCategory = this.dataset.category;
        filterPosts();
    });
});

// Add click handlers to Read More buttons
document.querySelectorAll('.read-more-btn').forEach(btn => {
    btn.addEventListener('click', function(e) {
        e.stopPropagation();
        alert('Article would open here!');
    });
});

// Intersection Observer for scroll animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Smooth appearance on scroll
document.querySelectorAll('.article-card, .sidebar-card').forEach(el => {
    observer.observe(el);
});