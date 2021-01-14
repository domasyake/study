class AssistCardController {
    constructor(column,save_data_manager,) {
        this.column=column;
        this.save_data_manager=save_data_manager;
        this.assist_root=document.getElementById("assist_card_root");
        this.card_list=document.getElementById("assist_card_list");
        this.initialized=false;
        this.title=document.getElementById("as_help_title");
        this.word=document.getElementById("as_help_word");
        this.text=document.getElementById("as_help_text");
        this.test_hint=null;

        this.SwitchDisplay(false);
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
            card.submit_event.subscribe(_=>this.DisplayHelp(user_data.user_saved_name,data));
            cards.push(card);
            if(i===0){
                this.test_hint={title:user_data.user_saved_name,data:data};
            }
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

    DisplayHelp(title,data){
        this.title.innerText=title;
        let word="検索キーワード\n　";
        for (let i=0;i<data.research_help_words.length;i++){
            word+=data.research_help_words[i]+",";
        }
        this.word.innerText=word;
        this.text.innerText="実装アドバイス\n "+data.assist_text;
    }

    TestDisplay(){
        this.DisplayHelp(this.test_hint.title,this.test_hint.data);
    }

    SwitchDisplay(flag){
        this.assist_root.style.display=flag?"flex":"none";
    }
}