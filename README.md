# the frontend 

The frontend is based on [Nativescript](https://www.nativescript.org/nativescript-is-how-you-build-native-mobile-apps-with-angular) with Angular and Typescript. 

Our primary development platform has been an Android based Nexus Huawei 6P. Development and testing time with iOS based devices has been limited due to a lack of devices in our team. 

You'll find an .apk and ios version of the app inside this repository as well as all required data to build the app yourself.
The pre-built files assume your server to be the localhost and reachable on the port '12345'. 

For the .apk version you need to move the file onto your device by whatever means are at your hand (sharing via google drive works for example). Then, on your Android device you can just open and install the app via the .apk file. 

About the iOS version: ...

## how to install

**Heads Up:** Based on our own experience we do not recommend to setup Nativescript etc. on a Windows based machine and can't provide any kind of installation guidance.

The official Nativescript CLI Setup: [Here](https://docs.nativescript.org/start/quick-setup)

If you do **not** want to run the backend on 

If you run into any kind of installation problems after setting up Nativescript run: 'tns doctor'
Do NOT run any npm commands with su or sudo - it will cause major conflicts further down the line. Same applies to an installation of npm / node.js - you will need to re-do its installation from scratch if previously installed as admin.

Linux or Windows based machines can **not** build the app for iOS.

### Linux
- the official guide first: [Here](https://docs.nativescript.org/start/ns-setup-linux)
- connect your development enabled Android based device to your machine 
- run 'tns devices' to see whether your devices is listed as 'connected'
- download the repo and open the folder inside your terminal, enter: 'tns run android'
- if you run into issues run 'tns doctor'

### Mac 
- the official guide first: [Here](https://docs.nativescript.org/start/ns-setup-os-x)
- ...


## the structure

The stucture is based on the angular style guide. Each component which is usually a website is situated inside its own folder. A component folder contains a typescript file (.ts), an html file (.html) and a css file (.scss). Central functions as functions that work with the REST api are usually seperated inside services. Services like other shared functions, data models and e.g. interceptors are saved inside the 'shared' folder. 

The app structure in its routing and modularity is based on [Adjenkov's](https://github.com/ADjenkov/login-tabs-ng) GitHub repository. The nativescript tabview usually doesn't allow for preceding components which is a known issue. This decision to use Adjenkov's workaround is based upon the [recommendation](https://github.com/NativeScript/nativescript-angular/issues/1351#issuecomment-442052212) of a Nativescript employee in said issue.

The workaround results in us using 'tns-core-modules: next' and 'nativescript-angular: next' as well as an more split up modules.ts approach. Each main component that is part of the tabview got its own module.ts which if existing allows to route to further nested children. This nesting structure forced us to outsource 'tns-core-modules/application-settings' (which is similiar to localStorage) to a service since the nested view doesn't allow certain components to communcicate with each other directly.

`tree -I 'node_modules|hooks|platforms|App_Resources|*.js|*.scss|fonts'`
```
.
├── app
│   ├── app.component.html
│   ├── app.component.ts
│   ├── app.css
│   ├── app.module.ts
│   ├── app-routing.module.ts
│   ├── calendar
│   │   ├── calendar.component.html
│   │   ├── calendar.component.ts
│   │   └── calendar.module.ts
│   ├── chat
│   │   ├── chat.component.html
│   │   ├── chat.component.ts
│   │   └── chat.module.ts
│   ├── chat-detail
│   │   ├── chat.detail.component.html
│   │   └── chat.detail.component.ts
│   ├── filterItems
│   │   ├── filterItems.component.html
│   │   └── filterItems.component.ts
│   ├── henquiry
│   │   ├── henquiry.component.html
│   │   ├── henquiry.component.ts
│   │   └── henquiry.module.ts
│   ├── henquiry-detail
│   │   ├── henquiry.detail.component.html
│   │   └── henquiry.detail.component.ts
│   ├── item
│   │   ├── items.component.html
│   │   ├── items.component.ts
│   │   └── items.module.ts
│   ├── login
│   │   ├── login.component.html
│   │   └── login.component.ts
│   ├── main.ts
│   ├── navigation
│   │   ├── navigation.component.html
│   │   ├── navigation.component.ts
│   │   └── navigation.module.ts
│   ├── package.json
│   ├── profile
│   │   ├── profile.component.html
│   │   ├── profile.component.ts
│   │   └── profile.module.ts
│   ├── rating
│   │   ├── rating.component.html
│   │   └── rating.component.ts
│   ├── register
│   │   ├── register.component.html
│   │   └── register.component.ts
│   ├── shared
│   │   ├── config.ts
│   │   ├── helper
│   │   │   └── token.interceptor.ts
│   │   ├── models
│   │   │   ├── item.ts
│   │   │   └── user.ts
│   │   └── services
│   │       ├── alert.service.ts
│   │       ├── appsettings.service.ts
│   │       ├── authentication.service.ts
│   │       ├── calendar.service.ts
│   │       ├── chat.service.ts
│   │       ├── data.service.ts
│   │       ├── item.service.ts
│   │       └── profile.service.ts
│   ├── verification
│   │   ├── verification.component.html
│   │   └── verification.component.ts
│   └── welcome
│       ├── welcome.component.html
│       └── welcome.component.ts
├── package.json
├── package-lock.json
├── readme.md
├── references.d.ts
├── tsconfig.json
└── tsconfig.tns.json
```
