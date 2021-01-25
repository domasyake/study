
document.addEventListener('DOMContentLoaded', InitOnDomLoad)
window.onload=windowLoad;

var text_controller;
let save_data_manager;

async function InitOnDomLoad() {
    let column_json = await getJsonData("data/Column.json");
    let column=[];
    for (let i=0;i<column_json.data;i++){
        column.push(new ColumnData(column_json.data[i]))
    }

    save_data_manager=new SaveDataManager(false);
    save_data_manager.Load();

    let card_controller = new FunctionCardController(save_data_manager);
    let moveable_controller=new MoveAbleCardRootController(save_data_manager,column_json.data);
    const split_controller=new SplitController(column_json.data,save_data_manager);
    let assist_controller=new AssistCardController(column_json.data,save_data_manager);
    let media_controller=new MediaController(document.getElementById("control_area"));

    text_controller = new TextController(
        split_controller,
        media_controller,
        moveable_controller,
        save_data_manager,
        assist_controller
    );

    //await text_controller.LoadData("script/test.csv");
    //text_controller.StartChat();


}

function windowLoad() {
    let step_manager=new StepManager(text_controller,save_data_manager);
    step_manager.StartStep();
}
