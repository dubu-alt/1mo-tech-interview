---
title: "CSS Rules and Comments"
---

This page collects the most basic syntax for writing CSS: what a CSS rule looks like, where to put your styles, and how to add comments to your code.

## CSS Rules and Separating Style from Content

You can put styles directly inside an HTML tag, like `style="color: red;"`, but then styles end up scattered across every tag, and later you have to dig through the whole page just to change one color. That's why CSS takes **separating content (HTML) from style (CSS)** as a basic principle. When the code is split up, it's easier to fix, and easier to save and share separately.

### CSS rule = selector + declaration

```css
h3 {
  color: #ffffff;
}
```

- `h3` : the **selector** - "which elements to apply it to"
- `color: #ffffff;` : the **declaration** - "which style to apply"

A declaration always takes the form `property: value;`, with a colon and a semicolon as a pair.

### Where to put your styles

At first it's convenient to put a `<style>` tag inside the HTML document and write CSS in it. But as the code grows, it's common to move it into a separate file (e.g. `style.css`). The file doesn't have to be named `style.css`.

```html
<link rel="stylesheet" href="style.css" />
```

Move what was inside the `<style>` tag into this file, and just load it from the HTML with a `<link>` tag. Save and refresh, and the styles apply just as before.

### TIP: Check with the developer tools

When you select an element in Chrome DevTools, the **Styles tab** shows every CSS rule applied to it. Hover over a selector and you can immediately see which elements on the screen it selects. When studying CSS, don't just guess; get into the habit of always checking the actual applied state in the developer tools.

## Adding CSS Comments

### Comment syntax

```css
/* Zzim (wishlist) button */
.zzim-button {
  font-size: 24px;
  padding: 8px;
}
```

A comment is the part that starts with `/*` and ends with `*/`. It is just a note for whoever reads the code (including your future self) and **has no effect on execution**.

```css
/*
  Market Codeit CSS
  v1.5.0
*/

/* Zzim (wishlist) button */
.zzim-button {
  font-size: 24px;
  padding: 8px; /* temporary value */
}
```

Comments can span multiple lines, or be attached briefly next to a specific line inside a rule like this.

### When should you add comments?

Since comments don't affect execution, you can write as many as you like, but too many actually make code harder to read. I recommend deciding in this order.

1. First, **try renaming the selector so it's easier to understand.**
2. If it still seems hard to understand, then add a comment.

For example, just renaming `.zzim-button` in the code above to `.wishlist-button` makes it clear what the button is for.

```css
.wishlist-button {
  font-size: 24px;
  padding: 8px; /* temporary value */
}
```

If good names make the code explain itself, you don't need to add comments. Think of comments as a supporting tool for "when the name alone isn't enough to explain."

## Summary

| Concept | One-line summary |
|---|---|
| CSS rule | A selector picks the target, a declaration writes the style |
| Separating style and content | Splitting HTML and CSS makes code easier to fix and share |
| Comments | Wrapped in `/* */`, no effect on execution; use only when names can't explain |

> Reference: personal Notion study notes
