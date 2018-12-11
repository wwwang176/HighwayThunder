function EnvironmentSetting(iConfig)
{
    var Config={
        Language:'zh-tw',          //語言
        UnitofSpeed:'kph',     //速度單位
    };

    Config=$.extend(Config,iConfig);

    this.Language=Config.Language;
    this.UnitofSpeed=Config.UnitofSpeed;
}