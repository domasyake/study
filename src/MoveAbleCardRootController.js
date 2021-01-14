class MoveAbleCardRootController {

    constructor(save_data_manager,column) {
        this.initialized=false;
        this.save_data_manager=save_data_manager;
        this.column=column;
        this.moveable_root=document.getElementById("moveable_card_root");
        this.SwitchDisplay(false)
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
            cards.push(new MoveableCard(this.list_root,user_data.user_saved_name,data,move_able));
        }

        //特殊カードの処理
        let loop_card=cards.filter(n=>n.data.child_category.length>3)[0];
        my_holder.AddChild(loop_card);
        let if_cards=cards.filter(n=>n.data.child_category.length>0&&n.data.child_category.length<3);
        for (let i=0;i<if_cards.length;i++){
            loop_card.holder.AddChild(if_cards[i]);
        }

        holders=holders.concat(cards.filter(n=>n.holder!==null).map(n=>n.holder));
        this.holders=holders;

        for (let i=0;i<cards.length;i++){
            cards[i].onMoveEnd
                .subscribe(_=>{
                    let pos=cards[i].GetMyPositionY();
                    var elm=document.elementsFromPoint(mouse_pos.x,mouse_pos.y);
                    for (let j=0;j<elm.length;j++){
                        if(elm[j].className.includes("moveable_decide_holder")){
                            //一旦全部のHolderから削除
                            for(let w=0;w<holders.length;w++){
                                holders[w].RemoveChild(cards[i]);
                                if(holders[w].CheckIsMy(elm[j])){
                                    holders[w].AddChild(cards[i],mouse_pos.y);
                                    cards[i].ReSetPosition();
                                }
                            }
                            move_able.SetMoveAble(true);
                            return;
                        }
                    }
                    for(let w=0;w<holders.length;w++){
                        holders[w].RemoveChild(cards[i]);
                    }
                    list_loot.appendChild(cards[i].card_root)

                    cards[i].SetNewRoot(list_loot);
                    cards[i].ReSetPosition();
                    cards[i].SetOrder(0);
                    move_able.SetMoveAble(true);
                })
        }
    }

    CheckComplete(){

        if(!this.my_holder.my_child_cards.every(n=>n.data.parent_element.some(m=>m==-1))){
            return "配置が間違っています。ループの前後を確認してください";
        }
        let cards=this.my_holder.GetChild();
        let checker=0;
        for (let j=0;j<cards.length;j++){
            let card=cards[j];
            console.log("el_id:"+card.data.element_id+",category:"+card.data.category)
            if(card.data.child_category.length>0&&card.holder!==null){
                let child=card.holder.GetChild();
                if(!child.every(n=>n.data.parent_element.some(m=>m===card.data.element_id))||
                child.some(n=>n.data.parent_element.some(m=>m===-1)))
                {
                    return "配置が間違っています。分岐の部分や、ループの前後を確認してください";
                }
            }
            if(checker+1===card.data.category||checker===card.data.category){
                checker=card.data.category;
            }else{
                let text=card.data.move_help_text;
                if(text!==""){
                    return "順番が間違っています。以下のヒントを基に並べなおしてみてください。\n・"+text;
                }
            }
        }
        if(this.list_root.childNodes.length!==1){
            return "まだ全て配置していません";
        }
        this.save_data_manager.save_data.order=cards.map(n=>n.data.element_id);
        this.save_data_manager.Save();
        this.move_able.SetMoveAble(false);
        return "";
    }

    SwitchDisplay(flag){
        this.moveable_root.style.display=flag?"flex":"none";
    }

}