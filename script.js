// Data constants are now imported from constants.js

// DateTime component
class DateTime {
    constructor() {
        this.dateTimeElement = null;
        this.timeElement = null;
        this.dateElement = null;
        this.intervalId = null;
        this.themeToggle = null;
        this.init();
    }

    init() {
        this.themeToggle = new ThemeToggle();
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

        container.innerHTML = `
           
            <div class="datetime-content">
                <div class="datetime-icon">
                    <i class="fas fa-clock"></i>
                </div>
                <div class="datetime-info">
                    <div class="datetime-time">${this.formatTime(now)}</div>
                    <div class="datetime-date">${this.formatDate(now)}</div>
                </div>
                <button class="datetime-nav-button" onclick="navigateToSubpage()">
                    <i class="fas fa-bars"></i>
                </button>
            </div>
        `;

        // Add theme toggle button to the datetime container
        const themeButton = this.themeToggle.render();
        container.appendChild(themeButton);

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

// Function to navigate to subpage
function navigateToSubpage() {
    const modalContent = `
        <h3>Polecane Dodatki</h3>
        <p>Przydatne rozszerzenia do przeglądarek:</p>
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
    `;

    const modal = new Modal("Navigation Options", modalContent, true);
    modal.open();
}

// Function to open service in new tab
function openService(url, serviceName) {
    console.log(`Opening ${serviceName} at ${url}`);
    window.open(url, "_blank");
}

// Function to open privacy modal
function openPrivacyModal() {
    const modalContent = `
        <h3>Informacje ogólne</h3>
        <p>Niniejsza polityka prywatności określa zasady funkcjonowania korporacyjnej aplikacji pulpitu nawigacyjnego. Serwis nie zbiera ani nie przetwarza żadnych danych osobowych użytkowników, co zapewnia pełną ochronę prywatności.</p>
        
        <h3>Pliki cookies</h3>
        <p>Serwis wykorzystuje wyłącznie niezbędne pliki cookies techniczne, które są wymagane do prawidłowego działania strony. Te pliki cookies nie służą do zbierania żadnych danych osobowych ani do śledzenia użytkowników, co gwarantuje bezpieczeństwo korzystania z serwisu.</p>
        
        <h3>Brak zbierania danych</h3>
        <p>Serwis:</p>
        <ul>
            <li>Nie zbiera danych osobowych</li>
            <li>Nie wymaga rejestracji</li>
            <li>Nie prowadzi newslettera</li>
            <li>Nie śledzi zachowań użytkowników</li>
            <li>Nie wykorzystuje narzędzi analitycznych</li>
        </ul>
        
        <h3>Zmiany w polityce prywatności</h3>
        <p>Administrator zastrzega sobie prawo do zmiany niniejszej polityki prywatności w dowolnym czasie. O wszelkich zmianach użytkownicy będą informowani z odpowiednim wyprzedzeniem, aby mogli dostosować się do nowych zasad.</p>
        
        <p><strong>Ostatnia aktualizacja:</strong> ${new Date().toLocaleDateString('pl-PL')}</p>
    `;
    const modal = new Modal("Privacy Policy", modalContent, true);
    modal.open();
}

// Initialize the app when DOM is loaded
document.addEventListener("DOMContentLoaded", initializeApp);
