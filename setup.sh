sleep 2
echo =========\NanoBot Setup\=========
echo This will guide you through the setup of NanoBot. 
sleep 1
echo If you are stuck refer to the Setup Help Wiki http://www.github.com/saamstep/nanobot/wiki
sleep 2
#installs node
echo "This installer requires that you have Node and NPM package manager FIRST. If you do not have those then please exit (CNTRL + C) and install those packages with the essentials.sh script"
sleep 1
echo -n "Waiting 5 seconds..."
sleep 5
echo -n


#gets prefix
sleep 1
echo 
echo "Please choose a prefix"
read prefix
echo Good choice! You set your prefix to: "$prefix"
sleep 1 
#gets token
echo Now head over to http://discordapp.com/developers/ and create an App and paste in the bot token. The setup wiki should tell you exactly where to go.
read token
#gets id
echo Now please put in your Bot Client ID
read clientid
echo Use this url to invite the bot to your server
echo "https://discordapp.com/oauth2/authorize?client_id=$clientid&scope=bot&permissions=808905798"
echo "{ \"token\": \"$token\", \"prefix\": \"$prefix\" }" >configC.json



