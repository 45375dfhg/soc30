"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var http_1 = require("@angular/common/http");
var rxjs_1 = require("rxjs");
var operators_1 = require("rxjs/operators");
var item_1 = require("../models/item");
var config_1 = require("../config");
var ItemService = /** @class */ (function () {
    function ItemService(http) {
        this.http = http;
        this.baseUrl = config_1.Config.apiUrl + "henquiries";
    }
    ItemService.prototype.getItems = function () {
        var _this = this;
        // let headers = this.createRequestHeader();
        // /henquiries/
        return this.http.get("" + config_1.Config.apiUrl)
            .pipe(operators_1.map(function (items) {
            var itemList = [];
            items.forEach(function (item) {
                itemList.push(new item_1.Item(item.userId, item.id, item.title, item.completed));
            });
            _this.items = itemList;
            return itemList;
        }), operators_1.catchError(this.handleErrors));
    };
    ItemService.prototype.getItem = function (id) {
        var _this = this;
        if (this.items != undefined) {
            return this.items.find(function (data) { return data.id === id; });
        }
        else {
            return this.getItems().subscribe(function (items) { return _this.getItem(id); });
        }
        // return this.http.get<Item>(`${Config.apiUrl}/henquiries/${id}`)
    };
    ItemService.prototype.handleErrors = function (error) {
        console.log(JSON.stringify(error.json()));
        return rxjs_1.Observable.throw(error);
    };
    ItemService = __decorate([
        core_1.Injectable(),
        __metadata("design:paramtypes", [http_1.HttpClient])
    ], ItemService);
    return ItemService;
}());
exports.ItemService = ItemService;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaXRlbS5zZXJ2aWNlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiaXRlbS5zZXJ2aWNlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsc0NBQTJDO0FBQzNDLDZDQUEyRTtBQUMzRSw2QkFBa0M7QUFDbEMsNENBQXNEO0FBRXRELHVDQUFzQztBQUN0QyxvQ0FBbUM7QUFJbkM7SUFJSSxxQkFBb0IsSUFBZ0I7UUFBaEIsU0FBSSxHQUFKLElBQUksQ0FBWTtRQUZwQyxZQUFPLEdBQUcsZUFBTSxDQUFDLE1BQU0sR0FBRyxZQUFZLENBQUM7SUFFQyxDQUFDO0lBSXpDLDhCQUFRLEdBQVI7UUFBQSxpQkFnQkM7UUFmRyw0Q0FBNEM7UUFDNUMsZUFBZTtRQUNmLE1BQU0sQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBUyxLQUFHLGVBQU0sQ0FBQyxNQUFRLENBQUM7YUFDM0MsSUFBSSxDQUNELGVBQUcsQ0FBQyxVQUFBLEtBQUs7WUFDTCxJQUFJLFFBQVEsR0FBRyxFQUFFLENBQUM7WUFDbEIsS0FBSyxDQUFDLE9BQU8sQ0FBQyxVQUFDLElBQUk7Z0JBQ2YsUUFBUSxDQUFDLElBQUksQ0FDVCxJQUFJLFdBQUksQ0FBQyxJQUFJLENBQUMsTUFBTSxFQUFFLElBQUksQ0FBQyxFQUFFLEVBQUUsSUFBSSxDQUFDLEtBQUssRUFBRSxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQztZQUNwRSxDQUFDLENBQUMsQ0FBQztZQUNILEtBQUksQ0FBQyxLQUFLLEdBQUcsUUFBUSxDQUFDO1lBQ3RCLE1BQU0sQ0FBQyxRQUFRLENBQUM7UUFDcEIsQ0FBQyxDQUFDLEVBQ0Ysc0JBQVUsQ0FBQyxJQUFJLENBQUMsWUFBWSxDQUFDLENBQ2hDLENBQUM7SUFDVixDQUFDO0lBRUQsNkJBQU8sR0FBUCxVQUFRLEVBQVU7UUFBbEIsaUJBT0M7UUFORyxFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsS0FBSyxJQUFJLFNBQVMsQ0FBQyxDQUFDLENBQUM7WUFDMUIsTUFBTSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLFVBQUEsSUFBSSxJQUFJLE9BQUEsSUFBSSxDQUFDLEVBQUUsS0FBSyxFQUFFLEVBQWQsQ0FBYyxDQUFDLENBQUM7UUFDbkQsQ0FBQztRQUFDLElBQUksQ0FBQyxDQUFDO1lBQ0osTUFBTSxDQUFDLElBQUksQ0FBQyxRQUFRLEVBQUUsQ0FBQyxTQUFTLENBQUMsVUFBQSxLQUFLLElBQUksT0FBQSxLQUFJLENBQUMsT0FBTyxDQUFDLEVBQUUsQ0FBQyxFQUFoQixDQUFnQixDQUFDLENBQUM7UUFDaEUsQ0FBQztRQUNELGtFQUFrRTtJQUN0RSxDQUFDO0lBRUQsa0NBQVksR0FBWixVQUFhLEtBQWU7UUFDeEIsT0FBTyxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLEtBQUssQ0FBQyxJQUFJLEVBQUUsQ0FBQyxDQUFDLENBQUM7UUFDMUMsTUFBTSxDQUFDLGlCQUFVLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxDQUFDO0lBQ25DLENBQUM7SUF0Q1EsV0FBVztRQUR2QixpQkFBVSxFQUFFO3lDQUtpQixpQkFBVTtPQUozQixXQUFXLENBaUZ2QjtJQUFELGtCQUFDO0NBQUEsQUFqRkQsSUFpRkM7QUFqRlksa0NBQVciLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBJbmplY3RhYmxlIH0gZnJvbSBcIkBhbmd1bGFyL2NvcmVcIjtcclxuaW1wb3J0IHsgSHR0cENsaWVudCwgSHR0cEhlYWRlcnMsIEh0dHBQYXJhbXMgfSBmcm9tIFwiQGFuZ3VsYXIvY29tbW9uL2h0dHBcIjtcclxuaW1wb3J0IHsgT2JzZXJ2YWJsZSB9IGZyb20gXCJyeGpzXCI7XHJcbmltcG9ydCB7IGNhdGNoRXJyb3IsIG1hcCwgdGFwIH0gZnJvbSBcInJ4anMvb3BlcmF0b3JzXCI7XHJcblxyXG5pbXBvcnQgeyBJdGVtIH0gZnJvbSBcIi4uL21vZGVscy9pdGVtXCI7XHJcbmltcG9ydCB7IENvbmZpZyB9IGZyb20gXCIuLi9jb25maWdcIjtcclxuXHJcblxyXG5ASW5qZWN0YWJsZSgpXHJcbmV4cG9ydCBjbGFzcyBJdGVtU2VydmljZSB7XHJcbiAgICBcclxuICAgIGJhc2VVcmwgPSBDb25maWcuYXBpVXJsICsgXCJoZW5xdWlyaWVzXCI7XHJcblxyXG4gICAgY29uc3RydWN0b3IocHJpdmF0ZSBodHRwOiBIdHRwQ2xpZW50KSB7IH1cclxuXHJcbiAgICBwcml2YXRlIGl0ZW1zOiBJdGVtW107XHJcblxyXG4gICAgZ2V0SXRlbXMoKSB7XHJcbiAgICAgICAgLy8gbGV0IGhlYWRlcnMgPSB0aGlzLmNyZWF0ZVJlcXVlc3RIZWFkZXIoKTtcclxuICAgICAgICAvLyAvaGVucXVpcmllcy9cclxuICAgICAgICByZXR1cm4gdGhpcy5odHRwLmdldDxJdGVtW10+KGAke0NvbmZpZy5hcGlVcmx9YClcclxuICAgICAgICAgICAgLnBpcGUoXHJcbiAgICAgICAgICAgICAgICBtYXAoaXRlbXMgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgIGxldCBpdGVtTGlzdCA9IFtdO1xyXG4gICAgICAgICAgICAgICAgICAgIGl0ZW1zLmZvckVhY2goKGl0ZW0pID0+IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaXRlbUxpc3QucHVzaChcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5ldyBJdGVtKGl0ZW0udXNlcklkLCBpdGVtLmlkLCBpdGVtLnRpdGxlLCBpdGVtLmNvbXBsZXRlZCkpO1xyXG4gICAgICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuaXRlbXMgPSBpdGVtTGlzdDtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gaXRlbUxpc3Q7IFxyXG4gICAgICAgICAgICAgICAgfSksXHJcbiAgICAgICAgICAgICAgICBjYXRjaEVycm9yKHRoaXMuaGFuZGxlRXJyb3JzKVxyXG4gICAgICAgICAgICApO1xyXG4gICAgfVxyXG5cclxuICAgIGdldEl0ZW0oaWQ6IG51bWJlcikge1xyXG4gICAgICAgIGlmICh0aGlzLml0ZW1zICE9IHVuZGVmaW5lZCkge1xyXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5pdGVtcy5maW5kKGRhdGEgPT4gZGF0YS5pZCA9PT0gaWQpO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmdldEl0ZW1zKCkuc3Vic2NyaWJlKGl0ZW1zID0+IHRoaXMuZ2V0SXRlbShpZCkpO1xyXG4gICAgICAgIH1cclxuICAgICAgICAvLyByZXR1cm4gdGhpcy5odHRwLmdldDxJdGVtPihgJHtDb25maWcuYXBpVXJsfS9oZW5xdWlyaWVzLyR7aWR9YClcclxuICAgIH1cclxuICAgIFxyXG4gICAgaGFuZGxlRXJyb3JzKGVycm9yOiBSZXNwb25zZSkge1xyXG4gICAgICAgIGNvbnNvbGUubG9nKEpTT04uc3RyaW5naWZ5KGVycm9yLmpzb24oKSkpO1xyXG4gICAgICAgIHJldHVybiBPYnNlcnZhYmxlLnRocm93KGVycm9yKTtcclxuICAgIH1cclxuXHJcbiAgICAvKlxyXG4gICAgcHJpdmF0ZSBjcmVhdGVSZXF1ZXN0SGVhZGVyKCkge1xyXG4gICAgICAgIGxldCBoZWFkZXJzID0gbmV3IEh0dHBIZWFkZXJzKHtcclxuICAgICAgICAgICAgLy8gLi4uXHJcbiAgICAgICAgfSlcclxuICAgIH1cclxuICAgICovXHJcbiAgICAvKlxyXG4gICAgcHJpdmF0ZSBpdGVtcyA9IG5ldyBBcnJheTxJdGVtPihcclxuICAgICAgICB7IGlkOiAxLCBuYW1lOiBcIlRlciBTdGVnZW5cIiwgcm9sZTogXCJHb2Fsa2VlcGVyXCIgfSxcclxuICAgICAgICB7IGlkOiAzLCBuYW1lOiBcIlBpcXXDqVwiLCByb2xlOiBcIkRlZmVuZGVyXCIgfSxcclxuICAgICAgICB7IGlkOiA0LCBuYW1lOiBcIkkuIFJha2l0aWNcIiwgcm9sZTogXCJNaWRmaWVsZGVyXCIgfSxcclxuICAgICAgICB7IGlkOiA1LCBuYW1lOiBcIlNlcmdpb1wiLCByb2xlOiBcIk1pZGZpZWxkZXJcIiB9LFxyXG4gICAgICAgIHsgaWQ6IDYsIG5hbWU6IFwiRGVuaXMgU3XDoXJlelwiLCByb2xlOiBcIk1pZGZpZWxkZXJcIiB9LFxyXG4gICAgICAgIHsgaWQ6IDcsIG5hbWU6IFwiQXJkYVwiLCByb2xlOiBcIk1pZGZpZWxkZXJcIiB9LFxyXG4gICAgICAgIHsgaWQ6IDgsIG5hbWU6IFwiQS4gSW5pZXN0YVwiLCByb2xlOiBcIk1pZGZpZWxkZXJcIiB9LFxyXG4gICAgICAgIHsgaWQ6IDksIG5hbWU6IFwiU3XDoXJlelwiLCByb2xlOiBcIkZvcndhcmRcIiB9LFxyXG4gICAgICAgIHsgaWQ6IDEwLCBuYW1lOiBcIk1lc3NpXCIsIHJvbGU6IFwiRm9yd2FyZFwiIH0sXHJcbiAgICAgICAgeyBpZDogMTEsIG5hbWU6IFwiTmV5bWFyXCIsIHJvbGU6IFwiRm9yd2FyZFwiIH0sXHJcbiAgICAgICAgeyBpZDogMTIsIG5hbWU6IFwiUmFmaW5oYVwiLCByb2xlOiBcIk1pZGZpZWxkZXJcIiB9LFxyXG4gICAgICAgIHsgaWQ6IDEzLCBuYW1lOiBcIkNpbGxlc3NlblwiLCByb2xlOiBcIkdvYWxrZWVwZXJcIiB9LFxyXG4gICAgICAgIHsgaWQ6IDE0LCBuYW1lOiBcIk1hc2NoZXJhbm9cIiwgcm9sZTogXCJEZWZlbmRlclwiIH0sXHJcbiAgICAgICAgeyBpZDogMTcsIG5hbWU6IFwiUGFjbyBBbGPDoWNlclwiLCByb2xlOiBcIkZvcndhcmRcIiB9LFxyXG4gICAgICAgIHsgaWQ6IDE4LCBuYW1lOiBcIkpvcmRpIEFsYmFcIiwgcm9sZTogXCJEZWZlbmRlclwiIH0sXHJcbiAgICAgICAgeyBpZDogMTksIG5hbWU6IFwiRGlnbmVcIiwgcm9sZTogXCJEZWZlbmRlclwiIH0sXHJcbiAgICAgICAgeyBpZDogMjAsIG5hbWU6IFwiU2VyZ2kgUm9iZXJ0b1wiLCByb2xlOiBcIk1pZGZpZWxkZXJcIiB9LFxyXG4gICAgICAgIHsgaWQ6IDIxLCBuYW1lOiBcIkFuZHLDqSBHb21lc1wiLCByb2xlOiBcIk1pZGZpZWxkZXJcIiB9LFxyXG4gICAgICAgIHsgaWQ6IDIyLCBuYW1lOiBcIkFsZWl4IFZpZGFsXCIsIHJvbGU6IFwiTWlkZmllbGRlclwiIH0sXHJcbiAgICAgICAgeyBpZDogMjMsIG5hbWU6IFwiVW10aXRpXCIsIHJvbGU6IFwiRGVmZW5kZXJcIiB9LFxyXG4gICAgICAgIHsgaWQ6IDI0LCBuYW1lOiBcIk1hdGhpZXVcIiwgcm9sZTogXCJEZWZlbmRlclwiIH0sXHJcbiAgICAgICAgeyBpZDogMjUsIG5hbWU6IFwiTWFzaXBcIiwgcm9sZTogXCJHb2Fsa2VlcGVyXCIgfSxcclxuICAgICk7XHJcbiAgICBcclxuICAgIGdldEl0ZW1zKCk6IEl0ZW1bXSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuaXRlbXM7XHJcbiAgICB9XHJcblxyXG4gICAgZ2V0SXRlbShpZDogbnVtYmVyKTogSXRlbSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuaXRlbXMuZmlsdGVyKGl0ZW0gPT4gaXRlbS5pZCA9PT0gaWQpWzBdO1xyXG4gICAgfVxyXG4gICAgKi9cclxufVxyXG5cclxuXHJcbiJdfQ==