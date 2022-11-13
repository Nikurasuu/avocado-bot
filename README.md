# avocado-bot
avocado is a discord bot written with discord.js

## Setup

### Prerequisites
- Node.js 16.0.0 or newer
  - https://nodejs.org/en/download/
- Discord Bot Token
  - [Discord Developer Portal](https://discord.com/developers/applications)

### Installation
1. Clone the repository
2. Install dependencies
   - `npm install discord.js`

### Configuration
1. Create a file named `config.json` in the root directory
2. Add the following to the file and replace the placeholder values with your own
   ```json
   {
     "token": "YOUR_TOKEN_HERE",
     "clientID": "YOUR_CLIENT_ID_HERE",
     "guildID": "YOUR_GUILD_ID_HERE"
   }
   ```
   
### Usage
Start the bot by opening a terminal in the root directory and running `npm run main`

New commands are deployed using `npm run deploy`

