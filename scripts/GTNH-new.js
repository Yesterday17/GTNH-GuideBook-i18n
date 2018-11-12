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
    // save UUIDLeast:4 and UUIDMost:4
    content = content.replace(/"UUIDLeast:4": ([^,]+)/g, '"UUIDLeast:4": "$1"');
    content = content.replace(/"UUIDMost:4": ([^,]+)/g, '"UUIDMost:4": "$1"');
    data = JSON.parse(content);
  
    if (!save) return data;
  
    ans +=
      "#################################Quests#################################\n\n";
    for (var i in data.questDatabase) {
      (function(design) {
        var id = data.questDatabase[i].questID,
          tmp = design
            .replace(/#/g, id)
            .replace(/&/g, enUS == true ? data.questDatabase[i].name : "")
            .replace(
              /%/g,
              enUS == true
                ? data.questDatabase[i].description.replace(/\n/g, "\\n")
                : ""
            );
  
        ans +=
          "#Quest_" + id + "." + data.questDatabase[i].name + "\n" + tmp + "\n";
        data.questDatabase[i].name = "gtnh.quest" + id + ".name";
        data.questDatabase[i].description = "gtnh.quest" + id + ".desc";
      })(format_questDatabase);
    }
    ans +=
      "##################################Line##################################\n\n";
    for (var i in data.questLines) {
      (function(design) {
        var tmp = design
          .replace(/#/g, i)
          .replace(/&/g, enUS == true ? data.questLines[i].name : "")
          .replace(
            /%/g,
            enUS == true
              ? data.questLines[i].description.replace(/\n/g, "\\n")
              : ""
          );
  
        ans += "#" + data.questLines[i].name + "\n" + tmp + "\n";
        data.questLines[i].name = "gtnh.line" + i + ".name";
        data.questLines[i].description = "gtnh.line" + i + ".desc";
      })(format_questLines);
    }
  
    saveFile(ans, data);
  }
  
  function saveFile(ans, data) {
    console.log(ans);
    var book = JSON.stringify(data, null, 4);
    book = book.replace(/"UUIDLeast:4": "([^,]+)"/g, '"UUIDLeast:4": $1');
    book = book.replace(/"UUIDMost:4": "([^,]+)"/g, '"UUIDMost:4": $1');
    console.log(book);
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
  
      for (var i in data_former.questDatabase) {
        if (
          data_former.questDatabase[i].name == data_latter.questDatabase[j].name
        ) {
          match = true;
  
          if (
            data_former.questDatabase[i].description ==
            data_latter.questDatabase[j].description
          ) {
            report +=
              "\n" +
              "Quest." +
              data_latter.questDatabase[j].questID +
              " matched Quest." +
              data_former.questDatabase[i].questID +
              " completely!";
          } else {
            report +=
              "\n" +
              "Quest." +
              data_latter.questDatabase[j].questID +
              " matched Quest." +
              data_former.questDatabase[i].questID +
              " in title!";
          }
          break;
        } else if (
          data_former.questDatabase[i].description ==
          data_latter.questDatabase[j].description
        ) {
          match = true;
          report +=
            "\n" +
            "Quest." +
            data_latter.questDatabase[j].questID +
            " matched Quest." +
            data_former.questDatabase[i].questID +
            " in description!";
          break;
        }
      }
  
      if (!match) {
        report +=
          "\n" +
          "Quest." +
          data_latter.questDatabase[j].questID +
          " not matched!";
      }
    }
    console.log(report);
  }
  
  var init = function(addr, enUS) {
    $.ajax({
      url: addr,
      type: "GET"
    })
      .success(function(gistData) {
        process(gistData, enUS, true);
      })
      .error(function(e) {
        console.error(e);
      });
  };
  
  /**
   * Generate DefaultQuests.json and lang file.
   * @param {*} enUS whether to generate enUS, or an empty lang file with only key and no value
   */
  var parse = function(enUS) {
    init(
      "https://raw.githubusercontent.com/GTNewHorizons/NewHorizons/master/config/betterquesting/DefaultQuests.json",
      enUS
    );
  };
  
  /**
   * Generate report for lang key migration
   * @param {*} old_version
   */
  var update = function(old_version) {
    $.ajax({
      url:
        "https://raw.githubusercontent.com/GTNewHorizons/NewHorizons/" +
        old_version +
        "/config/betterquesting/DefaultQuests.json",
      type: "GET"
    }).success(function(former) {
      $.ajax({
        url:
          "https://raw.githubusercontent.com/GTNewHorizons/NewHorizons/master/config/betterquesting/DefaultQuests.json",
        type: "GET"
      }).success(function(latter) {
        compare(former, latter);
      });
    });
  };
  