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
