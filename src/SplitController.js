//分割に関する処理を制御するルートコントローラ
class SplitController{

    constructor(column,save_data_manager,function_card_controller) {
        //データ
        this.column=column;
        this.split_data=null;
        this.current_hint_index=0;
        //サブコントローラ
        this.save_data_manager=save_data_manager;
        this.split_root=document.getElementById("function_card_root");
        this.card_controller=function_card_controller;
        this.switchable_media=new SwitchableMedia();
        this.hint_controller=new HintController(
            document.getElementById("hint_button"),
            document.getElementById("hint_text"),
            this);

        //入力
        this.on_input_submit=new Rx.Subject();
        this.input_box=document.getElementById("input_box");
        this.input_submit=document.getElementById("input_submit");
        Rx.Observable.fromEvent(this.input_submit,"click")
            .subscribe(()=>this.SubmitNextButton());

        //初期化
        this.loadJson();
        this.SwitchDisplay(false);
    }

    async loadJson(){
        this.split_data=await getJsonData("data/SplitData.json");
    }

    async checkWord(){
        const word=await this.getInput();
        console.log("入力:"+word);

        let targets=this.column
            .filter(n=>n.matches.length!==0)//length0はexample用の機能データなので除外
            .filter(n=>!this.save_data_manager.save_data.table.some(m=>m.element_id===n.element_id))//既に分解済みの機能も除外
            .map(n=>{ //マッチ結果をマップする
               return{
                   data:n,
                   match_num:n.matches.filter(m=>m.similar_words.some(k=>word.includes(k))).length
               }
            })
            .filter(n=>n.match_num>0) //１つでも条件満たしてるのだけでフィルタ
            .sort((n,m)=>{ //降順ソート
                if( n.match_num > m.match_num ) return -1;
                if( n.match_num < m.match_num ) return 1;
                return 0;
            });

        //見つかった
        if (targets.length>0) {
            //降順ソートしてるので先頭のが一番多く条件に引っ掛かってるのでマッチ
            let target=targets[0].data;
            let help_texts=[];
            console.log("TargetMatch:\n"+target.element_id)
            for (let i=0;i<target.matches.length;i++){
                //見たいしてない条件があったら助言をリストに追加
                if(!target.matches[i].similar_words.some(n=>word.includes(n))){
                    help_texts.push(target.matches[i].help_text);
                }
            }
            //例外条件判定
            for (let i=0;i<target.irregular_matches.length;i++){
                if(target.irregular_matches[i].similar_words.some(n=>word.includes(n))){
                    console.log("irregular match text:"+target.matches[i].help_text)
                    help_texts.push(target.irregular_matches[i].help_text);
                }
            }
            //助言が一個もなかったら成功
            if(help_texts.length===0){
                console.log("成功");
                this.save_data_manager.pushTable(target.element_id,word,true);
                this.card_controller.addCard(target.element_id,word,true);
                this.resetInput();
                return this.split_data.agree;
            }else{
                let res=this.split_data.near;
                if(help_texts.length>2){
                    help_texts.splice(0,1).filter(n=>n!=="").forEach(n=>res+="\n・"+n);
                }else{
                    help_texts.filter(n=>n!=="").forEach(n=>res+="\n・"+n);
                }
                return res;
            }
        } else {
            return this.split_data.disagree
        }
    }

    checkComplete(){
        //Priority3の機能のElementIdが全てSaveDataにあるかチェック
        return this.column.filter(n=>n.priority===3)
            .every(n=>this.save_data_manager.save_data.table
            .some(m=>m.element_id===n.element_id));
    }

    exampleSplit(index){
        this.SwitchDisplay(true);
        const data=this.split_data.example_func_data[index];
        for (let i=0;i<data.length;i++){
            if(this.save_data_manager.save_data.table.some(n=>n.element_id===data[i].element_id))continue;
            this.save_data_manager.pushTable(data[i].element_id,data[i].name,false);
            this.card_controller.addCard(data[i].element_id,data[i].name,false);
        }
    }

    splitForMove(){
        const data=this.split_data.for_move_func_data;
        for (let i=0;i<data.length;i++){
            if(this.save_data_manager.save_data.table.some(n=>n.element_id===data[i].element_id))continue;
            this.save_data_manager.pushTable(data[i].element_id,data[i].name,false);
        }
    }

    getHint(){
        const filtered=this.column.filter(n=>!this.save_data_manager.save_data.table
            .some(m=>m.element_id===n.element_id))
            .filter(n=>n.hint_text!=="");
        if(filtered.length===0){
            return "";
        }else{
            this.current_hint_index++
            if(this.current_hint_index>=filtered.length){
                this.current_hint_index=0;
            }
            return filtered[this.current_hint_index].hint_text;
        }
    }

    SwitchDisplay(flag){
        this.split_root.style.display=flag?"flex":"none";
        this.input_box.style.display=flag?"block":"none";
        this.input_submit.style.display=flag?"block":"none";
        this.hint_controller.SwitchDisplay(flag);
    }

    //== 入力周りのメソッド ==
    resetInput(){
        this.input_box.value="";
    }

    async getInput(){
        await this.on_input_submit.first().toPromise();
        this.input_submit.style.display="none";
        return String(this.input_box.value);
    }
    SubmitNextButton(){
        this.on_input_submit.onNext()
    }
}