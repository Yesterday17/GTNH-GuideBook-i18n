const isNodejs = () => typeof process !== 'undefined'

if (isNodejs()) {
  // var here to expose fetch to global
  var fetch = require('node-fetch')
  var fs = require('fs')

  if (process.argv.length <= 3 || process.argv[2].match(/^-g$|^-u$/) === null) {
    console.log('BetterQuesting QuestDatabase Upgrade Tool:')
    console.log('  command: -g version')
    console.log(
      '              generate DefaultQuests.json, en_US.lang and blank.lang'
    )
    console.log('           -u old_version new_version')
    console.log(
      '              generate report.md, which helps you to upgrade the i18n file'
    )
  } else {
    switch (process.argv[2]) {
      case '-g':
        init(process.argv[3]).then(db => {
          const blank = db.genLangFile()
          const en_us = db.genLangFile(false)
          const db_i18ned = db.genI18nDB().stringify()
          fs.mkdirSync('./dist')
          fs.mkdirSync(`./dist/${process.argv[3]}`)
          fs.writeFileSync(
            `./dist/${process.argv[3]}/DefaultQuests.json`,
            db_i18ned,
            {
              encoding: 'utf-8'
            }
          )
          fs.writeFileSync(`./dist/${process.argv[3]}/en_US.lang`, en_us, {
            encoding: 'utf-8'
          })
          fs.writeFileSync(`./dist/${process.argv[3]}/blank.lang`, blank, {
            encoding: 'utf-8'
          })
        })
        break
      case '-u':
        diff(process.argv[3], process.argv[4]).then(report => {
          fs.mkdirSync('./dist')
          fs.writeFileSync(
            `./dist/report-${process.argv[3]}-to-${process.argv[4]}.md`,
            report,
            { encoding: 'utf-8' }
          )
        })
        break
    }
  }
}

async function init(version) {
  try {
    const text = await fetchDefaultQuests(version)
    if (/questDatabase:9/.test(text)) {
      // V2
      return new QuestDatabaseV2(text)
    } else {
      // V1
      return new QuestDatabaseV1(text)
    }
  } catch (e) {
    console.error(e)
  }
}

async function diff(old, latest) {
  const db_old = await init(old)
  const db_latest = await init(latest)
  return db_latest.diff(db_old)
}

class QuestDatabaseV1 {
  constructor(text) {
    this._parse(text)
    this._i18ned = false
  }

  genI18nDB() {
    if (!this._i18ned) {
      this._getQuests().forEach(quest => {
        const id = this._getQuestID(quest)
        this._setQuestName(quest, `gtnh.quest${id}.name`)
        this._setQuestDesc(quest, `gtnh.quest${id}.desc`)
      })

      this._getQuestLines().forEach(line => {
        const id = this._getQuestLineID(line)
        this._setQuestLineName(line, `gtnh.line${id}.name`)
        this._setQuestLineDesc(line, `gtnh.line${id}.desc`)
      })
      this._i18ned = true
    }
    return this
  }

  genLangFile(blank = true) {
    if (this._i18ned && blank) {
      throw new Error('cannot generate enUS lang file with questDB i18ned!')
    }

    let lang = ''

    // Quests
    lang +=
      '#################################Quests#################################\n\n'
    this._getQuests().forEach(quest => {
      const id = this._getQuestID(quest)
      const name = this._getQuestName(quest)
      const desc = this._getQuestDesc(quest).replace(/\n/g, '\\n')

      lang += `# Quest.${id} - ${name}\n`
      lang += `gtnh.quest${id}.name=${blank ? '' : name}\n`
      lang += `gtnh.quest${id}.desc=${blank ? '' : desc}\n`
      lang += '\n'
    })

    // QuestLines
    lang +=
      '##################################Line##################################\n\n'
    this._getQuestLines().forEach(line => {
      const id = this._getQuestLineID(line)
      const name = this._getQuestLineName(line)
      const desc = this._getQuestLineDesc(line).replace(/\n/g, '\\n')

      lang += `# QuestLine.${id} - ${name}\n`
      lang += `gtnh.line${id}.name=${blank ? '' : name}\n`
      lang += `gtnh.line${id}.desc=${blank ? '' : desc}\n`
      lang += '\n'
    })

    return lang
  }

  diff(db_old) {
    let report = ''
    report += `# Quests\n`
    for (const quest of this._getQuests()) {
      let added = false
      const id = this._getQuestID(quest)
      const quest_old = db_old._getQuest(id)

      if (quest_old) {
        if (this._getQuestName(quest) !== db_old._getQuestName(quest_old)) {
          report += `## Quest.${id}\n`
          report += `### Name\nfrom \`${db_old._getQuestName(
            quest_old
          )}\` to \`${this._getQuestName(quest)}\`\n`
          added = true
        }
        if (this._getQuestDesc(quest) !== db_old._getQuestDesc(quest_old)) {
          if (!added) report += `## Quest.${id}\n`
          report += `### Desc\n\`\`\`\n${db_old._getQuestDesc(
            quest_old
          )}\n\`\`\`\n to \n\`\`\`\n${this._getQuestDesc(quest)}\n\`\`\`\n`
        }
      } else {
        report += `## Quest.${id}\n`
        report += `**New Quest**\n`
        report += `### Name\n\`${this._getQuestName(quest)}\`\n`
        report += `### Desc\n\`\`\`\n${this._getQuestDesc(quest)}\n\`\`\`\n`
      }
    }

    report += '\n\n# QuestLines\n'
    for (const line of this._getQuestLines()) {
      let added = false
      const id = this._getQuestLineID(line)
      const line_old = db_old._getQuestLine(id)
      if (line_old) {
        if (
          this._getQuestLineName(line) !== db_old._getQuestLineName(line_old)
        ) {
          report += `## QuestLine.${id}\n`
          report += `### Name\nfrom \`${db_old._getQuestLineName(
            line_old
          )}\` to \`${this._getQuestLineName(line)}\`\n`
          added = true
        }
        if (
          this._getQuestLineDesc(line) !== db_old._getQuestLineDesc(line_old)
        ) {
          if (!added) report += `## QuestLine.${id}\n`
          report += `### Desc\n\`\`\`\n${db_old._getQuestLineDesc(
            line_old
          )}\n\`\`\`\n to \n\`\`\`\n${this._getQuestLineDesc(line)}\n\`\`\`\n`
        }
      } else {
        report += `## QuestLine.${id}\n`
        report += `**New QuestLine**\n`
        report += `### Name\n\`${this._getQuestLineName(line)}\`\n`
        report += `### Desc\n\`\`\`\n${this._getQuestLineDesc(line)}\n\`\`\`\n`
      }
    }
    return report
  }

  _getQuest(id) {
    for (const quest of this._getQuests()) {
      if (this._getQuestID(quest) === id) {
        return quest
      }
    }
    return undefined
  }

  _getQuestLine(id) {
    for (const line of this._getQuestLines()) {
      if (this._getQuestLineID(line) === id) {
        return line
      }
    }
    return undefined
  }

  _preprocess(text) {
    text = text.replace(/"UUIDLeast:4": ([^,]+)/g, '"UUIDLeast:4": "$1"')
    text = text.replace(/"UUIDMost:4": ([^,]+)/g, '"UUIDMost:4": "$1"')
    return text
  }

  _postprocess(text) {
    text = text.replace(/"UUIDLeast:4": "([^,]+)"/g, '"UUIDLeast:4": $1')
    text = text.replace(/"UUIDMost:4": "([^,]+)"/g, '"UUIDMost:4": $1')
    return text
  }

  _parse(text) {
    text = this._preprocess(text)
    this._json = JSON.parse(text)
    this._backup = JSON.parse(text)
  }

  stringify() {
    const text = JSON.stringify(this._json, null, 4)
    return this._postprocess(text)
  }

  _getQuests() {
    return this._json['questDatabase']
  }

  _getQuestID(quest) {
    return quest['questID']
  }

  _getQuestName(quest) {
    return quest['name']
  }

  _setQuestName(quest, text) {
    quest['name'] = text
  }

  _getQuestDesc(quest) {
    return quest['description']
  }

  _setQuestDesc(quest, text) {
    quest['description'] = text
  }

  _getQuestLines() {
    return this._json['questLines']
  }

  _getQuestLineID(line) {
    return this._json['questLines'].indexOf(line)
  }

  _getQuestLineName(line) {
    return line['name']
  }

  _setQuestLineName(line, text) {
    line['name'] = text
  }

  _getQuestLineDesc(line) {
    return line['description']
  }

  _setQuestLineDesc(line, text) {
    line['description'] = text
  }
}

class QuestDatabaseV2 extends QuestDatabaseV1 {
  constructor(text) {
    super(text)
  }

  _getQuests() {
    return Object.values(this._json['questDatabase:9'])
  }

  _getQuestID(quest) {
    return quest['questID:3']
  }

  _getQuestName(quest) {
    return quest['properties:10']['betterquesting:10']['name:8']
  }

  _setQuestName(quest, text) {
    quest['properties:10']['betterquesting:10']['name:8'] = text
  }

  _getQuestDesc(quest) {
    return quest['properties:10']['betterquesting:10']['desc:8']
  }

  _setQuestDesc(quest, text) {
    quest['properties:10']['betterquesting:10']['desc:8'] = text
  }

  _getQuestLines() {
    return Object.values(this._json['questLines:9'])
  }

  _getQuestLineID(line) {
    return line['lineID:3']
  }

  _getQuestLineName(line) {
    return line['properties:10']['betterquesting:10']['name:8']
  }

  _setQuestLineName(line, text) {
    line['properties:10']['betterquesting:10']['name:8'] = text
  }

  _getQuestLineDesc(line) {
    return line['properties:10']['betterquesting:10']['desc:8']
  }

  _setQuestLineDesc(line, text) {
    line['properties:10']['betterquesting:10']['desc:8'] = text
  }
}

/**
 * fetch DefaultQuests.json
 * @param {String} version the version, such as 2.0.7.0 or master
 */
async function fetchDefaultQuests(version) {
  const data = await fetch(
    `https://raw.githubusercontent.com/GTNewHorizons/NewHorizons/${version}/config/betterquesting/DefaultQuests.json`
  )
  return await data.text()
}
