//分解の時の動画像の切替制御
class SwitchableMedia {

    constructor() {
        this.img=document.getElementById("sw_desc");
        this.movie=document.getElementById("sw_video");

        this.is_video=false;
        this.switcher=document.getElementById("sw_switcher");

        Rx.Observable.fromEvent(this.switcher,"click")
            .subscribe(()=>this.Switch());
    }

    Switch(){
        this.is_video=!this.is_video;
        //動画を流す
        if(this.is_video){
            this.switcher.value="仕様";
            this.img.style.display="none";
            this.movie.style.display="block";
            this.movie.currentTime=0;
            this.movie.play();
        }else{//画像を表示
            this.switcher.value="動画";
            this.movie.pause();
            this.movie.style.display="none";
            this.img.style.display="block";
        }
    }
}