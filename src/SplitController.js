class SplitController{

    constructor(column,save_data_manager) {
        this.column=column;
        this.save_data_manager=save_data_manager;

        this.split_data=null;
        console.log(this.column.map(n=>n.matches.map(m=>m.similar_words)))
        this.loadJson();
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
            console.log(target)
            for (let i=0;i<target.matches.length;i++){
                if(!target.matches[i].similar_words.some(n=>word.includes(n))){
                    console.log(target.matches[i].help_text)
                    help_texts.push(target.matches[i].help_text);
                }
            }
            //成功
            if(help_texts.length===0){
                this.save_data_manager.pushTable(target.element_id,word);
                return this.split_data.agree;
            }else{
                let res=this.split_data.near;
                help_texts.forEach(n=>res+=n);
                return res;
            }

        } else {
            return this.split_data.disagree;
        }
    }

    checkComplete(){
        return this.column.every(n=>this.save_data_manager.save_data.table
            .some(m=>m.element_id===n.element_id));
    }

    getHint(){
        let filted=this.column.filter(n=>!this.save_data_manager.save_data.table
            .some(m=>m.element_id===n.element_id))
        if(filted.length===0){
            return "";
        }else{
            return filted[Math.floor(Math.random() * (filted.length))].hint_text;
        }
    }

}