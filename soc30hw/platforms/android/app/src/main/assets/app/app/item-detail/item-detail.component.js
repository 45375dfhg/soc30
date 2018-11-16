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
        var id = +this.route.snapshot.params["id"];
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaXRlbS1kZXRhaWwuY29tcG9uZW50LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiaXRlbS1kZXRhaWwuY29tcG9uZW50LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsc0NBQWtEO0FBQ2xELDBDQUFpRDtBQUdqRCxnRUFBOEQ7QUFPOUQ7SUFHSSw2QkFDWSxXQUF3QixFQUN4QixLQUFxQjtRQURyQixnQkFBVyxHQUFYLFdBQVcsQ0FBYTtRQUN4QixVQUFLLEdBQUwsS0FBSyxDQUFnQjtJQUM3QixDQUFDO0lBRUwsc0NBQVEsR0FBUjtRQUNJLElBQU0sRUFBRSxHQUFHLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxRQUFRLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxDQUFDO1FBQzdDLElBQUksQ0FBQyxJQUFJLEdBQUcsSUFBSSxDQUFDLFdBQVcsQ0FBQyxPQUFPLENBQUMsRUFBRSxDQUFDLENBQUM7UUFDekMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxLQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsRUFBSSxDQUFDLENBQUM7SUFDbkMsQ0FBQztJQVpRLG1CQUFtQjtRQUwvQixnQkFBUyxDQUFDO1lBQ1AsUUFBUSxFQUFFLFlBQVk7WUFDdEIsUUFBUSxFQUFFLE1BQU0sQ0FBQyxFQUFFO1lBQ25CLFdBQVcsRUFBRSw4QkFBOEI7U0FDOUMsQ0FBQzt5Q0FLMkIsMEJBQVc7WUFDakIsdUJBQWM7T0FMeEIsbUJBQW1CLENBYS9CO0lBQUQsMEJBQUM7Q0FBQSxBQWJELElBYUM7QUFiWSxrREFBbUIiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBDb21wb25lbnQsIE9uSW5pdCB9IGZyb20gXCJAYW5ndWxhci9jb3JlXCI7XHJcbmltcG9ydCB7IEFjdGl2YXRlZFJvdXRlIH0gZnJvbSBcIkBhbmd1bGFyL3JvdXRlclwiO1xyXG5cclxuaW1wb3J0IHsgSXRlbSB9IGZyb20gXCIuLi9zaGFyZWQvbW9kZWxzL2l0ZW1cIjtcclxuaW1wb3J0IHsgSXRlbVNlcnZpY2UgfSBmcm9tIFwiLi4vc2hhcmVkL3NlcnZpY2VzL2l0ZW0uc2VydmljZVwiO1xyXG5cclxuQENvbXBvbmVudCh7XHJcbiAgICBzZWxlY3RvcjogXCJucy1kZXRhaWxzXCIsXHJcbiAgICBtb2R1bGVJZDogbW9kdWxlLmlkLFxyXG4gICAgdGVtcGxhdGVVcmw6IFwiLi9pdGVtLWRldGFpbC5jb21wb25lbnQuaHRtbFwiLFxyXG59KVxyXG5leHBvcnQgY2xhc3MgSXRlbURldGFpbENvbXBvbmVudCBpbXBsZW1lbnRzIE9uSW5pdCB7XHJcbiAgICBpdGVtOiBJdGVtO1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKFxyXG4gICAgICAgIHByaXZhdGUgaXRlbVNlcnZpY2U6IEl0ZW1TZXJ2aWNlLFxyXG4gICAgICAgIHByaXZhdGUgcm91dGU6IEFjdGl2YXRlZFJvdXRlXHJcbiAgICApIHsgfVxyXG5cclxuICAgIG5nT25Jbml0KCk6IHZvaWQge1xyXG4gICAgICAgIGNvbnN0IGlkID0gK3RoaXMucm91dGUuc25hcHNob3QucGFyYW1zW1wiaWRcIl07XHJcbiAgICAgICAgdGhpcy5pdGVtID0gdGhpcy5pdGVtU2VydmljZS5nZXRJdGVtKGlkKTtcclxuICAgICAgICBjb25zb2xlLmxvZyhgJHt0aGlzLml0ZW0uaWR9YCk7XHJcbiAgICB9XHJcbn1cclxuIl19