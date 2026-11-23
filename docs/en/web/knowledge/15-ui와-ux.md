---
title: "UI and UX"
---

**UI (User Interface) is the set of screen elements users see and touch when using a service, and UX (User Experience) is the overall experience users have from the beginning to the end of using that service.** Most people have heard these terms, but it is easy to get stuck when asked to explain the difference, so this question comes up often in interviews when you mention you have done a web project.

## At a Glance

- **UI is "what you see,"** and **UX is "how it feels to use."**
- Analogy: think of a restaurant. **UI is the design of the menu, the chairs and the spoons**, and **UX is everything you feel from walking in, sitting down, ordering, eating and paying, until you leave**. Even if the menu is pretty, if ordering takes 20 minutes, the UX is bad.
- So UX is a broader concept that includes UI. Good UI is an important ingredient of good UX, but UI alone does not complete UX.

```
┌──────────────────── UX (User Experience) ────────────────────┐
│  Discover service → Sign up → Find feature → Use → Come back │
│                                                              │
│     ┌────────── UI (User Interface) ──────────────────┐      │
│     │  Buttons, colors, fonts, icons, layout, motion  │      │
│     └─────────────────────────────────────────────────┘      │
│  + speed, error messages, support, accessibility, steps ...  │
└──────────────────────────────────────────────────────────────┘
```

## UI (User Interface)

### What UI Includes

The design, layout and technical elements users face directly when using a service.

| Category | Examples |
| --- | --- |
| Visual design | Fonts, colors, line spacing, whitespace, icons |
| Layout | Menu position, card arrangement, rearranging by screen size (responsive) |
| Interaction | How a button reacts when pressed, hover effects, animations |
| Components | Buttons, input fields, dropdowns, modals, toast notifications |

### What Makes Good UI

- **Consistency**: buttons with the same role have the same color, position and shape everywhere. That is why teams build and use a design system (a collection of rules for colors, spacing and components). Managing colors and spacing in one place with CSS variables serves the same purpose. (See [CSS Variables](/en/web/css/06-css-변수).)
- **Easy to take in**: important things look big and bold, less important things look small and light, so the eye flows naturally.
- **Feedback**: pressing a button immediately shows that it was pressed, and saving immediately shows that it was saved.
- **Readability**: there must be enough difference in brightness (contrast) between text and background. We calculate this ourselves in the code example below.

## UX (User eXperience)

### What UX Includes

It is the work of analyzing the experience of the people using a service and designing the flow so they can finish what they want to do **more easily, more quickly and more pleasantly**.

| Category | Examples |
| --- | --- |
| Flow | How many steps sign-up takes, how many taps it takes to reach payment |
| Speed | How long a page takes to appear, how long it takes to react after a button is pressed |
| Error handling | Whether a wrong input tells you what was wrong and why |
| Accessibility | Whether it can be used with only a keyboard, or with a screen reader |
| Context | Whether it is used one-handed on the move, or on a big screen at a desk |

### UX Is Improved with Data

UX is not decided by gut feeling; it keeps changing based on user data and observation.

| Method | Description |
| --- | --- |
| User interviews, surveys | Hearing directly what users find inconvenient |
| Usability testing | Giving real users tasks and observing where they get stuck |
| Behavioral data analysis | Checking at which step many users drop off (funnel) and where they click most (heatmap) |
| A/B testing | Showing two versions to different groups of users and choosing the one with better results |

### The UX Honeycomb: 7 Conditions for a Good Experience

Information architecture expert Peter Morville organized the conditions of a good user experience in the shape of a honeycomb. **Valuable**, in the center, is surrounded by the other six.

![The UX honeycomb: useful, usable, desirable, findable, accessible, credible, valuable](/images/web/ui-ux-honeycomb.png)

*Image source: [Wikimedia Commons](https://commons.wikimedia.org/wiki/File:UX_Honeycomb.png) (CC0)*

| Condition | Meaning |
| --- | --- |
| Useful | Does it solve a problem people actually have? |
| Usable | Can people finish what they want without getting lost? |
| Desirable | Do the design and brand make people want to use it again? |
| Findable | Can people quickly find the menus and information they need? |
| Accessible | Can people with disabilities use it too? |
| Credible | Can the content and the service be trusted? |
| Valuable | Does it provide value to both users and the service operator? |

### A Few UX Design Principles

- **Users should not have to remember things**: save settings chosen before and do not ask again next time.
- **Prevent mistakes, and make them reversible**: ask for confirmation before deleting, or offer an "Undo" button.
- **Follow familiar conventions**: do not break promises like clicking the logo goes home and the magnifying glass icon means search.
- **Let users know they are waiting**: if loading takes a while, show a loading indicator or progress. Waiting without knowing what is happening feels the longest.

## Comparing UI and UX

| Category | UI | UX |
| --- | --- | --- |
| Question | How does it look and how is it operated? | What do users feel while using it, and do they achieve their goal easily? |
| Scope | Screen elements | The whole process of using the service (including experiences off screen) |
| Deliverables | Design mockups, components, style guides | User research findings, user flow diagrams, wireframes, prototypes |
| How it is evaluated | Consistency, readability, visual polish | Task success rate, time taken, drop-off rate, satisfaction |
| Relationship | An important part of UX | A broader concept that includes UI |

> The once-popular analogy "UI is the packaging, UX is the contents" easily gives the wrong impression that the two are separate. UX is the whole experience of opening the package, taking things out, using them and throwing them away afterward, and the packaging (UI) is part of that experience too.

## UX Examples from This Site and a Portfolio

Splitting features you built yourself into UI and UX perspectives makes them easier to understand.

| Feature | UI perspective | UX perspective |
| --- | --- | --- |
| [Responsive Layout and Hamburger Menu](/en/web/features/01-반응형-레이아웃과-햄버거-메뉴) | The arrangement where the menu folds into a button at 768px or below | The menu can be opened one-handed even on a phone, and it closes automatically when a link is tapped, so there is no need for an extra tap. `aria-expanded` lets screen reader users know whether it is open |
| [Dark Mode](/en/web/features/02-다크-모드) | The combination of a dark background and light text colors | On the first visit it follows the OS setting, and once changed it is saved in `localStorage` so it persists on return visits. Users do not have to make the same choice repeatedly |
| [Form Validation](/en/web/features/05-폼-유효성-검사) | Red error messages under the wrong fields | It tells users what is wrong, field by field, before submission, so they do not have to start over. Adding real-time validation while typing makes the UX even better |

## Getting a Feel Through Code: Checking Readability with Numbers

"Readable UI" is not just a feeling; it can be checked with numbers. The web accessibility guidelines (WCAG) require **a contrast ratio of at least 4.5:1** between regular body text and its background (AA level). Let's calculate it for the actual colors from the dark mode article and for a commonly used light gray text.

```python
def luminance(hex_color):
    rgb = [int(hex_color[i:i + 2], 16) / 255 for i in (1, 3, 5)]
    lin = [c / 12.92 if c <= 0.04045 else ((c + 0.055) / 1.055) ** 2.4 for c in rgb]
    return 0.2126 * lin[0] + 0.7152 * lin[1] + 0.0722 * lin[2]

def contrast(fg, bg):
    hi, lo = sorted([luminance(fg), luminance(bg)], reverse=True)
    return (hi + 0.05) / (lo + 0.05)

pairs = [
    ("Light body", "#182230", "#f8fafc"),
    ("Dark body", "#f8fafc", "#0f172a"),
    ("Pale gray", "#aaaaaa", "#ffffff"),
]
for name, fg, bg in pairs:
    r = contrast(fg, bg)
    print(f"{name:10} {fg} on {bg} -> {r:5.2f}:1  {'pass' if r >= 4.5 else 'fail'} (AA threshold 4.5:1)")
```

Output:

```
Light body #182230 on #f8fafc -> 15.32:1  pass (AA threshold 4.5:1)
Dark body  #f8fafc on #0f172a -> 17.06:1  pass (AA threshold 4.5:1)
Pale gray  #aaaaaa on #ffffff ->  2.32:1  fail (AA threshold 4.5:1)
```

- `luminance()` calculates how bright a color looks to the human eye (relative luminance). The human eye is most sensitive to green, so the green value gets the largest weight (0.7152).
- The body text colors of the portfolio's light and dark modes both pass the threshold comfortably.
- Light gray text like `#aaaaaa` on a white background may look stylish, but at 2.32:1 it falls far short of the threshold. This is an example of how good-looking UI is not always good UX. You can also check this contrast value directly in the color picker of the developer tools.

## Interview Questions

**Q. Please explain the difference between UI and UX.**
UI is the screen elements through which users meet a service, such as buttons, colors and layout, and UX is the experience users have throughout the whole process of using the service. UX is the broader concept, and UI is an important part of UX.

**Q. Give an example of good UI but bad UX.**
Picture a sign-up screen with a clean design but 20 input fields, which reports all errors at once only after submission and erases everything entered when an error occurs. It looks nice, but users give up halfway.

**Q. What can developers do for UX?**
Improving loading speed, clearly showing loading and error states, real-time validation while typing, saving user settings, and handling accessibility such as keyboard operation and `aria-*` attributes. Implementing the screens a designer drew while also considering "when the data is empty, when it fails, when it is slow" is how developers contribute to UX.

**Q. How can you tell whether UX has improved?**
Compare metrics such as task success rate, time taken, drop-off rate and conversion rate before and after the change, or check with an A/B test. User interviews and usability testing also reveal inconveniences that numbers do not show.

## Summary

- **UI**: the screen elements users see and operate (fonts, colors, layout, buttons, animations)
- **UX**: the experience from the beginning to the end of using a service (flow, speed, error handling, accessibility)
- UX is a broader concept that includes UI, and it is continuously improved based on data and user observation.
- Good-looking UI is not automatically good UX. Also keep an eye on criteria you can check with numbers, such as contrast ratio.
