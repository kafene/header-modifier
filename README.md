header-modifier
===============

Firefox extension to modify Request and Response headers

Building
========

This includes instructions to install the [addon-sdk](https://github.com/mozilla/addon-sdk). If `cfx` it's already somewhere in your PATH then you don't have to do this.

```bash
git clone https://github.com/kafene/header-modifier
cd header-modifier
git clone https://github.com/mozilla/addon-sdk
cd addon-sdk
git checkout firefox32 # your target Firefox version
source bin/activate
cd ..

cfx -o run # To run/test the addon before building it
cfx xpi # To build .xpi file
```

Config
======

You can edit the add-on preferences in `about:addons`

There are two preferences - one for request headers and one for response headers.
Each is a JSON string like so:

```json
{"Access-Control-Allow-Origin": "*", "Access-Control-Allow-Methods": "POST,GET"}
```

That, placed in the "Response Header Modifications" field, would add CORS headers to every site.

Or, for example, to remove the User-Agent header, set the "Request Header Modifications" to:

```json
{"User-Agent": ""}
```
