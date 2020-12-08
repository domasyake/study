class FunctionCardController {
    constructor(card_root,save_data_manager) {
        this.card_root=card_root;
        this.save_data_manager=save_data_manager;
        this.cards=[];
        this.delete_event=new Rx.Subject();


        for (let i=0;i<this.save_data_manager.save_data.table.length;i++)
        {
            const new_card=new FunctionCard(card_root,save_data_manager.save_data.table[i]);
            new_card.delete_event
                .subscribe(val=>this.delete_event.onNext(val))
            this.cards.push(new_card);
        }

        save_data_manager.on_update_data
            .subscribe(_=>{
                for (let i=0;i<this.save_data_manager.save_data.table.length;i++){
                    const item=save_data_manager.save_data.table[i];
                    if(!this.cards.some(n=>n.data.unique_id===item.unique_id)){
                        const new_card=new FunctionCard(card_root,item);
                        new_card.delete_event
                            .subscribe(val=>this.delete_event.onNext(val))
                        this.cards.push(new_card);
                    }
                }
            })
        this.delete_event
            .subscribe(val=>{
                this.save_data_manager.deleteAtTable(val);
            })
    }

    SwitchDisplay(flag){
        this.card_root.style.display=flag;
    }
}