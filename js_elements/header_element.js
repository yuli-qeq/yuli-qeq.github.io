let headers = document.getElementsByClassName("header");
let filename = document.URL.split("/");
filename = filename[filename.length-1];
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
                ${(filename=='index.html' || filename=='')?
                    `
                <div class="header-content">
                    <a href="info_page.html">
                        <img alt="info" src="img/circle_customer_help_info_information_service_support_icon_123208.svg" style="display: none;" height="30px" id="info2"/>
                    </a>
                </div>
                 `:``
                }
            </div>
        </div>
    `;
}