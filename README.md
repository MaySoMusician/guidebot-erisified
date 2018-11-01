# Erisified Guide Bot
An example of a **Eris** Bot Handler. Originally created by the Idiot's Guide Community.

Note: the original description says this bot has high compatibility with 2 bot by the original authors, but **it doesn't necessarily so now** because it's been fully rewritten for working on Eris.

# Originally described as follows:

Ages ago, Guide Bot was actually a little bot I had on the official discord.js server.
It helped me link to the d.js bot making guide I was building, with links.
This bot grew into something that I could show new coders and bot makers, but
over time it grew into a full framework - one that is now under the hands of a 
group of contributors, and no longer easily "understandable" by the majority
of our newbies. So I've pulled the original Guide Bot out of the mothballs,
gave it a fresh coat of paint and grease, and here it is back in its full glory!

This command handler is 98% compatible with [my [eslachance's] selfbot](https://github.com/eslachance/evie.selfbot) 
and 99% compatible with commands from [York's Tutorial Bot](https://github.com/AnIdiotsGuide/Tutorial-Bot/tree/Episode-10-Part-1).

# Now, come back to Eris World
## Requirements

- `git` command line ([Windows](https://git-scm.com/download/win)|[Linux](https://git-scm.com/book/en/v2/Getting-Started-Installing-Git)|[MacOS](https://git-scm.com/download/mac)) installed
- `node` [Version 8.0.0 or higher](https://nodejs.org)
- The node-gyp build tools. This is a pre-requisite for Enmap, but also for a **lot** of other modules. See [The Enmap Guide](https://enmap.evie.codes/install#pre-requisites) for details and requirements for your OS. Just follow what's in the tabbed block only, then come back here!

You also need your bot's token. This is obtained by creating an application in
the Developer section of discordapp.com. Check the [first section of this page in An Idiot's Guide](https://anidiots.guide/getting-started/the-long-version.html) 
for more info.

## Downloading

In a command prompt in your projects folder (wherever that may be) run the following:

`git clone https://github.com/MaySoMusician/guidebot-erisified.git`

Once finished: 

- In the folder from where you ran the git command, run `cd guidebot` and then run `npm install`
- **If you get any error about python or msibuild.exe or binding, read the requirements section again!**
- Rename or copy `config.js.example` to `config.js`
- Edit `config.js` and fill in all the relevant details as indicated in the file's comments.

## Starting the bot

To start the bot, in the command prompt, run the following command:
`node index.js`, or `npm run start`

## Inviting to a guild

To add the bot to your guild, you have to get an oauth link for it. 

You can use this site to help you generate a full OAuth Link, which includes a calculator for the permissions:
[https://finitereality.github.io/permissions-calculator/?v=0](https://finitereality.github.io/permissions-calculator/?v=0)
