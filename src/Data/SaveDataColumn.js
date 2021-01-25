class SaveDataColumn {

    constructor(element_id,unique_id,user_saved_name,delete_able) {
        this.element_id=element_id;
        this.unique_id=unique_id;
        this.user_saved_name=user_saved_name;
        this.delete_able=delete_able;
    }

    //Json用に整形して文字列にする
    ToStr(){
        let contain = "";
        contain+="\t\t\"element_id\":"+this.element_id+",\n";
        contain+="\t\t\"unique_id\":"+this.unique_id+",\n";
        contain+="\t\t\"user_saved_name\":\""+this.user_saved_name+"\",\n";
        contain+="\t\t\"delete_able\":"+this.delete_able+"\n";
        return contain;
    }
}