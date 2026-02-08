// تطبيق البحث عن الجامعات التركية - مدمج
document.addEventListener('DOMContentLoaded', function() {
    // متغيرات نظام ترقيم الصفحات
    let currentPage = 1;
    let universitiesPerPage = 8;
    let filteredUniversities = [...universityCardsData];
    
    // العناصر
    const header = document.getElementById('header');
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.getElementById('nav-menu');
    const backToTop = document.getElementById('backToTop');
    const progressBar = document.getElementById('progressBar');
    
    // عناصر البحث
    const degreeFilter = document.getElementById('degreeFilter');
    const languageFilter = document.getElementById('languageFilter');
    const programFilter = document.getElementById('programFilter');
    const cityFilter = document.getElementById('cityFilter');
    const searchBtn = document.getElementById('searchBtn');
    const browseBtn = document.getElementById('browseBtn');
    const resultsSection = document.getElementById('resultsSection');
    const resultsBody = document.getElementById('resultsBody');
    const resultsCount = document.getElementById('resultsCount');
    const backToSearch = document.getElementById('backToSearch');
    
    // عناصر الجامعات
    const universitiesGrid = document.getElementById('universitiesGrid');
    const paginationContainer = document.getElementById('paginationContainer');
    const universitySearchInput = document.getElementById('universitySearchInput');
    
    // ===== PROGRESS BAR =====
    window.addEventListener('scroll', function() {
        if (progressBar) {
            const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
            const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
            const scrollPercent = (scrollTop / scrollHeight) * 100;
            progressBar.style.width = scrollPercent + '%';
        }
    });
    
    // ===== HEADER SCROLL EFFECT =====
    window.addEventListener('scroll', function() {
        const currentScroll = window.pageYOffset;
        
        if (header) {
            if (currentScroll > 100) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        }
        
        if (backToTop) {
            if (currentScroll > 300) {
                backToTop.classList.add('show');
            } else {
                backToTop.classList.remove('show');
            }
        }
    });
    
    // ===== MOBILE NAVIGATION =====
    if (hamburger && navMenu) {
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
        });
        
        const navLinks = navMenu.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
            });
        });
    }
    
    // ===== BACK TO TOP =====
    if (backToTop) {
        backToTop.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }
    
    // ===== SEARCH FUNCTIONALITY =====
    function search() {
        const degree = degreeFilter.value;
        const language = languageFilter.value;
        const program = programFilter.value;
        const city = cityFilter.value.trim().toLowerCase();
        
        // إظهار قسم النتائج
        resultsSection.style.display = 'block';
        document.getElementById('universities').style.display = 'none';
        
        // تصفية البيانات
        let results = tuitionData.filter(item => {
            let match = true;
            
            if (degree && item.degree_id != degree) match = false;
            if (language && item.language_id != language) match = false;
            if (program && item.program_id != program) match = false;
            
            if (city) {
                const university = universitiesData.universities.find(u => u.id === item.university_id);
                if (university) {
                    const cityMatch = university.city.toLowerCase().includes(city) || 
                                     university.city_en.toLowerCase().includes(city);
                    if (!cityMatch) match = false;
                }
            }
            
            return match;
        });
        
        // ترتيب حسب السعر
        results.sort((a, b) => a.tuition - b.tuition);
        
        // عرض النتائج
        displayResults(results);
        
        // التمرير للنتائج
        resultsSection.scrollIntoView({ behavior: 'smooth' });
    }
    
    function displayResults(results) {
        resultsBody.innerHTML = '';
        
        if (results.length === 0) {
            resultsBody.innerHTML = `
                <tr>
                    <td colspan="6" class="no-results">
                        <i class="fas fa-search" style="font-size: 3rem; opacity: 0.3; margin-bottom: 1rem;"></i>
                        <p>لم يتم العثور على نتائج. جرب تغيير معايير البحث.</p>
                    </td>
                </tr>
            `;
            resultsCount.textContent = '0 نتيجة';
            return;
        }
        
        resultsCount.textContent = results.length + ' نتيجة';
        
        results.forEach(item => {
            const university = universitiesData.universities.find(u => u.id === item.university_id);
            const program = universitiesData.programs.find(p => p.id === item.program_id);
            const language = universitiesData.languages.find(l => l.id === item.language_id);
            
            if (university && program && language) {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td class="university-name">${university.name}</td>
                    <td>${program.name}</td>
                    <td>${university.city}</td>
                    <td><span class="language-badge ${language.name_en.toLowerCase()}">${language.name}</span></td>
                    <td class="tuition">$${item.tuition.toLocaleString()}</td>
                    <td><button class="btn-apply" onclick="applyNow('${university.name}', '${program.name}')">تقديم الآن</button></td>
                `;
                resultsBody.appendChild(row);
            }
        });
    }
    
    // ===== UNIVERSITY CARDS =====
    function renderUniversityCards() {
        universitiesGrid.innerHTML = '';
        
        const startIndex = (currentPage - 1) * universitiesPerPage;
        const endIndex = startIndex + universitiesPerPage;
        const pageUniversities = filteredUniversities.slice(startIndex, endIndex);
        
        pageUniversities.forEach((uni, index) => {
            const card = document.createElement('div');
            card.className = 'university-card';
            card.setAttribute('data-aos', 'fade-up');
            card.setAttribute('data-aos-delay', (index * 100).toString());
            
            card.innerHTML = `
                <div class="card-header">
                    <h3>${uni.name}</h3>
                    <div class="university-name-en">${uni.name_en}</div>
                </div>
                <div class="card-body">
                    <div class="card-info">
                        <div class="info-item">
                            <i class="fas fa-map-marker-alt"></i>
                            ${uni.city}
                        </div>
                        <div class="info-item">
                            <i class="fas fa-graduation-cap"></i>
                            ${uni.programs.length} تخصصات
                        </div>
                    </div>
                    
                    <div class="card-programs">
                        <h4>التخصصات والأسعار:</h4>
                        ${uni.programs.map(p => `
                            <div class="program-item">
                                <span class="program-name">${p.name}</span>
                                <div class="program-prices">
                                    <span class="old-price">${p.oldPrice}</span>
                                    <span class="new-price">${p.newPrice}</span>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                    
                    <div class="card-tags">
                        ${uni.tags.map((tag, i) => `
                            <span class="tag">
                                <i class="${uni.tagIcons[i]}"></i>
                                ${tag}
                            </span>
                        `).join('')}
                    </div>
                    
                    <div class="card-actions">
                        <a href="https://wa.me/message/EUGNIXH6NHRZL1?text=أريد التسجيل في ${uni.name}" class="card-btn primary" target="_blank">
                            <i class="fab fa-whatsapp"></i>
                            تواصل معنا
                        </a>
                        <button class="card-btn secondary" onclick="showUniversityPrograms(${uni.id})">
                            <i class="fas fa-list"></i>
                            التخصصات
                        </button>
                    </div>
                </div>
            `;
            
            universitiesGrid.appendChild(card);
        });
        
        renderPagination();
        
        // إعادة تهيئة AOS
        if (typeof AOS !== 'undefined') {
            AOS.refresh();
        }
    }
    
    function renderPagination() {
        const totalPages = Math.ceil(filteredUniversities.length / universitiesPerPage);
        paginationContainer.innerHTML = '';
        
        if (totalPages <= 1) return;
        
        // زر السابق
        const prevBtn = document.createElement('button');
        prevBtn.className = 'pagination-btn';
        prevBtn.innerHTML = '<i class="fas fa-chevron-right"></i>';
        prevBtn.disabled = currentPage === 1;
        prevBtn.addEventListener('click', () => {
            if (currentPage > 1) {
                currentPage--;
                renderUniversityCards();
                document.getElementById('universities').scrollIntoView({ behavior: 'smooth' });
            }
        });
        paginationContainer.appendChild(prevBtn);
        
        // أرقام الصفحات
        for (let i = 1; i <= totalPages; i++) {
            if (i === 1 || i === totalPages || (i >= currentPage - 1 && i <= currentPage + 1)) {
                const pageBtn = document.createElement('button');
                pageBtn.className = `pagination-btn ${i === currentPage ? 'active' : ''}`;
                pageBtn.textContent = i;
                pageBtn.addEventListener('click', () => {
                    currentPage = i;
                    renderUniversityCards();
                    document.getElementById('universities').scrollIntoView({ behavior: 'smooth' });
                });
                paginationContainer.appendChild(pageBtn);
            } else if (i === currentPage - 2 || i === currentPage + 2) {
                const dots = document.createElement('span');
                dots.className = 'pagination-info';
                dots.textContent = '...';
                paginationContainer.appendChild(dots);
            }
        }
        
        // زر التالي
        const nextBtn = document.createElement('button');
        nextBtn.className = 'pagination-btn';
        nextBtn.innerHTML = '<i class="fas fa-chevron-left"></i>';
        nextBtn.disabled = currentPage === totalPages;
        nextBtn.addEventListener('click', () => {
            if (currentPage < totalPages) {
                currentPage++;
                renderUniversityCards();
                document.getElementById('universities').scrollIntoView({ behavior: 'smooth' });
            }
        });
        paginationContainer.appendChild(nextBtn);
        
        // معلومات الصفحة
        const info = document.createElement('span');
        info.className = 'pagination-info';
        const startIndex = (currentPage - 1) * universitiesPerPage + 1;
        const endIndex = Math.min(currentPage * universitiesPerPage, filteredUniversities.length);
        info.textContent = `عرض ${startIndex}-${endIndex} من ${filteredUniversities.length} جامعة`;
        paginationContainer.appendChild(info);
    }
    
    // ===== UNIVERSITY SEARCH =====
    if (universitySearchInput) {
        universitySearchInput.addEventListener('input', (e) => {
            const searchTerm = e.target.value.trim().toLowerCase();
            
            if (searchTerm) {
                filteredUniversities = universityCardsData.filter(uni => 
                    uni.name.toLowerCase().includes(searchTerm) ||
                    uni.name_en.toLowerCase().includes(searchTerm) ||
                    uni.city.toLowerCase().includes(searchTerm)
                );
            } else {
                filteredUniversities = [...universityCardsData];
            }
            
            currentPage = 1;
            renderUniversityCards();
        });
    }
    
    // ===== EVENT LISTENERS =====
    if (searchBtn) {
        searchBtn.addEventListener('click', search);
    }
    
    if (browseBtn) {
        browseBtn.addEventListener('click', () => {
            resultsSection.style.display = 'none';
            document.getElementById('universities').style.display = 'block';
            document.getElementById('universities').scrollIntoView({ behavior: 'smooth' });
        });
    }
    
    if (backToSearch) {
        backToSearch.addEventListener('click', () => {
            resultsSection.style.display = 'none';
            document.getElementById('universities').style.display = 'block';
            document.getElementById('home').scrollIntoView({ behavior: 'smooth' });
        });
    }
    
    // البحث عند الضغط على Enter
    [degreeFilter, languageFilter, programFilter, cityFilter].forEach(el => {
        if (el) {
            el.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') search();
            });
        }
    });
    
    // ===== GLOBAL FUNCTIONS =====
   window.applyNow = function(universityName, programName) {
  const params = new URLSearchParams({
    university: universityName,
    program: programName
  });

  // روح على صفحة الداشبورد
  window.location.href = `../reg-student/index.html?${params.toString()}`;
};

    window.showUniversityPrograms = function(universityId) {
        // تصفية البيانات حسب الجامعة
        const results = tuitionData.filter(t => t.university_id === universityId);
        
        if (results.length > 0) {
            resultsSection.style.display = 'block';
            document.getElementById('universities').style.display = 'none';
            displayResults(results);
            resultsSection.scrollIntoView({ behavior: 'smooth' });
        } else {
            showNotification('لا توجد تخصصات متاحة لهذه الجامعة حالياً', 'info');
        }
    };
    
    // ===== NOTIFICATION SYSTEM =====
    function showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <div style="display: flex; align-items: center; gap: 0.5rem;">
                <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
                <span>${message}</span>
                <button onclick="this.parentElement.parentElement.remove()" style="background: none; border: none; color: white; cursor: pointer; margin-right: auto;">
                    <i class="fas fa-times"></i>
                </button>
            </div>
        `;
        
        notification.style.cssText = `
            position: fixed;
            top: 100px;
            right: 20px;
            background: ${type === 'success' ? '#10b981' : type === 'error' ? '#ef4444' : '#3b82f6'};
            color: white;
            padding: 1rem 1.5rem;
            border-radius: 0.5rem;
            box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
            z-index: 10000;
            transform: translateX(100%);
            transition: transform 0.3s ease-in-out;
            max-width: 400px;
            font-family: 'Cairo', sans-serif;
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 100);
        
        setTimeout(() => {
            if (document.body.contains(notification)) {
                notification.style.transform = 'translateX(100%)';
                setTimeout(() => {
                    if (document.body.contains(notification)) {
                        document.body.removeChild(notification);
                    }
                }, 300);
            }
        }, 5000);
    }
    
    // ===== INITIALIZE =====
    renderUniversityCards();
    // ===== INBOUND NAV (/universities/?tab=search|browse) =====
    (function handleInboundNav(){
        const params = new URLSearchParams(window.location.search);
        const tab = params.get('tab');
        if (!tab) return;

        // Prefill filters if provided
        const pDegree = params.get('degree') || '';
        const pLanguage = params.get('language') || '';
        const pProgram = params.get('program') || '';
        const pCity = params.get('city') || '';

        if (degreeFilter && pDegree) degreeFilter.value = pDegree;
        if (languageFilter && pLanguage) languageFilter.value = pLanguage;
        if (programFilter && pProgram) programFilter.value = pProgram;
        if (cityFilter && pCity) cityFilter.value = pCity;

        const universitiesSection = document.getElementById('universities');

        // Small delay to ensure initial render + layout is ready
        setTimeout(() => {
            if (tab === 'browse') {
                if (resultsSection) resultsSection.style.display = 'none';
                if (universitiesSection) universitiesSection.style.display = 'block';
                universitiesSection?.scrollIntoView({ behavior: 'smooth' });
                universitySearchInput?.focus?.();
                return;
            }

            // tab === 'search'
            const auto = params.get('auto') === '1';
            const hasAnyFilter = Boolean(pDegree || pLanguage || pProgram || pCity);

            // If user came from the landing page search button, run search automatically.
            // Otherwise just scroll to the filters.
            if (auto || hasAnyFilter) {
                search();
            } else {
                document.getElementById('search-section')?.scrollIntoView({ behavior: 'smooth' });
                degreeFilter?.focus?.();
            }
        }, 80);
    })();


});
