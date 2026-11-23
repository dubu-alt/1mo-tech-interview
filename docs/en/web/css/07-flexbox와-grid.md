---
title: "Flexbox & Grid Layout"
---

This page sums up where and why Flexbox and Grid were each used in the portfolio project, along with a few other CSS design points.

## Where Flexbox Was Used

| Area | Reason |
| --- | --- |
| `.navbar` | Places logo – menu – button left to right on one line (`justify-content: space-between`) |
| `.nav-links` | Lines up menu items side by side horizontally |
| `.hero__actions` | Centers 2 buttons and allows wrapping (`flex-wrap`) |
| `.project-card__meta` | Lists language/star/fork info on one line, pinned to the bottom of the card with `margin-top: auto` |
| `.filter-group` | Lines up filter buttons horizontally and allows wrapping |
| `.footer-content` | Places the copyright text and links on the left and right |

Flexbox was used everywhere that only needed alignment in one direction (horizontal or vertical).

## Where Grid Was Used

| Area | Reason |
| --- | --- |
| `.section-grid` (About, Contact) | Clearly splits the text area and the image/form area into two columns, left and right |
| `.skills-grid` | Places skill cards with `repeat(auto-fit, minmax(240px, 1fr))` so the number of columns adjusts automatically to the screen width |
| `.projects-grid` | Since the number of GitHub API results varies, an `auto-fit` grid that wraps automatically regardless of the number of cards is a good fit |

Grid was chosen wherever multiple cards had to be listed responsively or the screen had to be split into two large areas.

## Other Design Points

- A shared `transition` was applied to buttons and cards so the `translateY` and shadow changes on hover appear smoothly.
- `.reveal` / `.reveal.is-visible` live in `utilities.css` so they are not tied to a particular section and can be reused on any element.

## Summary

| Type | Selection criteria | Where it was used |
| --- | --- | --- |
| Flexbox | When only one-direction (horizontal or vertical) alignment is needed | `.navbar`, `.nav-links`, `.hero__actions`, `.project-card__meta`, `.filter-group`, `.footer-content` |
| Grid | When listing cards responsively or splitting the screen into two large areas | `.section-grid`, `.skills-grid`, `.projects-grid` |
| Other | Hover effects with a shared `transition`, `.reveal` reused from `utilities.css` | Buttons and cards, scroll-reveal elements |

> Source: [Codyssey-B1/B1-1](https://github.com/dubu-alt/Codyssey-B1/tree/main/B1-1)
