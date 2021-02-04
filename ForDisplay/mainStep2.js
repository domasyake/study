//JavaScript実行のエントリポイント。進行はTextControllerが行うので、依存関係の解決と起動だけ行う

document.addEventListener('DOMContentLoaded', InitOnDomLoad)

async function InitOnDomLoad() {
    const column_json = await getJsonData("data/Column.json");
    console.log(column_json)

    const save_data_manager=new SaveDataManager(false);
    const debug_data_json = await getJsonData("ForDisplay/Step2Data.json");
    console.log("aaaaaaaa\n"+debug_data_json)
    save_data_manager.DebugLoad(debug_data_json);

    const card_controller = new FunctionCardController(save_data_manager);
    const moveable_controller=new MoveAbleCardRootController(save_data_manager,column_json.data);
    const split_controller=new SplitController(column_json.data,save_data_manager,card_controller);
    const assist_controller=new AssistCardController(column_json.data,save_data_manager);
    const media_controller=new MediaController(document.getElementById("control_area"));

    const text_controller = new TextController(
        split_controller,
        media_controller,
        moveable_controller,
        save_data_manager,
        assist_controller
    );
    //テストデータを喋らせる
    //await text_controller.LoadData("script/test.csv");
    //text_controller.StartChat();
    const step_manager=new StepManager(text_controller,save_data_manager);
    step_manager.StartStep();
}
