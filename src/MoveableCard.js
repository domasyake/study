class MoveableCard{

    constructor(list_root,user_saved_name,data,move_able) {
        this.name=user_saved_name;
        const root=document.createElement("div");
        this.current_root=list_root;
        this.card_root=root;
        this.data=data;
        this.holder=null;
        this.element_id=data.element_id;
        const on_move_end=new Rx.Subject();
        this.onMoveEnd=on_move_end;
        this.card_root.className="moveable_card";

        const img=document.createElement("img");
        img.className="moveable_card_img";
        img.src="img/moveable_card.png";
        this.card_root.appendChild(img);


        const text=document.createElement("p");
        text.className="moveable_card_text"
        text.innerText=this.name;
        this.card_root.appendChild(text);

        list_root.appendChild(this.card_root);

        //子を持てる機能ならHolderを追加
        if(data.child_category.length>0){
            const pin=document.createElement("img");
            pin.className="moveable_pin";
            pin.src="img/move_able_pin.png";
            this.card_root.appendChild(pin);

            const holder=document.createElement("div");
            holder.className="mv_child_root moveable_decide_holder";
            this.card_root.appendChild(holder);

            this.holder=new MoveAbleListHolderUnit(holder);
            this.card_root.id=this.element_id;
            return;
        }

        //移動処理
        const styles=getComputedStyle(this.card_root);
        const mouseup_events = Rx.Observable.fromEvent(document, 'mouseup');
        //マウスアップはドキュメントで取らないと、マウスを画面外に持ってかれた時にドロップできない
        const mousemove_events = Rx.Observable.fromEvent(document, 'mousemove');
        const mousedown_events = Rx.Observable.fromEvent(this.card_root, 'mousedown');

        let in_move=false;//移動中フラグがないと、ドラッグされてるかどうかチェックできん
        const source = mousedown_events
            .filter(_=>move_able.move_able)//他のカードが移動中でない時
            .flatMap(function(event) {
                in_move=true;
                move_able.SetMoveAble(false);
                const start_pageX = event.pageX;
                const start_pageY = event.pageY;
                const start_left = parseInt(styles.getPropertyValue('left'));
                const start_top = parseInt(styles.getPropertyValue('top'));
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

//全カードで同じインスタンスを持って、他のカードが移動中は自分を移動できないようにする
class MoveAbleProperty{
    constructor() {
        this.move_able=true;
    }

    SetMoveAble(able){
        this.move_able=able;
    }
}