class MoveAbleCardRootController {

    constructor() {
        let list_loot=document.getElementById("moveable_list");
        this.list_root=list_loot;
        let my_holder=new MoveAbleListHolderUnit(document.getElementById("moveable_decide"));

        let holders=[my_holder];

        //マウス座標監視
        let mouse_pos={x:0,y:0};
        Rx.Observable.fromEvent(document, 'mousemove')
            .subscribe(val=>{
                mouse_pos.x=val.pageX;
                mouse_pos.y=val.pageY+20;
            });

        //カード処理
        let move_able=new MoveAbleProperty();
        var cards=[new MoveableCard(this.list_root,{user_saved_name:"a",element_id:0},move_able),
            new MoveableCard(this.list_root,{user_saved_name:"b",element_id:0},move_able),
            new MoveableCard(this.list_root,{user_saved_name:"c",element_id:0},move_able),
            new MoveableCard(this.list_root,{user_saved_name:"d",element_id:1},move_able),
            new MoveableCard(this.list_root,{user_saved_name:"e",element_id:2},move_able),
            new MoveableCard(this.list_root,{user_saved_name:"f",element_id:2},move_able),
        ];

        let loop_card=cards.filter(n=>n.element_id===1)[0];
        my_holder.AddChild(loop_card);
        let if_cards=cards.filter(n=>n.element_id===2);
        for (let i=0;i<if_cards.length;i++){
            loop_card.holder.AddChild(if_cards[i]);
        }

        holders=holders.concat(cards.filter(n=>n.holder!==null).map(n=>n.holder));

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
}