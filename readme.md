# Station QR Scanner App

## This app scans the QR code from a user's phone to track when the user has visited a designated station.

> A `.env` file is required for this app to run with `STATION_ID` defined.
    > Example: `STATION_ID="1234"`
> Run `node app.js [location/to/env/file]` with the scanner attached to start everything up (replacing `[location/to/env/file]` with the actual location to .env file).
    > This should work for local dev `node app.js ./`

### A log file named `scanner.log` can be found in the root directory.


## Instructions to setup the app on Raspberry Pi
1. Install the Raspberry Pi OS
2. Set Raspberry Pi OS to boot into command line.
    a. Preferences -> Raspberry Pi Configuration -> System -> Boot -> To CLI
3. Reboot the Raspberry Pi
4. Update the packages
    a. `sudo apt update`
    b. `sudo apt upgrade`
5. Add NodeJS repo and install
    a. `curl -fsSL https://deb.nodesource.com/setup_lts.x | sudo -E bash -`
    b. `sudo apt install nodejs`
6. Install git
    a. `sudo apt install git -y`
7. Get the scanner app
    a. `git clone https://fueldigital@dev.azure.com/fueldigital/Mirrorshow/_git/station-qr-scanner `
8. Update the environment file with the correct station ID
    a. (if not already in the proper directory) `cd ~/station-qr-scanner`
    b. `nano .env`
    c. Replace with the station id value
        i. `STATION_ID="replace-this-with-station-id"`
9. Update the startup script so the app auto-starts on boot
    a. `sudo nano ~/.bashrc`
    b. After the editor opens, add the following line to the end of the file
        i. `node app.js ./`
    c. Close the nano editor
        i. `control x`
        ii. If prompted, make you to save/overwrite the .bashrc file
10. Reboot the device
    a. `sudo reboot`
11. After the reboot, the Raspberry Pi should boot into the terminal and automatically start the scanner app