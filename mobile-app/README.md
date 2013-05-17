## Short introduction how to start coding (ios version)

 * You need a Mac with git and ssh installed
 * Got to Apples webpage and generate an Apple Id if you do not already have one
 * Go to http://www.appcelerator.com and generate a (free for private use) account there
 * Install XCode if you do not already have it.
   * Start XCode, accept their TNC
   * Install the CLI tools from within XCode
 * Install Titanium Studio from Appcelerator
 * Pull the cushymoco code from github
 * Create project in Titanium Studio
   * You should create a project from your cushymoco mobile-app directory that you got from github
   * There is a short setup.sh script that generates some neccessary files
   * look at the tiapp.xml and the app/config.json and tweak that to your needs
 * Install a demo shop or use an existing shop and add the shop-connector (see the README.md)
   * Your Titanium Studio should be able to reach the shop address
   * Test the shop connector: http://yourshopaddress/?cl=cushymoco&fnc=getVersion
 * Add a Run Configuration in Titanium Studio via the Run Menu for the Titanium IOS Simulator
 * Run the Emulator and enjoy the App

## License cushymoco mobile app

The mobile app code is subject to a BSD 2-clause license
(see [LICENSE.txt](LICENSE.txt))
