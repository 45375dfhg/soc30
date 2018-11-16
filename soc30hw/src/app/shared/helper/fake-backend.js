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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZmFrZS1iYWNrZW5kLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiZmFrZS1iYWNrZW5kLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsc0NBQTJDO0FBQzNDLDZDQUE2SDtBQUM3SCw2QkFBa0Q7QUFDbEQsNENBQTZFO0FBRzdFO0lBRUk7SUFBZ0IsQ0FBQztJQUVqQiwwQ0FBUyxHQUFULFVBQVUsT0FBeUIsRUFBRSxJQUFpQjtRQUNsRCw4Q0FBOEM7UUFDOUMsSUFBSSxLQUFLLEdBQVUsSUFBSSxDQUFDLEtBQUssQ0FBQyxZQUFZLENBQUMsT0FBTyxDQUFDLE9BQU8sQ0FBQyxDQUFDLElBQUksRUFBRSxDQUFDO1FBRW5FLHlEQUF5RDtRQUN6RCxNQUFNLENBQUMsU0FBRSxDQUFDLElBQUksQ0FBQyxDQUFDLElBQUksQ0FBQyxvQkFBUSxDQUFDO1lBRTFCLGVBQWU7WUFDZixFQUFFLENBQUMsQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLFFBQVEsQ0FBQyxxQkFBcUIsQ0FBQyxJQUFJLE9BQU8sQ0FBQyxNQUFNLEtBQUssTUFBTSxDQUFDLENBQUMsQ0FBQztnQkFDM0UsNkNBQTZDO2dCQUM3QyxJQUFJLGFBQWEsR0FBRyxLQUFLLENBQUMsTUFBTSxDQUFDLFVBQUEsSUFBSTtvQkFDakMsTUFBTSxDQUFDLElBQUksQ0FBQyxRQUFRLEtBQUssT0FBTyxDQUFDLElBQUksQ0FBQyxRQUFRLElBQUksSUFBSSxDQUFDLFFBQVEsS0FBSyxPQUFPLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQztnQkFDOUYsQ0FBQyxDQUFDLENBQUM7Z0JBRUgsRUFBRSxDQUFDLENBQUMsYUFBYSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUM7b0JBQ3ZCLGdGQUFnRjtvQkFDaEYsSUFBSSxJQUFJLEdBQUcsYUFBYSxDQUFDLENBQUMsQ0FBQyxDQUFDO29CQUM1QixJQUFJLElBQUksR0FBRzt3QkFDUCxFQUFFLEVBQUUsSUFBSSxDQUFDLEVBQUU7d0JBQ1gsUUFBUSxF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QUFNLENBQUMsT0FBTyxDQUFDLENBQUM7UUFFaEMsQ0FBQyxDQUFDLENBQUM7YUFHRixJQUFJLENBQUMsdUJBQVcsRUFBRSxDQUFDO2FBQ25CLElBQUksQ0FBQyxpQkFBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDO2FBQ2hCLElBQUksQ0FBQyx5QkFBYSxFQUFFLENBQUMsQ0FBQztJQUMzQixDQUFDO0lBdEhRLHNCQUFzQjtRQURsQyxpQkFBVSxFQUFFOztPQUNBLHNCQUFzQixDQXVIbEM7SUFBRCw2QkFBQztDQUFBLEFBdkhELElBdUhDO0FBdkhZLHdEQUFzQjtBQXlIeEIsUUFBQSxtQkFBbUIsR0FBRztJQUM3Qix5RUFBeUU7SUFDekUsT0FBTyxFQUFFLHdCQUFpQjtJQUMxQixRQUFRLEVBQUUsc0JBQXNCO0lBQ2hDLEtBQUssRUFBRSxJQUFJO0NBQ2QsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IEluamVjdGFibGUgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcclxuaW1wb3J0IHsgSHR0cFJlcXVlc3QsIEh0dHBSZXNwb25zZSwgSHR0cEhhbmRsZXIsIEh0dHBFdmVudCwgSHR0cEludGVyY2VwdG9yLCBIVFRQX0lOVEVSQ0VQVE9SUyB9IGZyb20gJ0Bhbmd1bGFyL2NvbW1vbi9odHRwJztcclxuaW1wb3J0IHsgT2JzZXJ2YWJsZSwgb2YsIHRocm93RXJyb3IgfSBmcm9tICdyeGpzJztcclxuaW1wb3J0IHsgZGVsYXksIG1lcmdlTWFwLCBtYXRlcmlhbGl6ZSwgZGVtYXRlcmlhbGl6ZSB9IGZyb20gJ3J4anMvb3BlcmF0b3JzJztcclxuXHJcbkBJbmplY3RhYmxlKClcclxuZXhwb3J0IGNsYXNzIEZha2VCYWNrZW5kSW50ZXJjZXB0b3IgaW1wbGVtZW50cyBIdHRwSW50ZXJjZXB0b3Ige1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKCkgeyB9XHJcblxyXG4gICAgaW50ZXJjZXB0KHJlcXVlc3Q6IEh0dHBSZXF1ZXN0PGFueT4sIG5leHQ6IEh0dHBIYW5kbGVyKTogT2JzZXJ2YWJsZTxIdHRwRXZlbnQ8YW55Pj4ge1xyXG4gICAgICAgIC8vIGFycmF5IGluIGxvY2FsIHN0b3JhZ2UgZm9yIHJlZ2lzdGVyZWQgdXNlcnNcclxuICAgICAgICBsZXQgdXNlcnM6IGFueVtdID0gSlNPTi5wYXJzZShsb2NhbFN0b3JhZ2UuZ2V0SXRlbSgndXNlcnMnKSkgfHwgW107XHJcblxyXG4gICAgICAgIC8vIHdyYXAgaW4gZGVsYXllZCBvYnNlcnZhYmxlIHRvIHNpbXVsYXRlIHNlcnZlciBhcGkgY2FsbFxyXG4gICAgICAgIHJldHVybiBvZihudWxsKS5waXBlKG1lcmdlTWFwKCgpID0+IHtcclxuXHJcbiAgICAgICAgICAgIC8vIGF1dGhlbnRpY2F0ZVxyXG4gICAgICAgICAgICBpZiAocmVxdWVzdC51cmwuZW5kc1dpdGgoJy91c2Vycy9hdXRoZW50aWNhdGUnKSAmJiByZXF1ZXN0Lm1ldGhvZCA9PT0gJ1BPU1QnKSB7XHJcbiAgICAgICAgICAgICAgICAvLyBmaW5kIGlmIGFueSB1c2VyIG1hdGNoZXMgbG9naW4gY3JlZGVudGlhbHNcclxuICAgICAgICAgICAgICAgIGxldCBmaWx0ZXJlZFVzZXJzID0gdXNlcnMuZmlsdGVyKHVzZXIgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB1c2VyLnVzZXJuYW1lID09PSByZXF1ZXN0LmJvZHkudXNlcm5hbWUgJiYgdXNlci5wYXNzd29yZCA9PT0gcmVxdWVzdC5ib2R5LnBhc3N3b3JkO1xyXG4gICAgICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICAgICAgaWYgKGZpbHRlcmVkVXNlcnMubGVuZ3RoKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgLy8gaWYgbG9naW4gZGV0YWlscyBhcmUgdmFsaWQgcmV0dXJuIDIwMCBPSyB3aXRoIHVzZXIgZGV0YWlscyBhbmQgZmFrZSBqd3QgdG9rZW5cclxuICAgICAgICAgICAgICAgICAgICBsZXQgdXNlciA9IGZpbHRlcmVkVXNlcnNbMF07XHJcbiAgICAgICAgICAgICAgICAgICAgbGV0IGJvZHkgPSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlkOiB1c2VyLmlkLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICB1c2VybmFtZTogdXNlci51c2VybmFtZSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgZmlyc3ROYW1lOiB1c2VyLmZpcnN0TmFtZSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgbGFzdE5hbWU6IHVzZXIubGFzdE5hbWUsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRva2VuOiAnZmFrZS1qd3QtdG9rZW4nXHJcbiAgICAgICAgICAgICAgICAgICAgfTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIG9mKG5ldyBIdHRwUmVzcG9uc2UoeyBzdGF0dXM6IDIwMCwgYm9keTogYm9keSB9KSk7XHJcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgIC8vIGVsc2UgcmV0dXJuIDQwMCBiYWQgcmVxdWVzdFxyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB0aHJvd0Vycm9yKHsgZXJyb3I6IHsgbWVzc2FnZTogJ1VzZXJuYW1lIG9yIHBhc3N3b3JkIGlzIGluY29ycmVjdCcgfSB9KTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgLy8gZ2V0IHVzZXJzXHJcbiAgICAgICAgICAgIGlmIChyZXF1ZXN0LnVybC5lbmRzV2l0aCgnL3VzZXJzJykgJiYgcmVxdWVzdC5tZXRob2QgPT09ICdHRVQnKSB7XHJcbiAgICAgICAgICAgICAgICAvLyBjaGVjayBmb3IgZmFrZSBhdXRoIHRva2VuIGluIGhlYWRlciBhbmQgcmV0dXJuIHVzZXJzIGlmIHZhbGlkLCB0aGlzIHNlY3VyaXR5IGlzIGltcGxlbWVudGVkIHNlcnZlciBzaWRlIGluIGEgcmVhbCBhcHBsaWNhdGlvblxyXG4gICAgICAgICAgICAgICAgaWYgKHJlcXVlc3QuaGVhZGVycy5nZXQoJ0F1dGhvcml6YXRpb24nKSA9PT0gJ0JlYXJlciBmYWtlLWp3dC10b2tlbicpIHtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gb2YobmV3IEh0dHBSZXNwb25zZSh7IHN0YXR1czogMjAwLCBib2R5OiB1c2VycyB9KSk7XHJcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgIC8vIHJldHVybiA0MDEgbm90IGF1dGhvcmlzZWQgaWYgdG9rZW4gaXMgbnVsbCBvciBpbnZhbGlkXHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRocm93RXJyb3IoeyBzdGF0dXM6IDQwMSwgZXJyb3I6IHsgbWVzc2FnZTogJ1VuYXV0aG9yaXNlZCcgfSB9KTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgLy8gZ2V0IHVzZXIgYnkgaWRcclxuICAgICAgICAgICAgaWYgKHJlcXVlc3QudXJsLm1hdGNoKC9cXC91c2Vyc1xcL1xcZCskLykgJiYgcmVxdWVzdC5tZXRob2QgPT09ICdHRVQnKSB7XHJcbiAgICAgICAgICAgICAgICAvLyBjaGVjayBmb3IgZmFrZSBhdXRoIHRva2VuIGluIGhlYWRlciBhbmQgcmV0dXJuIHVzZXIgaWYgdmFsaWQsIHRoaXMgc2VjdXJpdHkgaXMgaW1wbGVtZW50ZWQgc2VydmVyIHNpZGUgaW4gYSByZWFsIGFwcGxpY2F0aW9uXHJcbiAgICAgICAgICAgICAgICBpZiAocmVxdWVzdC5oZWFkZXJzLmdldCgnQXV0aG9yaXphdGlvbicpID09PSAnQmVhcmVyIGZha2Utand0LXRva2VuJykge1xyXG4gICAgICAgICAgICAgICAgICAgIC8vIGZpbmQgdXNlciBieSBpZCBpbiB1c2VycyBhcnJheVxyXG4gICAgICAgICAgICAgICAgICAgIGxldCB1cmxQYXJ0cyA9IHJlcXVlc3QudXJsLnNwbGl0KCcvJyk7XHJcbiAgICAgICAgICAgICAgICAgICAgbGV0IGlkID0gcGFyc2VJbnQodXJsUGFydHNbdXJsUGFydHMubGVuZ3RoIC0gMV0pO1xyXG4gICAgICAgICAgICAgICAgICAgIGxldCBtYXRjaGVkVXNlcnMgPSB1c2Vycy5maWx0ZXIodXNlciA9PiB7IHJldHVybiB1c2VyLmlkID09PSBpZDsgfSk7XHJcbiAgICAgICAgICAgICAgICAgICAgbGV0IHVzZXIgPSBtYXRjaGVkVXNlcnMubGVuZ3RoID8gbWF0Y2hlZFVzZXJzWzBdIDogbnVsbDtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIG9mKG5ldyBIdHRwUmVzcG9uc2UoeyBzdGF0dXM6IDIwMCwgYm9keTogdXNlciB9KSk7XHJcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgIC8vIHJldHVybiA0MDEgbm90IGF1dGhvcmlzZWQgaWYgdG9rZW4gaXMgbnVsbCBvciBpbnZhbGlkXHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRocm93RXJyb3IoeyBzdGF0dXM6IDQwMSwgZXJyb3I6IHsgbWVzc2FnZTogJ1VuYXV0aG9yaXNlZCcgfSB9KTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgLy8gcmVnaXN0ZXIgdXNlclxyXG4gICAgICAgICAgICBpZiAocmVxdWVzdC51cmwuZW5kc1dpdGgoJy91c2Vycy9yZWdpc3RlcicpICYmIHJlcXVlc3QubWV0aG9kID09PSAnUE9TVCcpIHtcclxuICAgICAgICAgICAgICAgIC8vIGdldCBuZXcgdXNlciBvYmplY3QgZnJvbSBwb3N0IGJvZHlcclxuICAgICAgICAgICAgICAgIGxldCBuZXdVc2VyID0gcmVxdWVzdC5ib2R5O1xyXG5cclxuICAgICAgICAgICAgICAgIC8vIHZhbGlkYXRpb25cclxuICAgICAgICAgICAgICAgIGxldCBkdXBsaWNhdGVVc2VyID0gdXNlcnMuZmlsdGVyKHVzZXIgPT4geyByZXR1cm4gdXNlci51c2VybmFtZSA9PT0gbmV3VXNlci51c2VybmFtZTsgfSkubGVuZ3RoO1xyXG4gICAgICAgICAgICAgICAgaWYgKGR1cGxpY2F0ZVVzZXIpIHtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gdGhyb3dFcnJvcih7IGVycm9yOiB7IG1lc3NhZ2U6ICdVc2VybmFtZSBcIicgKyBuZXdVc2VyLnVzZXJuYW1lICsgJ1wiIGlzIGFscmVhZHkgdGFrZW4nIH0gfSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgLy8gc2F2ZSBuZXcgdXNlclxyXG4gICAgICAgICAgICAgICAgbmV3VXNlci5pZCA9IHVzZXJzLmxlbmd0aCArIDE7XHJcbiAgICAgICAgICAgICAgICB1c2Vycy5wdXNoKG5ld1VzZXIpO1xyXG4gICAgICAgICAgICAgICAgbG9jYWxTdG9yYWdlLnNldEl0ZW0oJ3VzZXJzJywgSlNPTi5zdHJpbmdpZnkodXNlcnMpKTtcclxuXHJcbiAgICAgICAgICAgICAgICAvLyByZXNwb25kIDIwMCBPS1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIG9mKG5ldyBIdHRwUmVzcG9uc2UoeyBzdGF0dXM6IDIwMCB9KSk7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIC8vIGRlbGV0ZSB1c2VyXHJcbiAgICAgICAgICAgIGlmIChyZXF1ZXN0LnVybC5tYXRjaCgvXFwvdXNlcnNcXC9cXGQrJC8pICYmIHJlcXVlc3QubWV0aG9kID09PSAnREVMRVRFJykge1xyXG4gICAgICAgICAgICAgICAgLy8gY2hlY2sgZm9yIGZha2UgYXV0aCB0b2tlbiBpbiBoZWFkZXIgYW5kIHJldHVybiB1c2VyIGlmIHZhbGlkLCB0aGlzIHNlY3VyaXR5IGlzIGltcGxlbWVudGVkIHNlcnZlciBzaWRlIGluIGEgcmVhbCBhcHBsaWNhdGlvblxyXG4gICAgICAgICAgICAgICAgaWYgKHJlcXVlc3QuaGVhZGVycy5nZXQoJ0F1dGhvcml6YXRpb24nKSA9PT0gJ0JlYXJlciBmYWtlLWp3dC10b2tlbicpIHtcclxuICAgICAgICAgICAgICAgICAgICAvLyBmaW5kIHVzZXIgYnkgaWQgaW4gdXNlcnMgYXJyYXlcclxuICAgICAgICAgICAgICAgICAgICBsZXQgdXJsUGFydHMgPSByZXF1ZXN0LnVybC5zcGxpdCgnLycpO1xyXG4gICAgICAgICAgICAgICAgICAgIGxldCBpZCA9IHBhcnNlSW50KHVybFBhcnRzW3VybFBhcnRzLmxlbmd0aCAtIDFdKTtcclxuICAgICAgICAgICAgICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHVzZXJzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGxldCB1c2VyID0gdXNlcnNbaV07XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICh1c2VyLmlkID09PSBpZCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gZGVsZXRlIHVzZXJcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHVzZXJzLnNwbGljZShpLCAxKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxvY2FsU3RvcmFnZS5zZXRJdGVtKCd1c2VycycsIEpTT04uc3RyaW5naWZ5KHVzZXJzKSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICAgICAgLy8gcmVzcG9uZCAyMDAgT0tcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gb2YobmV3IEh0dHBSZXNwb25zZSh7IHN0YXR1czogMjAwIH0pKTtcclxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgLy8gcmV0dXJuIDQwMSBub3QgYXV0aG9yaXNlZCBpZiB0b2tlbiBpcyBudWxsIG9yIGludmFsaWRcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gdGhyb3dFcnJvcih7IHN0YXR1czogNDAxLCBlcnJvcjogeyBtZXNzYWdlOiAnVW5hdXRob3Jpc2VkJyB9IH0pO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAvLyBwYXNzIHRocm91Z2ggYW55IHJlcXVlc3RzIG5vdCBoYW5kbGVkIGFib3ZlXHJcbiAgICAgICAgICAgIHJldHVybiBuZXh0LmhhbmRsZShyZXF1ZXN0KTtcclxuICAgICAgICAgICAgXHJcbiAgICAgICAgfSkpXHJcblxyXG4gICAgICAgIC8vIGNhbGwgbWF0ZXJpYWxpemUgYW5kIGRlbWF0ZXJpYWxpemUgdG8gZW5zdXJlIGRlbGF5IGV2ZW4gaWYgYW4gZXJyb3IgaXMgdGhyb3duIChodHRwczovL2dpdGh1Yi5jb20vUmVhY3RpdmUtRXh0ZW5zaW9ucy9SeEpTL2lzc3Vlcy82NDgpXHJcbiAgICAgICAgLnBpcGUobWF0ZXJpYWxpemUoKSlcclxuICAgICAgICAucGlwZShkZWxheSg1MDApKVxyXG4gICAgICAgIC5waXBlKGRlbWF0ZXJpYWxpemUoKSk7XHJcbiAgICB9XHJcbn1cclxuXHJcbmV4cG9ydCBsZXQgZmFrZUJhY2tlbmRQcm92aWRlciA9IHtcclxuICAgIC8vIHVzZSBmYWtlIGJhY2tlbmQgaW4gcGxhY2Ugb2YgSHR0cCBzZXJ2aWNlIGZvciBiYWNrZW5kLWxlc3MgZGV2ZWxvcG1lbnRcclxuICAgIHByb3ZpZGU6IEhUVFBfSU5URVJDRVBUT1JTLFxyXG4gICAgdXNlQ2xhc3M6IEZha2VCYWNrZW5kSW50ZXJjZXB0b3IsXHJcbiAgICBtdWx0aTogdHJ1ZVxyXG59OyJdfQ==