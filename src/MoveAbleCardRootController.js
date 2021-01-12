class MoveAbleCardRootController {

    constructor() {
        let list_loot=document.getElementById("moveable_list");
        this.list_root=list_loot;
        let my_holder=new MoveAbleListHolderUnit(document.getElementById("moveable_decide"));
        this.my_holder=my_holder;
        let holders=[my_holder];

        //マウス座標監視
        let mouse_pos={x:0,y:0};
        Rx.Observable.fromEvent(document, 'mousemove')
            .subscribe(val=>{
                mouse_pos.x=val.pageX;
                mouse_pos.y=val.pageY+10;
            });

        //カード処理
        let move_able=new MoveAbleProperty();
        this.move_able=move_able;
        var cards=[
            new MoveableCard(this.list_root,{user_saved_name:"a",element_id:0,category:7,depend_element:[]},move_able),
            new MoveableCard(this.list_root,{user_saved_name:"b",element_id:0,category:3,depend_element:[]},move_able),
            new MoveableCard(this.list_root,{user_saved_name:"c",element_id:0,category:4,depend_element:[]},move_able),
            new MoveableCard(this.list_root,{user_saved_name:"d",element_id:1,category:0,depend_element:[]},move_able),
            new MoveableCard(this.list_root,{user_saved_name:"e",element_id:2,category:5,depend_element:[]},move_able),
            new MoveableCard(this.list_root,{user_saved_name:"f",element_id:2,category:6,depend_element:[]},move_able),
        ];

        //特殊カードの処理
        let loop_card=cards.filter(n=>n.element_id===1)[0];
        my_holder.AddChild(loop_card);
        let if_cards=cards.filter(n=>n.element_id===2);
        for (let i=0;i<if_cards.length;i++){
            loop_card.holder.AddChild(if_cards[i]);
        }

        holders=holders.concat(cards.filter(n=>n.holder!==null).map(n=>n.holder));
        this.holders=holders;

        for (let i=0;i<cards.length;i++){
            cards[i].onMoveEnd
                .subscribe(_=>{
                    var elm=document.elementsFromPoint(mouse_pos.x,mouse_pos.y);
                    for (let j=0;j<elm.length;j++){
                        if(elm[j].className.includes("moveable_decide_holder")){
                            console.log("見っけたぜ"+elm[j].id);
                            //一旦全部のHolderから削除
                            for(let w=0;w<holders.length;w++){
                                holders[w].RemoveChild(cards[i]);
                                if(holders[w].CheckIsMy(elm[j])){
                                    holders[w].AddChild(cards[i]);
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

                    cards[i].ReSetPosition();
                    cards[i].SetOrder(0);
                    move_able.SetMoveAble(true);
                })
        }
    }

    CheckComplete(){
        if(this.list_root.childNodes.length!==1){
            console.log("リストにまだ残ってる:"+this.list_root.childNodes.length);
            return "リストにまだある";
        }

        let cards=this.my_holder.GetChild();
        let checker=0;
        for (let j=0;j<cards.length;j++){
            let card=cards[j];
            console.log("card:"+j+",category:"+card.data.category)
            if(checker<=card.data.category){
                checker=card.data.category;
            }else{
                return "順番がおかしい";
            }
        }
        this.move_able.SetMoveAble(false);
        return "";
    }


}