//組立のルートコントローラ。Splitと違い、カードの操作を行うのでここでカードの制御も行う
class MoveAbleCardRootController {

    constructor(save_data_manager,column) {
        this.initialized=false;
        this.move_able_data=null;
        this.save_data_manager=save_data_manager;
        this.column=column;
        this.moveable_root=document.getElementById("moveable_card_root");
        this.check_submit=document.getElementById("check_submit");
        let on_check_submit=new Rx.Subject();
        this.on_check_submit=on_check_submit;

        Rx.Observable.fromEvent(this.check_submit,"click")
            .subscribe(()=>on_check_submit.onNext());

        this.loadJson();
        this.SwitchDisplay(false)
    }

    async loadJson(){
        this.move_able_data=await getJsonData("data/MoveAbleData.json");
    }

    Prepare(){
        if(this.initialized)return;
        this.initialized=true;
        let list_loot=document.getElementById("moveable_list");
        this.list_root=list_loot;
        let my_holder=new MoveAbleListHolderUnit(document.getElementById("moveable_decide"));
        this.my_holder=my_holder;
        let holders=[my_holder];

        this.SwitchDisplay(false);
        //マウス座標監視
        let mouse_pos={x:0,y:0};
        Rx.Observable.fromEvent(document, 'mousemove')
            .subscribe(val=>{
                mouse_pos.x=val.pageX;
                mouse_pos.y=val.pageY-15;
            });

        //カード処理
        let move_able=new MoveAbleProperty();
        this.move_able=move_able;
        let cards=[];
        for (let i=0;i<this.save_data_manager.save_data.table.length;i++){
            let user_data=this.save_data_manager.save_data.table[i];
            let data=this.column.find(n=>n.element_id===user_data.element_id);
            cards.push(new MoveAbleCard(this.list_root,user_data.user_saved_name,data,move_able));
        }

        //root直下の子を持てる機能をrootに追加
        const auto_move_cards=cards.filter(n=>this.move_able_data.auto_move_elements.includes(n.data.element_id));
        console.log("auto move "+auto_move_cards.length);

        for (let i=0;i<auto_move_cards.length;i++){
            const card=auto_move_cards[i];
            if(card.data.parent_element===-1){
                my_holder.AddChild(card);
            }else{
                const parent=cards.find(n=>n.data.element_id===card.data.parent_element);
                if(parent.holder!==null){
                    parent.holder.AddChild(card);
                }
            }
        }

        holders=holders.concat(cards.filter(n=>n.holder!==null).map(n=>n.holder));

        //階層書き換え処理
        for (let i=0;i<cards.length;i++){
            //移動終了時の座標を受け取る
            cards[i].onMoveEnd
                .subscribe(_=>{
                    //マウス座標からその地点にある要素を全て取得
                    let elm=document.elementsFromPoint(mouse_pos.x,mouse_pos.y);
                    for (let j=0;j<elm.length;j++){
                        //要素のクラスで、配置可能な要素があった場合
                        if(elm[j].className.includes("moveable_decide_holder")){
                            //一旦全部のHolderから該当カードを外しながら、該当要素を管理してるクラスを探してそこに追加
                            for(let w=0;w<holders.length;w++){
                                holders[w].RemoveChild(cards[i]);
                                //この要素は私のものです
                                if(holders[w].CheckIsMy(elm[j])){
                                    holders[w].AddChild(cards[i]);
                                    cards[i].ReSetPosition();
                                }
                            }
                            move_able.SetMoveAble(true);
                            return;
                        }
                    }
                    //ここからは配置可能なとこにおかなかった処理
                    //全部のHolderから外してリストに戻す
                    for(let j=0;j<holders.length;j++){
                        holders[j].RemoveChild(cards[i]);
                    }
                    list_loot.appendChild(cards[i].card_root);

                    cards[i].SetNewRoot(list_loot);
                    cards[i].ReSetPosition();
                    cards[i].SetOrder(0);
                    move_able.SetMoveAble(true);
                });
        }
    }

    async CheckComplete(){
        this.check_submit.style.display="block";
        await this.on_check_submit.first().toPromise();
        this.check_submit.style.display="none";

        let cards=this.my_holder.GetAllChild();
        let checker=0;
        //カテゴリ順チェック
        for (let j=0;j<cards.length;j++){
            let card=cards[j];
            console.log("checker"+checker+",el_id:"+card.data.element_id+",category:"+card.data.category)

            if(!(checker+1===card.data.category||checker===card.data.category)){
                let text=card.data.move_help_text;
                if(text!==""){
                    return this.move_able_data.order_failed.replace("func_name",card.name)+"\n・"+text;
                }
            }
            checker=card.data.category;
        }
        //親子関係チェック
        for (let j=0;j<cards.length;j++){
            let card=cards[j];
            if(card.data.child_category.length>0&&card.holder!==null){
                const child=card.holder.my_child_cards;
                const failed_child=child.filter(n=>n.data.parent_element!==card.data.element_id);
                if(failed_child.length>0)
                {
                    return this.move_able_data.structure_failed.replace("func_name",card.name).replace("num",failed_child.length);
                }
            }
        }

        //全部動かしているかどうか
        if(this.list_root.childNodes.length!==1){
            return this.move_able_data.not_moved;
        }
        //root直下にrootを親としない機能が含まれているかどうか
        if(!this.my_holder.my_child_cards.every(n=>n.data.parent_element===-1)){
            return this.move_able_data.under_root_failed;
        }
        this.save_data_manager.save_data.order=cards.map(n=>n.data.element_id);
        this.save_data_manager.Save();
        this.move_able.SetMoveAble(false);
        //全部通ったら空文字返す
        return "";
    }

    SwitchDisplay(flag){
        this.moveable_root.style.display=flag?"flex":"none";
        this.check_submit.style.display=flag?"block":"none";
    }

}