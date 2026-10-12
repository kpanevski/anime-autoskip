CRUNCHYROLL AUTO-SKIP
=====================

Automatically clicks Crunchyroll's "Skip Intro", "Skip Credits" and
"Skip Recap" buttons. You choose which of the three to skip.


INSTALL (Chrome, Edge, Brave or any Chromium browser)
-----------------------------------------------------

1. Put this folder somewhere permanent, for example
   C:\Users\<you>\Documents\crunchyroll-autoskip
   (Chrome loads the extension from this folder, so don't delete or
   move it afterwards.)

2. Open a new tab and go to:  chrome://extensions
   (Edge: edge://extensions   Brave: brave://extensions)

3. Turn on "Developer mode" (toggle in the top-right corner).

4. Click "Load unpacked" and select this folder (the one that
   contains manifest.json).

5. "Crunchyroll Auto-Skip" now appears in the list. Click the puzzle
   icon in the toolbar and pin it so the settings are one click away.

6. If you already had a Crunchyroll tab open, reload it.


SETTINGS
--------

Click the extension icon in the toolbar:

  Enabled        master on/off switch
  Skip intro     skip openings
  Skip credits   skip endings
  Skip recap     skip "previously on" recaps

Changes apply immediately, no page reload needed.


CHECK THAT IT WORKS
-------------------

Play an episode with an intro. When the "Skip Intro" button appears,
the video should jump past it on its own. To see what fired, press
F12, open the Console tab and look for lines like:

  [CR AutoSkip] skipped intro


UPDATING
--------

After changing or replacing the files in this folder, go to
chrome://extensions and click the reload icon on the extension's card,
then reload your Crunchyroll tab.


UNINSTALL
---------

Go to chrome://extensions and click "Remove" on the extension's card.


NOTES
-----

- It only clicks buttons Crunchyroll actually shows. If an episode has
  no skip button for a segment, nothing happens.
- "Skip credits" jumps past the credits like the real button does.
  Whether the next episode starts is up to Crunchyroll's own Autoplay
  setting.
- Chrome may show a "Disable developer mode extensions" warning at
  startup. That's normal for unpacked extensions; click the X to keep
  it running.
