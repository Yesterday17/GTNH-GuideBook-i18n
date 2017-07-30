/**
 * Processes the conent and output Ans.
 * 
 * @param {*String} content the content sent by ajax
 * @param {*Boolean} option Set True if the language file should be sorted as linear style
 * @param {*Boolean} enUS Set True if you want to export the en_US.lang
 */
function process(content, option = true, enUS = false) {
    //console.log(content);
    var ans = "",
        format_questDatabase = "gtnh.quest#.name=&\ngtnh.quest#.desc=%\n",
        format_questLines = "gtnh.line#.name=&\ngtnh.line#.desc=%\n";
    data = JSON.parse(content);

    if (option) {
        ans += "#################################Quests#################################\n\n";
        for (var i in data.questDatabase) {
            (function (design) {
                var id = data.questDatabase[i].questID,
                    tmp = design.replace(/#/g, id)
                        .replace(/&/g, enUS == true ? data.questDatabase[i].name : "")
                        .replace(/%/g, enUS == true ? data.questDatabase[i].description.replace(/\n/g, "\\n") : "")

                ans += "#Quest_" + id + "." + data.questDatabase[i].name + "\n" + tmp + "\n";
                data.questDatabase[i].name = "gtnh.quest" + id + ".name";
                data.questDatabase[i].description = "gtnh.quest" + id + ".desc";
            })(format_questDatabase);
        }
        ans += "##################################Line##################################\n\n";
        for (var i in data.questLines) {
            (function (design) {
                var tmp = design.replace(/#/g, i)
                    .replace(/&/g, enUS == true ? data.questLines[i].name : "")
                    .replace(/%/g, enUS == true ? data.questLines[i].description.replace(/\n/g, "\\n") : "")

                ans += "#" + data.questLines[i].name + "\n" + tmp + "\n";
                data.questLines[i].name = "gtnh.line" + i + ".name";
                data.questLines[i].description = "gtnh.line" + i + ".desc";
            })(format_questLines);
        }
    }
    else {
        //
    }

    //console.log(ans);
    saveAs(new Blob([ans], { type: "text/plain;charset=utf-8" }), enUS == true ? "en_US.lang" : "result.lang");
    saveAs(new Blob([JSON.stringify(data, null, 4)], { type: "text/plain;charset=utf-8" }), "DefaultQuests.json");
}

/**
 * Compare two jsons and work out the difference.
 * @param {*} former The former one.
 * @param {*} latter The latter one.
 */
function compare(former, latter) {
    var data_f = JSON.parse(former),
        data_l = JSON.parse(latter),
        f_quest = data_f.questDatabase,
        l_quest = data_l.questDatabase,
        f_line = data_f.questLines,
        l_line = data_l.questLines,
        ans = latter;

    //Initalize ans
    ans.questDatabase = [];
    ans.questLines = [];

    //Quests
    (function (f, l) {
        for (var i in f) {
            for (var j in l) {
                if (similiar(f[i], l[j], true)) {
                    //ans.questDatabase.push(l[j]);
                    console.log(f[i].name + "\n" + f[i].description);
                    console.log(l[j].name + "\n" + l[j].description);
                    break;
                }
            }
        }
    })(f_quest, l_quest);

    //Lines
    (function (f, l) {
        for (var i in f) {
            for (var j in l) {
                if (similiar(f[i], l[j], false)) {
                    console.log(f[i].name + "\n" + f[i].description);
                    console.log(l[j].name + "\n" + l[j].description);
                    break;
                }
            }
        }
    })(f_line, l_line);
}

/**
 * Judge whether the two quests/lines are alike.
 * @param {*} former The former one.
 * @param {*} latter The latter one.
 * @param {*} isQuest If the object is a quest.
 */
function similiar(former, latter, isQuest) {
    var similarity = 0;

    if (isQuest) {
        if(former.name == latter.name){
            similarity+=10;
        }
        if(former.description == latter.description){
            similarity+=10;
        }
        if(former.icon.id == latter.icon.id){
            similarity+=1;
        }
    }
    else{
        if(former.name == latter.name){
            similarity+=10;
        }
        if(former.description == latter.description){
            similarity+=10;
        }
    }

    return similarity >= 12;
}

var init = function (addr, option, enUS){
    $.ajax({
        url: addr,
        type: 'GET'
    }).success(function (gistData) {
        process(gistData, option, enUS);
    }).error(function (e) {
        console.error(e);
    });
}

var parse = function (version, option, enUS) {
    init("https://raw.githubusercontent.com/GTNewHorizons/NewHorizons/" + version + "/config/betterquesting/DefaultQuests.json", option, enUS);
};

var update = function () {
    $.ajax({
        url: "https://raw.githubusercontent.com/GTNewHorizons/NewHorizons/1.4.1.1/config/betterquesting/DefaultQuests.json",
        type: 'GET'
    }).success(function (former) {
        $.ajax({
            url: "https://raw.githubusercontent.com/GTNewHorizons/NewHorizons/1.5.0.7/config/betterquesting/DefaultQuests.json",
            type: 'GET'
        }).success(function (latter) {
            compare(former, latter);
        });
    });
};
