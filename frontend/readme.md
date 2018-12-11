after running tns test android you'll run into a bug when using tns run android

following command helps:
tns platform remove android && tns platform add android && tns run android

related github issue:
https://github.com/NativeScript/nativescript-cli/issues/3146
