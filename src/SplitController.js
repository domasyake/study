class SplitController{

    constructor(column,save_data_manager,card_controller) {
        this.column=column;
        this.save_data_manager=save_data_manager;
        this.card_controller=card_controller;

        this.split_data=null;
        card_controller.delete_event
            .subscribe(val=>{
                this.save_data_manager.deleteAtTable(val);
            })

        this.loadJson();
    }

    async loadJson(){
        this.split_data=await getJsonData("data/SplitData.json");
    }

    checkWord(word){
        console.log("入力"+word);
        let target=this.column.find(n=>n.similar_words.some(m=>m===word));
        if (target !== undefined) {
            //成功処理
            this.save_data_manager.pushTable(target.element_id,word);
            return this.split_data.agree;
        } else {
            return this.split_data.disagree;
        }
    }

    checkComplete(){
        return false;
    }

}