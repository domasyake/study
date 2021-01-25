class StepManager {

    constructor(text_controller,save_data_manager)
    {
        this.text_controller=text_controller;
        this.save_data_manager=save_data_manager;
        this.step_display=document.getElementById("step");
    }

    async StartStep()
    {
        let current_step=this.save_data_manager.save_data.current_step;
        this.step_display.innerText="Step "+(current_step)+"/3";
        await this.text_controller.LoadData("script/step_"+current_step+".csv");
        await this.text_controller.StartChat();
        current_step++;
        if(current_step<5){
            this.save_data_manager.save_data.current_step=current_step;
            this.save_data_manager.save_data.current_line=0;
            this.save_data_manager.Save();
            this.StartStep();
        }
    }
}