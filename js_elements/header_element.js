let headers = document.getElementsByClassName("header");
for (let i=0;i<headers.length;i++){
    headers[i].innerHTML = `
        <div class="header-container">
            <div style = "float: inline-start;">
            <a href="index.html" style="text-decoration: none;color: white">
                <div class="header-content">
                    <img alt="logo" src="img/globe_puzzle_seo_internet_network_icon_261451.svg" height="30px" style="margin-right: 10px;"/>
                </div>
                <div class="header-content">
                    Юльчик
                </div>
            </a>
            </div>
            <div style = "float: inline-end;">
                <div class="header-content" style="font-size: small; text-align: right;" id="fifty1">
                    <i>"Я могу контролировать свои действия, слова, образ, но не ход мысли, к сожалению."</i><br>Пятьдесят оттенков серого (Э. Л. Джеймс)
                </div>
            </div>
        </div>
    `;
}