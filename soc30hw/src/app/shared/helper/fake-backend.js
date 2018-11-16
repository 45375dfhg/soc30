"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var http_1 = require("@angular/common/http");
var rxjs_1 = require("rxjs");
var operators_1 = require("rxjs/operators");
var FakeBackendInterceptor = /** @class */ (function () {
    function FakeBackendInterceptor() {
    }
    FakeBackendInterceptor.prototype.intercept = function (request, next) {
        // array in local storage for registered users
        var users = JSON.parse(localStorage.getItem('users')) || [];
        // wrap in delayed observable to simulate server api call
        return rxjs_1.of(null).pipe(operators_1.mergeMap(function () {
            // authenticate
            if (request.url.endsWith('/users/authenticate') && request.method === 'POST') {
                // find if any user matches login credentials
                var filteredUsers = users.filter(function (user) {
                    return user.username === request.body.username && user.password === request.body.password;
                });
                if (filteredUsers.length) {
                    // if login details are valid return 200 OK with user details and fake jwt token
                    var user = filteredUsers[0];
                    var body = {
                        id: user.id,
                        username: user.username,
                        firstName: user.firstName,
                        lastName: user.lastName,
                        token: 'fake-jwt-token'
                    };
                    return rxjs_1.of(new http_1.HttpResponse({ status: 200, body: body }));
                }
                else {
                    // else return 400 bad request
                    return rxjs_1.throwError({ error: { message: 'Username or password is incorrect' } });
                }
            }
            // get users
            if (request.url.endsWith('/users') && request.method === 'GET') {
                // check for fake auth token in header and return users if valid, this security is implemented server side in a real application
                if (request.headers.get('Authorization') === 'Bearer fake-jwt-token') {
                    return rxjs_1.of(new http_1.HttpResponse({ status: 200, body: users }));
                }
                else {
                    // return 401 not authorised if token is null or invalid
                    return rxjs_1.throwError({ status: 401, error: { message: 'Unauthorised' } });
                }
            }
            // get user by id
            if (request.url.match(/\/users\/\d+$/) && request.method === 'GET') {
                // check for fake auth token in header and return user if valid, this security is implemented server side in a real application
                if (request.headers.get('Authorization') === 'Bearer fake-jwt-token') {
                    // find user by id in users array
                    var urlParts = request.url.split('/');
                    var id_1 = parseInt(urlParts[urlParts.length - 1]);
                    var matchedUsers = users.filter(function (user) { return user.id === id_1; });
                    var user = matchedUsers.length ? matchedUsers[0] : null;
                    return rxjs_1.of(new http_1.HttpResponse({ status: 200, body: user }));
                }
                else {
                    // return 401 not authorised if token is null or invalid
                    return rxjs_1.throwError({ status: 401, error: { message: 'Unauthorised' } });
                }
            }
            // register user
            if (request.url.endsWith('/users/register') && request.method === 'POST') {
                // get new user object from post body
                var newUser_1 = request.body;
                // validation
                var duplicateUser = users.filter(function (user) { return user.username === newUser_1.username; }).length;
                if (duplicateUser) {
                    return rxjs_1.throwError({ error: { message: 'Username "' + newUser_1.username + '" is already taken' } });
                }
                // save new user
                newUser_1.id = users.length + 1;
                users.push(newUser_1);
                localStorage.setItem('users', JSON.stringify(users));
                // respond 200 OK
                return rxjs_1.of(new http_1.HttpResponse({ status: 200 }));
            }
            // delete user
            if (request.url.match(/\/users\/\d+$/) && request.method === 'DELETE') {
                // check for fake auth token in header and return user if valid, this security is implemented server side in a real application
                if (request.headers.get('Authorization') === 'Bearer fake-jwt-token') {
                    // find user by id in users array
                    var urlParts = request.url.split('/');
                    var id = parseInt(urlParts[urlParts.length - 1]);
                    for (var i = 0; i < users.length; i++) {
                        var user = users[i];
                        if (user.id === id) {
                            // delete user
                            users.splice(i, 1);
                            localStorage.setItem('users', JSON.stringify(users));
                            break;
                        }
                    }
                    // respond 200 OK
                    return rxjs_1.of(new http_1.HttpResponse({ status: 200 }));
                }
                else {
                    // return 401 not authorised if token is null or invalid
                    return rxjs_1.throwError({ status: 401, error: { message: 'Unauthorised' } });
                }
            }
            // pass through any requests not handled above
            return next.handle(request);
        }))
            .pipe(operators_1.materialize())
            .pipe(operators_1.delay(500))
            .pipe(operators_1.dematerialize());
    };
    FakeBackendInterceptor = __decorate([
        core_1.Injectable(),
        __metadata("design:paramtypes", [])
    ], FakeBackendInterceptor);
    return FakeBackendInterceptor;
}());
exports.FakeBackendInterceptor = FakeBackendInterceptor;
exports.fakeBackendProvider = {
    // use fake backend in place of Http service for backend-less development
    provide: http_1.HTTP_INTERCEPTORS,
    useClass: FakeBackendInterceptor,
    multi: true
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZmFrZS1iYWNrZW5kLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiZmFrZS1iYWNrZW5kLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsc0NBQTJDO0FBQzNDLDZDQUE2SDtBQUM3SCw2QkFBa0Q7QUFDbEQsNENBQTZFO0FBRzdFO0lBRUk7SUFBZ0IsQ0FBQztJQUVqQiwwQ0FBUyxHQUFULFVBQVUsT0FBeUIsRUFBRSxJQUFpQjtRQUNsRCw4Q0FBOEM7UUFDOUMsSUFBSSxLQUFLLEdBQVUsSUFBSSxDQUFDLEtBQUssQ0FBQyxZQUFZLENBQUMsT0FBTyxDQUFDLE9BQU8sQ0FBQyxDQUFDLElBQUksRUFBRSxDQUFDO1FBRW5FLHlEQUF5RDtRQUN6RCxNQUFNLENBQUMsU0FBRSxDQUFDLElBQUksQ0FBQyxDQUFDLElBQUksQ0FBQyxvQkFBUSxDQUFDO1lBRTFCLGVBQWU7WUFDZixFQUFFLENBQUMsQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLFFBQVEsQ0FBQyxxQkFBcUIsQ0FBQyxJQUFJLE9BQU8sQ0FBQyxNQUFNLEtBQUssTUFBTSxDQUFDLENBQUMsQ0FBQztnQkFDM0UsNkNBQTZDO2dCQUM3QyxJQUFJLGFBQWEsR0FBRyxLQUFLLENBQUMsTUFBTSxDQUFDLFVBQUEsSUFBSTtvQkFDakMsTUFBTSxDQUFDLElBQUksQ0FBQyxRQUFRLEtBQUssT0FBTyxDQUFDLElBQUksQ0FBQyxRQUFRLElBQUksSUFBSSxDQUFDLFFBQVEsS0FBSyxPQUFPLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQztnQkFDOUYsQ0FBQyxDQUFDLENBQUM7Z0JBRUgsRUFBRSxDQUFDLENBQUMsYUFBYSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUM7b0JBQ3ZCLGdGQUFnRjtvQkFDaEYsSUFBSSxJQUFJLEdBQUcsYUFBYSxDQUFDLENBQUMsQ0FBQyxDQUFDO29CQUM1QixJQUFJLElBQUksR0FBRzt3QkFDUCxFQUFFLEVBQUUsSUFBSSxDQUFDLEVBQUU7d0JBQ1gsUUFBUSxF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QUFNLENBQUMsT0FBTyxDQUFDLENBQUM7UUFFaEMsQ0FBQyxDQUFDLENBQUM7YUFHRixJQUFJLENBQUMsdUJBQVcsRUFBRSxDQUFDO2FBQ25CLElBQUksQ0FBQyxpQkFBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDO2FBQ2hCLElBQUksQ0FBQyx5QkFBYSxFQUFFLENBQUMsQ0FBQztJQUMzQixDQUFDO0lBdEhRLHNCQUFzQjtRQURsQyxpQkFBVSxFQUFFOztPQUNBLHNCQUFzQixDQXVIbEM7SUFBRCw2QkFBQztDQUFBLEFBdkhELElBdUhDO0FBdkhZLHdEQUFzQjtBQXlIeEIsUUFBQSxtQkFBbUIsR0FBRztJQUM3Qix5RUFBeUU7SUFDekUsT0FBTyxFQUFFLHdCQUFpQjtJQUMxQixRQUFRLEVBQUUsc0JBQXNCO0lBQ2hDLEtBQUssRUFBRSxJQUFJO0NBQ2QsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IEluamVjdGFibGUgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IEh0dHBSZXF1ZXN0LCBIdHRwUmVzcG9uc2UsIEh0dHBIYW5kbGVyLCBIdHRwRXZlbnQsIEh0dHBJbnRlcmNlcHRvciwgSFRUUF9JTlRFUkNFUFRPUlMgfSBmcm9tICdAYW5ndWxhci9jb21tb24vaHR0cCc7XG5pbXBvcnQgeyBPYnNlcnZhYmxlLCBvZiwgdGhyb3dFcnJvciB9IGZyb20gJ3J4anMnO1xuaW1wb3J0IHsgZGVsYXksIG1lcmdlTWFwLCBtYXRlcmlhbGl6ZSwgZGVtYXRlcmlhbGl6ZSB9IGZyb20gJ3J4anMvb3BlcmF0b3JzJztcblxuQEluamVjdGFibGUoKVxuZXhwb3J0IGNsYXNzIEZha2VCYWNrZW5kSW50ZXJjZXB0b3IgaW1wbGVtZW50cyBIdHRwSW50ZXJjZXB0b3Ige1xuXG4gICAgY29uc3RydWN0b3IoKSB7IH1cblxuICAgIGludGVyY2VwdChyZXF1ZXN0OiBIdHRwUmVxdWVzdDxhbnk+LCBuZXh0OiBIdHRwSGFuZGxlcik6IE9ic2VydmFibGU8SHR0cEV2ZW50PGFueT4+IHtcbiAgICAgICAgLy8gYXJyYXkgaW4gbG9jYWwgc3RvcmFnZSBmb3IgcmVnaXN0ZXJlZCB1c2Vyc1xuICAgICAgICBsZXQgdXNlcnM6IGFueVtdID0gSlNPTi5wYXJzZShsb2NhbFN0b3JhZ2UuZ2V0SXRlbSgndXNlcnMnKSkgfHwgW107XG5cbiAgICAgICAgLy8gd3JhcCBpbiBkZWxheWVkIG9ic2VydmFibGUgdG8gc2ltdWxhdGUgc2VydmVyIGFwaSBjYWxsXG4gICAgICAgIHJldHVybiBvZihudWxsKS5waXBlKG1lcmdlTWFwKCgpID0+IHtcblxuICAgICAgICAgICAgLy8gYXV0aGVudGljYXRlXG4gICAgICAgICAgICBpZiAocmVxdWVzdC51cmwuZW5kc1dpdGgoJy91c2Vycy9hdXRoZW50aWNhdGUnKSAmJiByZXF1ZXN0Lm1ldGhvZCA9PT0gJ1BPU1QnKSB7XG4gICAgICAgICAgICAgICAgLy8gZmluZCBpZiBhbnkgdXNlciBtYXRjaGVzIGxvZ2luIGNyZWRlbnRpYWxzXG4gICAgICAgICAgICAgICAgbGV0IGZpbHRlcmVkVXNlcnMgPSB1c2Vycy5maWx0ZXIodXNlciA9PiB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB1c2VyLnVzZXJuYW1lID09PSByZXF1ZXN0LmJvZHkudXNlcm5hbWUgJiYgdXNlci5wYXNzd29yZCA9PT0gcmVxdWVzdC5ib2R5LnBhc3N3b3JkO1xuICAgICAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAgICAgaWYgKGZpbHRlcmVkVXNlcnMubGVuZ3RoKSB7XG4gICAgICAgICAgICAgICAgICAgIC8vIGlmIGxvZ2luIGRldGFpbHMgYXJlIHZhbGlkIHJldHVybiAyMDAgT0sgd2l0aCB1c2VyIGRldGFpbHMgYW5kIGZha2Ugand0IHRva2VuXG4gICAgICAgICAgICAgICAgICAgIGxldCB1c2VyID0gZmlsdGVyZWRVc2Vyc1swXTtcbiAgICAgICAgICAgICAgICAgICAgbGV0IGJvZHkgPSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZDogdXNlci5pZCxcbiAgICAgICAgICAgICAgICAgICAgICAgIHVzZXJuYW1lOiB1c2VyLnVzZXJuYW1lLFxuICAgICAgICAgICAgICAgICAgICAgICAgZmlyc3ROYW1lOiB1c2VyLmZpcnN0TmFtZSxcbiAgICAgICAgICAgICAgICAgICAgICAgIGxhc3ROYW1lOiB1c2VyLmxhc3ROYW1lLFxuICAgICAgICAgICAgICAgICAgICAgICAgdG9rZW46ICdmYWtlLWp3dC10b2tlbidcbiAgICAgICAgICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gb2YobmV3IEh0dHBSZXNwb25zZSh7IHN0YXR1czogMjAwLCBib2R5OiBib2R5IH0pKTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAvLyBlbHNlIHJldHVybiA0MDAgYmFkIHJlcXVlc3RcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRocm93RXJyb3IoeyBlcnJvcjogeyBtZXNzYWdlOiAnVXNlcm5hbWUgb3IgcGFzc3dvcmQgaXMgaW5jb3JyZWN0JyB9IH0pO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLy8gZ2V0IHVzZXJzXG4gICAgICAgICAgICBpZiAocmVxdWVzdC51cmwuZW5kc1dpdGgoJy91c2VycycpICYmIHJlcXVlc3QubWV0aG9kID09PSAnR0VUJykge1xuICAgICAgICAgICAgICAgIC8vIGNoZWNrIGZvciBmYWtlIGF1dGggdG9rZW4gaW4gaGVhZGVyIGFuZCByZXR1cm4gdXNlcnMgaWYgdmFsaWQsIHRoaXMgc2VjdXJpdHkgaXMgaW1wbGVtZW50ZWQgc2VydmVyIHNpZGUgaW4gYSByZWFsIGFwcGxpY2F0aW9uXG4gICAgICAgICAgICAgICAgaWYgKHJlcXVlc3QuaGVhZGVycy5nZXQoJ0F1dGhvcml6YXRpb24nKSA9PT0gJ0JlYXJlciBmYWtlLWp3dC10b2tlbicpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIG9mKG5ldyBIdHRwUmVzcG9uc2UoeyBzdGF0dXM6IDIwMCwgYm9keTogdXNlcnMgfSkpO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIC8vIHJldHVybiA0MDEgbm90IGF1dGhvcmlzZWQgaWYgdG9rZW4gaXMgbnVsbCBvciBpbnZhbGlkXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB0aHJvd0Vycm9yKHsgc3RhdHVzOiA0MDEsIGVycm9yOiB7IG1lc3NhZ2U6ICdVbmF1dGhvcmlzZWQnIH0gfSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAvLyBnZXQgdXNlciBieSBpZFxuICAgICAgICAgICAgaWYgKHJlcXVlc3QudXJsLm1hdGNoKC9cXC91c2Vyc1xcL1xcZCskLykgJiYgcmVxdWVzdC5tZXRob2QgPT09ICdHRVQnKSB7XG4gICAgICAgICAgICAgICAgLy8gY2hlY2sgZm9yIGZha2UgYXV0aCB0b2tlbiBpbiBoZWFkZXIgYW5kIHJldHVybiB1c2VyIGlmIHZhbGlkLCB0aGlzIHNlY3VyaXR5IGlzIGltcGxlbWVudGVkIHNlcnZlciBzaWRlIGluIGEgcmVhbCBhcHBsaWNhdGlvblxuICAgICAgICAgICAgICAgIGlmIChyZXF1ZXN0LmhlYWRlcnMuZ2V0KCdBdXRob3JpemF0aW9uJykgPT09ICdCZWFyZXIgZmFrZS1qd3QtdG9rZW4nKSB7XG4gICAgICAgICAgICAgICAgICAgIC8vIGZpbmQgdXNlciBieSBpZCBpbiB1c2VycyBhcnJheVxuICAgICAgICAgICAgICAgICAgICBsZXQgdXJsUGFydHMgPSByZXF1ZXN0LnVybC5zcGxpdCgnLycpO1xuICAgICAgICAgICAgICAgICAgICBsZXQgaWQgPSBwYXJzZUludCh1cmxQYXJ0c1t1cmxQYXJ0cy5sZW5ndGggLSAxXSk7XG4gICAgICAgICAgICAgICAgICAgIGxldCBtYXRjaGVkVXNlcnMgPSB1c2Vycy5maWx0ZXIodXNlciA9PiB7IHJldHVybiB1c2VyLmlkID09PSBpZDsgfSk7XG4gICAgICAgICAgICAgICAgICAgIGxldCB1c2VyID0gbWF0Y2hlZFVzZXJzLmxlbmd0aCA/IG1hdGNoZWRVc2Vyc1swXSA6IG51bGw7XG5cbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIG9mKG5ldyBIdHRwUmVzcG9uc2UoeyBzdGF0dXM6IDIwMCwgYm9keTogdXNlciB9KSk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgLy8gcmV0dXJuIDQwMSBub3QgYXV0aG9yaXNlZCBpZiB0b2tlbiBpcyBudWxsIG9yIGludmFsaWRcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRocm93RXJyb3IoeyBzdGF0dXM6IDQwMSwgZXJyb3I6IHsgbWVzc2FnZTogJ1VuYXV0aG9yaXNlZCcgfSB9KTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIC8vIHJlZ2lzdGVyIHVzZXJcbiAgICAgICAgICAgIGlmIChyZXF1ZXN0LnVybC5lbmRzV2l0aCgnL3VzZXJzL3JlZ2lzdGVyJykgJiYgcmVxdWVzdC5tZXRob2QgPT09ICdQT1NUJykge1xuICAgICAgICAgICAgICAgIC8vIGdldCBuZXcgdXNlciBvYmplY3QgZnJvbSBwb3N0IGJvZHlcbiAgICAgICAgICAgICAgICBsZXQgbmV3VXNlciA9IHJlcXVlc3QuYm9keTtcblxuICAgICAgICAgICAgICAgIC8vIHZhbGlkYXRpb25cbiAgICAgICAgICAgICAgICBsZXQgZHVwbGljYXRlVXNlciA9IHVzZXJzLmZpbHRlcih1c2VyID0+IHsgcmV0dXJuIHVzZXIudXNlcm5hbWUgPT09IG5ld1VzZXIudXNlcm5hbWU7IH0pLmxlbmd0aDtcbiAgICAgICAgICAgICAgICBpZiAoZHVwbGljYXRlVXNlcikge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gdGhyb3dFcnJvcih7IGVycm9yOiB7IG1lc3NhZ2U6ICdVc2VybmFtZSBcIicgKyBuZXdVc2VyLnVzZXJuYW1lICsgJ1wiIGlzIGFscmVhZHkgdGFrZW4nIH0gfSk7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgLy8gc2F2ZSBuZXcgdXNlclxuICAgICAgICAgICAgICAgIG5ld1VzZXIuaWQgPSB1c2Vycy5sZW5ndGggKyAxO1xuICAgICAgICAgICAgICAgIHVzZXJzLnB1c2gobmV3VXNlcik7XG4gICAgICAgICAgICAgICAgbG9jYWxTdG9yYWdlLnNldEl0ZW0oJ3VzZXJzJywgSlNPTi5zdHJpbmdpZnkodXNlcnMpKTtcblxuICAgICAgICAgICAgICAgIC8vIHJlc3BvbmQgMjAwIE9LXG4gICAgICAgICAgICAgICAgcmV0dXJuIG9mKG5ldyBIdHRwUmVzcG9uc2UoeyBzdGF0dXM6IDIwMCB9KSk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIC8vIGRlbGV0ZSB1c2VyXG4gICAgICAgICAgICBpZiAocmVxdWVzdC51cmwubWF0Y2goL1xcL3VzZXJzXFwvXFxkKyQvKSAmJiByZXF1ZXN0Lm1ldGhvZCA9PT0gJ0RFTEVURScpIHtcbiAgICAgICAgICAgICAgICAvLyBjaGVjayBmb3IgZmFrZSBhdXRoIHRva2VuIGluIGhlYWRlciBhbmQgcmV0dXJuIHVzZXIgaWYgdmFsaWQsIHRoaXMgc2VjdXJpdHkgaXMgaW1wbGVtZW50ZWQgc2VydmVyIHNpZGUgaW4gYSByZWFsIGFwcGxpY2F0aW9uXG4gICAgICAgICAgICAgICAgaWYgKHJlcXVlc3QuaGVhZGVycy5nZXQoJ0F1dGhvcml6YXRpb24nKSA9PT0gJ0JlYXJlciBmYWtlLWp3dC10b2tlbicpIHtcbiAgICAgICAgICAgICAgICAgICAgLy8gZmluZCB1c2VyIGJ5IGlkIGluIHVzZXJzIGFycmF5XG4gICAgICAgICAgICAgICAgICAgIGxldCB1cmxQYXJ0cyA9IHJlcXVlc3QudXJsLnNwbGl0KCcvJyk7XG4gICAgICAgICAgICAgICAgICAgIGxldCBpZCA9IHBhcnNlSW50KHVybFBhcnRzW3VybFBhcnRzLmxlbmd0aCAtIDFdKTtcbiAgICAgICAgICAgICAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCB1c2Vycy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgICAgICAgICAgICAgbGV0IHVzZXIgPSB1c2Vyc1tpXTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICh1c2VyLmlkID09PSBpZCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIGRlbGV0ZSB1c2VyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdXNlcnMuc3BsaWNlKGksIDEpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxvY2FsU3RvcmFnZS5zZXRJdGVtKCd1c2VycycsIEpTT04uc3RyaW5naWZ5KHVzZXJzKSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICAvLyByZXNwb25kIDIwMCBPS1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gb2YobmV3IEh0dHBSZXNwb25zZSh7IHN0YXR1czogMjAwIH0pKTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAvLyByZXR1cm4gNDAxIG5vdCBhdXRob3Jpc2VkIGlmIHRva2VuIGlzIG51bGwgb3IgaW52YWxpZFxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gdGhyb3dFcnJvcih7IHN0YXR1czogNDAxLCBlcnJvcjogeyBtZXNzYWdlOiAnVW5hdXRob3Jpc2VkJyB9IH0pO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLy8gcGFzcyB0aHJvdWdoIGFueSByZXF1ZXN0cyBub3QgaGFuZGxlZCBhYm92ZVxuICAgICAgICAgICAgcmV0dXJuIG5leHQuaGFuZGxlKHJlcXVlc3QpO1xuICAgICAgICAgICAgXG4gICAgICAgIH0pKVxuXG4gICAgICAgIC8vIGNhbGwgbWF0ZXJpYWxpemUgYW5kIGRlbWF0ZXJpYWxpemUgdG8gZW5zdXJlIGRlbGF5IGV2ZW4gaWYgYW4gZXJyb3IgaXMgdGhyb3duIChodHRwczovL2dpdGh1Yi5jb20vUmVhY3RpdmUtRXh0ZW5zaW9ucy9SeEpTL2lzc3Vlcy82NDgpXG4gICAgICAgIC5waXBlKG1hdGVyaWFsaXplKCkpXG4gICAgICAgIC5waXBlKGRlbGF5KDUwMCkpXG4gICAgICAgIC5waXBlKGRlbWF0ZXJpYWxpemUoKSk7XG4gICAgfVxufVxuXG5leHBvcnQgbGV0IGZha2VCYWNrZW5kUHJvdmlkZXIgPSB7XG4gICAgLy8gdXNlIGZha2UgYmFja2VuZCBpbiBwbGFjZSBvZiBIdHRwIHNlcnZpY2UgZm9yIGJhY2tlbmQtbGVzcyBkZXZlbG9wbWVudFxuICAgIHByb3ZpZGU6IEhUVFBfSU5URVJDRVBUT1JTLFxuICAgIHVzZUNsYXNzOiBGYWtlQmFja2VuZEludGVyY2VwdG9yLFxuICAgIG11bHRpOiB0cnVlXG59OyJdfQ==