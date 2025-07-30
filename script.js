// Data constants are now imported from constants.js

// Authentication Manager
class AuthManager {
    constructor() {
        this.users = window.authSystem.users;
        this.sessionKey = window.authSystem.sessionKey;
        this.isLoggedIn = false;
        this.currentUser = null;
        this.init();
    }

    init() {
        this.checkExistingSession();
    }

    checkExistingSession() {
        const session = localStorage.getItem(this.sessionKey);
        if (session) {
            try {
                const userData = JSON.parse(session);
                if (userData && userData.username) {
                    this.currentUser = userData;
                    this.isLoggedIn = true;
                    return true;
                }
            } catch (e) {
                localStorage.removeItem(this.sessionKey);
            }
        }
        return false;
    }

    login(username, password) {
        const user = this.users.find(u => u.username === username && u.password === password);
        if (user) {
            this.currentUser = { username: user.username, role: user.role };
            this.isLoggedIn = true;
            localStorage.setItem(this.sessionKey, JSON.stringify(this.currentUser));
            return { success: true, user: this.currentUser };
        }
        return { success: false, error: "Nieprawidłowe dane logowania" };
    }

    logout() {
        this.currentUser = null;
        this.isLoggedIn = false;
        localStorage.removeItem(this.sessionKey);
    }

    getUserInfo() {
        return this.currentUser;
    }

    isAuthenticated() {
        return this.isLoggedIn;
    }
}

// Removed Login Modal Component - now using only console login

// DateTime component
class DateTime {
    constructor() {
        this.dateTimeElement = null;
        this.timeElement = null;
        this.dateElement = null;
        this.intervalId = null;
        this.themeToggle = null;
        this.authManager = null;
        this.init();
    }

    init() {
        this.themeToggle = new ThemeToggle();
        this.authManager = new AuthManager();
        this.render();
        this.startClock();
    }

    formatTime(date) {
        return date.toLocaleTimeString("pl-PL", {
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
            hour12: false,
        });
    }

    formatDate(date) {
        return date.toLocaleDateString("pl-PL", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
        });
    }

    updateDateTime() {
        if (!this.timeElement || !this.dateElement) return;

        const now = new Date();
        this.timeElement.textContent = this.formatTime(now);
        this.dateElement.textContent = this.formatDate(now);
    }

    startClock() {
        this.updateDateTime();
        this.intervalId = setInterval(() => this.updateDateTime(), 1000);
    }

    stopClock() {
        if (this.intervalId) {
            clearInterval(this.intervalId);
            this.intervalId = null;
        }
    }

    render() {
        const now = new Date();

        const container = document.createElement("div");
        container.className = "datetime-container";

        // Always show theme toggle and navigation - no authentication required
        const controlsInfo = `<div class="user-info">
            <button class="theme-toggle" onclick="toggleUserTheme()" id="userThemeToggle">
                <span class="theme-toggle-icon">
                    <i class="fas ${this.themeToggle.isDark ? 'fa-sun' : 'fa-moon'}"></i>
                </span>
            </button>
            <button class="datetime-nav-button" onclick="navigateToSubpage()">
                <i class="fas fa-bars"></i>
            </button>
            <button class="datetime-nav-button" onclick="showLoginConsole()" title="Open Login Console (Ctrl+L)">
                <i class="fas fa-terminal"></i>
            </button>
            <div class="vertical-separator orange"></div>
            <button class="datetime-nav-button" onclick="window.open('https://playliveos.carrd.co/', '_blank')" title="Visit PlayLiveOS">
                <i class="fas fa-play"></i>
            </button>
            <div class="vertical-separator orange"></div>
            <button class="datetime-nav-button" onclick="window.open('https://w5e.carrd.co/', '_blank')" title="Lista Driverów">
                <i class="fas fa-users"></i>
            </button>
        </div>
        `;

        container.innerHTML = `
           ${controlsInfo}
            <div class="datetime-content">
                <div class="datetime-icon">
                    <i class="fas fa-clock"></i>
                </div>
                <div class="datetime-info">
                    <div class="datetime-time">${this.formatTime(now)}</div>
                    <div class="datetime-date">${this.formatDate(now)}</div>
                </div>
            </div>
        `;

        this.dateTimeElement = container;
        this.timeElement = container.querySelector(".datetime-time");
        this.dateElement = container.querySelector(".datetime-date");

        return container;
    }

    destroy() {
        this.stopClock();
        if (this.dateTimeElement) {
            this.dateTimeElement.remove();
        }
    }
}

// Footer component
class Footer {
    constructor() {
        this.currentYear = new Date().getFullYear();
    }

    render() {
        const footer = document.createElement("footer");
        footer.className = "app-footer";

        footer.innerHTML = `
           
            
            <div class="footer-content">
                <div class="footer-section">
                    <span class="footer-title">DEV LABS R&S</span>
                    <span class="footer-version">v1.1.0 Dev</span>
                </div>
                <div class="footer-section">
                    <a href="#" class="footer-info" onclick="openPrivacyModal()">
                        PRIVACY POLICY
                        <i class="fas fa-info-circle ml-2"></i>
                    </a>
                </div>
                
                <div class="footer-section">
                    <span class=" footer-info-copyright">© ${this.currentYear} All rights reserved</span>
                </div>
                <div class="footer-section">
                    <span class="footer-status">
                        <i class="fas fa-circle status-indicator"></i>
                        SYSTEM ONLINE
                    </span>
                </div>
            </div>
        `;

        return footer;
    }
}

// Modal component
class Modal {
    constructor(title, content, isNavModal = false) {
        this.title = title;
        this.content = content;
        this.isNavModal = isNavModal;
        this.overlay = null;
        this.modalContent = null;
    }

    create() {
        // Create modal overlay
        this.overlay = document.createElement('div');
        this.overlay.className = 'modal-overlay';
        this.overlay.addEventListener('click', (e) => {
            if (e.target === this.overlay) {
                this.close();
            }
        });

        // Create modal content
        this.modalContent = document.createElement('div');
        this.modalContent.className = 'modal-content';

        // Create header
        const header = document.createElement('div');
        header.className = 'modal-header';

        const titleElement = document.createElement('h2');
        titleElement.className = 'modal-title';
        titleElement.textContent = this.title;

        const closeButton = document.createElement('button');
        closeButton.className = 'modal-close';
        closeButton.innerHTML = '<i class="fas fa-times"></i>';
        closeButton.addEventListener('click', () => this.close());

        header.appendChild(titleElement);
        header.appendChild(closeButton);

        // Create body
        const body = document.createElement('div');
        body.className = 'modal-body';

        if (this.isNavModal) {
            body.innerHTML = this.content;
        } else {
            body.innerHTML = this.content;
        }

        // Assemble modal
        this.modalContent.appendChild(header);
        this.modalContent.appendChild(body);
        this.overlay.appendChild(this.modalContent);

        return this.overlay;
    }

    open() {
        if (!this.overlay) {
            this.create();
        }

        document.body.appendChild(this.overlay);

        // Force reflow to ensure smooth transition
        this.overlay.offsetHeight;

        this.overlay.classList.add('active');

        // Add escape key listener
        document.addEventListener('keydown', this.handleEscKey.bind(this));
    }

    close() {
        if (this.overlay) {
            this.overlay.classList.remove('active');

            setTimeout(() => {
                if (this.overlay && this.overlay.parentNode) {
                    this.overlay.parentNode.removeChild(this.overlay);
                }
            }, 300);
        }

        // Remove escape key listener
        document.removeEventListener('keydown', this.handleEscKey.bind(this));
    }

    handleEscKey(event) {
        if (event.key === 'Escape') {
            this.close();
        }
    }
}

// Theme Toggle functionality
class ThemeToggle {
    constructor() {
        this.isDark = false;
        this.init();
    }

    init() {
        // Check localStorage first, then fallback to current attribute
        const savedTheme = localStorage.getItem("theme");
        let isDarkMode = false;

        if (savedTheme) {
            isDarkMode = savedTheme === "dark";
        } else {
            isDarkMode = document.documentElement.hasAttribute("dark-theme");
        }

        this.isDark = isDarkMode;

        // Apply the theme
        if (isDarkMode) {
            document.documentElement.setAttribute("dark-theme", "");
        } else {
            document.documentElement.removeAttribute("dark-theme");
        }
    }

    toggle() {
        this.isDark = !this.isDark;

        // Save to localStorage
        localStorage.setItem("theme", this.isDark ? "dark" : "light");

        // Apply the theme
        if (this.isDark) {
            document.documentElement.setAttribute("dark-theme", "");
        } else {
            document.documentElement.removeAttribute("dark-theme");
        }

        // Update button content
        this.updateButton();
    }

    updateButton() {
        const iconElement = document.querySelector(".theme-toggle-icon i");
        const textElement = document.querySelector(".theme-toggle-text");

        if (iconElement && textElement) {
            iconElement.className = `fas ${this.isDark ? "fa-sun" : "fa-moon"}`;
            textElement.textContent = this.isDark ? "Light" : "Dark";
        }
    }

    render() {
        const button = document.createElement("button");
        button.className = "theme-toggle";
        button.setAttribute(
            "aria-label",
            this.isDark ? "Switch to light theme" : "Switch to dark theme"
        );

        button.innerHTML = `
      
      <span class="theme-toggle-icon">
        <i class="fas ${this.isDark ? "fa-sun" : "fa-moon"}"></i>
      </span>
      <span class="theme-toggle-text">
        ${this.isDark ? "Light" : "Dark"}
      </span>
    `;

        button.addEventListener("click", () => this.toggle());

        return button;
    }
}

// LinkButton component
function createLinkButton(title, markerColor, icon, url) {
    const div = document.createElement("div");
    div.className = "link-button";

    const markerClasses = markerColor ? `marker marker-${markerColor}` : "";

    div.innerHTML = `
    <div class="corner top-left"></div>
    <div class="corner top-right"></div>
    <div class="corner bottom-left"></div>
    <div class="corner bottom-right"></div>
    <div class="link-button-left">
      ${markerColor ? `<div class="${markerClasses}"></div>` : ""}
      <span class="link-button-title">${title}</span>
    </div>
    ${icon
            ? `<span class="link-button-icon"><i class="fas ${icon}"></i></span>`
            : ""
        }
  `;

    // Add click handler if URL is provided
    if (url) {
        div.style.cursor = "pointer";
        div.addEventListener("click", () => {
            window.open(url, "_blank");
        });
    }

    return div;
}

// GroupCard component
function createGroupCard(data) {
    const { columns, markerColor } = data;

    const div = document.createElement("div");
    div.className = "group-card";

    const gridClasses = ["group-card-grid"];
    if (columns.length > 1) {
        gridClasses.push("two-columns");
    }

    div.innerHTML = `
    <div class="${gridClasses.join(" ")}">
      ${columns
            .map(
                (column) => `
        <div class="group-column">
        </div>
      `
            )
            .join("")}
    </div>
  `;

    // Add buttons with event listeners
    const columnElements = div.querySelectorAll('.group-column');
    columns.forEach((column, columnIndex) => {
        column.forEach((item) => {
            const button = createLinkButton(item.title, markerColor, item.icon, item.url);
            columnElements[columnIndex].appendChild(button);
        });
    });

    return div;
}

// Main App initialization
function initializeApp() {
    const root = document.getElementById("root");
    if (!root) return;

    // Initialize theme first (before anything else)
    initializeTheme();

    // Always create dashboard - authentication through console only
    createDashboard();
}

// Initialize theme system
function initializeTheme() {
    const savedTheme = localStorage.getItem("theme");
    let isDarkMode = false;

    if (savedTheme) {
        isDarkMode = savedTheme === "dark";
    } else {
        isDarkMode = document.documentElement.hasAttribute("dark-theme");
    }

    // Apply the theme
    if (isDarkMode) {
        document.documentElement.setAttribute("dark-theme", "");
    } else {
        document.documentElement.removeAttribute("dark-theme");
    }
}

// Removed showLoginModal function - now using only console login

function createDashboard() {
    const root = document.getElementById("root");
    if (!root) return;

    // Create datetime component (includes theme toggle)
    const dateTime = new DateTime();

    // Create footer component
    const footer = new Footer();

    // Create app container
    const appContainer = document.createElement("div");
    appContainer.className = "app-container";

    // Create content wrapper
    const contentWrapper = document.createElement("div");
    contentWrapper.className = "content-wrapper";

    // Add decorative corners
    contentWrapper.innerHTML = `
    <div class="decorative-corner decorative-corner-tl" aria-hidden="true"></div>
    <div class="decorative-corner decorative-corner-br" aria-hidden="true"></div>
  `;

    // Add datetime component to content wrapper
    contentWrapper.appendChild(dateTime.render());

    // Create main grid
    const mainGrid = document.createElement("main");
    mainGrid.className = "main-grid";

    // Create left section
    const leftSection = document.createElement("div");
    leftSection.className = "left-section";

    leftGroups.forEach((group, index) => {
        leftSection.appendChild(createGroupCard(group));
    });

    // Create right section
    const rightSection = document.createElement("div");
    rightSection.className = "right-section";

    rightGroups.forEach((group, index) => {
        rightSection.appendChild(createGroupCard(group));
    });

    // Assemble the app
    mainGrid.appendChild(leftSection);
    mainGrid.appendChild(rightSection);
    contentWrapper.appendChild(mainGrid);

    // Add footer to content wrapper
    contentWrapper.appendChild(footer.render());

    appContainer.appendChild(contentWrapper);

    // Add to root
    root.appendChild(appContainer);
}

// Global logout function
function handleLogout() {
    const authManager = new AuthManager();
    authManager.logout();
    location.reload();
}

// Removed toggleLoginTheme function - no longer needed

// Global theme toggle function for user info
function toggleUserTheme() {
    const currentTheme = localStorage.getItem("theme") || "light";
    const newTheme = currentTheme === "dark" ? "light" : "dark";

    // Save to localStorage
    localStorage.setItem("theme", newTheme);

    // Apply the theme
    if (newTheme === "dark") {
        document.documentElement.setAttribute("dark-theme", "");
    } else {
        document.documentElement.removeAttribute("dark-theme");
    }

    // Update all theme toggle buttons
    updateAllThemeButtons(newTheme);
}

// Update all theme toggle buttons
function updateAllThemeButtons(theme) {
    const isDark = theme === "dark";

    // Update login theme button
    const loginButton = document.getElementById("loginThemeToggle");
    if (loginButton) {
        const icon = loginButton.querySelector("i");
        if (icon) {
            icon.className = `fas ${isDark ? 'fa-sun' : 'fa-moon'}`;
        }
    }

    // Update user theme button
    const userButton = document.getElementById("userThemeToggle");
    if (userButton) {
        const icon = userButton.querySelector("i");
        if (icon) {
            icon.className = `fas ${isDark ? 'fa-sun' : 'fa-moon'}`;
        }
    }
}

// Function to navigate to subpage
function navigateToSubpage() {
    const modalContent = `
        <h3>Polecane Dodatki</h3>
        <p>Przydatne rozszerzenia do przeglądarek:</p>
        
        <div class="info-section">
            <h3>Jak zainstalować dodatek:</h3>
            <ul>
                <li>Kliknij na ikonę przeglądarki przy wybranym dodatku</li>
                <li>Zostaniesz przekierowany do sklepu z rozszerzeniami</li>
                <li>Kliknij przycisk <span class="highlight">"Dodaj do przeglądarki"</span></li>
                <li>Potwierdź instalację w oknie dialogowym</li>
            </ul>
        </div>

        <div class="warning-section">
            <p>Instaluj tylko dodatki z oficjalnych sklepów przeglądarek dla swojego bezpieczeństwa.</p>
        </div>
        
        <div class="modal-nav-grid">
            <div class="modal-nav-item addon-item">
                <div class="corner top-left"></div>
                <div class="corner top-right"></div>
                <div class="corner bottom-left"></div>
                <div class="corner bottom-right"></div>
                <div class="modal-nav-item-title">
                    <i class="fas fa-shield-alt"></i>
                    uBlock Origin
                </div>
                <div class="modal-nav-item-description">
                    Wydajny bloker reklam i elementów śledzących
                </div>
                <div class="browser-selection">
                    <a href="https://addons.mozilla.org/pl/firefox/addon/ublock-origin/" class="browser-badge firefox" target="_blank" title="Firefox">
                        <i class="fab fa-firefox"></i>
                    </a>
                    <a href="https://microsoftedge.microsoft.com/addons/detail/ublock-origin/odfafepnkmbhccpbejgmiehpchacaeak" class="browser-badge edge" target="_blank" title="Edge">
                        <i class="fab fa-edge"></i>
                    </a>
                    <a href="https://chromewebstore.google.com/detail/ublock-origin/cjpalhdlnbpafiamejdnhcphjbkeiagm" class="browser-badge chrome" target="_blank" title="Chrome">
                        <i class="fab fa-chrome"></i>
                    </a>
                </div>
            </div>
            <div class="modal-nav-item addon-item">
                <div class="corner top-left"></div>
                <div class="corner top-right"></div>
                <div class="corner bottom-left"></div>
                <div class="corner bottom-right"></div>
                <div class="modal-nav-item-title">
                    <i class="fas fa-moon"></i>
                    Dark Reader
                </div>
                <div class="modal-nav-item-description">
                    Ciemny motyw dla każdej strony internetowej
                </div>
                <div class="browser-selection">
                    <a href="https://addons.mozilla.org/pl/firefox/addon/darkreader/" class="browser-badge firefox" target="_blank" title="Firefox">
                        <i class="fab fa-firefox"></i>
                    </a>
                    <a href="https://microsoftedge.microsoft.com/addons/detail/dark-reader/ifoakfbpdcdoeenechcleahebpibofpc" class="browser-badge edge" target="_blank" title="Edge">
                        <i class="fab fa-edge"></i>
                    </a>
                    <a href="https://chromewebstore.google.com/detail/dark-reader/eimadpbcbfnmbkopoojfekhnkhdbieeh" class="browser-badge chrome" target="_blank" title="Chrome">
                        <i class="fab fa-chrome"></i>
                    </a>
                </div>
            </div>
            <div class="modal-nav-item addon-item">
                <div class="corner top-left"></div>
                <div class="corner top-right"></div>
                <div class="corner bottom-left"></div>
                <div class="corner bottom-right"></div>
                <div class="modal-nav-item-title">
                    <i class="fas fa-palette"></i>
                    Stylus
                </div>
                <div class="modal-nav-item-description">
                    Menedżer stylów do modyfikacji wyglądu stron
                </div>
                <div class="browser-selection">
                    <a href="https://addons.mozilla.org/pl/firefox/addon/styl-us/" class="browser-badge firefox" target="_blank" title="Firefox">
                        <i class="fab fa-firefox"></i>
                    </a>
                    <a href="https://chromewebstore.google.com/detail/stylus/clngdbkpkpeebahjckkjfobafhncgmne" class="browser-badge chrome" target="_blank" title="Chrome">
                        <i class="fab fa-chrome"></i>
                    </a>
                </div>
            </div>
            <div class="modal-nav-item addon-item">
                <div class="corner top-left"></div>
                <div class="corner top-right"></div>
                <div class="corner bottom-left"></div>
                <div class="corner bottom-right"></div>
                <div class="modal-nav-item-title">
                    <i class="fas fa-code"></i>
                    Tampermonkey
                </div>
                <div class="modal-nav-item-description">
                    Menedżer skryptów użytkownika
                </div>
                <div class="browser-selection">
                    <a href="https://addons.mozilla.org/pl/firefox/addon/tampermonkey/" class="browser-badge firefox" target="_blank" title="Firefox">
                        <i class="fab fa-firefox"></i>
                    </a>
                    <a href="https://microsoftedge.microsoft.com/addons/detail/tampermonkey/iikmkjmpaadaobahmlepeloendndfphd" class="browser-badge edge" target="_blank" title="Edge">
                        <i class="fab fa-edge"></i>
                    </a>
                    <a href="https://chromewebstore.google.com/detail/tampermonkey/dhdgffkkebhmkfjojejmpbldmpobfkfo" class="browser-badge chrome" target="_blank" title="Chrome">
                        <i class="fab fa-chrome"></i>
                    </a>
                </div>
            </div>
            <div class="modal-nav-item addon-item">
                <div class="corner top-left"></div>
                <div class="corner top-right"></div>
                <div class="corner bottom-left"></div>
                <div class="corner bottom-right"></div>
                <div class="modal-nav-item-title">
                    <i class="fas fa-search"></i>
                    Inspecta
                </div>
                <div class="modal-nav-item-description">
                    Narzędzie do inspekcji wizualnej i CSS
                </div>
                <div class="browser-selection">
                    <a href="https://chromewebstore.google.com/detail/inspecta-visual-qa-and-cs/pjcfmgokdbdffkcldahbehpemeejglhh" class="browser-badge chrome" target="_blank" title="Chrome">
                        <i class="fab fa-chrome"></i>
                    </a>
                </div>
            </div>
            <div class="modal-nav-item addon-item">
                <div class="corner top-left"></div>
                <div class="corner top-right"></div>
                <div class="corner bottom-left"></div>
                <div class="corner bottom-right"></div>
                <div class="modal-nav-item-title">
                    <i class="fas fa-eye"></i>
                    Inspect CSS
                </div>
                <div class="modal-nav-item-description">
                    Zaawansowane narzędzie do inspekcji i analizy CSS
                </div>
                <div class="browser-selection">
                    <a href="https://chromewebstore.google.com/detail/inspect-css/fbopfffegfehobgoommphghohinpkego" class="browser-badge chrome" target="_blank" title="Chrome">
                        <i class="fab fa-chrome"></i>
                    </a>
                </div>
            </div>
            <div class="modal-nav-item addon-item">
                <div class="corner top-left"></div>
                <div class="corner top-right"></div>
                <div class="corner bottom-left"></div>
                <div class="corner bottom-right"></div>
                <div class="modal-nav-item-title">
                    <i class="fab fa-youtube"></i>
                    BezPrzerwy YouTube™
                </div>
                <div class="modal-nav-item-description">
                    Automatyczne odtwarzanie YouTube bez przerw
                </div>
                <div class="browser-selection">
                    <a href="https://microsoftedge.microsoft.com/addons/detail/bezprzerwy-youtube%E2%84%A2/klfgmbgpidpnfkpjmpdlegfcjilgkcec" class="browser-badge edge" target="_blank" title="Edge">
                        <i class="fab fa-edge"></i>
                    </a>
                </div>
            </div>
        </div>

        <div class="info-section">
            <h3>Przydatne informacje:</h3>
            <ul>
                <li><span class="highlight">uBlock Origin</span> - Najlepszy bloker reklam, redukuje zużycie danych i przyspiesza przeglądanie</li>
                <li><span class="highlight">Dark Reader</span> - Automatycznie zmienia jasne strony na ciemne, oszczędza baterie</li>
                <li><span class="highlight">Stylus</span> - Pozwala na personalizację wyglądu stron internetowych</li>
                <li><span class="highlight">Tampermonkey</span> - Umożliwia uruchamianie skryptów modyfikujących strony</li>
            </ul>
        </div>
    `;

    const modal = new Modal("Navigation Options", modalContent, true);
    modal.open();

    // Add click handlers for addon items after modal opens
    setTimeout(() => {
        const addonItems = document.querySelectorAll('.addon-item');
        const modalBody = document.querySelector('.modal-body');

        addonItems.forEach(item => {
            item.addEventListener('click', function (e) {
                // Don't trigger if clicking on browser badge
                if (e.target.closest('.browser-badge')) {
                    return;
                }

                // Prevent event from bubbling to modal body
                e.stopPropagation();

                // Toggle active class
                const isActive = this.classList.contains('active');

                // Close all other addon items
                addonItems.forEach(otherItem => {
                    otherItem.classList.remove('active');
                });

                // Toggle current item
                if (!isActive) {
                    this.classList.add('active');
                }
            });
        });

        // Close all browser selections when clicking outside
        if (modalBody) {
            modalBody.addEventListener('click', function (e) {
                if (!e.target.closest('.addon-item')) {
                    addonItems.forEach(item => {
                        item.classList.remove('active');
                    });
                }
            });
        }
    }, 100);
}

// Function to open service in new tab
function openService(url, serviceName) {
    console.log(`Opening ${serviceName} at ${url}`);
    window.open(url, "_blank");
}

// Function to open privacy modal
function openPrivacyModal() {
    const modalContent = `
        <h3>Polityka Prywatności</h3>
        <p>Niniejsza polityka prywatności określa zasady funkcjonowania korporacyjnej aplikacji pulpitu nawigacyjnego.</p>
        
        <div class="info-section">
            <h3>Informacje ogólne:</h3>
            <p>Serwis nie zbiera ani nie przetwarza żadnych danych osobowych użytkowników, co zapewnia pełną ochronę prywatności.</p>
        </div>
        
        <div class="info-section">
            <h3>Pliki cookies:</h3>
            <p>Serwis wykorzystuje wyłącznie niezbędne pliki cookies techniczne, które są wymagane do prawidłowego działania strony. Te pliki cookies nie służą do zbierania żadnych danych osobowych ani do śledzenia użytkowników.</p>
        </div>
        
        <div class="info-section">
            <h3>Brak zbierania danych:</h3>
            <p>Serwis:</p>
            <ul>
                <li><span class="highlight">Nie zbiera</span> danych osobowych</li>
                <li><span class="highlight">Nie wymaga</span> rejestracji</li>
                <li><span class="highlight">Nie prowadzi</span> newslettera</li>
                <li><span class="highlight">Nie śledzi</span> zachowań użytkowników</li>
                <li><span class="highlight">Nie wykorzystuje</span> narzędzi analitycznych</li>
            </ul>
        </div>

        <div class="warning-section">
            <p>Wszystkie dane są przechowywane lokalnie w przeglądarce i nie są przekazywane do żadnych zewnętrznych serwisów.</p>
        </div>
        
        <div class="info-section">
            <h3>Zmiany w polityce prywatności:</h3>
            <p>Administrator zastrzega sobie prawo do zmiany niniejszej polityki prywatności w dowolnym czasie. O wszelkich zmianach użytkownicy będą informowani z odpowiednim wyprzedzeniem.</p>
        </div>
        
        <p><strong>Data:</strong> ${new Date().toLocaleDateString('pl-PL')}</p>
    `;
    const modal = new Modal("Privacy Policy", modalContent, true);
    modal.open();
}

// Function to open help modal
function openHelpModal() {
    const modalContent = `
        <h3>Pomoc - Logowanie</h3>
        <p>Witamy w sekcji pomocy Corporate App Dashboard. Znajdziesz tutaj informacje dotyczące logowania do systemu.</p>
        
        <div class="info-section">
            <h3>Jak się zalogować:</h3>
            <ul>
                <li><strong>Nazwa użytkownika:</strong> Wprowadź swoją nazwę użytkownika w pierwszym polu</li>
                <li><strong>Hasło:</strong> Wprowadź hasło w drugim polu</li>
                <li><strong>Logowanie:</strong> Kliknij przycisk <span class="highlight">"Zaloguj się"</span> lub naciśnij Enter</li>
                <li><strong>Motyw:</strong> Użyj przycisku <i class="fas fa-moon"></i>/<i class="fas fa-sun"></i> aby zmienić motyw</li>
            </ul>
        </div>

        <div class="info-section">
            <h3>Problemy z logowaniem:</h3>
            <ul>
                <li>Sprawdź czy <span class="highlight">caps lock</span> nie jest włączony</li>
                <li>Upewnij się, że używasz prawidłowych danych logowania</li>
                <li>Odśwież stronę (F5 lub Ctrl+R) i spróbuj ponownie</li>
                <li>Wyczyść pamięć podręczną przeglądarki</li>
                <li>Skontaktuj się z administratorem systemu</li>
            </ul>
        </div>

        <div class="warning-section">
            <p>Dane logowania są przechowywane lokalnie w przeglądarce i nie są wysyłane do żadnych stron trzecich.</p>
        </div>
        
        <div class="info-section">
            <h3>Bezpieczeństwo:</h3>
            <ul>
                <li>Nie udostępniaj swoich danych logowania innym osobom</li>
                <li>Wyloguj się po zakończeniu pracy</li>
                <li>Zgłoś podejrzane aktywności administratorowi</li>
            </ul>
        </div>
        
        <p><strong>Wersja systemu:</strong> 1.0.0</p>
        <p><strong>Data:</strong> ${new Date().toLocaleDateString('pl-PL')}</p>
    `;
    const modal = new Modal("Pomoc - Logowanie", modalContent, true);
    modal.open();
}

// Console Login System
let loginConsole = null;

function createLoginConsole() {
    if (loginConsole) return;

    loginConsole = document.createElement('div');
    loginConsole.className = 'login-console hidden';
    loginConsole.innerHTML = `
        <div class="console-header">
            <span class="console-title">
                <i class="fas fa-terminal"></i>
                Login Console - Corporate Dashboard
            </span>
            <button class="console-close" onclick="hideLoginConsole()">
                <i class="fas fa-times"></i>
            </button>
        </div>
        <div class="console-body">
            <div class="console-prompt">
                <span class="prompt-symbol">$</span>
                <span class="prompt-text">Please enter your credentials to access AI Link Hub</span>
            </div>
            <form class="console-form" id="consoleLoginForm">
                <div class="console-input-group">
                    <span class="input-label">username:</span>
                    <input type="text" id="consoleUsername" name="username" required autocomplete="username" spellcheck="false">
                </div>
                <div class="console-input-group">
                    <span class="input-label">password:</span>
                    <input type="password" id="consolePassword" name="password" required autocomplete="current-password">
                </div>
                <div class="console-actions">
                    <button type="submit" class="console-btn">
                        <i class="fas fa-arrow-right"></i>
                        Execute Login
                    </button>
                </div>
            </form>
            <div class="console-output" id="consoleOutput"></div>
            <div class="console-help">
                <div class="help-line">Available commands:</div>
                <div class="help-line">• login - authenticate user</div>
                <div class="help-line">• clear - clear console output</div>
                <div class="help-line">• exit - close console (Esc)</div>
            </div>
        </div>
    `;

    document.body.appendChild(loginConsole);

    // Setup form handler
    const form = loginConsole.querySelector('#consoleLoginForm');
    form.addEventListener('submit', handleConsoleLogin);

    // Setup keyboard shortcuts
    setupConsoleKeyboardShortcuts();
}

function showLoginConsole() {
    if (!loginConsole) createLoginConsole();

    loginConsole.classList.remove('hidden');
    loginConsole.classList.add('active');

    // Focus on username input
    const usernameInput = loginConsole.querySelector('#consoleUsername');
    setTimeout(() => usernameInput.focus(), 100);

    // Clear previous output
    const output = loginConsole.querySelector('#consoleOutput');
    output.innerHTML = '';
}

function hideLoginConsole() {
    if (loginConsole) {
        loginConsole.classList.remove('active');
        loginConsole.classList.add('hidden');
    }
}

function handleConsoleLogin(e) {
    e.preventDefault();

    const formData = new FormData(e.target);
    const username = formData.get('username');
    const password = formData.get('password');
    const output = document.getElementById('consoleOutput');

    // Simulate authentication
    const authManager = new AuthManager();
    const result = authManager.login(username, password);

    if (result.success) {
        // Show success in console
        output.innerHTML = `
            <div class="output-line success">✓ Authentication successful</div>
            <div class="output-line">User: ${result.user.username}</div>
            <div class="output-line">Role: ${result.user.role}</div>
            <div class="output-line">Redirecting to AI Link Hub...</div>
            <div class="output-line loading">Opening new tab in 3 seconds...</div>
        `;

        // Open AI Link Hub in new tab after delay
        setTimeout(() => {
            window.open('https://devospanel.carrd.co/', '_blank');
            hideLoginConsole();
        }, 3000);

    } else {
        // Show error in console
        output.innerHTML = `
            <div class="output-line error">✗ Authentication failed</div>
            <div class="output-line error">${result.error}</div>
            <div class="output-line">Please try again...</div>
        `;
    }
}

function setupConsoleKeyboardShortcuts() {
    document.addEventListener('keydown', (e) => {
        // Ctrl+L to open login console
        if (e.ctrlKey && e.key === 'l') {
            e.preventDefault();
            showLoginConsole();
        }

        // Escape to close console
        if (e.key === 'Escape' && loginConsole && loginConsole.classList.contains('active')) {
            hideLoginConsole();
        }
    });
}

// Initialize the app when DOM is loaded
document.addEventListener("DOMContentLoaded", initializeApp);
