class AssistCard
{
    constructor(cards_root,user_saved_name,data)
    {
        let value=user_saved_name;
        this.submit_event=new Rx.Subject();
        this.card_root=document.createElement("div");
        this.data=data;
        this.card_root.className="assist_card";
        let img=document.createElement("img");
        img.className="assist_card_img";
        img.src="img/assist_card.png";
        this.card_root.appendChild(img);


        let text=document.createElement("p");
        text.className="assist_card_text"
        text.innerText=value;
        this.card_root.appendChild(text);

        if(data.child_category.length>0){
            let pin=document.createElement("img");
            pin.className="moveable_pin";
            pin.src="img/move_able_pin.png";
            this.card_root.appendChild(pin);

            let holder=document.createElement("div");
            holder.className="as_child_root";
            this.holder=holder;
            this.card_root.appendChild(holder);
        }else{
            this.holder=null;
        }



        cards_root.appendChild(this.card_root);
    }
}