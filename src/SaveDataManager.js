class SaveDataManager {

    constructor(debug_mode) {
        this.save_data=null;
        this.on_update_data=new Rx.Subject();
        this.debug_mode=debug_mode;

        if(debug_mode){
            Cookies.remove('save_data');
            console.log("セーブデータを削除します")
        }

        document.body.addEventListener('keydown',
            event => {
                if (event.key === 'q' && event.ctrlKey) {
                    alert("セーブデータを削除しました。ページを再読み込みしてください");
                    let list = []
                    this.save_data= new SaveData(0, 0, list,[]);
                    this.Save();
                }
            });
    }

    Load(){
        const data=Cookies.get('save_data');
        console.log("読み込み完了:"+data);
        //CookieないとUndefinedになる
        if(data===undefined){
            let list = []
            this.save_data= new SaveData(1, 0, list,[]);
            this.Save();
        }else{
            let json=JSON.parse(data);
            this.save_data=new SaveData(json.current_step,json.current_line,json.tables,json.order);
            this.Save();
        }
    }

    DebugLoad(debug_data){
        Cookies.set("save_data", debug_data, {expires: 365});
        const data=Cookies.get('save_data');
        console.log("デバッグデータ読み込み完了:"+data);
        let json=JSON.parse(data);
        this.save_data=new SaveData(json.current_step,json.current_line,json.tables,json.order);
    }

    pushTable(element_id,name,delete_able){
        let uid_max=0;
        if(this.save_data.table.length!==0){
            uid_max=this.save_data.table.map(n=>n.unique_id).reduce((a,b)=>Math.max(a,b));
        }
        this.save_data.table.push(new SaveDataColumn(element_id,uid_max+1,name,delete_able));
        this.on_update_data.onNext();
        this.Save();
    }

    deleteAtTable(name){
        this.save_data.table=this.save_data.table.filter(n => n.user_saved_name !== name);
        this.Save();
    }

    pushCurrentLine(line){
        this.save_data.current_line=line;
        this.Save();
    }

    Save(){
        if(this.debug_mode)return;
        try {
            Cookies.set("save_data", this.save_data.ToStr(), {expires: 365});
        }catch{
            console.log("セーブに失敗しました");
        }
        console.log("セーブしました");
    }
}