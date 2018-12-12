import { Injectable } from "@angular/core";
import * as util from "tns-core-modules/application-settings";

@Injectable()
export class AppSettingsService {

    // make applicationSettings visible to the entire nested enviroment

    setUser(key, value) {
        util.setString(key, value);
    }

    getUser(key) {
        return util.getString(key);
    }

    removeUser(key) {
        if (util.hasKey(key)) {
            util.remove(key);
        }
    }
}
