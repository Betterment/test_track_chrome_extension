# TestTrack Chrome Extension

This extension allows your team to opt in/out of TestTrack splits
from their web browsers. It's designed to be distributed as a private
Chrome extension via the chrome store that only your team can use.

## First things first

Before using the Chrome Extension, you must have provisioned a
[TestTrack server](https://github.com/Betterment/test_track) and
configured either the [TestTrack JavaScript
client](https://github.com/Betterment/test_track_js_client) or the
[TestTrack Rails
client](https://github.com/Betterment/test_track_rails_client) within
your web app. Once you're up and running with split tests and feature
gates within your app, the chrome extension will make it easier for your
team to test out different configurations on their machines.

## Building the extension

1. Run `npm install` to get the necessary dependencies to build the
   chrome extension.
1. Run `grunt ensureconfig`. This task will generate three files in
   `test_track_chrome_extension/etc` that you *should not* commit to
source control.
1. Copy down the `BROWSER_EXTENSION_SHARED_SECRET` and configure your
   TestTrack server with an environment variable of that same name
   and value so that the Chrome extension can authenticate.
1. Edit `etc/domains.json` to include any domains you'd like to enable
   TestTrack on. It starts out enabled on \*.dev and \*.test for compatibility
   with [pow](http://pow.cx).
1. Run `grunt`. This will build an `unpackaged_extension` and a
   `.zip` file within `dist`. The `.zip` file is suitable for upload to
the Chrome Store Developer Dashboard for distribution to your Google
Apps organization. *Note: it is not advised that you release your
Chrome Extension publicly because it contains the secret specific to
your organization. The secret could be used to override any split
assignment on your TestTrack server.*

## Running locally

1. Uninstall the production extension if you have it
    1. Open chrome://extensions/
    1. Delete the `Test Track` plugin
    1. Install the test extension
1. Open chrome://extensions/
    1. Click `Developer mode`
    1. Click the `Load unpacked extension...`
    1. Select the
       `src/test_track_chrome_extension/dist/unpacked_extension` folder
1. To debug
    1. Open the extension
    1. Right click and inspect
    1. Navigate to the `sources` tab and set your breakpoint(s)
    1. Navigate to the `console` tab and run `location.reload(true)`
        1. This will re-initialize the extension and hit your breakpoint

## Uploading to the chrome store

Once the chrome extension is working for you from a local install, you
can upload `dist/test_track.zip` to the
[Chrome Web Store Developer Dashboard](https://chrome.google.com/webstore/developer/dashboard)
from your Google Apps account. Again, be careful to only distribute your
chrome extension to your company because your shared secret allows
users to override their split assignments.

Note that chrome extensions installed via the Chrome Web Store will
automatically upgrade whenever a newer version becomes available, which
is great for your team if you add a new domain in the future or need to
cycle your shared secret.


## Useful grunt tasks

* `grunt` - builds fresh files in `dist` from your current `src` and
  `etc` settings.
* `grunt cyclesecret` - generates a brand new shared secret and bumps
  the version number. This is useful if you're concerned that a third
party has gained access to your shared secret. Just update your
TestTrack server with the new value and deploy the new version to the
chrome store, and you're good to go.
* `grunt bumpversion` - bumps the version number and builds a fresh
  distribution. This is useful if you've modified your `domains.json`
file to add a new domain and need to deploy the change to clients in the
field.

## How to Contribute

We would love for you to contribute! Anything that benefits the majority of `test_track` users—from a documentation fix to an entirely new feature—is encouraged.

Before diving in, [check our issue tracker](//github.com/Betterment/test_track_chrome_extension/issues) and consider creating a new issue to get early feedback on your proposed change.

### Suggested Workflow

* Fork the project and create a new branch.
* Write your contribution.
* Test it out and make sure it works locally (see above).
* Submit a pull request.
