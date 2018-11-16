"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var router_1 = require("@angular/router");
var item_service_1 = require("../shared/services/item.service");
var ItemsComponent = /** @class */ (function () {
    // This pattern makes use of Angular’s dependency injection implementation to inject an instance of the ItemService service into this class.
    // Angular knows about this service because it is included in your app’s main NgModule, defined in app.module.ts.
    function ItemsComponent(itemService, router) {
        this.itemService = itemService;
        this.router = router;
        this.items = [];
    }
    ItemsComponent.prototype.ngOnInit = function () {
        this.receiveList();
    };
    ItemsComponent.prototype.receiveList = function () {
        var _this = this;
        this.itemService.getItems().subscribe(function (result) { return _this.items = result; });
    };
    ItemsComponent.prototype.navigateToDetails = function (id) {
        this.router.navigate([
            '/navigate', { outlets: { itemsoutlet: ['items', id] } }
        ]);
    };
    ItemsComponent = __decorate([
        core_1.Component({
            selector: "ns-items",
            moduleId: module.id,
            templateUrl: "./items.component.html",
        }),
        __metadata("design:paramtypes", [item_service_1.ItemService, router_1.Router])
    ], ItemsComponent);
    return ItemsComponent;
}());
exports.ItemsComponent = ItemsComponent;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaXRlbXMuY29tcG9uZW50LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiaXRlbXMuY29tcG9uZW50LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsc0NBQWlEO0FBQ2pELDBDQUF5QztBQUl6QyxnRUFBOEQ7QUFTOUQ7SUFJSSw0SUFBNEk7SUFDNUksaUhBQWlIO0lBQ2pILHdCQUFvQixXQUF3QixFQUFVLE1BQWM7UUFBaEQsZ0JBQVcsR0FBWCxXQUFXLENBQWE7UUFBVSxXQUFNLEdBQU4sTUFBTSxDQUFRO1FBSnBFLFVBQUssR0FBVyxFQUFFLENBQUM7SUFJcUQsQ0FBQztJQUV6RSxpQ0FBUSxHQUFSO1FBQ0ksSUFBSSxDQUFDLFdBQVcsRUFBRSxDQUFDO0lBQ3ZCLENBQUM7SUFFRCxvQ0FBVyxHQUFYO1FBQUEsaUJBRUM7UUFERyxJQUFJLENBQUMsV0FBVyxDQUFDLFFBQVEsRUFBRSxDQUFDLFNBQVMsQ0FBQyxVQUFBLE1BQU0sSUFBSSxPQUFBLEtBQUksQ0FBQyxLQUFLLEdBQUcsTUFBTSxFQUFuQixDQUFtQixDQUFDLENBQUM7SUFDekUsQ0FBQztJQUVELDBDQUFpQixHQUFqQixVQUFrQixFQUFVO1FBQ3hCLElBQUksQ0FBQyxNQUFNLENBQUMsUUFBUSxDQUFDO1lBQ2pCLFdBQVcsRUFBRSxFQUFDLE9BQU8sRUFBRSxFQUFFLFdBQVcsRUFBRSxDQUFDLE9BQU8sRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFO1NBQzFELENBQUMsQ0FBQTtJQUNOLENBQUM7SUFwQlEsY0FBYztRQUwxQixnQkFBUyxDQUFDO1lBQ1AsUUFBUSxFQUFFLFVBQVU7WUFDcEIsUUFBUSxFQUFFLE1BQU0sQ0FBQyxFQUFFO1lBQ25CLFdBQVcsRUFBRSx3QkFBd0I7U0FDeEMsQ0FBQzt5Q0FPbUMsMEJBQVcsRUFBa0IsZUFBTTtPQU4zRCxjQUFjLENBcUIxQjtJQUFELHFCQUFDO0NBQUEsQUFyQkQsSUFxQkM7QUFyQlksd0NBQWMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBDb21wb25lbnQsIE9uSW5pdH0gZnJvbSBcIkBhbmd1bGFyL2NvcmVcIjtcclxuaW1wb3J0IHsgUm91dGVyIH0gZnJvbSBcIkBhbmd1bGFyL3JvdXRlclwiO1xyXG5cclxuXHJcbmltcG9ydCB7IEl0ZW0gfSBmcm9tIFwiLi4vc2hhcmVkL21vZGVscy9pdGVtXCI7XHJcbmltcG9ydCB7IEl0ZW1TZXJ2aWNlIH0gZnJvbSBcIi4uL3NoYXJlZC9zZXJ2aWNlcy9pdGVtLnNlcnZpY2VcIjtcclxuaW1wb3J0IHsgbWFwIH0gZnJvbSBcInJ4anMvb3BlcmF0b3JzXCI7XHJcbmltcG9ydCB7IEh0dHBFcnJvclJlc3BvbnNlIH0gZnJvbSBcIkBhbmd1bGFyL2NvbW1vbi9odHRwXCI7XHJcblxyXG5AQ29tcG9uZW50KHtcclxuICAgIHNlbGVjdG9yOiBcIm5zLWl0ZW1zXCIsXHJcbiAgICBtb2R1bGVJZDogbW9kdWxlLmlkLFxyXG4gICAgdGVtcGxhdGVVcmw6IFwiLi9pdGVtcy5jb21wb25lbnQuaHRtbFwiLFxyXG59KVxyXG5leHBvcnQgY2xhc3MgSXRlbXNDb21wb25lbnQgaW1wbGVtZW50cyBPbkluaXQge1xyXG4gICAgXHJcbiAgICBpdGVtczogSXRlbVtdID0gW107XHJcblxyXG4gICAgLy8gVGhpcyBwYXR0ZXJuIG1ha2VzIHVzZSBvZiBBbmd1bGFy4oCZcyBkZXBlbmRlbmN5IGluamVjdGlvbiBpbXBsZW1lbnRhdGlvbiB0byBpbmplY3QgYW4gaW5zdGFuY2Ugb2YgdGhlIEl0ZW1TZXJ2aWNlIHNlcnZpY2UgaW50byB0aGlzIGNsYXNzLlxyXG4gICAgLy8gQW5ndWxhciBrbm93cyBhYm91dCB0aGlzIHNlcnZpY2UgYmVjYXVzZSBpdCBpcyBpbmNsdWRlZCBpbiB5b3VyIGFwcOKAmXMgbWFpbiBOZ01vZHVsZSwgZGVmaW5lZCBpbiBhcHAubW9kdWxlLnRzLlxyXG4gICAgY29uc3RydWN0b3IocHJpdmF0ZSBpdGVtU2VydmljZTogSXRlbVNlcnZpY2UsIHByaXZhdGUgcm91dGVyOiBSb3V0ZXIpIHsgfVxyXG5cclxuICAgIG5nT25Jbml0KCk6IHZvaWQge1xyXG4gICAgICAgIHRoaXMucmVjZWl2ZUxpc3QoKTtcclxuICAgIH1cclxuXHJcbiAgICByZWNlaXZlTGlzdCgpIHtcclxuICAgICAgICB0aGlzLml0ZW1TZXJ2aWNlLmdldEl0ZW1zKCkuc3Vic2NyaWJlKHJlc3VsdCA9PiB0aGlzLml0ZW1zID0gcmVzdWx0KTtcclxuICAgIH1cclxuXHJcbiAgICBuYXZpZ2F0ZVRvRGV0YWlscyhpZDogbnVtYmVyKSB7XHJcbiAgICAgICAgdGhpcy5yb3V0ZXIubmF2aWdhdGUoW1xyXG4gICAgICAgICAgICAnL25hdmlnYXRlJywge291dGxldHM6IHsgaXRlbXNvdXRsZXQ6IFsnaXRlbXMnLCBpZF0gfSB9XHJcbiAgICAgICAgXSlcclxuICAgIH1cclxufSJdfQ==