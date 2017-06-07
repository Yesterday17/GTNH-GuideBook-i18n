#GregTech New Horizons Modpack Localization Project
[中文](Readme_zh.md)|[**English**](#)
##Overview
GuideBook in GTNH does not support i18n due to its hardcode. However, the mod `BetterQuesting` does support localization in a difficult way(I think, because it has almost no tutorial at all.)  
So this project was launched to help solve the problem. Though the mod supports, the guidebook file of the modpack GTNH has to be overwritten to adapt the newly added i18n features.  

---
##Installation
First, you need to enter the location: `<YourModPackLocation>\config\betterquesting\`, which is the configuration folder of the questbook mod(Better Questing).  
Then, overwrite the file `DefaultQuests.json` with the same file in the repository.
Finally, download the resource pack and put it to the `resourcepacks` directory of your Minecraft. Enjoy it!  


---
##For Updates
The project if for version 1.4.1.1, and it's greatly possible that it will update to newer versions. At that time, perhaps the old translation would have somewhere wrong. I'm trying to prevent it, so I'm working on a script to generate standard lang files as well as change the file `DefaultQuests.json` together. The script is available in this repository too, and i would update it as soon as possible to make it available for the next update.  

---
##Special Attentions
It is notable that if you've overwritten the Quest Json without activating this resources pack, all the columns in the game would be unreadable. To prevent this situation, you can either add the resourcepack or put the file `en_US.lang` to a special folder(Not implemented yet... ). Then all the things would back on track.

---
##Contributors
[@Yesterday17](https://github.com/yesterday17), ...(To be added).