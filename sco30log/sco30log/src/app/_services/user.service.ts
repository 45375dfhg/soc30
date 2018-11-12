import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { User } from '../_models';

@Injectable()
export class UserService {
    constructor(private http: HttpClient) { }

    getAll() {
        return this.http.get<User[]>(`localhost:4000/users/`);
    }

    getById(id: number) {
        return this.http.get(`localhost:4000/users/` + id);
    }

    register(user: User) {
        return this.http.post(`localhost:4000/users/`, user);
    }

    update(user: User) {
        return this.http.put(`localhost:4000/users/` + user.id, user);
    }

    delete(id: number) {
        return this.http.delete(`localhost:4000/users/` + id);
    }
}