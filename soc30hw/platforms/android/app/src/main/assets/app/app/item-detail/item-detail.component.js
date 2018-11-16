"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var router_1 = require("@angular/router");
var item_service_1 = require("../shared/services/item.service");
var ItemDetailComponent = /** @class */ (function () {
    function ItemDetailComponent(itemService, route, router) {
        this.itemService = itemService;
        this.route = route;
        this.router = router;
    }
    ItemDetailComponent.prototype.ngOnInit = function () {
        var id = +this.route.snapshot.params['id'];
        this.item = this.itemService.getItem(id);
        /*
        application.android.on(application.AndroidApplication.activityBackPressedEvent, (args: any) => {
            args.cancel = true;
            this.goBack();
        });
        */
    };
    ItemDetailComponent.prototype.goBack = function () {
        this.router.navigate([
            'navigation', { outlets: { itemsoutlet: ['items'] } }
        ]);
    };
    ItemDetailComponent = __decorate([
        core_1.Component({
            selector: "ns-details",
            moduleId: module.id,
            templateUrl: "./item-detail.component.html",
        }),
        __metadata("design:paramtypes", [item_service_1.ItemService,
            router_1.ActivatedRoute,
            router_1.Router])
    ], ItemDetailComponent);
    return ItemDetailComponent;
}());
exports.ItemDetailComponent = ItemDetailComponent;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaXRlbS1kZXRhaWwuY29tcG9uZW50LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiaXRlbS1kZXRhaWwuY29tcG9uZW50LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsc0NBQWtEO0FBQ2xELDBDQUF5RDtBQUl6RCxnRUFBOEQ7QUFPOUQ7SUFHSSw2QkFDWSxXQUF3QixFQUN4QixLQUFxQixFQUNyQixNQUFjO1FBRmQsZ0JBQVcsR0FBWCxXQUFXLENBQWE7UUFDeEIsVUFBSyxHQUFMLEtBQUssQ0FBZ0I7UUFDckIsV0FBTSxHQUFOLE1BQU0sQ0FBUTtJQUN0QixDQUFDO0lBRUwsc0NBQVEsR0FBUjtRQUNJLElBQU0sRUFBRSxHQUFHLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxRQUFRLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxDQUFDO1FBQzdDLElBQUksQ0FBQyxJQUFJLEdBQUcsSUFBSSxDQUFDLFdBQVcsQ0FBQyxPQUFPLENBQUMsRUFBRSxDQUFDLENBQUM7UUFDekM7Ozs7O1VBS0U7SUFDTixDQUFDO0lBRUQsb0NBQU0sR0FBTjtRQUNJLElBQUksQ0FBQyxNQUFNLENBQUMsUUFBUSxDQUFDO1lBQ2pCLFlBQVksRUFBRSxFQUFDLE9BQU8sRUFBRSxFQUFFLFdBQVcsRUFBRSxDQUFDLE9BQU8sQ0FBQyxFQUFDLEVBQUM7U0FDckQsQ0FBQyxDQUFBO0lBQ04sQ0FBQztJQXhCUSxtQkFBbUI7UUFML0IsZ0JBQVMsQ0FBQztZQUNQLFFBQVEsRUFBRSxZQUFZO1lBQ3RCLFFBQVEsRUFBRSxNQUFNLENBQUMsRUFBRTtZQUNuQixXQUFXLEVBQUUsOEJBQThCO1NBQzlDLENBQUM7eUNBSzJCLDBCQUFXO1lBQ2pCLHVCQUFjO1lBQ2IsZUFBTTtPQU5qQixtQkFBbUIsQ0F5Qi9CO0lBQUQsMEJBQUM7Q0FBQSxBQXpCRCxJQXlCQztBQXpCWSxrREFBbUIiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBDb21wb25lbnQsIE9uSW5pdCB9IGZyb20gXCJAYW5ndWxhci9jb3JlXCI7XHJcbmltcG9ydCB7IEFjdGl2YXRlZFJvdXRlLCBSb3V0ZXIgfSBmcm9tIFwiQGFuZ3VsYXIvcm91dGVyXCI7XHJcbi8vIGltcG9ydCAqIGFzIGFwcGxpY2F0aW9uIGZyb20gXCJ0bnMtY29yZS1tb2R1bGVzL2FwcGxpY2F0aW9uXCI7XHJcblxyXG5pbXBvcnQgeyBJdGVtIH0gZnJvbSBcIi4uL3NoYXJlZC9tb2RlbHMvaXRlbVwiO1xyXG5pbXBvcnQgeyBJdGVtU2VydmljZSB9IGZyb20gXCIuLi9zaGFyZWQvc2VydmljZXMvaXRlbS5zZXJ2aWNlXCI7XHJcblxyXG5AQ29tcG9uZW50KHtcclxuICAgIHNlbGVjdG9yOiBcIm5zLWRldGFpbHNcIixcclxuICAgIG1vZHVsZUlkOiBtb2R1bGUuaWQsXHJcbiAgICB0ZW1wbGF0ZVVybDogXCIuL2l0ZW0tZGV0YWlsLmNvbXBvbmVudC5odG1sXCIsXHJcbn0pXHJcbmV4cG9ydCBjbGFzcyBJdGVtRGV0YWlsQ29tcG9uZW50IGltcGxlbWVudHMgT25Jbml0IHtcclxuICAgIGl0ZW06IEl0ZW07XHJcblxyXG4gICAgY29uc3RydWN0b3IoXHJcbiAgICAgICAgcHJpdmF0ZSBpdGVtU2VydmljZTogSXRlbVNlcnZpY2UsXHJcbiAgICAgICAgcHJpdmF0ZSByb3V0ZTogQWN0aXZhdGVkUm91dGUsXHJcbiAgICAgICAgcHJpdmF0ZSByb3V0ZXI6IFJvdXRlclxyXG4gICAgKSB7IH1cclxuXHJcbiAgICBuZ09uSW5pdCgpOiB2b2lkIHtcclxuICAgICAgICBjb25zdCBpZCA9ICt0aGlzLnJvdXRlLnNuYXBzaG90LnBhcmFtc1snaWQnXTtcclxuICAgICAgICB0aGlzLml0ZW0gPSB0aGlzLml0ZW1TZXJ2aWNlLmdldEl0ZW0oaWQpO1xyXG4gICAgICAgIC8qXHJcbiAgICAgICAgYXBwbGljYXRpb24uYW5kcm9pZC5vbihhcHBsaWNhdGlvbi5BbmRyb2lkQXBwbGljYXRpb24uYWN0aXZpdHlCYWNrUHJlc3NlZEV2ZW50LCAoYXJnczogYW55KSA9PiB7XHJcbiAgICAgICAgICAgIGFyZ3MuY2FuY2VsID0gdHJ1ZTtcclxuICAgICAgICAgICAgdGhpcy5nb0JhY2soKTtcclxuICAgICAgICB9KTtcclxuICAgICAgICAqL1xyXG4gICAgfVxyXG5cclxuICAgIGdvQmFjaygpIHtcclxuICAgICAgICB0aGlzLnJvdXRlci5uYXZpZ2F0ZShbXHJcbiAgICAgICAgICAgICduYXZpZ2F0aW9uJywge291dGxldHM6IHsgaXRlbXNvdXRsZXQ6IFsnaXRlbXMnXX19XHJcbiAgICAgICAgXSlcclxuICAgIH1cclxufVxyXG4iXX0=