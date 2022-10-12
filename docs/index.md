# docsify-tabs

[![NPM](https://img.shields.io/npm/v/docsify-tabs.svg?style=flat-square)](https://www.npmjs.com/package/docsify-tabs)
[![GitHub Workflow Status (master)](https://img.shields.io/github/workflow/status/jhildenbiddle/docsify-tabs/Build/master?label=checks&style=flat-square)](https://github.com/jhildenbiddle/docsify-tabs/actions?query=branch%3Amaster+)
[![Codacy grade](https://img.shields.io/codacy/grade/e9c2a9504211450ab39e0d72a1158a47.svg?style=flat-square)](https://app.codacy.com/gh/jhildenbiddle/docsify-tabs/dashboard)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=flat-square)](https://github.com/jhildenbiddle/docsify-tabs/blob/master/LICENSE)
[![jsDelivr](https://data.jsdelivr.com/v1/package/npm/docsify-tabs/badge)](https://www.jsdelivr.com/package/npm/docsify-tabs)
[![Sponsor this project](https://img.shields.io/static/v1?style=flat-square&label=Sponsor&message=%E2%9D%A4&logo=GitHub&color=%23fe8e86)](https://github.com/sponsors/jhildenbiddle)
[![Add a star on GitHub](https://img.shields.io/github/stars/jhildenbiddle/docsify-tabs?style=social)](https://github.com/jhildenbiddle/docsify-tabs)
[![Tweet](https://img.shields.io/twitter/url/http/shields.io.svg?style=social)](https://twitter.com/intent/tweet?url=https%3A%2F%2Fgithub.com%2Fjhildenbiddle%2Fdocsify-tabs&hashtags=docsify,developers,frontend,plugin)

A [docsify.js](https://docsify.js.org) plugin for rendering tabbed content from markdown.

## Demo

A basic tab set using the default [options](#options).

<!-- tabs:start -->

#### **Tab A**

### Heading for Tab A {docsify-ignore}

This is some text.

- List item A-1
- List item A-2

```js
// JavaScript
function add(a, b) {
  return a + b;
}
```

<!-- tabs:start -->

#### **Nested Tab 1**

Life is what happens when you're busy making other plans.

\- *John Lennon*

#### **Nested Tab 2**

The greatest glory in living lies not in never falling, but in rising every time we fall.

\- *Nelson Mandela*

<!-- tabs:end -->

#### **Tab B**

### Heading for Tab B {docsify-ignore}

This is some text.

- List item B-1
- List item B-2

```css
/* CSS */
body {
  background: white;
  color: #222;
}
```

#### **Tab C**

This is some text.

- List item C-1
- List item C-2

```html
<!-- HTML -->
<h1>Heading</h1>
<p>This is a paragraph.</p>
```

<!-- tabs:end -->

?> Like this plugin? Check out [docsify-themeable](https://jhildenbiddle.github.io/docsify-themeable) for your site theme, [docsify-plugin-ethicalads](https://jhildenbiddle.github.io/docsify-plugin-ethicalads/) for EthicalAds integration, and [docsify-plugin-runkit](https://jhildenbiddle.github.io/docsify-plugin-runkit/) for live JavaScript REPLs!

## Features

- Generate tabbed content using unobtrusive markup
- Persist tab selections on refresh/revisit
- Sync tab selection for tabs with matching labels
- Nest tab sets within tab sets
- Style tabs using "classic" or "material" tab theme
- Customize styles without complex CSS using CSS custom properties
- Compatible with [docsify-themeable](https://jhildenbiddle.github.io/docsify-themeable/) themes

**Limitations**

- Tabs wraps when their combined width exceeds the content area width

## Installation

1. Add the docsify-tabs plugin to your `index.html` after docsify. The plugin is available on [jsdelivr](https://www.jsdelivr.com/package/npm/docsify-tabs) (below), [unpkg](https://unpkg.com/browse/docsify-tabs/), and other CDN services that auto-publish npm packages.

   ```html
   <!-- docsify (latest v4.x.x)-->
   <script src="https://cdn.jsdelivr.net/npm/docsify@4"></script>

   <!-- docsify-tabs (latest v1.x.x) -->
   <script src="https://cdn.jsdelivr.net/npm/docsify-tabs@1"></script>
   ```

   !> Note the `@` version number lock in the URLs above. This prevents breaking changes in future releases from affecting your project and is therefore the safest method of loading dependencies from a CDN. When a new major version is released, you will need to manually update your CDN URLs by changing the version number after the @ symbol.

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

   ```html
   <style>
     :root {
       --docsifytabs-border-color: #ededed;
       --docsifytabs-tab-highlight-color: purple;
     }
   </style>
   ```

## Usage

1. Define a tab set using `tabs:start` and `tabs:end` HTML comments.

   HTML comments are used to mark the start and end of a tab set. The use of HTML comments prevents tab-related markup from being displayed when markdown is rendered as HTML outside of your docsify site (e.g. GitHub, GitLab, etc).

   ```markdown
   <!-- tabs:start -->

   ...

   <!-- tabs:end -->
   ```

1. Define tabs within a tab set using heading + bold markdown.

   Heading text will be used as the tab label, and all proceeding content will be associated with that tab up to start of the next tab or a `tab:end` comment. The use of heading + bold markdown allows tabs to be defined using standard markdown and ensures that tab content is displayed with a heading when rendered outside of your docsify site (e.g. GitHub, GitLab, etc).

   ```markdown
   <!-- tabs:start -->

   #### **English**

   Hello!

   #### **French**

   Bonjour!

   #### **Italian**

   Ciao!

   <!-- tabs:end -->
   ```

   See [`options.tabHeadings`](#tabheadings) for details or [`options.tabComments`](#tabcomments) for an alternate method of defining tabs using HTML comments.

1. Voilà! A tab set is formed.

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

- Type: `boolean`
- Default: `true`

Determines if tab selections will be restored after a page refresh/revisit.

**Configuration**

```javascript
window.$docsify = {
  // ...
  tabs: {
    persist: true // default
  }
};
```

### sync

- Type: `boolean`
- Default: `true`

Determines if tab selections will be synced across tabs with matching labels.

**Configuration**

```javascript
window.$docsify = {
  // ...
  tabs: {
    sync: true // default
  }
};
```

**Demo**

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

- Type: `string|boolean`
- Accepts: `'classic'`, `'material'`, `false`
- Default: `'classic'`

Sets the tab theme. A value of `false` will indicate that no theme should be applied, which should be used when creating custom tab themes.

**Configuration**

```javascript
window.$docsify = {
  // ...
  tabs: {
    theme: 'classic' // default
  }
};
```

**Demo**

<label data-class-target="label + .docsify-tabs" data-class-remove="docsify-tabs--material" data-class-add="docsify-tabs--classic">
  <input name="theme" type="radio" value="classic" checked="checked"> Classic
</label>
<label data-class-target="label + .docsify-tabs" data-class-remove="docsify-tabs--classic" data-class-add="docsify-tabs--material">
  <input name="theme" type="radio" value="material"> Material
</label>
<label data-class-target="label + .docsify-tabs" data-class-remove="docsify-tabs--classic docsify-tabs--material">
  <input name="theme" type="radio" value="none"> No Theme
</label>

<!-- tabs:start -->

#### **Tab A**

This is some text.

#### **Tab B**

This is some more text.

#### **Tab C**

Yes, this is even more text.

<!-- tabs:end -->

### tabComments

- Type: `boolean`
- Default: `true`

Determines if tabs within a tab set can be defined using tab comments.

Note that defining tabs using HTML comments means tab content will not be labeled when rendered outside of your docsify site (e.g. GitHub, GitLab, etc). For this reason, defining tabs using [`options.tabHeadings`](#tabheadings) is recommended.

**Configuration**

```javascript
window.$docsify = {
  // ...
  tabs: {
    tabComments: true // default
  }
};
```

**Example**

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

- Type: `boolean`
- Default: `true`

Determines if tabs within a tab set can be defined using heading + bold markdown.

The use of heading + bold markdown allows tabs to be defined using standard markdown and ensures that tab content is displayed with a heading when rendered outside of your docsify site (e.g. GitHub, GitLab, etc). Heading levels 1-6 are supported (e.g. `#` - `######`) as are both asterisks (`**`) and underscores (`__`) for bold text via markdown.

**Configuration**

```javascript
window.$docsify = {
  // ...
  tabs: {
    tabHeadings: true // default
  }
};
```

**Example**

```markdown
<!-- tabs:start -->

#### **English**

Hello!

#### **French**

Bonjour!

#### **Italian**

Ciao!

<!-- tabs:end -->
```

## Customization

### Themes

See [`options.theme`](#theme) for details on available themes.

### Theme Properties

Theme properties allow you to customize tab styles without writing complex CSS. The following list contains the default theme values.

[vars.css](https://raw.githubusercontent.com/jhildenbiddle/docsify-tabs/master/src/css/vars.css ':include :type:code')

To set theme properties, add a `<style>` element to your `index.html` file after all other stylesheets and set properties within a `:root` selector.

```html
<style>
  :root {
    --docsifytabs-border-color: #ededed;
    --docsifytabs-tab-highlight-color: purple;
  }
</style>
```

### Custom Styles

The easiest way to create custom tab styles is by using markdown and/or HTML in your tab label.

<!-- tabs:start -->

#### **Bold**

**Tab Markdown**

```markdown
<!-- tabs:start -->

#### **Bold**

...

<!-- tabs:end -->
```

#### **<em>Italic</em>**

**Tab Markdown**

```markdown
<!-- tabs:start -->

#### **<em>Italic</em>**

...

<!-- tabs:end -->
```

#### **<span style="color: red;">Red</span>**

**Tab Markdown**

```markdown
<!-- tabs:start -->

#### **<span style="color: red;">Red</span>**

...

<!-- tabs:end -->
```

#### **:smile:**

**Tab Markdown**

```markdown
<!-- tabs:start -->

#### **:smile:**

...

<!-- tabs:end -->
```

#### **😀**

**Tab Markdown**

```markdown
<!-- tabs:start -->

#### **😀**

...

<!-- tabs:end -->
```

#### **Badge <span class="tab-badge">New!</span>**

**Tab Markdown**

```markdown
<!-- tabs:start -->

#### **Badge <span class="tab-badge">New!</span>**

...

<!-- tabs:end -->
```

#### CSS

```html
<style>
  .tab-badge {
    position: absolute;
    top: 0;
    right: 0;
    transform: translate(35%, -45%);
    padding: 0.25em 0.35em;
    border-radius: 3px;
    background: red;
    color: white;
    font-family: sans-serif;
    font-size: 11px;
    font-weight: bold;
  }
</style>
```

<!-- tabs:end -->

More advanced styling can be applied by leveraging the CSS class names and data attributes associated with tab containers, toggles, labels, and content blocks. Consider the following tab markdown and the HTML output generated by docsify-tabs:

```markdown
<!-- tabs:start -->

#### **My Tab**

...

<!-- tabs:end -->
```

```html
<button class="docsify-tabs__tab" data-tab="my tab">My Tab</button>
<div class="docsify-tabs__content" data-tab-content="my tab">
  ...
</div>
```

When the tab is active, note the addition of the `docsify-tabs__tab--active` class:

```html
<button class="docsify-tabs__tab docsify-tabs__tab--active" data-tab="my tab">Basic Tab</button>
```

**Examples**

<!-- tabs:start -->

#### **Active State**

**Markdown**

```markdown
<!-- tabs:start -->

#### **Active State**

...

<!-- tabs:end -->
```

**HTML Output**

```html
<button class="docsify-tabs__tab docsify-tabs__tab--active" data-tab="active state">Active State</button>
<div class="docsify-tabs__content" data-tab-content="active state">
  ...
</div>
```

**Custom CSS**

```css
.docsify-tabs__tab--active[data-tab="active state"] {
  box-shadow: none;
  background: #13547a;
  color: white;
}
.docsify-tabs__content[data-tab-content="active state"] {
  background-image: linear-gradient(0deg, #80d0c7 0%, #13547a 100%);
}
.docsify-tabs__content[data-tab-content="active state"] p strong {
  color: white;
}
```

#### **CodePen**

<div class="cp_embed_wrapper">
  <iframe height="400" style="width: 100%;" scrolling="no" title="CSS Device Frames - Demo" src="https://codepen.io/jhildenbiddle/embed/zYzmzqX?default-tab=result&theme-id=light" frameborder="no" loading="lazy" allowtransparency="true" allowfullscreen="true">
    See the Pen <a href="https://codepen.io/jhildenbiddle/pen/zYzmzqX">
    CSS Device Frames - Demo</a> by John Hildenbiddle (<a href="https://codepen.io/jhildenbiddle">@jhildenbiddle</a>)
    on <a href="https://codepen.io">CodePen</a>.
  </iframe>
</div>

**Markdown**

```markdown
<!-- tabs:start -->

#### **CodePen**

CodePen Embed Code...

<!-- tabs:end -->
```

**HTML Output**

```html
<button class="docsify-tabs__tab docsify-tabs__tab--active" data-tab="codepen">CodePen</button>
<div class="docsify-tabs__content" data-tab-content="codepen">
  ...
</div>
```

**Custom CSS**

```css
[data-tab-content="codepen"] .cp_embed_wrapper {
  position: relative;
  top: calc(0px - var(--docsifytabs-content-padding));
  left: calc(0px - var(--docsifytabs-content-padding));
  width: calc(100% + calc(var(--docsifytabs-content-padding) * 2));
  margin-bottom: calc(0px - var(--docsifytabs-content-padding));
}

[data-tab-content="codepen"] .cp_embed_wrapper > * {
  margin: 0;
}
```

#### **Badge**

**Markdown**

```markdown
<!-- tabs:start -->

#### **Badge**

...

<!-- tabs:end -->
```

**Custom CSS**

```css
[data-tab="badge"]:after {
  content: 'New!';
  position: absolute;
  top: 0;
  right: 0;
  transform: translate(35%, -45%);
  padding: 0.25em 0.35em;
  border-radius: 3px;
  background: red;
  color: white;
  font-family: sans-serif;
  font-size: 11px;
  font-weight: bold;
}
```

<!-- tabs:end -->

## Sponsorship

A [sponsorship](https://github.com/sponsors/jhildenbiddle) is more than just a way to show appreciation for the open-source authors and projects we rely on; it can be the spark that ignites the next big idea, the inspiration to create something new, and the motivation to share so that others may benefit.

If you benefit from this project, please consider lending your support and encouraging future efforts by [becoming a sponsor](https://github.com/sponsors/jhildenbiddle).

Thank you! 🙏🏻

<iframe src="https://github.com/sponsors/jhildenbiddle/button" title="Sponsor jhildenbiddle" height="35" width="116" style="border: 0; margin: 0;"></iframe>

## Contact & Support

- Follow 👨🏻‍💻 **@jhildenbiddle** on [Twitter](https://twitter.com/jhildenbiddle) and [GitHub](https://github.com/jhildenbiddle) for announcements
- Create a 💬 [GitHub issue](https://github.com/jhildenbiddle/docsify-tabs/issues) for bug reports, feature requests, or questions
- Add a ⭐️ [star on GitHub](https://github.com/jhildenbiddle/docsify-tabs) and 🐦 [tweet](https://twitter.com/intent/tweet?url=https%3A%2F%2Fgithub.com%2Fjhildenbiddle%2Fdocsify-tabs&hashtags=css,developers,frontend,javascript) to promote the project
- Become a 💖 [sponsor](https://github.com/sponsors/jhildenbiddle) to support the project and future efforts

## License

This project is licensed under the [MIT license](https://github.com/jhildenbiddle/docsify-tabs/blob/master/LICENSE).

Copyright (c) John Hildenbiddle ([@jhildenbiddle](https://twitter.com/jhildenbiddle))
