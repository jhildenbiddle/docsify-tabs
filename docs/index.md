# docsify-tabs

[![NPM](https://img.shields.io/npm/v/docsify-tabs.svg?style=flat-square)](https://www.npmjs.com/package/docsify-tabs)
[![Codacy grade](https://img.shields.io/codacy/grade/860d40719cbd4e0f91e145b87ec7c29a.svg?style=flat-square)](https://www.codacy.com/app/jhildenbiddle/docsify-tabs?utm_source=github.com&amp;utm_medium=referral&amp;utm_content=jhildenbiddle/docsify-tabs&amp;utm_campaign=Badge_Grade)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=flat-square)](https://github.com/jhildenbiddle/docsify-tabs/blob/master/LICENSE)
[![Tweet](https://img.shields.io/twitter/url/http/shields.io.svg?style=social)](https://twitter.com/intent/tweet?url=https%3A%2F%2Fgithub.com%2Fjhildenbiddle%2Fdocsify-tabs&hashtags=docsify,developers,frontend,plugin)
<a class="github-button" href="https://github.com/jhildenbiddle/docsify-tabs" data-icon="octicon-star" data-show-count="true" aria-label="Star jhildenbiddle/docsify-tabs on GitHub">Star</a>

A [docsify.js](https://docsify.js.org) plugin for displaying tabbed content from markdown.

## Demo

A basic tab set using the default [options](#options).

<!-- tabs:start -->

#### **Tab A**

This is some text.

* List item A-1
* List item A-2

```js
// JavaScript
function add(a, b) {
  return a + b;
}
```

#### **Tab B**

This is some more text.

* List item B-1
* List item B-2

```css
/* CSS */
body {
  background: white;
  color: #222;
}
```

#### **Tab C**

This is some more text.

* List item C-1
* List item C-2

```html
<!-- HTML -->
<h1>Heading</h1>
<p>This is a paragraph.</p>
```

<!-- tabs:end -->

?> Like docsify-tabs? Be sure to check out [docsify-themeable](https://jhildenbiddle.github.io/docsify-themeable) for your site theme!

## Features

* Generate tabbed content using unobtrusive markup
* Persist tab selections on refresh/revisit
* Sync tab selection for tabs with matching labels
* Style tabs using "classic" or "material" tab theme
* Customize styles using CSS custom properties
* Compatible with [docsify-themeable](https://jhildenbiddle.github.io/docsify-themeable/) themes

#### Limitations

* Nested tabs are not supported (i.e. tabs within tabs, block quotes, list items, etc).

## Installation

1. Add the docsify-tabs plugin to your `index.html` after `docsify.min.js`.

   ```html
   <!-- docsify -->
   <script src="https://unpkg.com/docsify/lib/docsify.min.js"></script>

   <!-- docsify-tabs v1.x -->
   <script src="https://unpkg.com/docsify-tabs@1"></script>
   ```

   Also available on [jsdelivr.net](https://cdn.jsdelivr.net/npm/docsify-tabs@1):

   ```html
   <!-- docsify-tabs v1.x -->
   <script src="https://cdn.jsdelivr.net/npm/docsify-tabs@1"></script>
   ```

1. Review the [Options](#options) section and configure as needed.

   ```javascript
   window.$docsify = {
     // ...
     tabs: {
       persist    : true,      // default
       sync       : true,      // default
       theme      : 'classic', // default
       tabComments: true,      // default
       tabHeadings: true       // default
     }
   };
   ```

1. Review the [Customization](#customization) section and set theme properties as needed.

   ```css
    :root {
      /* Tab border color */
      --docsifytabs-border-color: #ededed;

      /* Active tab highlight color */
      --docsifytabs-tab-highlight-color: purple;
    }
   ```

## Usage

#### Define a tab set using `tab:start` and `tab:end` comments.

HTML comments are used to mark the start and end of a tab set. The use of HTML comments prevents tab-related markup from being displayed when markdown is rendered as HTML outside of your docsify site (e.g. Github, GitLab, etc).

```markdown
<!-- tabs:start -->

...

<!-- tabs:end -->
```

#### Define tabs within a tab set using heading + bold markdown.

Heading text will be used as the tab label, and all proceeding content will be associated with that tab up to start of the next tab or a `tab:end` comment. The use of heading + bold markdown allows tabs to be defined using standard markdown and ensures that tab content is displayed with a heading when rendered outside of your docsify site (e.g. GitHub, GitLab, etc).

```markdown
<!-- tabs:start -->

#### ** English **

Hello!

#### ** French **

Bonjour!

#### ** Italian **

Ciao!

<!-- tabs:end -->
```

See [`options.tabHeadings`](#tabheadings) for details or [`options.tabComments`](#tabcomments) for an alternate method of defining tabs within tab sets.

#### Voilà!

A tab set is formed.

<!-- tabs:start -->

#### **English**

Hello!

#### **French**

Bonjour!

#### **Italian**

Ciao!

<!-- tabs:end -->

## Options

Options are set within the [`window.$docsify`](https://docsify.js.org/#/configuration) configuration under the `tabs` key:

```html
<script>
  window.$docsify = {
    // ...
    tabs: {
      persist    : true,      // default
      sync       : true,      // default
      theme      : 'classic', // default
      tabComments: true,      // default
      tabHeadings: true       // default
    }
  };
</script>
```

### persist

* Type: `boolean`
* Default: `true`

Determines if tab selections will be restored after a page refresh/revisit.

#### Configuration

```javascript
window.$docsify = {
  // ...
  tabs: {
    persist: true // default
  }
};
```

### sync

* Type: `boolean`
* Default: `true`

Determines if tab selections will be synced across tabs with matching labels.

#### Configuration

```javascript
window.$docsify = {
  // ...
  tabs: {
    sync: true // default
  }
};
```

#### Demo

<!-- tabs:start -->

#### **macOS**

Instructions for macOS...

#### **Windows**

Instructions for Windows...

#### **Linux**

Instructions for Linux...

<!-- tabs:end -->

<!-- tabs:start -->

#### **macOS**

More instructions for macOS...

#### **Windows**

More instructions for Windows...

#### **Linux**

More instructions for Linux...

<!-- tabs:end -->

### theme

* Type: `string|boolean`
* Accepts: `'classic'`, `'material'`, `false`
* Default: `'classic'`

Sets the tab theme. A value of `false` will indicate that no theme should be applied, which should be used when creating custom tab themes.

#### Configuration

```javascript
window.$docsify = {
  // ...
  tabs: {
    theme: 'classic' // default
  }
};
```

#### Demo

<label><input name="theme" type="radio" value="classic" checked="checked"> Classic</label>
<label><input name="theme" type="radio" value="material"> Material</label>
<label><input name="theme" type="radio" value="none"> No Theme</label>

<!-- tabs:start -->

#### **Tab A**

This is some text.

#### **Tab B**

This is some more text.

#### **Tab C**

Yes, this is even more text.

<!-- tabs:end -->

### tabComments

* Type: `boolean`
* Default: `true`

Determines if tabs within a tab set can be defined using tab comments.

#### Configuration

```javascript
window.$docsify = {
  // ...
  tabs: {
    tabComments: true // default
  }
};
```

#### Example

```markdown
<!-- tabs:start -->

<!-- tab:English -->

Hello!

<!-- tab:French -->

Bonjour!

<!-- tab:Italian -->

Ciao!

<!-- tabs:end -->
```

### tabHeadings

* Type: `boolean`
* Default: `true`

Determines if tabs within a tab set can be defined using heading + bold markdown.

The use of heading + bold markdown allows tabs to be defined using standard markdown and ensures that tab content is displayed with a heading when rendered outside of your docsify site (e.g. GitHub, GitLab, etc). Heading levels 1-6 are supported (e.g. `#` - `######`) as are both asteriscks (`**`) and underscores (`__`) for bold text via markdown.

#### Configuration

```javascript
window.$docsify = {
  // ...
  tabs: {
    tabHeadings: true // default
  }
};
```

#### Example

```markdown
<!-- tabs:start -->

#### ** English **

Hello!

#### ** French **

Bonjour!

#### ** Italian **

Ciao!

<!-- tabs:end -->
```

## Customization

TBD

## Contact & Support

* Create a [GitHub issue](https://github.com/jhildenbiddle/docsify-tabs/issues) for bug reports, feature requests, or questions
* Follow [@jhildenbiddle](https://twitter.com/jhildenbiddle) for announcements
* Add a ⭐️ [star on GitHub](https://github.com/jhildenbiddle/docsify-tabs) or ❤️ [tweet](https://twitter.com/intent/tweet?url=https%3A%2F%2Fgithub.com%2Fjhildenbiddle%2Fdocsify-tabs&hashtags=css,developers,frontend,javascript) to support the project!

## License

This project is licensed under the [MIT license](https://github.com/jhildenbiddle/docsify-tabs/blob/master/LICENSE).

Copyright (c) 2018 John Hildenbiddle ([@jhildenbiddle](https://twitter.com/jhildenbiddle))

<!-- GitHub Buttons -->
<script async defer src="https://buttons.github.io/buttons.js"></script>
