header-modifier
===============

Firefox extension to modify Request and Response headers

Building
========

```bash
git clone --recursive https://github.com/kafene/header-modifier
cd header-modifier/addon-sdk
git checkout firefox32 # or your target Firefox version
source bin/activate
cd ..

cfx -o run # To run/test the addon before building it
cfx xpi # To build .xpi file
```
