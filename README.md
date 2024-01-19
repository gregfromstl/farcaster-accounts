# Farcaster Accounts

A UI for creating and managing Farcaster accounts and signers.

### Getting started

Clone the repo with `git clone https://github.com/gregfromstl/farcaster-accounts`

You'll need to create a new [Supabase](supabase.com/) project to run the app locally. Download the Supabase CLI with `npm install --global supabase` then run `npx supabase init` to initialize the project. Run `supabase start` to start the dev database and retrieve the values needed for your environment variables.

Copy `.env.example` to `.env.local` and fill in your environment variables.

Run `yarn && yarn dev` to start the app.

### Creating an account

> You'll need a [Neynar](https://neynar.com) account to use the app.

Login with Privy, then go to Settings to set your Neynar API key.

Once your key is set click `New Account` -> `Create`. You'll be asked to confirm two transactions. The first sends the cost to rent an account plus a little extra for gas to a newly generated custody address. The custody address will then register a new account with Farcaster and begin the process of generating an account. The second transaction will post a signature created by your custody address on-chain to verify your Neynar signer.

Once your account is generated, click it in the table to update its username, profile image, etc.

> Note: Your username can only be changed once every 28 days based on Farcaster protocol requirements!
