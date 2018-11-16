"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var router_1 = require("@angular/router");
var item_service_1 = require("../shared/services/item.service");
var ItemDetailComponent = /** @class */ (function () {
    function ItemDetailComponent(itemService, route) {
        this.itemService = itemService;
        this.route = route;
    }
    ItemDetailComponent.prototype.ngOnInit = function () {
        var id = +this.route.snapshot.params['id'];
        console.log(id);
        this.item = this.itemService.getItem(id);
        console.log("" + this.item.id);
    };
    ItemDetailComponent = __decorate([
        core_1.Component({
            selector: "ns-details",
            moduleId: module.id,
            templateUrl: "./item-detail.component.html",
        }),
        __metadata("design:paramtypes", [item_service_1.ItemService,
            router_1.ActivatedRoute])
    ], ItemDetailComponent);
    return ItemDetailComponent;
}());
exports.ItemDetailComponent = ItemDetailComponent;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaXRlbS1kZXRhaWwuY29tcG9uZW50LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiaXRlbS1kZXRhaWwuY29tcG9uZW50LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsc0NBQWtEO0FBQ2xELDBDQUFpRDtBQUdqRCxnRUFBOEQ7QUFPOUQ7SUFHSSw2QkFDWSxXQUF3QixFQUN4QixLQUFxQjtRQURyQixnQkFBVyxHQUFYLFdBQVcsQ0FBYTtRQUN4QixVQUFLLEdBQUwsS0FBSyxDQUFnQjtJQUM3QixDQUFDO0lBRUwsc0NBQVEsR0FBUjtRQUNJLElBQU0sRUFBRSxHQUFHLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxRQUFRLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxDQUFDO1FBQzdDLE9BQU8sQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLENBQUM7UUFDaEIsSUFBSSxDQUFDLElBQUksR0FBRyxJQUFJLENBQUMsV0FBVyxDQUFDLE9BQU8sQ0FBQyxFQUFFLENBQUMsQ0FBQztRQUN6QyxPQUFPLENBQUMsR0FBRyxDQUFDLEtBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxFQUFJLENBQUMsQ0FBQztJQUNuQyxDQUFDO0lBYlEsbUJBQW1CO1FBTC9CLGdCQUFTLENBQUM7WUFDUCxRQUFRLEVBQUUsWUFBWTtZQUN0QixRQUFRLEVBQUUsTUFBTSxDQUFDLEVBQUU7WUFDbkIsV0FBVyxFQUFFLDhCQUE4QjtTQUM5QyxDQUFDO3lDQUsyQiwwQkFBVztZQUNqQix1QkFBYztPQUx4QixtQkFBbUIsQ0FjL0I7SUFBRCwwQkFBQztDQUFBLEFBZEQsSUFjQztBQWRZLGtEQUFtQiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IENvbXBvbmVudCwgT25Jbml0IH0gZnJvbSBcIkBhbmd1bGFyL2NvcmVcIjtcclxuaW1wb3J0IHsgQWN0aXZhdGVkUm91dGUgfSBmcm9tIFwiQGFuZ3VsYXIvcm91dGVyXCI7XHJcblxyXG5pbXBvcnQgeyBJdGVtIH0gZnJvbSBcIi4uL3NoYXJlZC9tb2RlbHMvaXRlbVwiO1xyXG5pbXBvcnQgeyBJdGVtU2VydmljZSB9IGZyb20gXCIuLi9zaGFyZWQvc2VydmljZXMvaXRlbS5zZXJ2aWNlXCI7XHJcblxyXG5AQ29tcG9uZW50KHtcclxuICAgIHNlbGVjdG9yOiBcIm5zLWRldGFpbHNcIixcclxuICAgIG1vZHVsZUlkOiBtb2R1bGUuaWQsXHJcbiAgICB0ZW1wbGF0ZVVybDogXCIuL2l0ZW0tZGV0YWlsLmNvbXBvbmVudC5odG1sXCIsXHJcbn0pXHJcbmV4cG9ydCBjbGFzcyBJdGVtRGV0YWlsQ29tcG9uZW50IGltcGxlbWVudHMgT25Jbml0IHtcclxuICAgIGl0ZW06IEl0ZW07XHJcblxyXG4gICAgY29uc3RydWN0b3IoXHJcbiAgICAgICAgcHJpdmF0ZSBpdGVtU2VydmljZTogSXRlbVNlcnZpY2UsXHJcbiAgICAgICAgcHJpdmF0ZSByb3V0ZTogQWN0aXZhdGVkUm91dGVcclxuICAgICkgeyB9XHJcblxyXG4gICAgbmdPbkluaXQoKTogdm9pZCB7XHJcbiAgICAgICAgY29uc3QgaWQgPSArdGhpcy5yb3V0ZS5zbmFwc2hvdC5wYXJhbXNbJ2lkJ107XHJcbiAgICAgICAgY29uc29sZS5sb2coaWQpO1xyXG4gICAgICAgIHRoaXMuaXRlbSA9IHRoaXMuaXRlbVNlcnZpY2UuZ2V0SXRlbShpZCk7XHJcbiAgICAgICAgY29uc29sZS5sb2coYCR7dGhpcy5pdGVtLmlkfWApO1xyXG4gICAgfVxyXG59XHJcbiJdfQ==