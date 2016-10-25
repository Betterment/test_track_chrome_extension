{
  "name": "Test Track",
  "version": "/* @exec getVersion() */",
  "description": "View and re-assign visitors to splits.",
  "permissions": [
    "activeTab",
    "declarativeContent",
    /* @exec getUrls() */
  ],
  "icons": {
    "16": "icon16.png",
    "32": "icon32.png",
    "48": "icon48.png",
    "64": "icon64.png",
    "128": "icon128.png"
  },
  "background": {
    "scripts": [
      "background.js"
    ],
    "persistent": false
  },
  "content_scripts": [
    {
      "matches": [
        /* @exec getUrls() */
      ],
      "js": [
        "content.js"
      ]
    }
  ],
  "web_accessible_resources": [
    "eventBus.js"
  ],
  "page_action": {
    "default_title": "Test Track",
    "default_icon": "icon64.png",
    "default_popup": "popup.html"
  },
  "manifest_version": 2,
  "content_security_policy": "script-src 'self' https://ajax.googleapis.com; object-src 'self'",
  "incognito": "split"
}
