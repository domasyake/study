class ColumnData{

    constructor(json_obj) {
        this.element_id=json_obj.element_id;
        this.system_name=json_obj.system_name;
        this.category=json_obj.category;
        this.priority=json_obj.priority;
        this.similar_words=json_obj.similar_words;
        this.help_text=json_obj.help_text;
        this.research_help_words=json_obj.research_help_words;
    }
}