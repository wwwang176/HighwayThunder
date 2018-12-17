<!DOCTYPE html>
<html lang="en">
<head>
	<meta charset="UTF-8">
    <meta http-equiv="Pragma" content="no-cache" /> 
	<title>Highway Thunder</title>
    <script src="javascripts/uniqid.js"></script>
    <script src="javascripts/i18n.min.js"></script>
	
    <script src="javascripts/three.min.js"></script>
    <script src="javascripts/loaders/ColladaLoader.js"></script>

    <script src="javascripts/cannon.min.js"></script>
	
    <link rel="stylesheet" type="text/css" href="stylesheets/style.css">
	
    <script src="javascripts/jquery-1.8.3.js"></script>
    <script src="javascripts/jquery.mousewheel.min.js"></script>
	<script src="javascripts/stats.min.js"></script>
    <script src="javascripts/deepClone.js"></script>
    

    <script src="javascripts/FirstPersonControls.js"></script>
    <script src="javascripts/PointerLockControls.js"></script>

    <script src="KeyboardSetting.js?<?php echo rand(0,9999);?>"></script>
    <script src="EnvironmentSetting.js?<?php echo rand(0,9999);?>"></script>
    <script src="basicObj.js?<?php echo rand(0,9999);?>"></script>
    <script src="car.js?<?php echo rand(0,9999);?>"></script>
    <script src="Package.js?<?php echo rand(0,9999);?>"></script>
    
    <script src="WEX.js?<?php echo rand(0,9999);?>"></script>
    <script src="Sedan.js?<?php echo rand(0,9999);?>"></script>
    <script src="Bus.js?<?php echo rand(0,9999);?>"></script>
    <script src="Trailer Truck.js?<?php echo rand(0,9999);?>"></script>
    <script src="Container.js?<?php echo rand(0,9999);?>"></script>
    
    <script src="floor.js?<?php echo rand(0,9999);?>"></script>
    <script src="Lane.js?<?php echo rand(0,9999);?>"></script>
    <script src="smoke.js?<?php echo rand(0,9999);?>"></script>
    <script src="Rock.js?<?php echo rand(0,9999);?>"></script>
    <script src="TrafficCone.js?<?php echo rand(0,9999);?>"></script>
    

</head>
<body>
    
    <div id="hud-canvas-div"></div>
    <div id="canvas-div"></div>
    <div id="garage-canvas-div"></div>
    
    <div class="dialog first-dialog">
        <p><span class="i18n" data-text="Driving as quickly as possible!"></span></p>
        <div class="func">
            <div class="button">OK</div>
        </div>
    </div>
    <div class="dialog goto-garage-dialog has-cancel">
        <p><span class="i18n" data-text="Goto garage and give up?"></span></p>
        <div class="func">
            <div class="button">OK</div>
            <div class="cancel">Cancel</div>
        </div>
    </div>
    

    <div class="dialog env-setting-dialog">
        <h3><span class="i18n" data-text="Setting"></span></h3>
        <div class="clearfix row language-row">
            <div class="left"><span class="i18n" data-text="Language"></span></div>
            <div class="right">
                <span class="item" data-language="zh-tw">中文(繁體)</span>
                <span class="item" data-language="zh-cn">中文(简体)</span>
                <span class="item" data-language="en-us">English(US)</span>
                <span class="item" data-language="js-jp">日本語(JP)</span>
            </div>
        </div>
        <div class="clearfix row speedunit-row">
            <div class="left"><span class="i18n" data-text="Speed of unit"></span></div>
            <div class="right">
                <span class="item selected" data-unit="kph">km/h (KMH)</span>
                <span class="item" data-unit="mph">mile/h (MPH)</span>
            </div>
        </div>
        <div class="clearfix row speedunit-row">
            <div class="left">Abouts</div>
            <div class="right">
                Creator: <a href="http://wwwamg.tw">WWWANG</a>
            </div>
        </div>
        
        
        <p>&nbsp;</p>
        <div class="func">
            <div class="button">OK</div>
        </div>
    </div>

    <div class="dialog keyboard-setting-dialog">
        <div class="scroll">
            <div class="clearfix row">
                <div class="left"><span class="i18n" data-text="Reset"></span></div>
                <div class="right">R</div>
            </div>
            <div class="clearfix row">
                <div class="left"><span class="i18n" data-text="Throttle"></span></div>
                <div class="right"><span class="i18n" data-text="Arrow up"></span></div>
            </div>
            <div class="clearfix row">
                <div class="left"><span class="i18n" data-text="N2O"></span></div>
                <div class="right">Shift</div>
            </div>
            <div class="clearfix row">
                <div class="left"><span class="i18n" data-text="Brake"></span></div>
                <div class="right"><span class="i18n" data-text="Arrow down"></span></div>
            </div>
            <div class="clearfix row">
                <div class="left"><span class="i18n" data-text="Hand brake"></span></div>
                <div class="right"><span class="i18n" data-text="Space"></span></div>
            </div>
            <div class="clearfix row">
                <div class="left"><span class="i18n" data-text="Turn left"></span></div>
                <div class="right"><span class="i18n" data-text="Arrow left"></span></div>
            </div>
            <div class="clearfix row">
                <div class="left"><span class="i18n" data-text="Turn right"></span></div>
                <div class="right"><span class="i18n" data-text="Arrow right"></span></div>
            </div>
            <div class="clearfix row">
                <div class="left"><span class="i18n" data-text="Next gear"></span></div>
                <div class="right">W</div>
            </div>
            <div class="clearfix row">
                <div class="left"><span class="i18n" data-text="Perv gear"></span></div>
                <div class="right">S</div>
            </div>
            <div class="clearfix row">
                <div class="left"><span class="i18n" data-text="View type"></span></div>
                <div class="right">V</div>
            </div>
            <div class="clearfix row">
                <div class="left"><span class="i18n" data-text="Look left"></span></div>
                <div class="right">A</div>
            </div>
            <div class="clearfix row">
                <div class="left"><span class="i18n" data-text="Look right"></span></div>
                <div class="right">S</div>
            </div>
            <div class="clearfix row">
                <div class="left"><span class="i18n" data-text="Look back"></span></div>
                <div class="right">Q</div>
            </div>
            <div class="clearfix row">
                <div class="left"><span class="i18n" data-text="High beam"></span></div>
                <div class="right">X</div>
            </div>
        </div>
        <div class="button">OK</div>
        
    </div>

    <div id="env-setting-button">
        <svg viewBox="0 0 32 32">
            <g data-name="13-Setting" id="_13-Setting">
                <path d="M30.16,13l-2.07-.34a1,1,0,0,1-.76-.63,11.51,11.51,0,0,0-.52-1.26,1,1,0,0,1,.1-1l1.21-1.71A1,1,0,0,0,28,6.8L25.2,4a1,1,0,0,0-1.29-.1L22.2,5.09a1,1,0,0,1-1,.1A11.51,11.51,0,0,0,20,4.67a1,1,0,0,1-.63-.76L19,1.84A1,1,0,0,0,18,1H14a1,1,0,0,0-1,.84l-.34,2.07a1,1,0,0,1-.63.76,11.51,11.51,0,0,0-1.26.52,1,1,0,0,1-1-.1L8.09,3.88A1,1,0,0,0,6.8,4L4,6.8a1,1,0,0,0-.1,1.29L5.09,9.8a1,1,0,0,1,.1,1A11.51,11.51,0,0,0,4.67,12a1,1,0,0,1-.76.63L1.84,13A1,1,0,0,0,1,14v4a1,1,0,0,0,.84,1l2.07.34a1,1,0,0,1,.76.63,11.51,11.51,0,0,0,.52,1.26,1,1,0,0,1-.1,1L3.88,23.91A1,1,0,0,0,4,25.2L6.8,28a1,1,0,0,0,1.29.1L9.8,26.91a1,1,0,0,1,1-.1,11.51,11.51,0,0,0,1.26.52,1,1,0,0,1,.63.76L13,30.16A1,1,0,0,0,14,31h4a1,1,0,0,0,1-.84l.34-2.07a1,1,0,0,1,.63-.76,11.51,11.51,0,0,0,1.26-.52,1,1,0,0,1,1,.1l1.71,1.21A1,1,0,0,0,25.2,28L28,25.2a1,1,0,0,0,.1-1.29L26.91,22.2a1,1,0,0,1-.1-1A11.51,11.51,0,0,0,27.33,20a1,1,0,0,1,.76-.63L30.16,19A1,1,0,0,0,31,18V14A1,1,0,0,0,30.16,13ZM29,17.15l-1.24.21a3,3,0,0,0-2.32,1.95h0a10.36,10.36,0,0,1-.43,1,2.94,2.94,0,0,0,.27,3l.72,1L24.38,26l-1-.72a2.94,2.94,0,0,0-3-.27,10.36,10.36,0,0,1-1,.43,3,3,0,0,0-1.95,2.32L17.15,29h-2.3l-.21-1.24a3,3,0,0,0-2-2.32,10.36,10.36,0,0,1-1-.43,2.94,2.94,0,0,0-3,.27l-1,.72L6,24.38l.72-1a2.94,2.94,0,0,0,.27-3,10.36,10.36,0,0,1-.43-1,3,3,0,0,0-2.33-1.95L3,17.15v-2.3l1.23-.21a3,3,0,0,0,2.33-2,10.36,10.36,0,0,1,.43-1,3,3,0,0,0-.27-3L6,7.62,7.62,6l1,.72a3,3,0,0,0,3,.27,10.36,10.36,0,0,1,1-.43,3,3,0,0,0,2-2.32L14.85,3h2.3l.21,1.23a3,3,0,0,0,1.95,2.33,10.36,10.36,0,0,1,1,.43,3,3,0,0,0,3-.27l1-.72L26,7.62l-.72,1a3,3,0,0,0-.27,3,10.36,10.36,0,0,1,.43,1,3,3,0,0,0,2.32,2l1.24.21Z"/>
                <path d="M16,9a7,7,0,1,0,7,7A7,7,0,0,0,16,9Zm0,12a5,5,0,1,1,5-5A5,5,0,0,1,16,21Z"/>
            </g>
        </svg>
    </div>
    <div id="keyboard-setting-button">
        <svg data-name="Layer 1" id="Layer_1" viewBox="0 0 100 100" >
            <path d="M60.49,43.77V40.63a1,1,0,0,1,1-1h3.13a1,1,0,0,1,1,1v3.14a1,1,0,0,1-1,1H61.49A1,1,0,0,1,60.49,43.77Zm4.35,5.15v3.14a1,1,0,0,0,1,1H69a1,1,0,0,0,1-1V48.92a1,1,0,0,0-1-1H65.84A1,1,0,0,0,64.84,48.92Zm-8.71,0v3.14a1,1,0,0,0,1,1h3.14a1,1,0,0,0,1-1V48.92a1,1,0,0,0-1-1H57.13A1,1,0,0,0,56.13,48.92Zm14.06-4.15h3.14a1,1,0,0,0,1-1V40.63a1,1,0,0,0-1-1H70.19a1,1,0,0,0-1,1v3.14A1,1,0,0,0,70.19,44.77ZM70,56.16H66.91a1,1,0,0,0-1,1v3.13a1,1,0,0,0,1,1H70a1,1,0,0,0,1-1V57.16A1,1,0,0,0,70,56.16ZM52.78,44.77h3.14a1,1,0,0,0,1-1V40.63a1,1,0,0,0-1-1H52.78a1,1,0,0,0-1,1v3.14A1,1,0,0,0,52.78,44.77Zm9,11.39H38.34a1,1,0,0,0-1,1v3.13a1,1,0,0,0,1,1H61.79a1,1,0,0,0,1-1V57.16A1,1,0,0,0,61.79,56.16Zm-28.7,0H30a1,1,0,0,0-1,1v3.13a1,1,0,0,0,1,1h3.13a1,1,0,0,0,1-1V57.16A1,1,0,0,0,33.09,56.16ZM30,48.92v3.14a1,1,0,0,0,1,1h3.14a1,1,0,0,0,1-1V48.92a1,1,0,0,0-1-1H31A1,1,0,0,0,30,48.92Zm-3.35-4.15h3.14a1,1,0,0,0,1-1V40.63a1,1,0,0,0-1-1H26.67a1,1,0,0,0-1,1v3.14A1,1,0,0,0,26.67,44.77Zm20.76,4.15v3.14a1,1,0,0,0,1,1h3.14a1,1,0,0,0,1-1V48.92a1,1,0,0,0-1-1H48.43A1,1,0,0,0,47.43,48.92ZM82,34.05V66a2,2,0,0,1-2,2H20a2,2,0,0,1-2-2V34.05a2,2,0,0,1,2-2H80A2,2,0,0,1,82,34.05Zm-4,2H22V64H78ZM35.38,44.77h3.13a1,1,0,0,0,1-1V40.63a1,1,0,0,0-1-1H35.38a1,1,0,0,0-1,1v3.14A1,1,0,0,0,35.38,44.77Zm8.7,0h3.14a1,1,0,0,0,1-1V40.63a1,1,0,0,0-1-1H44.08a1,1,0,0,0-1,1v3.14A1,1,0,0,0,44.08,44.77Zm-5.35,4.15v3.14a1,1,0,0,0,1,1h3.14a1,1,0,0,0,1-1V48.92a1,1,0,0,0-1-1H39.73A1,1,0,0,0,38.73,48.92Z"/>
        </svg>
    </div>
    <div id="goto-garage-button">
        <svg enable-background="new 0 0 48 48" viewBox="0 0 48 48">
            <g id="Expanded">
                <g>
                    <g>
                        <path d="M42,48H28V35h-8v13H6V27c0-0.552,0.447-1,1-1s1,0.448,1,1v19h10V33h12v13h10V28c0-0.552,0.447-1,1-1s1,0.448,1,1V48z"/>
                    </g>
                    <g>
                        <path d="M47,27c-0.249,0-0.497-0.092-0.691-0.277L24,5.384L1.691,26.723c-0.399,0.381-1.032,0.368-1.414-0.031     c-0.382-0.399-0.367-1.032,0.031-1.414L24,2.616l23.691,22.661c0.398,0.382,0.413,1.015,0.031,1.414     C47.526,26.896,47.264,27,47,27z"/>
                    </g>
                    <g>
                        <path d="M39,15c-0.553,0-1-0.448-1-1V8h-6c-0.553,0-1-0.448-1-1s0.447-1,1-1h8v8C40,14.552,39.553,15,39,15z"/>
                    </g>
                </g>
            </g>
        </svg>
    </div>
    

    <div id="loading-div">
        <div class="info">
            <div class="box">
                <div class="logo"></div>
                <div class="text">&nbsp;</div>
                <div class="bar">
                    <div class="s"></div>
                </div>
            </div>
        </div>
        <div class="alert">
            本遊戲呈現僅娛樂效果，在真實世界中請安全駕駛並遵守交通規則<br>
            This game presents only entertainment effects, please drive safely and obey the traffic rules in the real world.
        </div>
    </div>

    <div id="SafetyCameraFlash"></div>

    <div id="garage-select-car-div">
        
        <div class="container clearfix">
            <div class="next-car-button"></div>
            <div class="perv-car-button"></div>
            <div class="block">
                <div class="row">
                    <span class="i18n" data-text="Speed Max"></span>
                    <div class="speed-max-bar bar"><div class="s"></div></div>
                </div>
                <div class="row">
                    <span class="i18n" data-text="Acceleration"></span>
                    <div class="speed-acceleration-bar bar"><div class="s"></div></div>
                </div>
                <div class="row">
                    <span class="i18n" data-text="Braking Stability"></span>
                    <div class="braking-stability-bar bar"><div class="s"></div></div>
                </div>
                <div class="row">
                    <span class="i18n" data-text="Maneuverability"></span>
                    <div class="maneuverability-bar bar"><div class="s"></div></div>
                </div>
                
            </div>
            <div class="block"></div>
            <div class="block">
                <div class="button racing-button">Racing!</div>
                <!--<div class="button">Customization</div>-->
            </div>
        </div>
    </div>

    <div id="score-check">
        <h1><span class="i18n" data-text="Game Over"></span></h1>
        <div class="score-type">
            <div class="item WrongWayDrive">
                <h5><span class="i18n" data-text="Driving on wrong side"></span></h5>
                <span class="count">999</span> <span class="i18n" data-text="m"></span><span class="i18n" data-text="ft"></span><br>
                +<span class="score">999</span>
            </div>
            <div class="item CloseDrive">
                <h5><span class="i18n" data-text="Brush past"></span></h5>
                <span class="count">999</span> <span class="i18n" data-text="time"></span><br>
                +<span class="score">999</span>
            </div>
            <div class="item Drift">
                <h5><span class="i18n" data-text="Drift"></span></h5>
                <span class="count">999</span> <span class="i18n" data-text="m"></span><span class="i18n" data-text="ft"></span><br>
                +<span class="score">999</span>
            </div>
            <div class="item Fly">
                <h5><span class="i18n" data-text="Fly"></span></h5>
                <span class="count">999</span> <span class="i18n" data-text="m"></span><span class="i18n" data-text="ft"></span><br>
                +<span class="score">999</span>
            </div>
            
        </div>
        <div class="camera-score">
        <div class="item">
                <h5><span class="i18n" data-text="Road Safety Camera"></span>(1)</h5>
                <span class="count">99</span><span class="unit">km/h</span><br>
                +<span class="score">999</span>
            </div>
            <div class="item">
                <h5><span class="i18n" data-text="Road Safety Camera"></span>(2)</h5>
                <span class="count">99</span><span class="unit">km/h</span><br>
                +<span class="score">999</span>
            </div>
            <div class="item">
                <h5><span class="i18n" data-text="Road Safety Camera"></span>(3)</h5>
                <span class="count">99</span><span class="unit">km/h</span><br>
                +<span class="score">999</span>
            </div>
            <div class="item">
                <h5><span class="i18n" data-text="Road Safety Camera"></span>(4)</h5>
                <span class="count">99</span><span class="unit">km/h</span><br>
                +<span class="score">999</span>
            </div>
            <div class="item">
                <h5><span class="i18n" data-text="Road Safety Camera"></span>(5)</h5>
                <span class="count">99</span><span class="unit">km/h</span><br>
                +<span class="score">999</span>
            </div>
            
        </div>
        <div class="score-total">
            <h3><span class="i18n" data-text="Total"></span></h3>
            <span class="score">9999561</span>
        </div>
        <div class="button-div">
            <div class="button">Try again</div>
        </div>
    </div>

    <div id="hud" class="unselectable">
        
        <div class="game-state">
            <div class="drive-percent">
                <div class="bar">
                    <div class="text"><span>0</span>%</div>
                </div>
            </div>
            <div class="camera-position">
                <div class="item item-1"></div>
                <div class="item item-2"></div>
                <div class="item item-3"></div>
                <div class="item item-4"></div>
                <div class="item item-5"></div>
            </div>
        </div>

        <div class="score-state">
            <div class="total">0</div>
            <div class="type">
                <div class="item WrongWayDrive">
                    <span class="i18n" data-text="Driving on wrong side"></span><br>+<span class="s"></span>
                </div>
                <div class="item CloseDrive">
                    <span class="i18n" data-text="Brush past"></span><br>+<span class="s"></span>
                </div>
                <div class="item Drift">
                    <span class="i18n" data-text="Drift"></span><br>+<span class="s"></span>
                </div>
                <div class="item Fly">
                    <span class="i18n" data-text="Fly"></span><br>+<span class="s"></span>
                </div>
                <div class="item Crack">
                    <span class="i18n" data-text="Car accident"></span><br>+<span class="s"></span>
                </div>
            </div>
            <div class="SpeedBonus">
                <span class="i18n" data-text="Speed bonus"></span><br>x<span class="s">1.0</span>
            </div>
            <div class="SafetyCamera">
                <div class="item">
                    <span class="i18n" data-text="Road Safety Camera"></span><br>+<span class="s"></span>
                </div>
                <div class="item">
                    <span class="i18n" data-text="Road Safety Camera"></span><br>+<span class="s"></span>
                </div>
                <div class="item">
                    <span class="i18n" data-text="Road Safety Camera"></span><br>+<span class="s"></span>
                </div>
                <div class="item">
                    <span class="i18n" data-text="Road Safety Camera"></span><br>+<span class="s"></span>
                </div>
                <div class="item">
                    <span class="i18n" data-text="Road Safety Camera"></span><br>+<span class="s"></span>
                </div>
            </div>
        </div>

        <div id="speed"><span class="km">0</span><!--<span class="add">+1</span>--></div>
        <div class="engine">
            <span class="text rpm">RPM</span>
            <span class="text n2o">N2O</span>
            <span class="text gear">GEAR</span>
            <span class="text speed">km/h</span>
                
            <!--<div class="k"></div>-->
            <svg id="rpm-svg" width="150" height="150" viewBox="0 0 150 150">
                <circle cx="0" cy="150" r="137" fill="none" stroke="#CCC" stroke-width="26" stroke-opacity="0.5" />
                <circle cx="0" cy="150" r="137" id="bar" fill="none" stroke="#fff" stroke-width="26"
                    stroke-dasharray="860.36" stroke-dashoffset="-645.27" />
            </svg>
            <svg id="O2N2-svg" width="150" height="150" viewBox="0 0 150 150">
                <circle cx="0" cy="150" r="110" fill="none" stroke="#CCC" stroke-width="10" stroke-opacity="0.5" />
                <circle cx="0" cy="150" r="110" id="O2N2" fill="none" stroke="#fff" stroke-width="10"
                    stroke-dasharray="690.8" stroke-dashoffset="-690.8" />
            </svg>

            <svg id="Gear-svg" width="150" height="150" viewBox="0 0 150 150">
                <circle cx="0" cy="150" r="90" id="Gear-bg" fill="none" stroke="#fff" stroke-width="10" stroke-opacity="0.5"
                stroke-dasharray="21.06194490192345 3" stroke-dashoffset="-423.9" />
                <circle cx="0" cy="150" r="90" id="Gear" fill="none" stroke="#fff" stroke-width="10"
                stroke-dasharray="565.2" stroke-dashoffset="-423.9" />
                
            </svg>
            
            
        </div>
    </div>

    <div id="debug-object-state-div"></div>
</body>
</html>

<script>    

var Scene, MainCamera, Renderer;
var GarageScene, GarageMainCamera, GarageRenderer;
var GarageMainCameraLookAtPosition=new THREE.Vector3();
var InGarage=true;
var MainFocusUnit;                             //主要跟隨的物件
var MainCameraPosition = new THREE.Vector3();
var KeyBoardPressArray=new Array(); 	        //鍵盤按鍵
var MousePressArray=new Array();		        //滑鼠按鍵
var NightMode=true;                             //夜間模式

var UserKeyboardSetting=new KeyboardSetting({});//使用者鍵盤設定
var UserEnvironmentSetting;                     //使用者環境設定

var LocalStorageEnvironmentSetting=localStorage.getItem('EnvironmentSetting');
if(LocalStorageEnvironmentSetting)
{
    var Setting=JSON.parse(LocalStorageEnvironmentSetting);
    UserEnvironmentSetting=new EnvironmentSetting(Setting);
}
else
{
    UserEnvironmentSetting=new EnvironmentSetting({});
    localStorage.setItem('EnvironmentSetting',JSON.stringify(UserEnvironmentSetting));
}

var SystemGameOver=false;                       //遊戲是否結束
var SystemGameSize=400;                         //遊戲前後邊界
var SystemStepPer=1;                            //遊戲速度
var RequestHighwayAnimationFrameContorl;
var RequestGarageAnimationFrameContorl;
var SystemRelativePosition=new THREE.Vector3(); //物件修正量
var SystemClock=new THREE.Clock();              
var SystemRenderClock=new THREE.Clock();
var WorldRunClock=new THREE.Clock();
var SystemRunClock=new THREE.Clock();
var SystemAiClock=new THREE.Clock();
var SystemLaneClock=new THREE.Clock();
var SystemResetClock=new THREE.Clock();
var CollideClock=new THREE.Clock();
var CollideClock2=new THREE.Clock();
var SystemRunTime,SystemAiTime,SystemRenderTime,SystemWorldTime,SystemResetTime,SystemLaneTime,CollideTime,CollideTime;
var LoadingManager = null;
var LoadingDOM=$('#loading-div');
var LoadingInfoDOM=$('#loading-div .info');
var UpdateSystemObject=false;
var GarageFocusUnit, GarageFocusUnitIndex;
var GarageSpotLight, GarageSpotLightTargetObj;
var GarageKeyNextPervDelay=0;
var GarageCarSpeedScoreDOM=$('#garage-select-car-div .container .speed-max-bar .s');
var GarageCarAccelerationScoreDOM=$('#garage-select-car-div .container .speed-acceleration-bar .s');
var GarageCarBrakingScoreDOM=$('#garage-select-car-div .container .braking-stability-bar .s');
var GarageCarManeuverabilityScoreDOM=$('#garage-select-car-div .container .maneuverability-bar .s');


var StatsHUD = new Stats();
StatsHUD.dom.style.left='auto';
StatsHUD.dom.style.right='0px';
$('body').append(StatsHUD.dom);

var SunLight;

var HUDSpeedKmDiv=$('#hud #speed .km');
var HUDSpeedDiffDiv=$('#hud #speed .add');
var HUDRPMDiv=$('#hud .engine #bar');
var HUDRPMSvgstrokeDashoffsetMin=$(HUDRPMDiv).attr('r')*2*Math.PI*(3/4);
var HUDRPMSvgstrokeDashoffsetMax=$(HUDRPMDiv).attr('r')*2*Math.PI;
var HUDO2N2BarDiv=$('#hud .engine #O2N2');
var HUDO2N2BarstrokeDashoffsetMin=$(HUDO2N2BarDiv).attr('r')*2*Math.PI*(3/4);
var HUDO2N2BarstrokeDashoffsetMax=$(HUDO2N2BarDiv).attr('r')*2*Math.PI;
var HUDGearBarDiv=$('#hud .engine #Gear');
var HUDGearBarBgDiv=$('#hud .engine #Gear-bg');
var HUDGearBarLength=$(HUDGearBarDiv).attr('r')*2*Math.PI/4;
var HUDDrivePercentDiv=$('#hud .game-state .drive-percent .bar');
var HUDDrivePercentTextDiv=$('#hud .game-state .drive-percent .bar .text span');
var SafetyCameraFlashDOM=$('#SafetyCameraFlash');
var SafetyCameraFlashDOMShow=false;

var HUDLastPRMPer=0;
var HUDLastSpeed=0;

var GroundBody;
var world;
var GarageWorld;
var physicsMaterial;
var groundMaterial;
var WallMaterial;
var wheelMaterial;
var CarBodyMaterial;
var GrassMaterial;

var DebugMeedResetCarCount=0;

var CollideWokerBusy=false;
var CollideWoker=null;

var GarageAllCar=[];
var GarageAllPackage=[];

var UserCar=null;       //玩家車輛
var AllCar=[];          //所有車輛
var AllPackage=[];      //所有物體
var AllFloor=[];
var RoadTexture=null,GarageRoadTexture=null,LineTexture=null,GrassTexture=null;
var FireTexture=[];
var AllLane=[];
var SmokeArray=[];
var SmokeSetIndex=0;
var SmokeTexture=null;
var SparkArray=[];
var SparkSetIndex=0;
var CarTrackArray=[];
var CarTrackSetIndex=0;
var CarTrackTexture=null;
var LightTexture=null;
var StreetlightLightTexture=null;
var LightOnGroundTexture=null;
var LightOnGround=[];
var SafetyLineTexture=null;
var AllSafetyCameraObject=[];
var AllTrafficCone=[];
var BillboardObject=null;
var BillboardTexture=null;
var UserMileage=1000*0;         //玩家里程數
var UserMileageMax=1000*9;      //遊戲總里程數
var UserDriveMileageMax=0;      //玩家遊戲最高里程數
var UserMileagePer=0;           //里程數百分比
var UserTotalScore=0;           //玩家總分
var UserTotalScoreDOM=$('#hud .score-state .total');
var UserSafetyCameraStateDOM=$('#hud .game-state .camera-position .item');
var UserSafetyCameraScore=[];        //玩家測速照相分數
var UserWrongWayDriveScore=null;        //玩家逆向行駛分數
var UserCloseDriveScore=null;           //玩家通過車輛分數
var UserCloseDriveState=[];             //玩家剛剛擦身而過的車輛
var UserDriftScore=null;                //玩家甩尾分數
var UserFlyScore=null;                  //玩家飛行分數
var UserCrackScore=null;                //玩家車禍分數
var UserSpeedBonusPer=1;                //速度獎勵
var UserSpeedBonusDOM=$('#hud .score-state .SpeedBonus span.s');
var PutTrafficCone500State=false;       //放置交通錐的狀態
var PutTrafficCone1000State=false;      //放置交通錐的狀態
var PutTrafficCone3000State=false;      //放置交通錐的狀態
var PutTrafficCone5000State=false;      //放置交通錐的狀態
var ScoreCheckDOM=$('#score-check');

var WEXModel=[null,null,null];
var CarModel=[null,null,null];
var BusModel=[null,null];
var TrailerTruckModel=null;
var TrailerTruckFOVModel=null;

var RockArray=[];

$(document).bind('mousemove', function(event)
{
});

$(document).keydown(function(event)
{
	console.log('Click:'+event.keyCode);
	KeyBoardPressArray[event.keyCode]=true;
});

$(document).keyup(function(event)
{ 
	KeyBoardPressArray[event.keyCode]=false;
});

$(document).bind('mousewheel', function(event)
{
    console.log('wheel');

    //Zoom In
    if(event.deltaY>0)
    {
    }
    //Zoom Out
    if(event.deltaY<0)
    {
    }
});

document.oncontextmenu=function(){return false;};

$(window).resize(function()
{
    WindowResize();
});

function WindowResize()
{
    if(MainCamera)
    {
        MainCamera.aspect=window.innerWidth/window.innerHeight;
        MainCamera.updateProjectionMatrix();
    }
    if(GarageMainCamera)
    {
        GarageMainCamera.aspect=window.innerWidth/window.innerHeight;
        GarageMainCamera.updateProjectionMatrix();
    }
    
    if(Renderer)
        Renderer.setSize(window.innerWidth,window.innerHeight);
    
    if(GarageRenderer)
        GarageRenderer.setSize(window.innerWidth,window.innerHeight);

};

$(function(){
    StartInit();
});

function StartInit()
{
    initCannon();
    LoadResource(function(){

        $(LoadingInfoDOM).find('.text').html('Cerate World');
        InitGarage();
        InitHighway();
        
        $(LoadingDOM).hide();
        SceneChange();
    });
}

var sphereShape, sphereBody, world;
function initCannon(){

    $(LoadingDOM).show();
    $(LoadingInfoDOM).find('.bar .s').css({width:'0%'});
    $(LoadingInfoDOM).find('.text').html('Cerate World');

    // Setup our world
    world = new CANNON.World();
    world.quatNormalizeSkip = 0;
    world.quatNormalizeFast = false;
    var solver = new CANNON.GSSolver();
    world.defaultContactMaterial.contactEquationStiffness = 1e9;
    world.defaultContactMaterial.contactEquationRelaxation = 4;
    solver.iterations = 7;
    solver.tolerance = 0.1;
    world.solver = new CANNON.SplitSolver(solver);
    world.gravity.set(0,0,-9.8/2);
    world.broadphase = new CANNON.NaiveBroadphase();

    // Setup GarageWorld
    GarageWorld = new CANNON.World();
    GarageWorld.quatNormalizeSkip = 0;
    GarageWorld.quatNormalizeFast = false;
    var solver = new CANNON.GSSolver();
    GarageWorld.defaultContactMaterial.contactEquationStiffness = 1e9;
    GarageWorld.defaultContactMaterial.contactEquationRelaxation = 4;
    solver.iterations = 7;
    solver.tolerance = 0.1;
    GarageWorld.solver = new CANNON.SplitSolver(solver);
    GarageWorld.gravity.set(0,0,-9.8/2);
    GarageWorld.broadphase = new CANNON.NaiveBroadphase();
    

    //預設材質碰撞
    // Create a slippery material (friction coefficient = 0.0)
    physicsMaterial = new CANNON.Material("slipperyMaterial");
    groundMaterial = new CANNON.Material("groundMaterial");
    wheelMaterial = new CANNON.Material("wheelMaterial");
    WallMaterial = new CANNON.Material("WallMaterial");
    CarBodyMaterial = new CANNON.Material("CarBodyMaterial");
    CarBodyMaterial = new CANNON.Material("CarBodyMaterial");
    GrassMaterial = new CANNON.Material("GrassMaterial");


    var physicsContactMaterial = new CANNON.ContactMaterial(physicsMaterial,
                                                            physicsMaterial,
                                                            {
                                                                friction: 0.1, // friction coefficient
                                                                restitution: 0.5
                                                            }  // restitution
                                                            );
    // We must add the contact materials to the world
    world.addContactMaterial(physicsContactMaterial);


    //輪胎與地面碰撞
    var wheelGroundContactMaterial = new CANNON.ContactMaterial(wheelMaterial, 
                                                                groundMaterial, 
                                                                {
                                                                    friction: 0.8,
                                                                    restitution: 0,
                                                                    contactEquationStiffness: /*1000*/1e7
                                                                });

    // We must add the contact materials to the world
    world.addContactMaterial(wheelGroundContactMaterial);

    //輪胎與草地碰撞
    var wheelGrassContactMaterial = new CANNON.ContactMaterial(wheelMaterial, 
                                                                GrassMaterial, 
                                                                {
                                                                    friction: 0,
                                                                    restitution: 1,
                                                                    contactEquationStiffness: /*1000*/1e7
                                                                });

    // We must add the contact materials to the world
    world.addContactMaterial(wheelGrassContactMaterial);

    //輪胎與牆壁碰撞
    var WheelWallContactMaterial = new CANNON.ContactMaterial(WallMaterial, 
                                                                wheelMaterial, 
                                                                {
                                                                    friction: 0.025,
                                                                    restitution: 0,
                                                                    contactEquationStiffness: /*1000*/1e7
                                                                });

    // We must add the contact materials to the world
    world.addContactMaterial(WheelWallContactMaterial);

    //車體與地面碰撞
    var CarBodyGroundContactMaterial = new CANNON.ContactMaterial(CarBodyMaterial, 
                                                                groundMaterial, 
                                                                {
                                                                    friction: /*0.005*/0.1,
                                                                    restitution: 0,
                                                                    contactEquationStiffness: /*1000*/1e7
                                                                });

    // We must add the contact materials to the world
    world.addContactMaterial(CarBodyGroundContactMaterial);

    //車體與車體
    var CarBodyCarBodyContactMaterial = new CANNON.ContactMaterial(CarBodyMaterial, 
                                                                CarBodyMaterial, 
                                                                {
                                                                    friction: 0.01,
                                                                    restitution: 0,
                                                                    contactEquationStiffness: /*1000*/1e7
                                                                });

    // We must add the contact materials to the world
    world.addContactMaterial(CarBodyCarBodyContactMaterial);

    //車體與牆壁
    var WallCarBodyContactMaterial = new CANNON.ContactMaterial(CarBodyMaterial, 
                                                                WallMaterial, 
                                                                {
                                                                    friction: 0.025,
                                                                    restitution: 0,
                                                                    contactEquationStiffness: /*1000*/1e7
                                                                });

    // We must add the contact materials to the world
    world.addContactMaterial(WallCarBodyContactMaterial);

    //地面
    var groundShape = new CANNON.Plane();
    GroundBody = new CANNON.Body({
        mass: 0,
        material:groundMaterial
    });
    GroundBody.addShape(groundShape);
    world.addBody(GroundBody);
    GarageWorld.addBody(GroundBody);


    GroundBody.addEventListener("collide",function(e){
        
        //console.log('ground');
        //console.log(e.contact);
    });

    //草地
    var GrassBody=new CANNON.Body({
        mass:0,
        material:GrassMaterial
    });
    GrassBody.addShape(new CANNON.Box(new CANNON.Vec3(500,1.25,0.05/5)),new CANNON.Vec3(0,0,0));
    world.addBody(GrassBody);


    //左牆
    var groundShape = new CANNON.Plane();
    var LGroundBody = new CANNON.Body({
        mass: 0,
        material:WallMaterial
    });
    LGroundBody.position.y=-14;
    LGroundBody.addShape(groundShape);
    LGroundBody.quaternion.setFromAxisAngle(new CANNON.Vec3(1,0,0),-Math.PI/2);
    world.addBody(LGroundBody);

    var groundShape = new CANNON.Plane();
    var LGroundBody2 = new CANNON.Body({
        mass: 0,
        material:WallMaterial
    });
    LGroundBody2.position.y=-14;
    LGroundBody2.position.z=0.25;
    LGroundBody2.addShape(groundShape);
    LGroundBody2.quaternion.setFromAxisAngle(new CANNON.Vec3(1,0,0),-Math.PI/4);
    world.addBody(LGroundBody2);

    


    //右牆
    var groundShape = new CANNON.Plane();
    var RGroundBody = new CANNON.Body({
        mass: 0,
        material:WallMaterial
    });
    RGroundBody.position.y=14;
    RGroundBody.addShape(groundShape);
    RGroundBody.quaternion.setFromAxisAngle(new CANNON.Vec3(1,0,0),Math.PI/2);
    world.addBody(RGroundBody);

    var groundShape = new CANNON.Plane();
    var RGroundBody2 = new CANNON.Body({
        mass: 0,
        material:WallMaterial
    });
    RGroundBody2.position.y=14;
    RGroundBody2.position.z=0.25;
    RGroundBody2.addShape(groundShape);
    RGroundBody2.quaternion.setFromAxisAngle(new CANNON.Vec3(1,0,0),Math.PI/4);
    world.addBody(RGroundBody2);

}

function LoadResource(CallBack)
{
    //Set LoadingManager
    LoadingManager=new THREE.LoadingManager();
    $(LoadingInfoDOM).find('.text').html('Cerate World');

    LoadingManager.onProgress=function(Url,ItemsLoaded,ItemsTotal){
        //console.log( 'Loading file: ' + Url + '.\nLoaded ' + ItemsLoaded + ' of ' + ItemsTotal + ' files.' );
        var Per=(ItemsTotal!=0)?ItemsLoaded/ItemsTotal:1;
        $(LoadingInfoDOM).find('.text').html(Url);
        $(LoadingInfoDOM).find('.bar .s').css({width:(Per*100)+'%'});
    };
    LoadingManager.onLoad=CallBack;

    //讀取外部物件
    var loader = new THREE.ObjectLoader(LoadingManager);
    loader.load("textures/WEX/model.json",function (obj){ WEXModel[0]=obj; });
    var loader = new THREE.ObjectLoader(LoadingManager);
    loader.load("textures/WEX/wheel.json",function (obj){ WEXModel[1]=obj; });
    var loader = new THREE.ObjectLoader(LoadingManager);
    loader.load("textures/WEX/wheel-other.json",function (obj){ WEXModel[2]=obj; });
    var loader = new THREE.ObjectLoader(LoadingManager);
    loader.load("textures/car/model.json",function (obj){ CarModel[0]=obj; });
    var loader = new THREE.ObjectLoader(LoadingManager);
    loader.load("textures/car/model-L1.json",function (obj){ CarModel[1]=obj; });
    var loader = new THREE.ObjectLoader(LoadingManager);
    loader.load("textures/bus/model.json",function (obj){ BusModel[0]=obj; });
    var loader = new THREE.ObjectLoader(LoadingManager);
    loader.load("textures/bus/model-L1.json",function (obj){ BusModel[1]=obj; });
    var loader = new THREE.ObjectLoader(LoadingManager);
    loader.load("textures/Trailer Truck/model.json",function (obj){ TrailerTruckModel=obj; });
    var loader = new THREE.ObjectLoader(LoadingManager);
    loader.load("textures/Trailer Truck/model-FOV.json",function (obj){ TrailerTruckFOVModel=obj; });
    
    //讀取外部材質
    SmokeTexture = new THREE.TextureLoader(LoadingManager).load("textures/smoke2.png");
    LightTexture = new THREE.TextureLoader(LoadingManager).load("textures/light/light1.png");
    StreetlightLightTexture = new THREE.TextureLoader(LoadingManager).load("textures/light/Streetlight-light.png");
    LightOnGroundTexture = new THREE.TextureLoader(LoadingManager).load("textures/light/lightOnGround.png");
    SafetyLineTexture = new THREE.TextureLoader(LoadingManager).load("textures/SafetyLine.png");
    SafetyLineTexture.wrapS = THREE.RepeatWrapping;
    SafetyLineTexture.wrapT = THREE.RepeatWrapping;
    SafetyLineTexture.repeat.set(1,5);

    RoadTexture = new THREE.TextureLoader(LoadingManager).load("textures/road-small.jpg");
    RoadTexture.wrapS = THREE.RepeatWrapping;
    RoadTexture.wrapT = THREE.RepeatWrapping;
    RoadTexture.repeat.set(5,5);
    
    GarageRoadTexture = new THREE.TextureLoader(LoadingManager).load("textures/road-small.jpg");
    GarageRoadTexture.wrapS = THREE.RepeatWrapping;
    GarageRoadTexture.wrapT = THREE.RepeatWrapping;
    GarageRoadTexture.repeat.set(500,500);
    
    LineTexture = new THREE.TextureLoader(LoadingManager).load("textures/line.png");
    LineTexture.wrapS = THREE.RepeatWrapping;
    LineTexture.wrapT = THREE.RepeatWrapping;
    LineTexture.repeat.set(5,1);

    GrassTexture = new THREE.TextureLoader(LoadingManager).load("textures/grass-small.jpg");
    GrassTexture.wrapS = THREE.RepeatWrapping;
    GrassTexture.wrapT = THREE.RepeatWrapping;
    GrassTexture.repeat.set(5,1);

    BillboardTexture = new THREE.TextureLoader(LoadingManager).load("textures/Billboard.png");
    //BillboardTexture.minFilter = THREE.LinearMipMapLinearFilter;

    FireTexture.push(new THREE.TextureLoader(LoadingManager).load("textures/fire/fire2.png"));
    FireTexture.push(new THREE.TextureLoader(LoadingManager).load("textures/fire/fire3.png"));
    FireTexture.push(new THREE.TextureLoader(LoadingManager).load("textures/fire/fire4.png"));
    FireTexture.push(new THREE.TextureLoader(LoadingManager).load("textures/fire/fire5.png"));
    FireTexture.push(new THREE.TextureLoader(LoadingManager).load("textures/fire/fire6.png"));
}

function InitGarage()
{
    $(LoadingDOM).show();
    $(LoadingInfoDOM).find('.bar .s').css({width:'99%'});
    $(LoadingInfoDOM).find('.text').html('Cerate Garage');

    //歸零
    cancelAnimationFrame(RequestGarageAnimationFrameContorl);

    //Scene
    GarageScene=new THREE.Scene();

    //MainCamera
    GarageMainCamera = new THREE.PerspectiveCamera( 70, window.innerWidth / window.innerHeight, 0.1,500);
    GarageMainCamera.up=new THREE.Vector3(0,0,1);
    GarageMainCamera.position.set(-10,5,2);
    
    GarageMainCamera.lookAt(0,0,0);
    GarageScene.add(GarageMainCamera);

    //Renderer
    GarageRenderer = new THREE.WebGLRenderer({antialias:true,powerPreference:'high-performance'});
    //Renderer.setClearColor(0xaaccff);
    GarageRenderer.setClearColor((NightMode)?0x111111:0xaaccff);
    GarageRenderer.setPixelRatio( window.devicePixelRatio );
    GarageRenderer.setSize( window.innerWidth, window.innerHeight );
    $('#garage-canvas-div').empty();
    $('#garage-canvas-div').append(GarageRenderer.domElement);

    //環境光
    var Ambient = new THREE.AmbientLight(0xffffff,(NightMode)?0.2:0.7);
    GarageScene.add(Ambient);

    //SpotLight 
    GarageSpotLight = new THREE.SpotLight(0xffffff, 1, 30, Math.PI/4, 0.3);
    GarageSpotLight.position.set(-10,5,10);
    GarageScene.add(GarageSpotLight);

    GarageSpotLightTargetObj=new THREE.Object3D();
    GarageSpotLightTargetObj.position.set(0,0,0);
    GarageScene.add(GarageSpotLightTargetObj);
    GarageSpotLight.target=GarageSpotLightTargetObj;

    //地面
    Geometry=new THREE.PlaneBufferGeometry(2000,2000,1,1);
    Material=new THREE.MeshPhongMaterial({color:0x666666,map:GarageRoadTexture});
    var GroundMash=new THREE.Mesh(Geometry,Material);
    GroundMash.position.z=0;
    GroundMash.receiveShadow=true;  //接收陰影
    GarageScene.add(GroundMash);

    //建構車輛
    GarageAllCar=[];

    var NewCar=new WEX({
        Ai:false,
        CanReset:false,
        Stay:true,
        Scene:GarageScene,
        World:GarageWorld,
        HaveLight:true,
        GarageScore:{
            SpeedMax:0.73,
            Acceleration:0.7,
            Braking:0.5,
            Maneuverability:0.62
        },
        Position:new THREE.Vector3(3.75/2,-8,2)
    });
    GarageAllCar.push(NewCar);
    if(InGarage)
    {
        GarageFocusUnitIndex=0;
        GarageFocusUnit=NewCar;
        GarageCarChange();
    }

    var NewCar=new Sedan({
        Ai:false,
        CanReset:false,
        Stay:true,
        Scene:GarageScene,
        World:GarageWorld,
        HaveLight:true,
        GarageScore:{
            SpeedMax:0.467,
            Acceleration:0.59,
            Braking:0.53,
            Maneuverability:0.57
        },
        Position:new THREE.Vector3(2,-4,2)
    });
    GarageAllCar.push(NewCar);

    var NewCar=new Bus({
        Ai:false,
        CanReset:false,
        Stay:true,
        Scene:GarageScene,
        World:GarageWorld,
        HaveLight:true,
        GarageScore:{
            SpeedMax:0.4,
            Acceleration:0.5,
            Braking:0.3,
            Maneuverability:0.5
        },
        Position:new THREE.Vector3(6.25,0,2)
    });
    GarageAllCar.push(NewCar);

    var NewCar=new TrailerTruck({
        Ai:false,
        CanReset:false,
        Stay:true,
        Scene:GarageScene,
        World:GarageWorld,
        HaveLight:true,
        GarageScore:{
            SpeedMax:0.38,
            Acceleration:0.3,
            Braking:0.25,
            Maneuverability:0.45
        },
        Position:new THREE.Vector3(3.6,5,2)
    });
    NewCar.SetConstraint(true);
    GarageAllCar.push(NewCar);
    GarageAllPackage.push(NewCar.Container);
    


    //Start Animate
    /*setTimeout(function(){
        $(LoadingDOM).hide();
        AnimateGarage();
    },1000);*/
}

function InitHighway()
{
    $(LoadingDOM).show();
    $(LoadingInfoDOM).find('.bar .s').css({width:'99%'});
    $(LoadingInfoDOM).find('.text').html('Cerate Highway');

    //歸零
    AllCar=[];
    AllPackage=[];
    SystemGameOver=false;
    SystemStepPer=1;
    SystemRelativePosition=new THREE.Vector3();
    HUDLastPRMPer=0;
    HUDLastSpeed=0;
    DebugMeedResetCarCount=0;
    cancelAnimationFrame(RequestHighwayAnimationFrameContorl);

    UserMileage=1000*0;         //玩家里程數
    UserDriveMileageMax=0;      //玩家遊戲最高里程數
    UserMileagePer=0;           //里程數百分比
    UserTotalScore=0;           //玩家總分

    $('#hud').show();
    $(ScoreCheckDOM).hide();

    UserSafetyCameraScore=[                                                                      //玩家測速照相分數
        new UserScoreUI({DOM:$('#hud .score-state .SafetyCamera .item').eq(0),DisplayTime:120,DisplayType:'inline-block'}),
        new UserScoreUI({DOM:$('#hud .score-state .SafetyCamera .item').eq(1),DisplayTime:120,DisplayType:'inline-block'}),
        new UserScoreUI({DOM:$('#hud .score-state .SafetyCamera .item').eq(2),DisplayTime:120,DisplayType:'inline-block'}),
        new UserScoreUI({DOM:$('#hud .score-state .SafetyCamera .item').eq(3),DisplayTime:120,DisplayType:'inline-block'}),
        new UserScoreUI({DOM:$('#hud .score-state .SafetyCamera .item').eq(4),DisplayTime:120,DisplayType:'inline-block'})
    ];
    UserWrongWayDriveScore=new UserScoreUI({DOM:$('#hud .score-state .type .item.WrongWayDrive'),DisplayType:'inline-block'});     //玩家逆向行駛分數
    UserCloseDriveScore=new UserScoreUI({DOM:$('#hud .score-state .type .item.CloseDrive'),DisplayType:'inline-block'});        //玩家通過車輛分數
    UserCloseDriveState=[];     //玩家剛剛擦身而過的車輛
    UserDriftScore=new UserScoreUI({DOM:$('#hud .score-state .type .item.Drift'),DisplayType:'inline-block'});                    //玩家甩尾分數
    UserFlyScore=new UserScoreUI({DOM:$('#hud .score-state .type .item.Fly'),DisplayType:'inline-block'});                   //玩家飛行分數
    UserCrackScore=new UserScoreUI({DOM:$('#hud .score-state .type .item.Crack'),DisplayType:'inline-block'});                   //玩家車禍分數
    UserSpeedBonusPer=1;        //速度獎勵
    PutTrafficCone500State=false;      //放置交通錐的狀態
    PutTrafficCone1000State=false;      //放置交通錐的狀態
    PutTrafficCone3000State=false;      //放置交通錐的狀態
    PutTrafficCone5000State=false;      //放置交通錐的狀態
    $(UserSafetyCameraStateDOM).show();

    //Scene
    Scene=new THREE.Scene();
    //Scene.fog = new THREE.Fog(0xaaccff,5000,10000);
    //Scene.fog = new THREE.FogExp2(0xaaccff/*,0.0001*/);


    //MainCamera
    MainCamera = new THREE.PerspectiveCamera( 70, window.innerWidth / window.innerHeight, 0.1,500);
    MainCamera.up=new THREE.Vector3(0,0,1);
    MainCamera.position.set(30,20,10);
    MainCamera.lookAt(0,0,0);

    //太陽光
    SunLight=new THREE.DirectionalLight(0xffffff,(NightMode)?0.5*0:0.3);
    SunLight.position.set(200,-300,500);
    Scene.add(SunLight);

    SetSunShadow(1024);

    //helper = new THREE.CameraHelper( SunLight.shadow.camera );
    //Scene.add(helper);

    //環境光
    var Ambient = new THREE.AmbientLight(0xffffff,(NightMode)?0.2:0.7);
    Scene.add(Ambient);

    //地面
    Geometry=new THREE.PlaneBufferGeometry(30000*10,30000*10,10,10);
    Material=new THREE.MeshPhongMaterial({color:/*0x02183d*/0x222222});
    var GroundMash=new THREE.Mesh(Geometry,Material);
    GroundMash.position.z=0;
    GroundMash.receiveShadow=true;  //接收陰影
    Scene.add(GroundMash);

    //牆面
    var RoadWidth=28;
    var WallHeight=1;

    Geometry=new THREE.PlaneBufferGeometry(500,WallHeight,1,1);  //長500公尺
    Material=new THREE.MeshPhongMaterial({color:0xcccccc});
    var LWalldMash=new THREE.Mesh(Geometry,Material);
    LWalldMash.position.set(0,-RoadWidth/2,WallHeight/2);
    LWalldMash.rotation.x=-90*Math.PI/180;
    LWalldMash.receiveShadow=true;  //接收陰影
    Scene.add(LWalldMash);
    
    Geometry=new THREE.PlaneBufferGeometry(500,WallHeight,1,1);  //長500公尺
    Material=new THREE.MeshPhongMaterial({color:0xcccccc});
    var RWalldMash=new THREE.Mesh(Geometry,Material);
    RWalldMash.position.set(0,RoadWidth/2,WallHeight/2);
    RWalldMash.rotation.x=90*Math.PI/180;
    RWalldMash.receiveShadow=true;  //接收陰影
    Scene.add(RWalldMash);

    //Renderer
    Renderer = new THREE.WebGLRenderer({antialias:true,powerPreference:'high-performance'});
    //Renderer.setClearColor(0xaaccff);
    Renderer.setClearColor((NightMode)?0x111111:0xaaccff);
    Renderer.shadowMap.enabled=true;
    Renderer.setPixelRatio( window.devicePixelRatio );
    Renderer.setSize( window.innerWidth, window.innerHeight );
    $('#canvas-div').empty();
    $('#canvas-div').append(Renderer.domElement);


    var maxAnisotropy = Renderer.capabilities.getMaxAnisotropy();
    if(maxAnisotropy>=2)
    {
        BillboardTexture.anisotropy=2;
        LineTexture.anisotropy=maxAnisotropy;
    }
    
    console.log('start load');

    BillboardObject=new Billboard({
        Position:new THREE.Vector3(-UserMileageMax,0,0)
    });

    //建構路線
    AllLane=[];
    var NewLane=new Lane({
        Index:0,
        Next:[1],
        Position:new THREE.Vector3(0,4.25,0),
        TargetSpeed:140
    });
    AllLane.push(NewLane);
    
    var NewLane=new Lane({
        Index:1,
        Next:[-1,1],
        Position:new THREE.Vector3(0,7.75,0),
        TargetSpeed:120
    });
    AllLane.push(NewLane);
    
    var NewLane=new Lane({
        Index:2,
        Next:[-1],
        Position:new THREE.Vector3(0,11.25,0),
        TargetSpeed:80
    });
    AllLane.push(NewLane);

    var NewLane=new Lane({
        Index:3,
        Next:[1],
        Reverse:true,
        Position:new THREE.Vector3(0,-4.25,0),
        TargetSpeed:140
    });
    AllLane.push(NewLane);
    
    var NewLane=new Lane({
        Index:4,
        Next:[-1,1],
        Reverse:true,
        Position:new THREE.Vector3(0,-7.75,0),
        TargetSpeed:120
    });
    AllLane.push(NewLane);
    
    var NewLane=new Lane({
        Index:5,
        Next:[-1],
        Reverse:true,
        Position:new THREE.Vector3(0,-11.25,0),
        TargetSpeed:80
    });
    AllLane.push(NewLane);
    
    //Smoke
    SmokeArray=[];
    for(var i=0;i<300;i++)
    {
        SmokeArray[i]=new Smoke({
            Texture:SmokeTexture
        });
    }

    //Spark
    SparkArray=[];
    for(var i=0;i<300;i++)
    {
        SparkArray[i]=new Spark({
        });
    }
    
    //CarTrack
    CarTrackArray=[];
    for(var i=0;i<300;i++)
    {
        CarTrackArray[i]=new CarTrack({
        });
    }
    
    //SafetyCamera
    AllSafetyCameraObject=[];
    for(var i=0;i<5;i++)
    {
        var CameraObject=new SafetyCamera({
            Position:new THREE.Vector3((-UserMileageMax/5*(i+1))+10,28/2+0.5,0)
        });
        AllSafetyCameraObject.push(CameraObject);
    }

    //Floor
    AllFloor=[];
    for(var i=0;i<20;i++)
    {
        var NewFloor=new Floor({
            Position:new THREE.Vector3(50*-i,0,0.01),
            HaveLight:(i%2)
        });
        AllFloor.push(NewFloor);
    }

    //TrafficCone
    AllTrafficCone=[];
    for(var i=0;i<10;i++)
    {
        var NewTrafficCone=new TrafficCone({});
        
        AllTrafficCone.push(NewTrafficCone);
        AllPackage.push(NewTrafficCone);
    }


    //建構車輛
    for(var i=0;i<35;i++)
    {
        if(i%3==0)
        {
            var NewCar2=new TrailerTruck({
                Ai:true,
                CanReset:true,
                Position:new THREE.Vector3(0,0,0)
            });
            AllCar.push(NewCar2);
            AllPackage.push(NewCar2.Container);
        }
        if(i%4==0)
        {
            var NewCar2=new Bus({
                Ai:true,
                CanReset:true,
                Position:new THREE.Vector3(0,0,0)
            });
            AllCar.push(NewCar2);
        }

        var NewCar=new Sedan({
            Ai:true,
            CanReset:true,
            Position:new THREE.Vector3(0,0,0.5)
        });
        AllCar.push(NewCar);
    }

    //UserCar
    if(GarageFocusUnit instanceof WEX)
    {
        UserCar=new WEX({
            HaveLight:true,
            InitSpeed:1,
            Position:new THREE.Vector3(0,3,4)
        });
    }
    else if(GarageFocusUnit instanceof Sedan)
    {
        UserCar=new Sedan({
            HaveLight:true,
            InitSpeed:1,
            Position:new THREE.Vector3(0,3,4)
        });
    }
    else if(GarageFocusUnit instanceof Bus)
    {
        UserCar=new Bus({
            HaveLight:true,
            InitSpeed:1,
            Position:new THREE.Vector3(0,3,4)
        });
    }
    else if(GarageFocusUnit instanceof TrailerTruck)
    {
        UserCar=new TrailerTruck({
            HaveLight:true,
            InitSpeed:1,
            Position:new THREE.Vector3(0,3,4)
        });
        UserCar.SetConstraint(true);
        AllPackage.push(UserCar.Container);
    }
    
    AllCar.push(UserCar);
    MainFocusUnit=UserCar;

    //Init Worker
    InitCollideWoker();

    console.log( 'Loading complete!');
    
    if(UpdateSystemObject)
    {
        setInterval(function()
        {
            UpdateSystemObjectCount();
        },1000);
    }
    

    //Start Animate
    /*setTimeout(function(){
        $(LoadingDOM).hide();
        AnimateHighway();
    },1000);*/
    
}

function InitCollideWoker()
{
    //Init Worker
    if(CollideWoker!=null)CollideWoker.terminate();
    CollideWoker=new Worker("CarCollideWorker.js?"+Rand(9999999));
    CollideWokerBusy=false;

    //Worker Callback
    CollideWoker.onmessage=CollideWokerOnMessageCallBack;

    //Set Worker
    var NewCarCollideData=[];
    for(var i=0;i<AllCar.length;i++)
    {
        NewCarCollideData.push({
            Pass:AllCar[i].NeedReset,
            Position:AllCar[i].Body.position,
            Size:AllCar[i].BodySize,
            MoveVector:AllCar[i].MoveDiff,
            Quaternion:AllCar[i].Body.quaternion,
            PassPackageIndex:AllCar[i].AiPassPackageIndexArray,
        });
    }

    var NewPackageCollideData=[];
    for(var i=0;i<AllPackage.length;i++)
    {
        NewPackageCollideData.push({
            Pass:AllPackage[i].NeedReset,
            Position:AllPackage[i].Body.position,
            Size:AllPackage[i].BodySize,
            MoveVector:new THREE.Vector3(0,0,0),
            Quaternion:AllPackage[i].Body.quaternion,
        });
    }

    CollideWokerBusy=true;
    CollideWoker.postMessage({
        Type:'Init',
        CarData:NewCarCollideData,
        PackageData:NewPackageCollideData
    });
}

//Woker CallBack
function CollideWokerOnMessageCallBack(e)
{
    var Data=e.data;

    if(Data.Type=='Inited')
    {

    }
    else if(Data.Type=='OK')
    {
        var Data=e.data;

        for(var i=0,j=AllCar.length;i<j;i++)
        {
            AllCar[i].AiSetWillHitData(Data.CarData[i]);
        }
    }

    CollideTime=CollideClock.getDelta()*1000;
    CollideWokerBusy=false;
}


function SetSunShadow(Size,PositionX=0,PositionZ=0)
{
    SunLight.shadow.camera.left = -Size;
    SunLight.shadow.camera.right = Size;
    SunLight.shadow.camera.top = Size;
    SunLight.shadow.camera.bottom = -Size;
    SunLight.shadow.camera.near = 1;
    SunLight.shadow.camera.far = 2000*4;

    //SunLight.shadow.camera.position.x=PositionX;
    //SunLight.shadow.camera.position.z=PositionZ;

    SunLight.shadow.camera.updateProjectionMatrix();
}

function AnimateGarage()
{
    StatsHUD.update();

    GarageMainCamera.position.x=GarageMainCamera.position.x*0.9+0.1*(GarageFocusUnit.Body.position.x-GarageFocusUnit.BodySize.x/2-3);
    GarageMainCamera.position.y=GarageMainCamera.position.y*0.9+0.1*(GarageFocusUnit.Body.position.y+2);
    GarageMainCamera.position.z=GarageMainCamera.position.z*0.9+0.1*(GarageFocusUnit.Body.position.z+1);

    GarageMainCameraLookAtPosition.x=GarageMainCameraLookAtPosition.x*0.85+0.15*(GarageFocusUnit.Body.position.x-GarageFocusUnit.BodySize.x/2);
    GarageMainCameraLookAtPosition.y=GarageMainCameraLookAtPosition.y*0.85+0.15*(GarageFocusUnit.Body.position.y);
    GarageMainCameraLookAtPosition.z=GarageMainCameraLookAtPosition.z*0.85+0.15*(GarageFocusUnit.Body.position.z);
    
    GarageMainCamera.lookAt(
        GarageMainCameraLookAtPosition.x,
        GarageMainCameraLookAtPosition.y,
        GarageMainCameraLookAtPosition.z
    );

    GarageWorld.step((1/30)*SystemStepPer);

    for(var i=0;i<GarageAllCar.length;i++)
    {
        GarageAllCar[i].Run();
        GarageAllCar[i].LODUpdate(GarageMainCamera);
    }
    for(var i=0,j=GarageAllPackage.length;i<j;i++)
    {
        GarageAllPackage[i].Run();
        GarageAllPackage[i].LODUpdate(GarageMainCamera);
    }

    GarageRenderer.render(GarageScene, GarageMainCamera);

    if(!KeyBoardPressArray[39] && !KeyBoardPressArray[37])
    {
        GarageKeyNextPervDelay=0;
    }
    if(GarageKeyNextPervDelay>0)
    {
        GarageKeyNextPervDelay--;
    }
    else
    {
        if(KeyBoardPressArray[39])
        {
            GaragePervCar();
            GarageKeyNextPervDelay=20;
        }
        else if(KeyBoardPressArray[37])
        {
            GarageNextCar();
            GarageKeyNextPervDelay=20;
        }
    }

    RequestGarageAnimationFrameContorl=requestAnimationFrame(AnimateGarage);
}

function AnimateHighway()
{
    SystemClock.start();

    //Reset to 0
    if(MainFocusUnit!=null)
    {
        if(UserMileage<=-50)
        {
            MainFocusUnit.UserReset();
            MainFocusUnit.Body.position.x-=50;
            UserMileage+=50;
        }

        SystemRelativePosition=new THREE.Vector3(
            0-MainFocusUnit.Body.position.x,
            0-MainFocusUnit.Body.position.y,
            0-MainFocusUnit.Body.position.z);

        UserMileage+=SystemRelativePosition.x;

        UserMileagePer=UserMileage/UserMileageMax;
        if(UserMileagePer>1)UserMileagePer=1;
        else if(UserMileagePer<0)UserMileagePer=0;

        UserDriveMileageMax=Math.max(UserMileage,UserDriveMileageMax);

        for(var i=0,j=AllCar.length;i<j;i++)
        {
            AllCar[i].Body.position.x+=SystemRelativePosition.x;
        }
        for(var i=0,j=AllPackage.length;i<j;i++)
        {
            AllPackage[i].Body.position.x+=SystemRelativePosition.x;
        }
        
        for(var i=0,j=AllFloor.length;i<j;i++)
        {
            AllFloor[i].MeshGroup.position.x+=SystemRelativePosition.x;
        }
        for(var i=0,j=SmokeArray.length;i<j;i++)
        {
            //if(SmokeArray[i].Alive)
            {
                SmokeArray[i].Position.x+=SystemRelativePosition.x;
            }
        }
        for(var i=0,j=SparkArray.length;i<j;i++)
        {
            //if(SmokeArray[i].Alive)
            {
                SparkArray[i].Position.x+=SystemRelativePosition.x;
            }
        }
        for(var i=0,j=CarTrackArray.length;i<j;i++)
        {
            if(CarTrackArray[i].Alive)
            {
                CarTrackArray[i].MeshGroup.position.x+=SystemRelativePosition.x;
            }
        }
        
        for(var i=0,j=RockArray.length;i<j;i++)
        {
            //if(SmokeArray[i].Alive)
            {
                RockArray[i].Position.x+=SystemRelativePosition.x;
            }
        }
        
        for(var i=0,j=AllSafetyCameraObject.length;i<j;i++)
        {
            AllSafetyCameraObject[i].MeshGroup.position.x+=SystemRelativePosition.x;
        }

        BillboardObject.Position.x+=SystemRelativePosition.x;
    }


    if(UserMileage>=500 && !PutTrafficCone500State)
    {
        PutTrafficCone500State=true;
        PutTrafficCone();
    }
    else if(UserMileage>=1000 && !PutTrafficCone1000State)
    {
        PutTrafficCone1000State=true;
        PutTrafficCone();
    }
    else if(UserMileage>=3000 && !PutTrafficCone3000State)
    {
        PutTrafficCone3000State=true;
        PutTrafficCone();
    }
    else if(UserMileage>=5000 && !PutTrafficCone5000State)
    {
        PutTrafficCone5000State=true;
        PutTrafficCone();
    }
    


    if(SystemGameOver)
    {
        SystemStepPer=0.05;
    }


    //Init CollideData
    var CollideData=[];
    for(var i=0;i<AllCar.length;i++)
    {
        CollideData.push({

            Pass:/*true,*/AllCar[i].NeedReset,
            Position:new THREE.Vector3(AllCar[i].Body.position.x,AllCar[i].Body.position.y,AllCar[i].Body.position.z),
            //Size:AllCar[i].BodySize,
            MoveVector:AllCar[i].MoveDiff,
            Quaternion:new THREE.Quaternion(AllCar[i].Body.quaternion.x,AllCar[i].Body.quaternion.y,AllCar[i].Body.quaternion.z,AllCar[i].Body.quaternion.w)
        });
    }

    var PackageData=[];
    for(var i=0;i<AllPackage.length;i++)
    {
        PackageData.push({

            Pass:AllPackage[i].NeedReset,
            Position:new THREE.Vector3(AllPackage[i].Body.position.x,AllPackage[i].Body.position.y,AllPackage[i].Body.position.z),
            //Size:AllPackage[i].BodySize,
            MoveVector:new THREE.Vector3(0,0,0),
            Quaternion:new THREE.Quaternion(AllPackage[i].Body.quaternion.x,AllPackage[i].Body.quaternion.y,AllPackage[i].Body.quaternion.z,AllPackage[i].Body.quaternion.w)
        });
    }

    if(!CollideWokerBusy)
    {
        CollideClock.start();

        CollideWokerBusy=true;
            CollideWoker.postMessage({
                Type:'ReUse',
                CarData:CollideData,
                PackageData:PackageData
            });
    }

    //console.log(CollideData);


    //console.log(SystemRelativePosition.x);

    MainCameraPosition=MainCamera.getWorldPosition();

    RequestHighwayAnimationFrameContorl=requestAnimationFrame(AnimateHighway);

    SystemRunClock.start();

    //console.log('run step -----------------------------');

    for(var i=0,j=AllCar.length;i<j;i++)
    {
        AllCar[i].Run();
        AllCar[i].LODUpdate(MainCamera);
    }
    for(var i=0,j=AllPackage.length;i<j;i++)
    {
        AllPackage[i].Run();
        AllPackage[i].LODUpdate(MainCamera);
    }

    SystemAiClock.start();
    for(var i=0,j=AllCar.length;i<j;i++)
    {
        if(AllCar[i].IsAi)
            AllCar[i].Ai();
    }
    SystemAiTime=SystemAiClock.getDelta()*1000;

    SystemLaneClock.start();
    for(var i=0,j=AllLane.length;i<j;i++)
    {
        AllLane[i].Run();
    }
    for(var i=0,j=AllFloor.length;i<j;i++)
    {
        AllFloor[i].Run();
    }
    for(var i=0;i<SmokeArray.length;i++)
    {
        SmokeArray[i].Run();
    }
    for(var i=0;i<SparkArray.length;i++)
    {
        SparkArray[i].Run();
    }
    for(var i=0;i<CarTrackArray.length;i++)
    {
        CarTrackArray[i].Run();
    }
    for(var i=0;i<RockArray.length;i++)
    {
        RockArray[i].Run();
    }
    BillboardObject.Run();


    SystemLaneTime=SystemLaneClock.getDelta()*1000;

    SystemRunTime=SystemRunClock.getDelta()*1000;


    WorldRunClock.start();
    world.step((1/30)*SystemStepPer);
    SystemWorldTime=WorldRunClock.getDelta()*1000;


    var F=MainFocusUnit.Camera.getWorldPosition();
    //var F=AllCar[3].Camera.getWorldPosition();
    MainCamera.position.x=F.x;
    MainCamera.position.y=F.y;
    MainCamera.position.z=F.z;

    var F=MainFocusUnit.Camera.getWorldQuaternion();
    //var F=AllCar[3].Camera.getWorldQuaternion();
    MainCamera.quaternion.x=F.x;
    MainCamera.quaternion.y=F.y;
    MainCamera.quaternion.z=F.z;
    MainCamera.quaternion.w=F.w;
    
    

    //if(Date.now()-SystemRenderTimePoint>(1000/SystemRenderTargetFps))
    {
        StatsHUD.update();

        SystemRenderClock.start();

        MainCamera.updateMatrix(); // make sure Camera's local matrix is updated
        MainCamera.updateMatrixWorld(); // make sure Camera's world matrix is updated
        MainCamera.matrixWorldInverse.getInverse(MainCamera.matrixWorld);
        
        Renderer.render(Scene, MainCamera);
        SystemRenderTime=SystemRenderClock.getDelta()*1000;


        //更新HUD
        if(MainFocusUnit!=null)
        {
            var DisplayUnit=MainFocusUnit;
            //DisplayUnit=AllCar[3];

            //速度
            HUDSpeedKmDiv.html(Math.round(DisplayUnit.Speed.x*-3.6*60 *((UserEnvironmentSetting.UnitofSpeed=='mph')?0.621371192237334:1) ));
            //加速度
            //HUDSpeedDiffDiv.html(Math.round((DisplayUnit.Speed.x-HUDLastSpeed)*-3.6*60*60*10)/10);

            //O2N2
            var Max=-HUDO2N2BarstrokeDashoffsetMin;
            var Min=-HUDO2N2BarstrokeDashoffsetMax;
            var Value=(Max-Min)*(DisplayUnit.GetO2N2Per())+Min;
            HUDO2N2BarDiv.css({strokeDashoffset:Value});

            //RPM
            HUDLastPRMPer=HUDLastPRMPer*0.7+DisplayUnit.GetEngineSpeedPer()*0.3;
            var Max=-(HUDRPMSvgstrokeDashoffsetMin)-30;
            var Min=-(HUDRPMSvgstrokeDashoffsetMax)+30;
            var Value=(Max-Min)*(HUDLastPRMPer)+Min;
            HUDRPMDiv.css({strokeDashoffset:Value,stroke:(HUDLastPRMPer>=DisplayUnit.BestGearPer)?'#f00':'#fff'});

            //GEAR
            //console.log(DisplayUnit.NowGearDashArrayData);
            HUDGearBarBgDiv.css({'stroke-dasharray':DisplayUnit.AllGearDashArrayData});
            HUDGearBarDiv.css({'stroke-dasharray':DisplayUnit.NowGearDashArrayData});
            
            
        }

        //更新路程資訊
        HUDDrivePercentDiv.css({width:UserMileagePer*100+'%'});
        HUDDrivePercentTextDiv.html(Math.floor(UserMileagePer*100));
        

    }

    if(SafetyCameraFlashDOMShow)
    {
        SafetyCameraFlashDOM.hide();
    }

    //計算分數
    if(!SystemGameOver)
    {
        UserSpeedBonusPer=Math.abs(MainFocusUnit.Speed.x)*2+1;

        if(UserMileage<UserDriveMileageMax)
            UserSpeedBonusPer=0;

        if(UserMileage>=UserDriveMileageMax && MainFocusUnit.MoveDiff.x<0)
        {
            if(Math.abs(MainFocusUnit.Speed.x)>0.1)
            {
                //逆向
                if(MainFocusUnit.Body.position.y<-3)
                {
                    UserWrongWayDriveScore.Add(0.1*MainFocusUnit.Speed.length()*UserSpeedBonusPer);
                    UserWrongWayDriveScore.Count+=MainFocusUnit.MoveDiff.length();
                    UserTotalScore+=0.1*MainFocusUnit.Speed.length()*UserSpeedBonusPer;
                }
                //甩尾
                if(MainFocusUnit.OnDrift)
                {
                    UserDriftScore.Add(0.5*MainFocusUnit.Speed.length()*UserSpeedBonusPer);
                    UserDriftScore.Count+=MainFocusUnit.MoveDiff.length();
                    UserTotalScore+=0.5*MainFocusUnit.Speed.length()*UserSpeedBonusPer;
                }
                //飛行
                if(MainFocusUnit.OnFly)
                {
                    UserFlyScore.Add(2*Math.abs(MainFocusUnit.Speed.x)*UserSpeedBonusPer);
                    UserFlyScore.Count+=MainFocusUnit.MoveDiff.length();
                    UserTotalScore+=2*Math.abs(MainFocusUnit.Speed.x)*UserSpeedBonusPer;
                }

                //擦身而過
                for(var k=0,l=UserCloseDriveState.length;k<l;k++)
                {
                    if(UserCloseDriveState[k])
                    {
                        UserCloseDriveState[k].Delay-=Math.abs(MainFocusUnit.Speed.x);

                        if(UserCloseDriveState[k].Delay<=0)
                        {
                            UserCloseDriveState.splice(k,1);
                        }
                    }
                }
                
                for(var i=0,j=AllCar.length;i<j;i++)
                {
                    if(!AllCar[i].IsAi)continue;
                    if(AllCar[i].NeedReset)continue;

                    //跳過重複
                    var Pass=false;
                    for(var k=0,l=UserCloseDriveState.length;k<l;k++)
                    {
                        if(UserCloseDriveState[k].Obj==AllCar[i])
                        {
                            Pass=true; break;
                        }
                    }
                    if(Pass)continue;

                    var Dis=MainFocusUnit.Distance3D(AllCar[i].MeshGroup.position);

                    if(Dis<2.5+AllCar[i].BodySize.y/2)
                    {
                        //紀錄，避免重複算分
                        UserCloseDriveState.push({
                            Obj:AllCar[i],
                            Delay:100
                        });

                        UserCloseDriveScore.Add(5*UserSpeedBonusPer);
                        UserCloseDriveScore.Count++;
                        UserTotalScore+=5*UserSpeedBonusPer;
                    }
                }
            }

            //測速
            for(var i=0;i<UserSafetyCameraScore.length;i++)
            {
                if(!UserSafetyCameraScore[i].Used && UserMileage>(UserMileageMax/5)*(i+1))
                {
                    UserSafetyCameraStateDOM.eq(i).hide();
                    UserSafetyCameraScore[i].Used=true;
                    UserSafetyCameraScore[i].Count=(MainFocusUnit.Speed.length()*60*3.6);
                    UserSafetyCameraScore[i].Add(0);
                    
                    if(Math.abs(MainFocusUnit.Speed.x)*60*3.6>=120)
                    {
                        UserSafetyCameraScore[i].Add(1000*Math.abs(MainFocusUnit.Speed.x)*UserSpeedBonusPer);
                        UserTotalScore+=1000*Math.abs(MainFocusUnit.Speed.x)*UserSpeedBonusPer;
                        
                        SafetyCameraFlashDOMShow=true;
                        SafetyCameraFlashDOM.show();
                    }
                }
            }
        }

        //分數HUD
        UserWrongWayDriveScore.Run();
        UserCloseDriveScore.Run();
        UserDriftScore.Run();
        for(var i=0;i<UserSafetyCameraScore.length;i++)
            UserSafetyCameraScore[i].Run();
        UserFlyScore.Run();

        //總分
        UserTotalScoreDOM.html(Math.floor(UserTotalScore));
        UserSpeedBonusDOM.html(Math.floor(UserSpeedBonusPer*10)/10);
    }


    if(!SystemGameOver && UserMileagePer>=1)
    {
        SystemGameOver=true;
        GameOverReMathScore();
    }

    
    SystemResetClock.start();

    //Reset
    for(var i=0,j=AllCar.length;i<j;i++)
    {
        if(AllCar[i].NeedReset)
        {
            AllCar[i].Reset();
        }
    }

    SystemResetTime=SystemResetClock.getDelta()*1000;


    SystemTime=SystemClock.getDelta()*1000;

}



var DebugRunCount=0;

function Render()
{
    //Do nothing something
}


function GameOverReMathScore()
{
    $('#hud').hide();

    $(ScoreCheckDOM).show();

    $(ScoreCheckDOM).find('.score-type .WrongWayDrive .count').html(Math.round(UserWrongWayDriveScore.Count*((UserEnvironmentSetting.UnitofSpeed=='mph')?3.2808:1)*10)/10);
    $(ScoreCheckDOM).find('.score-type .WrongWayDrive .score').html(Math.floor(UserWrongWayDriveScore.TotalScore).numberFormat(0));
    
    $(ScoreCheckDOM).find('.score-type .CloseDrive .count').html(UserCloseDriveScore.Count);
    $(ScoreCheckDOM).find('.score-type .CloseDrive .score').html(Math.floor(UserCloseDriveScore.TotalScore).numberFormat(0));
    
    $(ScoreCheckDOM).find('.score-type .Drift .count').html(Math.round(UserDriftScore.Count*((UserEnvironmentSetting.UnitofSpeed=='mph')?3.2808:1)*10)/10);
    $(ScoreCheckDOM).find('.score-type .Drift .score').html(Math.floor(UserDriftScore.TotalScore).numberFormat(0));
    
    $(ScoreCheckDOM).find('.score-type .Fly .count').html(Math.round(UserFlyScore.Count*((UserEnvironmentSetting.UnitofSpeed=='mph')?3.2808:1)*10)/10);
    $(ScoreCheckDOM).find('.score-type .Fly .score').html(Math.floor(UserFlyScore.TotalScore).numberFormat(0));
    
    $(ScoreCheckDOM).find('.score-total .score').html(Math.floor(UserTotalScore).numberFormat(0));

    for(var i=0;i<UserSafetyCameraScore.length;i++)
    {
        $(ScoreCheckDOM).find('.camera-score .item').eq(i)
        .find('.count').html(Math.floor(UserSafetyCameraScore[i].Count*((UserEnvironmentSetting.UnitofSpeed=='mph')?0.621371192237334:1)));
        
        $(ScoreCheckDOM).find('.camera-score .item').eq(i)
        .find('.score').html(Math.floor(UserSafetyCameraScore[i].TotalScore).numberFormat(0));
        
    }
}


//https://stackoverflow.com/questions/33152132/three-js-collada-whats-the-proper-way-to-dispose-and-release-memory-garbag/33199591#33199591
function disposeNode (node)
{
    if (node instanceof THREE.Camera) {
        node = undefined;
    }
    else if (node instanceof THREE.Light)
    {
        node.dispose();
        node = undefined;
    }
    else if (node instanceof THREE.Mesh)
    {
        if (node.geometry)
        {
            node.geometry.dispose ();
            node.geometry = undefined;
        }

        if (node.material)
        {
            if (node.material instanceof THREE.MeshFaceMaterial)
            {
                $.each (node.material.materials, function (idx, mtrl)
                {
                    if (mtrl.map)           mtrl.map.dispose ();
                    if (mtrl.lightMap)      mtrl.lightMap.dispose ();
                    if (mtrl.bumpMap)       mtrl.bumpMap.dispose ();
                    if (mtrl.normalMap)     mtrl.normalMap.dispose ();
                    if (mtrl.specularMap)   mtrl.specularMap.dispose ();
                    if (mtrl.envMap)        mtrl.envMap.dispose ();

                    mtrl.dispose ();    // disposes any programs associated with the material
                    mtrl.geometry = undefined;
                });
            }
            else
            {
                if (node.material.map)          node.material.map.dispose ();
                if (node.material.lightMap)     node.material.lightMap.dispose ();
                if (node.material.bumpMap)      node.material.bumpMap.dispose ();
                if (node.material.normalMap)    node.material.normalMap.dispose ();
                if (node.material.specularMap)  node.material.specularMap.dispose ();
                if (node.material.envMap)       node.material.envMap.dispose ();

                node.material.dispose ();   // disposes any programs associated with the material
                node.geometry = undefined;
            }
        }
    }
}   // disposeNode

function disposeHierarchy (node, callback)
{
    /*for (var i = node.children.length - 1; i >= 0; i--)
    {
        var child = node.children[i];
        disposeHierarchy (child, callback);
        callback (child);
    }

    console.log('a');*/

    if(node.children.length>0)
    {
        for(var i=node.children.length-1;i>=0;i--)
        {
            disposeHierarchy(node.children[i]);
        }
    }

    disposeNode(node);
}


var DebugObjectStateDiv=$('#debug-object-state-div');

$(DebugObjectStateDiv).css({
    'position':'absolute',
    'z-index':'9999',
    'top':'0px',
    'left':'0px',
    'color':(NightMode)?'#fff':'#000'
})

function UpdateSystemObjectCount()
{

    var Str='';
    Str+= 'SystemRenderTime: '+SystemRenderTime+'<br>';
    Str+= 'SystemRunTime: '+SystemRunTime+'<br>';
    Str+= 'SystemAiTime: '+SystemAiTime+'<br>';
    Str+= 'SystemLaneTime: '+SystemLaneTime+'<br>';

    Str+= 'SystemResetTime: '+SystemResetTime+'<br>';
    Str+= 'SystemWorldTime: '+SystemWorldTime+'<br>';
    Str+= 'SystemTime: '+SystemTime+'<br>';
    Str+= 'CollideTime: '+CollideTime+'<br>';
    //Str+= 'CollideTime2: '+CollideTime2+'<br>';
    
    Str+= 'SmokeArray: '+SmokeArray.length+' ('+SmokeSetIndex+')<br>';
    Str+= 'SparkArray: '+SparkArray.length+' ('+SparkSetIndex+')<br>';
    
    Str+= 'CarTrackArray: '+CarTrackArray.length+' ('+CarTrackSetIndex+')<br>';

    Str+= 'DebugMeedResetCarCount: '+DebugMeedResetCarCount+'<br>';
    


    DebugObjectStateDiv.html(Str);
}

function UserScoreUI(iConfig)
{
    var Config={
        DOM:null,
        DisplayTime:90,
        DisplayType:'block',
    };

    Config=$.extend(Config,iConfig);

    var Visible=false;
    var DisplayTime=0;
    var DisplayTimeMax=Config.DisplayTime;
    
    this.TotalScore=0;
    var DisplayScore=0;
    this.Count=0;
    this.Used=false;
    Config.DOM.css('display','none');
    var ScoreDOM=Config.DOM.find('span.s');

    this.Add=function(AddScore){
        this.TotalScore+=AddScore;

        DisplayScore+=AddScore*1;
        DisplayTime=DisplayTimeMax*1;
    };

    this.Run=function(){

        if(DisplayTime>0 && !Visible)
        {
            Visible=true;
            Config.DOM.css('display',Config.DisplayType);
            ScoreDOM.html(Math.floor(DisplayScore));
        }
        else if(Visible)
        {
            ScoreDOM.html(Math.floor(DisplayScore));
        }

        if(DisplayTime>0)
        {
            DisplayTime--;
        }

        if(DisplayTime<=0 && Visible)
        {
            Visible=false;
            Config.DOM.css('display','none');
            DisplayScore=0;
        }

    };
}

//檢查按鈕是否按下
function CheckKeyBoardPress(ASCIIData)
{
    for(var i=0,j=ASCIIData.length;i<j;i++)
    {
        if(KeyBoardPressArray[ASCIIData[i]])
            return true;
    }

    return false;
}

$('.env-setting-dialog .language-row .right .item').removeClass('selected');
$('.env-setting-dialog .language-row .right .item[data-language="'+UserEnvironmentSetting.Language+'"]').addClass('selected');
$('.env-setting-dialog .speedunit-row .right .item').removeClass('selected');
$('.env-setting-dialog .speedunit-row .right .item[data-unit="'+UserEnvironmentSetting.UnitofSpeed+'"]').addClass('selected');

$('.dialog .button').on('click',function(){
    $(this).parents('.dialog').hide();
});
$('.dialog .cancel').on('click',function(){
    $(this).parents('.dialog').hide();
});

$('#score-check .button').on('click',function(){
    $(this).parents('#score-check').hide();
    StartInit();
});

$('#env-setting-button').on('click',function(){
    $('.env-setting-dialog').show();
});

$('#keyboard-setting-button').on('click',function(){
    $('.keyboard-setting-dialog').show();
});

$('#garage-select-car-div .container .next-car-button').on('click',function(){
    
    GarageNextCar();
});
$('#garage-select-car-div .container .perv-car-button').on('click',function(){

    GaragePervCar();
});
$('#garage-select-car-div .racing-button').on('click',function(){
    
    InGarage=false;

    $(LoadingDOM).show();
    $(LoadingInfoDOM).find('.text').html('Cerate World');

    initCannon();
    InitHighway();

    setTimeout(function(){
        $(LoadingDOM).hide();
        SceneChange();
    },1000);
});
$('#goto-garage-button').on('click',function(){

    $('.goto-garage-dialog').show();
});
$('.goto-garage-dialog .button').on('click',function(){

    InGarage=true;

    initCannon();
    InitGarage();

    setTimeout(function(){
        $(LoadingDOM).hide();
        SceneChange();
    },1000);
});

function GarageNextCar()
{
    GarageFocusUnitIndex++;
    if(GarageFocusUnitIndex>=GarageAllCar.length-1)
        GarageFocusUnitIndex=GarageAllCar.length-1;
    
    GarageFocusUnit=GarageAllCar[GarageFocusUnitIndex];
    GarageCarChange();
}
function GaragePervCar()
{
    GarageFocusUnitIndex--;
    if(GarageFocusUnitIndex<=0)
        GarageFocusUnitIndex=0;
    
    GarageFocusUnit=GarageAllCar[GarageFocusUnitIndex];
    GarageCarChange();
}
function GarageCarChange()
{
    var CarScore=GarageFocusUnit.GetConfig().GarageScore;
    GarageCarSpeedScoreDOM.css({width:CarScore.SpeedMax*100+'%'});
    GarageCarAccelerationScoreDOM.css({width:CarScore.Acceleration*100+'%'});
    GarageCarBrakingScoreDOM.css({width:CarScore.Braking*100+'%'});
    GarageCarManeuverabilityScoreDOM.css({width:CarScore.Maneuverability*100+'%'});
    
}
function SceneChange()
{
    cancelAnimationFrame(RequestGarageAnimationFrameContorl);
    cancelAnimationFrame(RequestHighwayAnimationFrameContorl);
    
    $(ScoreCheckDOM).hide();

    if(InGarage)
    {
        $('#canvas-div').hide();
        $('#garage-canvas-div').show();
        $('#garage-select-car-div').show();
        $('.first-dialog').hide();
        AnimateGarage();
    }
    else
    {
        $('#canvas-div').show();
        $('#garage-canvas-div').hide();
        $('#garage-select-car-div').hide();
        $('.first-dialog').show();
        AnimateHighway();
    }
}


$('.env-setting-dialog .language-row .right .item').on('click',function(){
    var Lan=$(this).data('language');

    $(this).parents('.row').find('.item').removeClass('selected');
    $(this).addClass('selected');

    UserEnvironmentSetting.Language=Lan;
    EnvironmentChange();
    
    SetLanguage(Lan);
});

$('.env-setting-dialog .speedunit-row .right .item').on('click',function(){
    var Unit=$(this).data('unit');

    $(this).parents('.row').find('.item').removeClass('selected');
    $(this).addClass('selected');

    UserEnvironmentSetting.UnitofSpeed=Unit;
    EnvironmentChange();

    SpeedUnitMPH=(Unit=='mph');
    SetSpeedUnit();
});

function SetLanguage(NewLanguage)
{
    i18n.set({
        'lang': NewLanguage, //e.g. en-us, zh-tw. Default is auto detect from browser.
        'path': 'lang' // Default is empty (same level as i18n.js)
    });

    LanguageChange();
}
SetLanguage(UserEnvironmentSetting.Language);
function LanguageChange()
{
    $('span.i18n').each(function(){
        var Text=$(this).data('text');
        $(this).html(i18n.t(Text));
    });
}

function SetSpeedUnit()
{
    $('#hud .engine .text.speed').html((UserEnvironmentSetting.UnitofSpeed=='mph')?'mph':'kph');
    $('.unit').html((UserEnvironmentSetting.UnitofSpeed=='mph')?'mi/h':'km/h');

    $('#score-check span[data-text="m"]').toggle((UserEnvironmentSetting.UnitofSpeed=='kph'));
    $('#score-check span[data-text="ft"]').toggle((UserEnvironmentSetting.UnitofSpeed=='mph'));

    if(SystemGameOver)
        GameOverReMathScore();
}
SetSpeedUnit();

function EnvironmentChange()
{
    localStorage.setItem('EnvironmentSetting',JSON.stringify(UserEnvironmentSetting));
}

Number.prototype.numberFormat = function(c, d, t){
    var n = this, 
    c = isNaN(c = Math.abs(c)) ? 2 : c, 
    d = d == undefined ? "." : d, 
    t = t == undefined ? "," : t, 
    s = n < 0 ? "-" : "", 
    i = String(parseInt(n = Math.abs(Number(n) || 0).toFixed(c))), 
    j = (j = i.length) > 3 ? j % 3 : 0;
   return s + (j ? i.substr(0, j) + t : "") + i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + t) + (c ? d + Math.abs(n - i).toFixed(c).slice(2) : "");
 };

</script>
