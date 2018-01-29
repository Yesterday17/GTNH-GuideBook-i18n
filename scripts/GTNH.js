/**
 * Processes the conent and output Ans.
 * 
 * @param {*String} content the content sent by ajax
 * @param {*Boolean} enUS Set True if you want to export the en_US.lang
 * @param {*Boolean} save Set True if you want to save the file.
 */
function process(content, enUS = false, save = true) {
    var ans = "",
        format_questDatabase = "gtnh.quest#.name=&\ngtnh.quest#.desc=%\n",
        format_questLines = "gtnh.line#.name=&\ngtnh.line#.desc=%\n";
    data = JSON.parse(content);

    if(!save) return data;

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

    saveFile(ans, data, enUS);
}

function saveFile(ans, data, enUS){
    saveAs(new Blob([ans], { type: "text/plain;charset=utf-8" }), enUS == true ? "en_US.lang" : "result.lang");
    saveAs(new Blob([JSON.stringify(data, null, 4)], { type: "text/plain;charset=utf-8" }), "DefaultQuests.json");
}

/**
 * Compare two jsons and work out the difference.
 * @param {*} former The former one.
 * @param {*} latter The latter one.
 */
function compare(former, latter) {
    var data_former = process(former, true, false),
        data_latter = process(latter, true, false),
        report = "";

    for (var j in data_latter.questDatabase) {
        var match = false;

        for (var i in data_former.questDatabase){
            if (data_former.questDatabase[i].name == data_latter.questDatabase[j].name){
                match = true;
                
                if (data_former.questDatabase[i].description == data_latter.questDatabase[j].description){
                    console.log("Quest." + data_latter.questDatabase[j].questID + " matched Quest." + data_former.questDatabase[i].questID + " completely!")
                    report += "\n" + "Quest." + data_latter.questDatabase[j].questID + " matched Quest." + data_former.questDatabase[i].questID + " completely!";
                }
                else {
                    console.log("Quest." + data_latter.questDatabase[j].questID + " matched Quest." + data_former.questDatabase[i].questID + " in title!");
                    report += "\n" + "Quest." + data_latter.questDatabase[j].questID + " matched Quest." + data_former.questDatabase[i].questID + " in title!";
                }
                break;
            }
            else if (data_former.questDatabase[i].description == data_latter.questDatabase[j].description){
                match = true;
                console.log("Quest." + data_latter.questDatabase[j].questID + " matched Quest." + data_former.questDatabase[i].questID + " in description!");
                report += "\n" + "Quest." + data_latter.questDatabase[j].questID + " matched Quest." + data_former.questDatabase[i].questID + " in description!";
                break;
            }
        }

        if (!match) {
            console.log("Quest." + data_latter.questDatabase[j].questID + " not matched!");
            report += "\n" + "Quest." + data_latter.questDatabase[j].questID + " not matched!";
        }
    }
    saveAs(new Blob([report], { type: "text/plain;charset=utf-8" }), "report.log");
}

var init = function (addr, enUS) {
    $.ajax({
        url: addr,
        type: 'GET'
    }).success(function (gistData) {
        process(gistData, enUS, true);
    }).error(function (e) {
        console.error(e);
    });
}

var parse = function (version, enUS) {
    init("https://raw.githubusercontent.com/GTNewHorizons/NewHorizons/" + version + "/config/betterquesting/DefaultQuests.json", enUS);
};

var update = function (old_version, new_version) {
    $.ajax({
        url: "https://raw.githubusercontent.com/GTNewHorizons/NewHorizons/" + old_version + "/config/betterquesting/DefaultQuests.json",
        type: 'GET'
    }).success(function (former) {
        $.ajax({
            url: "https://raw.githubusercontent.com/GTNewHorizons/NewHorizons/" + new_version + "/config/betterquesting/DefaultQuests.json",
            type: 'GET'
        }).success(function (latter) {
            compare(former, latter);
        });
    });
};
