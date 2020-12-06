class SaveDataColumn {

    constructor(element_id,unique_id,user_saved_name) {
        this.element_id=element_id;
        this.unique_id=unique_id;
        this.user_saved_name=user_saved_name;
    }

    ToStr(){
        let contain = "";
        contain+="\t\t\"element_id\":"+this.element_id+",\n"
        contain+="\t\t\"unique_id\":"+this.unique_id+",\n"
        contain+="\t\t\"user_saved_name\":\""+this.user_saved_name+"\"\n"
        return contain;
    }
}