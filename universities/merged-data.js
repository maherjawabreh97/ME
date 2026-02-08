// قاعدة بيانات الجامعات التركية الخاصة - مدمجة
const universitiesData = {
    universities: [
        { id: 1, name: "جامعة كوتش", name_en: "Koç University", city: "إسطنبول", city_en: "Istanbul", ranking: 1 },
        { id: 2, name: "جامعة سابانجي", name_en: "Sabancı University", city: "إسطنبول", city_en: "Istanbul", ranking: 2 },
        { id: 3, name: "جامعة بيلكنت", name_en: "Bilkent University", city: "أنقرة", city_en: "Ankara", ranking: 3 },
        { id: 4, name: "جامعة إسطنبول ميديبول", name_en: "İstanbul Medipol University", city: "إسطنبول", city_en: "Istanbul", ranking: 4 },
        { id: 5, name: "جامعة بهتشه شهير", name_en: "Bahçeşehir University", city: "إسطنبول", city_en: "Istanbul", ranking: 5 },
        { id: 6, name: "جامعة إسطنبول آيدن", name_en: "İstanbul Aydın University", city: "إسطنبول", city_en: "Istanbul", ranking: 6 },
        { id: 7, name: "جامعة استينيا", name_en: "İstinye University", city: "إسطنبول", city_en: "Istanbul", ranking: 7 },
        { id: 8, name: "جامعة أوزيجين", name_en: "Özyeğin University", city: "إسطنبول", city_en: "Istanbul", ranking: 8 },
        { id: 9, name: "جامعة يدي تبه", name_en: "Yeditepe University", city: "إسطنبول", city_en: "Istanbul", ranking: 9 },
        { id: 10, name: "جامعة أجيبادم", name_en: "Acıbadem University", city: "إسطنبول", city_en: "Istanbul", ranking: 10 },
        { id: 11, name: "جامعة بيروني", name_en: "Biruni University", city: "إسطنبول", city_en: "Istanbul", ranking: 11 },
        { id: 12, name: "جامعة جيليشيم", name_en: "İstanbul Gelişim University", city: "إسطنبول", city_en: "Istanbul", ranking: 12 },
        { id: 13, name: "جامعة أسكودار", name_en: "Üsküdar University", city: "إسطنبول", city_en: "Istanbul", ranking: 13 },
        { id: 14, name: "جامعة بيلجي", name_en: "İstanbul Bilgi University", city: "إسطنبول", city_en: "Istanbul", ranking: 14 },
        { id: 15, name: "جامعة يني يوزيل", name_en: "İstanbul Yeni Yüzyıl University", city: "إسطنبول", city_en: "Istanbul", ranking: 15 },
        { id: 16, name: "جامعة ألتن باش", name_en: "Altınbaş University", city: "إسطنبول", city_en: "Istanbul", ranking: 16 },
        { id: 17, name: "جامعة أوكان", name_en: "Okan University", city: "إسطنبول", city_en: "Istanbul", ranking: 17 },
        { id: 18, name: "جامعة كولتور", name_en: "İstanbul Kültür University", city: "إسطنبول", city_en: "Istanbul", ranking: 18 },
        { id: 19, name: "جامعة كنت", name_en: "İstanbul Kent University", city: "إسطنبول", city_en: "Istanbul", ranking: 19 },
        { id: 20, name: "جامعة بيكوز", name_en: "Beykoz University", city: "إسطنبول", city_en: "Istanbul", ranking: 20 },
        { id: 21, name: "جامعة فنار بهشة", name_en: "Fenerbahçe University", city: "إسطنبول", city_en: "Istanbul", ranking: 21 },
        { id: 22, name: "جامعة أطلس", name_en: "İstanbul Atlas University", city: "إسطنبول", city_en: "Istanbul", ranking: 22 },
        { id: 23, name: "جامعة أريل", name_en: "İstanbul Arel University", city: "إسطنبول", city_en: "Istanbul", ranking: 23 },
        { id: 24, name: "جامعة جالاتا", name_en: "Galata University", city: "إسطنبول", city_en: "Istanbul", ranking: 24 },
        { id: 25, name: "جامعة توب كابي", name_en: "Topkapı University", city: "إسطنبول", city_en: "Istanbul", ranking: 25 },
        { id: 26, name: "جامعة اسنيورت", name_en: "Esenyurt University", city: "إسطنبول", city_en: "Istanbul", ranking: 26 },
        { id: 27, name: "جامعة أوستيم", name_en: "OSTİM Technical University", city: "أنقرة", city_en: "Ankara", ranking: 27 },
        { id: 28, name: "جامعة ميديبول أنقرة", name_en: "Ankara Medipol University", city: "أنقرة", city_en: "Ankara", ranking: 28 },
        { id: 29, name: "جامعة أتيليم", name_en: "Atılım University", city: "أنقرة", city_en: "Ankara", ranking: 29 },
        { id: 30, name: "جامعة الخليج", name_en: "İstanbul Haliç University", city: "إسطنبول", city_en: "Istanbul", ranking: 30 },
        { id: 31, name: "جامعة لقمان الحكيم", name_en: "Lokman Hekim University", city: "أنقرة", city_en: "Ankara", ranking: 31 },
        { id: 32, name: "جامعة قبرص الدولية", name_en: "Cyprus International University", city: "قبرص التركية", city_en: "Northern Cyprus", ranking: 32 },
        { id: 33, name: "جامعة شرق البحر المتوسط", name_en: "Eastern Mediterranean University", city: "قبرص التركية", city_en: "Northern Cyprus", ranking: 33 },
        { id: 34, name: "جامعة نيشان تاشي", name_en: "Nişantaşı University", city: "إسطنبول", city_en: "Istanbul", ranking: 34 },
        { id: 35, name: "جامعة إسطنبول التجارية", name_en: "İstanbul Ticaret University", city: "إسطنبول", city_en: "Istanbul", ranking: 35 },
        { id: 36, name: "جامعة ياشار", name_en: "Yaşar University", city: "إزمير", city_en: "Izmir", ranking: 36 },
        { id: 37, name: "جامعة إزمير الاقتصادية", name_en: "İzmir University of Economics", city: "إزمير", city_en: "Izmir", ranking: 37 },
        { id: 38, name: "جامعة أنطاليا بيليم", name_en: "Antalya Bilim University", city: "أنطاليا", city_en: "Antalya", ranking: 38 },
        { id: 39, name: "جامعة بورصة أولوداغ", name_en: "Bursa Uludağ University", city: "بورصة", city_en: "Bursa", ranking: 39 },
        { id: 40, name: "جامعة مالتبه", name_en: "Maltepe University", city: "إسطنبول", city_en: "Istanbul", ranking: 40 }
    ],
    
    programs: [
        { id: 1, name: "الطب البشري", name_en: "Medicine", category: "طبي", category_en: "Medical", duration: 6 },
        { id: 2, name: "طب الأسنان", name_en: "Dentistry", category: "طبي", category_en: "Medical", duration: 5 },
        { id: 3, name: "الصيدلة", name_en: "Pharmacy", category: "طبي", category_en: "Medical", duration: 5 },
        { id: 4, name: "التمريض", name_en: "Nursing", category: "طبي", category_en: "Medical", duration: 4 },
        { id: 5, name: "العلاج الطبيعي وإعادة التأهيل", name_en: "Physiotherapy and Rehabilitation", category: "طبي", category_en: "Medical", duration: 4 },
        { id: 6, name: "التغذية والحمية", name_en: "Nutrition and Dietetics", category: "طبي", category_en: "Medical", duration: 4 },
        { id: 7, name: "إدارة الصحة", name_en: "Health Management", category: "طبي", category_en: "Medical", duration: 4 },
        { id: 8, name: "علاج النطق", name_en: "Speech Therapy", category: "طبي", category_en: "Medical", duration: 4 },
        { id: 9, name: "تنمية الطفل", name_en: "Child Development", category: "طبي", category_en: "Medical", duration: 4 },
        { id: 10, name: "هندسة الحاسوب", name_en: "Computer Engineering", category: "هندسي", category_en: "Engineering", duration: 4 },
        { id: 11, name: "هندسة البرمجيات", name_en: "Software Engineering", category: "هندسي", category_en: "Engineering", duration: 4 },
        { id: 12, name: "هندسة الذكاء الاصطناعي", name_en: "Artificial Intelligence Engineering", category: "هندسي", category_en: "Engineering", duration: 4 },
        { id: 13, name: "الهندسة الكهربائية والإلكترونية", name_en: "Electrical and Electronics Engineering", category: "هندسي", category_en: "Engineering", duration: 4 },
        { id: 14, name: "الهندسة الميكانيكية", name_en: "Mechanical Engineering", category: "هندسي", category_en: "Engineering", duration: 4 },
        { id: 15, name: "الهندسة المدنية", name_en: "Civil Engineering", category: "هندسي", category_en: "Engineering", duration: 4 },
        { id: 16, name: "الهندسة المعمارية", name_en: "Architecture", category: "هندسي", category_en: "Engineering", duration: 4 },
        { id: 17, name: "هندسة الميكاترونكس", name_en: "Mechatronics Engineering", category: "هندسي", category_en: "Engineering", duration: 4 },
        { id: 18, name: "الهندسة الصناعية", name_en: "Industrial Engineering", category: "هندسي", category_en: "Engineering", duration: 4 },
        { id: 19, name: "الهندسة الطبية الحيوية", name_en: "Biomedical Engineering", category: "هندسي", category_en: "Engineering", duration: 4 },
        { id: 20, name: "هندسة الطيران", name_en: "Aviation Engineering", category: "هندسي", category_en: "Engineering", duration: 4 },
        { id: 21, name: "إدارة الأعمال", name_en: "Business Administration", category: "إداري", category_en: "Business", duration: 4 },
        { id: 22, name: "الاقتصاد", name_en: "Economics", category: "إداري", category_en: "Business", duration: 4 },
        { id: 23, name: "التجارة الدولية", name_en: "International Trade", category: "إداري", category_en: "Business", duration: 4 },
        { id: 24, name: "المحاسبة والمالية", name_en: "Accounting and Finance", category: "إداري", category_en: "Business", duration: 4 },
        { id: 25, name: "العلوم السياسية والعلاقات الدولية", name_en: "Political Science and International Relations", category: "إداري", category_en: "Business", duration: 4 },
        { id: 26, name: "الحقوق", name_en: "Law", category: "إداري", category_en: "Business", duration: 4 },
        { id: 27, name: "إدارة اللوجستيات", name_en: "Logistics Management", category: "إداري", category_en: "Business", duration: 4 },
        { id: 28, name: "إدارة الطيران", name_en: "Aviation Management", category: "إداري", category_en: "Business", duration: 4 },
        { id: 29, name: "علم النفس", name_en: "Psychology", category: "إنساني", category_en: "Humanities", duration: 4 },
        { id: 30, name: "علم الاجتماع", name_en: "Sociology", category: "إنساني", category_en: "Humanities", duration: 4 },
        { id: 31, name: "الترجمة والترجمة الفورية", name_en: "Translation and Interpretation", category: "إنساني", category_en: "Humanities", duration: 4 },
        { id: 32, name: "اللغة الإنجليزية وآدابها", name_en: "English Language and Literature", category: "إنساني", category_en: "Humanities", duration: 4 },
        { id: 33, name: "التصميم الداخلي", name_en: "Interior Design", category: "فني", category_en: "Arts", duration: 4 },
        { id: 34, name: "التصميم الجرافيكي", name_en: "Graphic Design", category: "فني", category_en: "Arts", duration: 4 },
        { id: 35, name: "السينما والتلفزيون", name_en: "Cinema and Television", category: "فني", category_en: "Arts", duration: 4 },
        { id: 36, name: "تصميم الأزياء", name_en: "Fashion Design", category: "فني", category_en: "Arts", duration: 4 },
        { id: 37, name: "العلاقات العامة والإعلان", name_en: "Public Relations and Advertising", category: "فني", category_en: "Arts", duration: 4 },
        { id: 38, name: "الإعلام الجديد", name_en: "New Media", category: "فني", category_en: "Arts", duration: 4 }
    ],
    
    degrees: [
        { id: 1, name: "بكالوريوس", name_en: "Bachelor" },
        { id: 2, name: "ماجستير", name_en: "Master" },
        { id: 3, name: "دكتوراه", name_en: "PhD" }
    ],
    
    languages: [
        { id: 1, name: "التركية", name_en: "Turkish" },
        { id: 2, name: "الإنجليزية", name_en: "English" },
        { id: 3, name: "العربية", name_en: "Arabic" }
    ]
};

// بيانات الجامعات مع التخصصات والأسعار للعرض في البطاقات
const universityCardsData = [
    {
        id: 34,
        name: "جامعة نيشان تاشي",
        name_en: "Nişantaşı University",
        city: "إسطنبول",
        description: "تعتبر نموذجًا مفتوحًا للتعاون الدولي مع أحدث التطورات التكنولوجية وتركز على تطوير مهارات مبتكرة.",
        programs: [
            { name: "الطب البشري", oldPrice: "$16,500", newPrice: "$12,000" },
            { name: "طب الأسنان", oldPrice: "$17,500", newPrice: "$15,000" },
            { name: "هندسة البرمجيات", oldPrice: "$5,100", newPrice: "$3,800" }
        ],
        tags: ["ريادة أعمال", "تكنولوجيا متقدمة", "ذكاء اصطناعي"],
        tagIcons: ["fas fa-briefcase", "fas fa-microchip", "fas fa-brain"]
    },
    {
        id: 13,
        name: "جامعة أسكودار",
        name_en: "Üsküdar University",
        city: "إسطنبول",
        description: "جامعة رائدة عالميًا تطور وتقدم أكاديمية عالية الجودة وتهدف لتكون من أفضل 500 جامعة في العالم.",
        programs: [
            { name: "الطب البشري", oldPrice: "$20,000", newPrice: "$18,000" },
            { name: "طب الأسنان", oldPrice: "$18,000", newPrice: "$16,000" },
            { name: "هندسة الحاسوب", oldPrice: "$5,000", newPrice: "$4,500" }
        ],
        tags: ["معايير أوروبية", "برامج متقدمة", "تصنيف عالمي"],
        tagIcons: ["fas fa-globe", "fas fa-graduation-cap", "fas fa-certificate"]
    },
    {
        id: 6,
        name: "جامعة إسطنبول آيدن",
        name_en: "İstanbul Aydın University",
        city: "إسطنبول",
        description: "مؤسسة تعليمية رائدة تقدم البحث الأساسية والتطبيقية وتهدف لتحويل المعلومات إلى منتجات.",
        programs: [
            { name: "الطب البشري", oldPrice: "$25,000", newPrice: "$22,000" },
            { name: "طب الأسنان", oldPrice: "$21,850", newPrice: "$19,000" },
            { name: "هندسة البرمجيات", oldPrice: "$5,850", newPrice: "$5,000" }
        ],
        tags: ["تحاليل دولي", "جامعة معتمدة", "أبحاث متقدمة"],
        tagIcons: ["fas fa-microscope", "fas fa-university", "fas fa-flask"]
    },
    {
        id: 5,
        name: "جامعة بهتشه شهير",
        name_en: "Bahçeşehir University",
        city: "إسطنبول",
        description: "جامعة عالمية رائدة تقدم تعليمًا عالي الجودة مع شراكات دولية واسعة وبرامج تبادل طلابي.",
        programs: [
            { name: "الطب البشري", oldPrice: "$28,000", newPrice: "$25,000" },
            { name: "طب الأسنان", oldPrice: "$24,000", newPrice: "$21,000" },
            { name: "إدارة الأعمال", oldPrice: "$6,000", newPrice: "$5,200" }
        ],
        tags: ["شراكات دولية", "تبادل طلابي", "جودة عالمية"],
        tagIcons: ["fas fa-handshake", "fas fa-exchange-alt", "fas fa-star"]
    },
    {
        id: 12,
        name: "جامعة إسطنبول جيليشيم",
        name_en: "İstanbul Gelişim University",
        city: "إسطنبول",
        description: "جامعة حديثة تركز على التطوير المستمر والابتكار في التعليم العالي مع برامج متنوعة.",
        programs: [
            { name: "الطب البشري", oldPrice: "$22,000", newPrice: "$19,500" },
            { name: "طب الأسنان", oldPrice: "$20,000", newPrice: "$17,500" },
            { name: "هندسة الطيران", oldPrice: "$7,000", newPrice: "$6,200" }
        ],
        tags: ["تطوير مستمر", "ابتكار تعليمي", "سوق العمل"],
        tagIcons: ["fas fa-chart-line", "fas fa-lightbulb", "fas fa-briefcase"]
    },
    {
        id: 16,
        name: "جامعة ألتن باش",
        name_en: "Altınbaş University",
        city: "إسطنبول",
        description: "جامعة متميزة تجمع بين التراث الأكاديمي والحداثة التكنولوجية في بيئة تعليمية محفزة.",
        programs: [
            { name: "الطب البشري", oldPrice: "$24,000", newPrice: "$21,000" },
            { name: "طب الأسنان", oldPrice: "$22,000", newPrice: "$19,500" },
            { name: "الهندسة المدنية", oldPrice: "$5,500", newPrice: "$4,800" }
        ],
        tags: ["تراث أكاديمي", "حداثة تكنولوجية", "بيئة إبداعية"],
        tagIcons: ["fas fa-book", "fas fa-laptop", "fas fa-palette"]
    },
    {
        id: 4,
        name: "جامعة إسطنبول ميديبول",
        name_en: "İstanbul Medipol University",
        city: "إسطنبول",
        description: "جامعة طبية رائدة تتخصص في العلوم الصحية والطبية مع مستشفى جامعي متطور.",
        programs: [
            { name: "الطب البشري", oldPrice: "$30,000", newPrice: "$27,000" },
            { name: "طب الأسنان", oldPrice: "$26,000", newPrice: "$23,000" },
            { name: "الصيدلة", oldPrice: "$8,000", newPrice: "$7,200" }
        ],
        tags: ["تخصص طبي", "مستشفى جامعي", "تدريب عملي"],
        tagIcons: ["fas fa-stethoscope", "fas fa-hospital", "fas fa-hands"]
    },
    {
        id: 25,
        name: "جامعة توب كابي",
        name_en: "Topkapı University",
        city: "إسطنبول",
        description: "جامعة عريقة تقع في قلب إسطنبول التاريخي، تجمع بين الأصالة والمعاصرة.",
        programs: [
            { name: "الطب البشري", oldPrice: "$26,000", newPrice: "$23,000" },
            { name: "طب الأسنان", oldPrice: "$23,000", newPrice: "$20,500" },
            { name: "الهندسة المعمارية", oldPrice: "$6,500", newPrice: "$5,800" }
        ],
        tags: ["موقع تاريخي", "أصالة ومعاصرة", "برامج متنوعة"],
        tagIcons: ["fas fa-landmark", "fas fa-balance-scale", "fas fa-layer-group"]
    },
    {
        id: 21,
        name: "جامعة فنار بهشة",
        name_en: "Fenerbahçe University",
        city: "إسطنبول",
        description: "جامعة رياضية متميزة ترتبط بنادي فنربهتشه الشهير مع التركيز على الرياضة والصحة.",
        programs: [
            { name: "الطب الرياضي", oldPrice: "$18,000", newPrice: "$15,500" },
            { name: "العلاج الطبيعي", oldPrice: "$12,000", newPrice: "$10,500" },
            { name: "إدارة الرياضة", oldPrice: "$5,000", newPrice: "$4,200" }
        ],
        tags: ["تخصص رياضي", "صحة ولياقة", "إدارة رياضية"],
        tagIcons: ["fas fa-running", "fas fa-heartbeat", "fas fa-trophy"]
    },
    {
        id: 1,
        name: "جامعة كوتش",
        name_en: "Koç University",
        city: "إسطنبول",
        description: "جامعة بحثية رائدة تركز على التميز الأكاديمي والبحث العلمي، من أفضل الجامعات الخاصة.",
        programs: [
            { name: "الطب البشري", oldPrice: "$35,000", newPrice: "$32,000" },
            { name: "الهندسة الطبية الحيوية", oldPrice: "$15,000", newPrice: "$13,500" },
            { name: "إدارة الأعمال", oldPrice: "$12,000", newPrice: "$10,800" }
        ],
        tags: ["بحث علمي", "تميز أكاديمي", "جامعة رائدة"],
        tagIcons: ["fas fa-microscope", "fas fa-medal", "fas fa-crown"]
    },
    {
        id: 2,
        name: "جامعة سابانجي",
        name_en: "Sabancı University",
        city: "إسطنبول",
        description: "جامعة تكنولوجية متقدمة تركز على الابتكار والبحث العلمي في التكنولوجيا والهندسة.",
        programs: [
            { name: "هندسة الحاسوب", oldPrice: "$18,000", newPrice: "$16,200" },
            { name: "هندسة الإلكترونيات", oldPrice: "$17,000", newPrice: "$15,300" },
            { name: "علوم البيانات", oldPrice: "$14,000", newPrice: "$12,600" }
        ],
        tags: ["تكنولوجيا متقدمة", "ابتكار وبحث", "علوم تطبيقية"],
        tagIcons: ["fas fa-microchip", "fas fa-rocket", "fas fa-atom"]
    },
    {
        id: 9,
        name: "جامعة يدي تبه",
        name_en: "Yeditepe University",
        city: "إسطنبول",
        description: "جامعة شاملة تقدم برامج متنوعة في جميع التخصصات مع التركيز على الجودة التعليمية.",
        programs: [
            { name: "الطب البشري", oldPrice: "$28,000", newPrice: "$25,200" },
            { name: "طب الأسنان", oldPrice: "$25,000", newPrice: "$22,500" },
            { name: "الصيدلة", oldPrice: "$10,000", newPrice: "$9,000" }
        ],
        tags: ["برامج شاملة", "جودة تعليمية", "بحث متطور"],
        tagIcons: ["fas fa-university", "fas fa-award", "fas fa-search"]
    },
    {
        id: 11,
        name: "جامعة بيروني",
        name_en: "Biruni University",
        city: "إسطنبول",
        description: "جامعة تركّز على العلوم الصحية والطبية مع بيئة أكاديمية حديثة تدعم البحث والتطوير.",
        programs: [
            { name: "الطب البشري", oldPrice: "$27,000", newPrice: "$24,000" },
            { name: "الصيدلة", oldPrice: "$9,500", newPrice: "$8,000" },
            { name: "العلاج الطبيعي", oldPrice: "$6,000", newPrice: "$5,200" }
        ],
        tags: ["علوم صحية", "بحث وتطوير", "بيئة حديثة"],
        tagIcons: ["fas fa-heartbeat", "fas fa-flask", "fas fa-building"]
    },
    {
        id: 15,
        name: "جامعة يني يوزيل",
        name_en: "İstanbul Yeni Yüzyıl University",
        city: "إسطنبول",
        description: "جامعة حديثة تقدم برامج متنوعة بأسعار تنافسية مع التركيز على الجودة والتطبيق العملي.",
        programs: [
            { name: "الطب البشري", oldPrice: "$15,000", newPrice: "$12,000" },
            { name: "طب الأسنان", oldPrice: "$12,000", newPrice: "$10,000" },
            { name: "هندسة الحاسوب", oldPrice: "$4,000", newPrice: "$3,500" }
        ],
        tags: ["أسعار تنافسية", "برامج متنوعة", "تطبيق عملي"],
        tagIcons: ["fas fa-tags", "fas fa-list", "fas fa-tools"]
    },
    {
        id: 19,
        name: "جامعة كنت",
        name_en: "İstanbul Kent University",
        city: "إسطنبول",
        description: "جامعة تقدم تعليماً عالي الجودة بأسعار معقولة مع التركيز على التخصصات المطلوبة.",
        programs: [
            { name: "التمريض", oldPrice: "$3,000", newPrice: "$2,000" },
            { name: "العلاج الطبيعي", oldPrice: "$3,500", newPrice: "$2,500" },
            { name: "إدارة الأعمال", oldPrice: "$2,800", newPrice: "$2,000" }
        ],
        tags: ["أسعار معقولة", "جودة عالية", "تخصصات مطلوبة"],
        tagIcons: ["fas fa-dollar-sign", "fas fa-check-circle", "fas fa-briefcase"]
    },
    {
        id: 17,
        name: "جامعة أوكان",
        name_en: "Okan University",
        city: "إسطنبول",
        description: "جامعة متكاملة تقدم برامج أكاديمية متنوعة مع شراكات صناعية قوية.",
        programs: [
            { name: "الطب البشري", oldPrice: "$23,000", newPrice: "$20,450" },
            { name: "هندسة البرمجيات", oldPrice: "$5,000", newPrice: "$4,200" },
            { name: "إدارة الأعمال", oldPrice: "$4,500", newPrice: "$3,800" }
        ],
        tags: ["شراكات صناعية", "برامج متكاملة", "فرص عمل"],
        tagIcons: ["fas fa-industry", "fas fa-graduation-cap", "fas fa-briefcase"]
    }
];

// بيانات الأقساط والتخصصات لكل جامعة (للبحث)
const tuitionData = [
    // جامعة كوتش
    { university_id: 1, program_id: 1, degree_id: 1, language_id: 2, tuition: 29500 },
    { university_id: 1, program_id: 10, degree_id: 1, language_id: 2, tuition: 22000 },
    { university_id: 1, program_id: 21, degree_id: 1, language_id: 2, tuition: 22000 },
    { university_id: 1, program_id: 22, degree_id: 1, language_id: 2, tuition: 22000 },
    
    // جامعة إسطنبول ميديبول
    { university_id: 4, program_id: 1, degree_id: 1, language_id: 2, tuition: 39000 },
    { university_id: 4, program_id: 1, degree_id: 1, language_id: 1, tuition: 32000 },
    { university_id: 4, program_id: 2, degree_id: 1, language_id: 2, tuition: 28000 },
    { university_id: 4, program_id: 2, degree_id: 1, language_id: 1, tuition: 22000 },
    { university_id: 4, program_id: 3, degree_id: 1, language_id: 2, tuition: 10000 },
    { university_id: 4, program_id: 5, degree_id: 1, language_id: 1, tuition: 4000 },
    { university_id: 4, program_id: 10, degree_id: 1, language_id: 2, tuition: 6500 },
    { university_id: 4, program_id: 11, degree_id: 1, language_id: 2, tuition: 6500 },
    
    // جامعة بهتشه شهير
    { university_id: 5, program_id: 1, degree_id: 1, language_id: 2, tuition: 28000 },
    { university_id: 5, program_id: 2, degree_id: 1, language_id: 2, tuition: 22000 },
    { university_id: 5, program_id: 10, degree_id: 1, language_id: 2, tuition: 7900 },
    { university_id: 5, program_id: 11, degree_id: 1, language_id: 2, tuition: 7900 },
    { university_id: 5, program_id: 21, degree_id: 1, language_id: 2, tuition: 5900 },
    { university_id: 5, program_id: 29, degree_id: 1, language_id: 2, tuition: 5900 },
    { university_id: 5, program_id: 25, degree_id: 1, language_id: 2, tuition: 5900 },
    
    // جامعة إسطنبول آيدن
    { university_id: 6, program_id: 1, degree_id: 1, language_id: 2, tuition: 23750 },
    { university_id: 6, program_id: 1, degree_id: 1, language_id: 1, tuition: 20000 },
    { university_id: 6, program_id: 2, degree_id: 1, language_id: 2, tuition: 20000 },
    { university_id: 6, program_id: 2, degree_id: 1, language_id: 1, tuition: 18000 },
    { university_id: 6, program_id: 10, degree_id: 1, language_id: 2, tuition: 5400 },
    { university_id: 6, program_id: 11, degree_id: 1, language_id: 2, tuition: 5400 },
    { university_id: 6, program_id: 21, degree_id: 1, language_id: 2, tuition: 5400 },
    { university_id: 6, program_id: 29, degree_id: 1, language_id: 2, tuition: 5400 },
    { university_id: 6, program_id: 33, degree_id: 1, language_id: 1, tuition: 5400 },
    { university_id: 6, program_id: 16, degree_id: 1, language_id: 1, tuition: 5400 },
    
    // جامعة استينيا
    { university_id: 7, program_id: 1, degree_id: 1, language_id: 2, tuition: 29000 },
    { university_id: 7, program_id: 2, degree_id: 1, language_id: 2, tuition: 22000 },
    { university_id: 7, program_id: 3, degree_id: 1, language_id: 2, tuition: 9000 },
    { university_id: 7, program_id: 10, degree_id: 1, language_id: 2, tuition: 5200 },
    { university_id: 7, program_id: 21, degree_id: 1, language_id: 2, tuition: 5200 },
    
    // جامعة يدي تبه
    { university_id: 9, program_id: 1, degree_id: 1, language_id: 2, tuition: 32100 },
    { university_id: 9, program_id: 2, degree_id: 1, language_id: 2, tuition: 25000 },
    { university_id: 9, program_id: 3, degree_id: 1, language_id: 2, tuition: 12000 },
    { university_id: 9, program_id: 29, degree_id: 1, language_id: 2, tuition: 9000 },
    
    // جامعة بيروني
    { university_id: 11, program_id: 1, degree_id: 1, language_id: 2, tuition: 18500 },
    { university_id: 11, program_id: 1, degree_id: 1, language_id: 1, tuition: 15000 },
    { university_id: 11, program_id: 2, degree_id: 1, language_id: 1, tuition: 12500 },
    { university_id: 11, program_id: 3, degree_id: 1, language_id: 1, tuition: 6000 },
    { university_id: 11, program_id: 5, degree_id: 1, language_id: 1, tuition: 4410 },
    { university_id: 11, program_id: 29, degree_id: 1, language_id: 1, tuition: 4410 },
    
    // جامعة جيليشيم
    { university_id: 12, program_id: 1, degree_id: 1, language_id: 2, tuition: 17250 },
    { university_id: 12, program_id: 1, degree_id: 1, language_id: 1, tuition: 14000 },
    { university_id: 12, program_id: 2, degree_id: 1, language_id: 2, tuition: 14000 },
    { university_id: 12, program_id: 2, degree_id: 1, language_id: 1, tuition: 11500 },
    { university_id: 12, program_id: 10, degree_id: 1, language_id: 2, tuition: 4000 },
    { university_id: 12, program_id: 10, degree_id: 1, language_id: 1, tuition: 3500 },
    { university_id: 12, program_id: 11, degree_id: 1, language_id: 2, tuition: 4000 },
    { university_id: 12, program_id: 11, degree_id: 1, language_id: 1, tuition: 3500 },
    { university_id: 12, program_id: 21, degree_id: 1, language_id: 2, tuition: 4000 },
    { university_id: 12, program_id: 21, degree_id: 1, language_id: 1, tuition: 3500 },
    { university_id: 12, program_id: 29, degree_id: 1, language_id: 2, tuition: 4000 },
    { university_id: 12, program_id: 29, degree_id: 1, language_id: 1, tuition: 3500 },
    { university_id: 12, program_id: 33, degree_id: 1, language_id: 1, tuition: 3500 },
    { university_id: 12, program_id: 16, degree_id: 1, language_id: 2, tuition: 4000 },
    { university_id: 12, program_id: 16, degree_id: 1, language_id: 1, tuition: 3500 },
    { university_id: 12, program_id: 25, degree_id: 1, language_id: 2, tuition: 4000 },
    { university_id: 12, program_id: 25, degree_id: 1, language_id: 1, tuition: 3500 },
    { university_id: 12, program_id: 26, degree_id: 1, language_id: 1, tuition: 3500 },
    { university_id: 12, program_id: 20, degree_id: 1, language_id: 2, tuition: 5000 },
    
    // جامعة أسكودار
    { university_id: 13, program_id: 1, degree_id: 1, language_id: 2, tuition: 22800 },
    { university_id: 13, program_id: 1, degree_id: 1, language_id: 1, tuition: 18000 },
    { university_id: 13, program_id: 2, degree_id: 1, language_id: 1, tuition: 15000 },
    { university_id: 13, program_id: 29, degree_id: 1, language_id: 2, tuition: 4500 },
    { university_id: 13, program_id: 29, degree_id: 1, language_id: 1, tuition: 4500 },
    
    // جامعة يني يوزيل
    { university_id: 15, program_id: 1, degree_id: 1, language_id: 2, tuition: 12000 },
    { university_id: 15, program_id: 1, degree_id: 1, language_id: 1, tuition: 10000 },
    { university_id: 15, program_id: 2, degree_id: 1, language_id: 2, tuition: 10000 },
    { university_id: 15, program_id: 2, degree_id: 1, language_id: 1, tuition: 8500 },
    { university_id: 15, program_id: 3, degree_id: 1, language_id: 1, tuition: 4500 },
    { university_id: 15, program_id: 10, degree_id: 1, language_id: 2, tuition: 2800 },
    { university_id: 15, program_id: 10, degree_id: 1, language_id: 1, tuition: 2300 },
    { university_id: 15, program_id: 11, degree_id: 1, language_id: 2, tuition: 2800 },
    { university_id: 15, program_id: 11, degree_id: 1, language_id: 1, tuition: 2300 },
    { university_id: 15, program_id: 21, degree_id: 1, language_id: 2, tuition: 2800 },
    { university_id: 15, program_id: 21, degree_id: 1, language_id: 1, tuition: 2300 },
    { university_id: 15, program_id: 5, degree_id: 1, language_id: 1, tuition: 2300 },
    { university_id: 15, program_id: 29, degree_id: 1, language_id: 1, tuition: 2300 },
    { university_id: 15, program_id: 33, degree_id: 1, language_id: 1, tuition: 2300 },
    { university_id: 15, program_id: 16, degree_id: 1, language_id: 1, tuition: 2300 },
    { university_id: 15, program_id: 26, degree_id: 1, language_id: 1, tuition: 2300 },
    { university_id: 15, program_id: 4, degree_id: 1, language_id: 1, tuition: 2300 },
    
    // جامعة ألتن باش
    { university_id: 16, program_id: 1, degree_id: 1, language_id: 2, tuition: 21250 },
    { university_id: 16, program_id: 2, degree_id: 1, language_id: 2, tuition: 18000 },
    { university_id: 16, program_id: 3, degree_id: 1, language_id: 2, tuition: 7500 },
    { university_id: 16, program_id: 10, degree_id: 1, language_id: 2, tuition: 4500 },
    { university_id: 16, program_id: 21, degree_id: 1, language_id: 2, tuition: 4500 },
    { university_id: 16, program_id: 29, degree_id: 1, language_id: 2, tuition: 4500 },
    
    // جامعة أوكان
    { university_id: 17, program_id: 1, degree_id: 1, language_id: 2, tuition: 20450 },
    { university_id: 17, program_id: 2, degree_id: 1, language_id: 2, tuition: 16000 },
    { university_id: 17, program_id: 10, degree_id: 1, language_id: 2, tuition: 4500 },
    { university_id: 17, program_id: 21, degree_id: 1, language_id: 2, tuition: 3800 },
    
    // جامعة كنت
    { university_id: 19, program_id: 4, degree_id: 1, language_id: 1, tuition: 2000 },
    { university_id: 19, program_id: 5, degree_id: 1, language_id: 1, tuition: 2000 },
    { university_id: 19, program_id: 21, degree_id: 1, language_id: 1, tuition: 2000 },
    { university_id: 19, program_id: 29, degree_id: 1, language_id: 1, tuition: 2000 },
    { university_id: 19, program_id: 33, degree_id: 1, language_id: 1, tuition: 2000 },
    
    // جامعة توب كابي
    { university_id: 25, program_id: 10, degree_id: 1, language_id: 1, tuition: 1950 },
    { university_id: 25, program_id: 21, degree_id: 1, language_id: 1, tuition: 1950 },
    { university_id: 25, program_id: 33, degree_id: 1, language_id: 1, tuition: 1950 },
    
    // جامعة نيشان تاشي
    { university_id: 34, program_id: 10, degree_id: 1, language_id: 2, tuition: 2950 },
    { university_id: 34, program_id: 21, degree_id: 1, language_id: 2, tuition: 2950 },
    { university_id: 34, program_id: 29, degree_id: 1, language_id: 2, tuition: 2950 },
    
    // المزيد من البيانات...
    { university_id: 14, program_id: 10, degree_id: 1, language_id: 2, tuition: 6900 },
    { university_id: 14, program_id: 21, degree_id: 1, language_id: 2, tuition: 6900 },
    { university_id: 14, program_id: 29, degree_id: 1, language_id: 2, tuition: 6900 },
    { university_id: 14, program_id: 26, degree_id: 1, language_id: 1, tuition: 6900 },
    
    { university_id: 8, program_id: 10, degree_id: 1, language_id: 2, tuition: 7200 },
    { university_id: 8, program_id: 21, degree_id: 1, language_id: 2, tuition: 7200 },
    { university_id: 8, program_id: 16, degree_id: 1, language_id: 2, tuition: 7200 },
    
    { university_id: 18, program_id: 10, degree_id: 1, language_id: 1, tuition: 2450 },
    { university_id: 18, program_id: 21, degree_id: 1, language_id: 1, tuition: 2450 },
    { university_id: 18, program_id: 16, degree_id: 1, language_id: 1, tuition: 2450 },
    
    { university_id: 20, program_id: 21, degree_id: 1, language_id: 1, tuition: 2050 },
    { university_id: 20, program_id: 27, degree_id: 1, language_id: 1, tuition: 2050 },
    { university_id: 20, program_id: 23, degree_id: 1, language_id: 1, tuition: 2050 },
    { university_id: 20, program_id: 37, degree_id: 1, language_id: 1, tuition: 2050 },
    
    { university_id: 21, program_id: 21, degree_id: 1, language_id: 1, tuition: 3135 },
    { university_id: 21, program_id: 29, degree_id: 1, language_id: 1, tuition: 3135 },
    { university_id: 21, program_id: 37, degree_id: 1, language_id: 1, tuition: 3135 },
    
    { university_id: 22, program_id: 1, degree_id: 1, language_id: 2, tuition: 19130 },
    { university_id: 22, program_id: 2, degree_id: 1, language_id: 2, tuition: 15000 },
    { university_id: 22, program_id: 10, degree_id: 1, language_id: 2, tuition: 3500 },
    { university_id: 22, program_id: 21, degree_id: 1, language_id: 2, tuition: 3150 },
    { university_id: 22, program_id: 29, degree_id: 1, language_id: 2, tuition: 3150 },
    
    { university_id: 23, program_id: 10, degree_id: 1, language_id: 1, tuition: 2800 },
    { university_id: 23, program_id: 21, degree_id: 1, language_id: 1, tuition: 2800 },
    { university_id: 23, program_id: 16, degree_id: 1, language_id: 1, tuition: 2800 },
    
    { university_id: 24, program_id: 21, degree_id: 1, language_id: 1, tuition: 3500 },
    { university_id: 24, program_id: 27, degree_id: 1, language_id: 1, tuition: 3500 },
    { university_id: 24, program_id: 37, degree_id: 1, language_id: 1, tuition: 3500 },
    
    { university_id: 26, program_id: 10, degree_id: 1, language_id: 1, tuition: 2200 },
    { university_id: 26, program_id: 21, degree_id: 1, language_id: 2, tuition: 2800 },
    
    { university_id: 27, program_id: 10, degree_id: 1, language_id: 2, tuition: 5250 },
    { university_id: 27, program_id: 14, degree_id: 1, language_id: 2, tuition: 5250 },
    { university_id: 27, program_id: 18, degree_id: 1, language_id: 2, tuition: 5250 },
    
    { university_id: 28, program_id: 1, degree_id: 1, language_id: 1, tuition: 18000 },
    { university_id: 28, program_id: 2, degree_id: 1, language_id: 1, tuition: 14000 },
    
    { university_id: 29, program_id: 1, degree_id: 1, language_id: 2, tuition: 18750 },
    { university_id: 29, program_id: 10, degree_id: 1, language_id: 2, tuition: 6000 },
    
    { university_id: 30, program_id: 1, degree_id: 1, language_id: 1, tuition: 19950 },
    { university_id: 30, program_id: 10, degree_id: 1, language_id: 1, tuition: 3500 },
    { university_id: 30, program_id: 21, degree_id: 1, language_id: 1, tuition: 3500 },
    
    { university_id: 31, program_id: 1, degree_id: 1, language_id: 1, tuition: 16000 },
    { university_id: 31, program_id: 2, degree_id: 1, language_id: 1, tuition: 12000 },
    
    { university_id: 32, program_id: 1, degree_id: 1, language_id: 2, tuition: 7400 },
    { university_id: 32, program_id: 10, degree_id: 1, language_id: 2, tuition: 2900 },
    { university_id: 32, program_id: 21, degree_id: 1, language_id: 2, tuition: 2500 },
    { university_id: 32, program_id: 29, degree_id: 1, language_id: 2, tuition: 2500 },
    
    { university_id: 33, program_id: 1, degree_id: 1, language_id: 2, tuition: 13845 },
    { university_id: 33, program_id: 10, degree_id: 1, language_id: 2, tuition: 4500 },
    { university_id: 33, program_id: 21, degree_id: 1, language_id: 2, tuition: 4000 },
    
    { university_id: 35, program_id: 10, degree_id: 1, language_id: 2, tuition: 5500 },
    { university_id: 35, program_id: 21, degree_id: 1, language_id: 2, tuition: 5500 },
    { university_id: 35, program_id: 26, degree_id: 1, language_id: 1, tuition: 5500 },
    
    { university_id: 36, program_id: 10, degree_id: 1, language_id: 2, tuition: 5500 },
    { university_id: 36, program_id: 21, degree_id: 1, language_id: 2, tuition: 5500 },
    { university_id: 36, program_id: 16, degree_id: 1, language_id: 2, tuition: 5500 },
    
    { university_id: 37, program_id: 10, degree_id: 1, language_id: 2, tuition: 6000 },
    { university_id: 37, program_id: 21, degree_id: 1, language_id: 2, tuition: 6000 },
    { university_id: 37, program_id: 16, degree_id: 1, language_id: 2, tuition: 6000 },
    
    { university_id: 38, program_id: 1, degree_id: 1, language_id: 2, tuition: 16000 },
    { university_id: 38, program_id: 10, degree_id: 1, language_id: 2, tuition: 4500 },
    { university_id: 38, program_id: 21, degree_id: 1, language_id: 2, tuition: 4000 },
    
    { university_id: 40, program_id: 1, degree_id: 1, language_id: 2, tuition: 18000 },
    { university_id: 40, program_id: 2, degree_id: 1, language_id: 2, tuition: 15000 },
    { university_id: 40, program_id: 10, degree_id: 1, language_id: 2, tuition: 5000 },
    { university_id: 40, program_id: 21, degree_id: 1, language_id: 2, tuition: 4500 },
    { university_id: 40, program_id: 29, degree_id: 1, language_id: 2, tuition: 4500 }
];
