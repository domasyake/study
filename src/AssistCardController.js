//実装の時のルートコントローラ。組立同様カード制御も行う
class AssistCardController {
    constructor(column,save_data_manager) {
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

        const cards=[];

        //とりま生成
        for (let i=0;i<this.save_data_manager.save_data.order.length;i++){
            //セーブデータにはelement_idだけ並んでる
            const my_el_id=this.save_data_manager.save_data.order[i];
            //機能データ
            const func_data=this.column.find(n=>n.element_id===my_el_id);
            //セーブデータ内の機能データ
            const user_data=this.save_data_manager.save_data.table.find(n=>n.element_id===my_el_id);
            const card=new AssistCard(this.card_list,user_data.user_saved_name,func_data);
            card.submit_event.subscribe(_=>this.DisplayHelp(user_data.user_saved_name,func_data));
            cards.push(card);
            //先頭の助言データを確保。あとで入れるの面倒なのでループ内でやっちゃう
            if(i===0){
                this.test_hint={title:user_data.user_saved_name,data:func_data};
            }
        }

        //階層構造変え。組立通過してる時点で階層構造は保証されてる
        for (let i=0;i<cards.length;i++){
            const card=cards[i];
            if(card.data.parent_element!==-1){
                let parent_card=cards.find(n=>n.data.element_id===card.data.parent_element);
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