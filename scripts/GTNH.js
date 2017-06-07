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

var parse = function (option, enUS) {
    $.ajax({
        url: "https://gist.githubusercontent.com/yesterday17/4762e953fbb281c7f3011b5d07ec2a8d/raw/0e037b7aba7c68c18a3436d5104010fed2a0c251/gistfile1.txt",
        type: 'GET'
    }).success(function (gistData) {
        process(gistData, option, enUS);
    }).error(function (e) {
        console.error(e);
    });
}
