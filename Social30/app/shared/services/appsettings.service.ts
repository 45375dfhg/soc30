import { Injectable } from "@angular/core";
import * as util from "tns-core-modules/application-settings";

@Injectable()
export class AppSettingsService {

    // if you wonder why this service exists -
    // well you either rewrite appSettings into a service
    // or you'll die trying to pipe the appSetting values thru the app
    // your choice really

    setUser(key, value) {
        util.setString(key, value);
    }

    getUser(key) {
        return util.getString(key);
    }

    removeUser(key) {
        util.remove('currentUser');
    }
}
