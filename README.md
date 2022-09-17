# supabase-edge-functions

Supabase Edge Function code for the compass wallet v1 private beta. 

Currently responsible for fetching prices via coin gecko with a cron job every 1/5th of a minute.

Things that still need to be fleshed out is the alchemy API responses and middleware to clean the data and put it in the database
