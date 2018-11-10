// Dependencies
// =============================================================================
import { version as pkgVersion } from '../../package.json';
import '../scss/style.scss';


// Constants and variables
// =============================================================================
const commentReplaceMark = 'tabs:replace';
const classNames = {
    tabsContainer  : 'content',
    tabBlock       : 'docsify-tabs',
    tabButton      : 'docsify-tabs__tab',
    tabButtonActive: 'docsify-tabs__tab--active',
    tabContent     : 'docsify-tabs__content'
};
const regex = {
    // Matches markdown code blocks (inline and multi-line)
    // Example: ```text```
    codeMarkup: /(```[\s\S]*?```)/gm,

    // Matches tab replacement comment
    // 0: Match
    // 1: Replacement HTML
    commentReplaceMarkup: new RegExp(`<!-- ${commentReplaceMark} (.*) -->`),

    // Matches tab set by start/end comment
    // 0: Match
    // 1: Indent
    // 2: Start comment: <!-- tabs:start -->
    // 3: Labels and content
    // 4: End comment: <!-- tabs:end -->
    tabBlockMarkup: /[\r\n]*(\s*)(<!-+\s+tabs:\s*?start\s+-+>)[\r\n]+([\s|\S]*?)[\r\n\s]+(<!-+\s+tabs:\s*?end\s+-+>)/m,

    // Matches tab label and content
    // 0: Match
    // 1: Label: <!-- tab:Label -->
    // 2: Content
    tabCommentMarkup: /<!-+\s+tab:\s*(.*)\s+-+>[\r\n]+([\s\S]*?)[\r\n]+(?=<!-+\s+tabs?:)/m,

    // Matches tab label and content
    // 0: Match
    // 1: Label: #### **Label** OR #### __Label__
    // 2: Content
    tabHeadingMarkup: /[\r\n]*(\s*)#{1,6}\s*[*_]{2}\s*(.*[^\s])\s*[*_]{2}[\r\n]+([\s\S]*?)(?=#{1,6}\s*[*_]{2}|<!-+\s+tabs:\s*?end\s+-+>)/m
};
const settings = {
    persist    : true,
    sync       : true,
    theme      : 'classic',
    tabComments: true,
    tabHeadings: true
};


// Functions
// =============================================================================
/**
 * Converts tab content into "stage 1" markup. Stage 1 markup contains temporary
 * comments which are replaced with HTML during Stage 2. This approach allows
 * all markdown to be converted to HTML before tab-specific HTML is added.
 *
 * @param {string} content
 * @returns {string}
 */
function renderTabsStage1(content) {
    const codeBlockMatch   = content.match(regex.codeMarkup) || [];
    const codeBlockMarkers = codeBlockMatch.map((item, i) => {
        const codeMarker = `<!-- ${commentReplaceMark} CODEBLOCK${i} -->`;

        // Replace code block with marker to ensure tab markup within code
        // blocks is not processed. These markers are replaced with their
        // associated code blocs after tabs have been processed.
        content = content.replace(item, codeMarker);

        return codeMarker;
    });
    const tabTheme = settings.theme ? `${classNames.tabBlock}--${settings.theme}` : '';

    let tabBlockMatch; // eslint-disable-line no-unused-vars
    let tabMatch; // eslint-disable-line no-unused-vars

    // Process each tab set
    while ((tabBlockMatch = regex.tabBlockMarkup.exec(content)) !== null) {
        let tabBlock            = tabBlockMatch[0];
        let tabStartReplacement = '';
        let tabEndReplacement   = '';

        const hasTabComments = settings.tabComments && regex.tabCommentMarkup.test(tabBlock);
        const hasTabHeadings = settings.tabHeadings && regex.tabHeadingMarkup.test(tabBlock);
        const tabBlockIndent  = tabBlockMatch[1];
        const tabBlockStart  = tabBlockMatch[2];
        const tabBlockEnd    = tabBlockMatch[4];

        if (hasTabComments || hasTabHeadings) {
            tabStartReplacement = `<!-- ${commentReplaceMark} <div class="${[classNames.tabBlock, tabTheme].join(' ')}"> -->`;
            tabEndReplacement = `\n${tabBlockIndent}<!-- ${commentReplaceMark} </div> -->`;

            // Process each tab panel
            while ((tabMatch = (settings.tabComments ? regex.tabCommentMarkup.exec(tabBlock) : null) || (settings.tabHeadings ? regex.tabHeadingMarkup.exec(tabBlock) : null)) !== null) {
                const tabTitle   = (tabMatch[2] || '[Tab]').trim();
                const tabContent = (tabMatch[3] || '').trim();

                tabBlock = tabBlock.replace(tabMatch[0], [
                    `\n${tabBlockIndent}<!-- ${commentReplaceMark} <button class="${classNames.tabButton}" data-tab="${tabTitle.toLowerCase()}">${tabTitle}</button> -->`,
                    `\n${tabBlockIndent}<!-- ${commentReplaceMark} <div class="${classNames.tabContent}" data-tab-content="${tabTitle.toLowerCase()}"> -->`,
                    `\n\n${tabBlockIndent}${tabContent}`,
                    `\n\n${tabBlockIndent}<!-- ${commentReplaceMark} </div> -->`,
                ].join(''));
            }
        }

        tabBlock = tabBlock.replace(tabBlockStart, tabStartReplacement);
        tabBlock = tabBlock.replace(tabBlockEnd, tabEndReplacement);
        content = content.replace(tabBlockMatch[0], tabBlock);
    }

    // Restore code blocks
    codeBlockMarkers.forEach((item, i) => {
        content = content.replace(item, codeBlockMatch[i]);
    });

    return content;
}

/**
 * Converts "stage 1" markup into final markup by replacing temporary comments
 * with HTML.
 *
 * @param {string} html
 * @returns {string}
 */
function renderTabsStage2(html) {
    let tabReplaceMatch; // eslint-disable-line no-unused-vars

    while ((tabReplaceMatch = regex.commentReplaceMarkup.exec(html)) !== null) {
        const tabComment     = tabReplaceMatch[0];
        const tabReplacement = tabReplaceMatch[1] || '';

        html = html.replace(tabComment, tabReplacement);
    }

    return html;
}

/**
 * Sets the initial active tab for each tab group: either the first tab in the
 * group or the last tab clicked (if persist option is enabled).
 */
function setDefaultTabs() {
    const tabsContainer = document.querySelector(`.${classNames.tabsContainer}`);
    const tabBlocks     = tabsContainer ? Array.apply(null, tabsContainer.querySelectorAll(`.${classNames.tabBlock}`)) : [];
    const tabStorage    = JSON.parse(sessionStorage.getItem(window.location.href)) || {};

    tabBlocks.forEach((tabBlock, index) => {
        const activeButtonDefault = tabBlock.querySelector(`.${classNames.tabButton}`);
        const activeButtonPersist = settings.persist ? tabBlock.querySelector(`.${classNames.tabButton}[data-tab="${tabStorage[index]}"]`) : null;
        const activeButton        = activeButtonPersist || activeButtonDefault;

        activeButton && activeButton.classList.add(classNames.tabButtonActive);
    });
}

/**
 * Sets the active tab within a group. Optionally stores the selection so it can
 * persist across page loads and syncs active state to tabs with same data attr.
 *
 * @param {object} elm
 * @param {boolean} isSync
 */
function setActiveTab(elm, isSync) {
    const isTabButton = elm.classList.contains(classNames.tabButton);

    if (isTabButton) {
        const activeButton      = elm;
        const activeButtonLabel = activeButton.getAttribute('data-tab');
        const tabsContainer     = document.querySelector(`.${classNames.tabsContainer}`);
        const tabBlock          = activeButton.parentNode;
        const tabButtons        = Array.apply(null, tabBlock.querySelectorAll(`.${classNames.tabButton}`));
        const tabBlockOffset    = tabBlock.offsetTop;

        tabButtons.forEach(buttonElm => buttonElm.classList.remove(classNames.tabButtonActive));
        activeButton.classList.add(classNames.tabButtonActive);

        if (settings.persist) {
            const tabBlocks     = tabsContainer ? Array.apply(null, tabsContainer.querySelectorAll(`.${classNames.tabBlock}`)) : [];
            const tabBlockIndex = tabBlocks.indexOf(tabBlock);
            const tabStorage    = JSON.parse(sessionStorage.getItem(window.location.href)) || {};

            tabStorage[tabBlockIndex] = activeButtonLabel;
            sessionStorage.setItem(window.location.href, JSON.stringify(tabStorage));
        }

        if (settings.sync && !isSync) {
            const tabButtonMatches = tabsContainer ? Array.apply(null, tabsContainer.querySelectorAll(`.${classNames.tabButton}[data-tab="${activeButtonLabel}"]`)) : [];

            tabButtonMatches.forEach(tabButtonMatch => {
                setActiveTab(tabButtonMatch, true);
            });

            // Maintain position in viewport when tab group's offset changes
            window.scrollBy(0, 0 - (tabBlockOffset - tabBlock.offsetTop));
        }
    }
}


// Plugin
// =============================================================================
function docsifyTabs(hook, vm) {
    let hasTabs =false;

    hook.beforeEach(function(content) {
        hasTabs = regex.tabBlockMarkup.test(content);

        if (hasTabs) {
            content = renderTabsStage1(content);
        }

        return content;
    });

    hook.afterEach(function(html, next) {
        if (hasTabs) {
            html = renderTabsStage2(html);
        }

        next(html);
    });

    hook.doneEach(function() {
        if (hasTabs) {
            setDefaultTabs();
        }
    });

    hook.mounted(function() {
        const tabsContainer = document.querySelector(`.${classNames.tabsContainer}`);

        tabsContainer && tabsContainer.addEventListener('click', function(evt) {
            setActiveTab(evt.target);
        });
    });
}


if (window) {
    window.$docsify = window.$docsify || {};

    // Add config object
    window.$docsify.tabs = window.$docsify.tabs || {};

    // Update settings based on $docsify config
    Object.keys(window.$docsify.tabs).forEach(key => {
        if (settings.hasOwnProperty(key)) {
            settings[key] = window.$docsify.tabs[key];
        }
    });

    // Add plugin data
    window.$docsify.tabs.version = pkgVersion;

    // Init plugin
    if (settings.tabComments || settings.tabHeadings) {
        window.$docsify.plugins = [].concat(
            docsifyTabs,
            (window.$docsify.plugins || [])
        );
    }
}
