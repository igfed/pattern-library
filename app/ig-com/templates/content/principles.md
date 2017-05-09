Principles
================
Every Project demands consistency, and the more avenues we design for, the harder it is to consistently maintain and evolve a brand

## Keep it Simple
* actions easy and frictionless.
* Use plain language and simple sentences.
* Choose clarity over cleverness.
* Create effortless, intuitive interactions that accelerate customer progress. Challenge the complicated and cluttered. Never get in the way of users doing what they came to do.

## Be Helpful
* Help people find the information they need quickly and easily.
* Don't overwhelm readers with unnecessary details.
* Provide context and examples to help readers make smart choices.
* Create clear and intuitive calls to action.

## Be Human
* Use language that's accessible to everyone.
* Use thoughtful, friendly and empowering language.
* Try to sound like a real person rather than a bank.

## Make it Meaningful
Create purposeful experiences that deliver value with intent and precision. Provide useful solutions that users will come to count on.

## Be Practical
Craft experiences that can scale. Synchronize user interactions across multiple touch-points. Push interactions that surprise and delight while still adhering to requirements and regulations.

## Empower People
Anticipate user needs. Create interactions that make it easy for users to make smarter choices.

## Be Human
Respect the customers emotions and needs. Personalize experiences to reflect users unique preferences and behaviors. Support users with reliable service at every step.

## Be Accessible
Ensure your design meets ADA compliance standards. Consider functionality and compatibility with assistive technologies like site readers. Create clear content that can be understood by all users, regardless of literacy level or ability.

# Tech Guidelines
The Pattern library is based on Foundation, a framework focused on responsive, mobile-first web projects in HTML 5. This enables developers to use a single code base that works on multiple devices, including phones, tablets and desktops.

Front-end developers can access the markup examples from the pattern library pages to build responsive, accessible pages with ease.

## USING The pattern library

### Programming Technologies
Developers working on IG projects should be familiar with building and modifying Foundation web projects. Pattern Library component and module developers should also be well-versed in accessibility guidelines and the following programming technologies:

Git (for version control)
npm - Node.js Package Manager (for running build tasks)
Bower - Web Package Manager
Gulp - JavaScript Task Runner
Foundation - HTML 5 Framework
SASS - CSS Extension Language
jQuery - JavaScript library

## MEDIA QUERIES

### Breakpoints
There are 5 pre-defined breakpoints for any layout changes required to adapt to different screen sizes.

| Breakpoint   |      Min Weidth      |  Max Width |
|--------------|:--------------------:|-----------:|
| Small |  0 | 640 |
| Medium |    640   |   1024 |
| Large | 1024 |    1200 |
| XLarge |    1200   |   1440 |
| XXLarge | +1440 |    |

## ACCESSIBILITY

To ensure that IG digital experiences give all users equal access to information and functionality, all digital projects must meet Web Content Accessibility Guidelines (WCAB) 2.0 accessibility requirements with a success criteria level of AA or higher.

As you develop content and user interface components, there are 4 accessibility principles to keep in mind:

### Perceivable
Content must be presented in ways all users can perceive.

* Provide text alternatives to images and other non-text content.
* Make it easy for users to see, hear and distinguish content.
* Use a minimum color contrast ratio of 4.5:1.

### Operable
User interface components and navigation must be operable.

* Provide ways to help users navigate the experience.
* Make all functionality available from a keyboard.

### Understandable
Information and the operation of the user interface must be understandable.

* Ensure all text is readable.
* Build pages with clear and predictable operations.
* Create content with lower literacy levels and learning disabilities in mind.

### Robust
Content must be robust enough to be interpreted reliably by a variety of user agents.

* Make content that’s compatible with the widest range of browsers, devices and assistive technologies.
* More detailed descriptions of these principles and additional accessibility guidelines can be found on the WCAG site.
* See all WCAG 2.0 Standards

## TESTING

Before deploying new content, all pages and components should undergo the following testing protocol. Any defects should be retested until pages or specified components are in compliance with WCAG 2.0 level AA criteria.

### Automated Testing
Automated tests should be conducted during the first round of testing to identify defects that do not require manual testing. Tests should utilize the aXe browser extension and other automated testing tools.

### Manual Testing: Keyboard Only
Manual tests should be conducted using only a keyboard to ensure an equal browsing experience for users without a mouse, trackpad or touch technology.

### Color Contrast Testing: Text on Images
Images containing text should be reviewed to ensure a color contrast ratio of at least 4.5:1 — registered trademarks, service marks and logos notwithstanding.

### Screen Reader Testing
Conduct screen reader functionality testing to ensure assistive technology users have equal access to all content. Use a best-of-3 approach to confirm defects are valid. See recommended browser and software pairings in the supported environments section below.

## SUPPORTED BROWSERS & DEVICES

### Desktop Browsers
* Firefox (latest)
* Chrome (latest)
* Microsoft Edge (latest)
* IE11
* Safari (latest)

### Mobile Browsers & Devices
* Android (Latest):
* iOS latest (Latest Safari):

## RECOMMENDATION
Use the following software and browser pairings for conducting screen reader testing.

* Desktop PC: Firefox and NVDA (latest versions)
* Mobile iOS: Safari and Voiceover