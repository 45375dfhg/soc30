import { Observable } from "tns-core-modules/data/observable";

export class ItemViewModel extends Observable {

    constructor() {
        super();
        this.Item = new Item(
            Date.now() + (24 * 60 * 1000),
            Date.now() + (24.5 * 60 * 1000),
            1,
            {category: 1, subcategory: 1},
            { _id: '', firstname: '', surname: '', nickname: ''},
            9999,
            '');
    }

    set Item(value: Item) {
        this.set("_item", value);
    }

    get Item(): Item {
        return this.get("_item");
    }
}

export class Item {
    // public text: string;
    public startTime: Date;
    public endTime: Date;
    public amountAide: number;
    public category: { category: number, subcategory: number }
    public distance: number;
    public createdBy: { firstname: string, surname: string, _id: string, nickname: string };
    public _id: string;
    // public closed: boolean;
    // public removed: boolean;
    public happened: boolean;

    //constructor();
    // constructor(start, end, amount, category);
    constructor(start, end, amount, category, by, dist, id) {
        this.startTime = start || Date.now() + (24 * 60 * 1000);
        this.endTime = end || Date.now() + (24.5 * 60 * 1000);
        this.amountAide = amount || 1;
        this.category = category || {category: 1, subcategory: 1};
        this.createdBy = by || { firstname: '', surname: '', _id: '', nickname: ''};
        this.distance = dist || 9999;
        this._id = id || '';
    }  
}

export class ItemBase {
    public startTime: Date;
    public amountAide: number;
    public duration: number;

    constructor(startTime, amountAide, duration) {
        this.startTime = startTime;
        this.amountAide = amountAide;
        this.duration = duration;
    }
}

/*export class Item {
    constructor(
        public amountAide,
        public _id,
        public text,
        public postalcode,
        public createdBy: { 
            _id,
            email,
            nickname    
            },
        public startTime,
        public endTime,
    ) { }
}*/

/*

 public userId: number, 
        public id: number, 
        public title: string,
        public completed: boolean

        */