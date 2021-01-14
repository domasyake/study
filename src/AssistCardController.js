class AssistCardController {
    constructor(column,save_data_manager,) {
        this.column=column;
        this.save_data_manager=save_data_manager;
        this.assist_root=document.getElementById("assist_card_root");
        this.card_list=document.getElementById("assist_card_list");
        this.initialized=false;
    }

    Prepare(){
        if(this.initialized)return;
        this.initialized=true;

        let cards=[];


        //とりま生成
        for (let i=0;i<this.save_data_manager.save_data.order.length;i++){
            let my_el_id=this.save_data_manager.save_data.order[i];
            let data=this.column.find(n=>n.element_id===my_el_id);
            let user_data=this.save_data_manager.save_data.table.find(n=>n.element_id===my_el_id);
            let card=new AssistCard(this.card_list,user_data.user_saved_name,data);
            card.submit_event.subscribe(_=>this.DisplayHelp(data));
            cards.push(card);
        }

        for (let i=0;i<cards.length;i++){
            let card=cards[i];
            if(card.data.parent_element.length>0){
                //ケツが直接の親
                let direct_parent=card.data.parent_element[card.data.parent_element.length-1];
                if(direct_parent===-1)continue;
                let parent_card=cards.find(n=>n.data.element_id===direct_parent);
                parent_card.holder.appendChild(card.card_root);
            }
        }
    }

    DisplayHelp(data){

    }

    SwitchDisplay(flag){
        this.assist_root.style.display=flag?"flex":"none";
    }
}