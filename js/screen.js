// ========================================================
// Screen.js
//=========================================================
const ERROR_DISPLAY_MSG = "Oopsie Woopsie!";
class Screen {
    constructor() {
        this.body = document.body;
    }
    
    fadeToBlack() {
        var menu = document.getElementById("menu");
        menu.style.opacity = "0";
        menu.style.width = "0vw";
        
        setTimeout(function() {
            menu.style.display = "none";
            var videoTutorial = document.getElementById("videoTutorial")
            videoTutorial.style.opacity = "0";
            
            setTimeout(function() {
                videoTutorial.style.display = "none";
            }, 200);
        }, 200);
    }
    
    errorScreen( errorMessage ) {
        document.body.innerHTML = "";
        document.body.style.backgroundColor = "#e53935";
        
        var transparentBox = document.createElement("header");
        var textBox = document.createElement("p");
        
        var errorDisplay = document.createTextNode("Oopsie Woopsie!")
        var errorText = document.createTextNode(errorMessage);
        
        textBox.appendChild(errorText);
        
        transparentBox.appendChild(errorDisplay);
        transparentBox.appendChild(textBox);
        
        document.body.appendChild(transparentBox);
        console.log(errorMessage);
    }
    
    displayHUD() {
        // Speedometer
        var speedometer = document.createElement("div");
        speedometer.setAttribute('class', 'speedometer');
        speedometer.setAttribute('id', 'speedometer');
        
        document.body.appendChild(speedometer);

        // Ranking
        var ranking = document.createElement("div");
        ranking.setAttribute('class', 'ranking');
        
        var rankingTitle = document.createTextNode("Top 10");
        
        ranking.appendChild(rankingTitle);
        
        var rankingTextBox = document.createElement("div");
        rankingTextBox.setAttribute('class', 'rankingBox');
        rankingTextBox.setAttribute('id', 'rankingBox');
        
        ranking.appendChild(rankingTextBox);
        
        document.body.appendChild(ranking);
        
        // Damage Indicator

        var dmgIndicator = document.createElement("div");
        dmgIndicator.setAttribute('class', 'dmgIndicator');
        dmgIndicator.setAttribute('id', 'dmgIndicator');
        
        document.body.appendChild(dmgIndicator);
        
        console.log("HUD CREATED.")
    }
    
    updateRanking() {
        // TODO : Working dynamic ranking.
        document.getElementById("rankingBox").innerText = "\n<placeholder> <score>\n<placeholder> <score>\n<placeholder><score>\n<placeholder> <score>\n<placeholder> <score>\n<placeholder> <score>\n<placeholder> <score>\n<placeholder> <score>\n<placeholder> <score>\n<placeholder> <score>\n<Euzinho> <score>";
    }

    updateSpeedometer() {
        document.getElementById("speedometer").innerText = Math.round(Math.sqrt(Math.pow(SHIP.frontSpeed + SHIP.backSpeed, 2) + Math.pow(SHIP.leftSpeed + SHIP.rightSpeed, 2)) * 212121) + " LT/s";
    }

    updateDmgIndicator() {
        document.getElementById("dmgIndicator").innerText = "Status: " + Math.round(SHIP.damage * 100) + "%";
    }
    
    static resetVideo() {
        // Fades video to black and then resets it.
        var vid = document.getElementById("videoTutorial");
        vid.style.opacity = "0";
        
        setTimeout(function() {
            vid.currentTime = 0;
            vid.style.opacity = "1";
        }, 200);
    }
    
    static openLogin() {
        document.getElementById("gameBtn").style.opacity = "0";
        document.getElementById("loginBtn").style.opacity = "0";
        document.getElementById("editorBtn").style.opacity = "0";
        document.getElementById("settingsBtn").style.opacity = "0";
        document.getElementById("resetBtn").style.opacity = "0";
        
        
        setTimeout(function() {
            document.getElementById("aux").style.display = "none";
            document.getElementById("menu").style.width = "90vw";
            
            document.getElementById("auxLogin").style.display = "block";
            document.getElementById("inLoginBtn").style.opacity = "1";
            document.getElementById("backLoginBtn").style.opacity = "1";
            document.getElementById("loginLabel").style.opacity = "1";
            document.getElementById("loginTextBox").style.opacity = "1";
            
            // TODO
            // Login Screen
        }, 200);
    }
    
    static closeLogin() {
        document.getElementById("inLoginBtn").style.opacity = "0";
        document.getElementById("backLoginBtn").style.opacity = "0";
        document.getElementById("loginTextBox").style.opacity = "0";
        document.getElementById("loginLabel").style.opacity = "0";
        document.getElementById("menu").style.width = "25vw";
        
        setTimeout(function() {
            document.getElementById("auxLogin").style.display = "none";
            
            document.getElementById("aux").style.display = "block";
            document.getElementById("gameBtn").style.opacity = "1";
            document.getElementById("loginBtn").style.opacity = "1";
            document.getElementById("editorBtn").style.opacity = "1";
            document.getElementById("settingsBtn").style.opacity = "1";
            document.getElementById("resetBtn").style.opacity = "1";
        }, 200);
    }

    static login() {
        var nicknameBox = document.getElementById("loginTextBox");
        var loginButton = document.getElementById("inLoginBtn");
        if (nicknameBox.value.length < 16) {
            nicknameBox.className = "menuInputAccepted";
            nicknameBox.readOnly = true;
            loginButton.disabled = true;
            loginButton.className = "menuButton";
            loginButton.style.fontSize = "4vw";
        }
    }
    
    static openSettings() {
        document.getElementById("gameBtn").style.opacity = "0";
        document.getElementById("loginBtn").style.opacity = "0";
        document.getElementById("editorBtn").style.opacity = "0";
        document.getElementById("settingsBtn").style.opacity = "0";
        document.getElementById("resetBtn").style.opacity = "0";
        
        
        setTimeout(function() {
            document.getElementById("aux").style.display = "none";
            document.getElementById("menu").style.width = "90vw";
            
            document.getElementById("auxSettings").style.display = "block";
            document.getElementById("musicBtn").style.opacity = "1";
            document.getElementById("sndFxBtn").style.opacity = "1";
            document.getElementById("gfxBtn").style.opacity = "1";
            document.getElementById("backSettingsBtn").style.opacity = "1";
        }, 200);
    }
    
    static closeSettings() {
        document.getElementById("musicBtn").style.opacity = "0";
        document.getElementById("sndFxBtn").style.opacity = "0";
        document.getElementById("gfxBtn").style.opacity = "0";
        document.getElementById("backSettingsBtn").style.opacity = "0";
        document.getElementById("menu").style.width = "25vw";
        
        setTimeout(function() {
            document.getElementById("auxSettings").style.display = "none";
            
            document.getElementById("aux").style.display = "block";
            document.getElementById("gameBtn").style.opacity = "1";
            document.getElementById("loginBtn").style.opacity = "1";
            document.getElementById("editorBtn").style.opacity = "1";
            document.getElementById("settingsBtn").style.opacity = "1";
            document.getElementById("resetBtn").style.opacity = "1";
        }, 200);
    }

    update() {
        this.updateRanking();
        this.updateSpeedometer();
        this.updateDmgIndicator();
    }
}