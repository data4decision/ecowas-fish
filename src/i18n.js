import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

i18n.use(initReactI18next).init({
  resources: {
    en: {
      translation: {
        // Global UI Texts
        welcome: "Welcome to my website",
        description: "This is a description",
        button_english: "English",
        button_portuguese: "Português",
        button_french: "Français",
        hero_heading: "Empowering Fisheries Data for Sustainable Development in ECOWAS.",
        hero_description: "Track, analyze, and manage country-level fisheries data in one unified platform.",
        get_started: "Get Started",
        explore_countries: "Explore Countries",

        // Features Section
        features: {
          platform_features: "Platform Features",
          description: "Designed to make data-driven fisheries governance simple, secure, and scalable.",
          country_specific_dashboards: "Country-specific Dashboards",
          country_specific_dashboards_desc: "Each ECOWAS nation gets a dedicated dashboard to manage and review fisheries data effectively.",
          secure_data_uploads: "Secure Data Uploads",
          secure_data_uploads_desc: "Robust authentication and secure cloud storage to ensure data integrity and privacy.",
          real_time_analytics: "Real-time Analytics",
          real_time_analytics_desc: "Instant insights to track patterns, trends, and performance metrics across the region.",
          centralized_oversight: "Centralized Oversight",
          centralized_oversight_desc: "Admin panel for monitoring, managing permissions, and regional coordination.",
        },

        // Flag Grid Section
        flag_grid: {
          explore_ecowas_countries: "Explore ECOWAS Countries",
          select_country: "Select a country below to access its fisheries dashboard",
        },

        // Stories Section
        stories: {
          title: "Success Stories",
          description: "Real impact across ECOWAS nations",
          ghana_feedback: "Ghana improved monthly fisheries reporting accuracy by 40% within six months using the platform.",
          nigeria_feedback: "The dashboard enabled real-time oversight and eliminated reporting delays across multiple states.",
          senegal_feedback: "Our local teams now submit verified catch data weekly, improving compliance and insights.",
        },

        // Footer
        footer: {
          company_name: "Data4Decision International",
          company_description: "Advancing sustainable fisheries management through data-driven solutions across West Africa.",
          quick_links: "Quick Links",
          contact: "Contact",
          privacy_policy: "Privacy Policy",
          terms_of_use: "Terms of Use",
          follow_us: "Follow Us",
          all_rights_reserved: "All rights reserved",
        },

        // Navbar
        navbar: {
          company_name: "Data4Decision International",
          about: "About",
          countries: "Countries",
          admin_login: "Admin Login",
          get_started: "Get Started",
        },

        // Admin KPI
        admin_kpi: {
          dashboard_overview: "Admin Dashboard Overview",
          year: "Year",
          total_ecowas_countries: "Total ECOWAS Countries",
          years_covered: "Years of Data Covered",
          selected_year: "Selected Year",
          avg_total_fish_catch: "Avg Total Fish Catch (MT/year)",
          avg_post_harvest_loss: "Avg Post-Harvest Loss Rate (%)",
          total_registered_fishers: "Total Registered Fishers",
          digital_reporting: "Countries with Digital Reporting (%)",
          avg_enforcement_capacity: "Avg Enforcement Capacity Score",
          avg_budget_execution: "Avg Budget Execution Rate (%)",
          avg_indicator: "Avg {{indicator}}"
        },

        // Admin Login Page
        admin_login_page: {
          title: "Admin Login",
          email_placeholder: "Enter admin email",
          password_placeholder: "Enter password",
          login_button: "Login",
          logging_in: "Logging In...",
          forgot_password: "Forgot password?",
          no_account: "Don’t have an account?",
          signup: "Sign up",
          errors: {
            empty_fields: "Please fill in all fields.",
            invalid_email: "Invalid email format.",
            incorrect: "Incorrect email or password.",
            access_denied: "Access denied. Unauthorized role.",
            not_found: "User not found.",
          }
        }
      }
    },

    // Portuguese
    pt: {
      translation: {
        welcome: "Bem-vindo ao meu site",
        description: "Esta é uma descrição",
        button_english: "Inglês",
        button_portuguese: "Português",
        button_french: "Francês",
        hero_heading: "Empoderando os Dados de Pesca para o Desenvolvimento Sustentável na CEDEAO.",
        hero_description: "Rastreie, analise e gerencie dados pesqueiros em nível de país em uma plataforma unificada.",
        get_started: "Começar",
        explore_countries: "Explorar Países",

        features: {
          platform_features: "Recursos da Plataforma",
          description: "Projetado para tornar a governança de pesca baseada em dados simples, segura e escalável.",
          country_specific_dashboards: "Painéis Específicos por País",
          country_specific_dashboards_desc: "Cada nação da CEDEAO recebe um painel dedicado para gerenciar e revisar os dados de pesca de forma eficaz.",
          secure_data_uploads: "Envios de Dados Seguros",
          secure_data_uploads_desc: "Autenticação robusta e armazenamento seguro em nuvem para garantir a integridade e a privacidade dos dados.",
          real_time_analytics: "Análises em Tempo Real",
          real_time_analytics_desc: "Insights instantâneos para acompanhar padrões, tendências e métricas de desempenho em toda a região.",
          centralized_oversight: "Supervisão Centralizada",
          centralized_oversight_desc: "Painel de administração para monitorar, gerenciar permissões e coordenar a região.",
        },

        flag_grid: {
          explore_ecowas_countries: "Explorar Países da CEDEAO",
          select_country: "Selecione um país abaixo para acessar o painel de pesca",
        },

        stories: {
          title: "Histórias de Sucesso",
          description: "Impacto real em nações da CEDEAO",
          ghana_feedback: "Gana melhorou a precisão dos relatórios mensais de pesca em 40% em seis meses usando a plataforma.",
          nigeria_feedback: "O painel permitiu supervisão em tempo real e eliminou atrasos nos relatórios em vários estados.",
          senegal_feedback: "Nossas equipes locais agora enviam dados verificados de captura semanalmente, melhorando a conformidade e os insights.",
        },

        footer: {
          company_name: "Data4Decision Internacional",
          company_description: "Avançando na gestão sustentável da pesca por meio de soluções baseadas em dados em toda a África Ocidental.",
          quick_links: "Links Rápidos",
          contact: "Contato",
          privacy_policy: "Política de Privacidade",
          terms_of_use: "Termos de Uso",
          follow_us: "Siga-nos",
          all_rights_reserved: "Todos os direitos reservados",
        },

        navbar: {
          company_name: "Data4Decision Internacional",
          about: "Sobre",
          countries: "Países",
          admin_login: "Login do Administrador",
          get_started: "Começar",
        },

        admin_kpi: {
          dashboard_overview: "Visão Geral do Painel de Administração",
          year: "Ano",
          total_ecowas_countries: "Total de Países da CEDEAO",
          years_covered: "Anos de Dados Cobertos",
          selected_year: "Ano Selecionado",
          avg_total_fish_catch: "Média de Captura Total de Peixes (MT/ano)",
          avg_post_harvest_loss: "Média da Taxa de Perda Pós-Colheita (%)",
          total_registered_fishers: "Total de Pescadores Registrados",
          digital_reporting: "Países com Relatórios Digitais (%)",
          avg_enforcement_capacity: "Média da Capacidade de Fiscalização",
          avg_budget_execution: "Média da Taxa de Execução Orçamentária (%)",
          avg_indicator: "Média de {{indicator}}",
        },

        admin_login_page: {
          title: "Login do Administrador",
          email_placeholder: "Digite o e-mail do administrador",
          password_placeholder: "Digite a senha",
          login_button: "Entrar",
          logging_in: "Entrando...",
          forgot_password: "Esqueceu a senha?",
          no_account: "Não tem uma conta?",
          signup: "Cadastre-se",
          errors: {
            empty_fields: "Por favor, preencha todos os campos.",
            invalid_email: "Formato de e-mail inválido.",
            incorrect: "E-mail ou senha incorretos.",
            access_denied: "Acesso negado. Papel não autorizado.",
            not_found: "Usuário não encontrado.",
          }
        }
      }
    },

    // French
    fr: {
  translation: {
    welcome: "Bienvenue sur mon site web",
    description: "Ceci est une description",
    button_english: "Anglais",
    button_portuguese: "Portugais",
    button_french: "Français",
    hero_heading: "Favoriser les Données de Pêche pour le Développement Durable en CEDEAO.",
    hero_description: "Suivez, analysez et gérez les données sur la pêche au niveau des pays dans une plateforme unifiée.",
    get_started: "Commencer",
    explore_countries: "Explorer les Pays",

    features: {
      platform_features: "Caractéristiques de la Plateforme",
      description: "Conçu pour rendre la gouvernance des pêches basée sur les données simple, sécurisée et évolutive.",
      country_specific_dashboards: "Tableaux de bord spécifiques aux pays",
      country_specific_dashboards_desc: "Chaque nation de la CEDEAO dispose d'un tableau de bord dédié pour gérer et examiner efficacement les données de pêche.",
      secure_data_uploads: "Téléchargements de données sécurisés",
      secure_data_uploads_desc: "Authentification robuste et stockage sécurisé dans le cloud pour garantir l'intégrité et la confidentialité des données.",
      real_time_analytics: "Analytique en temps réel",
      real_time_analytics_desc: "Aperçus instantanés pour suivre les modèles, les tendances et les indicateurs de performance dans toute la région.",
      centralized_oversight: "Supervision centralisée",
      centralized_oversight_desc: "Panneau d'administration pour surveiller, gérer les autorisations et la coordination régionale.",
    },

    flag_grid: {
      explore_ecowas_countries: "Explorer les Pays de la CEDEAO",
      select_country: "Sélectionnez un pays ci-dessous pour accéder à son tableau de bord de pêche",
    },

    stories: {
      title: "Histoires de Succès",
      description: "Impact réel dans les pays de la CEDEAO",
      ghana_feedback: "Le Ghana a amélioré la précision des rapports mensuels sur la pêche de 40% en six mois en utilisant la plateforme.",
      nigeria_feedback: "Le tableau de bord a permis une supervision en temps réel et a éliminé les retards de rapport dans plusieurs états.",
      senegal_feedback: "Nos équipes locales soumettent désormais des données de capture vérifiées chaque semaine, améliorant la conformité et les perspectives.",
    },

    footer: {
      company_name: "Data4Decision International",
      company_description: "Faire progresser la gestion durable de la pêche grâce à des solutions basées sur les données à travers l'Afrique de l'Ouest.",
      quick_links: "Liens rapides",
      contact: "Contact",
      privacy_policy: "Politique de confidentialité",
      terms_of_use: "Conditions d'utilisation",
      follow_us: "Suivez-nous",
      all_rights_reserved: "Tous droits réservés",
    },

    navbar: {
      company_name: "Data4Decision International",
      about: "À propos",
      countries: "Pays",
      admin_login: "Connexion Admin",
      get_started: "Commencer",
    },

    admin_kpi: {
      dashboard_overview: "Aperçu du Tableau de Bord Admin",
      year: "Année",
      total_ecowas_countries: "Total des Pays de la CEDEAO",
      years_covered: "Années de Données Couverte",
      selected_year: "Année Sélectionnée",
      avg_total_fish_catch: "Moyenne de la Capture Totale de Poissons (MT/an)",
      avg_post_harvest_loss: "Moyenne du Taux de Perte Après Récolte (%)",
      total_registered_fishers: "Total des Pêcheurs Inscrits",
      digital_reporting: "Pays avec Rapports Numériques (%)",
      avg_enforcement_capacity: "Moyenne de la Capacité d'Application",
      avg_budget_execution: "Moyenne du Taux d'Exécution du Budget (%)",
      avg_indicator: "Moyenne de {{indicator}}",
    },

    admin_login_page: {
      title: "Connexion Admin",
      email_placeholder: "Entrez l'e-mail administrateur",
      password_placeholder: "Entrez le mot de passe",
      login_button: "Connexion",
      logging_in: "Connexion en cours...",
      forgot_password: "Mot de passe oublié?",
      no_account: "Vous n'avez pas de compte?",
      signup: "S'inscrire",
      errors: {
        empty_fields: "Veuillez remplir tous les champs.",
        invalid_email: "Format d'e-mail invalide.",
        incorrect: "Email ou mot de passe incorrect.",
        access_denied: "Accès refusé. Rôle non autorisé.",
        not_found: "Utilisateur non trouvé.",
      }
    }
  }
}

  },
  lng: 'en',
  fallbackLng: 'en',
  interpolation: {
    escapeValue: false,
  }
});

export default i18n;
