"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var router_1 = require("nativescript-angular/router");
var navigation_component_1 = require("./navigation/navigation.component");
var items_component_1 = require("./item/items.component");
var item_detail_component_1 = require("./item-detail/item-detail.component");
var calender_component_1 = require("./calender/calender.component");
var routes = [
    // {path: '', redirectTo: '/login', pathMatch: 'full' },
    { path: '', redirectTo: '/navigation/(itemsoutlet:items//calenderoutlet:calender)', pathMatch: 'full' },
    { path: 'navigation', component: navigation_component_1.NavigationComponent, children: [
            { path: 'items', component: items_component_1.ItemsComponent, outlet: 'itemsoutlet' },
            { path: 'items/:id', component: item_detail_component_1.ItemDetailComponent, outlet: 'itemsoutlet' },
            { path: 'calender', component: calender_component_1.CalenderComponent, outlet: 'calenderoutlet' },
        ] }
    // { path: "", redirectTo: "/items", pathMatch: "full" }, 
    // { path: "items", component: ItemsComponent },
    // { path: "item/:id", component: ItemDetailComponent },
];
var AppRoutingModule = /** @class */ (function () {
    function AppRoutingModule() {
    }
    AppRoutingModule = __decorate([
        core_1.NgModule({
            imports: [router_1.NativeScriptRouterModule.forRoot(routes)],
            exports: [router_1.NativeScriptRouterModule]
        })
    ], AppRoutingModule);
    return AppRoutingModule;
}());
exports.AppRoutingModule = AppRoutingModule;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXBwLXJvdXRpbmcubW9kdWxlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiYXBwLXJvdXRpbmcubW9kdWxlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsc0NBQXlDO0FBQ3pDLHNEQUF1RTtBQUd2RSwwRUFBd0U7QUFDeEUsMERBQXdEO0FBQ3hELDZFQUEwRTtBQUMxRSxvRUFBa0U7QUFFbEUsSUFBTSxNQUFNLEdBQVc7SUFDbkIsd0RBQXdEO0lBQ3hELEVBQUUsSUFBSSxFQUFFLEVBQUUsRUFBRSxVQUFVLEVBQUUsMERBQTBELEVBQUUsU0FBUyxFQUFFLE1BQU0sRUFBRTtJQUN2RyxFQUFFLElBQUksRUFBRSxZQUFZLEVBQUUsU0FBUyxFQUFFLDBDQUFtQixFQUFFLFFBQVEsRUFBRTtZQUM1RCxFQUFFLElBQUksRUFBRSxPQUFPLEVBQUUsU0FBUyxFQUFFLGdDQUFjLEVBQUUsTUFBTSxFQUFFLGFBQWEsRUFBQztZQUNsRSxFQUFFLElBQUksRUFBRSxXQUFXLEVBQUUsU0FBUyxFQUFFLDJDQUFtQixFQUFFLE1BQU0sRUFBRSxhQUFhLEVBQUM7WUFDM0UsRUFBRSxJQUFJLEVBQUUsVUFBVSxFQUFFLFNBQVMsRUFBRSxzQ0FBaUIsRUFBRSxNQUFNLEVBQUUsZ0JBQWdCLEVBQUM7U0FDNUUsRUFBQztJQUNKLDBEQUEwRDtJQUMxRCxnREFBZ0Q7SUFDaEQsd0RBQXdEO0NBQzNELENBQUM7QUFNRjtJQUFBO0lBQWdDLENBQUM7SUFBcEIsZ0JBQWdCO1FBSjVCLGVBQVEsQ0FBQztZQUNOLE9BQU8sRUFBRSxDQUFDLGlDQUF3QixDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUMsQ0FBQztZQUNuRCxPQUFPLEVBQUUsQ0FBQyxpQ0FBd0IsQ0FBQztTQUN0QyxDQUFDO09BQ1csZ0JBQWdCLENBQUk7SUFBRCx1QkFBQztDQUFBLEFBQWpDLElBQWlDO0FBQXBCLDRDQUFnQiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IE5nTW9kdWxlIH0gZnJvbSBcIkBhbmd1bGFyL2NvcmVcIjtcclxuaW1wb3J0IHsgTmF0aXZlU2NyaXB0Um91dGVyTW9kdWxlIH0gZnJvbSBcIm5hdGl2ZXNjcmlwdC1hbmd1bGFyL3JvdXRlclwiO1xyXG5pbXBvcnQgeyBSb3V0ZXMgfSBmcm9tIFwiQGFuZ3VsYXIvcm91dGVyXCI7XHJcblxyXG5pbXBvcnQgeyBOYXZpZ2F0aW9uQ29tcG9uZW50IH0gZnJvbSBcIi4vbmF2aWdhdGlvbi9uYXZpZ2F0aW9uLmNvbXBvbmVudFwiO1xyXG5pbXBvcnQgeyBJdGVtc0NvbXBvbmVudCB9IGZyb20gXCIuL2l0ZW0vaXRlbXMuY29tcG9uZW50XCI7XHJcbmltcG9ydCB7IEl0ZW1EZXRhaWxDb21wb25lbnQgfSBmcm9tIFwiLi9pdGVtLWRldGFpbC9pdGVtLWRldGFpbC5jb21wb25lbnRcIjtcclxuaW1wb3J0IHsgQ2FsZW5kZXJDb21wb25lbnQgfSBmcm9tIFwiLi9jYWxlbmRlci9jYWxlbmRlci5jb21wb25lbnRcIjtcclxuXHJcbmNvbnN0IHJvdXRlczogUm91dGVzID0gW1xyXG4gICAgLy8ge3BhdGg6ICcnLCByZWRpcmVjdFRvOiAnL2xvZ2luJywgcGF0aE1hdGNoOiAnZnVsbCcgfSxcclxuICAgIHsgcGF0aDogJycsIHJlZGlyZWN0VG86ICcvbmF2aWdhdGlvbi8oaXRlbXNvdXRsZXQ6aXRlbXMvL2NhbGVuZGVyb3V0bGV0OmNhbGVuZGVyKScsIHBhdGhNYXRjaDogJ2Z1bGwnIH0sXHJcbiAgICB7IHBhdGg6ICduYXZpZ2F0aW9uJywgY29tcG9uZW50OiBOYXZpZ2F0aW9uQ29tcG9uZW50LCBjaGlsZHJlbjogW1xyXG4gICAgICAgIHsgcGF0aDogJ2l0ZW1zJywgY29tcG9uZW50OiBJdGVtc0NvbXBvbmVudCwgb3V0bGV0OiAnaXRlbXNvdXRsZXQnfSxcclxuICAgICAgICB7IHBhdGg6ICdpdGVtcy86aWQnLCBjb21wb25lbnQ6IEl0ZW1EZXRhaWxDb21wb25lbnQsIG91dGxldDogJ2l0ZW1zb3V0bGV0J30sXHJcbiAgICAgICAgeyBwYXRoOiAnY2FsZW5kZXInLCBjb21wb25lbnQ6IENhbGVuZGVyQ29tcG9uZW50LCBvdXRsZXQ6ICdjYWxlbmRlcm91dGxldCd9LFxyXG4gICAgICBdfVxyXG4gICAgLy8geyBwYXRoOiBcIlwiLCByZWRpcmVjdFRvOiBcIi9pdGVtc1wiLCBwYXRoTWF0Y2g6IFwiZnVsbFwiIH0sIFxyXG4gICAgLy8geyBwYXRoOiBcIml0ZW1zXCIsIGNvbXBvbmVudDogSXRlbXNDb21wb25lbnQgfSxcclxuICAgIC8vIHsgcGF0aDogXCJpdGVtLzppZFwiLCBjb21wb25lbnQ6IEl0ZW1EZXRhaWxDb21wb25lbnQgfSxcclxuXTtcclxuXHJcbkBOZ01vZHVsZSh7XHJcbiAgICBpbXBvcnRzOiBbTmF0aXZlU2NyaXB0Um91dGVyTW9kdWxlLmZvclJvb3Qocm91dGVzKV0sXHJcbiAgICBleHBvcnRzOiBbTmF0aXZlU2NyaXB0Um91dGVyTW9kdWxlXVxyXG59KVxyXG5leHBvcnQgY2xhc3MgQXBwUm91dGluZ01vZHVsZSB7IH0iXX0=