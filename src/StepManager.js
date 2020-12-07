class StepManager
{
    constructor(text_controller,save_data_manager)
    {
        this.text_controller=text_controller;
        this.save_data_manager=save_data_manager;


    }

    async StartStep()
    {
        let current_step=this.save_data_manager.save_data.current_step;
        await this.text_controller.LoadData("script/step"+current_step+".csv");
        await this.text_controller.StartChat();
        current_step++;
        if(current_step<5){
            this.save_data_manager.save_data.current_step=current_step;
            this.save_data_manager.Save();
            this.StartStep();
        }
    }
}