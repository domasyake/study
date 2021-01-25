class FunctionCardController {
    constructor(save_data_manager) {
        const card_root=document.getElementById("function_card_list");
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

        this.delete_event
            .subscribe(val=>{
                this.save_data_manager.deleteAtTable(val);
            })
    }

    addCard(element_id,name,deleteable){
        const new_card=new FunctionCard(this.card_root, {user_saved_name:name,element_id:element_id,delete_able:deleteable});
        new_card.delete_event
            .subscribe(val=>this.delete_event.onNext(val))
        this.cards.push(new_card);
    }

    SwitchDisplay(flag){
        this.card_root.style.display=flag?"flex":"none";
    }
}