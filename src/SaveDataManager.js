class SaveDataManager {

    constructor(debug_mode) {
        this.save_data=null;
        this.on_update_data=new Rx.Subject();
        this.debug_mode=debug_mode;

        if(debug_mode){
            Cookies.remove('save_data');
            console.log("消しﾏｧｽ")
        }
    }

    Load(){
        let data=Cookies.get('save_data');
        console.log(data)
        if(data===undefined){
            let list = []
            this.save_data= new SaveData(1, 0, list);
            this.Save();
        }else{
            let json=JSON.parse(data);
            this.save_data=new SaveData(4,0,json.tables,json.order);
            this.Save()
        }
    }

    pushTable(element_id,name){
        let uid_max=0
        if(this.save_data.table.length!==0){
            uid_max=this.save_data.table.map(n=>n.unique_id).reduce((a,b)=>Math.max(a,b));
        }
        this.save_data.table.push(new SaveDataColumn(element_id,uid_max+1,name));
        this.on_update_data.onNext();
        this.Save();
    }

    deleteAtTable(name){
        const new_table=this.save_data.table.filter(n=>n.user_saved_name!=name);
        this.save_data.table=new_table;
        this.Save();
    }

    pushCurrentLine(line){
        this.save_data.current_line=line;
        this.Save();
    }

    Save(){
        if(this.debug_mode)return
        console.log("セーブしマァス")
        Cookies.set("save_data",this.save_data.ToStr(), { expires: 365 });
    }
}