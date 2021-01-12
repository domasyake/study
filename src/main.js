
document.addEventListener('DOMContentLoaded', InitOnDomLoad)

var text_controller;

async function InitOnDomLoad() {
    let column_json = await getJsonData("data/Column.json");
    let column=[];
    for (let i=0;i<column_json.data;i++){
        column.push(new ColumnData(column_json.data[i]))
    }

    let debug_mode=true;
    let save_data_manager=new SaveDataManager(debug_mode);
    save_data_manager.Load();

    let card_controller = new FunctionCardController(save_data_manager);
    let moveable_controller=new MoveAbleCardRootController();
    const split_controller=new SplitController(column_json.data,save_data_manager);
    let media_controller=new MediaController(document.getElementById("control_area"));
    let hint_controller=new HintController(
        document.getElementById("hint_button"),
        document.getElementById("hint_text"),
        save_data_manager,
        split_controller
    );
    text_controller = new TextController(
        split_controller,
        media_controller,
        moveable_controller,
        hint_controller,
        save_data_manager
    );

    await text_controller.LoadData("script/test.csv");
    text_controller.StartChat();

    // let step_manager=new StepManager(text_controller,save_data_manager);
    // step_manager.StartStep();
}