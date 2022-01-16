Purpose of Project:
	This project is meant to create a restaurant order website using client-server architecture while
storing all of the data in a database using MondoDB. This project also incorporate mongoose queries in
order to help with using my database.

===================================================================
==                  Changes I made to base code                  ==
===================================================================

1) The first change I made was to turn the orderform.html into
an orderform.pug file. I did this so that I could make use of 
backtick strings(``) so that I would have an easier time
putting the user id in the link to the user's profile. I want to
be clear though that I didn't delete the orderform.html file. It's
still there, I'm just not using it. I decided to leave the file in
just in case.

2) The second change I made was to modify the database-initializer
file so that it inserts all of the premade users using mongoose
rather than mongo. This was to help with making sure that all inserted
users are unique and to make sure that there won't be any compatability
issues when adding future users. I didn't delete any of the old database
code that was provided to us. I just commented out any code that I didn't
need. You should be able to see that in the comments that I've created.



===================================================================
==                   Installation Instructions                   ==
===================================================================

1) Download+extract zip file into whatever directory you want

2) Open up the newly extracted file and create an empty folder inside
of it. It doesn't really matter what you call it, I suggest using
'database', but that's up to you. I'm sorry I didn't provide one
already, but the assignment specifications said not to include any
database folder and I'm not sure if that also meant empty ones. This
will be the only folder that you have to manually make so I hope it's
not an issue.

3) Open up 2 different terminals of your choice. These can be done either
in VS-Code or through opening up some command prompts.

4) In either terminal, run the command 'npm install'. This will install
all of the dependencies in the package.json file. Wait for this to finish
installing before moving on.

4) In the other terminal run the following command:
'mongod --dbpath="*name of empty folder you created in step 2*"'. 
If you called the folder you made in step 2 'database' then the command 
would look like: 'mongod --dbpath="database"'

5) Wait a second for everything to download and initialize. Once the
terminal has stopped printing out new lines and you see that the
database is waiting for a command, then you may proceed. The mongo daemon
should now be running in the background. We won't need to run any commands
in this terminal anymore, so just let it run in the background.

6) Now it is time to initialize the database. I made a script in the package.json
file that you can use to initialize the database. In the terminal that doesn't have
the mongo daemon running, run the command 'npm run db-init'. This command does the
exact same thing as 'node database-initializer.js'. Feel free to use whichever one
you want. Just run either command once and wait for it to finish initializing everything.

7) From here we can start the server. Run the command 'npm run start' in the same terminal
as the one where you ran the database initializer. Wait for the server to boot up.

8) Go to the following link to access the website: "http://localhost:3000/"

9) From here you can navigate the website and mark everything as needed.