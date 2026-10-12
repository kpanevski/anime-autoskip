CRUNCHYROLL AUTO-SKIP
=====================

Automatically clicks Crunchyroll's "Skip Intro", "Skip Credits" and
"Skip Recap" buttons. You choose which of the three to skip. When an
episode has no skip button, it uses community timings from AniSkip.
It can also start the next episode automatically when one ends.


INSTALL (Chrome, Edge, Brave or any Chromium browser)
-----------------------------------------------------

1. Download the latest crunchyroll-autoskip-vX.Y.Z.zip from
   https://github.com/kpanevski/crunchyroll-autoskip/releases/latest
   and extract it somewhere permanent, for example
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

  Autoplay next episode
                 when an episode ends, start the next one

  Use AniSkip timings when there's no skip button
                 fallback for episodes where Crunchyroll shows no
                 button (see below)

Changes apply immediately, no page reload needed.


NO SKIP BUTTON? (ANISKIP FALLBACK)
----------------------------------

If Crunchyroll shows no skip button but the intro is playing, the
extension looks up community timings on AniSkip (aniskip.com) and
jumps past the segment itself.

- The episode is matched by series/season title through AniList.
  Only exact title matches are used, so it never skips on a guess.
  Episodes it can't match, or that nobody has submitted timings for,
  simply aren't skipped.
- It waits one second into the segment first, so Crunchyroll's own
  button always goes first when there is one.
- Data sent: the show title (to AniList), and the MyAnimeList ID,
  episode number and episode length (to AniSkip). Nothing else.


CHECK THAT IT WORKS
-------------------

Play an episode with an intro. When the "Skip Intro" button appears,
the video should jump past it on its own. To see what fired, press
F12, open the Console tab and look for lines like:

  [CR AutoSkip] skipped intro
  [CR AutoSkip] skipped intro (AniSkip)       <- fallback skip
  [CR AutoSkip] AniSkip: MAL 51009 ep 1 ...   <- fallback lookup


UPDATING
--------

Download the newer zip from the releases page and extract it over the
same folder, replacing the old files. Then go to chrome://extensions,
click the reload icon on the extension's card and reload your
Crunchyroll tab. Your settings are kept.


UNINSTALL
---------

Go to chrome://extensions and click "Remove" on the extension's card.


NOTES
-----

- "Skip credits" jumps past the credits like the real button does.
  With "Autoplay next episode" on, the next episode then starts as
  soon as the current one ends (after any post-credits scene). It uses
  the "Next Episode" link under the player, so after a season's last
  episode it continues wherever that link points, and it stops when
  there is no next episode.
- Chrome may show a "Disable developer mode extensions" warning at
  startup. That's normal for unpacked extensions; click the X to keep
  it running.
