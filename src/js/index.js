// Dependencies
// =============================================================================
import { version as pkgVersion } from '../../package.json';
import '../scss/style.scss';

// Constants and variables
// =============================================================================
const commentReplaceMark = 'tabs:replace';
const classNames = {
  tabsContainer: 'content',
  tabBlock: 'docsify-tabs',
  tabButton: 'docsify-tabs__tab',
  tabButtonActive: 'docsify-tabs__tab--active',
  tabContent: 'docsify-tabs__content'
};
const regex = {
  // Matches markdown code blocks (inline and multi-line)
  // Example: ```text```
  codeMarkup: /(```[\s\S]*?```)/gm,

  // Matches tab replacement comment
  // 0: Match
  // 1: Replacement HTML
  commentReplaceMarkup: new RegExp(`<!-- ${commentReplaceMark} (.*?) -->`),

  // Matches inner-most tab set by start/end comment
  // Ex: <!-- tabs:start --> (<!-- tabs:start --><!-- tabs:end -->) <!-- tabs:end -->
  // 0: Match
  // 1: Indent
  // 2: Start comment: <!-- tabs:start -->
  // 3: undefined
  // 4: End comment: <!-- tabs:end -->
  tabBlockMarkup:
    /( *)(<!-+\s+tabs:\s*?start\s+-+>)(?:(?!(<!-+\s+tabs:\s*?(?:start|end)\s+-+>))[\s\S])*(<!-+\s+tabs:\s*?end\s+-+>)/,

  // Matches tab label and content
  // 0: Match
  // 1: Label: <!-- tab:Label -->
  // 2: Content
  tabCommentMarkup:
    /[\r\n]*(\s*)<!-+\s+tab:\s*(.*)\s+-+>[\r\n]+([\s\S]*?)[\r\n]*\s*(?=<!-+\s+tabs?:(?!replace))/m,

  // Matches tab label and content
  // 0: Match
  // 1: Label: #### **Label** OR #### __Label__
  // 2: Content
  tabHeadingMarkup:
    /[\r\n]*(\s*)#{1,6}\s*[*_]{2}\s*(.*[^\s])\s*[*_]{2}[\r\n]+([\s\S]*?)(?=#{1,6}\s*[*_]{2}|<!-+\s+tabs:\s*?end\s+-+>)/m
};
const settings = {
  persist: true,
  sync: true,
  theme: 'classic',
  tabComments: true,
  tabHeadings: true
};

const storageKeys = {
  get persist() {
    return `docsify-tabs.persist.${window.location.pathname}`;
  },
  sync: 'docsify-tabs.sync'
};

// Functions
// =============================================================================
/**
 * Traverses the element and its parents until it finds a node that matches the
 * provided selector string. Will return itself or the matching ancestor.
 *
 * @param {object} elm
 * @param {string} closestSelectorString
 * @return {(object|null)}
 */
function getClosest(elm, closestSelectorString) {
  if (Element.prototype.closest) {
    return elm.closest(closestSelectorString);
  }

  while (elm) {
    const isMatch = matchSelector(elm, closestSelectorString);

    if (isMatch) {
      return elm;
    }

    elm = elm.parentNode || null;
  }

  return elm;
}

/**
 * Checks to see if the element would be selected by the provided selectorString
 *
 * @param {object} elm
 * @param {string} selectorString
 * @return {boolean}
 */
function matchSelector(elm, selectorString) {
  const matches =
    Element.prototype.matches ||
    Element.prototype.msMatchesSelector ||
    Element.prototype.webkitMatchesSelector;

  return matches.call(elm, selectorString);
}

/**
 * Converts tab content into "stage 1" markup. Stage 1 markup contains temporary
 * comments which are replaced with HTML during Stage 2. This approach allows
 * all markdown to be converted to HTML before tab-specific HTML is added.
 *
 * @param {string} content
 * @returns {string}
 */
function renderTabsStage1(content, vm) {
  const codeBlockMatch = content.match(regex.codeMarkup) || [];
  const codeBlockMarkers = codeBlockMatch.map((item, i) => {
    const codeMarker = `<!-- ${commentReplaceMark} CODEBLOCK${i} -->`;

    // Replace code block with marker to ensure tab markup within code
    // blocks is not processed. These markers are replaced with their
    // associated code blocs after tabs have been processed.
    content = content.replace(item, () => codeMarker);

    return codeMarker;
  });
  const tabTheme = settings.theme
    ? `${classNames.tabBlock}--${settings.theme}`
    : '';
  const tempElm = document.createElement('div');

  let tabBlockMatch = content.match(regex.tabBlockMarkup);
  let tabIndex = 1;

  // Process each tab set
  while (tabBlockMatch) {
    let tabBlockOut = tabBlockMatch[0];

    const tabBlockIndent = tabBlockMatch[1];
    const tabBlockStart = tabBlockMatch[2];
    const tabBlockEnd = tabBlockMatch[4];
    const hasTabComments =
      settings.tabComments && regex.tabCommentMarkup.test(tabBlockOut);
    const hasTabHeadings =
      settings.tabHeadings && regex.tabHeadingMarkup.test(tabBlockOut);

    let tabMatch;
    let tabStartReplacement = '';
    let tabEndReplacement = '';

    if (hasTabComments || hasTabHeadings) {
      tabStartReplacement = `<!-- ${commentReplaceMark} <div class="${[classNames.tabBlock, tabTheme].join(' ')}"> -->`;
      tabEndReplacement = `\n${tabBlockIndent}<!-- ${commentReplaceMark} </div> -->`;

      // Process each tab panel
      while (
        (tabMatch =
          (settings.tabComments
            ? regex.tabCommentMarkup.exec(tabBlockOut)
            : null) ||
          (settings.tabHeadings
            ? regex.tabHeadingMarkup.exec(tabBlockOut)
            : null)) !== null
      ) {
        // Process tab title as markdown
        // Ex: <!-- tab:**Bold** and <span style="color: red;">red</span> -->
        tempElm.innerHTML = tabMatch[2].trim()
          ? vm.compiler.compile(tabMatch[2]).replace(/<\/?p>/g, '')
          : `Tab ${tabIndex}`;

        const tabTitle = tempElm.innerHTML;
        const tabContent = (tabMatch[3] || '').trim();
        const tabData = (
          tempElm.textContent ||
          tempElm.firstChild.getAttribute('alt') ||
          tempElm.firstChild.getAttribute('src')
        )
          .trim()
          .toLowerCase();

        // Use replace function to avoid regex special replacement
        // strings being processed ($$, $&, $`, $', $n)
        tabBlockOut = tabBlockOut.replace(tabMatch[0], () =>
          [
            `\n${tabBlockIndent}<!-- ${commentReplaceMark} <button class="${classNames.tabButton}" data-tab="${tabData}">${tabTitle}</button> -->`,
            `\n${tabBlockIndent}<!-- ${commentReplaceMark} <div class="${classNames.tabContent}" data-tab-content="${tabData}"> -->`,
            `\n\n${tabBlockIndent}${tabContent}`,
            `\n\n${tabBlockIndent}<!-- ${commentReplaceMark} </div> -->`
          ].join('')
        );

        tabIndex++;
      }
    }

    tabBlockOut = tabBlockOut.replace(tabBlockStart, () => tabStartReplacement);
    tabBlockOut = tabBlockOut.replace(tabBlockEnd, () => tabEndReplacement);
    content = content.replace(tabBlockMatch[0], () => tabBlockOut);

    tabBlockMatch = content.match(regex.tabBlockMarkup);
  }

  // Restore code blocks
  codeBlockMarkers.forEach((item, i) => {
    content = content.replace(item, () => codeBlockMatch[i]);
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
    const tabComment = tabReplaceMatch[0];
    const tabReplacement = tabReplaceMatch[1] || '';

    html = html.replace(tabComment, () => tabReplacement);
  }

  return html;
}

/**
 * Sets the initial active tab for each tab group: the tab containing the
 * matching element ID from the URL, the first tab in the group, or the last tab
 * clicked (if persist option is enabled).
 */
function setDefaultTabs() {
  const tabsContainer = document.querySelector(`.${classNames.tabsContainer}`);
  const tabBlocks = tabsContainer
    ? Array.apply(
        null,
        tabsContainer.querySelectorAll(`.${classNames.tabBlock}`)
      )
    : [];
  const tabStoragePersist =
    JSON.parse(sessionStorage.getItem(storageKeys.persist)) || {};
  const tabStorageSync =
    JSON.parse(sessionStorage.getItem(storageKeys.sync)) || [];

  setActiveTabFromAnchor();

  tabBlocks.forEach((tabBlock, index) => {
    let activeButton = Array.apply(null, tabBlock.children).filter(elm =>
      matchSelector(elm, `.${classNames.tabButtonActive}`)
    )[0];

    if (!activeButton) {
      if (settings.sync && tabStorageSync.length) {
        activeButton = tabStorageSync
          .map(
            label =>
              Array.apply(null, tabBlock.children).filter(elm =>
                matchSelector(
                  elm,
                  `.${classNames.tabButton}[data-tab="${label}"]`
                )
              )[0]
          )
          .filter(elm => elm)[0];
      }

      if (!activeButton && settings.persist) {
        activeButton = Array.apply(null, tabBlock.children).filter(elm =>
          matchSelector(
            elm,
            `.${classNames.tabButton}[data-tab="${tabStoragePersist[index]}"]`
          )
        )[0];
      }

      activeButton =
        activeButton || tabBlock.querySelector(`.${classNames.tabButton}`);
      activeButton && activeButton.classList.add(classNames.tabButtonActive);
    }
  });
}

/**
 * Sets the active tab within a group. Optionally stores the selection so it can
 * persist across page loads and syncs active state to tabs with same data attr.
 *
 * @param {object} elm Tab toggle element to mark as active
 */
function setActiveTab(elm, _isMatchingTabSync = false) {
  const activeButton = getClosest(elm, `.${classNames.tabButton}`);

  if (activeButton) {
    const activeButtonLabel = activeButton.getAttribute('data-tab');
    const tabsContainer = document.querySelector(
      `.${classNames.tabsContainer}`
    );
    const tabBlock = activeButton.parentNode;
    const tabButtons = Array.apply(null, tabBlock.children).filter(elm =>
      matchSelector(elm, 'button')
    );
    const tabBlockOffset = tabBlock.offsetTop;

    tabButtons.forEach(buttonElm =>
      buttonElm.classList.remove(classNames.tabButtonActive)
    );
    activeButton.classList.add(classNames.tabButtonActive);

    if (!_isMatchingTabSync) {
      if (settings.persist) {
        const tabBlocks = tabsContainer
          ? Array.apply(
              null,
              tabsContainer.querySelectorAll(`.${classNames.tabBlock}`)
            )
          : [];
        const tabBlockIndex = tabBlocks.indexOf(tabBlock);
        const tabStorage =
          JSON.parse(sessionStorage.getItem(storageKeys.persist)) || {};

        tabStorage[tabBlockIndex] = activeButtonLabel;
        sessionStorage.setItem(storageKeys.persist, JSON.stringify(tabStorage));
      }

      if (settings.sync) {
        const tabButtonMatches = tabsContainer
          ? Array.apply(
              null,
              tabsContainer.querySelectorAll(
                `.${classNames.tabButton}[data-tab="${activeButtonLabel}"]`
              )
            )
          : [];
        const tabStorage =
          JSON.parse(sessionStorage.getItem(storageKeys.sync)) || [];

        tabButtonMatches.forEach(tabButtonMatch => {
          setActiveTab(tabButtonMatch, true);
        });

        // Maintain position in viewport when tab group's offset changes
        window.scrollBy(0, 0 - (tabBlockOffset - tabBlock.offsetTop));

        // Remove existing label if not first in array
        if (tabStorage.indexOf(activeButtonLabel) > 0) {
          tabStorage.splice(tabStorage.indexOf(activeButtonLabel), 1);
        }

        // Add label if not already in first position
        if (tabStorage.indexOf(activeButtonLabel) !== 0) {
          tabStorage.unshift(activeButtonLabel);
          sessionStorage.setItem(storageKeys.sync, JSON.stringify(tabStorage));
        }
      }
    }
  }
}

/**
 * Sets the active tab based on the anchor ID in the URL
 */
function setActiveTabFromAnchor() {
  const anchorID = decodeURIComponent(
    (window.location.hash.match(/(?:id=)([^&]+)/) || [])[1]
  );
  const anchorSelector = anchorID && `.${classNames.tabBlock} #${anchorID}`;
  const isAnchorElmInTabBlock =
    anchorID && document.querySelector(anchorSelector);

  if (isAnchorElmInTabBlock) {
    const anchorElm = document.querySelector(`#${anchorID}`);

    let tabContent;

    if (anchorElm.closest) {
      tabContent = anchorElm.closest(`.${classNames.tabContent}`);
    } else {
      tabContent = anchorElm.parentNode;

      while (
        tabContent !== document.body &&
        !tabContent.classList.contains(`${classNames.tabContent}`)
      ) {
        tabContent = tabContent.parentNode;
      }
    }

    setActiveTab(tabContent.previousElementSibling);
  }
}

// Plugin
// =============================================================================
function docsifyTabs(hook, vm) {
  let hasTabs = false;

  hook.beforeEach(function (content) {
    hasTabs = regex.tabBlockMarkup.test(content);

    if (hasTabs) {
      content = renderTabsStage1(content, vm);
    }

    return content;
  });

  hook.afterEach(function (html, next) {
    if (hasTabs) {
      html = renderTabsStage2(html);
    }

    next(html);
  });

  hook.doneEach(function () {
    if (hasTabs) {
      setDefaultTabs();
    }
  });

  hook.mounted(function () {
    const tabsContainer = document.querySelector(
      `.${classNames.tabsContainer}`
    );

    tabsContainer &&
      tabsContainer.addEventListener('click', function handleTabClick(evt) {
        setActiveTab(evt.target);
      });

    window.addEventListener('hashchange', setActiveTabFromAnchor, false);
  });
}

if (window) {
  window.$docsify = window.$docsify || {};

  // Add config object
  window.$docsify.tabs = window.$docsify.tabs || {};

  // Update settings based on $docsify config
  Object.keys(window.$docsify.tabs).forEach(key => {
    if (Object.prototype.hasOwnProperty.call(settings, key)) {
      settings[key] = window.$docsify.tabs[key];
    }
  });

  // Add plugin data
  window.$docsify.tabs.version = pkgVersion;

  // Init plugin
  if (settings.tabComments || settings.tabHeadings) {
    window.$docsify.plugins = [].concat(
      window.$docsify.plugins || [],
      docsifyTabs
    );
  }
}
