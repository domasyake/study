class SaveData{

    constructor(current_step,current_line,table,order) {
        this.current_step=current_step;
        this.current_line=current_line;
        this.table=[];
        for (let i=0;i<table.length;i++){
            var item=table[i];
            this.table.push(new SaveDataColumn(item.element_id,item.unique_id,item.user_saved_name))
        }
        this.order=order;
    }

    ToStr(){
        let contain = "{\n";
        contain+="\t\"current_step\":"+this.current_step+",\n";
        contain+="\t\"current_line\":"+this.current_line+",\n";
        contain+="\t\"order\":[";
        for (let i=0;i<this.order.length;i++){
            contain+=this.order[i];
            if(i!==this.order.length-1)contain+=",";
        }
        contain+="],\n";
        contain+="\t\"tables\":[\n";
        console.log(this.table.length)
        for (let i=0;i<this.table.length;i++){
            contain+="\t{\n"+this.table[i].ToStr()+"\t}";
            if(i===this.table.length-1){
                contain+="\n"
            }else{
                contain+=",\n"
            }
        }
        contain+="\t]\n}"
        return contain;
    }
}