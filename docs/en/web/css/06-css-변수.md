---
title: "CSS Variables"
---

In `base.css`, the `:root` defines colors, fonts, spacing, radius, shadows and transition values as variables. Dark mode doesn't build a separate color system; instead, it reassigns different values to **the same variable names** inside the `[data-theme="dark"]` selector. As a result, the rest of the CSS for buttons, cards, forms and so on doesn't need to know anything about dark mode: as soon as the variable values change, the colors of the whole screen follow automatically.

## Combining with color-mix()

The variables were not only used on their own but also together with `color-mix()`.

- By combining CSS variables with `color-mix()`, as in `color-mix(in srgb, var(--color-primary) 22%, transparent)`, shadow and background gradient colors also follow automatically when switching between dark and light mode.

## Summary

| Item | Details |
| --- | --- |
| Where variables are defined | `:root` in `base.css` (colors, fonts, spacing, radius, shadows, transition) |
| Dark mode | Reassigns different values to the same variable names inside `[data-theme="dark"]` |
| Effect | The rest of the CSS doesn't need to know about dark mode; colors follow when variable values change |
| Combining with `color-mix()` | Shadow and background gradient colors also follow mode switches automatically |

> Source: [Codyssey-B1/B1-1](https://github.com/dubu-alt/Codyssey-B1/tree/main/B1-1)
