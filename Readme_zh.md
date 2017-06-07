# GTNH手册汉化项目

[**中文**](#)|[English](Readme.md)

## 概述  
&emsp;&emsp;GTNH中的任务手册并不支持中文(连本地化都没有何来的中文可言23333)，但`BetterQuesting`Mod本身是支持本地化的。所以通过改造，理论上可以实现任务书的汉化，这也就是这个项目的目的。<br />
&emsp;&emsp;然而，虽然Mod支持，但模组包本身并不支持这一项功能，所以要经过一定的魔改（注意备份下述文件！）…… <br />

<br />

## 安装指南  
1.进入目录`<YourModPackLocation>\config\betterquesting\`，这是你任务书Mod的配置文件目录。<br />
2.使用仓库中的`DefaultQuests.json`文件替换掉原有的文件。<br />
3.下载仓库里附带的资源包（其实直接下载整个仓库也可以），安装并加载。<br />

<br />

## 关于升级
&emsp;&emsp;目前该项目适配的版本为1.4.1.1，但这个模组包很有可能继续更新下去。<br />
&emsp;&emsp;At that time, perhaps the old translation would have somewhere wrong. I'm trying to prevent it, so I'm working on a script to generate standard lang files as well as change the file `DefaultQuests.json` together. The script is available in this repository too, and i would update it as soon as possible to make it available for the next update.<br />
&emsp;&emsp;(自己写的英文懒得翻了23333)<br />

<br />

## 注意
&emsp;&emsp;如果你覆盖了`DefaultQuests.json`文件但却没有安装资源包，所有的条目都会变成鸟语且根本无法阅读。为了避免这种情况，你有两种选择：一，老老实实安装好资源包，这样你就可以愉快地玩耍了；二，将语言文件(如`en_US.lang`)移动到`betterquesting\resources\minecraft\lang`目录下(不存在的目录需要手动创建)。这样一来，所有的语言显示都会恢复正常。<br />

<br />

## 已知问题
1.汉化文件中使用两个以上的中文括号可能会导致显示错误。请尽量使用英文半角标点符号。<br />

<br />

## 鸣谢&工作人员
[@Yesterday17](https://github.com/yesterday17), ...(等待添加……).