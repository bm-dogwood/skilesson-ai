export const translations = {
  en: {
    hero: {
      badge: "NOW IN EARLY ACCESS",
      title1: "Master the Mountain.",
      title2: "Before You Hit the Slopes.",
      subtitle: "World-class ski and snowboard lessons you can take from home.",
      ctaPrimary: "Start Your Journey",
      ctaSecondary: "See How It Works",
      trustLine:
        "Free 7-day trial · Cancel anytime · No equipment needed to start",
    },
    stats: {
      students: "Students Enrolled",
      lessons: "Expert Lessons",
      levels: "Skill Levels",
      instructors: "Pro Instructors",
      footnote:
        "Taught by Olympians, PSIA-certified instructors, and professional athletes",
    },
    how: {
      label: "How It Works",
      heading: "Three steps to the summit",
      sub: "We took the best of in-person ski school and made it available anywhere.",
      step1: {
        title: "Choose Your Level",
        desc: "Our placement quiz matches you with the right curriculum.",
      },
      step2: {
        title: "Learn From Pros",
        desc: "Lessons taught by Olympic-level instructors.",
      },
      step3: {
        title: "Track Your Progress",
        desc: "Earn badges and get AI-powered feedback.",
      },
    },
    curriculum: {
      badge: "Curriculum",
      heading: "Every level. Every style. Every goal.",
      sub: "Our curriculum is designed by certified instructors and structured for progression — whether you are clicking into skis for the first time or looking to conquer double blacks.",
      exploreLink: "Explore curriculum",
      beginner: {
        tag: "Start Here",
        topics: [
          "Gear selection and setup",
          "Balance and stance fundamentals",
          "Snowplow turns and stopping",
          "Riding the lift with confidence",
          "First green run preparation",
        ],
      },
      intermediate: {
        tag: "Most Popular",
        topics: [
          "Parallel turn technique",
          "Carving fundamentals",
          "Variable terrain tactics",
          "Speed control on blue runs",
          "Introduction to moguls",
        ],
      },
      advanced: {
        tag: "Push Limits",
        topics: [
          "Black diamond strategy",
          "Powder skiing technique",
          "Mogul mastery",
          "Racing fundamentals",
          "Backcountry safety basics",
        ],
      },
    },
    families: {
      badge: "For Families",
      heading: "Built for families who ride together",
      sub: "Skiing is a family sport. Our platform is designed from the ground up to make learning fun, safe, and accessible for every member of the family — from five-year-olds to grandparents.",
      features: [
        {
          title: "Kid-Safe Environment",
          description:
            "No ads, no distractions, no outside links. A safe learning space designed for young athletes ages 5 and up.",
        },
        {
          title: "Family Plans",
          description:
            "One subscription covers everyone. Parents and kids learn together with separate profiles and progress tracking.",
        },
        {
          title: "Parent Dashboard",
          description:
            "See what your kids are learning, how they are progressing, and what skills they have mastered — all from your phone.",
        },
        {
          title: "Badges & Rewards",
          description:
            "Kids earn digital badges as they complete lessons and hit milestones. Real motivation built into every level.",
        },
      ],
    },
    aiCoach: {
      heading: "Your Personal",
      highlight: "AI Snow Coach",
      sub: "Imagine a coach that knows exactly where you are in your journey, adapts to your pace, answers your questions, and keeps you motivated between lessons. That is what we are building.",
      feature1Title: "Adaptive Learning",
      feature1Desc:
        "AI adjusts your lesson plan based on what you have mastered and where you need work.",
      feature2Title: "Ask Anything",
      feature2Desc:
        "Get instant answers to technique questions, gear advice, and mountain conditions.",
      feature3Title: "Smart Progress",
      feature3Desc:
        "AI-generated insights on your strengths, growth areas, and personalized next steps.",
    },
    instructors: {
      badge: "Our Instructors",
      heading: "Learn from the best in the business",
      sub: "Every lesson is taught by a certified professional with real competition or resort experience. No amateurs. No shortcuts.",
      locationTitle: "Filmed on Location",
      locations: "Vail, Aspen, Park City & more",
      credentials: [
        "PSIA / AASI Certified Level III",
        "Olympic & World Cup Athletes",
        "20+ Years Average Teaching Experience",
        "Vail, Aspen, Park City Veterans",
      ],
    },
    cta: {
      title: "Ready to Master the Mountain?",
      subtitle: "Join thousands of students who show up confident and ready.",
      button: "Start Your Free Trial",
    },
    ctaa: {
      title: "Ready to Master the Mountain?",
      subtitle: "Join thousands of students who show up confident and ready.",
      button: "Start Your Free Trial",
      secondaryLink: "View pricing →",
      finePrint: "7 days free · From $14.99/mo · Cancel anytime",
    },

    // -------------------------
    // NAVBAR
    // -------------------------
    nav: {
      howItWorks: "How It Works",
      curriculum: "Curriculum",
      pricing: "Pricing",
      about: "About",
      dashboard: "Dashboard",
      signIn: "Sign In",
      startFreeTrial: "Start Free Trial",
    },

    // -------------------------
    // FOOTER
    // -------------------------
    footer: {
      tagline:
        "The premier online platform for ski and snowboard education. Learn from world-class instructors, track your progress, and hit the mountain with confidence.",
      newsletterHeading: "Stay in the loop",
      newsletterSub: "Get early access, tips, and mountain updates.",
      emailPlaceholder: "you@email.com",
      companyHeading: "Company",
      curriculumHeading: "Curriculum",
      supportHeading: "Support",
      copyright: "© 2026 SkiLesson.ai — A Dogwood Brands Company",
      links: {
        company: [
          { label: "About Us", href: "/about" },
          { label: "Our Instructors", href: "/instructors" },
        ],
        curriculum: [
          { label: "Explorer", href: "/pricing" },
          { label: "Summit", href: "/pricing" },
          { label: "Apex", href: "/pricing" },
        ],
        support: [
          { label: "Home Page", href: "/" },
          { label: "Contact Us", href: "/contact" },
          { label: "Sign In", href: "/signin" },
          { label: "Pricing", href: "/pricing" },
        ],
      },
    },

    // -------------------------
    // PRICING PAGE
    // -------------------------
    pricing: {
      badge: "Start with a 7-day free trial",
      title1: "Invest in Your",
      title2: "Mountain Journey",
      subtitle:
        "World-class ski and snowboard instruction, powered by AI, delivered on demand. Choose the plan that matches your ambition.",
      billingMonthly: "Monthly",
      billingAnnual: "Annual",
      savingsLabel: "Save up to ${{amount}}",
      trialButton: "Start 7-Day Free Trial",
      billedAnnually: "billed annually",
      savePerYear: "Save ${{amount}}/year",
      mostPopular: "Most Popular",
      perMonth: "/mo",
      guarantee: {
        title: "30-Day Money-Back Guarantee",
        subtitle:
          "Not the right fit? Get a full refund within 30 days. No questions asked.",
      },
      // Keyed by the lowercase DB name — used to look up translated name + description
      plans: {
        explorer: {
          name: "Explorer",
          description:
            "Perfect for beginners who want to build confidence before their first lesson.",
        },
        summit: {
          name: "Summit",
          description:
            "For intermediate skiers ready to sharpen their technique and tackle harder terrain.",
        },
        apex: {
          name: "Apex",
          description:
            "The complete package for serious skiers and families who want it all.",
        },
      },
      faq: {
        heading: "Frequently Asked Questions",
        subheading: "Everything you need to know before hitting the slopes.",
        items: [
          {
            question: "Can I switch plans anytime?",
            answer:
              "Absolutely. Upgrade or downgrade your plan at any time from your account settings. When upgrading, you'll get immediate access to new features and we'll prorate the difference. Downgrading takes effect at the end of your current billing cycle so you never lose access mid-period.",
          },
          {
            question: "What's included in the free trial?",
            answer:
              "Your 7-day free trial gives you full, unrestricted access to every feature in your chosen plan. Explore lessons, track progress, chat with AI Coach — the complete experience. No charge until day 8, and you can cancel anytime during the trial with zero commitment.",
          },
          {
            question: "Is there a family discount?",
            answer:
              "Yes! The Apex plan includes a built-in family discount — up to 4 profiles under one subscription. Compared to individual plans, families save over 60%. Each family member gets their own personalized dashboard, progress tracking, and AI Coach experience.",
          },
          {
            question: "Can I cancel anytime?",
            answer:
              "No contracts, no cancellation fees, no questions asked. Cancel your subscription anytime from your account settings. You'll continue to have access through the end of your current billing period. Plus, our 30-day money-back guarantee means you can try us completely risk-free.",
          },
          {
            question: "Do I need any equipment to start?",
            answer:
              "Not at all. Many of our foundational lessons focus on body positioning, balance drills, and fitness exercises you can practice at home. When you're ready to hit the slopes, our comprehensive equipment guides will help you choose the right gear for your level and budget.",
          },
          {
            question: "How are lessons delivered?",
            answer:
              "Lessons are delivered through our premium streaming platform, available on web, iOS, and Android. Each lesson includes HD video instruction, slow-motion breakdowns, on-screen annotations, and downloadable practice checklists. Watch anytime, anywhere — even offline with our mobile app.",
          },
        ],
      },
      enterprise: {
        heading: "Training Your Team?",
        sub: "Custom plans for ski schools, corporate retreats, and group programs. Volume pricing, admin dashboards, and dedicated onboarding for teams of 10+.",
        cta: "Contact Us",
      },
    },

    // -------------------------
    // ABOUT PAGE
    // -------------------------
    about: {
      badge: "Our Story",
      title1: "Built by Mountain Lovers,",
      title2: "for Mountain Lovers",
      subtitle:
        "We believe everyone deserves to experience the magic of the mountains. SkiLesson.ai brings world-class instruction to your living room, so when you finally stand at the summit, you're ready.",
      whereWeTeach: "Where We Teach",
      whereWeTeachLocations: "Vail · Aspen · Park City · Breckenridge",
      team: {
        heading: "The Team Behind the Summit",
        sub: "Decades of mountain experience meets modern technology.",
        members: [
          {
            name: "Tyler Berglund",
            title: "Head of Instruction & Operations",
            bio: "20+ years on the slopes of Vail. Former ski school director. PSIA Level 3 certified. Tyler has taught thousands of students from first-timers to expert racers.",
          },
        ],
      },
      approach: {
        heading: "Our Approach",
        sub: "Four pillars that define how we teach and why it works.",
        pillars: [
          {
            title: "Learn Anywhere",
            description:
              "No mountain? No problem. Build your foundation at home.",
          },
          {
            title: "Progress at Your Pace",
            description:
              "Every student is different. Our adaptive curriculum meets you where you are.",
          },
          {
            title: "Real Instruction",
            description:
              "Every lesson is designed by certified instructors, not generated by AI.",
          },
          {
            title: "Family First",
            description:
              "Built for families. Parents track progress. Kids build confidence.",
          },
        ],
      },
      affiliations: {
        heading: "Trusted Affiliations",
        sub: "Our curriculum aligns with the highest standards in snow sports instruction.",
        psia: {
          name: "PSIA-AASI",
          description: "Professional Ski Instructors of America",
        },
        nsp: {
          name: "National Ski Patrol",
          description: "Safety-first instruction methodology",
        },
      },
      cta: {
        heading: "Join Thousands of Students Mastering the Mountain",
        sub: "Start your journey today with a free 7-day trial. No credit card required.",
        button: "Start Free Trial",
      },
    },
  },

  // ===========================================================
  // SPANISH
  // ===========================================================
  es: {
    hero: {
      badge: "ACCESO ANTICIPADO",
      title1: "Domina la montaña.",
      title2: "Antes de pisar las pistas.",
      subtitle: "Clases de esquí y snowboard de nivel mundial desde casa.",
      ctaPrimary: "Comienza tu viaje",
      ctaSecondary: "Ver cómo funciona",
      trustLine:
        "7 días gratis · Cancela cuando quieras · Sin equipo para empezar",
    },
    stats: {
      students: "Estudiantes inscritos",
      lessons: "Lecciones expertas",
      levels: "Niveles",
      instructors: "Instructores profesionales",
      footnote:
        "Con instructores olímpicos, certificados PSIA y atletas profesionales",
    },
    how: {
      label: "Cómo funciona",
      heading: "Tres pasos hacia la cima",
      sub: "Llevamos la escuela de esquí a cualquier lugar.",
      step1: {
        title: "Elige tu nivel",
        desc: "Nuestro test te ubica en el nivel correcto.",
      },
      step2: {
        title: "Aprende de profesionales",
        desc: "Clases impartidas por expertos olímpicos.",
      },
      step3: {
        title: "Sigue tu progreso",
        desc: "Gana logros y recibe feedback con IA.",
      },
    },
    curriculum: {
      badge: "Plan de estudios",
      heading: "Cada nivel. Cada estilo. Cada objetivo.",
      sub: "Nuestro plan de estudios está diseñado por instructores certificados y estructurado para progresar — ya sea que estés empezando o buscando dominar pistas avanzadas.",
      exploreLink: "Explorar plan",
      beginner: {
        tag: "Empieza aquí",
        topics: [
          "Selección y configuración de equipo",
          "Fundamentos de equilibrio y postura",
          "Giros de cuña y frenado",
          "Subir al telesilla con confianza",
          "Preparación para la primera pista verde",
        ],
      },
      intermediate: {
        tag: "Más popular",
        topics: [
          "Técnica de giro paralelo",
          "Fundamentos de carving",
          "Tácticas en terreno variable",
          "Control de velocidad en pistas azules",
          "Introducción a los moguls",
        ],
      },
      advanced: {
        tag: "Supera tus límites",
        topics: [
          "Estrategia en pistas negras",
          "Técnica de esquí en nieve polvo",
          "Dominio de moguls",
          "Fundamentos de carreras",
          "Seguridad en zonas fuera de pista",
        ],
      },
    },
    families: {
      badge: "Para familias",
      heading: "Diseñado para familias que esquían juntas",
      sub: "El esquí es un deporte familiar. Nuestra plataforma está diseñada para que aprender sea divertido, seguro y accesible para todos — desde niños hasta abuelos.",
      features: [
        {
          title: "Entorno seguro para niños",
          description:
            "Sin anuncios, sin distracciones, sin enlaces externos. Un espacio de aprendizaje seguro para jóvenes atletas desde 5 años.",
        },
        {
          title: "Planes familiares",
          description:
            "Una suscripción cubre a todos. Padres e hijos aprenden juntos con perfiles y seguimiento de progreso separados.",
        },
        {
          title: "Panel para padres",
          description:
            "Ve lo que aprenden tus hijos, cómo progresan y qué habilidades han dominado — todo desde tu teléfono.",
        },
        {
          title: "Insignias y recompensas",
          description:
            "Los niños ganan insignias digitales al completar lecciones y alcanzar hitos. Motivación real en cada nivel.",
        },
      ],
    },
    aiCoach: {
      heading: "Tu",
      highlight: "Entrenador de nieve con IA",
      sub: "Imagina un entrenador que sabe exactamente en qué punto estás, se adapta a tu ritmo, responde tus preguntas y te mantiene motivado entre lecciones.",
      feature1Title: "Aprendizaje adaptativo",
      feature1Desc: "La IA ajusta tu plan de aprendizaje según tu progreso.",
      feature2Title: "Pregunta lo que sea",
      feature2Desc:
        "Obtén respuestas instantáneas sobre técnica, equipo y condiciones.",
      feature3Title: "Progreso inteligente",
      feature3Desc:
        "Insights generados por IA sobre tus fortalezas y áreas de mejora.",
    },
    instructors: {
      badge: "Nuestros instructores",
      heading: "Aprende de los mejores",
      sub: "Cada lección es impartida por profesionales certificados con experiencia real en competición o resorts.",
      locationTitle: "Grabado en locación",
      locations: "Vail, Aspen, Park City y más",
      credentials: [
        "Certificación PSIA / AASI Nivel III",
        "Atletas olímpicos y de Copa del Mundo",
        "Más de 20 años de experiencia promedio",
        "Expertos en Vail, Aspen, Park City",
      ],
    },
    cta: {
      title: "¿Listo para dominar la montaña?",
      subtitle: "Únete a miles de estudiantes preparados.",
      button: "Comienza tu prueba gratis",
    },
    ctaa: {
      title: "¿Listo para dominar la montaña?",
      subtitle: "Únete a miles de estudiantes preparados.",
      button: "Comienza tu prueba gratis",
      secondaryLink: "Ver precios →",
      finePrint: "7 días gratis · Desde $14.99/mes · Cancela cuando quieras",
    },

    // -------------------------
    // NAVBAR
    // -------------------------
    nav: {
      howItWorks: "Cómo funciona",
      curriculum: "Plan de estudios",
      pricing: "Precios",
      about: "Nosotros",
      dashboard: "Panel",
      signIn: "Iniciar sesión",
      startFreeTrial: "Prueba gratis",
    },

    // -------------------------
    // FOOTER
    // -------------------------
    footer: {
      tagline:
        "La plataforma líder en educación de esquí y snowboard. Aprende con instructores de clase mundial, sigue tu progreso y llega a la montaña con confianza.",
      newsletterHeading: "Mantente informado",
      newsletterSub: "Acceso anticipado, consejos y novedades de la montaña.",
      emailPlaceholder: "tú@email.com",
      companyHeading: "Empresa",
      curriculumHeading: "Plan de estudios",
      supportHeading: "Soporte",
      copyright: "© 2026 SkiLesson.ai — Una empresa de Dogwood Brands",
      links: {
        company: [
          { label: "Sobre nosotros", href: "/about" },
          { label: "Nuestros instructores", href: "/instructors" },
        ],
        curriculum: [
          { label: "Explorador", href: "/pricing" },
          { label: "Cima", href: "/pricing" },
          { label: "Ápice", href: "/pricing" },
        ],
        support: [
          { label: "Inicio", href: "/" },
          { label: "Contáctanos", href: "/contact" },
          { label: "Iniciar sesión", href: "/signin" },
          { label: "Precios", href: "/pricing" },
        ],
      },
    },

    // -------------------------
    // PRICING PAGE
    // -------------------------
    pricing: {
      badge: "Comienza con 7 días de prueba gratis",
      title1: "Invierte en tu",
      title2: "aventura en la montaña",
      subtitle:
        "Instrucción de esquí y snowboard de clase mundial, impulsada por IA, disponible a demanda. Elige el plan que se ajuste a tu ambición.",
      billingMonthly: "Mensual",
      billingAnnual: "Anual",
      savingsLabel: "Ahorra hasta ${{amount}}",
      trialButton: "Comienza 7 días gratis",
      billedAnnually: "facturado anualmente",
      savePerYear: "Ahorra ${{amount}}/año",
      mostPopular: "Más popular",
      perMonth: "/mes",
      guarantee: {
        title: "Garantía de devolución de 30 días",
        subtitle:
          "¿No es lo que esperabas? Reembolso completo en 30 días. Sin preguntas.",
      },
      plans: {
        explorer: {
          name: "Explorador",
          description:
            "Perfecto para principiantes que quieren ganar confianza antes de su primera lección.",
        },
        summit: {
          name: "Cima",
          description:
            "Para esquiadores intermedios listos para perfeccionar su técnica y abordar terrenos más difíciles.",
        },
        apex: {
          name: "Ápice",
          description:
            "El paquete completo para esquiadores serios y familias que lo quieren todo.",
        },
      },
      faq: {
        heading: "Preguntas frecuentes",
        subheading: "Todo lo que necesitas saber antes de llegar a las pistas.",
        items: [
          {
            question: "¿Puedo cambiar de plan en cualquier momento?",
            answer:
              "Claro que sí. Cambia tu plan cuando quieras desde la configuración de tu cuenta. Al mejorar el plan, tendrás acceso inmediato a las nuevas funciones y calcularemos la diferencia proporcional. Al reducirlo, el cambio se aplica al final del ciclo de facturación actual.",
          },
          {
            question: "¿Qué incluye la prueba gratuita?",
            answer:
              "Tu prueba gratuita de 7 días te da acceso completo y sin restricciones a todas las funciones del plan elegido. Explora lecciones, sigue tu progreso y chatea con el entrenador IA. Sin cargos hasta el día 8, y puedes cancelar en cualquier momento.",
          },
          {
            question: "¿Hay descuento para familias?",
            answer:
              "¡Sí! El plan Ápice incluye descuento familiar integrado: hasta 4 perfiles bajo una misma suscripción. Comparado con planes individuales, las familias ahorran más del 60%. Cada miembro tiene su propio panel, seguimiento de progreso y experiencia con el entrenador IA.",
          },
          {
            question: "¿Puedo cancelar en cualquier momento?",
            answer:
              "Sin contratos, sin comisiones de cancelación, sin preguntas. Cancela tu suscripción cuando quieras desde tu cuenta. Mantendrás el acceso hasta el final del período de facturación. Además, nuestra garantía de 30 días te permite probar sin riesgo.",
          },
          {
            question: "¿Necesito equipo para empezar?",
            answer:
              "Para nada. Muchas de nuestras lecciones iniciales se enfocan en postura, equilibrio y ejercicios que puedes practicar en casa. Cuando estés listo para la nieve, nuestras guías de equipo te ayudarán a elegir lo adecuado para tu nivel y presupuesto.",
          },
          {
            question: "¿Cómo se entregan las lecciones?",
            answer:
              "Las lecciones se entregan a través de nuestra plataforma de streaming premium, disponible en web, iOS y Android. Cada lección incluye video en HD, análisis en cámara lenta, anotaciones en pantalla y listas de práctica descargables. Aprende cuando y donde quieras, incluso sin conexión.",
          },
        ],
      },
      enterprise: {
        heading: "¿Entrenando a tu equipo?",
        sub: "Planes personalizados para escuelas de esquí, retiros corporativos y programas grupales. Precios por volumen, paneles de administración y onboarding dedicado para grupos de 10 o más.",
        cta: "Contáctanos",
      },
    },

    // -------------------------
    // ABOUT PAGE
    // -------------------------
    about: {
      badge: "Nuestra historia",
      title1: "Creado por amantes de la montaña,",
      title2: "para amantes de la montaña",
      subtitle:
        "Creemos que todos merecen vivir la magia de las montañas. SkiLesson.ai lleva instrucción de clase mundial a tu sala, para que cuando llegues a la cima, estés listo.",
      whereWeTeach: "Dónde enseñamos",
      whereWeTeachLocations: "Vail · Aspen · Park City · Breckenridge",
      team: {
        heading: "El equipo detrás de la cima",
        sub: "Décadas de experiencia en la montaña se unen a la tecnología moderna.",
        members: [
          {
            name: "Tyler Berglund",
            title: "Director de Instrucción y Operaciones",
            bio: "Más de 20 años en las pistas de Vail. Ex director de escuela de esquí. Certificado PSIA Nivel 3. Tyler ha enseñado a miles de estudiantes, desde principiantes hasta corredores expertos.",
          },
        ],
      },
      approach: {
        heading: "Nuestro enfoque",
        sub: "Cuatro pilares que definen cómo enseñamos y por qué funciona.",
        pillars: [
          {
            title: "Aprende en cualquier lugar",
            description:
              "¿Sin montaña? No hay problema. Construye tu base desde casa.",
          },
          {
            title: "Avanza a tu ritmo",
            description:
              "Cada estudiante es diferente. Nuestro plan adaptativo se ajusta a ti.",
          },
          {
            title: "Instrucción real",
            description:
              "Cada lección es diseñada por instructores certificados, no generada por IA.",
          },
          {
            title: "La familia primero",
            description:
              "Diseñado para familias. Los padres siguen el progreso. Los niños ganan confianza.",
          },
        ],
      },
      affiliations: {
        heading: "Afiliaciones de confianza",
        sub: "Nuestro plan de estudios se alinea con los más altos estándares de instrucción en deportes de nieve.",
        psia: {
          name: "PSIA-AASI",
          description: "Instructores Profesionales de Esquí de América",
        },
        nsp: {
          name: "Patrulla Nacional de Esquí",
          description: "Metodología de instrucción con seguridad primero",
        },
      },
      cta: {
        heading: "Únete a miles de estudiantes que dominan la montaña",
        sub: "Comienza hoy con 7 días gratis. Sin tarjeta de crédito.",
        button: "Comienza tu prueba gratis",
      },
    },
  },
};
