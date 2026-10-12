# Crunchyroll Auto-Skip

A tiny Chrome extension that clicks Crunchyroll's own **Skip Intro**, **Skip Credits** and **Skip Recap** buttons the moment they appear. The toolbar popup lets you choose which ones to auto-skip, and there's a master on/off switch. Settings sync through your Chrome profile.

## Install

1. Open `chrome://extensions` and turn on **Developer mode**.
2. Click **Load unpacked** and select this folder.
3. Pin the extension and use its popup to pick what to skip.

## Notes

- It only clicks the buttons Crunchyroll shows. If an episode has no skip button for a segment, nothing happens.
- "Skip Credits" jumps past the credits like the real button does. Whether the next episode starts depends on Crunchyroll's own Autoplay setting.
- Buttons are recognised by their `data-testid` and label. English is the main target, and common German, French, Spanish, Portuguese, Italian and Russian labels are covered too.
- Each skip is logged to the page console as `[CR AutoSkip] skipped <type>`.
