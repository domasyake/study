class MoveAbleListHolderUnit
{
    constructor(decide_holder)
    {
        this.decide_holder=decide_holder;
        this.my_child_cards=[];
    }

    AddChild(child){

        this.my_child_cards.push(child);
        child.SetNewRoot(this.decide_holder);

        //Y座標で昇順ソート
        this.my_child_cards=this.my_child_cards.sort((n,m)=>{
            let n_pos=n.GetMyPositionY();
            let m_pos=m.GetMyPositionY();

            if(n_pos<m_pos)return -1;
            if(n_pos>m_pos)return 1;
            return 0;
        })
        this.decide_holder.appendChild(child.card_root);

        //並び変えて子に追加した後にorderいじらないと、先にorderで位置が変わっておかしくなる
        for (let i=0;i<this.my_child_cards.length;i++){
            this.my_child_cards[i].SetOrder(i);
        }
    }

    RemoveChild(child_card){
        this.my_child_cards=this.my_child_cards.filter(n=>n.card_root!==child_card.card_root);
    }

    CheckIsMy(decide_holder){
        return this.decide_holder===decide_holder;
    }

    GetAllChild(){
        let res=[];
        for (let i=0;i<this.my_child_cards.length;i++){
            let card=this.my_child_cards[i];
            res.push(card);
            if(card.holder!==null){
                res=res.concat(card.holder.GetAllChild());
            }
        }
        return res;
    }
}