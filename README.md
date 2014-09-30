header-modifier
===============

Firefox extension to modify Request and Response headers

As far as I know there are no other extensions that allow you to easily
modify response headers, at least none which are compatible with FF32+.

There are better extensions to modify the request headers, but since it was
trivial to implement, this does have the ability to do so.

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

To-do
=====

* Allow modifying headers on a per-site basis.
* Allow merging with existing headers instead of overwriting.
