class SplitController{

    constructor(column,save_data_manager) {
        this.column=column;
        this.save_data_manager=save_data_manager;
        this.split_root=document.getElementById("function_card_root");
        this.switchable_media=new SwitchableMedia();

        this.split_data=null;
        this.current_hint_index=0;

        this.loadJson();
        this.SwitchDisplay(false);
    }

    async loadJson(){
        this.split_data=await getJsonData("data/SplitData.json");
    }

    checkWord(word){
        console.log("入力:"+word);

        let target=this.column
            .find(n=>n.matches.some(m=>m.similar_words.some(k=>word.includes(k))));
        if (target !== undefined) {
            //該当するのは見つかった
            let help_texts=[];
            console.log("TargetMatch:\n"+target)
            for (let i=0;i<target.matches.length;i++){
                if(!target.matches[i].similar_words.some(n=>word.includes(n))){
                    console.log("not match text:"+target.matches[i].help_text)
                    help_texts.push(target.matches[i].help_text);
                }
            }
            for (let i=0;i<target.irregular_matches.length;i++){
                if(!target.irregular_matches[i].similar_words.some(n=>word.includes(n))){
                    console.log("irregular match text:"+target.matches[i].help_text)
                    help_texts.push(target.irregular_matches[i].help_text);
                }
            }
            //成功
            if(help_texts.length===0){
                this.save_data_manager.pushTable(target.element_id,word);
                return this.split_data.agree;
            }else{
                let res=this.split_data.near;
                help_texts.forEach(n=>res+="\n"+n);
                return res;
            }
        } else {
            return this.split_data.disagree;
        }
    }

    checkComplete(){
        //Priority3のカラムのElementIdが全てSaveDataにあるかチェック
        return this.column.filter(n=>n.priority===3)
            .every(n=>this.save_data_manager.save_data.table
            .some(m=>m.element_id===n.element_id));
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
    }
}