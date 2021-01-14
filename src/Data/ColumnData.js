class ColumnData{

    constructor(json_obj) {
        this.element_id=json_obj.element_id;
        this.system_name=json_obj.system_name;
        this.category=json_obj.category;
        this.priority=json_obj.priority;
        this.parent_element=json_obj.parent_element;
        this.child_category=json_obj.child_category;
        this.matches=[];
        for (let i=0;i<json_obj.matches.length;i++){
            this.matches.push(new MatchData(json_obj.matches[i].similar_words,json_obj.matches[i].help_text))
        }
        this.irregular_matches=[];
        for (let i=0;i<json_obj.irregular_matches.length;i++){
            this.matches.push(new MatchData(json_obj.irregular_matches[i].similar_words,json_obj.matches[i].help_text))
        }
        this.hint_text=json_obj.hint_text;
        this.research_help_words=json_obj.research_help_words;
        this.move_help_text=json_obj.move_help_text;
        this.assist_text=json_obj.assist_text;
    }
}

class MatchData {

    constructor(similar_words,help_text) {
        this.similar_words=[];
        for (let i=0;i<similar_words.matches.length;i++){
            this.similar_words.push(similar_words[i])
        }
        this.help_text=help_text;
    }
}