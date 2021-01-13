class MoveableCard{

    constructor(list_root,user_saved_name,data,move_able) {
        let value=user_saved_name;
        var root=document.createElement("div");
        console.log("category:"+data.category)
        this.current_root=list_root;
        this.card_root=root;
        this.data=data;
        this.holder=null;
        this.element_id=data.element_id;
        let on_move_end=new Rx.Subject();
        this.onMoveEnd=on_move_end;
        this.card_root.className="moveable_card";

        let img=document.createElement("img");
        img.className="moveable_card_img";
        img.src="img/moveable_card.png";
        this.card_root.appendChild(img);


        let text=document.createElement("p");
        text.className="moveable_card_text"
        text.innerText=value;
        this.card_root.appendChild(text);

        list_root.appendChild(this.card_root);

        //Holder処理
        if(data.child_category.length>0){
            let pin=document.createElement("img");
            pin.className="moveable_pin";
            pin.src="img/move_able_pin.png";
            this.card_root.appendChild(pin);

            let holder=document.createElement("div");
            holder.className="mv_child_root moveable_decide_holder";
            this.card_root.appendChild(holder);

            this.holder=new MoveAbleListHolderUnit(holder);
            this.card_root.id=this.element_id;
            return;
        }

        //移動処理
        let styles=getComputedStyle(this.card_root);
        let mouseup_events = Rx.Observable.fromEvent(document, 'mouseup');
        let mousemove_events = Rx.Observable.fromEvent(document, 'mousemove');
        let mousedown_events = Rx.Observable.fromEvent(this.card_root, 'mousedown');

        // mousedown_events.subscribe(_=>console.log("移動開始"+data.user_saved_name));
        // mouseup_events.subscribe(_=>console.log("移動終了"+data.user_saved_name));
        let in_move=false;
        let source = mousedown_events
            .filter(_=>move_able.move_able)
            .flatMap(function(event) {
                in_move=true;
                move_able.SetMoveAble(false);
                var start_left, start_pageX, start_pageY, start_top;
                start_pageX = event.pageX;
                start_pageY = event.pageY;
                start_left = parseInt(styles.getPropertyValue('left'));
                start_top = parseInt(styles.getPropertyValue('top'));
                root.classList.add('mv_hovering');
                return mousemove_events.map(function(e) {
                    return {
                        left: start_left + (e.pageX - start_pageX),
                        top: start_top + (e.pageY - start_pageY),
                        global:root.getBoundingClientRect()
                    };
            }).takeUntil(mouseup_events);
        });

        mouseup_events.filter(_=>in_move).subscribe(function() {
            on_move_end.onNext();
            in_move=false;
            root.classList.remove('mv_hovering');
        });

        source.subscribe(function(pos) {
            TweenMax.set(root, {
                left: pos.left,
                top: pos.top
            });
        });
    }

    ReSetPosition(){
        TweenMax.set(this.card_root, {
            left: 0,
            top: 0
        });
    }

    GetMyPositionY(){
        return window.pageYOffset+this.card_root.getBoundingClientRect().top;
    }

    SetOrder(order){
        this.card_root.style.order=order;
    }

    SetNewRoot(new_root){
        this.current_root=new_root;
    }
}

class MoveAbleProperty{
    constructor() {
        this.move_able=true;
    }

    SetMoveAble(able){
        this.move_able=able;
    }
}