export class Item {
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
}

/*

 public userId: number, 
        public id: number, 
        public title: string,
        public completed: boolean

        */