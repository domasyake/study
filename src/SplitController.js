//分割に関する処理を制御するルートコントローラ
class SplitController{

    constructor(column,save_data_manager) {
        //データ
        this.column=column;
        this.split_data=null;
        this.current_hint_index=0;
        //サブコントローラ
        this.save_data_manager=save_data_manager;
        this.split_root=document.getElementById("function_card_root");
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
        let word=await this.getInput();
        console.log("入力:"+word);

        let targets=this.column
            .filter(n=>n.matches.length!==0)//length0はexample用の機能データなので除外
            .filter(n=>n.matches.some(m=>m.similar_words.some(k=>word.includes(k))));
        let match_num=0;
        let target=null;
        for (let i=0;i<targets.length;i++){
            let temp_target=targets[i];
            console.log("matched"+temp_target.element_id)
            if(this.save_data_manager.save_data.table.some(n=>n.element_id===temp_target.element_id)){
                continue;
            }
            let counter=0;
            for (let j=0;j<temp_target.matches.length;j++){
                if(temp_target.matches[j].similar_words.some(n=>word.includes(n))){
                    counter++;
                }
            }
            if(match_num<counter){
                target=temp_target;
                match_num=counter;
            }
        }

        //該当するのは見つかった
        if (target!==null) {
            let help_texts=[];
            console.log("TargetMatchFinal:\n"+target.element_id)
            for (let i=0;i<target.matches.length;i++){
                if(!target.matches[i].similar_words.some(n=>word.includes(n))){
                    help_texts.push(target.matches[i].help_text);
                }
            }
            for (let i=0;i<target.irregular_matches.length;i++){
                if(target.irregular_matches[i].similar_words.some(n=>word.includes(n))){
                    console.log("irregular match text:"+target.matches[i].help_text)
                    help_texts.push(target.irregular_matches[i].help_text);
                }
            }
            //成功
            if(help_texts.length===0){
                console.log("成功");
                this.save_data_manager.pushTable(target.element_id,word);
                return {mess:this.split_data.agree,success:true};
            }else{
                let res=this.split_data.near;
                if(help_texts.length>2){
                    help_texts.splice(0,1).filter(n=>n!=="").forEach(n=>res+="\n・"+n);
                }else{
                    help_texts.filter(n=>n!=="").forEach(n=>res+="\n・"+n);
                }
                return {mess:res,success:false};
            }
        } else {
            return {mess:this.split_data.disagree,success:false};
        }
    }

    checkComplete(){
        //Priority3のカラムのElementIdが全てSaveDataにあるかチェック
        return this.column.filter(n=>n.priority===3)
            .every(n=>this.save_data_manager.save_data.table
            .some(m=>m.element_id===n.element_id));
    }

    exampleSplit(index){
        const data=this.split_data.example_func_data[index];
        for (let i=0;i<data.length;i++){
            this.save_data_manager.pushTable(data[i].element_id,data[i].name);
        }
    }

    splitForMove(){
        const data=this.split_data.for_move_func_data;
        for (let i=0;i<data.length;i++){
            this.save_data_manager.pushTable(data[i].element_id,data[i].name);
        }
    }


    getHint(){
        let filted=this.column.filter(n=>!this.save_data_manager.save_data.table
            .some(m=>m.element_id===n.element_id))
            .filter(n=>n.hint_text!=="");
        if(filted.length===0){
            return "";
        }else{
            this.current_hint_index++
            if(this.current_hint_index>=filted.length){
                this.current_hint_index=0;
            }
            return filted[this.current_hint_index].hint_text;
        }
    }

    SwitchDisplay(flag){
        this.split_root.style.display=flag?"flex":"none";
        this.input_box.style.display=flag?"block":"none";
        this.input_submit.style.display=flag?"block":"none";
        this.hint_controller.SwitchDisplay(true);
    }

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