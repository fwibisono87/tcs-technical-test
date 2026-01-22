# TCS Technical Test: StackUnderflow
github.com/fwibisono87

## Setup Instructions:

### Development
1. Ensure your machine has NodeJS and `pnpm`.
2. Run `pnpm i` at project root
3. Run `pnpm run dev` at project root
4. On your browser, open `localhost:3000`

### Docker
If you prefer Docker and have `docker compose` setup, simply run `docker compose up -d --build --force-recreate`. The app should be exposed at port 3001

## Approach
We are using Vue/Nuxt's SPA mode. I chose this as it came with built in routing. For storing data such as "session" info (just the username), as well as ephemeral question data, I used Pinia's store. 

As the application is quite simple at this stage, data manipulation is done at a store level. Had this been a "real" production app, I would have split it into it's own `services`, to maintain seperation of concerns. 