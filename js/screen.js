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
    
    static errorScreen( errorMessage ) {
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
    
    static displayHUD() {
        
        var speedometer = document.createElement("div");
        speedometer.setAttribute('class', 'speedometer');
        speedometer.setAttribute('id', 'speedometer');
        
        document.body.appendChild(speedometer);

        var ranking = document.createElement("div");
        ranking.setAttribute('class', 'ranking');
        
        var rankingTitle = document.createTextNode("Top 10");
        
        ranking.appendChild(rankingTitle);
        
        var rankingTextBox = document.createElement("div");
        rankingTextBox.setAttribute('class', 'rankingBox');
        rankingTextBox.setAttribute('id', 'rankingBox');
        
        ranking.appendChild(rankingTextBox);
        
        document.body.appendChild(ranking);
        
        updateRanking();
        
        console.log("HUD CREATED.")
    }
    
    static updateRanking() {
        // TODO : Working dynamic ranking.
        document.getElementById("rankingBox").innerText = "\n<placeholder> <score>\n<placeholder> <score>\n<placeholder><score>\n<placeholder> <score>\n<placeholder> <score>\n<placeholder> <score>\n<placeholder> <score>\n<placeholder> <score>\n<placeholder> <score>\n<placeholder> <score>\n<Euzinho> <score>";
    }

    // FIXME: Renomear pra updateSpeedometer ou assim?
    static speedometer() {
        document.getElementById("speedometer").innerText = Math.round(Math.sqrt(Math.pow(GAME.ship.frontSpeed + GAME.ship.backSpeed, 2) + Math.pow(GAME.ship.eftSpeed + GAME.ship.rightSpeed, 2)) * 212121) + " LT/s";
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
            
            // TODO
            // Login Screen
        }, 200);
    }
    
    static closeLogin() {
        document.getElementById("inLoginBtn").style.opacity = "0";
        document.getElementById("backLoginBtn").style.opacity = "0";
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
    
    static Settings() {
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
}