class MoveAbleListHolderUnit
{
    constructor(decide_holder)
    {
        this.decide_holder=decide_holder;
        this.my_child_cards=[];
    }

    AddChild(child){
        this.decide_holder.appendChild(child.card_root);
        this.my_child_cards.push(child)

        this.my_child_cards=this.my_child_cards.sort((n,m)=>{
            if(n.GetMyPositionY()<m.GetMyPositionY())return -1;
            if(n.GetMyPositionY()>m.GetMyPositionY())return 1;
            return 0;
        })

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
}